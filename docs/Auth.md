# Handling access to the service

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


# MFA

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

