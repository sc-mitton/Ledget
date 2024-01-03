# Ledget


<!-- <div style="text-align:center">
  <img src="media/logoIcon.png" alt="Logo" width="100" height="100">
</div> -->




![alt-text](https://github.com/sc-mitton/Ledget/blob/assets/screenshot1.png)

![alt-text](https://github.com/sc-mitton/Ledget/blob/assets/screenshot2.png)


## Introduction

Ledget was started from frustration with the choice of personal budgeting apps. Almost all had cluttered and confusing user interfaces, only a portion would automatically import data from financial institutions, and many wouldn't offer the simplicity that should come with a great user experience.

## Tech Stack

Front
- React
- React Native
- Vite
- Nx

Back
- Django
- Postgres
- Stripe (payments processing)
- Plaid (financial data agregator)
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
stripe listen --forward-to https://localhost/hooks/stripe --skip-verify --headers "X-Forwarded-For:3.18.12.63"
```


5. Get the ory api key (should start ory_pat_) from the ory dashboard and run


```
echo ORY_API_KEY=<api key> > ./secrets/.env.ory
```

6. Run the Environment
It's worth saving these commands somewhere, aliasing them, or saving as a workflow in warp terminal

```
docker-compose up -d --build
cd front &&
pm2 start nx --name webhome -- run webhome:serve &&
pm2 start nx --name webportal -- run webportal:serve
```

7. Stop the Environment

```
docker-compose down

pm2 stop webhome &&
pm2 stop webportal &&
pm2 delete all
```

## Webhook Testing

To test ory webhooks, you can use this command.
Dependencies: ngrok & ory (you may need to create an ngrok account)

```
ngrok http 127.0.0.1:443 --host-header='localhost' --log=stdout > ngrok.log &
sleep 1
export NGROK_TUNNEL=$(grep "url=" ngrok.log | awk -F 'url=' '{print $2}')
export NGROK_PID=$(ps aux | grep -m 1 'ngrok http' | awk '{print $2}')
ory get identity-config reverent-lewin-bqqp1o2zws --format yaml > project-configuration.yaml
sed -i '' -e 's|https.*ngrok.*hooks|'$NGROK_TUNNEL'\/hooks|g' project-configuration.yaml
ory update identity-config "$(ory list projects | grep "ledget" | cut -f1)" -f project-configuration.yaml
```

Close the tunnel:

```
kill -9 $NGROK_PID
rm ngrok.log
```

For working with the stripe webhook, you'll also need to use the stripe cli:

```
stripe listen --forward-to https://localhost/hooks/stripe --skip-verify --headers "X-Forwarded-For:3.18.12.63"
```

## Subscription Status Docs

Learn more about the subscription statuses here:
https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses

trialing: When customer is first created and setup intent succeeds. Status will go to active after first bill.

active: Good standing

incomplete: Successfull payment needs to be made within 23 hours to activate subscription

incomplete_expired: Initial payment failed and no payment was made within 23 hours

past_due: Payment of last finalized invoice failed or wasn't attempted. Service is revoked until payment is made.

paused: Subscription is paused

canceled: terminal state

Unused:
UNPAID is unused because it is just a status that can be triggered after past_due


## Plaid

The username and password for the sandbox environment are user_good and pass_good respectively.


## MFA

The server has to except both aal1 and aal2 levels, the problem to solve is
how to know when aal1 is ok to except so that we don't force the user to authenticate with
multi factor every single time.

Solution:
1. When a user logs in on a new device, they will initially sign in to get aal1 (via password, oidc, etc.).
After authenticating with Ory, the client will POST to /device. During the middleware, if the token is
set in the cookies, it will be matched with the user's device it belongs to (if there is any). Then the
flow will be followed

![alt-text](https://github.com/sc-mitton/Ledget/blob/assets/diagram1.png)

2. Now when when requests come through, in ory.py the request will check to see if
there is a valida token for the remembered device or that the session's aal is aal2
3. This ensures against all scenarios:
    - When the device is recognized, the user will only be forced to authenticate with
      aal1 since they will already have a token set.
    - In the event a token isn't set, aal2 will be required and upon authentication,
      the client will call a special endpoint requiring aal2, where a token will be set
    - If the client tries to access an api endpoint without a token, and they have mfa enabled,
      access will be denied and they'll be redirected to the login page. The redirect is done in the
      react private route when /user/me is called.
4. The downside, is that devices will need to be stored in the database. When the user
wants to forget (and also logout) a device, the token related to the device just needs to
be invalidated. This will be also be equivalent to a logout because then the user will be
redirected to the logout page the next time they try and go to the page on that device.
All it entails is removing the device from the device table in the db.

![alt-text](https://github.com/sc-mitton/Ledget/blob/assets/diagram2.png)


## Handling access to the service

When the react app is mounted:

1. there is a private route which will redirect any requests that have
no session to the login page.

2. If there is a session, a private route protects the main app for users
who haven't been onboarded yet, and they're sent to the onboarding process

3. After onboarding, if the email hasn't been verified, a modal pop up
prompts the user to verify their email address

4. Additionally, if a user has no customer object related to them, or their
service_provisioned_until property is 0, they are redirected to the checkout page.
This handles any situations where the user is trying to go to the app after a failed
initial checkout.

5. After the initial login, in the future, accesss is provided base off of the
subscription status and the service_provisioned_until attribute for the user.
The service_provisioned_until attribute is updated after every successful invoice,
and has 3 days of leniancy baked into it unless it's 0 (default value). If the
user has an expired payment method, and has not updated it, then service_provisioned_until
will eventually be overrun and service will be lost and access will not be returned
without a new payment method.


## Notes on App functionality

- The yearly budget will reset on the oldest yearly category created month. E.g. the oldest yearly
category was created on Oct. 6, 2023 then the yearly budget will reset every Oct. 1, 2023
