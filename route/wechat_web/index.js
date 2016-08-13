'use strict';
const path = require('path');
const ejs = require('ejs');


exports = module.exports = (req, res, next) => {
	ejs.renderFile(path.resolve(__dirname, '../../view/index.ejs'), (err, str) => {
		if(err) return next(err);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(str);
	});
};