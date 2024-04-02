
# Build the test binary and rules
jsonnet rules.jsonnet > rules.json
cd ..
go build -v -gcflags='all=-N -l' -o ./test/bootstrap
cd test

# Clean up function, remove rules.json
function cleanup {
    rm -f rules.json
    rm -f bootstrap
    rm -f event.json
}

_LAMBDA_SERVER_PORT=8080
ENVIRONMENT=test

# Test cases: allow-anonymous, deny-anonymous, allow-with-auth
# If one of the test cases is provided, run that one, otherwise run all
if [ -z "$1" ] then
    echo "Running test case $1"
    jsonnet event.jsonnet > event.json

    # Run the test case
    awslambdarpc -e event.json
    ./bootstrap
else
    test_cases="allow-anonymous deny-anonymous allow-with-auth"
    for test_case in $test_cases; do
        echo "Running test case $test_case"
        jsonnet event.jsonnet > event.json

        # Run the test case
        awslambdarpc -e event.json
        ./bootstrap
    done
fi

cleanup
