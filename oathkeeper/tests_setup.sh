#!/bin/bsh

# Set the environment variables for the test
export _LAMBDA_SERVER_PORT=8080
export ENVIRONMENT=test

# Compile the rules and event jsonnet files
# Either compile all rules or compile a specific rule if an argument is passed

jsonnet rules.test.jsonnet > rules.json

events="allow-anonymous deny-anonymous allow-with-auth"

if [ -z $1 ]; then
    jsonnet event.jsonnet --ext-str $1 > event.json
else
    for event in $events; do
        jsonnet test_event.jsonnet --ext-str path=$event > ${event}-event.json
    done
fi

# Compile the Go code
go build -v -gcflags='all=-N -l' -o ./bootstrap
