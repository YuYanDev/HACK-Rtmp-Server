var express = require('express');
var http = require('http');
var reload = require('reload');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var debug = require('debug')('express-blog-hexo:server');

// var dl = require('./jsondata/bilibangumidata');
var NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
  // ,
  // auth: {
  //   play: true,
  //   publish: true,
  //   secret: '121'
  // }
}

var nms = new NodeMediaServer(config)
nms.run();



var webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-hot-middleware'),
  webpackDevConfig = require('./webpack.dev.config.js'); 
var compiler = webpack(webpackDevConfig);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


var app = express();

var index = require('./routes/index');
var apis = require('./api/apis');
var auth = require('./routes/auth');
var admin = require('./routes/admin')
var lives = require('./routes/lives')
var appPort = '3000'
app.set('port', appPort);

app.locals.env = process.env.NODE_ENV || 'dev';

app.use(webpackDevMiddleware(compiler, {
  
      // public path should be the same with webpack config
      publicPath: webpackDevConfig.output.publicPath,
      noInfo: true,
      stats: {
          colors: true
      }
  }));
  
  app.use(webpackHotMiddleware(compiler));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var identityKey = 'YuYanSession';
app.use(session({
  name: identityKey,
	secret: 'secret',  // 用来对session id相关的cookie进行签名
	store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
	saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
	resave: false,  // 是否每次都重新保存会话，建议false
	cookie: {
		maxAge: 1000 * 1000  // 有效期，单位是毫秒
	}
}));

app.use('/', index);
app.use('/live', lives);
app.use('/api',apis);
app.use('/auth',auth);
app.use('/admin',admin)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({"message":err.message})
});

var server = http.createServer(app);
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);
// reload(server, app);

module.exports = app;

