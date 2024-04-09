package server

import (
	"path"
	"reCoreD-UI/controllers"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
)

const (
	apiPrefix    = "/api"
	metricPrefix = "/metrics"
)

func (s *Server) setupRoute() {
	username, password, err := controllers.GetAdmin()
	if err != nil {
		logrus.Fatal(err)
	}

	metricHandler := gin.New()
	metricHandler.GET(metricPrefix, func(ctx *gin.Context) {
		if err := controllers.RefreshMetrics(); err != nil {
			logrus.Error(err)
		}
		promhttp.Handler().ServeHTTP(ctx.Writer, ctx.Request)
	})

	apiHandler := gin.New()

	groupV1 := apiHandler.Group(apiPrefix, gin.BasicAuth(gin.Accounts{
		username: password,
	})).Group("/v1")

	domains := groupV1.Group("/domains")
	domains.
		GET("/", getDomains).
		POST("/", createDomain).
		PUT("/", updateDomain).
		DELETE("/:id", deleteDomain)

	records := groupV1.Group("/records")
	records.
		GET("/:domain", getRecords).
		POST("/:domain", createRecord).
		POST("/:domain/bulk", createRecords).
		PUT("/:domain", updateRecord).
		DELETE("/:domain/:id", deleteRecord)

	server := s.webServer.Group(s.prefix)
	server.Use(func(ctx *gin.Context) {
		uri := ctx.Request.RequestURI
		logrus.Debug(uri)
		switch {
		case strings.HasPrefix(uri, path.Join(s.prefix, apiPrefix)):
			apiHandler.HandleContext(ctx)
		case strings.HasPrefix(uri, path.Join(s.prefix, metricPrefix)):
			metricHandler.HandleContext(ctx)
		default:
			staticFileHandler()(ctx)
		}
	})
}
