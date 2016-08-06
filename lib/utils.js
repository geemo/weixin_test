'use strict';
const parseString = require('xml2js').parseString;
const fs = require('fs');

exports.parseXml = parseXml;
exports.readFile = readFile;
exports.writeFile = writeFile;

function parseXml(xml) {
	return new Promise((resolve, reject) => {
		parseString(xml, {trim: true}, (err, data) => {
			if(err) reject(err);
			else resolve(_format(data.xml));
		});
	});
}

function _format(xml_json) {
	let message = {};

	if(typeof xml_json === 'object') {
		let key;

		for(key in xml_json) {
			if(!Array.isArray(xml_json[key]) || xml_json[key].length === 0) {
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

function readFile(path, encoding){
	return new Promise((resolve, reject) => {
		encoding = encoding || 'utf8';

		fs.readFile(path, encoding, (err, data) => {
			if(err) reject(err);
			else resolve(data);
		});
	});
}

function writeFile(path, data){
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, err => {
			if(err) reject(err);
			else resolve();
		});
	});
};