package controllers

import (
	"fmt"
	"reCoreD-UI/models"

	"gorm.io/gorm"
)

func (c *Controller) CreateRecord(r *models.Record) (*models.Record, error) {
	if r.RecordType != models.RecordTypeSOA {
		domains, err := c.GetDomains(r.Zone)
		if err != nil {
			return nil, err
		}

		if len(domains) == 0 || domains[0].DomainName == r.Zone {
			return nil, fmt.Errorf("no such domain")
		}
	}

	if err := c.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Create(r).Error
	}); err != nil {
		return nil, err
	}

	return r, nil
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

func (c *Controller) GetRecords(cond map[string]string) ([]models.Record, error) {
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

func (c *Controller) DeleteRecord(domain, id string) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Where("record_type != ?", models.RecordTypeSOA).
			Where("id = ?", id).
			Where("zone = ?", domain).
			Delete(&models.Record{}).Error
	})
}

func (c *Controller) getRecordCounts() (map[string]float64, error) {
	rows, err := c.DB.Model(models.Record{}).Select("zone", "count(*) as count").Group("zone").Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]float64)
	for rows.Next() {
		var domain string
		var count int64
		if err := rows.Scan(&domain, &count); err != nil {
			return nil, err
		}
		result[domain] = float64(count)
	}

	return result, nil
}
