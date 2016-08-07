'use strict';
const parseString = require('xml2js').parseString;
const fs = require('fs');
const https = require('https');
const FormData = require('form-data');
// const _request = require('request');

exports.parseXml = parseXml;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.request = request;

function parseXml(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, { trim: true }, (err, data) => {
            if (err) reject(err);
            else resolve(_format(data.xml));
        });
    });
}

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

function readFile(path, encoding) {
    return new Promise((resolve, reject) => {
        encoding = encoding || 'utf8';

        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err);
            else resolve();
        });
    });
};


function request(opts, form) {
    return new Promise((resolve, reject) => {
    	let url, method, _form;

        if (typeof opts === 'string') {
        	url = opts;
        	method = form && typeof form === 'object' ? 'POST' : 'GET';
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
        
        console.log(url);
        if(method === 'GET') {
        	https.get(url, callback);
        } else if(method === 'POST') {
        	// const formData = new FormData();
        	// let key;
        	// console.dir(_form);
        	// if(_form){
        	// 	for(key in _form) {
        	// 		formData.append(key, _form[key]);
        	// 	}
        	// }
        	// formData.submit(url, (err, res) => {
        	// 	if(err) return reject(err);
        	// 	callback(res);
        	// });

        } else {
        	return reject(new Error(`request function is not support http ${method} method!`));
        }

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

                if (data.errcode || data.errmsg) {
                    let err = new Error(`${data.errcode} ${data.errmsg}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        };

    });
}
