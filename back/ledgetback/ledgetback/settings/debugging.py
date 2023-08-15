from .base import *  # noqa

from .base import MIDDLEWARE, LOGGING

MIDDLEWARE += ['qinspect.middleware.QueryInspectMiddleware']

LOGGING['loggers']['qinspect'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
    'propagate': True,
}

# Whether the Query Inspector should do anything (default: False)
QUERY_INSPECT_ENABLED = True
# Whether to log the stats via Django logging (default: True)
QUERY_INSPECT_LOG_STATS = True
# Whether to add stats headers (default: True)
QUERY_INSPECT_HEADER_STATS = True
# Whether to log duplicate queries (default: False)
QUERY_INSPECT_LOG_QUERIES = True
# Whether to log queries that are above an absolute limit
# (default: None - disabled)
QUERY_INSPECT_ABSOLUTE_LIMIT = 100  # in milliseconds
# Whether to log queries that are more than X standard deviations
# above the mean query time (default: None - disabled)
QUERY_INSPECT_STANDARD_DEVIATION_LIMIT = 2
# Whether to include tracebacks in the logs (default: False)
QUERY_INSPECT_LOG_TRACEBACKS = False
# Project root (a list of directories, see below - default empty)
QUERY_INSPECT_TRACEBACK_ROOTS = []
# Minimum number of duplicates needed to log the query (default: 2)
QUERY_INSPECT_DUPLICATE_MIN = 2  # to force logging of all queries
# Whether to truncate SQL queries in logs to specified size, for
# readability purposes (default: None - full SQL query is included)
QUERY_INSPECT_SQL_LOG_LIMIT = 120  # limit to 120 chars
