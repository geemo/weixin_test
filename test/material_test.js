'use strict';

const Material = require('../lib/wechat_material.js');
const fs = require('fs');
const path = require('path');
const util = require('util');

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
// 	.batchGetMaterial('news', 0, 1)
// 	.then(data => {
// 		console.dir(data.item[0].content.news_item);
// 	}, err => {
// 		console.error(err);
// 	});

// material
// 	.delMaterial('2EifC9euA-j8ZqnS8h3GqUx-quB3Eq-Pszpavyb4tA0')
// 	.then(data => console.dir(data), err => console.error(err));


// material
// 	.addMaterial(path.resolve('../static/material/read.png'), 'image')
// 	.then(data => {
// 		console.dir(data);
// 	}, err => console.error(err));



// material
//     .addNews({
//         "articles": [{
//             "title": 'readable stream详解',
//             "thumb_media_id": '2EifC9euA-j8ZqnS8h3Gqa4lz-kiyFXXT44wmI8x_5Y',
//             "author": 'geemo',
//             "digest": '描述了流的内部运行原理',
//             "show_cover_pic": 1,
//             "content": '我们知道创建一个stream.Readable对象readable后',
//             "content_source_url": 'https://geemo.top/posts/code/stream-deep.html'
//         }]
//     })
//     .then(data => console.dir(data), err => console.error(err));

// material
//     .updateNews({
//     	"media_id": '2EifC9euA-j8ZqnS8h3GqQfNi8nmgjFGs3Wyaiddg90',
//     	"index": 0,
//         "articles": {
//             "title": 'readable stream详解',
//             "thumb_media_id": '2EifC9euA-j8ZqnS8h3Gqa4lz-kiyFXXT44wmI8x_5Y',
//             "author": 'i am dog',
//             "digest": '描述了流的内部运行原理',
//             "show_cover_pic": 1,
//             "content": '我们知道创建一个stream.Readable对象readable后',
//             "content_source_url": 'https://geemo.top/posts/code/stream-deep.html'
//         }
//     })
//     .then(data => console.dir(data), err => console.error(err));
