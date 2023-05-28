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

`git clone git@github.com:sc-mitton/Ledget.git`

2. Create a CA authority for self signed SSL certificates

Use the becomeCA.sh script to generate a CA. The CA will automatically be added to your keychain if you're on a mac.

`mkdir certs`

`cd ./scripts`

`./becomeCA.sh ledgetCA`

3. Create a key pair and SSL cert for both the front end and back end

`./

4. Add a .env.dev & .env.stripe.dev files to /ledgetapi

5. Use docker compose to run the application in development mode:

`docker-compose up`
