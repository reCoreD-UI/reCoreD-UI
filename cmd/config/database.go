package config

import (
	"reCoreD-UI/controllers"
	"reCoreD-UI/database"

	"github.com/urfave/cli/v2"
)

var DatabaseCommand *cli.Command

func init() {
	migrationCommand := &cli.Command{
		Name:   "migrate",
		Usage:  "migrate database",
		Action: migrateDatabase,
	}

	DatabaseCommand = &cli.Command{
		Name:    "database",
		Usage:   "database administration",
		Aliases: []string{"db"},
		Subcommands: []*cli.Command{
			migrationCommand,
		},
	}
}

func migrateDatabase(c *cli.Context) error {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return err
	}

	return controllers.Migrate()
}
