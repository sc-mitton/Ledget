#!/bin/bash

domain='eb.api.ledget.app'
contact='info@ledget.app'
bucket='s3://elasticbeanstalk-us-west-2-905418323334'
bucket_path="${bucket}/letsencrypt"

# Add cron job
function add_cron_job {
    echo "0 2 * * * sudo certbot renew" | sudo crontab -u webapp -
}

#check if certbot is already installed
if command -v certbot &>/dev/null; then
    echo "certbot already installed"
else
    # Install certbot and plugin since it's not installed already
    # Instructions from https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt
    echo "Installing certbot and plugins"
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
    # --reinstall: If the requested certificate matches an existing
    #      certificate, always keep the existing one until it is
    #      due for renewal
    # --redirect: Forces HTTPS.
    # --expand: Adds domains to an existing certificate.
    # --allow-subset-of-names: Issues a certificate even if some domains fail validation.
    sudo certbot \
        -n \
        -d ${domain} \
        --dns-route53 \
        --nginx \
        --agree-tos \
        --email ${contact} \
        --reinstall \
        --redirect \
        --expand \
        --allow-subset-of-names

    systemctl reload k

    # re-uploading the certificate in case of renewal during certbot installation
    tar -czvf /tmp/backup.tar.gz /etc/letsencrypt/*
    aws s3 cp /tmp/backup.tar.gz ${bucket_path}/backup.tar.gz

    add_cron_job
    exit
fi

# obtain, install, and upload certificate to S3 bucket since it does not exist already
echo "Obtaining certificate"
sudo certbot certonly \
    -n \
    -d ${domain} \
    --dns-route53 \
    --nginx \
    --email ${contact} \
    --agree-tos \
    --redirect \
    --allow-subset-of-names

echo "Uploading certificate to S3 bucket"
tar -czvf /tmp/backup.tar.gz /etc/letsencrypt/*
aws s3 cp /tmp/backup.tar.gz ${bucket_path}/backup.tar.gz

echo "Adding cron job"
add_cron_job
