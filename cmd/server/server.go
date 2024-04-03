package server

import (
	webserver "reCoreD-UI/server"

	"github.com/urfave/cli/v2"
)

var Command *cli.Command

func init() {
	Command = &cli.Command{
		Name:  "server",
		Usage: "run server",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "prefix",
				Value: "/",
				Usage: "web prefix",
			},
			&cli.StringFlag{
				Name:  "listen",
				Value: "[::]",
				Usage: "IP for listen at",
			},
			&cli.IntFlag{
				Name:  "port",
				Value: 8080,
				Usage: "Port for listen at",
			},
		},
		Action: runServer,
	}
}

func runServer(c *cli.Context) error {
	server, err := webserver.NewServer(c)
	if err != nil {
		return err
	}
	return server.Run()
}
