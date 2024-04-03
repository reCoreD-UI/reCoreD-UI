package config

import "github.com/urfave/cli/v2"

var Command *cli.Command

func init() {
	Command = &cli.Command{
		Name:  "config",
		Usage: "config some settings",
		Subcommands: []*cli.Command{
			UserCommand,
			DatabaseCommand,
			DNSCommand,
		},
	}
}
