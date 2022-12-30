import mongoose from "mongoose";

mongoose.connect('mongodb+srv://coderUser:123454321@codercluster0.nvobhct.mongodb.net/proyectChat?retryWrites=true&w=majority',(error)=>{
    if (error) {
        throw (error);//el throw te permite que si encuentra algun error, se detiene la ejecucion del programa y no sigue con la siguiente linea.
    }
    console.log('connected mongoose');
})


const collection = 'chats';

const schema = mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true
    }
})

const chatsModels = mongoose.model(collection,schema);

export default chatsModels;