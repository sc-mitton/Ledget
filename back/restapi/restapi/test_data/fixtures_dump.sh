python ../../manage.py dumpdata financials.Account --indent 4 > ./account_fixture.json
python ../../manage.py dumpdata budget.Bill --indent 4 > ./bill_fixture.json
python ../../manage.py dumpdata budget.Category --indent 4 > ./category_fixture.json
python ../../manage.py dumpdata financials.Institution --indent 4 > ./institution_fixture.json
python ../../manage.py dumpdata financials.PlaidItem --indent 4 > ./plaid_item_fixture.json
python ../../manage.py dumpdata budget.Reminder --indent 4 > ./reminder_fixture.json
python ../../manage.py dumpdata financials.Transaction --indent 4 > ./transaction_fixture.json
python ../../manage.py dumpdata core.User --indent 4 > ./user_fixture.json
python ../../manage.py dumpdata core.Account --indent 4 > ./core_account_fixture.json
python ../../manage.py dumpdata core.Customer --indent 4 > ./customer_fixture.json
python ../../manage.py dumpdata financials.UserAccount --indent 4 > ./user_account_fixture.json
python ../../manage.py dumpdata budget.UserCategory --indent 4 > ./user_category_fixture.json
python ../../manage.py dumpdata budget.userBill --indent 4 > ./user_bill_fixture.json
python ../../manage.py dumpdata core.Settings --indent 4 > ./settings_fixture.json


# Use sed to replace all account ids
old_account_id=$(sed -n 's/.*"account_id": *"\([^"]*\)".*/\1/p' ./responses/plaid_sync_response.json | head -1)
first_account_id=$(sed -n 's/.*"pk": *"\([^"]*\)".*/\1/p' account_fixture.json | head -1)

sed -i "s/<${old_account_id}>/${first_account_id}/g" ./responses/plaid_sync_response_2.json

# Use sed to replace all the item ids

old_item_id=$(sed -n 's/.*"item_id": *"\([^"]*\)".*/\1/p' ./plaid_webhook_objects/error.json | head -1)
first_item_id=$(sed -n 's/.*"pk": *"\([^"]*\)".*/\1/p' plaid_item_fixture.json | head -1)

sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/error.json
sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/login_repaired.json
sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/new_accounts_available.json
sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/pending_expiration.json
sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/sync_updates_available.json
sed -i "s/<${old_item_id}>/${first_item_id}/g" ./plaid_webhook_objects/user_permission_revoked.json
