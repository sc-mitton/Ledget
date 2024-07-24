
class OrySession:

    def __init__(self, id, aal, devices=[], auth_methods=[]):
        self._id = id
        self._aal = aal
        self._devices = devices
        self._auth_methods = auth_methods

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
        return self._auth_methods

    @auth_methods.setter
    def auth_methods(self, value):
        self._auth_methods = value

    @property
    def id(self):
        return self._id
