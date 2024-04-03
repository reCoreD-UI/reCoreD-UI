package controllers

import (
	"fmt"
	"reCoreD-UI/models"

	dns "github.com/cloud66-oss/coredns_mysql"

	"gorm.io/gorm"
)

func (c *Controller) SetupNSRecord(domain *models.Domain) error {
	nss, err := c.GetDNS()
	if err != nil {
		return err
	}

	return c.DB.Transaction(func(tx *gorm.DB) error {
		for i, ns := range nss {
			record := &models.RecordWithType[dns.NSRecord]{}
			record.Zone = domain.DomainName
			record.RecordType = models.RecordTypeNS
			record.Content.Host = ns
			record.Name = fmt.Sprintf("ns%d", i+1)

			if err := tx.Create(record.ToRecord()).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (c *Controller) CreateRecord(r *models.Record) error {
	if r.RecordType != models.RecordTypeSOA {
		domains, err := c.GetDomains(r.Zone)
		if err != nil {
			return err
		}

		if len(domains) == 0 || domains[0].DomainName == r.Zone {
			return fmt.Errorf("no such domain")
		}
	}

	return c.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Create(r).Error
	})
}

func (c *Controller) CreateRecords(rs []*models.Record) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		for _, r := range rs {
			if err := tx.Create(r).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (c *Controller) GetRecords(cond map[string]any) ([]models.Record, error) {
	var records []models.Record

	if err := c.DB.Where(cond).Find(&records).Error; err != nil {
		return nil, err
	}

	return records, nil
}

func (c *Controller) UpdateRecord(r *models.Record) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Model(r).Updates(r).Error
	})
}

func (c *Controller) DeleteRecord(id string) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Where("record_type != ?", models.RecordTypeSOA).Where("id = ?", id).Delete(&models.Record{}).Error
	})
}
