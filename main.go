package main

import (
	"os"
	"reCoreD-UI/cmd/config"
	"reCoreD-UI/cmd/server"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
	"github.com/urfave/cli/v2/altsrc"
)

func init() {
	logrus.SetReportCaller(true)
}

func main() {
	flags := []cli.Flag{
		&cli.StringFlag{
			Name:    "config",
			Usage:   "config yaml file",
			Aliases: []string{"c"},
			EnvVars: []string{"RECORED_CONFIG_FILE"},
		},
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:     "mysql-dsn",
			Usage:    "mysql dsn",
			EnvVars:  []string{"RECORED_MYSQL_DSN"},
		}),
		altsrc.NewBoolFlag(&cli.BoolFlag{
			Name:  "debug",
			Usage: "enable debug mode",
			Value: false,
			Action: func(ctx *cli.Context, b bool) error {
				if b {
					logrus.SetLevel(logrus.DebugLevel)
				}
				return nil
			},
		}),
	}

	app := &cli.App{
		Name:  "reCoreD-UI",
		Usage: "Web UI for CoreDNS",
		UseShortOptionHandling: true,
		Before: altsrc.InitInputSourceWithContext(
			flags, altsrc.NewYamlSourceFromFlagFunc("config"),
		),
		Flags: flags,
		Commands: []*cli.Command{
			server.Command,
			config.Command,
		},
	}

	if err := app.Run(os.Args); err != nil {
		logrus.Fatal(err)
	}
}
