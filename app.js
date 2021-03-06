var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
const {MONGOURI} = require('./keys');

/**
  * modelos
*/
require('./models/user');
require('./models/post');
require('./models/entry');

/**
  * API routes:
*/
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var postRouter = require('./routes/post');
var entryRouter = require('./routes/entry');

/**
  *documentacion
*/
var docRouter = require("./routes/api/api-docs");

/** 
  *conexion a la base de datos 
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
 * fin del apartado de conexion a la base de datos.
 */

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post',postRouter);
app.use('/entry',entryRouter);
app.use('/api-docs',docRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;