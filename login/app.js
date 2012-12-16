
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , flash = require('connect-flash')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  //app.locals({masterviews: '../views'});
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  
  app.use(express.methodOverride());
  app.use(express.cookieParser('kooBkooCedoN'));
  app.use(express.session());
  app.use(require('stylus').middleware({
	src: __dirname + '/views',
	dest: __dirname + '/public'
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash());
  app.use(require('./login'));
  app.use(function(req, res, next){
	  	res.locals.user = req.session.user;
		res.locals.flash = req.flash();
  		next();});
  app.use(app.router);
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/:pagenum([0-9]+)?', routes.index);
app.post('/:pagenum([0-9]+)?', routes.index);
app.del('/:pagenum([0-9]+)?', routes.index);

app.get('/del', routes.delprof);
app.post('/add', routes.addprof, routes.index);

if ( !module.parent) {
    app.listen(app.get('port'), function(){
	console.log("Express server listening on port %d in %s mode", app.get('port'),app.settings.env);
    });
}

