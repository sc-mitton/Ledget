#!/usr/bin/expect -f
#

set timeout 10
set EMAIL_FILE [lindex $argv 0]
set PASSWORD_FILE [lindex $argv 1]
set EMAIL [exec cat $EMAIL_FILE]
set PASSWORD [exec cat $PASSWORD_FILE]
spawn ory auth

expect -re "Do you want.*"
send -- "y\r"

expect "Email: "
send -- "$EMAIL\r"

expect "Password: "
send -- "$PASSWORD\r"

expect eof
