package server

import (
	"net"
	"reCoreD-UI/database"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

type Server struct {
	webServer *gin.Engine
	listen    string
	prefix    string
	debug     bool
}

func NewServer(c *cli.Context) (*Server, error) {
	if err := database.Connect(c.String("mysql-dsn")); err != nil {
		return nil, err
	}
	if c.Bool("debug") {
		database.Client = database.Client.Debug()
	}

	return &Server{
		webServer: gin.New(),
		listen: net.JoinHostPort(
			c.String("listen"),
			c.String("port"),
		),
		prefix: c.String("prefix"),
		debug:  c.Bool("debug"),
	}, nil
}

func (s *Server) Run() error {
	logrus.Debug("server running")
	defer logrus.Debug("server exit")

	s.setupRoute()

	return s.webServer.Run(s.listen)
}
