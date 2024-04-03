package controllers

import "reCoreD-UI/models"

func (c *Controller) Migrate() error {
	return c.DB.Set("gorm:table_options", "CHARSET=utf8mb4").AutoMigrate(
		&models.Domain{},
		&models.Record{},
		&models.Settings{},
	)
}
