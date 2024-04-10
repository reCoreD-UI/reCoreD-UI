package server

import (
	webserver "reCoreD-UI/server"

	"github.com/urfave/cli/v2"
	"github.com/urfave/cli/v2/altsrc"
)

var Command = &cli.Command{
	Name:  "server",
	Usage: "run server",
	Flags: []cli.Flag{
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:  "prefix",
			Value: "/",
			Usage: "web prefix",
		}),
		altsrc.NewStringFlag(&cli.StringFlag{
			Name:  "listen",
			Value: "[::]",
			Usage: "IP for listen at",
		}),
		altsrc.NewIntFlag(&cli.IntFlag{
			Name:  "port",
			Value: 8080,
			Usage: "Port for listen at",
		}),
	},
	Action: runServer,
}

func runServer(c *cli.Context) error {
	server, err := webserver.NewServer(c)
	if err != nil {
		return err
	}
	return server.Run()
}
