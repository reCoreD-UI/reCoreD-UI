package models

import (
	"fmt"

	dns "github.com/cloud66-oss/coredns_mysql"
)

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

type Record struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	Zone       string `gorm:"not null,size:255" json:"zone"`
	Name       string `gorm:"not null,size:255" json:"name"`
	Ttl        int    `json:"ttl"`
	Content    any    `gorm:"serializer:json,type:\"text\"" json:"content"`
	RecordType string `gorm:"not null,size:255" json:"record_type"`
}

func (Record) TableName() string {
	return "coredns_record"
}

type RecordContentTypes interface {
	dns.ARecord | dns.AAAARecord | dns.CNAMERecord | dns.CAARecord | dns.NSRecord | dns.MXRecord | dns.SOARecord | dns.SRVRecord | dns.TXTRecord
}

type RecordWithType[T RecordContentTypes] struct {
	Record
	Content T `json:"content"`
}

func (r *RecordWithType[T]) ToRecord() *Record {
	r.Record.Content = r.Content
	return &r.Record
}

func (r *RecordWithType[T]) FromRecord(record *Record) error {
	r.Record = *record

	var ok bool
	if r.Content, ok = record.Content.(T); !ok {
		return fmt.Errorf("cannot convert record type")
	}
	return nil
}
