package models

import (
	"fmt"
	"strings"

	dns "github.com/cloud66-oss/coredns_mysql"
)

type Domain struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	DomainName string `gorm:"unique,not null,size:255" json:"domain_name"`

	//SOA Info
	MainDNS         string `gorm:"not null,size:255" json:"main_dns"`
	AdminEmail      string `gorm:"not null,size:255" json:"admin_email"`
	SerialNumber    int64  `gorm:"not null,default:1" json:"serial_number"`
	RefreshInterval uint32 `gorm:"not null,size:255,default:\"86400\"" json:"refresh_interval"`
	RetryInterval   uint32 `gorm:"not null,size:255,default:\"7200\"" json:"retry_interval"`
	ExpiryPeriod    uint32 `gorm:"not null,size:255,default:\"3600000\"" json:"expiry_period"`
	NegativeTtl     uint32 `gorm:"not null,size:255,default:\"86400\"" json:"negative_ttl"`
}

func (d Domain) EmailSOAForamt() string {
	s := strings.Split(d.AdminEmail, "@")
	s[0] = strings.Replace(s[0], ".", "\\", -1)
	if !strings.HasSuffix(s[1], ".") {
		s[1] = fmt.Sprintf("%s.", s[1])
	}
	return strings.Join(s, ".")
}

func (d Domain) WithDotEnd() string {
	if strings.HasSuffix(d.DomainName, ".") {
		return d.DomainName
	} else {
		return fmt.Sprintf("%s.", d.DomainName)
	}
}

func (d *Domain) GenerateSOA() dns.SOARecord {
	var ns string
	if !strings.HasSuffix(d.MainDNS, ".") {
		ns = fmt.Sprintf("%s.", d.MainDNS)
	} else {
		ns = d.MainDNS
	}
	return dns.SOARecord{
		Ns:      ns,
		MBox:    d.EmailSOAForamt(),
		Refresh: d.RefreshInterval,
		Retry:   d.RetryInterval,
		Expire:  d.ExpiryPeriod,
		MinTtl:  d.NegativeTtl,
	}
}
