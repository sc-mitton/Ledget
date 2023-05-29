FROM debian:11-slim

RUN apt-get update && \
    apt-get install -y curl

RUN curl -o install.sh https://raw.githubusercontent.com/ory/meta/master/install.sh
RUN chmod +x install.sh
RUN ./install.sh ory

CMD ["ory"]
