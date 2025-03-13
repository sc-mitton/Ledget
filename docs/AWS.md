# Architecture

This is the list of AWS Resources in order to Run Ledget and how to set up each of them

## ASM

- ledget-restapi-rds-credentials
- oathkeeper_jwks
- ory_hook_api_key
- django_secret_key
- stripe_api_key
- stripe_webhook_secret
- ory_api_key
- plaid_secret
  - api_key
  - client_id

## Lambda

There are two lambda functions currently. One for oathkeeper and another for the dynamic router forwarding.

### Oathkeeper

The trigger should be the aws api gateway

Load the code from the s3 bucket location

The role should be oathkeeper-role-bivaxn5z

## S3

- Bucket for the code for the landing page, accounts web app, and main web appp
  (accounts.ledget.app, ledget-landing, ledget.app)
- Bucket for the dynamic router code (ledget-dynamic-route-lambda)
- Oathkeeper code (oathkeeper-authorization-prod and oathkeeper-authorization-uat)

All in us-west-2 except for the dynamic router which is in us-east-1

## AWS API Gateway

### Paths

1. /hooks/{proxy+} - POST

No authorization

endpoint url https://eb.api.ledget.app/hooks/{proxy}

integration request path paramter is proxy: method.request.path.proxy

VPC integration

Integration Request Header Parameters:
name: X-Forwarded-Host mapped from: method.request.header.Host

2. /v1/{proxy+} - ANY

Authorization - oathkeeper

## Integration Request

endpoint url https://eb.api.ledget.app/v1/{proxy}

paths: proxy

VPC integration

Method Request: Http Request Headers
Host, Required: False

Integration Request URL Path Parameters:
proxy: method.request.path.proxy

Integration Request Header Parameters:
Name: Authorization Mapped From: context.authorizer.authorization
Name: X-Forwarded-Host Mapped From: method.request.header.Host
Name: X-User Mapped From: context.x-user

## Method Response

Response Headers:
Access-Control-Allow-Credentials
Access-Control-Allow-Headers
Access-Control-Allow-Methods
Access-Control-Allow-Origin
Access-Control-Max-Age

### Resource Policies

