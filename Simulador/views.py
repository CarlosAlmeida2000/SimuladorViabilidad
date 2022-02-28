from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from django.db.models import F, Q
import numpy_financial as npf
import math, json
from Simulador.UsuarioSession import UsuarioSession
from .models import *

#region Flujo de efectivo

def vwSpinner(request):
    return render(request, "components/spinner.html")


def vwFlujo(request, project_id):
    if not "usuario" in request.session:
        return redirect("login")
    proyecto = Proyectos.objects.get(pk=project_id)
    proyecto.inversion = str(proyecto.inversion).replace(".", ",")
    proyecto.tasa_interes = str(proyecto.tasa_interes).replace(".", ",")
    proyecto.tasa_retorno = str(proyecto.tasa_retorno).replace(".", ",")
    
    ingresos = obtenerActividades(project_id, 1)
    costos_a = obtenerActividades(project_id, 2)
    costos_p = obtenerActividades(project_id, 3)
    costos_i = obtenerActividades(project_id, 4)
    return render(
        request,
        "simulador/flujo_efectivo.html",
        {
            "ingresos": ingresos,
            "costos_a": costos_a,
            "costos_p": costos_p,
            "costos_i": costos_i,
            "proyecto": proyecto,
        },
    )


def obtenerActividades(project_id, id_tipo_cuenta):
    try:

        flujo_efectivo = (
            FlujoEfectivos.objects.filter(Q(proyecto__id=project_id) & Q(actividad__tipo_cuenta__id = id_tipo_cuenta))
            .select_related("proyecto")
            .select_related("actividad")
        )
        # obtener las actividades segun si tipo de cuenta, cada objeto queryset tiene todos sus valores $ de los 12 meses
        actividades = (
            ActFinancieras.objects.filter(Q(proyecto__id=project_id) & Q(tipo_cuenta__id=id_tipo_cuenta))
            .annotate(valor_mes1=F("nombre"))
            .annotate(valor_mes2=F("nombre"))
            .annotate(valor_mes3=F("nombre"))
            .annotate(valor_mes4=F("nombre"))
            .annotate(valor_mes5=F("nombre"))
            .annotate(valor_mes6=F("nombre"))
            .annotate(valor_mes7=F("nombre"))
            .annotate(valor_mes8=F("nombre"))
            .annotate(valor_mes9=F("nombre"))
            .annotate(valor_mes10=F("nombre"))
            .annotate(valor_mes11=F("nombre"))
            .annotate(valor_mes12=F("nombre"))
            .annotate(id_valor_mes1=F("id"))
            .annotate(id_valor_mes2=F("id"))
            .annotate(id_valor_mes3=F("id"))
            .annotate(id_valor_mes4=F("id"))
            .annotate(id_valor_mes5=F("id"))
            .annotate(id_valor_mes6=F("id"))
            .annotate(id_valor_mes7=F("id"))
            .annotate(id_valor_mes8=F("id"))
            .annotate(id_valor_mes9=F("id"))
            .annotate(id_valor_mes10=F("id"))
            .annotate(id_valor_mes11=F("id"))
            .annotate(id_valor_mes12=F("id"))
            .values(
                "id",
                "nombre",
                "valor_mes1",
                "valor_mes2",
                "valor_mes3",
                "valor_mes4",
                "valor_mes5",
                "valor_mes6",
                "valor_mes7",
                "valor_mes8",
                "valor_mes9",
                "valor_mes10",
                "valor_mes11",
                "valor_mes12",
                "id_valor_mes1",
                "id_valor_mes2",
                "id_valor_mes3",
                "id_valor_mes4",
                "id_valor_mes5",
                "id_valor_mes6",
                "id_valor_mes7",
                "id_valor_mes8",
                "id_valor_mes9",
                "id_valor_mes10",
                "id_valor_mes11",
                "id_valor_mes12",
            )
        )
        lstcampos_meses = [
            "valor_mes1",
            "valor_mes2",
            "valor_mes3",
            "valor_mes4",
            "valor_mes5",
            "valor_mes6",
            "valor_mes7",
            "valor_mes8",
            "valor_mes9",
            "valor_mes10",
            "valor_mes11",
            "valor_mes12",
        ]
        numero_mes = 1
        for act in actividades:
            # se obtienen todas las actividades según el id de tipo de cuenta enviado por parámetro
            efectivos = flujo_efectivo.filter(actividad__id=act["id"])
            # es necesario recorrer cada mes para obtener su valor
            for campo_mes in lstcampos_meses:
                # verifica si existe una valor guardado con ese mes
                if efectivos.filter(mes=numero_mes):
                    # se obtiene el valor de ese mes
                    activi = efectivos.get(mes=numero_mes)
                    # se asigna el valor
                    act[campo_mes] = str(activi.valor).replace(".", ",")
                    # se asigna el id del valor
                    act["id_" + campo_mes] = activi.id
                else:
                    # no existe un valor para ese mes
                    act[campo_mes] = ""
                    act["id_" + campo_mes] = -1
                numero_mes += 1
            if numero_mes == 13:
                numero_mes = 1
        return actividades
    except Exception as e:
        return None


