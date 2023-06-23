class Framework {
    ejecutarBackEnd(method, url, callback, data) {
        var xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log("llego " + xmlReq.responseText);
                    callback.manejarRespueta(xmlReq.responseText);
                }
                else {
                    alert("Error al buscar los datos!");
                }
            }
        };
        xmlReq.open(method, url, true);
        if (data != undefined) {
            xmlReq.setRequestHeader("Content-Type", "application/json");
            console.log("Data: ", data);
            xmlReq.send(JSON.stringify(data));
        }
        else {
            xmlReq.send();
        }
        //
    }
}
