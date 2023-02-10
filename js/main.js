/*
SCRIPT DESARROLLADO POR GERBAUDO LEANDRO

Proyecto final

AÑO 2023

Consigna
Presentarás la página web interactiva en JavaScript que vienes trabajando a lo
largo del curso. La misma debe simular distintos procesos. Un “simulador” es un
programa que soluciona ciertas tareas, y proporciona al usuario información de
valor, de forma coherente y prolija. Utilizarás AJAX y JSON para obtener
datos y diversas herramientas de JS como librerías, promises y asincronía
para controlar eventos en la interfaz y producir animaciones en respuesta.

Objetivos generales
✓ Presentar una aplicación que utilice Javascript para solucionar un problema
real al usuario.
✓ Utilizar Javascript para mejorar la interacción y dinamismo de la página,
generando una interfaz coherente y atractiva.

Objetivos específicos
✓ Contar con una estructura de datos clara, basada en Arrays y Objetos.
✓ Utilizar funciones, condicionales e iteradores para manipular los datos de la app.
✓ Generar y manipular el DOM. Crear vistas a partir de datos de la app y generar eventos
para responder a la interacción del usuario. Utilizar alguna librería relevante 
para el simulador.
✓ Utilizar asincronía y fetch para cargar datos estáticos o consumir una API.


 */
//-----------------------------------------------------------------------------------------------------------------------------------------
let nombreCompleto;
let cantidad;
let reservar = true;
let cantidadMaximaMenores = 3;
let cantidadMayores = 2;
let cantidadMenores = 0;
let fechaIngreso;
let fechaEgreso;
let aceptacion;
let celdaContadorNumero = 0;
let cantidadDeReservas;
const reservas = [];  //Contenedor de las reservas realizadas

$("body").vegas({
    slides: [
        { src: "/images/Fondo1.jpg" },
        { src: "/images/Fondo2.jpg" }
    ]
});


//-----------------------------------------------------------------------------------------------------------------------------------------
//Creamos los 5 objetos que son los 5 tipos de cabañas

const cabaniaUraliana = new Cabania("Uraliana", 4, 1);

const cabaniaTurmalina = new Cabania("Turmalina", 3, 1); 

const cabaniaVerdelita = new Cabania("Verdelita", 3, 1);

const cabaniaLitia = new Cabania("Litia", 5, 2);

const cabaniaLaOriental = new Cabania("La Oriental", 5, 2);

const complejoCabanias = [cabaniaUraliana, cabaniaTurmalina, cabaniaVerdelita, cabaniaLitia, cabaniaLaOriental];

for (const cabania of complejoCabanias) {
    cabania.guardarCabania();
}

let celdaNombre;
let celdaCapacidad;
let celdaHabitaciones;

//-----------------------------------------------------------------------------------------------------------------------------------------

localStorage.getItem("reservas") === null && localStorage.setItem("reservas", 0);  //Si no existe cantidad de reservas, la generamos con un valor "0"

 
cantidadDeReservas = parseInt(localStorage.getItem("reservas"));  //Obtenemos la cantidad de reservas guardadas en memoria

cargarReservasTabla();
//-----------------------------------------------------------------------------------------------------------------------------------------

let idReserva = document.getElementById("reserva");  //Seleccionamos el formulario
//const elementos = formulario.elements;  //Obtenemos el array con los elementos del formulario

let idFormulario = document.getElementById("reserva");
let campo = document.getElementById("campo");
let idIngreso = document.getElementById("ingreso");
let idEgreso = document.getElementById("egreso");
let idNombre = document.getElementById("nombre");
let idAdultos = document.getElementById("adultos");
let idChicos = document.getElementById("chicos");


let parrafo = document.createElement("p");

const validar = function(e){
    e.preventDefault();
    

    if (validarFecha(idIngreso)||validarFecha(idEgreso)||validarNombre(idNombre)||validarHuespedes()) {
        let texto = "";

        validarNombre(idNombre) === true && (texto = "<h3>No ha ingresado un nombre</h3>");
        validarFecha(idIngreso) === true && (texto += "<h3>No ha ingresado una fecha de ingreso</h3>");
        validarFecha(idEgreso) === true && (texto += "<h3>No ha ingresado una fecha de egreso</h3>");
        texto += validarHuespedes();

        parrafo.innerHTML = texto; 
        campo.append(parrafo);
    } else {
        
        let valorActivo = document.querySelector('input[name="cabanias"]:checked');
        
        if(valorActivo) {
            parrafo.remove();
            guardarReserva();
        } else {
            parrafo.innerHTML = "<h3>No ha seleccionado ninguna cabaña</h3>"; 
            campo.append(parrafo);
        }
        
    }
    
};

const validarFecha = function(id){
    
    return id.value === "" ? true : false;

};

const validarNombre = function(nombre){
    
    return nombre.value === "" ? true : false;

};

const validarHuespedes = function(){

    if (idAdultos.value == "") {
        return "<h3>No ha ingresado la cantidad de mayores</h3>";
    } else {
        if (idChicos.value == "") {
            return "<h3>No ha ingresado la cantidad de menores</h3>";
        } else {
            if ((parseInt(idAdultos.value)+parseInt(idChicos.value)) > 5) {
               return "<h3>Se sobrepasó la cantidad de huéspedes permitido (máx. 5)</h3>"; 
            } else {
                return false;
            }
        }
        
    }

    
}


