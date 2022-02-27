import imp
from unicodedata import name
from django.urls import path

from Simulador import views

urlpatterns = [
    path("", views.vwIndex, name="index"),
    path("flujo-efectivo/", views.vwFlujo, name="flujo_efectivo"),
    path("guardar-actividad/", views.vwGuardarActividad, name="guardar-actividad"),
    path("guardar-valor/", views.vwGuardarValor, name="guardar-valor"),
    path("calcular-viabilidad/", views.vwCalcularViabilidad, name="calcular-viabilidad"),
    path("spinner/", views.vwSpinner, name="spinner"),
    path("guardar-proyecto/", views.vwGuardarProyecto, name="guardar-proyecto"),
    path("eliminar-proyecto/", views.eliminar_proyecto, name="eliminar-proyecto"),
    path("editar-proyecto/", views.editar_proyecto, name="editar-proyecto"),
    path("login", views.vwLogin, name="login"),
    path("registrar", views.vwRegistre, name="registre"),
    path("sign-out", views.sign_out, name="sign-out"),
    path("logout", views.logout, name="logout"),
    path("registre", views.registre, name="regitrame"),
    # path("lista-proyectos", views.listar_proyectos, name="ls-proyectos"),
]
