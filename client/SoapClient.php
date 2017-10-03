<?php
include_once ('../server/ShopCars.php');
include_once ('../server/config.php');
ini_set("soap.wsdl_cache_enabled", "0");

$client = new SoapClient("http://192.168.0.15/~user12/public_html/SOAP/soap2/server/auto.wsdl");

if(isset($_POST) && !empty($_POST['allCars']))
{
    try
    {
        echo $client->allCars();
    }
    catch (SoapFault $e)
    {
        echo $e->getMessage();
    }
}



if(isset($_POST) && !empty($_POST['getSerch']))
{
    try
    {
        $serch = $_POST['getSerch'];
        echo $client->getSerch($serch);
    }
    catch (SoapFault $e)
    {
        echo $e->getMessage();
    }
}

if(isset($_POST) && !empty($_POST['idCar']))
{
    try
    {
        $id = $_POST['idCar'];
        echo $client->idCars($id);
    }
    catch (SoapFault $e)
    {
        echo $e->getMessage();
    }
}

if(isset($_POST) && !empty($_POST['orderCar']))
{
    try
    {
        $order = $_POST['orderCar'];
        echo $client->getOrders($order);
    }
    catch (SoapFault $e)
    {
        echo $e->getMessage();
    }
}




