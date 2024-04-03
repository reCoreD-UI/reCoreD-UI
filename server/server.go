package server

import (
	"net"
	"reCoreD-UI/controllers"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

type Server struct {
	controller *controllers.Controller
	webServer  *gin.Engine
	listen     string
	prefix     string
}

func NewServer(c *cli.Context) (*Server, error) {
	controller, err := controllers.NewController(c.String("mysql-dsn"))
	if err != nil {
		return nil, err
	}

	return &Server{
		controller: controller,
		webServer:  gin.New(),
		listen: net.JoinHostPort(
			c.String("listen"),
			c.String("port"),
		),
		prefix: c.String("prefix"),
	}, nil
}

func (s *Server) Run() error {
	logrus.Debug("server running")
	defer logrus.Debug("server exit")

	s.setupRoute()

	return s.webServer.Run(s.listen)
}
