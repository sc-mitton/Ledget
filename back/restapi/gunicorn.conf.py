import multiprocessing

max_requests = 1000
max_requests_jitter = 50
timeout = 10

log_file = "-"
workers = multiprocessing.cpu_count() * 2 + 1

certfile = "/etc/pki/tls/certs/server.crt"
keyfile = "/etc/pki/tls/private/server.key"

bind = "0.0.0.0:8000"
module = "restapi.wsgi:application"
