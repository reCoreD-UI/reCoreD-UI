package controllers

import (
	"fmt"
	"reCoreD-UI/database"
	"reCoreD-UI/models"
	"strconv"

	dns "github.com/cloud66-oss/coredns_mysql"
)

type domainsDAO struct {
	database.BaseDAO[models.Domain]
}

func CreateDomain(d *models.Domain) (*models.Domain, error) {
	nss, err := GetDNS()
	if err != nil {
		return nil, err
	}

	tx := database.Client.Begin()
	if _, err := (domainsDAO{}).Create(tx, *d); err != nil {
		tx.Rollback()
		return nil, err
	}

	r := &models.RecordWithType[dns.SOARecord]{}
	r.Zone = d.WithDotEnd()
	r.Name = "@"
	r.RecordType = models.RecordTypeSOA
	r.Content.Ns = d.MainDNS
	r.Content.MBox = d.EmailSOAForamt()
	r.Content.Refresh = d.RefreshInterval
	r.Content.Retry = d.RetryInterval
	r.Content.Expire = d.ExpiryPeriod
	r.Content.MinTtl = d.NegativeTtl
	if err := r.CheckZone(); err != nil {
		tx.Rollback()
		return nil, err
	}

	if _, err := (recordsDAO{}).Create(tx, *r.ToRecord()); err != nil {
		tx.Rollback()
		return nil, err
	}

	for i, ns := range nss {
		record := &models.RecordWithType[dns.NSRecord]{}
		record.Zone = d.WithDotEnd()
		record.RecordType = models.RecordTypeNS
		record.Content.Host = ns
		record.Name = fmt.Sprintf("ns%d", i+1)

		if _, err := (recordsDAO{}).Create(tx, *record.ToRecord()); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	tx.Commit()
	return d, err
}

func GetDomains(domain string) ([]models.Domain, error) {
	if domain != "" {
		return (domainsDAO{}).GetAll(database.Client, models.Domain{DomainName: domain})
	} else {
		return (domainsDAO{}).GetAll(database.Client, models.Domain{})
	}
}

func UpdateDomain(d *models.Domain) error {
	tx := database.Client.Begin()
	if _, err := (domainsDAO{}).Update(tx, *d); err != nil {
		tx.Rollback()
		return err
	}

	soa, err := (recordsDAO{}).GetOne(tx, models.Record{
		RecordType: models.RecordTypeSOA, Zone: d.WithDotEnd(),
	})
	if err != nil {
		tx.Rollback()
		return err
	}

	r := &models.RecordWithType[dns.SOARecord]{}
	if err := r.FromRecord(&soa); err != nil {
		tx.Rollback()
		return err
	}

	r.Content.Ns = d.MainDNS
	r.Content.MBox = d.EmailSOAForamt()
	r.Content.Refresh = d.RefreshInterval
	r.Content.Retry = d.RetryInterval
	r.Content.Expire = d.ExpiryPeriod
	r.Content.MinTtl = d.NegativeTtl
	if err := r.CheckZone(); err != nil {
		tx.Rollback()
		return err
	}

	if _, err := (recordsDAO{}).Update(tx, *r.ToRecord()); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil

}

func DeleteDomain(id string) error {
	ID, err := strconv.Atoi(id)
	if err != nil {
		return err
	}

	tx := database.Client.Begin()
	domain, err := (domainsDAO{}).GetOne(tx, models.Domain{ID: ID})
	if err != nil {
		tx.Rollback()
		return err
	}

	if err := (domainsDAO{}).Delete(tx, models.Domain{ID: ID}); err != nil {
		tx.Rollback()
		return err
	}

	if err := (recordsDAO{}).Delete(tx, models.Record{Zone: domain.WithDotEnd()}); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

// for metrics
func getDomainCounts() (float64, error) {
	c, err := (domainsDAO{}).GetAll(database.Client, models.Domain{})
	if err != nil {
		return 0, err
	}
	return float64(len(c)), nil
}
