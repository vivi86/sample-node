var mongo = require('mongoskin'),
db = mongo.db('localhost:27017/profiler'),
users = db.collection('users');

function validate(user, cb) {
    users.findOne({ name: user.name, pwd: user.pwd},
		  function(err, user) {
		      if (err) { throw err; }
		      if (!user) {
			  cb({msg: 'Invalid login details!'});
			  return;
		      }
		      cb();
		  });
}

module.exports = function(req, res, next) {
    var method = req.method.toLowerCase(),
    user = req.body.user,
    logout = (method === 'delete'),
    login = (method === 'post' && user),
    routes = req.app.routes[method];
    
    /*function validate(user, cb) {
	    var valid = Object.keys(users).some(function(name) {
	        return (user.name === name && user.pwd === users[name]);
	    });
	    cb((!valid && {msg: 'Login details invalid!'}));
    } */
    /**/
    

    if (!routes) { next(); return;}
    
    if (logout) {
	delete req.session.user;
    }
    if (login) {
	  validate(user, function(err) {
	    if (err) { req.flash('error', err.msg); return;}
	    req.session.user = {
	    	name: user.name,
	    	pwd: user.pwd
	    };
	  });
    }
    if (login || logout) {
	routes.forEach(function(route) {
	    if (!(req.url.match(route.regexp))) {
		console.log(req.url);
		req.method = 'GET';
	    }
	});
    }
    if (!req.session.user) { req.url = '/';}
    next();
};
