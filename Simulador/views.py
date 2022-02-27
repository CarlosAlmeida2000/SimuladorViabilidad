from decimal import Decimal
from re import A
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from django.db.models import F, Q
from .models import *

#region Vistas
def vwIndex(request):
    proyectos = Usuarios.objects.get(pk=1).proyectos.all()
    return render(request, "simulador/proyecto.html", {"proyectos":proyectos})

def vwSpinner(request):
    return render(request, "components/spinner.html")

def vwFlujo(request):
    # obtener el id del proyecto desde el objeto sesión
    flujo_efectivo = FlujoEfectivos.objects.filter(proyecto__id = 1).select_related('proyecto').select_related('actividad')
    ingresos = obtenerActividades(flujo_efectivo, 1)
    costos_a = obtenerActividades(flujo_efectivo, 2)
    costos_p = obtenerActividades(flujo_efectivo, 3)
    costos_i = obtenerActividades(flujo_efectivo, 4)
    return render(request, "simulador/flujo_efectivo.html", {'ingresos': ingresos, 'costos_a': costos_a, 'costos_p': costos_p, 'costos_i': costos_i})

def obtenerActividades(flujo_efectivo, id_tipo_cuenta):
    # obtener las actividades segun si tipo de cuenta, cada objeto queryset tiene todos sus valores $ de los 12 meses
    actividades = flujo_efectivo.filter(actividad__tipo_cuenta__id = id_tipo_cuenta).distinct('actividad_id').annotate(valor_mes1 = F('valor')
        ).annotate(valor_mes2 = F('valor')).annotate(valor_mes3 = F('valor')).annotate(valor_mes4 = F('valor')).annotate(valor_mes5 = F('valor')
        ).annotate(valor_mes6 = F('valor')).annotate(valor_mes7 = F('valor')).annotate(valor_mes8 = F('valor')).annotate(valor_mes9 = F('valor')
        ).annotate(valor_mes10 = F('valor')).annotate(valor_mes11 = F('valor')).annotate(valor_mes12 = F('valor')
        ).annotate(id_valor_mes1 = F('id')).annotate(id_valor_mes2 = F('id')).annotate(id_valor_mes3 = F('id')
        ).annotate(id_valor_mes4 = F('id')).annotate(id_valor_mes5 = F('id')).annotate(id_valor_mes6 = F('id')
        ).annotate(id_valor_mes7 = F('id')).annotate(id_valor_mes8 = F('id')).annotate(id_valor_mes9 = F('id')
        ).annotate(id_valor_mes10 = F('id')).annotate(id_valor_mes11 = F('id')).annotate(id_valor_mes12 = F('id')).values('actividad_id', 'actividad__nombres',
        'valor_mes1', 'valor_mes2', 'valor_mes3', 'valor_mes4', 'valor_mes5', 'valor_mes6', 'valor_mes7', 'valor_mes8', 'valor_mes9', 'valor_mes10', 'valor_mes11', 'valor_mes12',
        'id_valor_mes1', 'id_valor_mes2', 'id_valor_mes3', 'id_valor_mes4', 'id_valor_mes5', 'id_valor_mes6', 'id_valor_mes7', 'id_valor_mes8', 'id_valor_mes9', 'id_valor_mes10', 'id_valor_mes11', 'id_valor_mes12')
    print(len(actividades))
    lstcampos_meses = ['valor_mes1', 'valor_mes2', 'valor_mes3', 'valor_mes4', 'valor_mes5', 'valor_mes6', 'valor_mes7', 'valor_mes8', 'valor_mes9', 'valor_mes10', 'valor_mes11', 'valor_mes12']
    numero_mes = 1
    for ingreso in actividades:
        actividad = flujo_efectivo.filter(actividad__id = ingreso['actividad_id'])
        for mes in lstcampos_meses:
            if actividad.filter(mes = numero_mes):
                valor_mes = actividad.get(mes = numero_mes)
                ingreso[mes] = str(valor_mes.valor).replace('.', ',')  
                ingreso['id_'+ mes] = valor_mes.id
            else: 
                ingreso[mes] = ''
                ingreso['id_'+ mes] = -1
            numero_mes += 1
        if(numero_mes == 13):
            numero_mes = 1
    return actividades   
    
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

def vwGuardarProyecto(request):
    try:
        proyecto = Proyectos()
        proyecto.nombre = request.POST['pr_nombre']
        proyecto.descripcion = request.POST['pr_descripcion']
        proyecto.inversion = 0
        proyecto.tasa_interes = 0
        proyecto.tasa_retorno = 0
        proyecto.periodo_anio = 0
        proyecto.usuario = Usuarios.objects.get(pk=1)
        proyecto.save()
        messages.success(request, "Su proyecto ha sido guardado")
        return redirect('index')        
    except Exception as e:
        messages.error(request, "Hubo un error al guardar los datos, intenta nuevamente más tarde")
        return redirect('index')        

def vwLogin(request):
    return render(request, "auth/login.html")

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
