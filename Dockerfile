FROM node AS web

WORKDIR /src
COPY . .
RUN cd web && npm i && npm run build

FROM golang as server
WORKDIR /src
COPY --stage web /src .
RUN go get . && go generate ./... && go build .

FROM scratch
COPY --stage server /src/reCoreD-UI .
ENTRYPOINT [ '/reCoreD-UI' ]
