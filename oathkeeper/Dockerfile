
FROM alpine:3.12 as builder

# Install jsonnet from node
ARG ENVIRONMENT
ARG API_VERSION

RUN apk add --no-cache jsonnet
COPY ./rules.jsonnet ./rules.jsonnet

RUN if [ "$ENVIRONMENT" = "dev" ]; then \
    jsonnet rules.jsonnet --ext-str domain=localhost --ext-str version=$API_VERSION -o rules.json; \
    elif [ "$ENVIRONMENT" = "uat" ]; then \
    jsonnet rules.jsonnet --ext-str domain=uatapi.localhost --ext-str version=$API_VERSION -o rules.json; \
    else \
    jsonnet rules.jsonnet --ext-str domain=api.localhost --ext-str version=$API_VERSION -o rules.json; \
    fi

FROM oryd/oathkeeper:v0.40.3

COPY --from=builder ./rules.json /etc/config/oathkeeper/rules.json
COPY ./config.yml /etc/config/oathkeeper/config.yml

EXPOSE 4456
