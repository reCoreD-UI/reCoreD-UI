package models

import (
	"errors"
	"regexp"
	"strings"

	dns "github.com/cloud66-oss/coredns_mysql"
)

var (
	ErrInvalidIPv4    = errors.New("not a valid ipv4 address")
	ErrInvalidIPv6    = errors.New("not a valid ipv6 address")
	ErrEmptyTXT       = errors.New("txt record should not empty")
	ErrNoDotSuffix    = errors.New("should end with dot")
	ErrBadEmailFormat = errors.New("email here should have no '@'")
	ErrBadCAATag      = errors.New("caa tag should not empty")
	ErrBadCAAValue    = errors.New("caa value should not empty")
	ErrInvalidType    = errors.New("invalid type")
)

type ARecord struct {
	dns.ARecord
}

func (r ARecord) Validate() error {
	ok := regexp.MustCompile("^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])[.]){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$").MatchString(r.Ip.String())
	if !ok {
		return ErrInvalidIPv4
	}
	return nil
}

type AAAARecord struct {
	dns.AAAARecord
}

func (r AAAARecord) Validate() error {
	ok := regexp.MustCompile("^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])[.]){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])[.]){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$").MatchString(r.Ip.String())
	if !ok {
		return ErrInvalidIPv6
	}
	return nil
}

type TXTRecord struct {
	dns.TXTRecord
}

func (r TXTRecord) Validate() error {
	if r.Text == "" {
		return ErrEmptyTXT
	}
	return nil
}

type CNAMERecord struct {
	dns.CNAMERecord
}

func (r CNAMERecord) Validate() error {
	if strings.HasSuffix(r.Host, ".") {
		return ErrNoDotSuffix
	}
	return nil
}

type NSRecord struct {
	dns.NSRecord
}

func (r NSRecord) Validate() error {
	if strings.HasSuffix(r.Host, ".") {
		return ErrNoDotSuffix
	}
	return nil
}

type MXRecord struct {
	dns.MXRecord
}

func (r MXRecord) Validate() error {
	if strings.HasSuffix(r.Host, ".") {
		return ErrNoDotSuffix
	}
	return nil
}

type SRVRecord struct {
	dns.SRVRecord
}

func (r SRVRecord) Validate() error {
	if strings.HasPrefix(r.Target, ".") {
		return ErrNoDotSuffix
	}

	return nil
}

type SOARecord struct {
	dns.SOARecord
}

func (r SOARecord) Validate() error {
	if strings.HasPrefix(r.MBox, ".") {
		return ErrNoDotSuffix
	}

	if strings.HasSuffix(r.Ns, ".") {
		return ErrNoDotSuffix
	}

	if strings.Contains(r.MBox, "@") {
		return ErrBadEmailFormat
	}

	return nil
}

type CAARecord struct {
	dns.CAARecord
}

func (r CAARecord) Validate() error {
	if r.Tag == "" {
		return ErrBadCAATag
	}

	if r.Value == "" {
		return ErrBadCAAValue
	}

	return nil
}

type RecordContentDefault map[string]any

func (r RecordContentDefault) Validate() error {
	return ErrInvalidType
}

type IRecordType interface {
	Validate() error
}
