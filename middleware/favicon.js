'use strict';

exports = module.exports = (req, res, next) => {
	if(/^\/favicon.ico/.test(req.url)) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		return res.end('Not Found');
	}
	next();
};