FROM python:3.11-slim-bullseye AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    build-essential \
    libpq-dev

COPY requirements.txt .
COPY requirements.dev.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ARG DEV
RUN if [ $DEV = "true" ]; then pip install -r requirements.dev.txt; fi
RUN if [ $DEV = "true" ]; then export DEV=true; fi


###
FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED 1

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

WORKDIR /ledgetback
COPY ./ledgetback .
RUN mkdir -p ./logs && touch ./logs/stripe_logs && touch ./logs/ledget_logs


RUN chown -R python:python /ledgetback
USER python

EXPOSE 8000
