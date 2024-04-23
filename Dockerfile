FROM node AS web

WORKDIR /src
COPY . .
RUN cd web && npm i && npm run build

FROM golang as server
WORKDIR /src
COPY --from web /src .
RUN go get . && go generate ./... && go build .

FROM scratch
COPY --from server /src/reCoreD-UI .
ENTRYPOINT [ '/reCoreD-UI' ]
