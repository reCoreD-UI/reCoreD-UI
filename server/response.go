package server

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type Response struct {
	Succeed bool        `json:"succeed"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func errorHandler(c *gin.Context, err error) {
	logrus.Error(err)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, Response{
			Succeed: false,
			Message: err.Error(),
		})
	} else {
		c.JSON(http.StatusInternalServerError, Response{
			Succeed: false,
			Message: err.Error(),
			Data:    nil,
		})
	}
}
