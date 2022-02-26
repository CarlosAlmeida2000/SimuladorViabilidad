var id_fila = 0;

// Función para crear una llave de seguridad "crsftoken" y poder realizar una petición ajax
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function guardar_actividad(input) {
  // mostrar spinner
  $("#mostrar-spinner").load('/spinner/');
  // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
  var csrftoken = getCookie("csrftoken");
  // se definen los parámetros de la petición ajax
  var params = {
    csrfmiddlewaretoken: csrftoken,
    id_actividad: $(input).attr("data-id"),
    id_tipo_cuenta: getIdTipoCuenta($(input).attr("tipo_cuenta")),
    nom_actividad: $(input).val(),
  };
  $.ajax({
    type: "POST",
    url: "/guardar-actividad/",
    data: params,
    dataType: "json",
  })
    .done(function (result) {
      if (result.id_actividad > 0) {
        $(input).attr("data-id", result.id_actividad);
        $(input).css('border-color', '#00710B');
        $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
        // si se guarda la actividad se desbloquean los demás input de valores
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-1').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-2').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-3').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-4').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-5').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-6').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-7').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-8').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-9').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-10').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-11').prop('disabled', false);
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-12').prop('disabled', false);
        // eliminar spinner
        $("#mostrar-spinner").empty()
      } else {
        $(input).css('border-color', '#D30000');
        $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        // eliminar spinner
        $("#mostrar-spinner").empty()
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $(input).css('border-color', '#D30000');
      $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
      // eliminar spinner
      $("#mostrar-spinner").empty()
    })
    .always(function (data) { });
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
  // mostrar spinner
  $("#mostrar-spinner").load('/spinner/');
  // obtención de la llave de seguridad "crsftoken" para realizar una petición ajax
  var csrftoken = getCookie("csrftoken");
  // se definen los parámetros de la petición ajax
  var params = {
    csrfmiddlewaretoken: csrftoken,
    id_valor: $(input).attr("data-id"),
    id_actividad: $(
      "#" + $(input).parent().parent().attr("id") + " #actividad"
    ).attr("data-id"),
    valor: $(input).val(),
    mes: $(input).attr("mes"),
  };
  $.ajax({
    type: "POST",
    url: "/guardar-valor/",
    data: params,
    dataType: "json",
  })
    .done(function (result) {
      if (result.id_valor > 0) {
        $(input).attr("data-id", result.id_valor);
        $(input).css('border-color', '#00710B');
        $(input).css('box-shadow', '0px 0px 14px 0px #57C70040');
        var total_mes = 0.00  
        var total_fila = 0.00 
        var total_todas_filas = 0.00 
        var total_egresos = 0.00
        var fen_mensual = 0.00
        var fen_acum_mensual = 0.00
        // calcular el total del mes
        $('.'+ $(input).attr("tipo_cuenta") +'-mes-' + $(input).attr("mes")).each(function () {
          if($(this).val() != ''){
            total_mes = total_mes + parseFloat($(this).val().replace(',', '.'))
          }
        });
        // calcular el total de la fila
        $('.'+ $(input).attr("tipo_cuenta") +'-fila-' + $(input).attr("fila")).each(function () {
          if($(this).val() != ''){
            total_fila = total_fila + parseFloat($(this).val().replace(',', '.'))
          }
        });
        // actualizar valores totales de la columna y fila
        $('#total-'+ $(input).attr("tipo_cuenta") +'-mes-' + $(input).attr("mes")).html("$ " + total_mes.toFixed(2).replace('.', ','))
        $('#total-'+ $(input).attr("tipo_cuenta") +'-fila-' + $(input).attr("fila")).html("$ " + total_fila.toFixed(2).replace('.', ','))
        // calcular el total de todas las filas
        $('.total-'+ $(input).attr("tipo_cuenta") +'-fila').each(function () {
          if($(this).text() != '$ 00,00'){
            total_todas_filas = total_todas_filas + parseFloat(($(this).text()).substring(2).replace(',', '.'))
          }
        });
        // actualizar el total de todas las filas
        $('#total-'+ $(input).attr("tipo_cuenta")).text('$ ' + total_todas_filas.toFixed(2).replace('.', ','))
        // sumar todos los egresos
        total_egresos = (parseFloat($('#total-costos-a-mes-'+ $(input).attr("mes")).text().substring(2).replace(',', '.')) +
        parseFloat($('#total-costos-p-mes-'+ $(input).attr("mes")).text().substring(2).replace(',', '.')) +
        parseFloat($('#total-costos-i-mes-'+ $(input).attr("mes")).text().substring(2).replace(',', '.')))
        // actualizar el total de todos los egresos
        $('#total-egresos-mes-'+ $(input).attr("mes")).text('$ ' + total_egresos.toFixed(2).replace('.', ','))
        // calcular el FEN
        fen_mensual = parseFloat($('#total-ingresos-mes-'+ $(input).attr("mes")).text().substring(2).replace(',', '.')) - 
                      parseFloat($('#total-egresos-mes-'+ $(input).attr("mes")).text().substring(2).replace(',', '.'))
        $('#total-fen-mes-' + $(input).attr("mes")).text('$ ' + fen_mensual.toFixed(2).replace('.', ','))
        // calcular el FEN acumulado        
        if($(input).attr("mes") == '1'){
          fen_acum_mensual = fen_mensual
        }else{
          fen_acum_anterior = parseFloat( $('#total-fen-acum-mes-' + (($(input).attr("mes")) -1) ).text().substring(2).replace(',', '.') )
          fen_acum_mensual = fen_mensual + fen_acum_anterior
        }
        $('#total-fen-acum-mes-' + $(input).attr("mes")).text('$ ' + fen_acum_mensual.toFixed(2).replace('.', ','))
        // eliminar spinner
        $("#mostrar-spinner").empty()
      } else {
        $(input).css('border-color', '#D30000');
        $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
        // eliminar spinner
        $("#mostrar-spinner").empty()
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $(input).css('border-color', '#D30000');
      $(input).css('box-shadow', '0px 0px 6px 0px #FF000040');
      // eliminar spinner
      $("#mostrar-spinner").empty()
    })
    .always(function (data) { });
}

