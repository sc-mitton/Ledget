FROM alpine:latest

RUN apk update && \
    apk add --no-cache bash curl

# Download and install ORY CLI
RUN apk add --no-cache curl
RUN curl -fsSL https://raw.githubusercontent.com/ory/meta/master/install.sh | sh -s -- -b . ory
RUN mv ./ory /usr/local/bin/

EXPOSE 4000

CMD ["ory", "tunnel", "--dev", "--project", "reverent-lewin-bqqp1o2zws", "https://localhost:4000"]
