"use strict"
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

const mime = require('../mime.json');

exports = module.exports = (static_path, expire_secs) => {
	return (req, res, next) => {
    	pathHandle(req.url, req, res, next);
	};

	function pathHandle(file_path, req, res, next) {
	    let pathname = url.parse(file_path).pathname;
	    let ext = path.extname(pathname);
	    ext = ext ? ext.slice(1) : 'unknow';
	    if (!mime[ext]) return next();

	    //禁止父路径
	    const realPath = path.join(static_path, path.normalize(pathname.replace(/\.\./g, '')));

	    fs.stat(realPath, (err, stats) => {
	        if (err) {
	            res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
	            res.end('the request URL ' + pathname + ' was not found on this server!');
	        } else {
	            if (!stats.isFile()) {
	                next();
	            } else {
	                const lastModified = new Date(stats.mtime);
	                const ifModifiedSince = new Date(req.headers['if-modified-since']);

	                res.setHeader('Last-Modified', lastModified.toUTCString());
	                if (ifModifiedSince &&
	                    lastModified.getTime() <= ifModifiedSince.getTime()) {
	                    res.writeHead(304, 'Not Modified', { 'Content-Type': 'text/plain' });
	                    res.end();
	                } else {
	                    res.setHeader('Content-Type', mime[ext]);

	                    cacheHandle(res, ext);

                        const fileStream = fs.createReadStream(realPath);
                        fileStream.pipe(res);
	                }
	            }
	        }
	    });
	}

	function cacheHandle(res, ext) {
	    if (/^(css|js|html|txt|jpe?g|png|gif)$/i.test(ext)) {
	    	// 默认缓存7天
	    	const maxAge = (typeof expire_secs === 'number' && expire_secs > 0) ? expire_secs : 604800;
	        const expires = new Date();
	        expires.setTime(expires.getTime() + maxAge * 1000);

	        res.setHeader('Expires', expires.toUTCString());
	        res.setHeader('Cache-Control', 'max-age=' + maxAge);
	    }
	}
};

