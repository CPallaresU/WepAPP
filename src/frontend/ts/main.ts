var M;

class Main implements EventListenerObject,HttpResponse {
    users: Array<Usuario> = new Array();
    framework: Framework = new Framework();
    listaDeDispositivos: Array<Device> = new Array<Device>();
    idDispositivoAEditar: number = 0;
   
    constructor() {
        var usr1 = new Usuario("mramos", "Matias");
        var usr2 = new Usuario("jlopez", "Juan");

        //Ocultar formulario y botones para que no aparezcan al inicio
        let formulario = document.getElementById('FormularioNuevoDispositivo');
        formulario.style.display = 'none';
        let btnAgregar = document.getElementById('btnAgregarNuevoDispositivo');
        btnAgregar.style.display = 'none';
        let btnEditar = document.getElementById('btnEditarDispositivo');
        btnEditar.style.display = 'none';


        this.users.push(usr1);
        this.users.push(usr2);

        var obj = { "nombre": "Matias", "edad": 35, "masculino": true };
        //alert(JSON.stringify(obj));

    }
    manejarRespueta(respueta: string) {
        var lista: Array<Device> = JSON.parse(respueta);
        for (var disp of lista) {
            this.listaDeDispositivos.push(disp);
        }
        this.llenarListaDeDispositivos();        
    }
    obtenerDispositivos() {
        this.listaDeDispositivos = [];
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/device",this);
    }

    //Metodo para listar visualmente la lista de dispositivos
    llenarListaDeDispositivos(){
        var ulDisp = document.getElementById("listaDisp");
        ulDisp.innerHTML = "";
        for (var disp of this.listaDeDispositivos) {
            var item: string = `<li class="collection-item avatar">`;
            if(disp.type==1){
                item+=  '<img src="static/images/lightbulb.png" alt = "" class="circle" >'
            } else {
                item+=  '<img src="static/images/window.png" alt = "" class="circle" >'
            }                          
            item+=`<span class="titulo">${disp.name}</span>
                <p>
                    ${disp.description}
                </p>
                <form action="#!" class="secondary-content">
                    <p class="range-field center-align">
                        <input type="range" min="0" max="1" step="0.1" value="${disp.state}" disabled />
                    </p>
                </form>
                <div> 
                    <a href="#!" > <i class="material-icons prefix" id="editar_${disp.id}">edit</i> </a> 
                    <a href="#!" > <i class="material-icons prefix" id="borrar_${disp.id}">delete</i> </a> 
                </div>
            </li>`;
            
            ulDisp.innerHTML += item;
        }
        
        for (var disp of this.listaDeDispositivos) {

            var editarItem = document.getElementById("editar_" + disp.id);
            editarItem.addEventListener("click", this);

            var borrarItem = document.getElementById("borrar_" + disp.id);
            borrarItem.addEventListener("click", this);
        }
    }

