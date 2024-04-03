package server

import (
	"net/http"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func (s *Server) getDomains(c *gin.Context) {
	domains, err := s.controller.GetDomains("")
	if err != nil {
		logrus.Error(err)
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
		Data:    domains,
	})
}

func (s *Server) createDomain(c *gin.Context) {
	domain := &models.Domain{}

	if err := c.BindJSON(domain); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	if err := s.controller.CreateDomain(domain); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
	})
}

func (s *Server) updateDomain(c *gin.Context) {
	domain := &models.Domain{}

	if err := c.BindJSON(domain); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	if err := s.controller.UpdateDomain(domain); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
	})
}

func (s *Server) deleteDomain(c *gin.Context) {
	id := c.Param("id")
	if err := s.controller.DeleteDomain(id); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusNoContent, Response{
		Succeed: true,
	})
}
