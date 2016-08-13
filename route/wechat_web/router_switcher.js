const url = require('url');

const index = require('./index.js');
const auth = require('./auth.js');

exports = module.exports = (req, res, next) => {
	const pathname = url.parse(req.url).pathname;

	switch(pathname) {
		case '/': 
			index(req, res, next);
			break;
		case '/auth':
			auth(req, res, next);
			break;
		default: next();
	}
};