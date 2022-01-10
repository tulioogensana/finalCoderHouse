function getCars() {

    console.log("Empezamos a leer datos")

    $.ajax(settings).done(function (respuesta) {
        console.log(respuesta);
    });

    console.log("Respuesta: " + respuesta);
    console.log("Estado: " + estado);
    if (estado === "success") {
        $("body").append(`<div class='tg2'><h3>${respuesta.pickupDateTime}</h3><h3>${respuesta.returnDateTime}</h3></div>`);
        $("body").append(`<div class='tg2'><h3>${respuesta.changeReservation}</h3><h3>${respuesta.posCurrencyCode}</h3></div>`);

        //let misDatos = respuesta;       //Uncaught TypeError: misDatos is not iterable
        //let misDatos = respuesta.vehicleCategoryLists   //Uncaught TypeError: misDatos is not iterable
        //let misDatos = respuesta.vehicleCategoryLists.categoriesBySize      //si funciona
        console.log("test2");
        let misDatos = respuesta.vehicleRates["SFAR-R-NA-MIA-NA-NYCC008"].partnerInfo.images["SIZE268X144"];
        let modelo = respuesta.vehicleRates["SFAR-R-NA-MIA-NA-NYCC008"].partnerInfo.vehicleExample;
        console.log(misDatos);
        console.log(typeof misDatos);
        $("body").append(`<div class='tg2'><h3>${misDatos}</h3><p>${misDatos}</p></div>`);
        $("body").append(`<div class='tg2'><img src='https:${misDatos}' alt='Foto del auto'></img><h3>${modelo}</h3></div>`);

        let sizes = respuesta.vehicleCategoryGroupsByType.vehicle_size;
        for (let size of sizes) {
            $("body").append(`<div class='tg2'><h3>Tag: ${size}</h3></div>`);
        }
        let types = respuesta.vehicleCategoryGroupsByType.vehicle_type;
        for (let type of types) {
            $("body").append(`<div class='tg2'><li>Type: ${type}</li></div>`);
        }
        let catByPrice = respuesta.vehicleCategoryLists.categoriesByTotalPrice;
        $("body").append(`<div class='tg2'><h3>Categories by total Price</h3></div>`);
        for (let cat of catByPrice) {
            $("body").append(`<div class='tg2'><li>Type: ${cat}</li></div>`);
        }

        /* Desestructuración De Objetos En Javascript   */
        let { pickupDateTime, returnDateTime, discountCodesFailed, expressDealsAvailable, changeReservation, posCurrencyCode, vehicleCategoryLists, rateLists, partnerLists, vehicleRates, ...elResto } = respuesta;

        console.log("Desde: " + pickupDateTime);
        console.log("Hasta: " + returnDateTime);
        console.log("Objeto: " + vehicleCategoryLists.categoriesByTotalPrice);
        console.log("Objeto: " + rateLists.allVehicleRatesByPartner);
        console.log("partnerLists: " + partnerLists.allPartnersByTotalPrice);
        console.log(typeof elResto);
        console.log(elResto.partnerLists);
        console.log("vehicleRates: " + vehicleRates);

        let largo = countProperties(vehicleRates);
        console.log("Cantidad de vehiculos: " + largo);

        var auto = rateLists.allVehicleRatesByPartner[0];
        console.log(auto);

        console.log(showProps(vehicleRates, auto));

        /* seguir con esto:
        https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects
        */
    }
}
