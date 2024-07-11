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
