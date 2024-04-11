package config

import (
	"reCoreD-UI/controllers"
	"reCoreD-UI/database"

	"github.com/urfave/cli/v2"
)

var migrationCommand = &cli.Command{
	Name:   "migrate",
	Usage:  "migrate database",
	Action: migrateDatabase,
}

var DatabaseCommand = &cli.Command{
	Name:    "database",
	Usage:   "database administration",
	Aliases: []string{"db"},
	Subcommands: []*cli.Command{
		migrationCommand,
	},
}

func migrateDatabase(c *cli.Context) error {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return err
	}
	if c.Bool("debug") {
		database.Client = database.Client.Debug()
	}
	return controllers.Migrate()
}
