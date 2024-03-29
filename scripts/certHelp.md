## Using the self signed ssl cert scripts

1. First, generate a certificate authority with becomeCA.sh. In the script it will automatically
    add the authority to the trusted authorities in the keychain (for macs). If using another machine
    you'll have to add it manually.
    `becomeCA.sh ledget`
2. Create certificates using this certificate authority using genCRT.sh
    `genCRT.sh -d localhost -k ledgetCA.sh -p ledgetCA.pem`
3. Add the authority to Firefox. settings > privacy & security > certificates > view certificates > authorities > import
