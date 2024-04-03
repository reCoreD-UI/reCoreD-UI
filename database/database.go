package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Connect(DSN string) (*gorm.DB, error) {
	return gorm.Open(mysql.Open(DSN), &gorm.Config{})
}
