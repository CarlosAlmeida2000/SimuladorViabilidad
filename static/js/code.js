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
        alert("guardado");
      } else {
        alert("error actividad");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {})
    .always(function (data) {});
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
  //alert($(input).attr('tipo_cuenta'))

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
        alert("guardado");
      } else {
        alert("error");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {})
    .always(function (data) {});
}

$(".btnAggActividad").click(function () {
  var superior_id = $(this).parent().parent();
  var seccion = superior_id.attr("id");
  var fila =
    '<tr id="fila-' +
    id_fila +
    '"> \n\
                <th class="static-columns"><input class="text-center" id="actividad" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_actividad(this);" size="37"/></th> \n\
                <td> \n\
                    <input class="text-center" mes="1" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="2" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="3" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="4" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="5" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="6" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="7" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="8" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="9" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="10" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="11" tipo_cuenta="' +
    seccion +
    '" data-id="-1" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
                <td> \n\
                    <input class="text-center" mes="12" tipo_cuenta="' +
    seccion +
    '" data-id="-1"onchange="javascript:guardar_valor(this);" size="6"/> \n\
                </td> \n\
            </tr>';
  id_fila = id_fila + 1;
  $("#" + superior_id.attr("id")).after(fila);
});
