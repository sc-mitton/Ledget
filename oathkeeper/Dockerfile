# Stage 1: Build the rules.json file
FROM golang:1.21-alpine as builder

# Install jsonnet
RUN apk add --no-cache jsonnet
COPY ./rules.jsonnet ./rules.jsonnet
COPY ./rules.test.jsonnet ./rules.test.jsonnet

# Build rules.json from rules.jsonnet
ARG API_VERSION
ARG TEST
ARG ENVIRONMENT

RUN if [ "$ENVIRONMENT" = "production" ]; then \
    jsonnet rules.jsonnet --ext-str domain=api.ledget.app --ext-str version=$API_VERSION -o /rules.json; \
    elif [ "$ENVIRONMENT" = "uat" ]; then \
    jsonnet rules.jsonnet --ext-str domain=uatapi.ledget.uat --ext-str version=$API_VERSION -o /rules.json; \
    else \
    jsonnet rules.jsonnet --ext-str domain=localhost --ext-str version=$API_VERSION -o /rules.json; \
    fi;

# Copy oathkeeper config and select the one to use based on the environment and test flag

COPY ./config.yml /config.yml
COPY ./config.dev.yml /config.dev.yml

RUN if [ "$ENVIRONMENT" = "test" || "$ENVIRONMENT" = "dev" ]; then \
    rm /config.yml && mv /config.dev.yml /config.yml; \
    else \
    rm /config.dev.yml; \
    fi;

# Build authorizer
WORKDIR /authorizer
COPY authorizer .
RUN go build -o authorizer authorizer.go

# Copy artifacts to a clean image
# Stage 2: Oathkeeper setup
FROM oryd/oathkeeper:v0.40.3

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

COPY --from=builder ./authorizer/authorizer /authorizer
COPY --from=builder /rules.json /etc/config/oathkeeper/rules.json
COPY --from=builder /config.yml /etc/config/oathkeeper/config.yml

ENTRYPOINT [ "/authorizer" ]
