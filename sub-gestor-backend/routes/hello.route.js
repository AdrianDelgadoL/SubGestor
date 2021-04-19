const express = require ('express');
const router = express.Router();
const Hello = require('../models/helloworld.model');

// Para cada end-point se tiene que definir una peticion. En este caso le decimos al router que las peticiones
// get a / (recordad que en el server.js este router esta asociado a /hello  y por lo tanto esta hace referencia
// a la ruta GET /hello/) y dentro de esta le especificamos que utilice el modelo de Hello y mediante la función
// find, recoga todos los documentos y los guarde en el res (response, este lo utiliza el front-end para ver la información de back-end)
router.get('/', (req, res) => {
    Hello.find(function(err, hello) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(hello);
        }
    });
});

// Para que otros bloques lo puedan usar, se debe exportar el router
module.exports = router;