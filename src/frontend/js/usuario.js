class Usuario extends Persona {
    constructor(usr, x) {
        super(x);
        this.userName = usr;
    }
    mostrar() {
        return "usuario " + this.userName;
    }
    accesoAmodificaciones() {
        return false;
    }
    accesoAlLogin() {
        return true;
    }
}
