package controllers

import (
	"reCoreD-UI/models"
	"strings"

	"gorm.io/gorm"
)

const dnsSep = ","

func (c *Controller) SetupDNS(dns ...string) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		settings := &models.Settings{}

		return tx.Where(&models.Settings{Key: models.SettingsKeyDNSServer}).
			Attrs(&models.Settings{Value: strings.Join(dns, dnsSep)}).
			FirstOrCreate(&settings).Error
	})
}

func (c *Controller) GetDNS() ([]string, error) {
	settings := &models.Settings{}
	if err := c.DB.Where(&models.Settings{Key: models.SettingsKeyDNSServer}).Find(&settings).Error; err != nil {
		return nil, err
	}

	return strings.Split(settings.Value, dnsSep), nil
}
