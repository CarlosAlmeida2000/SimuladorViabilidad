import imp
from unicodedata import name
from django.urls import path

from Simulador import views

urlpatterns = [
    #region Flujo de efectivo
    path("flujo-efectivo/<int:project_id>", views.vwFlujo, name="flujo-efectivo"),
    path("guardar-actividad/", views.guardarActividad, name="guardar-actividad"),
    path("eliminar-actividad/", views.eliminarActividad, name="eliminar-actividad"),
    path("guardar-valor/", views.guardarValor, name="guardar-valor"),
    path("calcular-viabilidad/", views.calcularViabilidad, name="calcular-viabilidad"),
    path("spinner/", views.vwSpinner, name="spinner"),
    #endregion

    #region CRUD proyecto
    path("", views.vwIndex, name="index"),
    path("guardar-proyecto/", views.guardarProyecto, name="guardar-proyecto"),
    path("buscar-proyectos", views.buscarProyectos, name="buscar-proyectos"),
    path("eliminar-proyecto/", views.eliminar_proyecto, name="eliminar-proyecto"),
    path("editar-proyecto/", views.editarProyecto, name="editar-proyecto"),
    #endregion

    #region Control de usuario
    path("login", views.vwLogin, name="login"),
    path("registrar", views.vwRegistre, name="registre"),
    path("sign-out", views.sign_out, name="sign-out"),
    path("logout", views.logout, name="logout"),
    path("registre", views.registre, name="regitrame"),
    #endregion
]
