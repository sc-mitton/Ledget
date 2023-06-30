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


cd ./scripts && ./becomeCA.sh ledgetCA
./genCRT.sh -d localhost -k ledgetCA.key -p ledgetCA.pem
mkdir ../certs
find . -type f '(' -name '*.key' -o -name '*.pem' -o -name '*.crt' ')' -exec mv {} ../certs/ ';'
./get_random_secret_key > ../secrets/django_secret_key
echo dev_user > ../secrets/postgres_user && echo ../secrets/dev_user_password > postgres_password
brew install stripe
oathkeeper credentials generate --alg RS256 > ./oathkeeper/jwks.json
