var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var pool = require('./models/bd')

var session = require('express-session');

var nosotrosRouter = require('./routes/nosotros');
var contactoRouter = require('./routes/contacto');
var loginRouter = require('./routes/admin/login');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true
}));





app.get('/', function(req, res) {
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: 'mi pagina',
    conocido: conocido,
    nombre: req.session.nombre
  });
});

app.post('/ingresar', function(req, res) {
  if (req.body.nombre) {
    req.session.nombre = req.body.nombre
  }
  res.redirect('/');
});

app.get('/salir', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.use('/nosotros', nosotrosRouter);
app.use('/contacto', contactoRouter);
app.use('/admin/login', loginRouter);

// var id = 7;
// var obj = {
//   user: 'Charles',
//   pass: '4321'
// } 

// pool.query('UPDATE users SET ? WHERE id=?', [obj, id]).then(function (resultados) {
//   console.log(resultados);
// });

// var id = 13;
// pool.query('DELETE FROM users WHERE id=?', [id]).then(function (resultados) {
//   console.log(resultados);
// });

// pool.query('SELECT * FROM users').then(function (resultados) {
//   console.log(resultados)
// });

// var obj = {
//   id: '',
//   user: 'Gina',
//   nacido: '1997-11-03',
//   pass: '1234'
// }

// pool.query('INSERT INTO users set ?', [obj]).then(function(resultados) {
//   console.log(resultados)
// });




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
