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
RUN if [ $DEV = "true" ]; then pip install -r requirements.dev.txt; fi

###
FROM python:3.11-slim-bullseye
ENV PYTHONUNBUFFERED 1

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

WORKDIR /api
COPY ./api .

RUN chown -R python:python /api
USER python

EXPOSE 443
