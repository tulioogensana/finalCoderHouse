/*
datos para consumir API 
*/
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://priceline-com-provider.p.rapidapi.com/v1/cars-rentals/search?location_return=1365100023&date_time_pickup=2021-12-12%2011%3A00%3A00&date_time_return=2021-12-15%2011%3A00%3A00&location_pickup=MIA",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
		"x-rapidapi-key": "8aeee6a489msh5dc96771ae204b2p167d52jsne1e231adb4cb"
	}
};

const disponibles = []
const partners = []
const categories = []
let vehiculo = {}
let partner = {}

console.log("================================")
console.log($("#btn-buscar"))
// $("btn-buscar").onclick = function()
$("#inputTo").hide() 

$("#exampleCheck1").click(function(mievento){
    mievento.preventDefault();
    
    
    let checkedTo = $("#exampleCheck1").val()
    console.log(checkedTo)
    if (checkedTo=="on") { 
        $("#exampleCheck1").val("off")
    }else{
        $("#exampleCheck1").val("on")
    }
    $("#inputTo").toggle() 
    //$("#exampleCheck1").toggle() 
    // Thisalert("Has hecho clic. Como he hecho preventDefault, no te llevaré al href");
 });

 $("#btn-buscar").click(function (event) {


    $("#procesando").show();

    let airportFrom = $( "select#inputFrom" ).val();
    let fromDate = $( "#dateFrom" ).val();
    let fromTime = $("#timeFrom").val();
    let checkedTo = $("#exampleCheck1").val()
    let airportTo = $( "select#inputTo" ).val();
    let toDate = $("#dateTo").val()

    $("#partners-list").hide();
    //alert("Desde fecha: "  + fromDate);
    //alert("Desde hora: "  + fromTime);
    console.log("Checked: " + checkedTo);
    console.log("Desde Aerouerto: "  + airportFrom);
    console.log("Desde Fecha: " + fromDate);
    console.log("Desde hora: " + fromTime);
    if (checkedTo=="on"){
        airportTo = airportFrom
        console.log("Coinciden entrega y devolucion:" + airportTo);
    }else{
        console.log("El lugar de entrega es distinto: " + airportTo)
    }
    console.log("Hasta fecha: " + toDate)


    //localStorage.clear()
    var currentDate = localStorage.getItem('fecha');
    var currentQty = localStorage.getItem('qty');
    
    let hoy = new Date();
    
    let ldtFechaHoy = hoy.toDateString()
    console.log("Hoy es:" + ldtFechaHoy)
    console.log("Qty es:" + currentQty)
    console.log("la ultima fecha registrada es: " + currentDate)
  
    if (currentDate==null || currentDate<ldtFechaHoy) {
        console.log('Se registra la fecha de hoy')
        localStorage.setItem('fecha', ldtFechaHoy)
        localStorage.setItem("qty", 1)
        currentQty=1
    }else{

        if(currentDate == ldtFechaHoy){
            currentQty++
            localStorage.setItem("qty", currentQty)
            console.log(localStorage.getItem("qty"))
        }
    }
    $("#footer .query").empty();
    $("#footer .query").append("<br><p class='m-0 text-center text-white'>Ya utilizó la consulta número " + currentQty + " de 10 intentos disponibles</p>")


    /*ahora hay que amar el objeto con los datos para el json*/
    console.log("--------------------------------------------")
    console.log(settings)
    console.log("Antes:" + settings.url)
    let newUrl = ``
    newUrl += `https://priceline-com-provider.p.rapidapi.com/v1/cars-rentals/search?`
    newUrl += `location_return=${airportTo}`
    newUrl += `&date_time_pickup=${fromDate}`
    newUrl += `%2011%3A00%3A00&date_time_return=${toDate}%2011%3A00%3A00&location_pickup=${airportFrom}`
    console.log("Ahora:" + newUrl)
    settings.url = newUrl
    console.log(settings)
    
    /* Ahora pedir el JSON con los datos gnerados */
    // let resultadosAPI;
    $.ajax(settings).done(function (respuesta) {
        // resultadosAPI = response;
        if(respuesta){
            console.log(respuesta);
            let sizes = respuesta.vehicleCategoryGroupsByType.vehicle_size
            let types = respuesta.vehicleCategoryGroupsByType.vehicle_type
            let catByPrice = respuesta.vehicleCategoryLists.categoriesByTotalPrice
            


            /* CATEGORIAS DE VEHICULOS */
            const objCategories = respuesta.vehicleCategoryLists.categoriesByTotalPrice
            categories.push(objCategories);

            /* PARTNERS */
            console.log("Agregando a lista de Partners")
            $("#listaIzquierda").append(`<div class='tg2'><h3>Partners</h3></div>`);
            const objPartners = respuesta.partnerLists.allPartnersByName
            for(let partnerId of objPartners) {
                partner = {}
                /*
                console.log("Partner iniciales: " + partner)
                const objPartnersList = respuesta.partners
                console.log("Partner detalles:")
                console.log(objPartnersList)
                */
                const objPartnersDetails = respuesta.partners[partnerId]
                //console.log("Partner detalles de:" + partnerId )
                //console.log("Partner detalles: " + objPartnersDetails.partnerName)
                
                partner.Code = partnerId
                partner.Name = objPartnersDetails.partnerName
                partner.phoneNumber = objPartnersDetails.phoneNumber

                const objPartnersImages = objPartnersDetails.images
                //Object.keys devuelve un array cuyos elementos son strings correspondientes a las propiedades enumerables que se encuentran directamente en el object
                const imageKeys = Object.keys(objPartnersImages);
              
                for(let imageKey of imageKeys) {
                    //para cada elemnto fel array
                    //console.log(imageKey)
                    //console.log(objPartnersImages[imageKey])
                    //cada imagen va pisando la anterior y queda la ultima
                    partner.Image = objPartnersImages[imageKey]

                }
                partner.Image = objPartnersImages.HEIGHT18
                partners.push(partner)
                $("#listaIzquierda").append(`<a class="filtro" overlay="${partner.Code}"><img height="18" width="36" src="${partner.Image}" alt=${partner.Name}></img></a>`);

            }

            $(".filtro").click(function(){
                console.log("click en filtro")
                let partner = $(this).attr("overlay")
                console.log(partner)
                const result = disponibles.filter(car => car.partnerCode == partner );

                console.log(result);
                
                $("#cardcars").empty()
                
                if (result.length==0){
                    $("#cardcars").append("<h2>No hay resultados disponibles</h2>");
                }else{
                    llenarVehiculos(result)
                }
            })
            
            const objetito = respuesta.rateLists.allVehicleRatesByTotalPrice
            //console.log(objetito)
                        
            const objetazo = respuesta.vehicleRates
            //console.log(objetazo)
            
            //Object.keys devuelve un array cuyos elementos son strings correspondientes a las propiedades enumerables que se encuentran directamente en el object
            const qq = Object.keys(objetazo);

            let q = qq.length
            console.log(q)

            for (let id=0; id<q; id++) { 
                vehiculo = {}
                const objetazo = respuesta.vehicleRates[objetito[id]]
                //console.log(objetazo)
                //console.log("Informacion del vehiculo: ")
                //console.log(objetazo.id)
                vehiculo.id = id
                //vehiculo.key = objetazo.id
                //vehiculo.vehicleCode = objetazo.vehicleCode
                //vehiculo.numRentalDays = objetazo.numRentalDays
                //vehiculo.vehicleCategoryIds = objetazo.vehicleCategoryIds

                console.log("objetazo", objetazo)
                const objpartenerInfo = objetazo.partnerInfo
                
                console.log("Informacion del vehiculo Partner: ")
                
                
                if (objetazo.partnerInfo != undefined){
                    console.log(objpartenerInfo.vehicleExample)
                    //vehiculo.modeloEjemplo = objpartenerInfo.vehicleExample
                    //vehiculo.pickupLocationId = objpartenerInfo.pickupLocationId
                    vehiculo.returnLocationId = objpartenerInfo.returnLocationId
                    //vehiculo.peopleCapacity = objpartenerInfo.peopleCapacity
                    vehiculo.bagCapacity = objpartenerInfo.bagCapacity
                    const objimagenes = objetazo.partnerInfo.images
                    vehiculo.images = objimagenes.SIZE268X144
                    vehiculo.partnerCode = objetazo.partnerCode                    
                }
                let seAgrega = false
                


               



                const objVehicleInfo = objetazo.vehicleInfo
                vehiculo.description = objVehicleInfo.description
                //vehiculo.numberOfDoors = objVehicleInfo.numberOfDoors
                vehiculo.automatic = objVehicleInfo.automatic
                vehiculo.modelo = objVehicleInfo.vehicleExample

                const objRates = objetazo.rates.USD
                vehiculo.CurrencyCode = objRates.currencyCode
                vehiculo.totalAllInclusivePrice = objRates.totalAllInclusivePrice

                console.log(vehiculo)
                if (vehiculo.modelo!=undefined ){
                    // let carCard = '<div class="col-sm-12 col-lg-6"><div class="card h-100">'
                    // carCard +=  `<p>Available Car #${vehiculo.id} ${vehiculo.modelo} o similar </p>`
                    // carCard +=  `<img src="${vehiculo.images}">  `
                    // carCard +=  `${vehiculo.description}`
                    // carCard +=  `Bags capacity: ${vehiculo.bagCapacity}  - `
                    // carCard +=  `<b>type: ${vehiculo.partnerCode}  - </b>`
                    // carCard +=  ` devolucion: ${vehiculo.returnLocationId}  - </b>` 
                    // if (vehiculo.automatic){
                    //     carCard +=  ` Caja Automatica!  `
                    // }
                    // carCard +=  `Total a pagar: ${vehiculo.totalAllInclusivePrice} `
                    // // CurrencyCode: "USD"
                    // carCard +="</div></div>"
                    // $("#cardcars").append(carCard)
                    // //$("body").append(carCard)
              
                    disponibles.push(vehiculo)
                }
            }
           
            llenarVehiculos(disponibles)

        }else{
            $("#cardcars").append("<p>No hay resultados disponibles</p>");
        }
        $("#procesando").hide();
    });


    event.preventDefault();

});


