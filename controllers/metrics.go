package controllers

import (
	"github.com/prometheus/client_golang/prometheus"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	ormMetric "gorm.io/plugin/prometheus"
)

var (
	GaugeDomainCounts = prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace: "recoredui",
		Subsystem: "domains",
		Name:      "count",
		Help:      "domains managed in reCoreD-UI",
	})

	GaugeRecordCounts = prometheus.NewGaugeVec(prometheus.GaugeOpts{
		Namespace: "recoredui",
		Subsystem: "records",
		Name:      "count",
		Help:      "records managed in reCoreD-UI, by domain",
	}, []string{"domain"})
)

func RegisterMetrics() {
	prometheus.MustRegister(GaugeDomainCounts, GaugeRecordCounts)

	GormMetrics := ormMetric.New(ormMetric.Config{
		DBName: "recored-ui",
		MetricsCollector: []ormMetric.MetricsCollector{
			&ormMetric.MySQL{
				VariableNames: []string{"Threads_running"},
			},
		},
	}).Collectors
	prometheus.MustRegister(GormMetrics...)

	GinMetrics := ginprometheus.NewPrometheus("recoredui")
	for _, v := range GinMetrics.MetricsList {
		prometheus.Register(v.MetricCollector)
	}
}

func RefreshMetrics() error {
	domainCounts, err := getDomainCounts()
	if err != nil {
		return err
	}
	GaugeDomainCounts.Set(domainCounts)

	recordCounts, err := getRecordCounts()
	if err != nil {
		return err
	}

	for domain, counts := range recordCounts {
		GaugeRecordCounts.WithLabelValues(domain).Set(counts)
	}

	return nil
}
