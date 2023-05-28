FROM ubuntu:latest

RUN apt-get update && apt-get install -y curl

# Download and install ORY CLI
RUN curl https://raw.githubusercontent.com/ory/meta/master/install.sh | sh -s ory
RUN mv ./ory /usr/local/bin/
EXPOSE 4000
