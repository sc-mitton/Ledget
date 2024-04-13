
class InMemorySession:

    def __init__(self):
        self._devices = []
        self._aal = None
        self._auth_methods = []
        self._id = None
        self._device = None

    @property
    def device(self):
        return self._device

    @property
    def devices(self):
        return self._devices

    @devices.setter
    def devices(self, value: list):
        self._devices = value

    @property
    def aal(self):
        return self._aal

    @aal.setter
    def aal(self, value):
        self._aal = value

    @property
    def auth_methods(self):
        return self._auth_method

    @auth_methods.setter
    def auth_methods(self, value):
        self._auth_method = value

    @property
    def id(self):
        return self._id
