
/*
 * GET home page.
 */
var profiles = require('../models/profiles');

function patchMixins(req, mixins) {
    if (!req.session || !req.session.user) {
	var noop = function() {},
	dummies = {};
	mixins.forEach(function(mixin) {
	    dummies[mixin + '_mixin'] = noop;
	});
	req.app.locals(dummies);
    }
}

exports.index = function(req, res){
    profiles.pull(req.params.pagenum, function(err, profiles) {
	if (err) {console.log(err);}
	patchMixins(req, ['add','del','adminScript']);
	res.render('index', { title: 'Profiles', profiles: profiles, page: req.params.pagenum });
    });
};