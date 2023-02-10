class Reserva{

    constructor(id, nombre, fechaIngreso, fechaEgreso, cantidadAdultos, cantidadMenores, cabania){
        this.id = "R"+id;
        this.nombre = nombre;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.cantidadAdultos = cantidadAdultos;
        this.cantidadMenores = cantidadMenores;
        this.cabania = cabania;
}
    guardarReserva(id){
        localStorage.setItem(this.id, JSON.stringify({id: this.id, nombre: this.nombre, 
            fechaIngreso: this.fechaIngreso, fechaEgreso: this.fechaEgreso,
            cantidadAdultos: this.cantidadAdultos, cantidadMenores: this.cantidadMenores, cabania: this.cabania}));
    }
}