from django.shortcuts import render
from django.http import JsonResponse


# Create your views here.
def vwIndex(request):
    return render(request, "simulador/proyecto.html")


def vwFlujo(request):
    return render(request, "simulador/flujo_efectivo.html")

# def listar_proyectos(request):
