from django.urls import path, include
from rest_framework.routers import SimpleRouter, Route, DynamicRoute

from budget.views import (
    CategoryViewSet,
    BillViewSet,
    ReminderView
)


class CustomCategoriesRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={
                'get': 'list',
                'post': 'create',
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{url_path}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),
    ]


categories_router = CustomCategoriesRouter(trailing_slash=False)
categories_router.register('categories', CategoryViewSet, basename='categories')


class CustomBillsRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={
                'get': 'list',
                'post': 'create',
                'put': 'update',
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        Route(
            url=r'^{prefix}/{lookup}$',
            mapping={'put': 'update'},
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{lookup}/{url_path}$',
            name='{basename}-{url_name}',
            detail=True,
            initkwargs={}
        ),
    ]


bills_router = CustomBillsRouter(trailing_slash=False)
bills_router.register('bills', BillViewSet, basename='bills')

urlpatterns = [
    path('', include(categories_router.urls)),
    path('', include(bills_router.urls)),
    path('reminders', ReminderView.as_view(), name='reminders')
]
