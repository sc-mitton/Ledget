# Ledget

Ledget simplifies financial lives.


<div style="text-align:center">
  <img src="media/logoIcon.png" alt="Logo" width="100" height="100">
</div>

## Introduction

Ledget was started from frustration with the choice of personal budgeting apps. Almost all had cluttered and confusing user interfaces, only a portion would automatically import data from financial institutions, and many wouldn't offer the simplicity that should come with a great user experience. So, ledget was born to do the job right.

## Tech Stack
- Django
- React
- React Native
- Postgres
- Stripe (payments processing)
- Finicity (financial data agregator)
- Ory (authentication)

## Dev Environment

1. First clone the git repo:

```
git clone git@github.com:sc-mitton/Ledget.git
```


2. Create a CA authority for self signed SSL certificates

Use the becomeCA.sh script to generate a CA. The CA will automatically be added to your keychain if you're on a mac.


```
cd ./scripts && ./becomeCA.sh ledgetCA
```


3. Create a key pair and SSL cert for both the front end and back end

```
./genCRT.sh -d localhost -k ledgetCA.key -p ledgetCA.pem
```


```
./genCRT.sh -d ledget.app -k ledgetCA.key -p ledgetCA.pem
```


4. Move the key pairs and certs to the secrets folder & a certs folder for the front end app

```
mkdir ../certs
```

```
find . -type f '(' -name '*.key' -o -name '*.pem' -o -name '*.crt' ')'  -a ! -name '*CA.key' -exec mv {} ../certs/ ';'
```


5. Generate django secret key

```
cd ../scripts && chmod 755 get_random_secret_key.sh && ./get_random_secret_key > ../secrets/django_secret_key
```


6. Create postgres credentials in the secrets folder

```
cd ../secrets/ &&  echo dev_user > postgres_user && echo dev_user_password > postgres_password
```


7. Download the stripe cli

```
brew install stripe
```


8. Get the api key (should start with sk_test) from the stripe dashboard and add it to a file /secrets/stripe_api_key and also to ./secrets/.env.stripe.dev

9. Get the webhook secret from stripe. This command will output the secret which you should add to a file /secrets/stripe_webhook_secret.

```
stripe listen --forward-to https://ledget.app:8000/api/v1/stripe-hook --skip-verify
```


10. Use docker compose to run the application in development mode:

```
docker-compose up -d
```

