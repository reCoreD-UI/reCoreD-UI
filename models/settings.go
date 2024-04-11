package models

import (
	"fmt"

	"gorm.io/gorm"
)

const (
	SettingsKeyAdminUsername = "admin.username"
	SettingsKeyAdminPassword = "admin.password"
	SettingsKeyDNSServer     = "dns.servers"
)

type Settings struct {
	gorm.Model
	Key   string `gorm:"unique;not null;size:255"`
	Value string `gorm:"not null;size:255"`
}

func (s Settings) String() string {
	return fmt.Sprintf("%s: %s", s.Key, s.Value)
}

type ISettings interface {
	String() string
}
