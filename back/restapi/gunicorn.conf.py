import multiprocessing

max_requests = 1000
max_requests_jitter = 50
timeout = 100

log_file = "-"
workers = multiprocessing.cpu_count() * 2 + 1

bind = "0.0.0.0:8000"
module = "restapi.wsgi:application"
