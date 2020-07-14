<?php
	
	$DB_DRIVER='mysqli';
	$DB_HOSTNAME='localhost';
	$DB_USERNAME='root';
	$DB_PASSWORD='';
	$DB_DATABASE='ionic5_db';
	$DB_PREFIX='';

	$mysqli = new mysqli($DB_HOSTNAME,$DB_USERNAME,$DB_PASSWORD,$DB_DATABASE);
	
	date_default_timezone_set('America/Sao_Paulo');

?>