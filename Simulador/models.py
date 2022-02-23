from django.db import models
from fernet_fields import EncryptedTextField

# Create your models here.
class Usuarios(models.Model):
    nombres = models.CharField(max_length = 60)
    correo = models.EmailField(max_length = 75, unique = True)
    clave = EncryptedTextField()
    habilitado = models.BooleanField(default = True)
    foto_perfil = models.ImageField(upload_to = "Perfiles", null = True, blank = True)
    conf_correo = models.BooleanField(default = True)

class Proyectos(models.Model):
    nombre = models.CharField(max_length = 60)
    descripcion = models.CharField(max_length = 250)
    inversion = models.DecimalField(max_digits = 12, decimal_places = 2)
    tasa_interes = models.DecimalField(max_digits = 3, decimal_places = 2)
    tasa_retorno = models.DecimalField(max_digits = 3, decimal_places = 2)
    periodo_anio = models.IntegerField()
    usuario = models.ForeignKey(Usuarios, on_delete = models.PROTECT, related_name = "proyectos")
 
class TiposCuentas(models.Model):
    nombre = models.CharField(max_length = 25)

class ActFinancieras(models.Model):
    nombres = models.CharField(max_length = 80)
    tipo_cuenta = models.ForeignKey(TiposCuentas, on_delete = models.PROTECT)

class FlujoEfectivos(models.Model):
    mes = models.IntegerField()
    valor = models.DecimalField(max_digits = 12, decimal_places = 2)
    actividad = models.ForeignKey(ActFinancieras, on_delete = models.PROTECT)
    proyecto = models.ForeignKey(Proyectos, on_delete = models.PROTECT, related_name = "flujo_efectivos")
