package config

import (
	"reCoreD-UI/controllers"

	"github.com/urfave/cli/v2"
)

var DNSCommand *cli.Command

func init() {
	DNSCommand = &cli.Command{
		Name: "dns",
		Usage: "Config DNS Settings",
		Flags: []cli.Flag{
			&cli.StringSliceFlag{
				Name: "servers",
				Usage: "dns servers",
				Aliases: []string{"s"},
				Required: true,
			},
		},
		Action: setDNS,
	}
}

func setDNS(c *cli.Context) error {
	controller, err := controllers.NewController(c.String("mysql-dsn"))
	if err != nil {
		return err
	}
	defer controller.Close()

	return controller.SetupDNS(c.StringSlice("servers")...)
}
