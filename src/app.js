import Express  from "express";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import chatsModels from "./model/chatsmodel.js";

const app = Express();
const server = app.listen(8080,console.log("listening on express :)"));

//seteamos donde queremos que se muestre nuestra vista, y le pasamos la ruta donde se encuentra la carpeta. 
app.set('views',__dirname+'/views');
//setea el motor de plantilla que queremos usar,en este caso usamos el motor de plantilla Ejs.
app.set('view engine','ejs');
app.use(Express.static(__dirname+'/public'));
app.get('/',(req,res)=>{
    res.render('chats')
})

//hago la conexion del socket con el servidor que tenia.
const io = new Server(server);


io.on('connection',async(socket)=>{
    console.log("socket connected");

    //nos envia el chats que habia hasta el momento de conectarnos.
    const messages = await chatsModels.find();//me trae todo los mensajes de la base de datos.
    socket.emit('arraymessages',messages);

    //recibo el usuario y el mensaje que me envian del lado del cliente.
    socket.on('message',async(data)=>{
        await chatsModels.create(data);//guardo los datos en la base de datos.
        const messages = await chatsModels.find();
        io.emit('arraymessages', messages);
    })
    
    //recibo el nombre del usuario que se conecta y lo envio a todos los conectados menos a mi.
    socket.on('registeredUser',user=>{
        socket.broadcast.emit('newUser',user);
    })
})