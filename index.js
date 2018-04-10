
$(document).ready(function () {
    GetData();

    function GetData() {
        var ParametrosPost = {
            "Function": "GetData"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {
                document.getElementById("titleNav").innerHTML = jsonResponse["titulo"];
                document.getElementById("ti").innerHTML = jsonResponse["titulo"];

                CargarDBTablas();
                CargarDBProcedimientos();
                CargarDBReportes();

            },
            error: function (errorMessage) {


            }
        });
    }

    function CargarDBReportes() {
        var ParametrosPost = {
            "Function": "GetAllReportes"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {
                CargaReportes();

            },
            error: function (errorMessage) {
            }
        });
    }

    function CargarDBTablas() {
        var ParametrosPost = {
            "Function": "GetAllTablas"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {
                CargaTablas();

            },
            error: function (errorMessage) {
            }
        });
    }

    $(document).on("click", ".tabl", function (e) {
        $("#divTablas").empty();
        ExecuteQuery($(this).attr("value"));
    });


    $(document).on("click", "#titleNav", function (e) {
        $("#divTablas").empty();
        $("#divCamposReport").empty();
        document.getElementById("divConf").innerHTML = "";
        document.getElementById("titleTable").innerHTML = "";
        document.getElementById("thHeadReporte").innerHTML = "";
        document.getElementById("tbBodyReporte").innerHTML = "";
        document.getElementById("message").style.display = "block";
    });

    function CargarDBProcedimientos() {
        var ParametrosPost = {
            "Function": "GetAllProcedimientos"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {
                CargaProcedimeintos();


            },
            error: function (errorMessage) {
            }
        });
    }

    $(document).on("click", "#btnConfig", function () {
        document.getElementById("loader").style.display = 'block';
        document.getElementById("message").style.display = "none";
        $("#divCamposReport").empty();
        $("#divTablas").empty();
        document.getElementById("titleTable").innerHTML = "Configuraciones de la aplicación";
        $("#divConf").load("Config.html");

    });

    $(document).on("click", "#btnRefresh", function () {

        if (document.getElementById("dontErase") == null) {
            GetData();
        }
    });

    $(document).on("click", "#btnRep a", function () {
        $("#divTablas").empty();
        document.getElementById("loader").style.display = 'block';
        document.getElementById("message").style.display = "none";
        document.getElementById("divConf").innerHTML = "";
        document.getElementById("thHeadReporte").innerHTML = "";
        document.getElementById("tbBodyReporte").innerHTML = "";
        document.getElementById("titleTable").innerHTML = $(this).attr("name");

        getCamposRepor($(this).attr("id"), $(this).attr("value"), false);
        //ExecuteQuery($(this).attr("value"));
    });


    $(document).on("click", "#btnReportes a", function () {
        $("#divTablas").empty();
        document.getElementById("loader").style.display = 'block';
        document.getElementById("message").style.display = "none";
        document.getElementById("divConf").innerHTML = "";
        document.getElementById("thHeadReporte").innerHTML = "";
        document.getElementById("tbBodyReporte").innerHTML = "";
        document.getElementById("titleTable").innerHTML = $(this).attr("name");

        getCamposRepor($(this).attr("id"), $(this).attr("value"), true);
        //ExecuteQuery($(this).attr("value"));
    });

    $(document).on("click", "#btnTab a", function () {
        $("#divTablas").empty();
        document.getElementById("loader").style.display = 'block';
        document.getElementById("message").style.display = "none";
        $("#divCamposReport").empty();
        document.getElementById("divConf").innerHTML = "";
        document.getElementById("thHeadReporte").innerHTML = "";
        document.getElementById("tbBodyReporte").innerHTML = "";
        document.getElementById("titleTable").innerHTML = $(this).attr("name");

        var json = new Array();
        json['size'] = 0;
        ExecuteQuery($(this).attr("value"), json, 0, false, "", null, null);
    });

    $(document).on("click", "#btnCalc", function () {
        $("#divTablas").empty();
        document.getElementById("loader").style.display = 'block';
        document.getElementById("thHeadReporte").innerHTML = "";
        document.getElementById("tbBodyReporte").innerHTML = "";

        var jsonArr = new Array();
        for (var reg = 0; reg < parseInt($(this).attr("value")); reg++) {
            var inCampo = $("#inR" + reg);
            if (inCampo.attr("type") == "number") {
                jsonArr.push(inCampo.val());
            }
            else {
                jsonArr.push("'" + inCampo.val() + "'");
            }
        }

        if ($(this).attr("isRep") != "true") {
            ExecuteQuery($(this).attr("name"), jsonArr, parseInt($(this).attr("value")), false, "", null, null);
        }
        else {
            ExecuteQuery($(this).attr("name"), jsonArr, parseInt($(this).attr("value")), true, "", null, null);
        }
    });


    function ExecuteQuery(str, json, size, isReport, strTitle, jsonarrNext, next) {

        var exec = "ExecuteQuery";
        if (isReport == true) {
            exec = "ExecuteReport";
        }

        var ParametrosPost = {
            "Function": exec,
            "SProcedure": str,
            "params": json,
            "size": size
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {

                if (isReport == false) {
                    LlenarTabla(jsonResponse, "thHeadReporte", "tbBodyReporte", strTitle);

                    if (jsonarrNext != null && next != null && next < jsonarrNext.length) {
                        ExecuteQuery(jsonarrNext[next][0], json, size, false, jsonarrNext[next][1], jsonarrNext, next + 1);
                    }

                }
                else {
                    if (jsonResponse.length > 0) {
                        ExecuteQuery(jsonResponse[0][0], json, size, false, jsonResponse[0][1], jsonResponse, 1);
                    }
                }
            },
            error: function (errorMessage) {

            }
        });
    }

    function LlenarTabla(matDatos, strHead, strIDTabla, strTitle) {
        var table = document.createElement('table');
        table.className = "table table-hover";
        table.style = "width:100%;";

        var taHead = document.createElement('thead');
        taHead.className = "thead-light";
        //document.getElementById(strHead).innerHTML = "";
        //document.getElementById(strIDTabla).innerHTML = "";

        var atributo = matDatos[matDatos.length - 1];
        var tr = document.createElement('tr');
        for (var head = 0; head < matDatos[matDatos.length - 1]; head++) {
            var Registro = matDatos[head];
            var th = document.createElement('th');

            var htmlText = document.createTextNode(Registro);
            th.appendChild(htmlText);
            tr.appendChild(th);
        }

        taHead.appendChild(tr);
        table.appendChild(taHead);

        var taBody = document.createElement('tbody');

        var regis = (matDatos.length - 1) / matDatos[matDatos.length - 1];
        for (var reg = 0; reg < regis; reg++) {
            var tr = document.createElement('tr');
            for (; atributo < matDatos[matDatos.length - 1] * (reg + 1); atributo++) {
                var Registro = matDatos[atributo];
                var td = document.createElement('td');
                var htmlText = document.createTextNode(Registro);
                td.appendChild(htmlText);
                tr.appendChild(td);
            }

            taBody.appendChild(tr);
        }

        table.appendChild(taBody);

        var h = document.createElement('h4');
        h.innerHTML = strTitle;
        //h.style = "font-weight:bold;";

        var hr = document.createElement('hr');

        document.getElementById("divTablas").appendChild(h);
        document.getElementById("divTablas").appendChild(table);
        document.getElementById("divTablas").appendChild(hr);
        document.getElementById("loader").style.display = 'none';
    }

    function CargaProcedimeintos() {
        var ParametrosPost = {
            "Function": "GetProcedimientosToShow"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {

                var dd = $("#btnRep");
                dd.empty();
                for (var head = 0; head < jsonResponse.length; head += 1) {
                    dd.append('<a class="dropdown-item" id="' + jsonResponse[head][2] + '" value="' + jsonResponse[head][1] + '"  name="' + jsonResponse[head][0] + '" >' + jsonResponse[head][0] + '</a>');
                }

                document.getElementById("loader").style.display = 'none';

            },
            error: function (errorMessage) {
            }
        });
    }

    function CargaTablas() {
        var ParametrosPost = {
            "Function": "GetTablasToShow"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {

                var dd = $("#btnTab");
                dd.empty();
                for (var head = 0; head < jsonResponse.length; head += 1) {
                    dd.append('<a class="dropdown-item" value="' + jsonResponse[head][1] + '"  name="' + jsonResponse[head][0] + '" >' + jsonResponse[head][0] + '</a>');

                }
                document.getElementById("loader").style.display = 'none';

            },
            error: function (errorMessage) {
            }
        });
    }

    function CargaReportes() {
        var ParametrosPost = {
            "Function": "GetReportesToShow"
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {

                var dd = $("#btnReportes");
                dd.empty();
                for (var head = 0; head < jsonResponse.length; head += 1) {
                    dd.append('<a class="dropdown-item" id="' + jsonResponse[head][1] + '" value="' + jsonResponse[head][1] + '"  name="' + jsonResponse[head][0] + '" >' + jsonResponse[head][0] + '</a>');

                }
                document.getElementById("loader").style.display = 'none';

            },
            error: function (errorMessage) {
            }
        });
    }


    function getCamposRepor(idC, strProc, isReport) {

        var func = "GetCamposTablas";
        if (isReport) {
            func = "GetCamposReporte";
            strProc = idC;
        }

        var ParametrosPost = {
            "Function": func,
            "id": idC
        }

        $.ajax({
            url: "Controller/CompanyController.php",
            type: "POST",
            data: ParametrosPost,
            dataType: 'json',

            success: function (jsonResponse) {
                $("#divCamposReport").empty();
                $("#divCamposReport").append("<hr>");
                for (var reg = 0; reg < jsonResponse.length; reg++) {
                    var valCamp;
                    if (jsonResponse[reg][2] == "date") {
                        valCamp = "1900-01-01";
                    } else if (jsonResponse[reg][2] == "number") {
                        valCamp = "0";
                    } else {
                        valCamp = "";
                    }

                    $("#divCamposReport").append(
                        '<div class="row form-group" autocomplete="off">' +
                        '<label class="control-label col-sm-4">' + jsonResponse[reg][1] + '</label>' +
                        '<div class="col-sm-8">' +
                        ' <input id="inR' + reg + '" type="' + jsonResponse[reg][2] + '" class="form-control" value="' + valCamp + '"  autocomplete="off" required pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}">' +
                        '</div>' +
                        '</div>'
                    );
                }



                $("#divCamposReport").append('<div class="form-group" autocomplete="off">' +
                    '<div class="form-vertical">' +
                    ' <span class="btn btn-success" isRep="' + isReport + '" name="' + strProc + '" value="' + jsonResponse.length + '" id="btnCalc" style="display: flex; justify-content: center;">Calcular reporte</span>' +
                    '</div>' +
                    '</div>');

                $('#btnCalc').click();
                document.getElementById("loader").style.display = 'none';

            },
            error: function (errorMessage) {
            }
        });
    }


});