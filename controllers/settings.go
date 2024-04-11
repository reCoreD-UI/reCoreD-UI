package controllers

import (
	"reCoreD-UI/database"
	"reCoreD-UI/models"
	"strings"

	"github.com/sirupsen/logrus"
)

const dnsSep = ","

type settingsDAO struct {
	database.BaseDAO[models.ISettings]
}

func SetupDNS(dns ...string) error {
	settings := models.Settings{Key: models.SettingsKeyDNSServer, Value: strings.Join(dns, dnsSep)}

	if _, err := (settingsDAO{}).UpdateOrCreate(database.Client, &settings, models.Settings{Key: models.SettingsKeyDNSServer}); err != nil {
		return err
	}

	return nil
}

func GetDNS() ([]string, error) {
	settings, err := (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyDNSServer})
	if err != nil {
		return nil, err
	}

	return strings.Split(settings.(models.Settings).Value, dnsSep), nil
}

func SetupAdmin(username, password string) error {
	logrus.Debugf("got %s:%s", username, password)

	settingUsername := models.Settings{
		Key:   models.SettingsKeyAdminUsername,
		Value: username,
	}
	settingPassword := models.Settings{
		Key:   models.SettingsKeyAdminPassword,
		Value: password,
	}

	tx := database.Client.Begin()
	if _, err := (settingsDAO{}).UpdateOrCreate(tx, &settingUsername, models.Settings{Key: models.SettingsKeyAdminUsername}); err != nil {
		tx.Rollback()
		return err
	}

	if _, err := (settingsDAO{}).UpdateOrCreate(tx, &settingPassword, models.Settings{Key: models.SettingsKeyAdminPassword}); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func GetAdmin() (string, string, error) {
	settings, err := (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyAdminUsername})
	if err != nil {
		return "", "", err
	}
	username := settings.(models.Settings).Value

	settings, err = (settingsDAO{}).GetOne(database.Client, models.Settings{Key: models.SettingsKeyAdminPassword})
	if err != nil {
		return "", "", err
	}
	password := settings.(models.Settings).Value

	return username, password, nil
}
