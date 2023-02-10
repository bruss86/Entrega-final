class Cabania{
    constructor(nombre, capacidad, habitaciones){
        this.nombre = nombre;
        this.capacidad = capacidad;
        this.habitaciones = habitaciones;
    }

    dimeNombre(){return this.nombre;}

    dimeCapacidad(){return this.capacidad;}

    dimeHabitaciones(){return this.habitaciones;}

    guardarCabania(){
        localStorage.setItem(this.nombre, JSON.stringify({nombre: this.nombre, capacidad: this.capacidad, habitaciones: this.habitaciones}));
    }
}

