package server

import (
	"net/http"
	"reCoreD-UI/controllers"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"

	_ "reCoreD-UI/docs"
)

// GetDomains godoc
//
//	@Router			/domains/ [get]
//	@Summary		List all domains
//	@Description	List all domains
//	@Tags			domains
//	@Accept			json
//	@Product		json
//	@Success		200	{object}	Response{data=[]models.Domain}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// CreateDomain godoc
//
//	@Router			/domains/ [post]
//	@Summary		Create a domain
//	@Description	Create a domain
//	@Tags			domains
//	@Product		json
//	@Param			object	body	models.Domain	true	"content"
//	@Success		201	{object}	Response{data=models.Domain}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// UpdateDomain godoc
//
//	@Router			/domains/ [put]
//	@Summary		Update a domain
//	@Description	Update a domain
//	@Tags			domains
//	@Accept			json
//	@Product		json
//	@Param			object	body	models.Domain	true	"content"
//	@Success		200	{object}	Response{data=models.Domain}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// DeleteDomain godoc
//
//	@Router			/domains/{id} [delete]
//	@Summary		Delete a domain
//	@Description	Delete a domain
//	@Tags			domains
//	@Product		json
//	@Param			id	path		int	true	"Domain ID"
//	@Success		204	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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
