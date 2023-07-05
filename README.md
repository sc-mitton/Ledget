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


2. Run the setup script:


```
chmod 755 setup.sh && ./setup.sh
```


3. Get the stripe api key (should start with sk_test) from the stripe dashboard and add it to a file ./secrets/stripe_api_key and also to ./secrets/.env.stripe.dev

4. Get the webhook secret from stripe. This command will output the secret which you should add to a file ./secrets/stripe_webhook_secret.


```
stripe listen --forward-to https://ledget.app:8000/api/v1/stripe --skip-verify
```


5. Get the ory api key (should start ory_pat_) from the ory dashboard and run


```
echo ORY_API_KEY=<api key> > ./secrets/.env.ory
```


5. Use docker compose to run the application in development mode:


```
docker-compose up -d
```
## Other Notes

To test the ory webhook, you'll need to provide an ngrok tunnel, and then update the url for the webhook endpoint in the porject-configuration.yaml file for ory.

```
# Get the project config
ory get identity-config reverent-lewin-bqqp1o2zws \\n  --format yaml > project-configuration.yaml
```

```
ngrok http 127.0.0.1:443 --host-header='ledget.app' # open the tunnel
ory update identity-config https://reverent-lewin-bqqp1o2zws.projects.oryapis.com -f project-configuration.yaml # update the webhook endpoint
```
