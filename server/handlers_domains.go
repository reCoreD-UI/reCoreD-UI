package server

import (
	"net/http"
	"reCoreD-UI/controllers"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
)

// GetDomains
func getDomains(c *gin.Context) {
	domains, err := controllers.GetDomains("")
	if err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
		Data:    domains,
	})
}

func createDomain(c *gin.Context) {
	domain := &models.Domain{}

	if err := c.BindJSON(domain); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	domain, err := controllers.CreateDomain(domain)
	if err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
		Data:    domain,
	})
}

func updateDomain(c *gin.Context) {
	domain := &models.Domain{}

	if err := c.BindJSON(domain); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	if err := controllers.UpdateDomain(domain); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
	})
}

func deleteDomain(c *gin.Context) {
	id := c.Param("id")
	if err := controllers.DeleteDomain(id); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusNoContent, Response{
		Succeed: true,
	})
}
