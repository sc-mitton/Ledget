FROM python:3.11-slim-bullseye AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    build-essential \
    libpq-dev

COPY ./restapi/requirements.dev.txt .

RUN pip install --upgrade pi
ARG ENV
ARG VERSION

RUN pip install -r requirements.dev.txt;

###
FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED 1

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

# Set VERSION env variable
ARG VERSION

ENV ENV=dev
ENV API_VERSION=$VERSION

WORKDIR /restapi
COPY ./restapi .
RUN mkdir -p ./logs && touch ./logs/stripe_logs && touch ./logs/ledget_logs

RUN chown -R python:python /restapi
USER python

EXPOSE 8000

