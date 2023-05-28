FROM python:3.11.3-alpine3.18
LABEL maintainer="sc-mitton"

COPY . ./ledgetapi

WORKDIR /ledgetapi
EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-build-deps build-base postgresql-dev musl-dev && \
    /py/bin/pip install -r requirements.txt && \
    if [ $DEV = "true" ]; then /py/bin/pip install -r requirements.dev.txt; fi && \
    apk del .tmp-build-deps && \
    adduser --disabled-password --no-create-home ledget-root
RUN rm -rf requirements.txt requirements.dev.txt

ENV PATH="/py/bin:$PATH"

USER ledget-root
