'use strict';

const AccessToken = require('../lib/wechat_access_token');
const config = require('../config/config.json');
const utils = require('../lib/utils.js');

const token = new AccessToken(config.wechat);

// token
//     .get()
//     .then(tk => console.log(tk),
//          err => console.log(err));

// const fs = require('fs');

// fs.readFile(config.wechat.tokenPath, 'utf8', (err, data) => {
// 	console.log(data);

// 	try {
// 		data = JSON.parse(data);
// 	} catch(e) {
// 		console.log(e)
// 	}
// });

// utils.readFile(config.wechat.tokenPath)
// 	.then(data => {
// 		try{
// 			console.log(data);
// 			data = JSON.parse(data)
// 		} catch(e) {
// 			console.dir(e);
// 		}
// 	})