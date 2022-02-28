$(".delete-project").click(function () {
    project_id = $(this).attr("data-project-id");
    project_name = $(this).attr("data-project-name");
    result_delete = confirm(`¿Deseas eliminar el proyecto ${project_name}?`);
    if (result_delete) {
        let csrftoken = getCookie("csrftoken");
        let data = {
            csrfmiddlewaretoken: csrftoken,
            project_id: project_id,
        };
        $.ajax({
            type: "POST",
            url: "/eliminar-proyecto/",
            data: data,
            dataType: "json",
        }).done(function (result) {
            if (result.eliminado == '1') {
                toastr.success("Proyecto eliminado correctamente", config_toast);
                setInterval(refrescar_pag, 1200)
            } else {
                toastr.error("Existió un error, por favor intente nuevamente", config_toast);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            toastr.error("Existió un error, por favor intente nuevamente", config_toast);
        }).always(function (data) { });
    }
});

function refrescar_pag(){
    window.location.reload()
}

$(".edit-project").click(function () {
    project_id = $(this).attr("data-project-id");
    project_name = $(this).attr("data-project-name");
    project_decription = $(this).attr("data-project-decription");
    $("#form-project").attr("action", "/editar-proyecto/");
    $("#validarNombre").val(project_name);
    $("#validarDescripcion").val(project_decription);
    $("#btn-guardar").attr({
        name: "project_id",
        value: project_id
    });
});

$("#add-project").click(function () {
    $("#form-project").attr("action", "/guardar-proyecto/");
    $("#validarNombre").val("");
    $("#validarDescripcion").val("");
    $("#btn-guardar").removeAttr("value name");
});