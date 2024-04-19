package server

import (
	"errors"
	"net/http"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// Response common http response
type Response struct {
	// `true` for 2xx, else `false`
	Succeed bool `json:"succeed"`

	// error message
	Message string `json:"message"`

	// payload here
	Data interface{} `json:"data"`
}

func errorHandler(c *gin.Context, err error) {
	logrus.Error(err)
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		c.JSON(http.StatusNotFound, Response{
			Succeed: false,
			Message: err.Error(),
		})
	case errors.Is(err, models.ErrorZoneNotEndWithDot):
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
	default:
		c.JSON(http.StatusInternalServerError, Response{
			Succeed: false,
			Message: err.Error(),
		})
	}
}
