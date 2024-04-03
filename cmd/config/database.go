package config

import (
	"reCoreD-UI/controllers"

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
	controller, err := controllers.NewController(c.String("mysql-dsn"))
	if err != nil {
		return err
	}
	defer controller.Close()

	return controller.Migrate()
}
