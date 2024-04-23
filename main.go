/*
reCoreD-UI provides web ui for CoreDNS

NAME:
reCoreD-UI - Web UI for CoreDNS

USAGE:

	reCoreD-UI [global options] command [command options]

COMMANDS:

	server   run server
	config   config some settings
	help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:

	--config value, -c value  config yaml file [$RECORED_CONFIG_FILE]
	--mysql-dsn value         mysql dsn [$RECORED_MYSQL_DSN]
	--debug                   enable debug mode (default: false)
	--help, -h                show help
*/
package main

import (
	"os"
	"reCoreD-UI/cmd/config"
	"reCoreD-UI/cmd/server"
	_ "reCoreD-UI/docs"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
	"github.com/urfave/cli/v2/altsrc"
)

// will be modified when building
var Version string = "v0.0.1"

func init() {
	logrus.SetReportCaller(true)
}

// @title						reCoreD-UI API
// @version						1.0
// @description					APIs for reCoreD-UI
// @BasePath					/api/v1
// @securityDefinitions.basic	BasicAuth
func main() {
	flags := []cli.Flag{
		&cli.StringFlag{
			Name:    "config",
			Usage:   "config yaml file",
			Aliases: []string{"c"},
			EnvVars: []string{"RECORED_CONFIG_FILE"},
		},
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:    "mysql-dsn",
			Usage:   "mysql dsn",
			EnvVars: []string{"RECORED_MYSQL_DSN"},
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
		Name:    "reCoreD-UI",
		Version: Version,
		Usage:   "Web UI for CoreDNS",
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
