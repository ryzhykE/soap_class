var model = ['M5','Corola','Gran Turismo','BMW X4','A4','Audi TT','S5'];
var color = ['Red','Black','Grey'];
var year = ['2011','2015','2016'];
var engine = ['1600','2500','3200'];
var maxSpeed = ['160','180','190','200'];
var price = ['1200','2900','5000','10000'];
var error = document.querySelector('.error');
var errors = document.querySelector('.errors');
var serch = {};
var filter = document.querySelector('#filter');
var orderCar = {};

/**
 * draw select
 * @param data
 * @param myDiv
 * @param param
 */
function getSelect(data,myDiv,param){
    myDiv.innerHTML = "";
    var def = document.createElement('option');
    def.innerHTML=param;
    def.setAttribute('disabled','true');
    def.setAttribute('selected','selected');
    myDiv.appendChild(def);
    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", data[i]);
        option.text = data[i];
        myDiv.appendChild(option);
    }
}

var modelSel = document.querySelector("select[name=model]");
getSelect(model,modelSel,'Model');

var yearSel = document.querySelector("select[name=year]");
getSelect(year,yearSel,'Year');

var engineSel = document.querySelector("select[name=engine]");
getSelect(engine,engineSel,'Engine');

var colorSel = document.querySelector("select[name=color]");
getSelect(color,colorSel,'Color');

var maxSpeedSel = document.querySelector("select[name=maxSpeed]");
getSelect(maxSpeed,maxSpeedSel,'Max Speed');

var priceSel = document.querySelector("select[name=price]");
getSelect(price,priceSel,'Price');

/**
 * draw clear
 * @type {Element}
 */
var clearSel = document.querySelector("#clear");
clearSel.addEventListener('click',function(){

    getSelect(model,modelSel,'Model');
    getSelect(year,yearSel,'Year');
    getSelect(engine,engineSel,'Engine');
    getSelect(color,colorSel,'Color');
    getSelect(maxSpeed,maxSpeedSel,'Max Speed');
    getSelect(price,priceSel,'Price');
    error.innerHTML='';
    serch = {};
    allCars();
});

/**
 * get XMLHttpRequest
 * @returns {*}
 */
function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

/**
 * get all cars
 */
function allCars(){
    var xhr = getXmlHttp();
    xhr.open('POST', 'http://192.168.0.15/~user12/public_html/SOAP/soap2/client/SoapClient.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var body = "allCars=" + encodeURIComponent();
    xhr.send(body);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                var obj = JSON.parse(xhr.responseText)
                drawCars(obj);
            }
        }
    }
}

/**
 * filter input
 */
filter.addEventListener("click", function(){
    var model = document.querySelector('#model');
    var year = document.querySelector('#year');
    var engine = document.querySelector('#engine');
    var color = document.querySelector('#color');
    var maxSpeed = document.querySelector('#maxSpeed');
    var price = document.querySelector('#price');

    if(model[model.selectedIndex].innerHTML != 'Model'){
        serch.model = model[model.selectedIndex].innerHTML;
    }
    if(year[year.selectedIndex].innerHTML != 'Year'){
        serch.year = year[year.selectedIndex].innerHTML;
    }else{
        return error.innerHTML = 'Make a choice year';
    }
    if(engine[engine.selectedIndex].innerHTML != 'Engine'){
        serch.engine = engine[engine.selectedIndex].innerHTML;
    }
    if(color[color.selectedIndex].innerHTML != 'Color'){
        serch.color = color[color.selectedIndex].innerHTML;
    }
    if(maxSpeed[maxSpeed.selectedIndex].innerHTML != 'Max Speed'){
        serch.maxSpeed  = maxSpeed[maxSpeed.selectedIndex].innerHTML;
    }
    if(price[price.selectedIndex].innerHTML != 'Price'){
        serch.price = price[price.selectedIndex].innerHTML;
    }

    var obj = JSON.stringify(serch);
    if(Object.keys(obj).length !== 0){
        var xmlhttp = getXmlHttp();
        xmlhttp.open('POST', 'http://192.168.0.15/~user12/public_html/SOAP/soap2/client/SoapClient.php', false);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var getSerch = "getSerch=" + encodeURIComponent(obj);
        xmlhttp.send(getSerch);
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                var serchCar = JSON.parse(xmlhttp.responseText);
                drawCars(serchCar);
            }
        }
    }

});

