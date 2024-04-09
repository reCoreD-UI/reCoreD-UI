package controllers

import (
	"reCoreD-UI/database"
	"reCoreD-UI/models"
	"strings"
)

const dnsSep = ","

type settingsDAO struct {
	database.BaseDAO[models.Settings]
}

func SetupDNS(dns ...string) error {
	settings := models.Settings{Key: models.SettingsKeyDNSServer, Value: strings.Join(dns, dnsSep)}

	if _, err := (settingsDAO{}).UpdateOrCreate(database.Client, settings); err != nil {
		return err
	}

	return nil
}

func GetDNS() ([]string, error) {
	settings, err := (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyDNSServer})
	if err != nil {
		return nil, err
	}

	return strings.Split(settings.Value, dnsSep), nil
}

func SetupAdmin(username, password string) error {
	settingUsername := models.Settings{
		Key:   models.SettingsKeyAdminUsername,
		Value: username,
	}
	settingPassword := models.Settings{
		Key:   models.SettingsKeyAdminPassword,
		Value: password,
	}

	tx := database.Client.Begin()
	if _, err := (settingsDAO{}).UpdateOrCreate(tx, settingUsername); err != nil {
		tx.Rollback()
		return err
	}

	if _, err := (settingsDAO{}).UpdateOrCreate(tx, settingPassword); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func GetAdmin() (string, string, error) {
	settings, err := (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyAdminUsername})
	if err != nil {
		return "", "", err
	}
	username := settings.Value

	settings, err = (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyAdminPassword})
	if err != nil {
		return "", "", err
	}
	password := settings.Value

	return username, password, nil
}
