function run(callback) {

    const express = require('express');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const {MONGOURI} = require('./keys');

    require('./models/user');
    require('./models/post');

    const user = require('./routes/user');

    /*conexion a la base de datos */
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
    /*----------------------------------*/

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use(user);

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