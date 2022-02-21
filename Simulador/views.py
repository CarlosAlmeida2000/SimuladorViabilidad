from django.shortcuts import render

# Create your views here.
def vwIndex(request):
    return render(request, "simulador/proyecto.html")

def vwFlujo(request):
    return render(request, "simulador/flujo_efectivo.html")