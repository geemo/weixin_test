'use strict';
// 素材增删改查

const config = require('../config/config.json');
const AccessToken = require('./access_token.js');
const utils = require('./utils.js');

const prefix = config.wechat.prefix;
// 素材接口
const api = {
	upload: prefix + 'media/upload?',							// 新增临时素材 api
	addNews: prefix + 'material/add_news?',						// 新增永久图文素材 api
	uploadImg: prefix + 'media/uploadimg?',						// 上传图文消息内的图片获取URL api
	addMaterial: prefix + 'material/add_material?',				// 新增其他类型永久素材 api
	delMaterial: prefix + 'material/del_material?',				// 删除永久素材 api
	updateNews: prefix + 'material/update_news?',				// 修改永久图文素材 api
	getMaterialCount: prefix + 'material/get_materialcount?',	// 获取素材总数 api
	batchGetMaterial: prefix + 'material/batchget_material?'	// 获取素材列表 api
};

class Material {
	constructor() {
		this._accessToken = new AccessToken(config.wechat);
	}

	/* 新增临时素材
	 * @param {String} file 文件路径名 
	 * @param {String} type 文件类型
	 * @return {Promise}
	 */
	upload(file, type) {
		return this._accessToken.get().then(token => {
			if(!file
				|| !type
				|| typeof file !== 'string'
				|| typeof type !== 'string')

				return Promise.reject(new Error('arguments error!'));

			const url = `${api.upload}access_token=${token.access_token}&type=${type}`;

			return utils
					.request(url, {files: [file]})
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	/* 新增永久图文素材
	 * @param {Object} opts
	 * @return {Promise}
	 *
	 * opts示例:
	 * {
	 *	 "articles": [{
     *  	"title": TITLE,
     *  	"thumb_media_id": THUMB_MEDIA_ID,
     *  	"author": AUTHOR,
     *  	"digest": DIGEST,
     *  	"show_cover_pic": SHOW_COVER_PIC(0 / 1),
     *  	"content": CONTENT,
     *  	"content_source_url": CONTENT_SOURCE_URL
     *  	},
     *  	//若新增的是多图文素材，则此处应还有几段articles结构
     *   ]
	 * }
	 */
	addNews(opts) {
		return this._accessToken.get().then(token => {
			opts = opts || {};

			if(!opts.articles 
				|| !Array.isArray(opts.articles)
				|| !articles.every(article => this._isValidArticle(article)))

				 return Promise.reject(new Error('some field has missing!'));

			const url = `${api.addNews}access_token=${token.access_token}`;

			return utils
					.request(url, opts)
					.then(data => Promise.resolve(data), err => Promise.reject(err));
		});
	}

	/* 上传图文消息内的图片获取URL
	 * @param {String} file 文件路径名 
	 * @return {Promise}
	 */
	uploadImg(file) {
		return this._accessToken.get().then(token => {
			if(!file || typeof file !== 'string')
				return Promise.reject(new Error('arguments error!'));

			const url = `${api.uploadImg}access_token=${token.access_token}`;

			return utils
					.request(url, {files: [file]})
					.then(data => Promise.resolve(data), err => Promise.reject(err));
		});
	}

	/* 新增其他类型永久素材
	 * @param {String} file 文件路径名
	 * @param {String} type 文件类型, 有image,voice,video,thumb
	 * @param [Object] desc 当type为video时,此参数为必选
 	 * @return {Promise}
	 *
	 * desc示例如下:
	 * {
 	 *	 "title":VIDEO_TITLE,
 	 *	 "introduction":INTRODUCTION
	 * }
	 */
	addMaterial(file, type, desc) {
		return this._accessToken.get().then(token => {
			if(!file
				|| !type
				|| typeof file !== 'string'
				|| typeof type !== 'string')

				return Promise.reject(new Error('arguments error!'));

			const url = `${api.addMaterial}access_token=${token.access_token}&type=${type}`;

			let form = {files: [file]};
			if(type === 'video') {
				if(!desc || typeof desc !== 'object') 
					return Promise.reject(new Error('upload video need desc object!'));

				let key;
				for(key in desc) {
					form[key] = desc[key];
				}
			}

			return utils
					.request(url, form)
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	/* 删除永久素材
	 * @param {String} media_id 永久素材的media_id
	 * @return {Promise}
	 */
	delMaterial(media_id) {
		return this._accessToken.get().then(token => {
			const url = `${api.delMaterial}access_token=${token.access_token}`;

			return utils
					.request(url, {"media_id": media_id})
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	/* 修改永久图文素材
	 * @param {Object} opts
	 * @return {Promise}
	 *
	 * opts示例如下:
	 * {
	 *   "media_id":MEDIA_ID,
	 *   "index":INDEX,
	 *   "articles": {
	 *      "title": TITLE,
	 *      "thumb_media_id": THUMB_MEDIA_ID,
	 *      "author": AUTHOR,
	 *      "digest": DIGEST,
	 *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
	 *      "content": CONTENT,
	 *      "content_source_url": CONTENT_SOURCE_URL
	 *   }
	 * }
	 */
	updateNews(opts) {
		return this._accessToken.get().then(token => {
			opts = opts || {};

			if(!opts.media_id
			    || opts.index
			    || !opts.articles
			    || typeof otps.articles !== 'object'
			    || !this._isValidArticle(opts.articles))

			    return Promise.reject(new Error('some field has missing!'));


			const url = `${api.updateNews}access_token=${token.access_token}`;

			return utils
					.request(url, opts)
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	/* 获取素材总数
	 * @return {Promise}
	 */
	getMaterialCount() {
		return this._accessToken.get().then(token => {
			const url = `${api.getMaterialCount}access_token=${token.access_token}`;

			return utils
					.request(url)
					.then(data => Promise.resolve(data), err => Promise.reject(err));
		});
	}

	/* 获取素材列表
	 * @param {Object} opts
	 * @return {Promise}
	 *
	 * opts示例如下:
	 * {
   	 *	 "type":TYPE,			素材的类型
   	 *	 "offset":OFFSET,		从全部素材的该偏移位置开始返回,0表示从第一个素材返回
   	 *	 "count":COUNT 			返回素材的数量，取值在1到20之间
	 * }
	 */
	batchGetMaterial(opts) {
		return this._accessToken.get().then(token => {
			if(!opts 
				|| typeof opts !== 'object'
				|| opts.type === undefined
				|| opts.offset === undefined
				|| opts.count === undefined)

				return Promise.reject(new Error('some field has missing!'));

			const url = `${api.batchGetMaterial}access_token=${token.access_token}`;

			return utils
					.request(url, opts)
					.then(data => Promise.resolve(data), err => Promise.reject(err));
		});
	}

	/* 验证文章是否有效
	 * @param {Object} article
	 * @return {Promise}
	 *
	 * article对象如下:
	 * {
	 *   "title": TITLE,
	 *   "thumb_media_id": THUMB_MEDIA_ID,
	 *   "author": AUTHOR,
	 *   "digest": DIGEST,
	 *   "show_cover_pic": SHOW_COVER_PIC(0 / 1),
	 *   "content": CONTENT,
	 *   "content_source_url": CONTENT_SOURCE_URL
	 * }
	 */
	_isValidArticle(article) {
		return article.title !== undefined
				&& article.thumb_media_id !== undefined
				&& article.author !== undefined
				&& article.digest !== undefined
				&& article.show_cover_pic !== undefined
				&& article.content !== undefined
				&& article.content_source_url !== undefined;
	}
}

exports = module.exports = Material;