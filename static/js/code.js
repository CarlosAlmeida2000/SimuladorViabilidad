$(".btn-add-data").click(function () {
  var superior_id = $(this).parent().parent();
  var contenido =
    '<th class="static-columns">Venta de chicle</th>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n\
    <td class="text-center">$00,00</td>\n  ';
  var fila = "<tr>" + contenido + "</tr>";
  $("#" + superior_id.attr("id")).after(fila);
});
