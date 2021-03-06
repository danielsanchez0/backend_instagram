/**
 * Servidor para realizar testing a la API.   
 */
function run(callback) {

    const express = require('express');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const {MONGOURI} = require('./keys');

    /**
     * modelos
     */
    require('./models/user');
    require('./models/post');
    require('./models/entry');

    /**
     * rutas
     */
    const user = require('./routes/user');
    const entry = require('./routes/entry');
    const auth = require('./routes/auth');

    /**
     * conexion a la base de datos
     */
    mongoose.connect(MONGOURI,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    });
    mongoose.connection.on('connected',()=>{
        console.log("connect to mongod");
    })
    mongoose.connection.on("error",(err)=>{
        console.log("error ",err);
    })
    /**
     * apartado de conexión finalizado
     */

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use('/user',user);
    app.use('/entry',entry);
    app.use('/auth', auth);

    var server = app.listen(3000, function () {
        console.log('started');

        if (callback) {
            callback();
        }
    });

    server.on('close', function () {
        console.log('closed');
    });

    return server;
}

if (require.main === module) {
    run();
}

exports.run = run; 