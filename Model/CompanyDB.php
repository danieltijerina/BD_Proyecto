
<?php
//======================================================================================================================
class CompanyDB
{
	private function conDBConnection(){
		$pass = "";

		if(isset($_COOKIE['pass'] ) && strlen($_COOKIE['pass']) > 0){
			$pass = $_COOKIE['pass'];
		}

	   $con = mysqli_connect($_COOKIE['servidor'],$_COOKIE['usr'],$pass,$_COOKIE['bd']);
		mysqli_set_charset($con, "utf8");
	   if (mysqli_connect_errno())
	   {
		   return "No connection";
	   }

	   return $con;
	 }

	public function ExecuteQuery($sp, $params, $size)
	{
		$con = CompanyDB::conDBConnection();

		if (!mysqli_connect_errno()) {
    			
		} else {
    		return mysqli_error($con);
		}

		$query = "";
		if ($sp[strlen($sp) - 1] == ";"){
			$query = $sp;
		}
		else{
			/* grab the posts from the db */
			$query = "Call $sp(";

			foreach ($params as $k) {
				$query =  $query . "$k ,";
			}

			if ( $size != NULL && $size > 0){
				$query = substr($query, 0, strlen($query)-1);
			}

			$query = $query . ")";
		}

		$result = mysqli_query($con,$query) or die ("Error: " . mysql_error());

	
		/* create one master array of the records */
		//$names = mysql_field_array($result);

		$rows = array();
		$names = array();
		$i = true;
		$s = 0;

		while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
		{
			$rows[] = $row;
			if ($i){
				$i = false;

				$names = array_keys($rows[0]);
				$s = sizeof($names);

			}

			foreach ($row as $r) {
				$names[] = $r;
			}
		}
		$names[]= $s;


		

		/* disconnect from the db */
		@mysqli_close($con);

		return $names;
	}