Set up a resources policy for the hooks endpoint to restrict it to the IP's from Plaid, Stripe, and Ory

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-west-2:905418323334:d6wzi1587h/*/*/hooks/*"
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-west-2:905418323334:d6wzi1587h/*/*/hooks/*",
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": [
            "3.18.12.63",
            "3.130.192.231",
            "13.235.14.237",
            "13.235.122.149",
            "18.211.135.69",
            "35.154.171.200",
            "52.15.183.38",
            "54.88.130.119",
            "54.88.130.237",
            "54.187.174.169",
            "54.187.205.235",
            "54.187.216.72",
            "35.245.69.134",
            "34.94.111.83",
            "34.22.170.75",
            "35.242.228.133",
            "34.159.197.30",
            "52.21.26.131",
            "52.21.47.157",
            "52.41.247.19",
            "52.88.82.23"
          ]
        }
      }
    }
  ]
}
```

### Authorizer

oathkeeper - no role

### Custom domain name

Domain name: api.ledget.app
ACM Certificate ARN: arn:aws:acm:us-west-2:905418323334:certificate9d219be8-65b0-48ea-853e-cb5b04c4c570
API Endpoint Type: Regional

API Mappings

API: ledget-rest-api
Stage: prod
Path: none

### VPC Link

Name: ledget-nlb-vpc-link
Target nlb: the nlb set up by eb

## RDS

Name: database

VPC: Custom (vpc-041408005a5077dc6)

Subnets:
subnet-0b9cd43a6494e4fd5
subnet-0c387b32e825aa0d4

Zone: (only 1 for now so it's free tier)

Region: us-west-2a

Security Groups: psql-group

Port: 5432

Instance class: db.t3.micro

Make sure to export credentials to AWSM

## Security Groups

ec2-connect-point-ssh
outbound:
type: SSH, proto: TCP, port range: 22, destination: jumpserver

psql-group
inbound:
type: PostgreSQL, proto: TCP, port range: 5432, source: psql-connect

third-party-access
outbound:
type: HTTPS, destination: 0.0.0.0/0

jumpserver
inbound:
type: ssh, proto: TCP, port range: 22, source: ec2-connect-point-ssh
outbound:
type: All ICMP - IPv4, proto: ICMP, port: All, destination: 0.0.0.0/0
type: HTTP, proto: TCP, port: 80, destination: 0.0.0.0/0
type: SSH, proto: TCP, port: 22, destination: 10.192.0.0/16
type: HTTPS, proto: TCP, port: 443, destination: 0.0.0.0/0

psql-connect
outbound:
type: PostgreSQL, proto: TCP, port: 5432, destination: psql-group

nlb
inbound:
type: HTTPS, proto: TCP, port: 443, destination: 10.192.0.0/16
outbound:
type: HTTPS, proto: TCP, port: 443, destination: 10.192.0.0/16

## Elastic Beanstalk

The ec2 instance iam role should have access to the necessary secrets in ASM, route 53 (full), s3 (full), sqs (full), eb web tier, and eb worker tier

1. Create eb environmets if not already up

`eb create --modules restapi celery --env-group-suffix prod`

2. Deploy to environment
   Deploy to a specific eb environment

`eb deploy --modules restapi celery --env-group-suffix prod`

## VPC

### Route Tables

1. CustomVPC Main
   Destination: 10.192.0.0/16 Target: local

2. CustomVPC Private Routes (AZ2)
   Destination: 10.192.0.0/16 Target: local

3. CustomVPC Private Routes (AZ1)
   Destination: 0.0.0.0/0 Target: nat-053a0e870f203850f
   Destination: 10.192.0.0/16 Target: local

4. CustomVPC Private Routes (AZ2)
   Destination: 10.192.0.0/16 Target: local

5. CustomVPC Public Routes
   Destination: 0.0.0.0/0 Target: igw-0735d656b6e79ad59
   Destination: 10.192.0.0/16 Target: local

### Subnets

3 private, 3 public

Private: 10.192.20.0/24, 10.192.21.0/24, 10.192.22.0/24
Public: 10.192.12.0/24, 10.192.11.0/24, 10.192.10.0/24

### Endpoints

- jumpserver-endpoint-a
  security group: ec2-connect-point-ssh
  subnets: subnet-0b9cd43a6494e4fd5

## Route 53

Hosted zone: ledget.app

ledget.app, A, d1ow7bjjovd6n4.cloudfront.net.

ledget.app, MX, 1 SMTP.GOOGLE.COM.

ledget.app, NS, ns-221.awsdns-27.com. ns-1816.awsdns-35.co.uk. ns-1210.awsdns-23.org.
ns-938.awsdns-53.net.

ledget.app, SOA, ns-221.awsdns-27.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400
900

ledget.app, SPF, "v=spf1 include:\_spf.google.com ~all"

ledget.app, TXT,"stripe-verification=d0942a91f10ce636c55e2a01d6fc908f1b42902e36718580f7188eb7884f4286"

\_1913a34200cf9c209e64f62b8a63f8ee.ledget.app, CNAME, \_c8b782799ca12c4ec6710621b2a2cb90.mhbtsbpdnt.acm-validations.aws

\_dmarc.ledget.app, TXT, "v=DMARC1; p=none; rua=mailto:reports@ledget.app"

3ljwwvs7uroopnu2usal6n3cf7izy67k.\_domainkey.ledget.app, CNAME,
3ljwwvs7uroopnu2usal6n3cf7izy67k.dkim.custom-email-domain.stripe.com

akq2x7v4rs5bp4n6nuefhrnjzpno3v6l.\_domainkey.ledget.app, CNAME
akq2x7v4rs5bp4n6nuefhrnjzpno3v6l.dkim.custom-email-domain.stripe.com

google.\_domainkey.ledget.app, TXT
"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5mxFNivwBq93hMCU7le0Y/1Jo/HwX0V4gNtMjsQVm6Nh61DiF3Q2rdC83nDKBXwXNV4ETsKB8mTjCmb5Ivv/e2E4PaleIV69i3NNKFPdfPtGHo7ya7ScH+sow6haa+G6I+mushw2I8EbWooO9kMtiIH6nRT7VMo6mrfknYrGOUodS"
"w6cNKkm05nZNmkEm/7J7HdclW+3N9XPCEDl6/Fx99GlswJu7VCnXJbJIAA/t7I9zwUYW8JlKQ0PJmAkRZXK6iDXRnuYbAoqxgD8MvGPT+xHNHh9AxO8J1OTt/s6txIoObYBe28JFq8WvrOOlGJAr9t954cg5bD0Yb0Lc3ObOQIDAQAB"

jb5wsjyk6tt6wumwd62v3m47hqlsymjj.\_domainkey.ledget.app, CNAME
jb5wsjyk6tt6wumwd62v3m47hqlsymjj.dkim.custom-email-domain.stripe.com.

rq7btzgwzdfgunw7dgl22qnp2pqcjkyl.\_domainkey.ledget.app, CNAME
rq7btzgwzdfgunw7dgl22qnp2pqcjkyl.dkim.custom-email-domain.stripe.com

sk226cwg3wytmtrds2xjsveij5wz6x7p.\_domainkey.ledget.app, CNAME
sk226cwg3wytmtrds2xjsveij5wz6x7p.dkim.custom-email-domain.stripe.com

zfeuenpnx7gof7kg5xunepgci36wzkuw.\_domainkey.ledget.app, CNAME
zfeuenpnx7gof7kg5xunepgci36wzkuw.dkim.custom-email-domain.stripe.com

accounts.ledget.app, A, d30pnpxz39z3p1.cloudfront.net.

\_bd85f36b2abf368cc629c959f50935ce.accounts.ledget.app, CNAME
\_a8bffa794ab78bbf7805bf427be894d2.mhbtsbpdnt.acm-validations.aws

api.ledget.app, A, d-wkgg5jdn5b.execute-api.us-west-2.amazonaws.com.

eb.api.ledget.app, CNAME, restapi-prod.eba-dwzivq5p.us-west-2.elasticbeanstalk.com

auth.ledget.app, CNAME, relaxed-bassi-eqk8kfge8r.projects.oryapis.com

bounce.ledget.app, CNAME, custom-email-domain.stripe.com

www.ledget.app, CNAME, ledget.app

my.ledget.app A d7yle07cg2774.cloudfront.net.

\_2f93df7b38aaf3299b0f77393bff771b.my.ledget.app CNAME \_e56282e348e30534ce3a860637a9f44e.xlfgrmvvlj.acm-validations.aws.
