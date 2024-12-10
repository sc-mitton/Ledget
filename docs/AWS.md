# Architecture

This is the list of AWS Resources in order to Run Ledget and how to set up each of them

## ASM
- sparkpost_key
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

### lambda-dynamic-origin-request

Trigger should be cloudfront

Execution role is ledget-route-dynamic-origin-request-role-4duyiptu

## S3

- Bucket for the code for the landing page, accounts web app, and main web appp
    (accounts.ledget.app, ledget-landing, ledget.app)
- Bucket for the dynamic router code (ledget-dynamic-route-lambda)
- Oathkeeper code (oathkeeper-authorization-prod and oathkeeper-authorization-uat)

All in us-west-2 except for the dynamic router which is in us-east-1

## AWS API Gateway

### Paths

1. /hooks/{proxy+} - ANY

No authorization

endpoint url https://ledget-restapi-prod-qlkrq0u.us-west-2.elasticbeanstalk.com/hooks/{proxy}

integration request path paramter is proxy: method.request.path.proxy

VPC integration

2. /v1/{proxy+} - ANY

Authorization - oathkeeper

Integration Request
-------------------

endpoint url https://ledget-restapi-prod-qlkrq0u.us-west-2.elasticbeanstalk.com/v1/{proxy}

paths: proxy

VPC integration

Headers: Authorization, X-User

Integration Request Header Parameters:
name: Authorization     Mapped From: context.authorization
name: X-User            Mapped From: context.x-user

Integration Request URL Path Parameters:
proxy:  method.request.path.proxy

3. /v1/{proxy+} - OPTIONS

Integration Response
--------------------

Header Mappings
method.response.header.Access-Control-Allow-Credentials: 'true'
method.response.header.Access-Control-Allow-Headers: 'Content-Type, Csrf-Token'
method.response.header.Access-Control-Allow-Methods: 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
method.response.header.Access-Control-Allow-Origin: '*'
method.response.header.Access-Control-Max-Age: '100'

Method Response
---------------

Response Headers:
Access-Control-Allow-Credentials
Access-Control-Allow-Headers
Access-Control-Allow-Methods
Access-Control-Allow-Origin
Access-Control-Max-Age


4. Make sure to skip the tls verification between the api gateway and the elastic beanstalk endpoint

```
aws apigateway get-resources --rest-api-id p8fln1tvp1

aws apigateway update-integration \
    --rest-api-id p8fln1tvp1 \
    --resource-id b0gn6g \
    --http-method ANY \
    --patch-operations "op='replace' ,path='/tlsConfig/insecureSkipVerification' ,value='true'"

aws apigateway update-integration \
    --rest-api-id p8fln1tvp1 \
    --resource-id z3rkt1 \
    --http-method ANY \
    --patch-operations "op='replace' ,path='/tlsConfig/insecureSkipVerification' ,value='true'"

aws apigateway create-deployment \
    --rest-api-id p8fln1tvp1 \
    --stage-name prod
```

### Resource Policies

Set up a resources policy for the hooks endpoint to restrict it to the IP's from Plaid, Stripe, and Ory

```
{
  "Version": "2012-10-17",
  "Statement": [{
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "hooks/*"
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "hooks/*",
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
            "34.22.170.75",
            "35.242.228.133",
            "52.21.26.131",
            "52.21.47.157",
            "52.41.247.19",
            "52.88.82.239"
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

Security Groups:  psql-group

Port: 5432

Instance class: db.t3.micro

Make sure to export credentials to AWSM


## Security Groups

GroupId,GroupName,VpcId,Description,OwnerId,InboundRulesCount,OutboundRulesCount,Tags
sg-0f60e0743fe07779f,default,vpc-041408005a5077dc6,default VPC security group,905418323334,2,1,
sg-01ec7a3ea2e2c8270,ec2-connect-point-ssh,vpc-041408005a5077dc6,Allow sshing from ec2 connect point,905418323334,0,1,
sg-0fae96ff7eb2f1809,jumpserver,vpc-041408005a5077dc6,Allow ssh access from vpc connector,905418323334,1,3,
sg-0b61f14c07c17c937,psql-group,vpc-041408005a5077dc6,Allow postgres traffic,905418323334,1,0,
sg-076f896a4cee95c8c,nlb,vpc-041408005a5077dc6,Network load balancer coms,905418323334,1,1,
sg-0e9134b06dc36c485,psql-connect,vpc-041408005a5077dc6,Access postgres services,905418323334,0,1,
sg-02fbc6ae85bbe6097,eb-restapi,vpc-041408005a5077dc6,VPC Security Group,905418323334,2,1,"Name:ledget-restapi-prod,aws:cloudformation:stack-name:awseb-e-fcsmgeyfh2-stack,aws:cloudformation:stack-id:arn:aws:cloudformation:us-west-2:905418323334:stack/awseb-e-fcsmgeyfh2-stack/c92320f0-083b-11ef-be91-0673b48fe34d,elasticbeanstalk:environment-id:e-fcsmgeyfh2,elasticbeanstalk:environment-name:ledget-restapi-prod,aws:cloudformation:logical-id:AWSEBSecurityGroup"
sg-01af89bf51a3b4086,default,vpc-0ae3bd634ed820212,default VPC security group,905418323334,2,1,
sg-0219c9f9a6ff828f3,third-party-access,vpc-041408005a5077dc6,Allow access to third party services,905418323334,0,2

## Elastic Beanstalk

1. Create eb environmet if not already up
This will create an environment and deploy to it

`eb create ledget-restapi-prod -c `

2. Deploy to environment
Deploy to a specific eb environment

`eb deploy ledget-restapi-prod`

## VPC

### Route Tables

1. CustomVPC Main
Destination: 10.192.0.0/16    Target: local

2. CustomVPC Private Routes (AZ2)
Destination: 10.192.0.0/16    Target: local

3. CustomVPC Private Routes (AZ1)
Destination: 0.0.0.0/0        Target: nat-053a0e870f203850f
Destination: 10.192.0.0/16    Target: local

4. CustomVPC Private Routes (AZ2)
Destination: 10.192.0.0/16    Target: local

5. CustomVPC Public Routes
Destination: 0.0.0.0/0      Target: igw-0735d656b6e79ad59
Destination: 10.192.0.0/16  Target: local

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

ledget.app
A

ledget.app
MX

ledget.app
NS

ledget.app
SOA

ledget.app
SPF

ledget.app
TXT

_1913a34200cf9c209e64f62b8a63f8ee.ledget.app
CNAME

_dmarc.ledget.app
TXT

3ljwwvs7uroopnu2usal6n3cf7izy67k._domainkey.ledget.app
CNAME

akq2x7v4rs5bp4n6nuefhrnjzpno3v6l._domainkey.ledget.app
CNAME

google._domainkey.ledget.app
TXT

jb5wsjyk6tt6wumwd62v3m47hqlsymjj._domainkey.ledget.app
CNAME

rq7btzgwzdfgunw7dgl22qnp2pqcjkyl._domainkey.ledget.app
CNAME

sk226cwg3wytmtrds2xjsveij5wz6x7p._domainkey.ledget.app
CNAME

zfeuenpnx7gof7kg5xunepgci36wzkuw._domainkey.ledget.app
CNAME

accounts.ledget.app
A

_bd85f36b2abf368cc629c959f50935ce.accounts.ledget.app
CNAME

api.ledget.app
A

auth.ledget.app
CNAME

bounce.ledget.app
CNAME

www.ledget.app
CNAME
