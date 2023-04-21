import dotenv from 'dotenv';

//aqui inizializo dotenv para poder llamar a mis variables de entorno.
dotenv.config()

//exporto mis variables de entorno para usarlo en sus respectivos archivos.
export default {
    mongo:{
        DOC:process.env.mongo_collection,
        DB:process.env.mongo_db,
        PWD:process.env.mongo_password,
    }
}