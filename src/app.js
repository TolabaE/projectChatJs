import Express  from "express";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import chatsModels from "./model/chatsmodel.js";

const app = Express();
const PORT = process.env.PORT || 8080 ;

//seteamos donde queremos que se muestre nuestra vista, y le pasamos la ruta donde se encuentra la carpeta. 
app.set('views',__dirname+'/views');
//setea el motor de plantilla que queremos usar,en este caso usamos el motor de plantilla Ejs.
app.set('view engine','ejs');
app.use(Express.static(__dirname+'/public'));

//renderizo en la ruta principal la vista de chats.
app.get('/',(req,res)=>{
    res.render('chats')
})

const server = app.listen(PORT,console.log(`servidor express escuchando en el puerto:${PORT}`));
//hago la conexion del socket con el servidor que tenia.
const io = new Server(server);


io.on('connection',async(socket)=>{
    console.log("socket connected");
    //recibo el nombre del usuario que se conecta y lo envio a todos los conectados menos a mi.
    socket.on('register',(user) =>{
        socket.broadcast.emit('newUser',user);
    })

    const messages = await chatsModels.find();//me trae todo los mensajes de la base de datos.
    socket.emit('array',messages)//envio los mensajes,para poder trabaja con condicionales.
    socket.emit('arraymessages',messages);//envio los mensajes ,que habia hasta el momento de conectarnos.

    //recibo el usuario y el mensaje que me envian del lado del cliente.
    socket.on('message',async(data)=>{
        await chatsModels.create(data);//guardo los datos en la base de mongoDB.
        const messages = await chatsModels.find();
        io.emit('arraymessages', messages);
    })
})