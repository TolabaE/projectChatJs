const socket = io({autoConnect:false});
const inputMessages = document.getElementById('input-text');
const insertText = document.getElementById('text_parrafo');
const formMessages = document.getElementById('form');
const insertUser = document.getElementById('name-user');

let user ;
const fecha = new Date().toLocaleTimeString();

Swal.fire({
    title:"Necesita Registrarse",
    input:"text",
    text:'ingrese un nombre de usuario',
    inputValidator:(value)=>{
        return !value && '¡necesitas ingresar con un nombre!'
    },
    //te permite bloquear el click a fuera del alerta,asi no se cierra la ventanas.
    allowOutsideClick:false,
    allowEscapeKey:false,//no te permite salir cuando hagas click en la tecla esc.

}).then(result=>{//capturo el nombre de usuario que me envian por el sweetalert.
    user = result.value;
    socket.connect();
    socket.emit('registeredUser',user);//envio los datos del cliente al servidor.
    insertUser.innerHTML = user;
})

//este codigo te permite enviar los mensajes con el button de tipi submit.
formMessages.addEventListener('submit',(e)=>{
    e.preventDefault();
    if (formMessages[0].value.trim().length > 0) {
        //el mensaja es enviado del cliente al servidor en forma de objeto.
        socket.emit('mensaje',{user,mensaje:formMessages[0].value.trim()});
        formMessages[0].value = "";
    }
})

//este codigo te permite enviar los mensajes cuando presionas la tecla enter.
inputMessages.addEventListener('keyup',(event)=>{
    if (event.key ==="Enter") {
        //creo un condicion de si la longuitud del mensaje es mayor a 0, ejecutame esto.
        if (inputMessages.value.trim().length > 0) {
            //el mensjae es enviado del cliente al servidor en forma de objeto.
            socket.emit('mensaje',{user,mensaje:inputMessages.value.trim()});
            inputMessages.value = " ";
        }
    }
})

//recibo los datos que me envian del servidor y los inserto en el HTML.
socket.on('arraymensajes',data=>{
    let text = "";
    data.forEach(msg => {
        text +=`<p class="text" >${msg.user}:${msg.mensaje} <span>${fecha}</span></p>`
    });
    insertText.innerHTML = text;
    //este codigo hace que los mensajes me tire hacia abajo sin tener que estar scrolleando.
    insertText.scrollTop = insertText.scrollHeight;
})

//recibo el usario que se conecto del servidor y lo muestra en una alerta.
socket.on('newUser',dataUser=>{
    Toastify({
        text:`${dataUser} en linea`,
        duration: 3000,
        style: {
            background: "#caf0f8",
            color:"black"
        },
    }).showToast();
})
