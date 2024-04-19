# reCoreD-UI

Web UI for CoreDNS

## UI

![ui](.assets/ui.webp)

## Build

Install `go` and `npm` first.

```bash
# Build web first
(cd web && npm run build)

# Build server
go get .
go generate ./...
go build .
```

## Running

Build [coredns](https://coredns.io/) with [mysql](coredns.io/explugins/mysql/) plugin first.

A mysql server is needed.

```bash
# example
export RECORED_MYSQL_DSN="recoredui:A123456a-@tcp(mysql.dev:3306)/recoredui?charset=utf8mb4"
./reCoreD-UI config db migrate

# setup admin user
./reCoreD-UI config user -u user -p password

# setup DNS
./reCoreD-UI config dns -s 1.1.1.1 -s 1.2.3.4

# run server and open http://localhost:3000
./reCoreD-UI server
```

```ini
# systemd service
[Unit]
Description=reCoreD-UI

[Service]
Type=simple
# RECORED_MYSQL_DSN="dsn"
EnvironmentFile=-/etc/default/recored-ui
EnvironmentFile=-/etc/sysconfig/recored-ui
ExecStart=/usr/local/bin/reCoreD-UI server

[Install]
WantedBy=multi-user.target
```
