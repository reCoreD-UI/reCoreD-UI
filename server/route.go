package server

import (
	"net/http"
	"path"
	"reCoreD-UI/controllers"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

const (
	apiPrefix     = "/api"
	metricPrefix  = "/metrics"
	swaggerPrefix = "/swagger"
)

func (s *Server) setupRoute() {
	username, password, err := controllers.GetAdmin()
	if err != nil {
		logrus.Fatal(err)
	}

	swaggerHandler := gin.New()
	swaggerHandler.GET(path.Join(swaggerPrefix, "*any"), ginSwagger.WrapHandler(swaggerfiles.Handler))

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
		case strings.HasPrefix(uri, path.Join(s.prefix, swaggerPrefix)):
			if s.debug {
				swaggerHandler.HandleContext(ctx)
			} else {
				ctx.HTML(http.StatusNotFound, "", nil)
			}
		default:
			staticFileHandler()(ctx)
		}
	})
}
