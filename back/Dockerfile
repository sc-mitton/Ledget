FROM python:3.11.3-alpine3.18 AS base

RUN apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-build-deps build-base postgresql-dev musl-dev

COPY requirements.txt .
COPY requirements.dev.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN if [ $DEV = "true" ]; then pip install -r requirements.dev.txt; fi

###
FROM python:3.11.3-alpine3.18
LABEL maintainer="sc-mitton"
EXPOSE 8000

COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/
COPY ./api /api

ENV PYTHONUNBUFFERED 1

RUN adduser -D ledget
RUN chown -R ledget:ledget /api
USER ledget

WORKDIR /api
