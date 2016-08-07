'use strict';
// 素材增删改查

const config = require('../config/config.json');
const AccessToken = require('./access_token.js');
const utils = require('./utils.js');

const prefix = config.wechat.prefix;
// 素材接口
const api = {
	upload: prefix + 'media/upload?',					//　新增临时
	get: prefix + 'media/get?',							//　获取临时
	addNews: prefix + 'material/add_news?',				// 新增永久
	getMaterial: prefix + 'material/get_material?',		// 获取永久
	delMaterial: prefix + 'material/del_material?',		// 删除永久
	updateNews: prefix + 'material/update_news?'		// 修改永久
};

class Material {
	constructor() {
		this.accessToken = new AccessToken(config.wechat);
	}

	upload(form, type, isPerpetual) {
		const accessToken = this.accessToken;

		return accessToken.get().then(token => {
			let url;
			if(isPerpetual) {
				url = `${api.addNews}access_token=${token.access_token}`;
			} else {
				url = `${api.upload}access_token=${token.access_token}&type=${type}`;
			}

			return utils
					.request(url, form)
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	get() {

	}

	delMaterial() {

	}

	updateNews() {

	}
}

exports = module.exports = Material;