'use strict';

const config = require('../config/config.json');
const AccessToken = require('./wechat_access_token.js');
const utils = require('./utils.js');

const prefix = config.wechat.prefix;

const api = {
	tags: {
		create: prefix + 'tags/create?',							// 创建标签
		get: prefix + 'tags/get?',									// 获取公众号已创建的标签
		update: prefix + 'tags/update?',							// 编辑标签
		remove: prefix + 'tags/delete?',							// 删除标签
		mBatchTagging: prefix + 'tags/members/batchtagging?',		// 批量为用户打标签
		mBatchUntagging: prefix + 'tags/members/batchuntagging?',	// 批量为用户取消标签
		getIdList: prefix + 'tags/getidlist?',						// 获取用户身上的标签列表
		getTagFans: prefix + 'user/tag/get?'						// 获取标签下粉丝列表
	},
	userInfo: {
		updateRemark: prefix + 'user/info/updateremark?',			// 设置用户备注名
		get: prefix + 'user/info?',									// 获取用户基本信息
		batchGet: prefix + 'user/info/batchget?',					// 批量获取用户基本信息
		getList: prefix + 'user/get?'								// 获取用户列表
	}
};

class Tags {
	constructor() {
		this._accessToken = new AccessToken(config.wechat);
	}

	/* 创建标签
	 * @param {String} name 标签名
	 * @return {Promise}
	 */
	create(name) {
		return this._request('create', {tag: {name: name}});
	}

	/* 获取公众号已创建的标签
	 * @return {Promise}
	 */
	get() {
		return this._request('get');
	}

	/* 编辑标签
	 * @param {Number} id 标签id
	 * @param {String} name 新标签名
	 * @return {Promise}
	 */
	update(id, name) {
		return this._request('update', {tag: {id: id, name: name}});
	}

	/* 删除标签
	 * @param {Number} id 标签id
	 * @reutrn {Promise}
	 */
	remove(id) {
		return this._request('remove', {tag: {id: id}});
	}

	/* 获取用户身上的标签列表
	 * @param {String} openid 用户的openid
	 * @return {Promise}
	 */
	getIdList(openid) {
		return this._request('getIdList', {openid: openid});
	}

	/* 获取标签下粉丝列表
	 * @param {Number} tagid 标签id
	 * @param [String] next_openid 第一个拉取的OPENID，不填默认从头开始拉取
	 * @return {Promise}
	 */
	getTagFans(tagid, next_openid) {
		return this._request('getTagFans', {tagid: tagid, next_openid: next_openid});
	}

	/* 批量为用户打标签
	 * @param {Array} openid_list 用户openid列表
	 * @param {Number} tagid 标签id
	 * @return {Promise}
	 */
	mBatchTagging(openid_list, tagid) {
		return this._request('mBatchTagging', {openid_list: openid_list, tagid: tagid});
	}

	/* 批量为用户取消标签
	 * @param {Array} openid_list 用户openid列表
	 * @param {Number} tagid 标签id
	 * @return {Promise}
	 */
	mBatchUntagging(openid_list, tagid) {
		return this._request('mBatchUntagging', {openid_list: openid_list, tagid: tagid});
	}

	/* 以上方法集合
	 * @param {String} name 方法名
	 * @param {Object} opts 参数对象
	 * @return {Promise}
	 */
	method(name, opts) {
		const promise = this._checkMethodAndOpts(name, opts);
		if(promise) return promise;

		return this._request(name, opts);
	}

	/* 发送请求
	 * @param {String} method 方法名
	 * @param {Object} opts 方法参数对象
	 * @return {Promise}
	 */
	_request(method, opts) {
		const promise = this._checkMethodAndOpts(method, opts);
		if(promise) return promise;

		return this._accessToken.get().then(token => {
			const url = this._getUrl(method, token);

			return utils.request(url, opts);

		}, err => Promise.reject(err));
	}

	/* 验证方法和参数
	 * @param {String} method 方法名
	 * @param {Object} opts 方法参数对象
	 * @return {Boolean|Undefined|Boolean}
	 */
	_checkMethodAndOpts(method, opts) {
		let isTrue = true;

		if(method !== 'get'
			&& (!opts
				|| (opts).constructor.name !== 'Object'))
			return Promise.reject(new Error(`${method} arguments error!`));

		switch (method) {
			case 'create': {
				if(!opts.tag
					|| !opts.tag.name)
					isTrue = false;

				break;
			}
			case 'get': {
				return false;
			}
			case 'update': {
				if(!opts.tag
					|| !opts.tag.id
					|| !opts.tag.name)
					isTrue = false;

				break;
			}
			case 'remove': {
				if(!opts.tag
					|| !opts.tag.id)
					isTrue = false;

				break;
			}
			case 'getIdList': {
				if(!opts.openid)
					isTrue = false;

				break;
			}
			case 'getTagFans': {
				if(!opts.tagid)
					isTrue = false;

				break;
			}
			case 'mBatchTagging':
			case 'mBatchUntagging': {
				if(!Array.isArray(opts.openid_list)
					|| !opts.tagid)
					isTrue = false;

				break;
			}
			default:
				return Promise.reject(new Error('no have ${method} method!'));
		}

		if(!isTrue)
			return Promise.reject(new Error(`${method} arguments error!`));
	}

