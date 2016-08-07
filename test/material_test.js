'use strict';

const Material = require('../lib/material.js');
const fs = require('fs');

const material = new Material();

material
	.upload({
		'media': fs.createReadStream('../material/read.png')
	}, 'image')
	.then(data => console.dir(data), err => console.error(err));