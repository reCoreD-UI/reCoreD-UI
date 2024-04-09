package server

import (
	"errors"
	"net/http"
	"reCoreD-UI/models"

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
