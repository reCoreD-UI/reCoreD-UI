package config

import (
	"reCoreD-UI/controllers"
	"reCoreD-UI/database"

	"github.com/urfave/cli/v2"
)

var UserCommand *cli.Command

func init() {
	UserCommand = &cli.Command{
		Name:  "user",
		Usage: "set admin username and password",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "username",
				Aliases: []string{"u"},
				Value:   "amdin",
				Usage:   "admin username",
				EnvVars: []string{"RECORED_ADMIN_USERNAME"},
			},
			&cli.StringFlag{
				Name:     "passowrd",
				Aliases:  []string{"p"},
				Required: true,
				Usage:    "admin password",
				EnvVars:  []string{"RECORED_ADMIN_PASSWORD"},
			},
		},
		Action: setUser,
	}
}

func setUser(c *cli.Context) error {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return err
	}
	return controllers.SetupAdmin(c.String("username"), c.String("password"))
}
