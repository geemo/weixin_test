'use strict';

const Kugou = require('../lib/kugou_music.js');

const kugou = new Kugou();

// kugou
// 	.searchSongs('想想之中', 1, 1)
// 	.then(songs => {
// 		const hash0 = songs[0].hash;
// 		// console.dir(songs);
// 		songs = songs.map(song => kugou.getSongUrl(song.hash));
// 		Promise
// 			.all(songs)
// 			.then(urls => console.dir(urls), err => console.error(err));

// 		kugou
// 			.getKrc(hash0)
// 			.then(data => console.log(data), err => console.error(err));

// 		kugou
// 			.getSongLogoUrl(hash0)
// 			.then(data => console.log(data), err => console.error(err));
// 	}, err => console.error(err));

kugou
	.getSong('甜蜜蜜')
	.then(data => console.dir(data), err => console.error(err));
