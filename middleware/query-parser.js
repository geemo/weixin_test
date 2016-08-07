'use strict';

exports = module.exports = (req, res, next) => {
	let query = {};
	const query_str = req.url.split('?')[1];

	if(query_str) {
		let pairs = query_str.split('&');

		pairs
			.map(pair => pair.split('='))
			.forEach(pair => query[pair[0]] = pair[1]);
	}

	req.query = query;

	next();
}