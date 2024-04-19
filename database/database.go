package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Client *gorm.DB

func Connect(DSN string) error {
	var err error
	Client, err = gorm.Open(mysql.Open(DSN), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		return err
	}
	return nil
}