$(".btnAggActividad").click(function () {
  var superior_id = $(this).parent().parent();
  var seccion = superior_id.attr("id");
  var fila =
    '<tr id="fila-' +
    id_fila +
    '"> \n\
                <th class="static-columns"><input class="text-center rounded" id="actividad" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_actividad(this);" size="37"/></th> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-1 '+ seccion +'-fila-'+ id_fila +'" mes="1" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-2 '+ seccion +'-fila-'+ id_fila +'" mes="2" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-3 '+ seccion +'-fila-'+ id_fila +'" mes="3" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-4 '+ seccion +'-fila-'+ id_fila +'" mes="4" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-5 '+ seccion +'-fila-'+ id_fila +'" mes="5" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-6 '+ seccion +'-fila-'+ id_fila +'" mes="6" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-7 '+ seccion +'-fila-'+ id_fila +'" mes="7" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-8 '+ seccion +'-fila-'+ id_fila +'" mes="8" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-9 '+ seccion +'-fila-'+ id_fila +'" mes="9" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-10 '+ seccion +'-fila-'+ id_fila +'" mes="10" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-11 '+ seccion +'-fila-'+ id_fila +'" mes="11" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input disabled class="text-center rounded '+ seccion +'-mes-12 '+ seccion +'-fila-'+ id_fila +'" mes="12" tipo_cuenta="' +
    seccion +
    '" data-id="-1" fila="'+ id_fila +'" onchange="javascript:guardar_valor(this);" onkeypress="return soloNumeros(event)" onkeyup="return convertDecimal(this)" size="6"/> \n\
                </td> \n\
                <td class="text-center total-'+ seccion +'-fila" id="total-'+ seccion +'-fila-'+ id_fila +'">$ 00,00</td> \n\
            </tr>';
  id_fila = id_fila + 1;
  $("#" + superior_id.attr("id")).after(fila);
});

function soloNumeros(event, input) {
  var regex = new RegExp("^[0-9,. ]+$"); 
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
      event.preventDefault();
      return false;
  }
}

function convertDecimal(input) {
  $(input).val($(input).val().replace('.', ','));
}