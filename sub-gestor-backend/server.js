const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const helloRoutes = require('./routes/hello.route');
const userRoutes = require('./routes/user.route');
const subsRoutes = require('./routes/subscription.route');
const changePassword = require('./routes/changepassword.route');
const templatesSub = require('./routes/templates.route');
const canceledSub = require('./routes/canceled-subscription.route');
const statistics = require('./routes/estadisticas.route');

const config = require('config');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const db = config.get('mongoURI');

// Nos conectamos al servidor de mongoDB.
mongoose.set('useCreateIndex', true);
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
app.use('/user', userRoutes);
app.use('/subscription', subsRoutes);
app.use('/change-pass', changePassword);

app.use('/templates', templatesSub)
app.use('/canceled-sub', canceledSub);
app.use('/statistics', statistics);

https.createServer({
    key: fs.readFileSync(config.get('certKey')),
    cert: fs.readFileSync(config.get('certCert')),
    origin: '*',
    optionsSuccessStatus: 200
}, app).listen(PORT, function(){
    console.log("My HTTPS server listening on port " + PORT + "...");
});