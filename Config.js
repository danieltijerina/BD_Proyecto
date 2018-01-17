$(document).ready(function()
{
	var dataSelectProcs;
	GetData();
	function GetData(){
        var ParametrosPost = {
            "Function" : "GetData"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
     			console.log(jsonResponse);
     			document.getElementById("titleNav").innerHTML = jsonResponse["titulo"];
     			document.getElementById("inTitulo").value = jsonResponse["titulo"];
            	document.getElementById("inServ").value = jsonResponse["servidor"];
            	document.getElementById("ti").innerHTML = jsonResponse["titulo"];

            	if (jsonResponse["pass"]){
            		document.getElementById("inPass").value = jsonResponse["pass"];
            	}
            	document.getElementById("inBD").value = jsonResponse["bd"];
            	document.getElementById("inUsr").value = jsonResponse["usr"];
            	CargarDBTablas();
            	CargarDBProcedimientos();
            	CargarDBReportes();

            	CargaProcedimeintos();
            	CargaTablas();
            	CargaReportes();

           },
           error: function(errorMessage) {
               console.log(errorMessage);


           }
       });
    }

	function SetData(){
        var ParametrosPost = {
            "Function" : "SetData",
            "Titulo" :  document.getElementById("inTitulo").value,
            "Servidor" : document.getElementById("inServ").value,
            "Contrasena" : document.getElementById("inPass").value,
            "BD" : document.getElementById("inBD").value,
            "Usr" : document.getElementById("inUsr").value
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
     		document.getElementById("btnSave").disabled = false;
           	GetData();
           },
           error: function(errorMessage) {
               console.log(errorMessage);
               document.getElementById("btnSave").disabled = false;
           }
       });
    }

	function CargarDBTablas(){
        var ParametrosPost = {
            "Function" : "GetAllTablas"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
              	LlenarTabla(jsonResponse,"tbTablas", 1);

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function CargarDBProcedimientos(){

        var ParametrosPost = {
            "Function" : "GetAllProcedimientos"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
				dataSelectProcs = jsonResponse;
              	LlenarTabla(jsonResponse,"tbProcedimeintos", 0);

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function CargarDBReportes(){

        var ParametrosPost = {
            "Function" : "GetAllReportes"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
              LlenarTabla(jsonResponse,"tbReportes", 0);

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


    function LlenarTabla(matDatos, strIDTabla, isTblas ){
    	console.log(matDatos);
    	if(document.getElementById(strIDTabla)){
        	document.getElementById(strIDTabla).innerHTML = "";
    	}


    	


        for(var reg = 0; reg < matDatos.length; reg++)
        {
            var tr = document.createElement('tr');

            if (strIDTabla == "tbReportes"){
        	var td = document.createElement('td');
            
            var bt = document.createElement('button');
            td.id = "procs";
            bt.className = "btn btn-danger del-rep";
            bt.style = "margin: 0 auto; display: table; text-align:center; vertical-align:middle;";
            bt.value = matDatos[reg][0];
            bt.name = "del-rep";
            var span = document.createElement('span');
            span.className = "oi oi-trash";
    
            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
            bt.appendChild(span);
           	td.appendChild(bt);
            tr.appendChild(td);

        	}

            for(var atributo = 0; atributo < matDatos[reg].length - 1; atributo++)
            {
            	var Registro = matDatos[reg][atributo];
                var td = document.createElement('td');
                var htmlText = document.createTextNode(Registro);
                

                if (atributo == 2){
                	htmlText = document.createElement("input");
                	htmlText.className = "form-control";
                	htmlText.value = Registro;
                	htmlText.disabled = true;
                	td.id = "titulo";
                }

                if (atributo == 3 && isTblas == 1){
                	htmlText = document.createElement("input");
                	htmlText.className = "form-control";
                	htmlText.value = Registro;
                	htmlText.disabled = true;
                	td.id = "procedimiento";
                }


                td.appendChild(htmlText);
                tr.appendChild(td);

            }


            var Registro = matDatos[reg][matDatos[reg].length - 1];
            var td = document.createElement('td');
            var span = document.createElement('input');
            td.id = "mostrar";
            span.type = "checkbox";
            span.className = "form-check-input";
			span.disabled = true;
			span.style = "margin: 0 auto; display: table; text-align:center; vertical-align:middle;";

            if (Registro == "1"){
				span.checked = true;
            }

            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
           	td.appendChild(span);
            tr.appendChild(td);
			


            if (isTblas == 0){
             var td = document.createElement('td');
            
            var bt = document.createElement('button');
            td.id = "campos";
            bt.className = "btn btn-info campos";
            bt.style = "margin: 0 auto; display: table; text-align:center; vertical-align:middle;";
            bt.value = matDatos[reg][0];
            bt.name = "campos-proc";
            if (strIDTabla == "tbReportes"){
            	bt.name = "campos-rep";
            }
            var span = document.createElement('span');
            span.className = "oi oi-menu";
    
            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
            bt.appendChild(span);
           	td.appendChild(bt);
            tr.appendChild(td);
        	}
        

        	if (strIDTabla == "tbReportes"){
        		var td = document.createElement('td');
            
            var bt = document.createElement('button');
            td.id = "procs";
            bt.className = "btn btn-info procs";
            bt.style = "margin: 0 auto; display: table; text-align:center; vertical-align:middle;";
            bt.value = matDatos[reg][0];
            bt.name = "procs";
            var span = document.createElement('span');
            span.className = "oi oi-layers";
    
            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
            bt.appendChild(span);
           	td.appendChild(bt);
            tr.appendChild(td);

        	}

            var td = document.createElement('td');
            var bt = document.createElement('button');
            td.id = "edit";
            bt.className = "btn btn-dark edit";
            bt.value = matDatos[reg][0];
            bt.name = "edit";
            var span = document.createElement('span');
            span.className = "oi oi-pencil";
    
            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
            bt.appendChild(span);
           	td.appendChild(bt);
            tr.appendChild(td);


            var td = document.createElement('td');
            var bt = document.createElement('button');
            td.id = "cancel";
            bt.className = "btn btn-danger cancel";
            bt.value = matDatos[reg][0];
            bt.name = "cancel";
            bt.hidden = true;
            var span = document.createElement('span');
            span.className = "oi oi-x";
    
            //var htmlText = document.createTextNode('<span class="oi oi-pencil"></span>');
            bt.appendChild(span);
           	td.appendChild(bt);
            tr.appendChild(td);


            document.getElementById(strIDTabla).appendChild(tr);
        }
    }

    function updateProcedure(id, titulo, mostrar){
    	var ParametrosPost = {
            "Function" : "updateProcedure",
            "id" :  id,
            "titulo" : titulo,
            "mostrar" : mostrar
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
     			GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function updateTabla(id, titulo, proc, mostrar){
    	var ParametrosPost = {
            "Function" : "updateTabla",
            "id" :  id,
            "titulo" : titulo,
            "proc" : proc,
            "mostrar" : mostrar
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
     			GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

	$(document).on("click", "#btnSave", function(e){
		event.preventDefault();
		document.getElementById("btnSave").disabled = true;
		console.log( "ddd");
		console.log( document.getElementById("inBD").value);
		SetData();
	});

	$(document).off('click', '#tbProcedimeintos tr td button').on("click", "#tbProcedimeintos tr td button", function(){
		 event.preventDefault();

		var span = $(this).children("span");
		var proc = $(this).parent().parent().children("#procedimiento").children(".form-control");
		var cancel = $(this).parent().parent().children("#cancel").children(".cancel");
		var edit = $(this).parent().parent().children("#edit").children(".edit");
		var titulo = $(this).parent().parent().children("#titulo").children(".form-control");
		var mos = $(this).parent().parent().children("#mostrar").children(".form-check-input");

		console.log($(this));
		if ($(this).prop('name') == "edit" || $(this).prop('name') == "save"){

			if (titulo.prop("disabled")){
				console.log("enabled");
				cancel.prop('hidden', "");
				span.attr('class', "oi oi-check");
				edit.attr('class', "btn btn-success edit");
				edit.attr('name', "save");
				titulo.prop('disabled', false);
				mos.prop('disabled', false);
				proc.prop('disabled', false);

			}
			else{
				if ($(this).prop('name') == "save"){
					console.log("saved disabled");
					edit.attr('name', "edit");
					cancel.prop('hidden', true);
					span.attr('class', "oi oi-pencil");
					edit.attr('class', "btn btn-dark edit" );
					titulo.prop('disabled', true);
					mos.prop('disabled', true);
					proc.prop('disabled', true);

					console.log($(this).val());
					console.log(titulo.val());
					console.log(mos.prop( "checked" ));
				if (mos.prop( "checked" )){
					updateProcedure($(this).val(), titulo.val(), 1);
				}
				else{
					updateProcedure($(this).val(), titulo.val(), 0);
				}
				}

			}
		}
		else if ($(this).prop('name') == "cancel"){
		 
			console.log("disabled");
			edit.attr('name', "edit");
			cancel.prop('hidden', true);
			edit.attr('class', "btn btn-dark edit");				
			titulo.prop('disabled', true);
			mos.prop('disabled', true);
			proc.prop('disabled', true);
		}
		else if ($(this).prop('name') == "campos-proc"){
			console.log($(this).prop('name'));
		 	getCampos($(this).val(), titulo.val(), $(this).prop('name'));
			
		}
		
	});


	$(document).off('click', '#btnGuardarCampos').on("click", "#btnGuardarCampos", function(e){

		var divCampos = $("#divCampos");
		var arr = divCampos.children(".campo");
		
		console.log(arr);
		console.log($(this).val());
		deleteCampos($(this).val(), $(this).val(), arr, $(this).prop('name'));

	});


	$(document).off('click', '#btnGuardarReporteProc').on("click", "#btnGuardarReporteProc", function(e){

		var divCampos = $("#divReps");
		var arr = divCampos.children(".proc-rep");
		
		console.log(arr);
		console.log($(this).val());
		deleteProcsRep($(this).val(), $(this).val(), arr, $(this).prop('name'));

	});


	$(document).off('click', '#btnAgregarReporte').on("click", "#btnAgregarReporte", function(e){

		insertReporte($("#inRepNombre").val(), $("#inRepTitulo").val());

	});



	$(document).on("click", "#delCampo", function(e){

		$(this).parent().parent().remove();

	});

	$(document).off('click', '#tbTablas tr td button').on("click", "#tbTablas tr td button", function(){
		 event.preventDefault();
		
		var span = $(this).children("span");
		var proc = $(this).parent().parent().children("#procedimiento").children(".form-control");
		var cancel = $(this).parent().parent().children("#cancel").children(".cancel");
		var edit = $(this).parent().parent().children("#edit").children(".edit");
		var titulo = $(this).parent().parent().children("#titulo").children(".form-control");
		var mos = $(this).parent().parent().children("#mostrar").children(".form-check-input");

		console.log($(this));
		if ($(this).prop('name') == "edit" || $(this).prop('name') == "save"){

			if (titulo.prop("disabled")){
				console.log("enabled");
				cancel.prop('hidden', "");
				span.attr('class', "oi oi-check");
				edit.attr('class', "btn btn-success edit");
				edit.attr('name', "save");
				titulo.prop('disabled', false);
				mos.prop('disabled', false);
				proc.prop('disabled', false);

			}
			else{
				if ($(this).prop('name') == "save"){
					console.log("saved disabled");
					edit.attr('name', "edit");
					cancel.prop('hidden', true);
					span.attr('class', "oi oi-pencil");
					edit.attr('class', "btn btn-dark edit" );
					titulo.prop('disabled', true);
					mos.prop('disabled', true);
					proc.prop('disabled', true);

					console.log($(this).val());
					console.log(titulo.val());
					console.log(mos.prop( "checked" ));

					if (mos.prop( "checked" )){
						updateTabla($(this).val(), titulo.val(), proc.val(), 1);
					}
					else{
						updateTabla($(this).val(), titulo.val(), proc.val(), 0);
					}
				}

			}
		}
		else{
			console.log("disabled");
			edit.attr('name', "edit");
			cancel.prop('hidden', true);
			edit.attr('class', "btn btn-dark edit");				
			titulo.prop('disabled', true);
			mos.prop('disabled', true);
			proc.prop('disabled', true);
		}
	});
	$(document).on("click", "#btnRefresh", function(){

		GetData();
		
	});



	function CargaProcedimeintos(){
        var ParametrosPost = {
            "Function" : "GetProcedimientosToShow"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               	console.log(jsonResponse);

        		var dd = $("#btnRep");
        		dd.empty();
        		for(var head = 0; head < jsonResponse.length; head += 1)
        		{
        			dd.append('<a class="dropdown-item" id="'+jsonResponse[head][2]+'" value="'+ jsonResponse[head][1] +'"  name="'+ jsonResponse[head][0]+'" >'+ jsonResponse[head][0] +'</a>');
        		}

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


	$(document).off('click', '#addCampo').on("click", "#addCampo", function(e){
			

			document.getElementById("divCampos").appendChild(htmlCampo(null, "Letrero", "text"));
	});

	$(document).off('click', '#addProc').on("click", "#addProc", function(e){
			

			document.getElementById("divReps").appendChild(htmlProcs(null, null ));
	});


    function CargaTablas(){
        var ParametrosPost = {
            "Function" : "GetTablasToShow"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               	console.log(jsonResponse);

        		var dd = $("#btnTab");
        		dd.empty();
        		for(var head = 0; head < jsonResponse.length; head += 1)
        		{
        			dd.append('<a class="dropdown-item" value="'+ jsonResponse[head][1] +'"  name="'+ jsonResponse[head][0]+'" >'+ jsonResponse[head][0] +'</a>');

        		}

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }



    function htmlCampo(idReg, strLetrero, strTipo){


		var div1 = document.createElement('div');
		div1.className = "row form-group campo";
		div1.autocomplete = "off";
		div1.id = idReg;

		var div2 = document.createElement('div');
		div2.className = "col-sm-6 let";
		var input1 = document.createElement('input');
		input1.className = "form-control letrero";
		input1.value = strLetrero;
		input1.type = "text";

		div2.appendChild(input1);
		div1.appendChild(div2);

		var div3 = document.createElement('div');
		div3.className = "col-sm-4 tip";
		var sel = document.createElement('select');
		sel.className = "form-control tipo";
		sel.id = "dd";
		var op1 = document.createElement('option');
		op1.value= "text";
		op1.innerHTML = "texto";
		var op2 = document.createElement('option');
		op2.value= "date";
		op2.innerHTML = "fecha";
		var op3 = document.createElement('option');
		op3.value= "number";
		op3.innerHTML = "numero";
		sel.appendChild(op1);
		sel.appendChild(op2);
		sel.appendChild(op3);
		sel.value = strTipo;
		div3.appendChild(sel);
		div1.appendChild(div3);


		var div4 = document.createElement('div');
		div4.className = "col-sm-2";
		var btn = document.createElement('button');
		btn.className = "btn btn-danger";
		btn.id = "delCampo";
		var span = document.createElement('span');
		span.className = "oi oi-trash";
		btn.appendChild(span);
		div4.appendChild(btn);

		div1.appendChild(div4);

    	return div1;
    }


    function getCampos(idC, strTitulo, strCampos){

    	var func = "GetCamposTablas";
    	if(strCampos == "campos-rep"){
    		func = "GetCamposReporte";
    	}

        var ParametrosPost = {
            "Function" : func,
            "id" : idC
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
              	$("#divCampos").empty();
				document.getElementById("btnGuardarCampos").value = idC;
				document.getElementById("btnGuardarCampos").name = strCampos;
				document.getElementById("modHead").innerHTML = strTitulo;

				for(var reg = 0; reg < jsonResponse.length; reg++)
        		{

        			document.getElementById("divCampos").appendChild(htmlCampo(jsonResponse[reg][0], jsonResponse[reg][1], jsonResponse[reg][2]));
            	}
            	$('#modalCampos').modal('show'); 

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


	var camposAdded;
	var camposNeded;
    function deleteCampos(idProc, $idThis, arr, strCampos){

    	isReporte = 0;
    	if(strCampos == "campos-rep"){
    		isReporte = 1;
    	}
        var ParametrosPost = {
            "Function" : "DeleteCampos",
            "isReporte" : isReporte,
            "id" : idProc
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);

               	camposAdded = 0;
               	camposNeded = arr.length;
               	for(var reg = 0; arr != null && reg < arr.length; reg++)
        		{
        			console.log(arr.eq(reg).children(".let").children(".letrero").val());
        			console.log(arr.eq(reg).children(".tip").children(".tipo").val());
        			insertCampo($idThis, 
        			arr.eq(reg).children(".let").children(".letrero").val(), 
        			arr.eq(reg).children(".tip").children(".tipo").val(),reg, strCampos);
        		}

        		if (camposNeded == 0){
        			$('#modalCampos').modal('toggle'); 
        		}

        		GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


    var procsAdded;
	var procsNeded;
    function deleteProcsRep(idRep, $idThis, arr){

        var ParametrosPost = {
            "Function" : "DeleteProcsRep",
            "id" : idRep
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);

               	procsAdded = 0;
               	procsNeded = arr.length;
               	for(var reg = 0; arr != null && reg < arr.length; reg++)
        		{
        			console.log("INSERT PROCS");
        			console.log(idRep);
        			console.log(arr.eq(reg).children(".div-proc").children(".sel-proc").val());
        			insertProcsRep(idRep, 
        			arr.eq(reg).children(".div-proc").children(".sel-proc").val(), reg);
        		}

        		if (procsAdded == 0){
        			$('#modalReporteProcs').modal('toggle'); 
        		}

        		GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function insertProcsRep(idRep, idProc,intOrden){

        var ParametrosPost = {
            "Function" : "InsertProcsRep",
            "idRep" : idRep,
            "idProc" : idProc,
            "orden" : intOrden
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
               procsAdded++;

               if (procsAdded == procsNeded){
               		procsAdded = 0;
               		procsNeded = 1000;
               		$('#modalReporteProcs').modal('toggle'); 
               }

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


    function insertCampo(idProc, strTitulo, strTipo, intOrden, strCampos){

    	isReporte = 0;
    	if(strCampos == "campos-rep"){
    		isReporte = 1;
    	}

        var ParametrosPost = {
            "Function" : "InsertCampo",
            "id" : idProc,
            "titulo" : strTitulo,
            "tipo" : strTipo,
            "isReporte" : isReporte,
            "orden" : intOrden
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);
               camposAdded++;

               if (camposAdded == camposNeded){
               		camposAdded = 0;
               		camposNeded = 1000;
               		$('#modalCampos').modal('toggle'); 
               }

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

		$(document).off('click', '#btnAddReporte').on("click", "#btnAddReporte", function(){
		 event.preventDefault();
		 	$('#modalReporte').modal('toggle'); 
		 });


    $(document).off('click', '#tbReportes tr td button').on("click", "#tbReportes tr td button", function(){
		 event.preventDefault();

		var span = $(this).children("span");
		var proc = $(this).parent().parent().children("#procedimiento").children(".form-control");
		var cancel = $(this).parent().parent().children("#cancel").children(".cancel");
		var edit = $(this).parent().parent().children("#edit").children(".edit");
		var titulo = $(this).parent().parent().children("#titulo").children(".form-control");
		var mos = $(this).parent().parent().children("#mostrar").children(".form-check-input");

		console.log($(this));
		if ($(this).prop('name') == "edit" || $(this).prop('name') == "save"){

			if (titulo.prop("disabled")){
				console.log("enabled");
				cancel.prop('hidden', "");
				span.attr('class', "oi oi-check");
				edit.attr('class', "btn btn-success edit");
				edit.attr('name', "save");
				titulo.prop('disabled', false);
				mos.prop('disabled', false);
				proc.prop('disabled', false);

			}
			else{
				if ($(this).prop('name') == "save"){
					console.log("saved disabled");
					edit.attr('name', "edit");
					cancel.prop('hidden', true);
					span.attr('class', "oi oi-pencil");
					edit.attr('class', "btn btn-dark edit" );
					titulo.prop('disabled', true);
					mos.prop('disabled', true);
					proc.prop('disabled', true);

					console.log($(this).val());
					console.log(titulo.val());
					console.log(mos.prop( "checked" ));
				if (mos.prop( "checked" )){

					updateReporte($(this).val(), titulo.val(), 1);
				}
				else{
					updateReporte($(this).val(), titulo.val(), 0);
				}
				}

			}
		}
		else if ($(this).prop('name') == "cancel"){
		 
			console.log("disabled");
			edit.attr('name', "edit");
			cancel.prop('hidden', true);
			edit.attr('class', "btn btn-dark edit");				
			titulo.prop('disabled', true);
			mos.prop('disabled', true);
			proc.prop('disabled', true);
		}
		else if ($(this).prop('name') == "campos-rep"){

		 	console.log($(this).prop('name'));
		 	getCampos($(this).val(), titulo.val(), $(this).prop('name'));
			
		}
		else if ($(this).prop('name') == "procs"){

		 	console.log($(this).prop('name'));
		 	getProcsReportes($(this).val(), titulo.val());
			
		}else if ($(this).prop('name') == "del-rep"){

		 	console.log($(this).prop('name'));
		 	deleteReport($(this).val());
			
		}
		
	});


	function deleteReport(intId){


        var ParametrosPost = {
            "Function" : "DeleteReporte",
            "id": intId
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               	console.log(jsonResponse);
               	GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

	function updateReporte(id, titulo, mostrar){
    	var ParametrosPost = {
            "Function" : "updateReporte",
            "id" :  id,
            "titulo" : titulo,
            "mostrar" : mostrar
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
     			GetData();

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function CargaReportes(){
        var ParametrosPost = {
            "Function" : "GetReportesToShow"
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               	console.log(jsonResponse);

        		var dd = $("#btnReportes");
        		dd.empty();
        		for(var head = 0; head < jsonResponse.length; head += 1)
        		{
        			dd.append('<a class="dropdown-item" id="'+jsonResponse[head][1]+'" value="'+ jsonResponse[head][1] +'"  name="'+ jsonResponse[head][0]+'" >'+ jsonResponse[head][0] +'</a>');

        		}
        		document.getElementById("loader").style.display = 'none';

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }


    function insertReporte(strTitulo, strNombre){

    	console.log(strTitulo);
    	console.log(strNombre);

        var ParametrosPost = {
            "Function" : "InsertReporte",
            "nombre": strNombre,
            "titulo" : strTitulo
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               	console.log(jsonResponse);
               	GetData();
               	$('#modalReporte').modal('toggle'); 


           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function getProcsReportes(idC, strTitulo){

    	$("#divReps").empty();
		document.getElementById("btnGuardarReporteProc").value = idC;
		document.getElementById("modHeadRep").innerHTML = strTitulo;

        var ParametrosPost = {
            "Function" : "GetProcsReporte",
            "id" : idC
        }

        $.ajax({
           url: "Controller/CompanyController.php",
           type: "POST",
           data: ParametrosPost,
           dataType: 'json',

           success: function(jsonResponse) {
               console.log(jsonResponse);

				for(var reg = 0; reg < jsonResponse.length; reg++)
        		{

        			document.getElementById("divReps").appendChild(htmlProcs(jsonResponse[reg][0], jsonResponse[reg][1]));
            	}
            	$('#modalReporteProcs').modal('show'); 

           },
           error: function(errorMessage) {
               console.log(errorMessage);
           }
       });
    }

    function htmlProcs(id, value){

    	var div1 = document.createElement('div');
		div1.className = "row form-group proc-rep";
		div1.autocomplete = "off";
		div1.id = id;

		var div2 = document.createElement('div');
		div2.className = "col-sm-10 div-proc";

		var sel = document.createElement('select');
		sel.className = "form-control sel-proc";

		var op = document.createElement('option');
			op.value = null;
			op.innerHTML = "Selecciona un procedimiento";
			op.disabled = true;
			sel.appendChild(op);

		for(var intX = 0; intX < dataSelectProcs.length; intX++ ){
			var op = document.createElement('option');
			op.value = dataSelectProcs[intX][0];
			op.innerHTML = dataSelectProcs[intX][2];
			sel.appendChild(op);
		}
		sel.value = value;
		div2.appendChild(sel);
		div1.appendChild(div2);


		var div4 = document.createElement('div');
		div4.className = "col-sm-2";
		var btn = document.createElement('button');
		btn.className = "btn btn-danger";
		btn.id = "delCampo";
		var span = document.createElement('span');
		span.className = "oi oi-trash";
		btn.appendChild(span);
		div4.appendChild(btn);
		div1.appendChild(div4);

		return div1;
    }


    /*<div class="row form-group">
      <div class="col-sm-8">
        <select class="form-control" id="inSigSemestre">
        	<option value="2">2</option>
         	<option value="3">3</option>
          	<option value="4">4</option>
           	<option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
      </select>
      </div>
    </div>*/

/*'<div class="row form-group" autocomplete="off">' +
            '<div class="col-sm-6">' +
            '<input id="inLabel" type="text" class="form-control" value=""  autocomplete="off">' +
            '</div>' +

            '<div class="col-sm-4">' +
            '<select class="form-control" id="inTipo">' +
            '<option value="text">texto</option>' +
            '<option value="date">fecha</option>' +
            '<option value="number">numero</option>' +
            '</select>' +
            '</div>' +


          	'<div class="col-sm-2">' +
          	'<button class="btn btn-danger"><span class="oi oi-trash"></span> </button>' +
          	'</div>' +
          	'</div>'*/
});