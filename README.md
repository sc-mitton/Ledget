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



```
docker-compose up -d
```
## Webhook Testing


```
ngrok http 127.0.0.1:443 --host-header='ledget.app'

ory get identity-config reverent-lewin-bqqp1o2zws --format yaml > project-configuration.yaml
ory update identity-config "$(ory list projects | grep "ledget" | cut -f1)" -f project-configuration.yaml
```

For working with the stripe webhook, you'll also need to use the stripe cli:

```
stripe listen --forward-to https://localhost/hooks/stripe --skip-verify -H X-Forwarded-For:13.235.14.237
```

## Subscription Status Docs

Learn more about the subscription statuses here:
https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses

trialing: When customer is first created and setup intent succeeds. Status will go to active after first bill.

active: Good standing

incomplete: Successfull payment needs to be made within 23 hours

incomplete_expired: Initial payment failed and no payment was made within 23 hours

past_due: Payment of last finalized invoice failed or wasn't attempted. Service is revoked until payment is made.

canceled: A customer's subscription has been canceled. This is used for when a customer wants to take a break.
They can come back later. If they are completely canceling their account, then the whole customer is deleted.


Unused:
UNPAID is unused because it is just a status that can be triggered after unpaid
PAUSED is not used because we don't support it, we use canceling instead

## Plaid

The username and password for the sandbox environment are user_good and pass_good respectively.
