package controllers

import (
	"reCoreD-UI/database"
	"reCoreD-UI/models"
)

func Migrate() error {
	if err := (domainsDAO{}).Migrate(database.Client, models.Domain{}); err != nil {
		return err
	}

	var recordDefiniation models.IRecord = &models.Record[models.RecordContentDefault]{}
	if err := (recordsDAO{}).Migrate(database.Client, recordDefiniation); err != nil {
		return err
	}

	if err := (settingsDAO{}).Migrate(database.Client, models.Settings{}); err != nil {
		return err
	}

	return nil
}
