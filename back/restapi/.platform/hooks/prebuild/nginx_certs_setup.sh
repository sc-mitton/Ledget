#!/bin/bash

domain='eb.api.ledget.app'
contact='info@ledget.app'
bucket='s3://elasticbeanstalk-us-west-2-905418323334'
bucket_path="${bucket}/letsencrypt"

# Add cron job
function add_cron_job {
    touch /etc/cron.d/certbot_renew
    echo "* * * * * webapp 0 2 * * * certbot renew --allow-subset-of-names
    # empty line" | tee /etc/cron.d/certbot_renew
}

#check if certbot is already installed
if command -v certbot &>/dev/null; then
    echo "certbot already installed"
else
    # Install certbot and plugin since it's not installed already
    # Instructions from https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt

    sudo dnf install -y python3-certbot-nginx
    sudo dnf install -y python3-certbot-dns-route53
fi

# check if the S3 bucket already exists with a certificate
if [ -n "$(aws s3 ls $bucket_path)" ]; then

    # download and install certificate from existing S3 bucket
    echo "$bucket_path exists."
    sudo rm -rf /etc/letsencrypt/*
    sudo aws s3 cp ${bucket_path}/backup.tar.gz /tmp
    sudo tar -xzvf /tmp/backup.tar.gz --directory /
    sudo chown -R root:root /etc/letsencrypt

    # -n: Non-interactive mode (runs without prompting the user for input).
    # -d ${domain}: Specifies the domain(s) for the certificate.
    # --nginx: Automatically configures Nginx with the certificate.
    # --agree-tos: Automatically agrees to the terms of service.
    # --email ${contact}: Sets the email for renewal notifications.
    # --reinstall: Reinstalls an existing certificate.
    # --redirect: Forces HTTPS.
    # --expand: Adds domains to an existing certificate.
    # --allow-subset-of-names: Issues a certificate even if some domains fail validation.
    sudo certbot -n -d ${domain} --nginx --agree-tos --email ${contact} --reinstall --redirect --expand --allow-subset-of-names
    systemctl reload nginx

    # re-uploading the certificate in case of renewal during certbot installation
    tar -czvf /tmp/backup.tar.gz /etc/letsencrypt/*
    aws s3 cp /tmp/backup.tar.gz ${bucket_path}/backup.tar.gz

    add_cron_job
    exit
fi

# obtain, install, and upload certificate to S3 bucket since it does not exist already
sudo certbot certonly -n -d $domain --preferred-challenges dns --dns-route53 --email ${contact} --agree-tos
tar -czvf /tmp/backup.tar.gz /etc/letsencrypt/*
aws s3 cp /tmp/backup.tar.gz ${bucket_path}/backup.tar.gz

add_cron_job
