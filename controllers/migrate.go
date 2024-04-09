package controllers

import (
	"reCoreD-UI/database"
	"reCoreD-UI/models"
)

func Migrate() error {
	if err := (domainsDAO{}).Migrate(database.Client, models.Domain{}); err != nil {
		return err
	}

	if err := (recordsDAO{}).Migrate(database.Client, models.Record{}); err != nil {
		return err
	}

	if err := (settingsDAO{}).Migrate(database.Client, models.Settings{}); err != nil {
		return err
	}

	return nil
}
