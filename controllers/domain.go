package controllers

import (
	"fmt"
	"reCoreD-UI/database"
	"reCoreD-UI/models"
	"strconv"

	"github.com/sirupsen/logrus"
)

type domainsDAO struct {
	database.BaseDAO[models.IDomain]
}

func CreateDomain(d *models.Domain) (*models.Domain, error) {
	nss, err := GetDNS()
	if err != nil {
		return nil, err
	}

	tx := database.Client.Begin()
	if _, err := (domainsDAO{}).Create(tx, d); err != nil {
		tx.Rollback()
		return nil, err
	}

	r := &models.Record[models.SOARecord]{}
	r.Zone = d.WithDotEnd()
	r.Name = "@"
	r.RecordType = models.RecordTypeSOA
	r.Content = d.GenerateSOA()
	logrus.Debug(r)
	if err := r.CheckZone(); err != nil {
		tx.Rollback()
		return nil, err
	}

	if _, err := (recordsDAO{}).Create(tx, r); err != nil {
		tx.Rollback()
		return nil, err
	}

	for i, ns := range nss {
		record := &models.Record[models.NSRecord]{
			Zone:       d.WithDotEnd(),
			RecordType: models.RecordTypeNS,
			Name:       fmt.Sprintf("ns%d", i+1),
		}
		record.Content.Host = ns

		if _, err := (recordsDAO{}).Create(tx, record); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	return d, tx.Commit().Error
}

func GetDomains(domain string) ([]models.Domain, error) {
	if domain != "" {
		r, err := (domainsDAO{}).GetAll(database.Client, &models.Domain{DomainName: domain})
		n := make([]models.Domain, 0)
		for _, e := range r {
			i, ok := e.(*models.Domain)
			if !ok {
				continue
			}
			n = append(n, *i)
		}
		return n, err
	} else {
		r, err := (domainsDAO{}).GetAll(database.Client, &models.Domain{})
		n := make([]models.Domain, 0)
		for _, e := range r {
			i, ok := e.(*models.Domain)
			if !ok {
				continue
			}
			n = append(n, *i)
		}
		return n, err
	}
}

func UpdateDomain(d *models.Domain) error {
	tx := database.Client.Begin()
	logrus.Debug(d)
	if _, err := (domainsDAO{}).Update(tx, d); err != nil {
		tx.Rollback()
		return err
	}

	soa, err := (recordsDAO{}).GetOne(tx, &models.Record[models.RecordContentDefault]{
		RecordType: models.RecordTypeSOA, Zone: d.WithDotEnd(),
	})
	if err != nil {
		tx.Rollback()
		return err
	}

	r := &models.Record[models.SOARecord]{}
	if err := r.FromEntity(soa); err != nil {
		tx.Rollback()
		return err
	}

	r.Content = d.GenerateSOA()
	if err := r.CheckZone(); err != nil {
		tx.Rollback()
		return err
	}

	if _, err := (recordsDAO{}).Update(tx, r); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func DeleteDomain(id string) error {
	ID, err := strconv.Atoi(id)
	if err != nil {
		return err
	}

	tx := database.Client.Begin()
	domain, err := (domainsDAO{}).GetOne(tx, &models.Domain{ID: uint(ID)})
	if err != nil {
		tx.Rollback()
		return err
	}

	if err := (domainsDAO{}).Delete(tx, &models.Domain{ID: uint(ID)}); err != nil {
		tx.Rollback()
		return err
	}

	if err := (recordsDAO{}).Delete(tx, &models.Record[models.RecordContentDefault]{Zone: domain.WithDotEnd()}); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// for metrics
func getDomainCounts() (float64, error) {
	c, err := (domainsDAO{}).GetAll(database.Client, &models.Domain{})
	if err != nil {
		return 0, err
	}
	return float64(len(c)), nil
}
