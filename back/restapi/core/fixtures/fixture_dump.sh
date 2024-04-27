python ../../manage.py dumpdata core.Price --indent 4 > ./prices.json
python manage.py dumpdata core.User --indent 4 > ./users.json
python manage.py dumpdata core.Account --indent 4 > ./accounts.json
python manage.py dumpdata core.Customer --indent 4 > ./customers.json
