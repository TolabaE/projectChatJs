import dotenv from 'dotenv';

//aqui inizializo todas las variables de entorno que valla a utilizar en mi proyecto.
dotenv.config()

//exporto mis variables de entorno que estan en el archivo.
export default {
    mongo:{
        USER:process.env.mongo_user,
        DB:process.env.mongo_db,
        PWD:process.env.mongo_password,
    }
}