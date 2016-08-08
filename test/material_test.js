'use strict';

const Material = require('../lib/material.js');
const fs = require('fs');
const path = require('path');

const material = new Material();

material
	.upload(path.resolve('../material/read.png'), 'image')
	.then(data => console.dir(data), err => console.error(err));

// material
// 	.uploadImg(path.resolve('../material/read.png'), 'image')
// 	.then(data => console.dir(data), err => console.error(err));

material
	.getMaterialCount()
	.then(data => console.dir(data), err => console.error(err));

// material
// 	.batchGetMaterial({type: 'image', offset: 0, count: 1})
// 	.then(data => {
// 		console.dir(data);
// 	}, err => {
// 		console.error(err);
// 	});
// 	