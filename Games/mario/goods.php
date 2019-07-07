<?php
	require("D:\phpStudy\www\MysqlHandle.php");

	$websql = new MysqlHandle();
	$sql = "SELECT * From ecs_users WHERE 1 ORDER BY reg_time ASC LIMIT 1000";
	$sth = $websql->dbh->query($sql);
	$data = $sth->fetchAll( PDO::FETCH_ASSOC );
	die(json_encode($data));
?>