	public function GetProcedimientosToShow()
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "Select titulo, nombre_procedimiento, id from app_procedimiento where show_on_app = 1;";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		while($row = mysqli_fetch_array($result, MYSQLI_NUM))
		{
			$rows[] = $row;
		}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function GetTablasToShow()
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "Select titulo, sp from app_tabla where show_on_app = 1;";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		while($row = mysqli_fetch_array($result, MYSQLI_NUM))
		{
			$rows[] = $row;
		}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function GetReportesToShow()
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "Select titulo, id from app_reporte where show_on_app = 1;";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		while($row = mysqli_fetch_array($result, MYSQLI_NUM))
		{
			$rows[] = $row;
		}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function ExecuteReport($id)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "Select app_procedimiento.nombre_procedimiento, app_procedimiento.titulo from app_reporte_procedimiento join app_procedimiento on app_reporte_procedimiento.id_proc = app_procedimiento.id where id_reporte = $id order by app_reporte_procedimiento.orden;";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		while($row = mysqli_fetch_array($result, MYSQLI_NUM))
		{
			$rows[] = $row;
		}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function GetProcsReporte($id)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "Select id_reporte, id_proc from app_reporte_procedimiento where id_reporte = $id ORDER BY orden;";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		while($row = mysqli_fetch_array($result, MYSQLI_NUM))
		{
			$rows[] = $row;
		}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}


	public function updateTabla($id, $titulo,$proc , $mostrar)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "UPDATE app_tabla SET titulo='$titulo', sp='$proc', show_on_app=$mostrar WHERE id=$id";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}


	public function DeleteCampos($id, $isReporte)
	{
		$con = CompanyDB::conDBConnection();

		$tabla = "app_campo_procedimiento";
		$idCol = "id_proc";

		if ($isReporte == 1){
			$tabla = "app_campo_reporte";
			$idCol = "id_reporte";
		}
		/* grab the posts from the db */
		$query = "DELETE FROM $tabla WHERE $idCol=$id";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function DeleteReporte($id)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "DELETE FROM app_reporte WHERE id=$id;
		          DELETE FROM app_campo_reporte WHERE id_reporte=$id;
		          DELETE FROM app_reporte_procedimiento WHERE id_reporte=$id;";
		$result = mysqli_multi_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}


	public function DeleteProcsRep($id)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "DELETE FROM app_reporte_procedimiento WHERE id_reporte=$id";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function updateProcedure($id, $titulo, $mostrar)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "UPDATE app_procedimiento SET titulo='$titulo', show_on_app=$mostrar WHERE id=$id";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function updateReporte($id, $titulo, $mostrar)
	{
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "UPDATE app_reporte SET titulo='$titulo', show_on_app=$mostrar WHERE id=$id";
		$result = mysqli_query($con,$query);

		/* create one master array of the records */
		$rows = array();
		if ($result) {

        		$rows[] = 1;
    			
			}
			else {
    			$rows[] = 0;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function GetCamposTablas($id)
	{
		$rows = array();
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "select  app_campo_procedimiento.id, app_campo_procedimiento.titulo, tipo, orden, nombre_procedimiento from app_campo_procedimiento join app_procedimiento on app_campo_procedimiento.id_proc =  app_procedimiento.id WHERE id_proc=$id ORDER BY orden";

		$result = mysqli_query($con,$query);

			/* create one master array of the records */
			
			while($row = mysqli_fetch_array($result, MYSQLI_NUM))
			{
				$rows[] = $row;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}
	public function GetCamposReporte($id)
	{
		$rows = array();
		$con = CompanyDB::conDBConnection();

		/* grab the posts from the db */
		$query = "select  app_campo_reporte.id, app_campo_reporte.titulo, tipo, orden, nombre_reporte from app_campo_reporte join app_reporte on app_campo_reporte.id_reporte =  app_reporte.id WHERE id_reporte=$id ORDER BY orden";

		$result = mysqli_query($con,$query);

			/* create one master array of the records */
			
			while($row = mysqli_fetch_array($result, MYSQLI_NUM))
			{
				$rows[] = $row;
			}

		/* disconnect from the db */
		@mysqli_close($link);

		return $rows;
	}

	public function GetProcedimientos()
	{
		$rows = array();
		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();

			/* grab the posts from the db */
			$query = "select DISTINCT ROUTINE_NAME from INFORMATION_SCHEMA.ROUTINES where ROUTINE_SCHEMA ='".$_COOKIE['bd']."';";

			$result = mysqli_query($con,$query);

			/* create one master array of the records */
			
			while($row = mysqli_fetch_array($result, MYSQLI_NUM))
			{
				$rows[] = $row;
			}

			/* disconnect from the db */
			@mysqli_close($link);
		}

		return $rows;
	}

	private function ExisteTabla($str){
		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='".$_COOKIE['bd']."';";
			$result = mysqli_query($con,$query);

			if ($result = $con->query("SHOW TABLES LIKE '$str'")) {
    			if($result->num_rows == 1) {
        			return 1;
    			}
			}
			else {
    			return 0;
			}
		}

		return 0;
	}

	public function InsertCampo($id, $titulo, $tipo, $orden, $isReporte){
		$tabla = "app_campo_procedimiento";
		$idCol = "id_proc";

		if ($isReporte == 1){
			$tabla = "app_campo_reporte";
			$idCol = "id_reporte";
		}

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "INSERT INTO $tabla  ($idCol, titulo, tipo, orden ) VALUES ($id, '$titulo', '$tipo', $orden);";
			$result = mysqli_query($con,$query);

			if ($result) {
    			return 1;
			}
			else {
    			return 0;
			}
		}

		return 0;
	}

	public function InsertProcsRep($idRep, $idProc, $orden){

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "INSERT INTO app_reporte_procedimiento (id_reporte, id_proc, orden ) VALUES ($idRep, $idProc, $orden);";
			$result = mysqli_query($con,$query);

			if ($result) {
    			return 1;
			}
			else {
    			return 0;
			}
		}

		return 0;
	}


	public function InsertReporte($nombre, $titulo){

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "INSERT INTO app_reporte  (nombre_reporte, titulo, show_on_app) VALUES ('$nombre', '$titulo', 1);";
			$result = mysqli_query($con,$query);

			if ($result) {
    			return 1;
			}
			else {
    			return 0;
			}
		}

		return 0;
	}



	private function CrearTabla($strTabla, $strCol1, $proc){
		$rows = array();
		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$conn = CompanyDB::conDBConnection();
			// Check connection
			if ($conn->connect_error) {
    			die("Connection failed: " . $conn->connect_error);
			} 

			if ($proc){
			// sql to create table
				$sql = "CREATE TABLE $strTabla (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, $strCol1 VARCHAR(250) UNIQUE NOT NULL, titulo VARCHAR(250), sp VARCHAR(50), show_on_app INT);";
			}
			else{
				$sql = "CREATE TABLE $strTabla (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, $strCol1 VARCHAR(250) UNIQUE NOT NULL, titulo VARCHAR(250), show_on_app INT);";
			}

			if ($conn->query($sql) === TRUE) {
    			return 1;
			} else {
    			return $conn->error;
			}

			$conn->close();
		}else{
			return  -2;
		}

		return 0;
	}
	private function CrearTablaCampos($strTableName, $strCol){
		$rows = array();

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$conn = CompanyDB::conDBConnection();
			// Check connection
			if ($conn->connect_error) {
    			die("Connection failed: " . $conn->connect_error);
			} 

			$sql = "DROP TABLE $strTableName;";

			$conn->query($sql);
			
			$sql = "CREATE TABLE $strTableName(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(250) NOT NULL,  $strCol int(6)  NOT NULL, tipo VARCHAR(250), orden INT(6)  NOT NULL);";

			if ($conn->query($sql) === TRUE) {
    			return 1;
			} else {
    			return $conn->error;
			}

			$conn->close;
		}else{
			return  -2;
		}

		return 0;
	}

	private function insertRegTablas($strTabla, $strCol1, $strCol1Value, $strTitulo, $strProc, $strMostrar){
		$rows = array();
		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
				$conn = CompanyDB::conDBConnection();

				if ($strProc != NULL){
				/* grab the posts from the db */
					$query = "INSERT INTO $strTabla ($strCol1, titulo, sp, show_on_app ) VALUES ('$strCol1Value', '$strTitulo', '$strProc', $strMostrar);";
				}else{
					$query = "INSERT INTO $strTabla ($strCol1, titulo, show_on_app ) VALUES ('$strCol1Value', '$strTitulo', $strMostrar);";
				}
			
				if ($conn->query($query) === TRUE) {
    				return 1;
				} else {
    				return $conn->error;
				}
		}
		else{
			return  -2;
		}
		return 0;
	}

	private function GetTablas(){
			$rows = array();
			if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){

				$con = CompanyDB::conDBConnection();

				/* grab the posts from the db */
				$query = "SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='".$_COOKIE['bd']."';";

				$result = mysqli_query($con,$query);

				/* create one master array of the records */
			
				while($row = mysqli_fetch_array($result, MYSQLI_NUM))
				{
					$rows[] = $row;
				}
			}
			return $rows;
	}

	private function GetAPTablas(){
			$rows = array();
			if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){

				$con = CompanyDB::conDBConnection();

				/* grab the posts from the db */
				$query = "SELECT * FROM app_tabla;";

				$result = mysqli_query($con,$query);

				/* create one master array of the records */
			
				while($row = mysqli_fetch_array($result, MYSQLI_NUM))
				{
					$rows[] = $row;
				}
			}
			return $rows;
	}

	private function GetAPProcedimientos(){
			$rows = array();
			if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){

				$con = CompanyDB::conDBConnection();

				/* grab the posts from the db */
				$query = "SELECT app_procedimiento.id, nombre_procedimiento, app_procedimiento.titulo, count(app_campo_procedimiento.id_proc), show_on_app FROM app_procedimiento left join app_campo_procedimiento on app_procedimiento.id = app_campo_procedimiento.id_proc GROUP BY app_procedimiento.id;";

				$result = mysqli_query($con,$query);

				/* create one master array of the records */
			
				while($row = mysqli_fetch_array($result, MYSQLI_NUM))
				{
					$rows[] = $row;
				}
			}
			return $rows;
	}

	private function ExisteReg($col, $table, $reg){
		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "SELECT * FROM $table WHERE $col ='$reg';";
			

			if ($result = mysqli_query($con,$query)) {
    			if($result->num_rows >= 1) {
        			return 1;
    			}
			}
			else {
    			return 0;
			}
		}

		return 0;
	}

	public function GetAllTablas(){
		$tabs = array();
		$rows = array();

		if (CompanyDB::ExisteTabla("app_tabla") == 0){
			$rows[] = CompanyDB::CrearTabla("app_tabla", "nombre_tabla" , TRUE);
			$rows = CompanyDB::GetTablas();
			foreach($rows as $r){
				$tabs[] = CompanyDB::insertRegTablas("app_tabla", "nombre_tabla", $r[0], $r[0], "select * from ".$_COOKIE['bd'].".`".$r[0]."`;" , 1);
			}
			$tabs = CompanyDB::GetAPTablas();
		}
		else{
			$rows = CompanyDB::GetTablas();
			foreach($rows as $r){
				if (CompanyDB::ExisteReg("nombre_tabla","app_tabla" ,$r[0]) == 0){
					$tabs[] = CompanyDB::insertRegTablas("app_tabla", "nombre_tabla", $r[0], $r[0], "select * from ".$_COOKIE['bd'].".`".$r[0]."`;" , 1);
				}
			}
			CompanyDB::deleteExtraTablas();
			$tabs = CompanyDB::GetAPTablas();
		}
		return $tabs;
	}

	public function GetAllReportes(){
		$tabs = array();
		$rows = array();

		if (CompanyDB::ExisteTabla("app_reporte") == 0){
			$rows[] = CompanyDB::CrearTabla("app_reporte", "nombre_reporte" , FALSE);
			CompanyDB::CrearTablaCampos("app_campo_reporte", "id_reporte");
			CompanyDB::CrearTablaReporteProcedimiento();
		}
		else{
			$tabs = CompanyDB::GetAPReportes();
		}
		return $tabs;
	}


	public function deleteExtraTablas(){

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "DELETE FROM app_tabla WHERE (nombre_tabla) NOT IN (
						SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='".$_COOKIE['bd']."')";
			$result = mysqli_query($con,$query);

			if ($result) {
    			return 1;
			}
			else {
    			return 0;
			}
		}

		return 0;
	}

	public function deleteExtraProcedimientos(){

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$con = CompanyDB::conDBConnection();
			$query = "DELETE FROM app_procedimiento WHERE (nombre_procedimiento) NOT IN (
						select DISTINCT ROUTINE_NAME from INFORMATION_SCHEMA.ROUTINES where ROUTINE_SCHEMA ='".$_COOKIE['bd']."')";

			$result = mysqli_query($con,$query);

			if ($result) {
    			return 1;
			}
			else {
    			return 0;
			}
		}

		return 0;
	}

	public function GetAllProcedimientos(){
		$tabs = array();
		$rows = array();

		if (CompanyDB::ExisteTabla("app_procedimiento") == 0){
			$rows[] = CompanyDB::CrearTabla("app_procedimiento", "nombre_procedimiento", FALSE);
			CompanyDB::CrearTablaCampos("app_campo_procedimiento", "id_proc");
			$rows = CompanyDB::GetProcedimientos();
			foreach($rows as $r){
				$tabs[] = CompanyDB::insertRegTablas("app_procedimiento", "nombre_procedimiento", $r[0], $r[0], NULL, 1);
			}
			$tabs = CompanyDB::GetAPProcedimientos();
		}
		else{
			$rows = CompanyDB::GetProcedimientos();
			foreach($rows as $r){
				if (CompanyDB::ExisteReg("nombre_procedimiento", "app_procedimiento", $r[0]) == 0){
					$tabs[] = CompanyDB::insertRegTablas("app_procedimiento", "nombre_procedimiento", $r[0], $r[0], NULL, 1);
				}
			}
			CompanyDB::deleteExtraProcedimientos();
			$tabs = CompanyDB::GetAPProcedimientos();
		}

		return $tabs;
	}


	private function GetAPReportes(){
			$rows = array();
			if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){

				$con = CompanyDB::conDBConnection();

				/* grab the posts from the db */
				$query = "SELECT app_reporte.id, nombre_reporte, app_reporte.titulo, count(app_campo_reporte.id), t2C, show_on_app FROM app_reporte left join app_campo_reporte on app_reporte.id = app_campo_reporte.id_reporte left join ( 
						SELECT app_reporte.id, count(app_reporte_procedimiento.id) as t2C FROM app_reporte 
    						left join app_reporte_procedimiento on app_reporte.id = app_reporte_procedimiento.id_reporte group by app_reporte.id
					) as t2 on app_reporte.id = t2.id GROUP BY app_reporte.id;";

				$result = mysqli_query($con,$query);

				/* create one master array of the records */
			
				while($row = mysqli_fetch_array($result, MYSQLI_NUM))
				{
					$rows[] = $row;
				}
			}
			return $rows;
	}

	private function CrearTablaReporteProcedimiento(){
		$rows = array();

		if (isset($_COOKIE['servidor'] ) && isset($_COOKIE['bd']) && isset($_COOKIE['usr'])){
			$conn = CompanyDB::conDBConnection();
			// Check connection
			if ($conn->connect_error) {
    			die("Connection failed: " . $conn->connect_error);
			} 

			$sql = "DROP TABLE app_reporte_procedimiento;";

			$conn->query($sql);
			
			$sql = "CREATE TABLE app_reporte_procedimiento (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, id_reporte int(6)  NOT NULL, id_proc int(6)  NOT NULL, orden INT(6)  NOT NULL);";

			if ($conn->query($sql) === TRUE) {
    			return 1;
			} else {
    			return $conn->error;
			}

			$conn->close;
		}else{
			return  -2;
		}

		return 0;
	}
}

//======================================================================================================================
?>
