class UsuarioSession:
    def __init__(self, request):
        self.request = request
        self.session = request.session
        usuario = self.session.get("usuario")
        if not usuario:
            usuario = self.session["usuario"] = {}
        self.usuario = usuario

    def autenticate(self, usuario):
        self.usuario = {
            "id": usuario.id,
            "nombres": usuario.nombres,
            "habilitado": usuario.habilitado,
        }
        self.save()

    def save(self):
        self.session["usuario"] = self.usuario
        self.session.modified = True

    def delete_session(self):
        self.session.pop("usuario")
        self.session.modified = True
        self.session.flush()
