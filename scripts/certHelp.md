## Using the self signed ssl cert scripts

1. First, generate a certificate authority with becomeCA.sh. In the script it will automatically
    add the authority to the trusted authorities in the keychain (for macs). If using another machine
    you'll have to add it manually.
    `becomeCA.sh ledgetCA`
2. Create certificates using this certificate authority using genCRT.sh
    `genCRT.sh -d ledget.app -k ledgetCA.sh -p ledgetCA.pem`
3. Add the authority to Firefox. settings > privacy & security > certificates > view certificates > authorities > import
4. Route the host names to localhost in etc/hosts/
    `sudo vi /etc/hosts/`
    Add the lines:
    127.0.0.1 ledget.app
    127.0.0.1 accounts.ledget.app

