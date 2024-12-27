#!/bin/bash

SUBDOMAIN=eb.api

# Create CA private key
openssl genrsa -out nginxCA.key 2048;

# Create CA
# -x509: Outputs a self-signed certificate instead of a certificate request
# -new: Generates a new certificate request
# -key nginxCA.key: Specifies the private key file to use
# -sha256: Uses SHA-256 for the signature algorithm
openssl req -x509 -new -key nginxCA.key -sha256 -days 360 -out nginxCA.pem -subj "/C=US/ST=Utah/L=Provo/O=Ledget/OU= /CN=$SUBDOMAIN.ledget.app";

# Create private key
openssl genrsa -out privatekey.pem 2048;
# Create certificate request
openssl req \
 -new \
 -key privatekey.pem \
 -out nginx.csr \
 -subj "/C=US/ST=Utah/L=Provo/O=Ledget/OU= /CN=$SUBDOMAIN.ledget.app";

# Sign the request with the CA
openssl x509 -req -in nginx.csr -CA nginxCA.pem -CAkey nginxCA.key -out public.crt -days 360 -sha256;

# Create full chain
cat public.crt nginxCA.pem > fullchain.pem

# Move files into right directoty
sudo mv fullchain.pem /etc/pki/tls/certs/fullchain.pem
sudo mv privatekey.pem /etc/pki/tls/certs/server.key
rm -f nginx* public.crt privatekey.pem
