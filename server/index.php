<?php
include_once ('config.php');
include_once('ShopCars.php');

try
{
    ini_set('soap.wsdl_cache_enabled', '0');
    $obj = new SoapServer('http://192.168.0.15/~user12/public_html/SOAP/soap2/server/auto.wsdl');
    $obj->setClass('ShopCars');
    $obj->handle();
}

catch(Exception $e)
{
    $error = $e->getMessage();
}


