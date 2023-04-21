"use strict";

const socket = io({autoConnect:false});
const inputMessages = document.getElementById('input-text');
const insertText = document.getElementById('text_parrafo');
const formMessages = document.getElementById('form');
const insertUser = document.getElementById('name-user');

let user //creo una variable para poder guardar el usuario
let color //creo una variable para poder guardar el color.
let array //creo una variable para poder guardar los mensjaes que habia antes en la base mongo.

const hora = new Date().toLocaleTimeString();//creo un variable que guarde la hora,los minutos y segundos.
const fecha = new Date().toLocaleDateString();//me trae unicamente la fecha ej: dia/mes/año.

//genera un color random.
const colorRandom = () =>{
    let R = Math.floor(Math.random()*256);
    let G = Math.floor(Math.random()*256);
    let B = Math.floor(Math.random()*256);
    //si la suma de los colores supera el umbral vuelve a ejecutarse la funcion.esto para no obtener colores muy claros
    if (R+G+B >= 750) {
        return colorRandom();
    }else{
        return `rgb(${R},${G},${B})`;
    }
}

Swal.fire({
    title:"Registrarse",
    input:"text",
    text:'ingrese un nombre de usuario',
    inputValidator:(value)=>{
        return !value && '¡necesitas ingresar con un nombre!'
    },
    //te permite bloquear el click a fuera del alerta,asi no se cierra la ventanas.
    allowOutsideClick:false,
    allowEscapeKey:false,//no te permite salir cuando hagas click en la tecla esc.
})
.then(result=>{//capturo el nombre de usuario que me envian por el sweetalert.
    user = result.value;
    color = colorRandom();//ejecuto la funcion,para que me genere un color al azar.
    socket.connect();
    socket.emit('register',user);//envio los datos del cliente al servidor.
    insertUser.innerHTML = user;
})

//recibo los mensajes que habia hasta el momento de enviar un nuevo texto.
socket.on('array',msm=>{
    array = msm;//igualo el arreglo de mensaje a mi nuevo variable creada.
})

//este codigo te permite enviar los mensajes con el button de tipo submit.
formMessages.addEventListener('submit',(e)=>{
    e.preventDefault();
    const value = formMessages[0].value.trim()
    if (value.length > 0) {
        //me fijo si el usuario ingresado ya existia en la base de datos
        if (array.some(usuario=>usuario.first_name === user)) {
            const existed = array.find(msm =>msm.first_name === user);//obtengo el color que le fue asignado previamente al usuario.
            socket.emit('message',{first_name:user, text:value, time:hora, date:fecha, color_name:existed.color_name});
        } else {
            //si el usuario ingresa por primera vez,le asigno un color random al azar
            socket.emit('message',{first_name:user, text:value, time:hora, date:fecha, color_name:color});
        }
        formMessages[0].value = "";
    }else {
        Toastify({
            text: "No hay mensaje para enviar!!",
            duration: 3000,
            style: {
                background: "linear-gradient(90deg, rgba(78,76,199,1) 100%, rgba(252,176,69,1) 100%)",
            },
        }).showToast();
    }
})

//este codigo te permite enviar los mensajes cuando presionas la tecla enter.
inputMessages.addEventListener('keyup',(event)=>{
    const value = inputMessages.value.trim();
    if (event.key === "Enter") {
        //creo un condicion de si la longuitud del mensaje es mayor a 0, ejecutame esto.
        if (value.length !== 0) {
            //me fijo si el usuario ingresado ya existia en la base de datos
            if (array.some(usuario=>usuario.first_name === user)) {
                const existed = array.find(msm =>msm.first_name === user);//obtengo el color que le fue asignado previamente al usuario.
                socket.emit('message',{first_name:user, text:value, time:hora, date:fecha, color_name:existed.color_name});
            } else {
                //si el usuario ingresado no existia,le asigno un color random.
                socket.emit('message',{first_name:user, text:value, time:hora, date:fecha, color_name:color});
            }
            inputMessages.value = "";
        }
    }
});

//recibo los datos que me envian del servidor y los inserto en el HTML.
socket.on('arraymessages',data=>{
    let text = "";//lo creo como un string vacio,y ademas capa vez que valla a iterar se limpie lo que habia.
    //si el usuario que ingresa es el mismo que envia el texto,entonces mostrame los mensajes del lado izquierdo. 
    data.forEach(msg => {
        if (msg.first_name === user) {
            text +=`<p class="text-me">${msg.text} <span>${msg.time}</span></p>`;
        }else{
            text +=`
            <div class="text-you">
                <h4 style=color:${msg.color_name}>${msg.first_name}</h4>
                <div>
                    <p>${msg.text}</p><span>${msg.time}</span>
                </div>
            </div>`
        }
    });
    insertText.innerHTML = text;
    insertText.scrollTop = insertText.scrollHeight;//este codigo hace que los mensajes me tire hacia abajo sin tener que estar scrolleando.
})

//recibo el usario que se conecto del servidor y lo muestra en una alerta.
socket.on('newUser',usuario=>{
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'success',
        title: `${usuario} esta en linea`
    })
})
