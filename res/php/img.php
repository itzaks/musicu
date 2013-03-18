<?php 
	$img = $_GET['img'];
	
	$handle = fopen($img, "rb");
	$imagedata = stream_get_contents($handle);
	fclose($handle);
	
	
	header('Content-type: image/jpg');
	echo $imagedata;  
?>