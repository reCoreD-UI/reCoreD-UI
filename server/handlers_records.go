package server

import (
	"net/http"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
)

func (s *Server) getRecords(c *gin.Context) {
	query := make(map[string]string)
	if err := c.BindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}
	domain := c.Param("domain")
	query["zone"] = domain

	records, err := s.controller.GetRecords(query)
	if err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
		Data:    records,
	})
}

func (s *Server) createRecord(c *gin.Context) {
	record := &models.Record{}
	if err := c.BindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	domain := c.Param("domain")
	if domain != record.Zone {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: "request body doesn't match URI",
		})
		return
	}

	if err := s.controller.CreateRecord(record); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
	})
}

func (s *Server) createRecords(c *gin.Context) {
	var records []*models.Record
	if err := c.BindJSON(&records); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	if err := s.controller.CreateRecords(records); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
	})
}

func (s *Server) updateRecord(c *gin.Context) {
	record := &models.Record{}
	if err := c.BindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	domain := c.Param("domain")
	if domain != record.Zone {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: "request body doesn't match URI",
		})
		return
	}

	if err := s.controller.UpdateRecord(record); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
	})
}

func (s *Server) deleteRecord(c *gin.Context) {
	domain := c.Param("domain")
	id := c.Param("id")

	if err := s.controller.DeleteRecord(domain, id); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusNoContent, Response{
		Succeed: true,
	})
}
