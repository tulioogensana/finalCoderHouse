//Declaramos la URL para GET
const URL4GET = 'https://jsonplaceholder.typicode.com/posts'
const URL4POST = 'https://jsonplaceholder.typicode.com/posts'
//const URL4JSON = 'data/datos.json'
const URL4JSON = 'data/rentacar.json'


const disponibles = []
const partners = []
const categories = []
let vehiculo = {}
let partner = {}


const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://priceline-com-provider.p.rapidapi.com/v1/cars-rentals/search?location_return=MCO&date_time_pickup=2021-12-22%2011%3A00%3A00&date_time_return=2021-12-25%2011%3A00%3A00&location_pickup=LAX",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
		"x-rapidapi-key": "8aeee6a489msh5dc96771ae204b2p167d52jsne1e231adb4cb"
	}
};



//$("body").append('<button id="btn1">GET</button>')
//$("body").append('<button id="btn2">POST</button>')
$("body").append('<button id="btn3">Para testear con un archivo de ejemplo cuando falla la API</button>')



$("#btn3").click(()=>{
    $.getJSON(URL4JSON, function(respuesta, estado) {
        console.log("Respuesta: " + respuesta)
        console.log("Estado: " + estado)    
        let location = ""
        if(estado==="success"){
            //$("body").append(`<div class='tg2'><h3>${respuesta.pickupDateTime}</h3><h3>${respuesta.returnDateTime}</h3></div>`);
            //$("body").append(`<div class='tg2'><h3>${respuesta.changeReservation}</h3><h3>${respuesta.posCurrencyCode}</h3></div>`);

            //let misDatos = respuesta;       //Uncaught TypeError: misDatos is not iterable
            //let misDatos = respuesta.vehicleCategoryLists   //Uncaught TypeError: misDatos is not iterable
            //let misDatos = respuesta.vehicleCategoryLists.categoriesBySize      //si funciona

            let sizes = respuesta.vehicleCategoryGroupsByType.vehicle_size

            /*
            for(let size of sizes) {
                $("body").append(`<div class='tg2'><h3>Tag: ${size}</h3></div>`);
            }
            */
            let types = respuesta.vehicleCategoryGroupsByType.vehicle_type

            /*
            for(let type of types) {
                $("body").append(`<div class='tg2'><li>Type: ${type}</li></div>`);
            }
            */

            let catByPrice = respuesta.vehicleCategoryLists.categoriesByTotalPrice
            


            /* CATEGORIAS DE VEHICULOS */
            const objCategories = respuesta.vehicleCategoryLists.categoriesByTotalPrice
            categories.push(objCategories);

            /*
            for (let eachCategory in objCategories){
                categories.push(eachCategory)
            }
            */
            console.log(categories)

            /* PARTNERS */
            console.log("Agregando a lista de Partners")
            $("#listaIzquierda").append(`<span class='tg2'><h3>Partners</h3><h7>(Haga click para filtrar resultados)</h7></span>`);
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

                //Muestra los elementos del array (claves del objeto)
                //console.log(imageKeys)

                
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
            //console.log(partners)
            $(".filtro").click(function(){
                let partner = $(this).attr("overlay")
                console.log(partner)

                const result = disponibles.filter(car => car.partnerCode == partner );

                console.log(result);
                $("#CarsCards").empty()
                $("#cardcars").empty()
                

                llenarVehiculos(result)
            
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
                vehiculo.key = objetazo.id
                vehiculo.vehicleCode = objetazo.vehicleCode
                vehiculo.numRentalDays = objetazo.numRentalDays
                vehiculo.vehicleCategoryIds = objetazo.vehicleCategoryIds


                const objpartenerInfo = objetazo.partnerInfo
                //console.log("Informacion del vehiculo Partner: ")
                //console.log(objpartenerInfo.vehicleExample)
                vehiculo.modeloEjemplo = objpartenerInfo.vehicleExample
                vehiculo.pickupLocationId = objpartenerInfo.pickupLocationId
                vehiculo.returnLocationId = objpartenerInfo.returnLocationId
                let seAgrega = false
                

                if (id==0){
                    location = vehiculo.returnLocationId
                    console.log("Location basica:" + location)
                    seAgrega = true
                }else{
                    if(location == vehiculo.returnLocationId){
                        seAgrega = true
                    }


                }
                vehiculo.peopleCapacity = objpartenerInfo.peopleCapacity
                vehiculo.bagCapacity = objpartenerInfo.bagCapacity

                const objimagenes = objetazo.partnerInfo.images
                vehiculo.images = objimagenes.SIZE268X144
                vehiculo.partnerCode = objetazo.partnerCode

                const objVehicleInfo = objetazo.vehicleInfo
                vehiculo.description = objVehicleInfo.description
                vehiculo.numberOfDoors = objVehicleInfo.numberOfDoors
                vehiculo.automatic = objVehicleInfo.automatic
                vehiculo.modelo = objVehicleInfo.vehicleExample

                const objRates = objetazo.rates.USD
                vehiculo.CurrencyCode = objRates.currencyCode
                vehiculo.totalAllInclusivePrice = objRates.totalAllInclusivePrice

                //console.log(vehiculo)
                if (vehiculo.modelo!=undefined ){
                    let carCard = '<div class="col-sm-12 col-lg-4 mb-3"><div class="card h-100">'
                    carCard +=  `<p>Available Car #${vehiculo.id} ${vehiculo.modelo} o similar </p>`
                    carCard +=  `<img src="${vehiculo.images}">  `
                    carCard +=  `${vehiculo.description}`
                    carCard +=  `Bags capacity: ${vehiculo.bagCapacity}  - `
                    carCard +=  `<b>type: ${vehiculo.partnerCode}  - </b>`
                    carCard +=  ` devolucion: ${vehiculo.returnLocationId}  - </b>` 
                    if (vehiculo.automatic){
                        carCard +=  ` Caja Automatica!  `
                    }
                    carCard +=  `Total a pagar: <span class="badge bg-secondary">${vehiculo.totalAllInclusivePrice} </span>`
                    // CurrencyCode: "USD"
                    carCard +="</div></div>"
              
                    disponibles.push(vehiculo)
                }
                //console.log(vehiculo)
            }

            console.log("Disponibles: " + disponibles)
            console.log("Total elementos " + disponibles.length)
            //const subsDisponibles = new Set(disponibles).size
            //console.log("Subs: " + subsDisponibles.length)
            llenarVehiculos(disponibles)
        }
    })

}


)

function llenarVehiculos(arrayVehiculos){
    //console.log(partners)
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

            let carCard = '<div class="col-sm-12 col-lg-4 mb-3"><div class="card h-100">'
            carCard +=  `<p>Available Car #${vehiculo.id} ${vehiculo.modelo} o similar </p>`
            carCard +=  `<img src="${vehiculo.images}">  `
            carCard +=  `${vehiculo.description}`
            carCard +=  ` - Bags capacity: ${vehiculo.bagCapacity}  - `
            carCard +=  `<b>Partner: ${vehiculo.partnerCode}  - ${partName}  - <img src="${image}"></img>`

            //carCard +=  `devolucion: ${vehiculo.returnLocationId}  - </b>` 
            if (vehiculo.automatic){
                carCard +=  `<p> Caja Automatica!  </p>`
            }
            carCard +=  `<span class="badge bg-secondary"> Total a pagar: ${vehiculo.totalAllInclusivePrice} </span>`
            carCard +="</div></div>"
            $("#cardcars").append(carCard)
        }

    }


}