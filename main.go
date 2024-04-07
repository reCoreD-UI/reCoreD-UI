package main

import (
	"os"

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
			Value:   "config.yaml",
			EnvVars: []string{"RECORED_CONFIG_FILE"},
		},
		altsrc.NewStringSliceFlag(&cli.StringSliceFlag{}),
		&cli.StringFlag{
			Name:     "mysql-dsn",
			Usage:    "mysql dsn",
			Required: true,
			EnvVars: []string{"RECORED_MYSQL_DSN"},
		},
		&cli.BoolFlag{
			Name:  "debug",
			Usage: "enable debug mode",
			Value: false,
			Action: func(ctx *cli.Context, b bool) error {
				if b {
					logrus.SetLevel(logrus.DebugLevel)
				}
				return nil
			},
		},
	}

	app := &cli.App{
		Name:  "reCoreD-UI",
		Usage: "Web UI for CoreDNS",
		Before: altsrc.InitInputSourceWithContext(
			flags, altsrc.NewYamlSourceFromFlagFunc("config"),
		),
		Flags: flags,
	}

	if err := app.Run(os.Args); err != nil {
		logrus.Fatal(err)
	}
}
