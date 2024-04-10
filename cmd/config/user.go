package config

import (
	"reCoreD-UI/controllers"
	"reCoreD-UI/database"

	"github.com/urfave/cli/v2"
	"github.com/urfave/cli/v2/altsrc"
)

var UserCommand = &cli.Command{
	Name:  "user",
	Usage: "set admin username and password",
	Flags: []cli.Flag{
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:    "username",
			Aliases: []string{"u"},
			Value:   "amdin",
			Usage:   "admin username",
			EnvVars: []string{"RECORED_ADMIN_USERNAME"},
		}),
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:     "passowrd",
			Aliases:  []string{"p"},
			Required: true,
			Usage:    "admin password",
			EnvVars:  []string{"RECORED_ADMIN_PASSWORD"},
		}),
	},
	Action: setUser,
}

func setUser(c *cli.Context) error {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return err
	}
	return controllers.SetupAdmin(c.String("username"), c.String("password"))
}
