'use strict';
const crypto = require('crypto');

module.exports = opts => {
	return (req, res, next) => {
		const { signature, echostr, timestamp, nonce } = req.query;

        const token = opts.token;

        const sha_str = crypto
            			.createHash('sha1')
            			.update([token, timestamp, nonce].sort()
            			.join(''))
            			.digest('hex');
		
        if (req.method === 'GET') {
            // 验证签名是否相同
            if (signature === sha_str) {
                res.end(echostr);
            } else {
                res.end('failed');
            }
        } else if (req.method === 'POST') {
        	if(signature !== sha_str) {
        		return;
        	} else {
        		next();
        	}
        }	
	};
};