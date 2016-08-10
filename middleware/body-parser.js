'use strict';
const utils = require('../lib/utils.js');


exports = module.exports = (req, res, next) => {
    let chunks = [];
    req.on('data', data => {
        chunks.push(data);
    });

    req.on('end', () => {
        let raw_body = Buffer.concat(chunks).toString('utf8');
        const type = req.headers['content-type'];

        if(type) {
            if (/json/.test(type)) {
                let body = '';
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    next(e);
                }

                req.body = body;
                next();
            } else if (/xml/.test(type)) {
                utils.parseXml(raw_body).then(data => {
                    req.body = data;
                    next();
                }, err => {
                    next(err);
                });
            } else {
                req.body = raw_body;
                next();
            }
        } else {
            req.body = raw_body;
            next();
        }

    });
}
