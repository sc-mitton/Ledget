class InvalidAuthHeaderError(Exception):
    def __init__(self, *args):
        super().__init__('Invalid Authorization header.')


class MissingDeviceTokenError(Exception):
    def __init__(self, *args):
        super().__init__('Missing device token.')
