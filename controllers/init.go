package controllers

import (
	"reCoreD-UI/database"

	"gorm.io/gorm"
)

type Controller struct {
	DB *gorm.DB
}

func NewController(DSN string) (*Controller, error) {
	db, err := database.Connect(DSN)
	return &Controller{
		DB: db,
	}, err
}

func (c *Controller) Close() error {
	d, err := c.DB.DB()
	if err != nil {
		return err
	}

	return d.Close()
}