$( "#inputFrom" ).select(function() {
    let aux = $( "select#inputFrom" ).val();
    alert( aux );
    
  });

  $( "select#inputFrom" ).val();





function llenarVehiculos(arrayVehiculos){ 
    for( let vehiculo of arrayVehiculos){
        if (vehiculo.modelo!=undefined){
            let partner = vehiculo.partnerCode
            //console.log(partner)
            const result = disponibles.filter(car => car.partnerCode == partner );
            const elPartner = partners.filter(part => part.Code == partner)
            let partName = elPartner[0].Name
            let image = elPartner[0].Image
            
            //console.log("Solo el nombre: ")
            //console.log(partName)

            let carCard = '<div class="col-sm-6 col-lg-4 mb-3"><div class="card h-100">'
            carCard +=  `<p>Available Car #${vehiculo.id} ${vehiculo.modelo} o similar </p>`
            carCard +=  `<img src="${vehiculo.images}">  `
            carCard +=  `${vehiculo.description}`
            carCard +=  ` - Bags capacity: ${vehiculo.bagCapacity}  - `
            carCard +=  `<b>Partner: ${vehiculo.partnerCode}  - ${partName}  - <img src="${image}"></img>`
            
            carCard +=  `devolucion: ${vehiculo.returnLocationId}  - </b>` 
            if (vehiculo.automatic){
                carCard +=  ` Caja Automatica!  `
            }
            carCard +=  `<span class="badge bg-secondary"> Total a pagar: ${vehiculo.totalAllInclusivePrice} </span>`
            carCard +="</div></div>"
            $("#cardcars").append(carCard)
        }
    }
}
