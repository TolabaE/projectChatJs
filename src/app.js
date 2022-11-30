import Express  from "express";
import router from "./router/chats.routes.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = Express();
const server = app.listen(8080,console.log("listening on express :)"));

//seteamos donde queremos que se muestre nuestra vista, y le pasamos la ruta donde se encuentra la carpeta. 
app.set('views',__dirname+'/views');
//setea el motor de plantilla que queremos usar,en este caso usamos el motor de plantilla Ejs.
app.set('view engine','ejs');
app.use(Express.static(__dirname+'/public'));
app.use('/',router);

//hago la conexion del socket con el servidor que tenia.
const io = new Server(server);

const historial = [];

io.on('connection',socket=>{
    console.log("socket connected");
    //recibo el usuario y el mensaje que me envian del lado del cliente.

    //nos envia el chats que habia hasta el momento de conectarnos.
    socket.emit('arraymensajes',historial);

    socket.on('mensaje',datos=>{
        historial.push(datos);
        io.emit('arraymensajes', historial);
    })
    //recibo el nombre del usuario que se conecta y lo envio a todos los conectados menos a mi.
    socket.on('registeredUser',user=>{
        socket.broadcast.emit('newUser',user);
    })
})