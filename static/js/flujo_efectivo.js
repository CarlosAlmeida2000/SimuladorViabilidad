var id_fila = -1;

actualizar_totales();

// mostrar spinner
function show_spinner() {
    $("#spinner").show();
    $("#spinner").addClass("mostrar-spinner");
    $("body").css("overflow", "hidden");
}

// eliminar spinner
function hide_spinner() {
    $("#spinner").hide();
    $("#spinner").removeAttr("class");
    $("body").css("overflow", "auto");
}

function guardar_actividad(input) {
    show_spinner();
    // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
    var csrftoken = getCookie("csrftoken");
    // se definen los parámetros de la petición ajax
    var params = {
        csrfmiddlewaretoken: csrftoken,
        project_id: $('#project_id').text(),
        id_actividad: $(input).attr("data-id"),
        id_tipo_cuenta: getIdTipoCuenta($(input).attr("tipo_cuenta")),
        nom_actividad: $(input).val(),
        // Aquí es donde consulto el proyecto id, este id se obtiene de la tabla mensual
        project_id: $("#table-mensual").attr("data-project-id"),
    };
    $.ajax({
            type: "POST",
            url: "/guardar-actividad/",
            data: params,
            dataType: "json",
        })
        .done(function (result) {
            hide_spinner();
            if (result.id_actividad > 0) {
                $(input).attr("data-id", result.id_actividad);
                // actualizar el id en los atributos de la fila y botón eliminar
                $(input).parent().prev().children().attr("onclick", 'eliminar_actividad(' + result.id_actividad + ')')
                $(input).parent().parent().attr("id", 'fila-' + result.id_actividad)
                // si se guarda la actividad se desbloquean los demás input de valores
                $('.' + $(input).attr("tipo_cuenta") + '-fila-' + $(input).attr("fila")).prop('disabled', false);
                toastr.success("Actividad guardada correctamente", config_toast);
                $(input).css('border-color', '#00710B');
                $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
            } else {
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
                $(input).css('border-color', '#D30000');
                $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            hide_spinner();
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            $(input).css('border-color', '#D30000');
            $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        })
        .always(function (data) {});
}

function eliminar_actividad(id_actividad) {
    show_spinner();
    if (id_actividad < 0) {
        $('#fila-' + id_actividad).remove()
        hide_spinner();
        toastr.success("La actividad fue eliminada correctamente", config_toast);
    } else {
        result_delete = confirm('¿Está seguro(a) de eliminar la actividad?');
        if (result_delete) {
            // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
            var csrftoken = getCookie("csrftoken");
            var params = {
                csrfmiddlewaretoken: csrftoken,
                'id_actividad': id_actividad,
            };
            $.ajax({
                type: "POST",
                url: "/eliminar-actividad/",
                data: params,
                dataType: "json",
            }).done(function (result) {
                hide_spinner();
                if (result.eliminada == '1') {
                    $('#fila-' + id_actividad + ' td input').each(function () {
                        $(this).val('0,00')
                    });
                    toastr.success("La actividad fue eliminada correctamente", config_toast);
                    actualizar_totales();
                    $('#fila-' + id_actividad).remove()
                } else {
                    toastr.error("Existió un error, por favor intente nuevamente", config_toast);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                hide_spinner();
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            }).always(function (data) {});
        } else {
            hide_spinner();
        }
    }
}

function getIdTipoCuenta(tipo_cuenta) {
    if (tipo_cuenta == "ingresos") {
        return 1;
    } else if (tipo_cuenta == "costos-a") {
        return 2;
    } else if (tipo_cuenta == "costos-p") {
        return 3;
    } else {
        return 4;
    }
}

function guardar_valor(input) {
    show_spinner();
    // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
    var csrftoken = getCookie("csrftoken");
    // se definen los parámetros de la petición ajax
    var params = {
        csrfmiddlewaretoken: csrftoken,
        project_id: $('#project_id').text(),
        id_valor: $(input).attr("data-id"),
        id_actividad: $("#" + $(input).parent().parent().attr("id") + " #actividad").attr("data-id"),
        valor: ($(input).val()) != '' ? parseFloat($(input).val().replace(',', '.')) : 0,
        mes: $(input).attr("mes"),
        // Aquí es donde consulto el proyecto id, este id se obtiene de la tabla mensual
        project_id: $("#table-mensual").attr("data-project-id"),
    };
    $.ajax({
            type: "POST",
            url: "/guardar-valor/",
            data: params,
            dataType: "json",
        })
        .done(function (result) {
            hide_spinner();
            if (result.id_valor > 0) {
                $(input).attr("data-id", result.id_valor);
                actualizar_totales();
                toastr.success("Valor guardado correctamente", config_toast);
                $(input).css('border-color', '#00710B');
                $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
            } else {
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
                $(input).css('border-color', '#D30000');
                $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            hide_spinner();
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            $(input).css('border-color', '#D30000');
            $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        })
        .always(function (data) {});
}

function actualizar_totales() {
    $('.sumador').each(function () {
        var total_mes = 0.00
        var total_fila = 0.00
        var total_todas_filas = 0.00
        var total_egresos_mensual = 0.00
        var total_egresos_todos_meses = 0.00
        var fen_mensual = 0.00
        var total_fen_todos_meses = 0.00
        var total_fen_acum_todos_meses = 0.00
        var fen_acum_mensual = 0.00
        var fen_acum_anterior = 0.00

        var input = $(this)
        // calcular el total del mes
        $('.' + $(input).attr("tipo_cuenta") + '-mes-' + $(input).attr("mes")).each(function () {
            if ($(this).val() != '') {
                total_mes += parseFloat($(this).val().replace(',', '.'))
            }
        });
        $('#total-' + $(input).attr("tipo_cuenta") + '-mes-' + $(input).attr("mes")).html("<div>$ " + total_mes.toFixed(2).replace('.', ',') + "</div>")
        // calcular el total de la fila
        $('.' + $(input).attr("tipo_cuenta") + '-fila-' + $(input).attr("fila")).each(function () {
            if ($(this).val() != '') {
                total_fila += parseFloat($(this).val().replace(',', '.'))
            }
        });
        $('#total-' + $(input).attr("tipo_cuenta") + '-fila-' + $(input).attr("fila")).html("<div>$ " + total_fila.toFixed(2).replace('.', ',') + "</div>")
        // calcular el total de todas las filas
        $('.total-' + $(input).attr("tipo_cuenta") + '-fila').each(function () {
            if ($(this).text() != '$ 00,00') {
                total_todas_filas += parseFloat(($(this).text()).substring(2).replace(',', '.'))
            }
        });
        $('#total-' + $(input).attr("tipo_cuenta")).html('<div> $ ' + total_todas_filas.toFixed(2).replace('.', ',') + ' </div>')
        // actualizar los totales de cada tipo de cuenta para el primer año del flujo anual
        if ($(input).attr("tipo_cuenta") == 'ingresos') {
            $('#ingreso-periodo-1').html('<div> $ ' + total_todas_filas.toFixed(2).replace('.', ',') + ' </div>')
        } else if ($(input).attr("tipo_cuenta") == 'costos-a') {
            $('#costo-a-periodo-1').html('<div> $ ' + total_todas_filas.toFixed(2).replace('.', ',') + ' </div>')
        } else if ($(input).attr("tipo_cuenta") == 'costos-p') {
            $('#costo-p-periodo-1').html('<div> $ ' + total_todas_filas.toFixed(2).replace('.', ',') + ' </div>')
        } else {
            $('#costo-i-periodo-1').html('<div> $ ' + total_todas_filas.toFixed(2).replace('.', ',') + ' </div>')
        }
        // sumar todos los egresos del mes actual
        total_egresos_mensual = (parseFloat($('#total-costos-a-mes-' + $(input).attr("mes") + ' div').text().substring(2).replace(',', '.')) +
            parseFloat($('#total-costos-p-mes-' + $(input).attr("mes") + ' div').text().substring(2).replace(',', '.')) +
            parseFloat($('#total-costos-i-mes-' + $(input).attr("mes") + ' div').text().substring(2).replace(',', '.')))
        $('#total-egresos-mes-' + $(input).attr("mes")).html('<div> $ ' + total_egresos_mensual.toFixed(2).replace('.', ',') + ' </div>')
        // total de todos los egresos de todos los meses
        $('.total-egresos div').each(function () {
            if ($(this).text() != '$ 00,00') {
                total_egresos_todos_meses += parseFloat(($(this).text()).substring(2).replace(',', '.'))
            }
        });
        $('#total-todos-egresos').html('<div> $ ' + total_egresos_todos_meses.toFixed(2).replace('.', ',') + ' </div>')
        // calcular el FEN del mes actual
        fen_mensual = parseFloat($('#total-ingresos-mes-' + $(input).attr("mes") + ' div').text().substring(2).replace(',', '.')) -
            parseFloat($('#total-egresos-mes-' + $(input).attr("mes") + ' div').text().substring(2).replace(',', '.'))
        $('#total-fen-mes-' + $(input).attr("mes")).html('<div> $ ' + fen_mensual.toFixed(2).replace('.', ',') + ' </div>')
        if (fen_mensual < 0) {
            $('#total-fen-mes-' + $(input).attr("mes")).css('color', '#D30000');
        } else {
            $('#total-fen-mes-' + $(input).attr("mes")).css('color', '#232323');
        }
        // calcular el FEN acumulado de todos los meses
        $('.fen-acumulado').each(function () {
            if ($(this).attr('mes') == '1') {
                fen_acum_mensual = (parseFloat($('#total-ingresos-mes-' + (($(this).attr('mes'))) + ' div').text().substring(2).replace(',', '.')) -
                    parseFloat($('#total-egresos-mes-' + (($(this).attr('mes'))) + ' div').text().substring(2).replace(',', '.')))
            } else {
                fen_acum_mensual = (parseFloat($('#total-fen-acum-mes-' + (($(this).attr('mes')) - 1) + ' div').text().substring(2).replace(',', '.')) +
                    parseFloat($('#total-fen-mes-' + (($(this).attr('mes'))) + ' div').text().substring(2).replace(',', '.')))
            }
            $(this).html('<div> $ ' + fen_acum_mensual.toFixed(2).replace('.', ',') + ' </div>')
            if (fen_acum_mensual < 0) {
                $(this).css('color', '#D30000');
            } else {
                $(this).css('color', '#232323');
            }
            // fen acumulado 
            total_fen_acum_todos_meses += fen_acum_mensual
        });
        // actualizar el fen acumulado total de todos los meses
        $('#total-todos-fen-acum').html('<div> $ ' + total_fen_acum_todos_meses.toFixed(2).replace('.', ',') + ' </div>')
        if (total_fen_acum_todos_meses < 0) {
            $('#total-todos-fen-acum').css('color', '#D30000');
        } else {
            $('#total-todos-fen-acum').css('color', '#232323');
        }
        // total de los fen de todos los meses
        $('.fen div').each(function () {
            if ($(this).text() != '$ 00,00') {
                total_fen_todos_meses += parseFloat(($(this).text()).substring(2).replace(',', '.'))
            }
        });
        $('#total-todos-fen').html('<div> $ ' + total_fen_todos_meses.toFixed(2).replace('.', ',') + ' </div>')
        if (total_fen_todos_meses < 0) {
            $('#total-todos-fen').css('color', '#D30000');
        } else {
            $('#total-todos-fen').css('color', '#232323');
        }
    });
    return true;
}

function editar_inversion(input) {
    show_spinner();
    // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
    var csrftoken = getCookie("csrftoken");
    var params = {
        csrfmiddlewaretoken: csrftoken,
        project_id: $('#project_id').text(),
        'inversion': $(input).val() != '' ? parseFloat($(input).val().replace(',', '.')) : 0,
        'desde_flujo_efectivo': true
    };
    $.ajax({
        type: "POST",
        url: "/editar-proyecto/",
        data: params,
        dataType: "json",
    }).done(function (result) {
        hide_spinner();
        if (result.editado == '1') {
            toastr.success("Inversión guardada correctamente", config_toast);
            $(input).css('border-color', '#00710B');
            $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
        } else {
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            $(input).css('border-color', '#D30000');
            $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        hide_spinner();
        toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        $(input).css('border-color', '#D30000');
        $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
    }).always(function (data) {});
}

function editar_tasa_interes(input) {
    show_spinner();
    // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
    var csrftoken = getCookie("csrftoken");
    var params = {
        csrfmiddlewaretoken: csrftoken,
        project_id: $('#project_id').text(),
        'tasa_interes': $(input).val() != '' ? parseFloat($(input).val().replace(',', '.')) : 0,
        'desde_flujo_efectivo': true
    };
    $.ajax({
        type: "POST",
        url: "/editar-proyecto/",
        data: params,
        dataType: "json",
    }).done(function (result) {
        hide_spinner();
        if (result.editado == '1') {
            toastr.success("Tasa de interés guardada correctamente", config_toast);
            $(input).css('border-color', '#00710B');
            $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
        } else {
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            $(input).css('border-color', '#D30000');
            $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        hide_spinner();
        toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        $(input).css('border-color', '#D30000');
        $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
    }).always(function (data) {});
}


function editar_tasa_retorno(input) {
    show_spinner();
    // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
    var csrftoken = getCookie("csrftoken");
    var params = {
        csrfmiddlewaretoken: csrftoken,
        project_id: $('#project_id').text(),
        'tasa_retorno': $(input).val() != '' ? parseFloat($(input).val().replace(',', '.')) : 0,
        'desde_flujo_efectivo': true
    };
    $.ajax({
        type: "POST",
        url: "/editar-proyecto/",
        data: params,
        dataType: "json",
    }).done(function (result) {
        hide_spinner();
        if (result.editado == '1') {
            toastr.success("Tasa de retorno guardada correctamente", config_toast);
            $(input).css('border-color', '#00710B');
            $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
            calcular_periodos($('#periodos'));
        } else {
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            $(input).css('border-color', '#D30000');
            $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        hide_spinner();
        toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        $(input).css('border-color', '#D30000');
        $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
    }).always(function (data) {});
}

$("#btnViabilidadMensual").click(function () {
    show_spinner();
    if (parseFloat($('#inversion').val().replace(',', '.')) > 0 & parseFloat($('#tasa_interes').val().replace(',', '.')) > 0) {
        // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
        var csrftoken = getCookie("csrftoken");
        // se obtienen todos los fen
        var fen_neto = [];
        var json_array = {};
        $('.fen div').each(function () {
            fen_neto.push({
                "valor": parseFloat(($(this).text()).substring(2).replace(',', '.')),
            });
        });
        json_array.fen_neto = fen_neto;
        fen_neto = JSON.stringify(json_array);
        // se obtienen todos los fen acumulados
        var fen_acum = [];
        var json_array = {};
        $('.fen-acumulado div').each(function () {
            fen_acum.push({
                "valor": parseFloat(($(this).text()).substring(2).replace(',', '.')),
            });
        });
        json_array.fen_acum = fen_acum;
        fen_acum = JSON.stringify(json_array);
        // se definen los parámetros de la petición ajax
        inversion = parseFloat($('#inversion').val().replace(',', '.'))
        tasa_interes = parseFloat($('#tasa_interes').val().replace(',', '.'))
        var params = {
            csrfmiddlewaretoken: csrftoken,
            'inversion': inversion,
            'tasa_interes': tasa_interes,
            'fen_neto': fen_neto,
            'fen_acum': fen_acum
        };
        $.ajax({
            type: "POST",
            url: "/calcular-viabilidad/",
            data: params,
            dataType: "json",
        }).done(function (result) {
            hide_spinner();
            if (result.viabilidad == '1') {
                $('#tir-mensual').text(result.tir + ' %')
                $('#bc-mensual').text('$ ' + result.razon_bc)
                $('#van-mensual').text('$ ' + result.van)
                $('#pri-mensual').text(result.anios + ' años, ' + result.meses + ' meses y ' + result.dias + ' días')


                if (result.tir > tasa_interes) {
                    $('#respuesta-tir-mensual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-tir-mensual').css('color', '#0c9449');
                } else if (result.tir < tasa_interes) {
                    $('#respuesta-tir-mensual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-tir-mensual').css('color', '#D30000');
                } else {
                    $('#respuesta-tir-mensual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-tir-mensual').css('color', '#232323');
                }

                if (result.razon_bc > 1) {
                    $('#respuesta-bc-mensual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-bc-mensual').css('color', '#0c9449');
                } else if(result.razon_bc < 1) {
                    $('#respuesta-bc-mensual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-bc-mensual').css('color', '#D30000');
                } else {
                    $('#respuesta-bc-mensual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-bc-mensual').css('color', '#232323');
                }

                if (result.van > 0) {
                    $('#respuesta-van-mensual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-van-mensual').css('color', '#0c9449');
                } else if (result.van < 0) {
                    $('#respuesta-van-mensual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-van-mensual').css('color', '#D30000');
                } else {
                    $('#respuesta-van-mensual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-van-mensual').css('color', '#232323');
                }
            } else {
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            hide_spinner();
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        }).always(function (data) {});
    } else {
        hide_spinner();
        toastr.warning("Para calcular la viabilidad es necesario ingresar la inversión y la tasa de interés", config_toast);
    }
});

$(".btnAggActividad").click(function () {
    var superior_id = $(this).parent().parent().parent();
    var seccion = superior_id.attr("id");
    var fila = '<tr id="fila-' + id_fila + '"> \n\
		        <th><button class="btn btn-sm btn-danger delete-activity" onclick="eliminar_actividad(' + id_fila + ')" type="button"><i class="fa-solid fa-trash-can"></i></button></th>\n\
                <th class="static-columns"><input class="text-center" id="actividad" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_actividad(this);" size="37"/></th> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-1 ' + seccion + '-fila-' + id_fila + '" mes="1" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-2 ' + seccion + '-fila-' + id_fila + '" mes="2" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-3 ' + seccion + '-fila-' + id_fila + '" mes="3" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-4 ' + seccion + '-fila-' + id_fila + '" mes="4" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-5 ' + seccion + '-fila-' + id_fila + '" mes="5" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-6 ' + seccion + '-fila-' + id_fila + '" mes="6" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-7 ' + seccion + '-fila-' + id_fila + '" mes="7" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-8 ' + seccion + '-fila-' + id_fila + '" mes="8" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-9 ' + seccion + '-fila-' + id_fila + '" mes="9" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-10 ' + seccion + '-fila-' + id_fila + '" mes="10" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-11 ' + seccion + '-fila-' + id_fila + '" mes="11" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                  <input disabled class="text-center sumador ' + seccion + '-mes-12 ' + seccion + '-fila-' + id_fila + '" mes="12" tipo_cuenta="' + seccion + '" data-id="-1" fila="' + id_fila + '" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td class="text-center total-' + seccion + '-fila" id="total-' + seccion + '-fila-' + id_fila + '">$ 00,00</td> \n\
            </tr>';
    id_fila = id_fila - 1;
    $("#" + superior_id.attr("id")).after(fila);
});

















$("#nav-anual-tab").click(function () {
    ingreso_anual = parseFloat($('#ingreso-periodo-1 div').text().substring(2).replace(',', '.'))
    costo_a_anual = parseFloat($('#costo-a-periodo-1 div').text().substring(2).replace(',', '.'))
    costo_p_anual = parseFloat($('#costo-p-periodo-1 div').text().substring(2).replace(',', '.'))
    costo_i_anual = parseFloat($('#costo-i-periodo-1 div').text().substring(2).replace(',', '.'))
    total_egresos = costo_a_anual + costo_p_anual + costo_i_anual
    $('#total-ingresos-periodo-1').html('<div> $ ' + ingreso_anual.toFixed(2).replace('.', ',') + ' </div>')
    $('#total-egresos-periodo-1').html('<div> $ ' + total_egresos.toFixed(2).replace('.', ',') + ' </div>')
    $('#fen-periodo-1').html('<div> $ ' + (ingreso_anual - total_egresos).toFixed(2).replace('.', ',') + ' </div>')
    $('#fen-acum-periodo-1').html('<div> $ ' + (ingreso_anual - total_egresos).toFixed(2).replace('.', ',') + ' </div>')
    calcular_periodos($('#periodos'));
});

$("#periodos").change(function () {
    $(".padre").children(':nth-child(2)').attr("colspan", (parseInt($(this).val()) + 1));
    calcular_periodos(this);
});

// función para calcular el flujo en varios periodos, también se va a llamar al momento de modificar la tasa de retorno para que vuelva a calcular
function calcular_periodos(number) {
    tasa_retorno = parseFloat($('#tasa_retorno').val().replace(',', '.'))
    if (tasa_retorno > 0) {
        $('.periodo').each(function () {
            $(this).remove()
        });
        ingreso_anual = parseFloat($('#ingreso-periodo-1 div').text().substring(2).replace(',', '.'))
        costo_a_anual = parseFloat($('#costo-a-periodo-1 div').text().substring(2).replace(',', '.'))
        costo_p_anual = parseFloat($('#costo-p-periodo-1 div').text().substring(2).replace(',', '.'))
        costo_i_anual = parseFloat($('#costo-i-periodo-1 div').text().substring(2).replace(',', '.'))
        total_ingresos_anuales = ingreso_anual
        total_costo_a_anuales = costo_a_anual
        total_costo_p_anuales = costo_p_anual
        total_costo_i_anuales = costo_i_anual
        total_egresos = 0
        total_todos_egresos = 0

        total_fen = parseFloat($('#fen-periodo-1 div').text().substring(2).replace(',', '.'))
        total_fen_acum = parseFloat($('#fen-acum-periodo-1 div').text().substring(2).replace(',', '.'))
        for (var i = 1; i < parseInt($(number).val()); i++) {
            $('#encabezado-periodos').append(`<th class="text-center periodo" id="encabezado-periodo-${(i + 1)}">Año ${(i + 1)}</th>`);
            ingreso_anual += ingreso_anual * tasa_retorno
            total_ingresos_anuales += ingreso_anual
            $('#ingresos-anuales').append(`<th class="text-center periodo" id="ingreso-periodo-${(i + 1)}"><div>$ ${ingreso_anual.toFixed(2).replace('.', ',')}</div></th>`);
            $('#total-ingresos-anuales').append(`<th class="text-center periodo" id="total-ingresos-periodo--${(i + 1)}"><div>$ ${ingreso_anual.toFixed(2).replace('.', ',')}</div></th>`);
            costo_a_anual += costo_a_anual * tasa_retorno
            total_costo_a_anuales += costo_a_anual
            $('#costos-a-anuales').append(`<th class="text-center periodo" id="costos-a-periodo-${(i + 1)}"><div>$ ${costo_a_anual.toFixed(2).replace('.', ',')}</div></th>`);
            costo_p_anual += costo_p_anual * tasa_retorno
            total_costo_p_anuales += costo_p_anual
            $('#costos-p-anuales').append(`<th class="text-center periodo" id="costos-p-periodo-${(i + 1)}"><div>$ ${costo_p_anual.toFixed(2).replace('.', ',')}</div></th>`);
            costo_i_anual += costo_i_anual * tasa_retorno
            total_costo_i_anuales += costo_i_anual
            $('#costos-i-anuales').append(`<th class="text-center periodo" id="costos-i-periodo-${(i + 1)}"><div>$ ${costo_i_anual.toFixed(2).replace('.', ',')}</div></th>`);
            total_egresos = costo_a_anual + costo_p_anual + costo_i_anual
            $('#total-egresos-anuales').append(`<th class="text-center periodo" id="total-egresos-periodo-${(i + 1)}"><div>$ ${total_egresos.toFixed(2).replace('.', ',')}</div></th>`);
            // fen anual
            fen = 0
            fen = ingreso_anual - total_egresos
            total_fen += fen
            $('#fen-anuales').append(`<th class="text-center periodo fen-anuales" id="fen-periodo-${(i + 1)}"><div>$ ${fen.toFixed(2).replace('.', ',')}</div></th>`);
            // fen acumulado
            fen_acum = 0
            fen_acum_anterior = 0 
            fen_actual = parseFloat($('#fen-periodo-'+ (i + 1)).text().substring(2).replace(',', '.'))
            fen_acum_anterior = parseFloat($('#fen-acum-periodo-'+ (i)).text().substring(2).replace(',', '.'))
            fen_acum = fen_actual + fen_acum_anterior
            total_fen_acum += fen_acum
            $('#fen-acum-anuales').append(`<th class="text-center periodo fen-acum-anuales" id="fen-acum-periodo-${(i + 1)}"><div>$ ${fen_acum.toFixed(2).replace('.', ',')}</div></th>`);
        }
        $('#encabezado-periodos').append(`<th class="text-center periodo" id="encabezado-total">Total</th>`);
        $('#ingresos-anuales').append(`<th class="text-center periodo" id="total-todos-ingresos-anuales"><div>$ ${total_ingresos_anuales.toFixed(2).replace('.', ',')}</div></th>`);
        $('#total-ingresos-anuales').append(`<th class="text-center periodo" id="total-todos-ingresos"><div>$ ${total_ingresos_anuales.toFixed(2).replace('.', ',')}</div></th>`);

        $('#costos-a-anuales').append(`<th class="text-center periodo" id="total-todos-costos-a-anuales"><div>$ ${total_costo_a_anuales.toFixed(2).replace('.', ',')}</div></th>`);
        $('#costos-p-anuales').append(`<th class="text-center periodo" id="total-todos-costos-p-anuales"><div>$ ${total_costo_p_anuales.toFixed(2).replace('.', ',')}</div></th>`);
        $('#costos-i-anuales').append(`<th class="text-center periodo" id="total-todos-costos-i-anuales"><div>$ ${total_costo_i_anuales.toFixed(2).replace('.', ',')}</div></th>`);
        total_todos_egresos = total_costo_a_anuales + total_costo_p_anuales + total_costo_i_anuales
        $('#total-egresos-anuales').append(`<th class="text-center periodo" id="total-todos-egresos"><div>$ ${total_todos_egresos.toFixed(2).replace('.', ',')}</div></th>`);

        $('#fen-anuales').append(`<th class="text-center periodo" id="total-fen"><div>$ ${total_fen.toFixed(2).replace('.', ',')}</div></th>`);
        $('#fen-acum-anuales').append(`<th class="text-center periodo" id="total-fen-acum"><div>$ ${total_fen_acum.toFixed(2).replace('.', ',')}</div></th>`);

    } else {
        toastr.warning("Para calcular el flujo de efectivo anual es necesario ingresar la tasa de retorno", config_toast);
    }
}


$("#btnViabilidadAnual").click(function(){
    show_spinner();
    if (parseFloat($('#inversion').val().replace(',', '.')) > 0 & parseFloat($('#tasa_interes').val().replace(',', '.')) > 0) {
        // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
        var csrftoken = getCookie("csrftoken");
        // se obtienen todos los fen
        var fen_neto = []; 
        var json_array = {};
        $('.fen-anuales div').each(function () {
            fen_neto.push({
                "valor": parseFloat(($(this).text()).substring(2).replace(',', '.')),
            });
        });
        json_array.fen_neto = fen_neto;
        fen_neto = JSON.stringify(json_array);
        // se obtienen todos los fen acumulados
        var fen_acum = [];
        var json_array = {};
        $('.fen-acum-anuales div').each(function () {
            fen_acum.push({
                "valor": parseFloat(($(this).text()).substring(2).replace(',', '.')),
            });
        });
        json_array.fen_acum = fen_acum;
        fen_acum = JSON.stringify(json_array);
        // se definen los parámetros de la petición ajax
        inversion = parseFloat($('#inversion').val().replace(',', '.'))
        tasa_interes = parseFloat($('#tasa_interes').val().replace(',', '.'))
        var params = {
            csrfmiddlewaretoken: csrftoken,
            'inversion': inversion,
            'tasa_interes': tasa_interes,
            'fen_neto': fen_neto,
            'fen_acum': fen_acum
        };
        $.ajax({
            type: "POST",
            url: "/calcular-viabilidad/",
            data: params,
            dataType: "json"
        }).done(function (result) {
            hide_spinner();
            if (result.viabilidad == '1') {
                $('#tir-anual').text(result.tir + ' %')
                $('#bc-anual').text('$ ' + result.razon_bc)
                $('#van-anual').text('$ ' + result.van)
                $('#pri-anual').text(result.anios + ' años, ' + result.meses + ' meses y ' + result.dias + ' días')

                if (result.tir > tasa_interes) {
                    $('#respuesta-tir-anual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-tir-anual').css('color', '#0c9449');
                } else if (result.tir < tasa_interes) {
                    $('#respuesta-tir-anual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-tir-anual').css('color', '#D30000');
                } else {
                    $('#respuesta-tir-anual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-tir-anual').css('color', '#232323');
                }

                if (result.razon_bc > 1) {
                    $('#respuesta-bc-anual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-bc-anual').css('color', '#0c9449');
                } else if(result.razon_bc < 1) {
                    $('#respuesta-bc-anual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-bc-anual').css('color', '#D30000');
                } else {
                    $('#respuesta-bc-anual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-bc-anual').css('color', '#232323');
                }

                if (result.van > 0) {
                    $('#respuesta-van-anual').text('El proyecto es económicamente aceptable')
                    $('#respuesta-van-anual').css('color', '#0c9449');
                } else if (result.van < 0) {
                    $('#respuesta-van-anual').text('El proyecto no es económicamente aceptable')
                    $('#respuesta-van-anual').css('color', '#D30000');
                } else {
                    $('#respuesta-van-anual').text('El proyecto no genera ganancias ni pérdidas')
                    $('#respuesta-van-anual').css('color', '#232323');
                }
            } else {
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            hide_spinner();
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        }).always(function (data) {});
    
    } else {
        hide_spinner();
        toastr.warning("Para calcular la viabilidad es necesario ingresar la inversión y la tasa de interés", config_toast);
    }
});