def guardarActividad(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        id_actividad = int(request.POST["id_actividad"])
        if id_actividad > 0:
            actividad = ActFinancieras.objects.get(id=id_actividad)
        else:
            # es negativo, se registra la nueva actividad
            actividad = ActFinancieras()
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            tipo_cuenta = TiposCuentas.objects.get(id=request.POST["id_tipo_cuenta"])
            actividad.tipo_cuenta = tipo_cuenta
            actividad.proyecto = proyecto
        actividad.nombre = request.POST["nom_actividad"]
        actividad.save()
        return JsonResponse({"id_actividad": actividad.id})
    except Exception as e:
        return JsonResponse({"id_actividad": "0"})


def eliminarActividad(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        actividades_flujo = FlujoEfectivos.objects.filter(actividad__id = request.POST["id_actividad"])
        actividades_flujo.delete()
        actividad = ActFinancieras.objects.filter(pk = request.POST["id_actividad"])
        actividad.delete()
        return JsonResponse({'eliminada': '1'})
    except Exception as e:
        return JsonResponse({'eliminada': '0'})


def guardarValor(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        id_valor = int(request.POST["id_valor"])
        if id_valor > 0:
            flujo_efectivo = FlujoEfectivos.objects.get(id=id_valor)
        else:
            # es negativo, se registra el nuevo valor
            flujo_efectivo = FlujoEfectivos()
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            actividad = ActFinancieras.objects.get(id=int(request.POST["id_actividad"]))
            flujo_efectivo.proyecto = proyecto
            flujo_efectivo.actividad = actividad
        flujo_efectivo.valor = request.POST["valor"]
        flujo_efectivo.mes = request.POST["mes"]
        flujo_efectivo.save()
        return JsonResponse({"id_valor": flujo_efectivo.id})
    except Exception as e:
        return JsonResponse({"id_valor": "0"})


def calcularViabilidad(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        tir, van, razon_bc, pri = 0, 0, 0, 0
        a, b, c, d = 0, 0, 0, 0
        anios, meses, dias = 0, 0, 0
        flujos_neto = []
        flujos_neto2 = []
        flujo_acumulado = []
        inversion = float(request.POST["inversion"])
        flujos_neto2.append((inversion * -1))
        tasa_interes = float(request.POST["tasa_interes"])
        # se obtiene el json del flujo neto
        flujo_neto = json.loads(r"" + json.loads(json.dumps(request.POST["fen_neto"])))
        for i in range(len(flujo_neto["fen_neto"])):
            flujos_neto.append(flujo_neto["fen_neto"][i]["valor"])
            flujos_neto2.append(flujo_neto["fen_neto"][i]["valor"])
        # se obtienen el json del flujo acumulado
        flujo_acum = json.loads(r"" + json.loads(json.dumps(request.POST["fen_acum"])))
        for i in range(len(flujo_acum["fen_acum"])):
            flujo_acumulado.append(flujo_acum["fen_acum"][i]["valor"])
        tir = round((npf.irr(flujos_neto2)) * 100, 2)
        van = round(npf.npv(tasa_interes, flujos_neto2), 2)
        razon_bc = round((npf.npv(tasa_interes, flujos_neto)) / inversion, 2)
        # se obtiene el valor de a para calcular el PRI
        for f in range(len(flujo_acumulado)):
            if flujo_acumulado[f] >= inversion:
                if f == 0:
                    a = 1
                    break
                else:
                    a = f
                    break
        b = inversion
        c = abs(flujo_acumulado[a - 1])
        d = abs(flujos_neto[a])
        pri = round(a + (b - c) / d, 2)
        # se obtiene la parte entera que son los años
        parte_decimal_pri, parte_entera1 = math.modf(pri)
        anios = parte_entera1
        # se obtiene la parte entera que son los meses
        parte_decimal_meses, parte_entera2 = math.modf(parte_decimal_pri * 12)
        meses = parte_entera2
        # se obtiene la parte entera que son los días
        parte_decimal3, parte_entera3 = math.modf(parte_decimal_meses * 30)
        dias = parte_entera3
        return JsonResponse(
            {
                "viabilidad": "1",
                "tir": tir,
                "van": van,
                "razon_bc": razon_bc,
                "anios": anios,
                "meses": meses,
                "dias": dias,
            }
        )
    except Exception as e:
        return JsonResponse({"viabilidad": "0"})

#endregion

#region CRUD proyecto

def vwIndex(request):
    if not "usuario" in request.session:
        return redirect("login")
    proyectos = Usuarios.objects.get(
        pk=request.session["usuario"]["id"]
    ).proyectos.all()
    return render(request, "simulador/proyecto.html", {"proyectos": proyectos})


def buscarProyectos(request):
    proyectos = Usuarios.objects.get(pk=1).proyectos.all()
    data = []
    for proyecto in proyectos:
        data_proyecto = {}
        data_proyecto['nombres'] = proyecto.nombre
        data_proyecto['descripcion'] = proyecto.descripcion
        data.append(data_proyecto)

    return JsonResponse(data, safe=False)


def guardarProyecto(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        proyecto = Proyectos()
        proyecto.nombre = request.POST["pr_nombre"]
        proyecto.descripcion = request.POST["pr_descripcion"]
        proyecto.inversion = 0
        proyecto.tasa_interes = 0
        proyecto.tasa_retorno = 0
        proyecto.periodo_anio = 0
        proyecto.usuario = Usuarios.objects.get(pk=request.session["usuario"]["id"])
        proyecto.save()
        messages.success(request, "Su proyecto ha sido guardado")
        return redirect("index")
    except Exception as e:
        messages.error(
            request, "Hubo un error al guardar los datos, intenta nuevamente más tarde"
        )
        return redirect("index")


def eliminar_proyecto(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
        FlujoEfectivos.objects.filter(proyecto = proyecto).delete()
        ActFinancieras.objects.filter(proyecto = proyecto).delete()
        proyecto.delete()
        return JsonResponse({"eliminado": "1"})
    except Exception as e:
        return JsonResponse({"eliminado": "0"})


def editarProyecto(request):
    if not "usuario" in request.session:
        return redirect("login")
    try:
        # modificar un proyecto desde el template proyecto
        if (
            "project_id" in request.POST
            and "pr_nombre" in request.POST
            and "pr_descripcion" in request.POST
        ):
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            proyecto.nombre = request.POST["pr_nombre"]
            proyecto.descripcion = request.POST["pr_descripcion"]
        # modificar un proyecto desde el template flujo efectivo
        elif "inversion" in request.POST:
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            proyecto.inversion = request.POST["inversion"]
        elif "tasa_interes" in request.POST:
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            proyecto.tasa_interes = request.POST["tasa_interes"]
        else:
            proyecto = Proyectos.objects.get(pk=request.POST["project_id"])
            proyecto.tasa_retorno = request.POST["tasa_retorno"]
        proyecto.save()
        if "desde_flujo_efectivo" in request.POST:
            return JsonResponse({"editado": "1"})
        messages.success(request, "Su proyecto ha sido modificado")
        return redirect("/")
    except Exception as e:
        if "desde_flujo_efectivo" in request.POST:
            return JsonResponse({"editado": "0"})
        messages.error(request, "El proyecto no se pudo modificar")
        return redirect("/")

#endregion

#region Control de usuario

def vwLogin(request):
    if "usuario" in request.session:
        return redirect("index")
    return render(request, "auth/login.html")


def vwRegistre(request):
    if "usuario" in request.session:
        return redirect("index")
    return render(request, "auth/registre.html")


def registre(request):
    if "usuario" in request.session:
        return redirect("index")
    try:
        Usuarios.objects.create(
            nombres=request.POST["name"],
            correo=request.POST["email"],
            clave=request.POST["pass"],
        )
        messages.success(
            request,
            "Tu cuenta a sido creada, inicia sesión para que puedas administrar tus proyectos",
        )
        return redirect("login")
    except Exception as e:
        messages.error(request, "Creación de cuenta fallida, intenta más tarde")
        return redirect("registre")


def sign_out(request):
    if "usuario" in request.session:
        return redirect("index")
    user_session = UsuarioSession(request)
    user_session.delete_session()
    password_level = 50
    try:
        usuario = Usuarios.objects.get(correo=request.POST["email"])
        if usuario.clave == request.POST["pass"]:
            user_session.autenticate(usuario)
            return redirect("index")
        else:
            messages.add_message(request, password_level, "Contraseña incorrecta")
            return render(
                request, "auth/login.html", {"user_old": request.POST["email"]}
            )
    except Exception as e:
        messages.error(request, "Inicio de sesión fallido, usuario no existe")
        return redirect("login")


def logout(request):
    user_session = UsuarioSession(request)
    user_session.delete_session()
    return redirect("login")

#endregion