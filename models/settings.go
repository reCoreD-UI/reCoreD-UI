package models

import (
	"fmt"
)

const (
	SettingsKeyAdminUsername = "admin.username"
	SettingsKeyAdminPassword = "admin.password"
	SettingsKeyDNSServer     = "dns.servers"
)

// Settings settings for this app
type Settings struct {
	ID    uint   `gorm:"primaryKey"`
	Key   string `gorm:"unique;not null;size:255"`
	Value string `gorm:"not null;size:255"`
}

func (s *Settings) String() string {
	return fmt.Sprintf("%s: %s", s.Key, s.Value)
}

func (s *Settings) GetValue() Settings {
	return *s
}

type ISettings interface {
	String() string
	GetValue() Settings
}
