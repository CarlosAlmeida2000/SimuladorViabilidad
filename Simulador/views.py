from django.shortcuts import render

# Create your views here.
def vwIndex(request):
    return render(request, "simulador/proyecto.html")