package models

import (
	"encoding/json"
	"errors"
	"strings"
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

type recordContentTypes interface {
	ARecord | AAAARecord | CNAMERecord | CAARecord | NSRecord | MXRecord | SOARecord | SRVRecord | TXTRecord | RecordContentDefault
}

// Record dns records for coredns mysql plugin
type Record[T recordContentTypes] struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Zone string `gorm:"not null;size:255" json:"zone"`
	Name string `gorm:"not null;size:255" json:"name"`
	Ttl  int    `json:"ttl"`
	// see https://github.com/cloud66-oss/coredns_mysql/blob/main/types.go for content
	Content    T      `gorm:"serializer:json;type:text" json:"content"`
	RecordType string `gorm:"not null;size:255" json:"record_type"`
}

func (*Record[T]) TableName() string {
	return "coredns_records"
}

func (r *Record[T]) CheckZone() error {
	if !strings.HasSuffix(r.Zone, ".") {
		return ErrorZoneNotEndWithDot
	}
	return nil
}

func (r *Record[T]) WithOutDotTail() string {
	return strings.TrimRight(r.Zone, ".")
}

func (r *Record[T]) ToEntity() IRecord {
	return r
}

func (r *Record[T]) FromEntity(entity any) error {
	b, err := json.Marshal(entity)
	if err != nil {
		return err
	}

	return json.Unmarshal(b, r)
}

func (r *Record[T]) GetType() string {
	return r.RecordType
}

func (r *Record[T]) GetValue() IRecord {
	return r.ToEntity()
}

type IRecord interface {
	TableName() string
	CheckZone() error
	WithOutDotTail() string
	ToEntity() IRecord
	FromEntity(any) error
	GetType() string
	GetValue() IRecord
}