    handleEvent(event) {
        var elemento =<HTMLInputElement> event.target;
        console.log(elemento)
        if (event.target.id == "btnListar") {
            this.obtenerDispositivos();
        } else if(event.target.id == "btnAgregar"){
            //Limpiar formulario para edición 
            (<HTMLInputElement>document.getElementById('descripcion')).value  = '';
            (<HTMLInputElement>document.getElementById('nombre')).value  = '';
            (<HTMLInputElement>document.getElementById('tipo')).value  = '';
            (<HTMLInputElement>document.getElementById('estado')).value  = '';
            let btnEditar = document.getElementById('btnEditarDispositivo');
            btnEditar.style.display = 'none';

            let formulario = document.getElementById('FormularioNuevoDispositivo');
            formulario.style.display = 'block';
            let btnAgregar = document.getElementById('btnAgregarNuevoDispositivo');
            btnAgregar.style.display = 'block';
        } else if (event.target.id == "btnLogin") {

            var iUser = <HTMLInputElement>document.getElementById("iUser");
            var iPass = <HTMLInputElement>document.getElementById("iPass");
            var username: string = iUser.value;
            var password: string = iPass.value;

            if (username.length > 3 && password.length>3) {
                
                //iriamos al servidor a consultar si el usuario y la cotraseña son correctas
                var parrafo = document.getElementById("parrafo");
                parrafo.innerHTML = "Espere...";
            } else {
                alert("el nombre de usuario es invalido");
            }

        } else if (elemento.id.startsWith("ck_")) {
            //Ir al backend y aviasrle que el elemento cambio de estado
            //TODO armar un objeto json con la clave id y status y llamar al metodo ejecutarBackend
           
            alert("El elemento " + elemento.id + " cambia de estado a =" + elemento.checked);
          
        } else if(event.target.id == "btnAgregarNuevoDispositivo"){
            // Obtener los valores de los campos del formulario
            let description = (<HTMLInputElement>document.getElementById('descripcion')).value;
            let name = (<HTMLInputElement>document.getElementById('nombre')).value;
            let type = Number((<HTMLInputElement>document.getElementById('tipo')).value);
            let state =  Number((<HTMLInputElement>document.getElementById('estado')).value);
          
            // Crear una nueva instancia de la clase Device con los valores del formulario
            const dispositivo = new Device();
            dispositivo.description = description;
            dispositivo.name = name;
            dispositivo.state = state;
            dispositivo.type = type;

            //Restablecer campos del formulario
            (<HTMLInputElement>document.getElementById('descripcion')).value  = '';
            (<HTMLInputElement>document.getElementById('nombre')).value  = '';
            (<HTMLInputElement>document.getElementById('tipo')).value  = '';
            (<HTMLInputElement>document.getElementById('estado')).value  = '';

            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/device", this, dispositivo);
            this.obtenerDispositivos();  

            alert("Dispositivo Agregado Exitosamente");
          
            // Ocultar el formulario
            let formulario = document.getElementById('FormularioNuevoDispositivo');
            formulario.style.display = 'none';
        } else if(elemento.id.startsWith("editar_")){
            
            //Limpiar formulario para edición 
            (<HTMLInputElement>document.getElementById('descripcion')).value  = '';
            (<HTMLInputElement>document.getElementById('nombre')).value  = '';
            (<HTMLInputElement>document.getElementById('tipo')).value  = '';
            (<HTMLInputElement>document.getElementById('estado')).value  = '';
            let btnAgregar = document.getElementById('btnAgregarNuevoDispositivo');
            btnAgregar.style.display = 'none';

            //Obtener el id del dispositivo a editar de la lista de dispositivos
            let id: number = Number(elemento.id.substring(7));
            let dispositivo = this.listaDeDispositivos.filter(elemento => elemento.id == id)[0];
            let btnEditar = document.getElementById('btnEditarDispositivo');
            btnEditar.style.display = 'block';
            let formulario = document.getElementById('FormularioNuevoDispositivo');
            formulario.style.display = 'block';

            (<HTMLInputElement>document.getElementById('descripcion')).value  = dispositivo.description;
            (<HTMLInputElement>document.getElementById('nombre')).value  = dispositivo.name;
            (<HTMLInputElement>document.getElementById('tipo')).value  = dispositivo.type.toString();
            (<HTMLInputElement>document.getElementById('estado')).value  = dispositivo.state.toString();

            this.idDispositivoAEditar = id;

        } else if(elemento.id.startsWith("borrar_")){
            let id: number = Number(elemento.id.substring(7));
            //this.listaDeDispositivos = this.listaDeDispositivos.filter(elemento => elemento.id != id);
            this.framework.ejecutarBackEnd("DELETE", "http://localhost:8000/device/", this, {id});
            this.obtenerDispositivos();
        } else if(event.target.id == "btnEditarDispositivo"){
            // Obtener los valores de los campos del formulario
            let description = (<HTMLInputElement>document.getElementById('descripcion')).value;
            let name = (<HTMLInputElement>document.getElementById('nombre')).value;
            let type = Number((<HTMLInputElement>document.getElementById('tipo')).value);
            let state =  Number((<HTMLInputElement>document.getElementById('estado')).value);

            //Obtener el dispositivo a editar de la lista de dispositivos
            let idDispositivo: number = this.idDispositivoAEditar;
            let dispositivo = this.listaDeDispositivos.filter(elemento => elemento.id == idDispositivo)[0];

            dispositivo.description = description;
            dispositivo.name = name;
            dispositivo.state = state;
            dispositivo.type = type;

            this.framework.ejecutarBackEnd("PATCH", "http://localhost:8000/device", this, dispositivo);
            this.obtenerDispositivos();  

            //Restablecer campos del formulario
            (<HTMLInputElement>document.getElementById('descripcion')).value  = '';
            (<HTMLInputElement>document.getElementById('nombre')).value  = '';
            (<HTMLInputElement>document.getElementById('tipo')).value  = '';
            (<HTMLInputElement>document.getElementById('estado')).checked  = false;

            // Ocultar el formulario
            let formulario = document.getElementById('FormularioNuevoDispositivo');
            formulario.style.display = 'none';
        }
        else {
            //TODO cambiar esto, recuperadon de un input de tipo text
            //el nombre  de usuario y el nombre de la persona
            // validando que no sean vacios
            console.log("yendo al back");
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/device", this, {});
           
        }
    }
}


window.addEventListener("load", () => {

    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});
    var elemsC = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elemsC, {autoClose:true});

    var main: Main = new Main();
    var btnListar: HTMLElement = document.getElementById("btnListar");
    btnListar.addEventListener("click", main);

    var btnAgregar: HTMLElement = document.getElementById("btnAgregar");
    btnAgregar.addEventListener("click", main);

    var btnAgregarNuevoDispositivo = document.getElementById("btnAgregarNuevoDispositivo");
    btnAgregarNuevoDispositivo.addEventListener("click", main);

    var btnEditarDispositivo = document.getElementById("btnEditarDispositivo");
    btnEditarDispositivo.addEventListener("click", main);

});
