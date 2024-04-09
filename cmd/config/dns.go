package config

import (
	"reCoreD-UI/controllers"
	"reCoreD-UI/database"

	"github.com/urfave/cli/v2"
)

var DNSCommand *cli.Command

func init() {
	DNSCommand = &cli.Command{
		Name:  "dns",
		Usage: "Config DNS Settings",
		Flags: []cli.Flag{
			&cli.StringSliceFlag{
				Name:     "servers",
				Usage:    "dns servers",
				Aliases:  []string{"s"},
				Required: true,
			},
		},
		Action: setDNS,
	}
}

func setDNS(c *cli.Context) error {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return err
	}

	return controllers.SetupDNS(c.StringSlice("servers")...)
}
