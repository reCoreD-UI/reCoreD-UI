package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Succeed bool        `json:"succeed"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func errorHandler(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, Response{
		Succeed: false,
		Message: err.Error(),
		Data:    nil,
	})
}
