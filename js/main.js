/*
SCRIPT DESARROLLADO POR GERBAUDO LEANDRO

Proyecto final

Comisión 48445 - AÑO 2023

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
//--------Mensaje de bienvenida-------------------------------------------------------------

setTimeout(() => {
    Swal.fire(
        "Bienvenido al portal de reservas del Complejo de Cabañas 'Las Esmeraldas'",
        "Aquí deberá ingresar los datos del huésped y la cabaña elegida, al final podrá controlar o borrar las reservas realizadas"
    )
},2000);

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

//-----------------------------------------------------------------------------------------------------------------------------------------
$("body").vegas({
    slides: [
        { src: "/images/Fondo1.jpg" },
        { src: "/images/Fondo2.jpg" }
    ]
});
//-----------------------------------------------------------------------------------------------------------------------------------------

let datosFetch;
let listado = document.querySelector("#listado");
var DateTime = luxon.DateTime;
var f = {month: 'long', day: 'numeric'};
let dti, dtf;

const pedirFeriados = async () => {
    const resp = await
    fetch('https://date.nager.at/api/v3/LongWeekend/2023/AR')
    const data = await resp.json()
    data.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        dti = DateTime.fromISO(element.startDate);
        dtf = DateTime.fromISO(element.endDate);
        
        li.innerHTML = `<p>Desde el ${dti.toLocaleString(f)} al ${dtf.toLocaleString(f)}</p>`

        listado.append(li);
    })
}

pedirFeriados();


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
    
    e.preventDefault(); //Evitamos que se recarge la página
    
    let estadoHuespedes = validarHuespedes();

    let valorActivo = document.querySelector('input[name="cabanias"]:checked');


    if (estadoHuespedes) {

        if(valorActivo) {
            guardarReserva();
            Swal.fire(
                'Reserva guardada',
                'Muchas gracias por elegirnos!',
                'success'
              )

        } else {
            Swal.fire(
                'No ha seleccionado ninguna cabaña',
                'Seleccione la cabaña deseada',
                'warning'
              )
        }
        
    }   
};


const validarHuespedes = function(){

    if (idAdultos.value == "") {
        Swal.fire(
            'No ha ingresado la cantidad de mayores',
            'Ingrese un valor correcto de mayores',
            'warning'
          )
          return false;
        
    } else {
        if (idChicos.value == "") {
            Swal.fire(
                'No ha ingresado la cantidad de menores',
                'Ingrese un valor correcto de menores',
                'warning'
              )
              return false;
        } else {
            if ((parseInt(idAdultos.value)+parseInt(idChicos.value)) > 5) {
                Swal.fire(
                    'Se sobrepasó la cantidad de huéspedes permitido',
                    'Ingrese una cantidad de huéspedes menor a 5!',
                    'error'
                  )
                  return false;
            } else {
                return true;
            }
        }
        
    }

    
}


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




