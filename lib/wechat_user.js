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
		getIdList: prefxi + 'tags/getidlist?',						// 获取用户身上的标签列表
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

	create(name) {
		return this._request('create', {tag: {name: name}});
	}

	get() {
		return this._request('get');
	}

	update(id, name) {
		return this._request('update', {tag: {id: id, name: name}});
	}

	remove(id) {
		return this._request('remove', {tag: {id: id}});
	}

	getIdList(openid) {
		return this._request('getIdList', {openid: openid});
	}

	getTagFans(tagid, next_openid) {
		return this._request('getTagFans', {tagid: tagid, next_openid: next_openid});
	}

	mBatchTagging(openid_list, tagid) {
		return this._request('mBatchTagging', {openid_list: openid_list, tagid: tagid});
	}

	mBatchUntagging(openid_list, tagid) {
		return this._request('mBatchUntagging', {openid_list: openid_list, tagid: tagid});
	}

	method(name, opts) {
		const promise = this._checkMethodAndOpts(name, opts);
		if(promise) return promise;

		return this._request(name, opts);
	}

	_request(method, opts) {
		const promise = this._checkMethodAndOpts(method, opts);
		if(promise) return promise;

		return this._accessToken.get().then(token => {
			const url = this._getUrl(method);

			return utils
					.request(url, opts)
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

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
			case 'get' {
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
					|| !opts.id)
					isTrue = false;

				break;
			}
			case 'getIdList': {
				if(!opts.tagid)
					isTrue = false;

				break;
			}
			case 'getTagFans': {
				if(!opts.tagid
					|| !opts.next_openid)
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

	updateRemark(openid, remark) {
		return this._request('updateRemark', {openid: openid, remark: remark});
	}

	get(openid, lang) {
		return this._request('get', {openid: openid, lang: lang});
	}

	batchGet(arr) {
		return this._request('batchGet', {user_list: arr});
	}

	getList(next_openid) {
		return this._request('getList', );
	}

	_request(method, opts){
		const promise = this._checkMethodAndOpts(method, opts);
		if(promise) return promise;

		return this._accessToken.get().then(token => {
			const url = this._getUrl(method, token, opts);

			if(method === 'get') opts = null;

			return utils
					.request(url, opts)
					.then(data => Promise.resolve(data), err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	_getUrl(method, token, opts){
		let url = `${api.userInfo[method]}access_token=${token.access_token}`;
		if(method === 'get') url = `${url}&openid=${opts.openid}${opts.lang ? ('&lang=' + opts.lang) : ''}`;
		return url;
	}

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