	_getUrl(method, token) {
		return `${api.tags[method]}access_token=${token.access_token}`;
	}
}

class UserInfo {
	constructor() {
		this._accessToken = new AccessToken(config.wechat);
	}

	/* 设置用户备注名
	 * @param {String} openid 用户openid
	 * @param {String} remark 备注名
	 * @return {Promise}
	 */
	updateRemark(openid, remark) {
		return this._request('updateRemark', {openid: openid, remark: remark});
	}

	/* 获取用户基本信息
	 * @param {Stirng} openid 用户openid
	 * @param {String} lang 语言
	 * @return {Promise}
	 */
	get(openid, lang) {
		return this._request('get', {openid: openid, lang: lang});
	}

	/* 批量获取用户基本信息
	 * @param {Array} user_list用户列表数组
	 * @return {Promise}
	 *
	 * users_list示例如下:
	 * [
     *   {
     *       "openid": "otvxTs4dckWG7imySrJd6jSi0CWE", 
     *       "lang": "zh-CN"
     *   }, 
     *   {
     *       "openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg", 
     *       "lang": "zh-CN"
     *   }
   	 * ]
	 */
	batchGet(user_list) {
		user_list = user_list.map(user => {
			if(typeof user === 'object') return user;

			return {openid: user};
		});
		return this._request('batchGet', {user_list: user_list});
	}

	/* 获取用户列表
	 * @param {String} next_openid 第一个拉取的OPENID，不填默认从头开始拉取
	 * @return {Promise}
	 */
	getList(next_openid) {
		return this._request('getList', {next_openid: next_openid});
	}

	/* 发送请求
	 * @param {String} method 方法名
	 * @param {Object} opts 参数对象
	 * @return {Promise}
	 */
	_request(method, opts){
		const promise = this._checkMethodAndOpts(method, opts);
		if(promise) return promise;

		return this._accessToken.get().then(token => {
			const url = this._getUrl(method, token, opts);

			if(method === 'get' || method === "getList") opts = null;

			return utils.request(url, opts);
		}, err => Promise.reject(err));
	}

	/* 获取url
	 * @param {String} method 方法名
	 * @param {Object} token access_token json对象
	 * @param {Object} opts 方法参数对
	 * @return {String} url 
	 */
	_getUrl(method, token, opts){
		let url = `${api.userInfo[method]}access_token=${token.access_token}`;
		if(method === 'get') url = `${url}&openid=${opts.openid}${opts.lang ? ('&lang=' + opts.lang) : ''}`;
		else if(method === 'getList') url = `${url}${opts.next_openid ? ('&next_openid=' + opts.next_openid) : ''}`;
		return url;
	}

	/* 验证方法和产生是否正确
	 * @param {String} method 方法名
	 * @param {Object} opts 方法参数对象
	 * @return {Promise|Undefined}
	 */
	_checkMethodAndOpts(method, opts) {
		if(!opts
			|| (opts).constructor.name !== 'Object')
			return Promise.reject(`${method} arguments error!`);

		let isTrue = true;

		switch(method) {
			case 'updateRemark': {
				if(!opts.openid
					|| !opts.remark
					|| typeof opts.openid !== 'string'
					|| typeof opts.remark !== 'string'
					|| opts.remark.length >= 30)
					isTrue = false;

				break;
			}
			case 'get': {
				if(!opts.openid
					|| typeof opts.openid !== 'string')
					isTrue = false;

				break;
			}
			case 'batchGet': {
				if(!opts.user_list
					|| !Array.isArray(opts.user_list))
					isTrue = false;

				break;	
			}
			case 'getList': {
				if(opts.next_openid
					&& typeof opts.next_openid !== 'string')
					isTrue = false;

				break;
			}
			default:
				return Promise.reject(`no have ${method} method!`);
		}

		if(!isTrue)
			return Promise.reject(`${method} arguments error!`);
	}
}

exports.Tags = Tags;
exports.UserInfo = UserInfo;