from decimal import Decimal
import json
from django.http import JsonResponse
from django.shortcuts import render
from .models import *

#region Vistas
def vwIndex(request):
    proyectos = Usuarios.objects.get(pk=1).proyectos.all()
    return render(request, "simulador/proyecto.html", {"proyectos":proyectos})

def vwSpinner(request):
    return render(request, "components/spinner.html")

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

        flujo_efectivo.valor = str(request.POST['valor']).replace(',', '.')
        flujo_efectivo.mes = request.POST['mes']
        flujo_efectivo.save()
        return JsonResponse({'id_valor': flujo_efectivo.id})
    except Exception as e: 
        return JsonResponse({'id_valor': '0'})
#endregion 

#region Metodos
# def listar_proyectos(request):
#     proyectos = Usuarios.objects.get(pk=1).proyectos.all()
#     data = []
#     for proyecto in proyectos:
#         data_proyecto = {}
#         data_proyecto['nombres'] = proyecto.nombre
#         data_proyecto['descripcion'] = proyecto.descripcion
#         data.append(data_proyecto)

#     return JsonResponse(data, safe=False)
#endregion
