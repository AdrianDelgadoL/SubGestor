const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const helloRoutes = require('./routes/hello.route');

app.use(cors());
app.use(bodyParser.json());

// TODO: Pasarlo a fichero de configuracion para no tenerlo aqui puesto
// Nos conectamos al servidor de mongoDB.
mongoose.connect('mongodb+srv://dbAdmin:RJQzSdo5xNa4PR@subgestorcluster.uo0n2.mongodb.net/SubGestor?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
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
