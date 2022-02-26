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
            success: function (response) {
                window.location.href = "/"
            }
        });
    } else {
        alert("Se cancelo");
    }
});

$(".edit-project").click(function () {
    project_id = $(this).attr("data-project-id");
    project_name = $(this).attr("data-project-name");
    project_decription = $(this).attr("data-project-decription");
    console.log();
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