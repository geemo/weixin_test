'use strict';
const parseString = require('xml2js').parseString;
const fs = require('fs');
const https = require('https');
const path = require('path');
const urlParse = require('url').parse;
const FormStream = require('formstream');

exports.parseXml = parseXml;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.existsFile = existsFile;
exports.request = request;

/* 将xml解析为json对象并格式化
 * @param {String} xml xml字符串
 * @return {Promise}
 */
function parseXml(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, { trim: true }, (err, data) => {
            if (err) reject(err);
            else resolve(_format(data.xml));
        });
    });
}


/* 将解析的xml_json对象进行格式化
 * @param {String} xml_json 已被xml2js解析的xml_json对象
 * @return {Object} message 格式化后的对象
 */
function _format(xml_json) {
    let message = {};

    if (typeof xml_json === 'object') {
        let key;

        for (key in xml_json) {
            if (!Array.isArray(xml_json[key]) || xml_json[key].length === 0) {
                continue;
            } else if (xml_json[key].length === 1) {
                let val = xml_json[key][0];

                if (typeof val === 'object') message[key] = _format(val);
                else message[key] = val;

            } else {
                message[key] = [];
                xml_json[key].forEach(itme => {
                    message[key].push(_format(item));
                });
            }
        }
    }

    return message;
}

/* 以promise方式读取文件
 * @param {String} path 文件路径
 * @param {String} encoding 字符编码
 * @return {Promise}
 */
function readFile(path, encoding) {
    return new Promise((resolve, reject) => {
        encoding = encoding || 'utf8';
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

/* 以promise方式写入文件
 * @param {String} path 文件路径
 * @param {String|Buffer} data 写入的数据
 * @return {Promise}
 */
function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err);
            else resolve();
        });
    });
};

/* 以promise方式判断文件是否存在 
 * @param {String} path 文件路径
 * @return {Promise}
 */
function existsFile(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err || !stats.isFile()) 
                return reject(new Error(`no such file or directory, open ${path}`));

            return resolve();
        });
    });
}
/* http请求
 * @param {String|Object} opts 
 * @param [Object] form 表单数据,当存在该字段时,默认为发送Post请求
 * @return {Promise}
 *
 * opts示例如下:
 * {String}:  https://hostname/pathname[/?query]
 * {Object}:  {[files: [], key: val, ...]} files是固定文件字段,可选; key,val为任意字段,可选.
 */
function request(opts, form) {
    return new Promise((resolve, reject) => {
    	let url, method, _form;

        if (typeof opts === 'string') {
        	url = opts;
        	method = (form && typeof form === 'object') ? 'POST' : 'GET';
        	_form = form;
        } else if (opts && typeof opts === 'object') {
        	if(!opts.url) 
        		return reject(new Error('url field is required in opts!'));
        	url = opts.url;
        	method = opts.form ? 'POST' : 'GET';
        	_form = opts.form || form;
        } else {
        	return reject(new Error('opts must be a string or object!'));
        }

        if(_form && typeof _form !== 'object') 
        	return reject(new Error('form field must be object'));
        
        if(method === 'GET') {
        	https.get(url, callback);
        } else if(method === 'POST') {
            const file_path = _form.file;

            const urlObj = urlParse(url);

            const options = {
                method: 'POST',
                hostname: urlObj.hostname,
                port: urlObj.port || /^https/.test(urlObj.protocol) ? 443 : 80,
                path: urlObj.path
            };

            if(file_path) {
                const formStream = FormStream();

                delete _form.file;

                let field;
                for(field in _form){
                    formStream.field(field, _form[field]);
                }

                fs.stat(file_path, (err, stat) => {
                    if(err) return reject(err);

                    formStream.file('media', file_path, path.basename(file_path), stat.size)
                    options.headers = formStream.headers(opts.headers);
                    formStream.pipe(https.request(options, callback))
                            .on('error', err => reject(err));
                });

            } else {
                let headers = opts.headers || {};
                let keys = Object.keys(headers).map(key => key.toLowerCase());
                let formStr = JSON.stringify(_form);

                if(keys.indexOf('content-type') === -1)
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                
                if(keys.indexOf('content-length') === -1)
                    headers['Content-Length'] = formStr.length;

                options.headers = headers;

                const req = https.request(options, callback);
                req.on('error', err => reject(err));

                req.end(formStr);
            }
        } else {
        	return reject(new Error(`request function is not support http ${method} method!`));
        }

        // 响应监听回调
        function callback(res) {
            let chunks = [];

            res.on('data', data => chunks.push(data));

            res.on('end', () => {
                let data = Buffer.concat(chunks).toString('utf8');

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    reject(e);
                }

                if ((data.errcode || data.errmsg) && data.errcode !== 0) {
                    let err = new Error(`${data.errcode} ${data.errmsg}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }

    });
}