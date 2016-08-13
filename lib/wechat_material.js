'use strict';
// 素材增删改查

const config = require('../config/config.json');
const AccessToken = require('./wechat_access_token.js');
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
		return this._request('upload', {file: file}, type);
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
		return this._request('addNews', opts);
	}

	/* 上传图文消息内的图片获取URL
	 * @param {String} file 文件路径名 
	 * @return {Promise}
	 */
	uploadImg(file) {
		return this._request('uploadImg', {file: file});
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
		return this._request('addMaterial', {file: file}, type, desc);
	}

	/* 删除永久素材
	 * @param {String} media_id 永久素材的media_id
	 * @return {Promise}
	 */
	delMaterial(media_id) {
		return this._request('delMaterial', {media_id: media_id});
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
		return this._request('updateNews', opts);
	}

	/* 获取素材总数
	 * @return {Promise}
	 */
	getMaterialCount() {
		return this._request('getMaterialCount');
	}

	/* 获取素材列表
	 * @param {String} type 素材类型
	 * @param {Number} offset 从全部素材的该偏移位置开始返回,0表示从第一个素材返回
	 * @param {Number} count 返回素材的数量，取值在1到20之间
	 * @return {Promise}
	 */
	batchGetMaterial(type, offset, count) {
		return this._request('batchGetMaterial', {type: type, offset: offset, count: count});
	}

	_request(method, opts, type, desc){
		const promise = this._checkMethodAndArgs(method, opts, type, desc);
		if(promise) return promise;

		return this._accessToken.get().then(token => {
			const url = this._getUrl(method, token, type);

			if(method === 'addMaterial' && type === 'video') {
				let key;
				for(key in desc) {
					opts[key] = desc[key];
				}
			}

			return utils.request(url, opts)

		}, err => Promise.reject(err));
	}

	_getUrl(method, token, type) {
		return `${api[method]}access_token=${token.access_token}${type ? ('&type=' + type) : ''}`;
	}


	_checkMethodAndArgs(method, opts, type, desc) {
		if(method !== 'getMaterialCount'
			&& (!opts 
			|| (opts).constructor.name !== 'Object'))
			return Promise.reject(new Error(`${method} arguments error!`));

		let isTrue = true;

		switch(method) {
			case 'upload':
			case 'addMaterial': {
				if(!type
					|| typeof type !== 'string'
					|| !opts.file
					|| typeof opts.file !== 'string')
					isTrue = false;

				if(method === 'addMaterial'
					&& type === 'video'
					&& (!desc
						|| (desc).constructor.name !== 'Object'
						|| !desc.title
						|| !desc.introduction))
					isTrue = false;

				break;
			}
			case 'uploadImg': {
				if(!opts.file
					|| typeof opts.file !== 'string')
					isTrue = false;

				break;
			}
			case 'addNews': {
				if(!opts.articles 
					|| !Array.isArray(opts.articles)
					|| !opts.articles.every(article => this._isValidArticle(article)))
					isTrue = false;

				break;
			}
			case 'delMaterial': {
				if(!opts.media_id
					|| typeof opts.media_id !== 'string')
					isTrue = false;

				break;
			}

			case 'updateNews': {
				if(!opts.media_id
		    		|| typeof opts.index !== 'number'
		    		|| !opts.articles
		    		|| typeof opts.articles !== 'object'
		    		|| !this._isValidArticle(opts.articles))
		    		isTrue = false;

		    	break;
			}
			case 'getMaterialCount': {
				return false;
			}
			case 'batchGetMaterial': {
				if(opts.type === undefined
					|| opts.offset === undefined
					|| opts.count === undefined)
					isTrue = false;

				break;
			}
			default: 
				return Promise.reject(new Error('no have ${method} method!'));
		}

		if(!isTrue)
			return Promise.reject(new Error(`${method} arguments error!`));
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