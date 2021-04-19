const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const helloRoutes = require('./routes/hello.route');
const config = require('config');
app.use(cors());
app.use(bodyParser.json());

const db = config.get('mongoURI');

// TODO: Pasarlo a fichero de configuracion para no tenerlo aqui puesto
// Nos conectamos al servidor de mongoDB.
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

/***********
** Routes **
************/
// Para cada fichero de routes, tenemos que importarlo (tal y como se hace arriba) y asociarlo a una ruta. En este caso utilizamos
// el router de hello asociandolo a la ruta /hello
app.use('/hello', helloRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
