# Start stripe webhook listener in the background
stripe listen --forward-to https://localhost/hooks/stripe --skip-verify -H X-Forwarded-For:13.235.14.237 > stripe_listener.log &

# Make sure the listener is running
while true; do
    ps aux | grep stripe | grep listen
    if [ $? -eq 0 ]; then
        echo "Stripe webhook listener is running ✅"
        break
    fi
    sleep 1
done

# Cleanup function
function cleanup {
    local success=$1

    kill $(ps aux | grep stripe | grep listen | awk '{print $2}')
    rm stripe_listener.log

    if [ $success -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

function check_result {

    # Check the logs to make sure no 400 level errors occurred
    grep -q "400" stripe_listener.log

    if [ $? -eq 0 ]; then
        echo "Error: error occurred ❌"
        cleanup 1
    fi
}

# ------------------------------- Webhook Tests ------------------------------ #

echo "Triggering customer.created event..."
stripe trigger customer.deleted > /dev/null 2>&1
sleep 1
check_result
echo "customer.deleted test passed ✅"

echo "Triggering customer.subscription.deleted event..."
stripe trigger customer.subscription.deleted > /dev/null 2>&1
sleep 5
check_result
echo "customer.subscription.deleted test passed ✅"

echo "All tests passed ✅"
cleanup 0
