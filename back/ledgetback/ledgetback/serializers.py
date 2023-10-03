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

        result = self._recursive_bulk_create(data, self)
        if isinstance(self, LS):
            return result if isinstance(result, list) else [result]
        else:
            return result[0] if isinstance(result, list) else result

    def _recursive_bulk_create(self, validated_data: list, serializer) -> list:
        # Base case
        if not validated_data:
            return

        nested_fields = self._get_nested_fields(serializer)
        validated_data, nested_data = self._seperate_unnested_data(
            validated_data, nested_fields.keys()
        )

        model = self.get_model(serializer)
        new_objs = self._bulk_create_objects(model, validated_data)

        # Map the nested data from each new object into the same list
        # in order to bulk create all at the same time
        mapped_nested_data = {field: [] for field in nested_fields.keys()}
        for n, nested_objs in enumerate(nested_data):
            foreign_key_field = new_objs[n]._meta.model_name + '_id'
            foreign_key = new_objs[n].id

            for key, value in nested_objs.items():
                mapped_nested_data[key] += [
                    {**nested_obj, foreign_key_field: foreign_key}
                    for nested_obj in value
                ]

        # Recurse
        for field, serializer in nested_fields.items():
            self._recursive_bulk_create(mapped_nested_data[field], serializer)

        return new_objs

    def get_model(self, serializer):
        '''
        Get the model from the serializer class
        '''
        if hasattr(serializer, 'Meta'):
            return serializer.Meta.model
        elif hasattr(serializer.child, 'Meta'):
            return serializer.child.Meta.model
        else:
            raise Exception(f"Serializer {serializer} has no model")

    def _get_nested_fields(self, serializer) -> dict:
        '''
        Goes through the serializer's fields and returns
        an ordered dict of the nested fields (field_name: field)
        '''

        nested_fields = {}

        if (isinstance(serializer, LS)):
            fields = serializer.child.fields
        else:
            fields = serializer.fields

        for field in fields:
            if isinstance(fields[field], LS):
                nested_fields[field] = fields[field]

        return nested_fields

    def _seperate_unnested_data(self, validated_data: list,
                                nested_fields: list) -> tuple:
        '''
        Takes in the list of validated data objects and returns
        the list of objects with the nested objects stripped, and the
        nested objects expanded out into their own list.

        e.g. [
            {field1: v1, field2: v2, nestedObjs1: [...], nestedObjs2: [...], ...},
            {field1: v1, field2: v2, nestedObjs1: [...], nestedObjs2: [...], ...},
        ] ->
        [
            {field1: v1, field2: v2, ...},
            {field1: v1, field2: v2, ...},
        ],
        [
            {nestedObjs1: [...], nestedObjs2: [...], ...},
            {nestedObjs1: [...], nestedObjs2: [...], ...},
        ]
        '''

        nested_data = []

        for n, obj in enumerate(validated_data):
            nested_data.append({
                field: obj.pop(field) for field in nested_fields
                if field in obj
            })
            validated_data[n] = obj

        return validated_data, nested_data

    def _bulk_create_objects(self, model, validated_data: list):

        objs = []
        for obj in validated_data:
            objs.append(model(**obj))
        model.objects.bulk_create(objs)

        return objs
