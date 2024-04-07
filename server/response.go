package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type Response struct {
	Succeed bool        `json:"succeed"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func errorHandler(c *gin.Context, err error) {
	logrus.Error(err)
	c.JSON(http.StatusInternalServerError, Response{
		Succeed: false,
		Message: err.Error(),
		Data:    nil,
	})
}