/**
 * draw all cars
 * @param cars
 */
function drawCars(cars){
    var list = document.querySelector('.mainContent');
    list.innerHTML ='';
    var list1 = document.querySelector('.order');
    list1.setAttribute('style','display:none');
    cars.forEach( function(car,key) {
        var container = document.createElement("div");
        container.setAttribute('class','col-md-3 allcars');
        var brand = document.createElement('h4');
        var model = document.createElement('p');
        var id = document.createElement('p');
        var a = document.createElement('a');
        a.setAttribute("onclick", "getCarById("+ car.id +")");
        brand.innerHTML = car.brand;
        model.innerHTML = car.model;
        id.innerHTML = car.id;
        container.appendChild(id);
        container.appendChild(brand);

        container.appendChild(a);
        a.appendChild(model);
        list.appendChild(container);
    });
}
allCars();

/**
 * get car by id
 * @param id
 */
function getCarById (id) {
    var carId = "idCar=" + encodeURIComponent(id);
    var xmlhttp = getXmlHttp();
    xmlhttp.open('POST', 'http://192.168.0.15/~user12/public_html/SOAP/soap2/client/SoapClient.php', false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(carId);
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            var carOne = JSON.parse(xmlhttp.responseText);
            //console.log(carInfo);
            drawCarById(carOne);
        }
    }
};

/**
 * draw one car, order form
 * @param id
 * @returns {boolean}
 */
function drawCarById(id) {
    if (typeof id != 'object')
    {
        alert('NO Id Car');
        return false;
    }
    var list2 = document.querySelector('.order');
    list2.setAttribute('style','display:block');
    var idCar = document.getElementById("id_car");
    idCar.setAttribute("value", id.brand + ' / ' + id.model);
    var list = document.querySelector('.mainContent');
    var list1 = document.querySelector('.well');
    list1.setAttribute('style','display:none');
    list.innerHTML ='';
    list1.innerHTML ='';
    var container = document.createElement("div");
    container.setAttribute('class','col-md-10');
    var brand = document.createElement('h4');
    var model = document.createElement('p');
    var year = document.createElement('p');
    var engine = document.createElement('p');
    var color = document.createElement('p');
    var price = document.createElement('p');
    var maxSpeed = document.createElement('p');
    var order = document.createElement('button');
    order.setAttribute("class", "btn btn-info");
    order.setAttribute("onclick", "orderCars(" + id.id + ")");
    order.innerHTML = 'Order Car';
    brand.innerHTML =' Brand : ' +id.brand;
    model.innerHTML =' Model : ' +id.model;
    year.innerHTML = ' Year  : ' +id.year;
    engine.innerHTML =' Engine : ' +id.engine;
    color.innerHTML =' Color : ' +id.color;
    price.innerHTML =' Price : ' +id.price;
    maxSpeed.innerHTML =' Max Speed : ' +id.maxSpeed;
    container.appendChild(brand);
    container.appendChild(model);
    container.appendChild(year);
    container.appendChild(engine);
    container.appendChild(color);
    container.appendChild(price);
    container.appendChild(maxSpeed);
    container.appendChild(order);
    list.appendChild(container);
};

/**
 *  get order
 * @param id
 */
function orderCars(id) {
    orderCar.id_cars = id;
    orderCar.first_name = document.getElementById("inputFname").value;
    orderCar.second_name = document.getElementById("inputLname").value;
    orderCar.payment = document.getElementById("paySelect").value;
    var body = "orderCar=" + JSON.stringify(orderCar);
    var xmlhttp = getXmlHttp();
    xmlhttp.open('POST', 'http://192.168.0.15/~user12/public_html/SOAP/soap2/client/SoapClient.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send(body);
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState != 4)
        {
            return;
        }
        if (xmlhttp.status != 200)
        {
            alert(xmlhttp.status + ' - ' + xmlhttp.statusText);
        }
        else
        {
            if (xmlhttp.responseText == 1)
            {
                alert('Thank you!');
            }
            else
            {
                errors.innerHTML = xmlhttp.responseText;;
            }
        }

    }
}









