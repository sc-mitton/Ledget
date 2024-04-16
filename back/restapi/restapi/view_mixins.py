
class BulkSerializerMixin:

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(BulkSerializerMixin, self).get_serializer(*args, **kwargs)
