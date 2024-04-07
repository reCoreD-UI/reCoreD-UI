package controllers

import (
	"fmt"
	"reCoreD-UI/models"
	"strconv"

	dns "github.com/cloud66-oss/coredns_mysql"

	"gorm.io/gorm"
)

func (c *Controller) CreateDomain(d *models.Domain) (*models.Domain, error) {
	nss, err := c.GetDNS()
	if err != nil {
		return nil, err
	}

	if err := c.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(d).Error; err != nil {
			return err
		}

		r := &models.RecordWithType[dns.SOARecord]{}
		r.Zone = d.DomainName
		r.Name = "@"
		r.RecordType = models.RecordTypeSOA
		r.Content.Ns = d.MainDNS
		r.Content.MBox = d.EmailSOAForamt()
		r.Content.Refresh = d.RefreshInterval
		r.Content.Retry = d.RetryInterval
		r.Content.Expire = d.ExpiryPeriod
		r.Content.MinTtl = d.NegativeTtl

		if err := tx.Create(r.ToRecord()).Error; err != nil {
			return err
		}

		for i, ns := range nss {
			record := &models.RecordWithType[dns.NSRecord]{}
			record.Zone = d.DomainName
			record.RecordType = models.RecordTypeNS
			record.Content.Host = ns
			record.Name = fmt.Sprintf("ns%d", i+1)

			if err := tx.Create(record.ToRecord()).Error; err != nil {
				return err
			}
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return d, err
}

func (c *Controller) GetDomains(domain string) ([]models.Domain, error) {
	var domains []models.Domain

	tx := c.DB

	if domain != "" {
		tx = tx.Where(&models.Domain{DomainName: domain})
	}

	if err := tx.Find(&domains).Error; err != nil {
		return nil, err
	}

	return domains, nil
}

func (c *Controller) UpdateDomain(d *models.Domain) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(d).Updates(d).Error; err != nil {
			return err
		}

		record := &models.Record{}
		if err := tx.Where("record_type = ?", models.RecordTypeSOA).Where("zone = ?", d.DomainName).First(record).Error; err != nil {
			return err
		}

		r := &models.RecordWithType[dns.SOARecord]{}
		if err := r.FromRecord(record); err != nil {
			return err
		}

		r.Content.Ns = d.MainDNS
		r.Content.MBox = d.EmailSOAForamt()
		r.Content.Refresh = d.RefreshInterval
		r.Content.Retry = d.RetryInterval
		r.Content.Expire = d.ExpiryPeriod
		r.Content.MinTtl = d.NegativeTtl

		if err := tx.Where("record_type = ?", models.RecordTypeSOA).Where("zone = ?", d.DomainName).Save(r.ToRecord()).Error; err != nil {
			return err
		}

		return nil
	})
}

func (c *Controller) DeleteDomain(id string) error {
	ID, err := strconv.Atoi(id)
	if err != nil {
		return err
	}

	return c.DB.Transaction(func(tx *gorm.DB) error {
		domain := &models.Domain{
			ID: ID,
		}
		if err := tx.First(&domain).Error; err != nil {
			return err
		}

		if err := tx.Where("zone = ?", domain.DomainName).Delete(&models.Record{}).Error; err != nil {
			return err
		}

		if err := tx.Delete(&domain).Error; err != nil {
			return err
		}

		return nil
	})
}

func (c *Controller) getDomainCounts() (float64, error) {
	var count int64
	if err := c.DB.Model(models.Domain{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return float64(count), nil
}
