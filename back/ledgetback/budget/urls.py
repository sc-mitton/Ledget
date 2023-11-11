from django.urls import path, include
from rest_framework.routers import SimpleRouter, Route, DynamicRoute

from budget.views import (
    CategoryViewSet,
    BillViewSet
)


class CustomRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={
                'get': 'list',
                'post': 'create',
                'put': 'update',
                'delete': 'destroy'
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


router = CustomRouter(trailing_slash=False)
router.register('categories', CategoryViewSet, basename='categories')
router.register('bills', BillViewSet, basename='bills')

urlpatterns = [
    path('', include(router.urls)),
]
