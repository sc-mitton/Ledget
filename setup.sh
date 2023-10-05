#!/bin/zsh

get_random_string() {
    local length=$1
    local allowed_chars=${2:-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789}
    local str=""

    for ((i=0; i<length; i++)); do
        local random_char=${allowed_chars:$RANDOM % ${#allowed_chars}:1}
        str="${str}${random_char}"
    done

    echo "$str"
}

get_random_secret_key() {
    local chars="abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)"
    local random_string=$(get_random_string 50 "$chars")
    echo "$random_string"
}


# Create the self signed ssl certs
cd ./scripts && ./becomeCA.sh ledget
./genCRT.sh -d localhost -k ledgetCA.key -p ledgetCA.pem
mkdir ../front/certs
find . -type f '(' -name '*.key' -o -name '*.pem' -o -name '*.crt' ')' -exec mv {} ../front/certs/ ';'

# Create secrets
cd ..
mkdir secrets
get_random_secret_key > ./secrets/django_dev_secret_key
echo dev_user > ./secrets/postgres_user && echo dev_user_password > ./secrets/postgres_password
brew install stripe

# Create jwks for oathkeeper
brew install oathkeeper
oathkeeper credentials generate --alg RS256 > ./secrets/jwks.json

# Make the log files
mkdir back/ledgetback/logs
touch back/ledgetback/logs/stripe_logs
touch back/ledgetback/logs/ledget_logs

# Download ory
brew install ory/tap/cli

# Install pm2
npm install pm2@latest -g
npm install nx@latest -g
