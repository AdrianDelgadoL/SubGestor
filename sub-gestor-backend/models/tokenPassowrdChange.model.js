const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Generamos al principio un Schema que representa el esqueleto de nuestro documento. Dentro de este
// tenemos las propiedades del documento donde debemos especificar su tipo. Por ejemplo: precio de la suscripcion: Float
const ChangePassTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
});

// Una vez generado el Schema, tenemos que exportar el modelo para que otros bloques lo puedan utilizar.
// Primero de todo se genera el modelo utilizando mongoose donde se especifica (nombre de modelo, Schema que utiliza, coleccion de mongo a la que se refiere)
// Utilizamos modelos de mongoose para poder utilizar funciones como find o save para recoger/guardar/modificar automaticamente la informacion de mongoDB
module.exports = mongoose.model('changePassToken', ChangePassTokenSchema, collection='changePasswordTokens');
