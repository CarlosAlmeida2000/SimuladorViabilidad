var id_fila = 0

function guardar_actividad(input){
    alert($(input).val())
    alert($(input).attr('data-id'))
}

function guardar_valor(input){
    alert($(input).val())
    alert($(input).attr('data-id'))
    alert(($(input).attr('mes')))
    alert($('#' + $(input).attr('fila-id') + ' #actividad').attr('data-id'))
    alert($(input).attr('tipo_cuenta'))
}

$("#btnAggIngreso").click(function () {
    var fila = '<tr id="fila-ingreso-'+ id_fila +'"> \n\
                    <th><input class="text-center" id="actividad" data-id="-1" onchange="javascript:guardar_actividad(this);" size="18"/></th> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="1" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="2" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="3" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="4" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="5" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="6" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="7" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="8" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="9" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="10" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="11" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                    <td> \n\
                        <input class="text-center m-2" mes="12" tipo_cuenta="ingreso" data-id="-1" fila-id="fila-ingreso-'+ id_fila +'" onchange="javascript:guardar_valor(this);" size="6"/> \n\
                    </td> \n\
                </tr>'
    $('#ingresos').prepend(fila);
    
});