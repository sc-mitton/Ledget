class InvalidAuthHeaderError(Exception):
    def __init__(self):
        super().__init__('Invalid Authorization header.')
