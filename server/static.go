package server

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

//go:generate cp -r ../web/dist ./
//go:embed dist
var staticFiles embed.FS

func staticFileHandler() gin.HandlerFunc {
	sf, err := fs.Sub(staticFiles, "dist")
	if err != nil {
		logrus.Fatal("compile error: ", err)
	}

	fs := http.FileServer(http.FS(sf))

	return func(ctx *gin.Context) {
		defer ctx.Abort()
		filename := strings.TrimLeft(ctx.Request.RequestURI, "/")

		if filename == "" {
			filename = "index.html"
		}

		fs.ServeHTTP(ctx.Writer, ctx.Request)
	}
}
