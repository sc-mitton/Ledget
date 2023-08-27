from rest_framework.serializers import Serializer as S

import logging
logger = logging.getLogger('ledget')


class NestedCreateMixin:
    '''
    Mixin to allow for nested bulk create.
    Will work for any serializer that has nested objects.
    '''

    def create(self, validated_data):
        data = [validated_data] \
               if not isinstance(validated_data, list) \
               else validated_data

        return self.recursive_create(data, self.__class__)

    def recursive_create(self, validated_data, serializer_class: S):

        nested_obj_fields = self.get_serializer_nested_fields(serializer_class)

        new_objs, nested_objs = self.bulk_create_objects(
            model=serializer_class.Meta.model,
            validated_data=validated_data,
            nested_obj_keys=list(nested_obj_fields.keys())
        )

        # Recursively create the nested objects
        # if there aren't any nested keys, this will just skip,
        # and we'll have hit our base case
        for key in nested_objs.keys():
            self.recursive_created(
                validated_data=nested_objs[key],
                serializer_class=nested_obj_fields[key]
            )

        return new_objs

    def get_serializer_nested_fields(self, serializer_class: S) -> dict:

        fields = serializer_class.__dict__['_declared_fields']

        return {key: val for key, val in fields.items() if isinstance(val, S)}

    def bulk_create_objects(self, model, validated_data: list,
                            nested_obj_keys: list) -> (list, dict):
        '''
        Bulk create the objects, and return the nested_objects
        Example:
        [
            { 'name': 'foo', 'nested_key': [ { 'name': 'bar', 'age: 16 } ] },
            ...
        ]

        :param model: The model to create
        :param validated_data: The data to create the db objects with
        :param nested_keys: The keys that are nested
        '''

        objs = []
        nested_objs = {key: [] for key in nested_obj_keys}
        has_user_field = hasattr(model, 'user')

        for obj in validated_data:
            for key in obj.keys():
                if key in nested_objs:
                    nested_objs[key].append({
                        **obj[key],
                        model.__name__.lower(): obj
                    })

            if has_user_field:
                obj['user'] = self.context['request'].user

            objs.append(model(**obj))

        try:
            new_objs = model.objects.bulk_create(objs)
        except Exception as e:
            logger.error(f"Error creating {model.__name__} objects: {e}")

        return new_objs, nested_objs
