from django.http import JsonResponse
from django.shortcuts import render
from .models import *
from django.http import JsonResponse

# Create your views here.
def vwIndex(request):
    return render(request, "simulador/proyecto.html")


def vwFlujo(request):
    return render(request, "simulador/flujo_efectivo.html")

def vwGuardarActividad(request):
    try:
        id_actividad = int(request.POST['id_actividad'])
        if id_actividad > 0:
            actividad = ActFinancieras.objects.get(id = id_actividad)
        else:
            actividad = ActFinancieras()
            tipo_cuenta = TiposCuentas.objects.get(id = request.POST['id_tipo_cuenta'])
            actividad.tipo_cuenta = tipo_cuenta

        actividad.nombres = request.POST['nom_actividad']
        actividad.save()
        return JsonResponse({'id_actividad': actividad.id})
    except Exception as e: 
        return JsonResponse({'id_actividad': '0'})

def vwGuardarValor(request):
    try:
        id_valor = int(request.POST['id_valor'])
        if id_valor > 0:
            flujo_efectivo = FlujoEfectivos.objects.get(id = id_valor)
        else:
            flujo_efectivo = FlujoEfectivos()
            # obtener el id desde el objeto sesión
            proyecto = Proyectos.objects.get(id = 1)
            actividad = ActFinancieras.objects.get(id = int(request.POST['id_actividad']))
            flujo_efectivo.proyecto = proyecto
            flujo_efectivo.actividad = actividad

        flujo_efectivo.valor = request.POST['valor']
        flujo_efectivo.mes = request.POST['mes']
        flujo_efectivo.save()
        return JsonResponse({'id_valor': flujo_efectivo.id})
    except Exception as e: 
        return JsonResponse({'id_valor': '0'})

# def listar_proyectos(request):

