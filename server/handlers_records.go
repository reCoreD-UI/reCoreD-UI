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

// GetRecords godoc
//
//	@Router			/records/{domain} [get]
//	@Summary		List all records of a domain
//	@Description	List all records of a domain
//	@Tags			records
//	@Product		json
//	@Param			domain	path	string	true	"domain"
//	@Success		200	{object}	Response{data=[]models.Record[models.RecordContentDefault]}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// CreateRecord godoc
//
//	@Router			/records/{domain} [post]
//	@Summary		Create a record of a domain
//	@Description	Create a record of a domain
//	@Tags			records
//	@Accept			json
//	@Product		json
//	@Param			domain	path	string	true	"domain"
//	@Param			object	body	models.Record[models.RecordContentDefault]	true	"content"
//	@Success		201	{object}	Response{data=models.Record[models.RecordContentDefault]}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// CreateRecords godoc
//
//	@Router			/records/{domain}/bulk [post]
//	@Summary		Create some records of a domain
//	@Description	Create some records of a domain
//	@Tags			records
//	@Accept			json
//	@Product		json
//	@Param			domain	path	string	true	"domain"
//	@Param			object	body	[]models.Record[models.RecordContentDefault]	true	"content"
//	@Success		201	{object}	Response{data=models.Record[models.RecordContentDefault]}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// UpdateRecord godoc
//
//	@Router			/records/{domain} [put]
//	@Summary		Update a record of a domain
//	@Description	Update a record of a domain
//	@Tags			records
//	@Accept			json
//	@Product		json
//	@Param			domain	path	string	true	"domain"
//	@Param			object	body	models.Record[models.RecordContentDefault]	true	"content"
//	@Success		200	{object}	Response{data=models.Record[models.RecordContentDefault]}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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

// DeleteRecord godoc
//
//	@Router			/records/{domain}/{id} [delete]
//	@Summary		Delete a record of a domain
//	@Description	Delete a record of a domain, except SOA record.
//	@Tags			records
//	@Product		json
//	@Param			domain	path	string	true	"domain"
//	@Param			id	path	int	true	"Record ID"
//	@Success		204	{object}	Response{data=nil}
//	@Failure		400	{object}	Response{data=nil}
//	@Failure		401	{object}	Response{data=nil}
//	@Failure		404	{object}	Response{data=nil}
//	@Failure		500	{object}	Response{data=nil}
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
