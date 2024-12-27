
#!/bin/zsh

# Run in certs directory

# Parse command line options
while getopts ":d:k:p:" opt; do
  case ${opt} in
    d )
      DOMAIN=$OPTARG
      ;;
    k )
      CAKEY=$OPTARG
      ;;
    p )
      CAPEM=$OPTARG
      ;;
    \? )
      echo "Invalid option: -$OPTARG" 1>&2
      exit 1
      ;;
    : )
      echo "Option -$OPTARG requires an argument." 1>&2
      exit 1
      ;;
  esac
done

# Check that required options are present
if [ -z "${DOMAIN}" ] || [ -z "${CAKEY}" ] || [ -z "${CAPEM}" ]; then
  echo "Usage: $0 -d DOMAIN -k CAKEY -p CAPEM" >&2
  exit 1
fi

# Check that files exist
if [ ! -f "${CAKEY}" ] || [ ! -f "${CAPEM}" ]; then
  echo "Error: key or CAPEM file not found." >&2
  exit 1
fi


openssl genrsa -out $DOMAIN.key 2048 # create private key
openssl req -new -key $DOMAIN.key -out $DOMAIN.csr # create certificate request

# Create a config file for the extensions
cat > $DOMAIN.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $DOMAIN
EOF

# Create the signed certificate from the request
openssl x509 -req -in $DOMAIN.csr -CA $CAPEM -CAkey $CAKEY -out $DOMAIN.crt -days 825 -sha256 -extfile $DOMAIN.ext

rm $DOMAIN.csr
rm $DOMAIN.ext