//function ejecutarBorrar() {
    //Obtengo el manejador para obtener el número de la reserva a borrar
    //let reservaABorrar = document.getElementById("reservaABorrar");
    //localStorage.removeItem(reservaABorrar.value);
    
    //guardarReserva();
//};

idFormulario.addEventListener("submit",validar);


//Obtengo el manejador del boton borrar reservas
let btnBorrar = document.getElementById("borrar");

let campoBorrar = document.getElementById("campoBorrar");

btnBorrar.addEventListener("click", function() {
    //Obtengo el manejador para obtener el número de la reserva a borrar

    let reservaABorrar = document.getElementById("reservaABorrar").value;

    if ((reservaABorrar != "")&&(localStorage.getItem("R" + reservaABorrar) != null)) {

        

        //--------------------------------------------------------------------------------------

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Está seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrarlo!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {

                localStorage.removeItem("R" + reservaABorrar);
                cargarReservasTabla();
                parrafo.innerHTML = ""; 
                campoBorrar.append(parrafo);

              swalWithBootstrapButtons.fire(
                'Borrado!',
                'La reserva ha sido borrado.',
                'success'
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Reserva no borrada :)',
                'error'
              )
            }
          })
        //--------------------------------------------------------------------------------------

        
    } else {

        parrafo.innerHTML = "<h3>Reserva no encontrada, elija una de la tabla</h3>"; 
        campoBorrar.append(parrafo);

        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Reserva no encontrada, elija una de la tabla'
          })
        
    }
   
  });



const crearComplejo = function(complejo){
    
    
    for (const valor of complejo) {
        
        let row = document.getElementById("tablaCabanias").insertRow(-1);

        celdaNombre = row.insertCell(0);   //Referencia
        celdaNombre.textContent = valor.nombre; //Valor
        celdaCapacidad = row.insertCell(1);
        celdaCapacidad.textContent = (valor.capacidad).toString();
        celdaHabitaciones = row.insertCell(2);
        celdaHabitaciones.textContent = (valor.habitaciones).toString();

    
    }
    
    
};

crearComplejo(complejoCabanias);

//Funcion constructora de objetos reservas


/*
function Reserva(nombre, fechaIngreso, fechaEgreso, cantidadAdultos, cantidadMenores){
    this.nombre = nombre;
    this.fechaIngreso = fechaIngreso;
    this.fechaEgreso = fechaEgreso;
    this.cantidadAdultos = cantidadAdultos;
    this.cantidadMenores = cantidadMenores;
}*/


function borrarTabla(tabla){
    let filas = tabla.rows.length;  //Cuento la cantidad de filas que tiene la tabla

    for (let index = 0; index < filas-1; index++) {  //borro las filas salvo la primera donde tengo los títulos
        tabla.deleteRow(1);
        
        
    }
};


function cargarReservasTabla(){
    
    borrarTabla(document.getElementById("tablaReservas"));
    let celdaNumero;
    let celdaNombreHuesped;
    let celdaFechaDeIngreso;
    let celdaFechaDeEgreso;
    let celdaCantidadMayores;
    let celdaCantidadMenores;
    let celdaCabania;
    let primerCaracter;
    let filaTablaReservas = document.getElementById("tablaReservas");
    let reservaAlmacenada;

    

    for (let index = 0; index < localStorage.length; index++) {
        primerCaracter = localStorage.key(index);
        if(primerCaracter.charAt(0) === "R" ){

            reservaAlmacenada = JSON.parse(localStorage.getItem(localStorage.key(index)));

            let posfilaTablaReservas = filaTablaReservas.insertRow(-1);

            celdaNumero = posfilaTablaReservas.insertCell(0);
            celdaNumero.textContent = reservaAlmacenada.id.substring(1, 5);;

            celdaNombreHuesped = posfilaTablaReservas.insertCell(1);
            celdaNombreHuesped.textContent = reservaAlmacenada.nombre;
            
            celdaFechaDeIngreso= posfilaTablaReservas.insertCell(2);
            celdaFechaDeIngreso.textContent = reservaAlmacenada.fechaIngreso;
            
            celdaFechaDeEgreso= posfilaTablaReservas.insertCell(3);
            celdaFechaDeEgreso.textContent = reservaAlmacenada.fechaEgreso;
            
            celdaCantidadMayores= posfilaTablaReservas.insertCell(4);
            celdaCantidadMayores.textContent = reservaAlmacenada.cantidadAdultos;

            celdaCantidadMenores= posfilaTablaReservas.insertCell(5);
            celdaCantidadMenores.textContent = reservaAlmacenada.cantidadMenores;

            celdaCabania = posfilaTablaReservas.insertCell(6);
            celdaCabania.textContent = reservaAlmacenada.cabania;

            }
        
    }

   

}

function guardarReserva(){
    cantidadDeReservas++;
    localStorage.setItem("reservas", cantidadDeReservas);

    new Reserva(localStorage.getItem("reservas"), document.getElementById("nombre").value, document.getElementById("ingreso").value, document.getElementById("egreso").value,
    document.getElementById("adultos").value, document.getElementById("chicos").value, document.querySelector('input[name="cabanias"]:checked').value).guardarReserva(cantidadDeReservas);
    

    //leemos la memoria y cargamos la tabla
    cargarReservasTabla(reservas);

};




