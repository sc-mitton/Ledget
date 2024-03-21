# Stage 1: Build the rules.json file
FROM alpine:3.12 as builder

# Install jsonnet
RUN apk add --no-cache jsonnet
COPY ./rules.jsonnet ./rules.jsonnet

# Build rules.json from rules.jsonnet
ARG API_VERSION
RUN jsonnet rules.jsonnet --ext-str domain=localhost --ext-str version=$API_VERSION -o rules.json

WORKDIR /authorizer
COPY go.mod go.sum ./

# Build
COPY handler.go .
RUN go build -o handler handler.go

# Copy artifacts to a clean image
# Stage 2: Oathkeeper setup
FROM oryd/oathkeeper:v0.40.3

COPY --from=builder /authorizer/handler /handler
ENTRYPOINT [ "/handler" ]
