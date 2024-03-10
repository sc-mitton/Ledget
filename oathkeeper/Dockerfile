FROM alpine:3.12 as builder

# Install jsonnet from node
ARG ENVIRONMENT
ARG VERSION

COPY ./rules.jsonnet ./rules.jsonnet

RUN if [ "$ENVIRONMENT" = "dev" ]; then export API_DOMAIN=localhost; \
    elif [ "$ENVIRONMENT" = "uat" ]; then export API_DOMAIN=uatapi.ledget.app; \
    else export API_DOMAIN=api.ledget.app; \
    fi

# Compiles the rules to json from jsonnet
# using the proper domain and version
RUN apk add --no-cache jsonnet
RUN jsonnet rules.jsonnet --ext-str domain=$API_DOMAIN --ext-str version=$VERSION -o rules.json

FROM oryd/oathkeeper:v0.40.3

COPY --from=builder ./rules.json /etc/config/oathkeeper/rules.json
COPY ./config.yml /etc/config/oathkeeper/config.yml
