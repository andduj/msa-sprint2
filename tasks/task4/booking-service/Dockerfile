FROM golang:1.21-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY main.go .

RUN go build -o booking-service main.go

CMD ["./booking-service"]
