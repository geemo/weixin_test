'use strict';

const utils = require('./utils.js');
const AccessToken = require('./wechat_access_token.js');
const config = require('../config/config.json');

const prefix = config.wechat.prefix;
const mpPrefix = config.wechat.mpPrefix;

const api = {
	qrcode: prefix + 'qrcode/create?',
	showQrcode:  mpPrefix + 'showqrcode?'
};

class Qrcode {
	constructor() {
		this._accessToken = new AccessToken(config.wechat);
	}

	/* 生成临时二维码
	 * @param {Number} scene_id 场景值ID，为32位非0整型
	 * @param [Number] expire_secs 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天），此字段如果不填，则默认有效期为30秒。
	 * @return {Promise}
	 */
	createTmpQrcode(scene_id, expire_secs) {
		let isTrue = true;
		const expire_secs_type = typeof expire_secs;
		const scene_id_type = typeof scene_id;

		if(expire_secs 
			&& ((expire_secs_type !== 'number') 
				|| (expire_secs_type === 'number' && expire_secs > 2592000)))
			isTrue = false;

		if(!scene_id
			|| scene_id_type !== 'number'
			|| scene_id <= 0)
			isTrue = false;

		if(!isTrue) return Promise.reject(new Error('createTmpQrcode method arguments error!'));

		let opts = {action_name: "QR_SCENE", action_info: {scene: {scene_id: scene_id}}};
		expire_secs && (opts.expire_seconds = expire_secs);
		return this._post(opts);
	}

	/* 生成永久二维码
	 * @param {Number|String} scene_id 场景值ID 为数字时,最大值为100000(目前参数只支持1--100000);为字符串时,长度限制为1到64
	 * @return {Promise}
	 */
	createLimitQrcode(scene_id) {
		let isTrue = true;
		const type = typeof scene_id;
		if(!(type === 'string' || type === 'number')) 
			isTrue = false;

		if((type === 'string' && scene_id.length > 64)
			|| (type === 'number' && (scene_id < 1 || scene_id > 100000))){
			console.log('bbbbb');
			isTrue = false
		}

		if(!isTrue) return Promise.reject(new Error('createLimitQrcode method arguments error!'));

		
		let opts = {action_name: '', action_info: {scene: {}}};
		opts.action_name = type === 'string' ? 'QR_LIMIT_STR_SCENE' : 'QR_LIMIT_SCENE';
		opts.action_info.scene = type === 'string' ? {scene_str: scene_id} : {scene_id: scene_id};
		return this._post(opts);
	}

	/* 发送post请求
	 * @param {Object} opts post的json对象 
	 * @return {Promise}
	 */
	_post(opts) {
		return this._accessToken.get().then(token => {
			const url = `${api.qrcode}access_token=${token.access_token}`;

			return utils.request(url, opts);

		}, err => Promise.reject(err));
	}

	/* 获取二维码图片的url
	 * @param {String} ticket 换取二维码的ticket
	 * @return {String} 图片url
	 */
	getShowQrcodeUrl(ticket) {
		return `${api.showQrcode}ticket=${encodeURI(ticket)}`;
	}


}

exports = module.exports = Qrcode;