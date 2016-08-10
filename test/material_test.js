'use strict';

const Material = require('../lib/wechat_material.js');
const fs = require('fs');
const path = require('path');

const material = new Material();

// material
// 	.upload(path.resolve('../static/material/read.png'), 'image')
// 	.then(data => {
// 		console.dir(data)

// 		material
// 			.delMaterial(data.media_id)
// 			.then(data => console.dir(data), err => console.error(err));

// 	}, err => console.error(err));

// material
// 	.uploadImg(path.resolve('../static/material/read.png'), 'image')
// 	.then(data => console.dir(data), err => console.error(err));

// material
// 	.getMaterialCount()
// 	.then(data => console.dir(data), err => console.error(err));

// material
// 	.batchGetMaterial('image', 0, 1)
// 	.then(data => {
// 		console.dir(data);
// 	}, err => {
// 		console.error(err);
// 	});

// material
// 	.delMaterial('2EifC9euA-j8ZqnS8h3GqUx-quB3Eq-Pszpavyb4tA0')
// 	.then(data => console.dir(data), err => console.error(err));


// material
// 	.addMaterial(path.resolve('../static/material/tcp-handshake.png'), 'image')
// 	.then(data => {
// 		console.dir(data);
// 	}, err => console.error(err));



// material
//     .addNews({
//         "articles": [{
//             "title": 'asdkljf',
//             "thumb_media_id": THUMB_MEDIA_ID,
//             "author": AUTHOR,
//             "digest": DIGEST,
//             "show_cover_pic": SHOW_COVER_PIC(0 / 1),
//             "content": CONTENT,
//             "content_source_url": CONTENT_SOURCE_URL
//         }]
//     })
//     .then()

// material
//     .updateNews()
//     .then()
