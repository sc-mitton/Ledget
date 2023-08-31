from rest_framework.serializers import Serializer as S
from rest_framework.serializers import ListSerializer as LS

import logging
logger = logging.getLogger('ledget')


class NestedCreateMixin:
    '''
    Mixin to allow for nested bulk create.
    Will work for any serializer that has nested objects.
    '''

    def create(self, validated_data, *args, **kwargs):
        data = [validated_data] \
               if not isinstance(validated_data, list) \
               else validated_data

        if hasattr(self, 'child'):
            serializer_class = self.child.__class__
        else:
            serializer_class = self.__class__

        return self.recursive_create(data, serializer_class=serializer_class)

    def recursive_create(self, validated_data, serializer_class):

        nested_obj_fields = self.get_serializer_nested_fields(serializer_class)

        new_objs, nested_objs = self.bulk_create_objects(
            model=self.get_model(serializer_class),
            validated_data=validated_data,
            nested_obj_keys=list(nested_obj_fields.keys())
        )

        # Recursively create the nested objects
        # if there aren't any nested keys, this will just skip,
        # and we'll have hit our base case
        for key in nested_obj_fields.keys():
            self.recursive_create(
                validated_data=nested_objs[key],
                serializer_class=nested_obj_fields[key]
            )

        return new_objs

    def get_model(self, serializer_class):
        '''
        Get the model from the serializer class
        '''
        if hasattr(serializer_class, 'Meta'):
            return serializer_class.Meta.model
        elif hasattr(serializer_class.child, 'Meta'):
            return serializer_class.child.Meta.model
        else:
            raise Exception(f"Serializer {serializer_class} has no model")

    def get_serializer_nested_fields(self, serializer_class) -> dict:

        declared_fields = serializer_class.__dict__.get('_declared_fields', {})
        fields = {key: val
                  for key, val in declared_fields.items()
                  if isinstance(val, (S, LS))}

        return fields

    def bulk_create_objects(self, model, validated_data: list,
                            nested_obj_keys: list):
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
            obj_without_nested = {
                key: val
                for key, val in obj.items()
                if key not in nested_obj_keys
            }
            if has_user_field:
                obj_without_nested['user'] = self.context['request'].user
            objs.append(model(**obj_without_nested))

            for key in nested_obj_keys:
                for nested_obj in obj[key]:
                    nested_objs[key].append({
                        **nested_obj,
                        model.__name__.lower(): objs[-1]
                    })

        try:
            new_objs = model.objects.bulk_create(objs)
        except Exception as e:
            logger.error(f"Error creating {model.__name__} objects: {e}")

        return new_objs, nested_objs


class ListCreateSerializer(NestedCreateMixin, LS):

    def create(self, validated_data):
        return super().create(validated_data)
