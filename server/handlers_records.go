package server

import (
	"fmt"
	"net/http"
	"reCoreD-UI/controllers"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
)

func getRecords(c *gin.Context) {
	query := &models.Record[models.RecordContentDefault]{Content: make(models.RecordContentDefault)}
	if err := c.BindQuery(query); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}
	domain := c.Param("domain")
	query.Zone = fmt.Sprintf("%s.", domain)

	records, err := controllers.GetRecords(query)
	if err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
		Data:    records,
	})
}

func createRecord(c *gin.Context) {
	record := &models.Record[models.RecordContentDefault]{Content: make(models.RecordContentDefault)}
	if err := c.BindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	domain := c.Param("domain")
	if domain != record.WithOutDotTail() {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: "request body doesn't match URI",
		})
		return
	}

	irecord, err := controllers.CreateRecord(record)
	if err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
		Data:    irecord,
	})
}

func createRecords(c *gin.Context) {
	var records []models.Record[models.RecordContentDefault]
	if err := c.BindJSON(&records); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
		})
		return
	}

	var iRecords []models.IRecord
	for _, v := range records {
		iRecords = append(iRecords, &v)
	}

	if err := controllers.CreateRecords(iRecords); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusCreated, Response{
		Succeed: true,
	})
}

func updateRecord(c *gin.Context) {
	record := &models.Record[models.RecordContentDefault]{Content: make(models.RecordContentDefault)}
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

	if err := controllers.UpdateRecord(record); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusOK, Response{
		Succeed: true,
	})
}

func deleteRecord(c *gin.Context) {
	domain := c.Param("domain")
	id := c.Param("id")

	if err := controllers.DeleteRecord(domain, id); err != nil {
		errorHandler(c, err)
		return
	}

	c.JSON(http.StatusNoContent, Response{
		Succeed: true,
	})
}
