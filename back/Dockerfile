FROM python:3.11-slim-bullseye AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    build-essential \
    libpq-dev

COPY requirements.prod.txt .
COPY requirements.dev.txt .

RUN pip install --upgrade pi
ARG ENVIRONMENT
ARG API_VERSION

RUN if [ $ENVIRONMENT = "dev" ]; then \
    pip install -r requirements.dev.txt; \
    else \
    pip install -r requirements.prod.txt; \
    fi

###
FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED 1

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

# Set API_VERSION env variable
ARG ENVIRONMENT
ARG API_VERSION

ENV ENVIRONMENT=$ENVIRONMENT
ENV API_VERSION=$API_VERSION

WORKDIR /restapi
COPY ./restapi .
RUN mkdir -p ./logs && touch ./logs/stripe_logs && touch ./logs/ledget_logs

RUN chown -R python:python /restapi
USER python

EXPOSE 8000

CMD /restapi/restapi_startup.sh
