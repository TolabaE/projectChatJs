import dotenv from 'dotenv';

//aqui inizializo dotenv para poder llamar a mis variables de entorno.
dotenv.config()

//exporto mis variables de entorno para usarlo en sus respectivos archivos.
export default {
    mongo:{
        USER:process.env.mongo_user,
        DB:process.env.mongo_db,
        PWD:process.env.mongo_password,
    }
}