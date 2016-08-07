'use strict';
const utils = require('../lib/utils.js');


exports = module.exports = (req, res, next) => {
    let chunks = [];
    req.on('data', data => {
        chunks.push(data);
    });

    req.on('end', () => {
        let raw_body = Buffer.concat(chunks).toString('utf8');

        utils.parseXml(raw_body).then(data => {
        	req.body = data;
        	next();
        }, err => {
        	next(err);
        });

    });
}
