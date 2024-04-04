#!/bin/bash

# For all event.json files, iterate through each file
# renaming it to event.json and running the test, then marking it complete
# and moving on to the next one

tests_setup
bootstrap

for event in $(ls -1 *event.json); do
    mv $event event.json
    awslambdarpc -e event.json
    mv event.json $event
done

tests_cleanup
