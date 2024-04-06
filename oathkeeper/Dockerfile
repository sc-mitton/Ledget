# Stage 1: Build the rules.json file
FROM golang:1.21-alpine as builder

# Install jsonnet
RUN apk add --no-cache jsonnet
COPY ./rules.jsonnet ./rules.jsonnet

# Build rules.json from rules.jsonnet
ARG API_VERSION

RUN jsonnet rules.jsonnet --ext-str domain=localhost --ext-str version=$API_VERSION -o /rules.json;

# Copy artifacts to a clean image
# Stage 2: Oathkeeper setup
FROM oryd/oathkeeper:v0.40.3

COPY ./config.dev.yml /etc/config/oathkeeper/config.yml
COPY --from=builder /rules.json /etc/config/oathkeeper/rules.json
