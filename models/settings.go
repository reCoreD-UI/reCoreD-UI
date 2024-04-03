package models

import "gorm.io/gorm"

const (
	SettingsKeyAdminUsername = "admin.username"
	SettingsKeyAdminPassword = "admin.password"
	SettingsKeyDNSServer     = "dns.servers"
)

type Settings struct {
	gorm.Model
	Key   string `gorm:"unique,not null,size:255"`
	Value string `gorm:"not null,size:255"`
}
