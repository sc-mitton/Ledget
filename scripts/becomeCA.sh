
#!/bin/zsh

# Run in certs directory

if [ "$#" -ne 1 ]
then
  echo "Usage: Must supply a CA domain"
  exit 1
fi

DOMAIN=$1

# Become local CA
openssl genrsa -des3 -out ${DOMAIN}CA.key 2048 # generate private key for local CA, fill out passphrase
openssl req -x509 -new -nodes -key ${DOMAIN}CA.key -sha256 -days 1825 -out ${DOMAIN}CA.pem # generate root cert
sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" ${DOMAIN}CA.pem # add root cert to system keychain
