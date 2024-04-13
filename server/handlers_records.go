package server

import (
	"fmt"
	"net/http"
	"reCoreD-UI/controllers"
	"reCoreD-UI/models"

	"github.com/gin-gonic/gin"
)

func validateRecord(r models.IRecord) error {

	switch r.GetType() {
	case models.RecordTypeA:
		record := &models.Record[models.ARecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeAAAA:
		record := &models.Record[models.AAAARecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeCNAME:
		record := &models.Record[models.CNAMERecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeCAA:
		record := &models.Record[models.CAARecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeMX:
		record := &models.Record[models.MXRecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeNS:
		record := &models.Record[models.NSRecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeSOA:
		record := &models.Record[models.SOARecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeSRV:
		record := &models.Record[models.SRVRecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	case models.RecordTypeTXT:
		record := &models.Record[models.TXTRecord]{}
		if err := record.FromEntity(r); err != nil {
			return err
		}
		return record.Content.Validate()
	default:
		return models.ErrInvalidType
	}
}

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

	if err := validateRecord(record); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Succeed: false,
			Message: err.Error(),
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

	if err := validateRecord(record); err != nil {
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
