import mongoose from "mongoose";
import config from "../config/config.js";

const database = config.mongo.DB;
const password = config.mongo.PWD;
const user = config.mongo.USER;

mongoose.connect(`mongodb+srv://${user}:${password}@codercluster0.nvobhct.mongodb.net/${database}?retryWrites=true&w=majority`,(error)=>{
    if (error) {
        throw new Error(error);//el throw te permite que si encuentra algun error, se detiene la ejecucion del programa y no sigue con la siguiente linea.
    }
    console.log('connected mongoose');
})


const collection = 'messages';

const schema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    color_name:{
        type:String,
        required:true
    }
})

const chatsModels = mongoose.model(collection,schema);

export default chatsModels;