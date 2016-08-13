'use strict';
const utils = require('./utils.js');

const api = {
	/* 搜索歌曲api
	 * @param keyword 搜索关键字，需对其进行编码 
	 * @param page 返回的页码
	 * @param pagesize 每页查询数量
	 * @param showtype 1 未知
	 */
	song: 'http://mobilecdn.kugou.com/api/v3/search/song?',	

	/* 根据搜索结果中的hash 搜索歌曲信息，包含音乐文件的地址api
	 * @param cmd 默认填playInfo
	 * @param hash 搜索的歌曲hash值
	 */					 
	getSongInfo: 'http://m.kugou.com/app/i/getSongInfo.php?',

	/* 搜索歌词api
	 * @param cmd 默认填100
	 * @param hash 歌曲哈希值
	 * @param timelength 时长单位s
	 */
	krc: 'http://m.kugou.com/app/i/krc.php?',

	/* 获取音乐略缩图
	 * @param hash 歌曲哈希值
	 */
	songLogo: 'http://tools.mobile.kugou.com/api/v1/singer_header/get_by_hash?'
};

class KugouMusic {
	constructor() {}

	/* 搜索歌曲
	 * @param {String} keyword 歌曲关键字
	 * @param [Number] page 搜索页数
	 * @param [Number] page_size 每页的查询数量
	 * @return {Promise}
	 */
	searchSongs(keyword, page=1, page_size=10) {
		const url = `${api.song}keyword=${encodeURIComponent(keyword)}&page=${page}&pagesize=${page_size}`;
		return utils
				.request({url: url, datatype: 'json', apitype: 'kugou'})
				.then(data => {
					return Promise.resolve(data.data.info.map(song => {
						return {
							hash: song.hash,
							songname: song.songname,
							singername: song.singername,
							album_name: song.album_name,
							duration: song.duration
						};
					}));
				}, err => Promise.reject(err));
	}

	/* 获取歌曲url
	 * @param {String} hash 歌曲的哈希值
	 * @return {Promise}
	 */
	getSongUrl(hash) {
		const url = `${api.getSongInfo}cmd=playInfo&hash=${hash}`;
		return utils
				.request({url: url, datatype: 'json', apitype: 'kugou'})
				.then(data => Promise.resolve(data.url), err => Promise.reject(err));
	}

	/* 获取歌词
	 * @param {String} hash 歌曲哈希值
	 * @return {Promise}
	 */
	getKrc(hash) {
		const url = `${api.krc}cmd=100&hash=${hash}&timelength=600`;
		return utils.request({url: url, datatype: 'text', apitype: 'kugou'});
	}

	/* 获取歌曲的logo url
	 * @param {String} hash 歌曲哈希值
	 * @return {Promise}
	 */
	getSongLogoUrl(hash) {
		const url = `${api.songLogo}hash=${hash}&size=200`;
		return utils
				.request({url: url, datatype: 'json', apitype: 'kugou'})
				.then(data => Promise.resolve(data.url), err => Promise.reject(err));
	}

	/* 获取单首歌曲，包含歌曲url和logo url
	 * @param {String} keyword 歌曲关键字
	 * @return {Promise}
	 */
	getSong(keyword) {
		return new Promise((resolve, reject) => {
			this.searchSongs(keyword, 1, 1)
				.then(songs => {
					let song = songs[0];
					Promise
						.all([this.getSongUrl(song.hash), this.getSongLogoUrl(song.hash)])
						.then(data => {
							data = {
								songUrl: data[0],
								songLogoUrl: data[1],
								songname: song.songname,
								album_name: song.album_name
							};
							resolve(data);
						}, err => reject(err));
				}, err => reject(err));
		});
	}

}


exports = module.exports = KugouMusic;