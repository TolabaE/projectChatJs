const socket = io({autoConnect:false});
const inputMessages = document.getElementById('input-text');
const insertText = document.getElementById('text_parrafo');
const formMessages = document.getElementById('form');
const insertUser = document.getElementById('name-user');

let user 
const fecha = new Date().toLocaleTimeString();

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
    socket.connect();
    socket.emit('register',user);//envio los datos del cliente al servidor.
    insertUser.innerHTML = user;
})

//este codigo te permite enviar los mensajes con el button de tipo submit.
formMessages.addEventListener('submit',(e)=>{
    e.preventDefault();
    const value = formMessages[0].value.trim()
    if (value.length > 0) {
        //el mensaja es enviado del cliente al servidor en forma de objeto.
        socket.emit('message',{first_name:user,text:value,date:fecha});
        formMessages[0].value = " ";
    }
})

//este codigo te permite enviar los mensajes cuando presionas la tecla enter.
inputMessages.addEventListener('keyup',(event)=>{
    if (event.key ==="Enter") {
        const value = inputMessages.value.trim();
        //creo un condicion de si la longuitud del mensaje es mayor a 0, ejecutame esto.
        if (value.length > 0) {
            //el mensjae es enviado del cliente al servidor en forma de objeto.
            socket.emit('message',{first_name:user,text:value,date:fecha});
            inputMessages.value = " ";
        }
    }
})

//recibo los datos que me envian del servidor y los inserto en el HTML.
socket.on('arraymessages',data=>{
    let text = "";
    data.forEach(msg => {
        text +=`<p class="text" >${msg.first_name}:${msg.text} <span>${msg.date}</span></p>`
    });
    insertText.innerHTML = text;
    //este codigo hace que los mensajes me tire hacia abajo sin tener que estar scrolleando.
    insertText.scrollTop = insertText.scrollHeight;
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

// Swal.fire({
//     title: 'Registrate',
//     html:
//         '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
//         '<input id="swal-input2" class="swal2-input" placeholder="Apellido">',
//     htmlValidator:(value)=>{
//         return !value && '¡necesitas ingresar con un nombre!'
//     },
//     //te permite bloquear el click a fuera del alerta,asi no se cierra la ventanas.
//     allowOutsideClick:false,
//     allowEscapeKey:false,//no te permite salir cuando hagas click en la tecla esc.
//     focusConfirm: false,
//     preConfirm: () => {
//         return {
//             first_name:document.getElementById('swal-input1').value,
//             last_name:document.getElementById('swal-input2').value
//         }
//     }
// })
// .then(result=>{//capturo el nombre de usuario que me envian por el sweetalert.
//     if (!result.value) {
//         Swal.fire(
//             'The Internet?',
//             'That thing is still around?',
//             'question'
//         )
//     }else{
//         user = result.value;
//         socket.connect();
//         socket.emit('register',user.first_name);//envio los datos del cliente al servidor.
//         insertUser.innerHTML = user.first_name;
//     }
// })