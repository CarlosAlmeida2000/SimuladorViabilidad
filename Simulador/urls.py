import imp
from django.urls import path

from Simulador import views

urlpatterns = [
    path("", views.vwIndex, name='index'),
    path("flujo-efectivo/", views.vwFlujo, name="flujo_efectivo"),
    path("guardar-actividad/", views.vwGuardarActividad, name="guardar-actividad"),
    path("guardar-valor/", views.vwGuardarValor, name="guardar-valor"),
    path("guardar-proyecto/",views.vwGuardarProyecto, name="guardar-proyecto"),
    # path("lista-proyectos", views.listar_proyectos, name="ls-proyectos"),
]