package server

import (
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
)

func (s *Server) setupRoute() {
	username, password, err := s.controller.GetAdmin()
	if err != nil {
		logrus.Fatal(err)
	}

	server := s.webServer.Group(s.prefix)
	server.Group("/metrics", func(ctx *gin.Context) {
		if err := s.controller.RefreshMetrics(); err != nil {
			logrus.Error(err)
		}
		promhttp.Handler().ServeHTTP(ctx.Writer, ctx.Request)
	})

	apiHandler := gin.New()

	groupV1 := apiHandler.Group("/api", gin.BasicAuth(gin.Accounts{
		username: password,
	})).Group("/v1")

	domains := groupV1.Group("/domains")
	domains.
		GET("/", s.getDomains).
		POST("/", s.createDomain).
		PUT("/", s.updateDomain).
		DELETE("/:id", s.deleteDomain)

	records := groupV1.Group("/records")
	records.
		GET("/:domain", s.getRecords).
		POST("/:domain", s.createRecord).
		POST("/:domain/bulk", s.createRecords).
		PUT("/:domain", s.updateRecord).
		DELETE("/:domain/:id", s.deleteRecord)

	server.Use(func(ctx *gin.Context) {
		uri := ctx.Request.RequestURI
		logrus.Debug(uri)

		if strings.HasPrefix(uri, path.Join(s.prefix, uri)) {
			apiHandler.HandleContext(ctx)
		} else {
			staticFileHandler()(ctx)
		}
	})
}