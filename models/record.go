package models

import (
	"encoding/json"
	"errors"
	"strings"

	dns "github.com/cloud66-oss/coredns_mysql"
)

var ErrorZoneNotEndWithDot = errors.New("zone should end with '.'")

const (
	RecordTypeA     = "A"
	RecordTypeAAAA  = "AAAA"
	RecordTypeCNAME = "CNAME"
	RecordTypeSOA   = "SOA"
	RecordTypeTXT   = "TXT"
	RecordTypeNS    = "NS"
	RecordTypeMX    = "MX"
	RecordTypeCAA   = "CAA"
	RecordTypeSRV   = "SRV"
)

type RecordContentDefault any

type recordContentTypes interface {
	dns.ARecord | dns.AAAARecord | dns.CNAMERecord | dns.CAARecord | dns.NSRecord | dns.MXRecord | dns.SOARecord | dns.SRVRecord | dns.TXTRecord | RecordContentDefault
}

type Record[T recordContentTypes] struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	Zone       string `gorm:"not null,size:255" json:"zone"`
	Name       string `gorm:"not null,size:255" json:"name"`
	Ttl        int    `json:"ttl"`
	Content    T      `gorm:"serializer:json,type:\"text\"" json:"content"`
	RecordType string `gorm:"not null,size:255" json:"record_type"`
}

func (Record[T]) TableName() string {
	return "coredns_record"
}

func (r Record[T]) CheckZone() error {
	if strings.HasSuffix(r.Zone, ".") {
		return ErrorZoneNotEndWithDot
	}
	return nil
}

func (r Record[T]) WithOutDotTail() string {
	return strings.TrimRight(r.Zone, ".")
}

func (r Record[T]) ToEntity() IRecord {
	return &r
}

func (r *Record[T]) FromEntity(entity any) error {
	b, err := json.Marshal(entity)
	if err != nil {
		return err
	}

	return json.Unmarshal(b, r)
}

func (r Record[T]) GetType() string {
	return r.RecordType
}

type IRecord interface {
	TableName() string
	CheckZone() error
	WithOutDotTail() string
	ToEntity() IRecord
	FromEntity(any) error
	GetType() string
}
