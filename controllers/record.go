package controllers

import (
	"fmt"
	"reCoreD-UI/database"
	"reCoreD-UI/models"
	"strconv"

	"gorm.io/gorm"
)

type recordsDAO struct {
	database.BaseDAO[models.Record]
}

func CreateRecord(r *models.Record) (*models.Record, error) {
	if r.RecordType != models.RecordTypeSOA {
		_, err := GetDomains(r.WithOutDotTail())
		if err != nil {
			return nil, err
		}
	}

	if err := r.CheckZone(); err != nil {
		return nil, err
	}

	res, err := (recordsDAO{}).Create(database.Client, *r)
	return &res, err
}

func CreateRecords(rs []*models.Record) error {
	tx := database.Client.Begin()
	for _, r := range rs {
		if err := r.CheckZone(); err != nil {
			tx.Rollback()
			return err
		}

		if _, err := (recordsDAO{}).Create(tx, *r); err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return nil
}

func GetRecords(cond models.Record) ([]models.Record, error) {
	return (recordsDAO{}).GetAll(database.Client, cond)
}

func UpdateRecord(r *models.Record) error {
	if err := r.CheckZone(); err != nil {
		return err
	}

	if _, err := (recordsDAO{}).Update(database.Client, *r); err != nil {
		return err
	}
	return nil
}

func DeleteRecord(domain, id string) error {
	ID, err := strconv.Atoi(id)
	if err != nil {
		return err
	}

	tx := database.Client.Begin()
	record, err := (recordsDAO{}).GetOne(tx, models.Record{ID: ID, Zone: fmt.Sprintf("%s.", domain)})
	if err != nil {
		tx.Rollback()
		return err
	}

	if record.RecordType == models.RecordTypeSOA {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}

	if err := (recordsDAO{}).Delete(tx, record); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

// for metrics
func getRecordCounts() (map[string]float64, error) {
	rows, err := (recordsDAO{}).GetAll(database.Client, models.Record{})
	if err != nil {
		return nil, err
	}

	result := make(map[string]float64)
	for _, row := range rows {
		result[row.Zone] += 1
	}
	return result, nil
}
