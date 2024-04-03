package controllers

import (
	"reCoreD-UI/models"

	"gorm.io/gorm"
)

func (c *Controller) SetupAdmin(username, password string) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		settings := &models.Settings{}

		if err := tx.Where(&models.Settings{Key: models.SettingsKeyAdminUsername}).
			Attrs(&models.Settings{Value: username}).
			FirstOrCreate(settings).Error; err != nil {
			return err
		}

		if err := tx.Where(&models.Settings{Key: models.SettingsKeyAdminPassword}).
			Attrs(&models.Settings{Value: password}).
			FirstOrCreate(settings).Error; err != nil {
			return err
		}
		return nil
	})
}

func (c *Controller) GetAdmin() (string, string, error) {
	settings := &models.Settings{}
	if err := c.DB.Where(&models.Settings{Key: models.SettingsKeyAdminUsername}).First(settings).Error; err != nil {
		return "", "", err
	}
	username := settings.Value

	if err := c.DB.Where(&models.Settings{Key: models.SettingsKeyAdminPassword}).First(settings).Error; err != nil {
		return "", "", err
	}
	password := settings.Value

	return username, password, nil
}
