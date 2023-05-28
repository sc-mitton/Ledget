FROM alpine:3.7

RUN apk update && \
    apk add --no-cache curl

# Download and install ORY CLI
RUN curl https://raw.githubusercontent.com/ory/meta/master/install.sh | sh -s ory

# Set the entrypoint command
CMD ["ory"]
