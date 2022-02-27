class UsuarioSession:
    def __init__(self, request):
        self.request = request
        self.session = request.session
        usuario = self.session.get("usuario")
        if not usuario:
            usuario = self.session["usuario"] = None
        self.usuario = usuario

    def autenticate(self, usuario):
        self.usuario = usuario
        self.save()

    def save(self):
        self.session["usuario"] = self.usuario
        self.session.modified = True

    def delete_session(self):
        self.session["usuario"] = None
        self.session.modified = True