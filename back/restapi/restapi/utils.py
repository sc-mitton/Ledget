from datetime import datetime

from django.utils.http import urlencode
from django.urls import reverse as django_reverse


def reverse(view, urlconf=None, args=None, kwargs=None, current_app=None,
            query_kwargs=None):
    '''Custom reverse to handle query strings.
    Usage:
        reverse('app.views.my_view', kwargs={'pk': 123}, query_kwargs={'search': 'Bob'})
    '''
    base_url = django_reverse(view, urlconf=urlconf, args=args, kwargs=kwargs,
                              current_app=current_app)
    if query_kwargs:
        return '{}?{}'.format(base_url, urlencode(query_kwargs))
    return base_url


def months_between(start: datetime, end: datetime, accuracy: int = 0) -> int | float:
    '''Return the number of months between two dates'''
    if (accuracy == 0):
        return (end.year - start.year) * 12 + end.month - start.month
    else:
        # Return float if accuracy is not 0, for days if
        return (end.year - start.year) * 12 + \
            end.month - start.month + \
            round((end.day - start.day) / 30, accuracy)
