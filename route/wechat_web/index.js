'use strict';
const path = require('path');
const ejs = require('ejs');

const config = require('../../config/config.json');
// lib
const Ticket = require('../../lib/wechat_ticket');
const jsApi = require('../../lib/wechat_js_sign.js');

const ticket = new Ticket(config.wechat);

module.exports = (req, res, next) => {
	ticket.get().then(tk => {
		const noncestr = jsApi.genNonceStr(15);
		const timestamp = jsApi.genTimestamp();
		const url = 'http://jsnode.cn' + (req.url.length === 1 ? '' : req.url);

		const signature = jsApi.genSign(noncestr, tk.ticket, timestamp, url);
		const data = {
			name: 'geemo',
			noncestr: noncestr,
			timestamp: timestamp,
			signature: signature
		};

		ejs.renderFile(path.resolve(__dirname, '../../view/index.ejs'), data, (err, str) => {
			if(err) return next(err);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(str);
		});
	}, err => next(err));
};