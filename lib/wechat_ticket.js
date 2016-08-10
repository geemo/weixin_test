'use strict';

const utils = require('./utils.js');
const AccessToken = require('./wechat_access_token.js');
const path = require('path');

const prefix = path.resolve(__dirname, '../');

class Ticket {
	constructor(opts, type) {
		this._prefix = opts.prefix;
		this._accessToken = new AccessToken(opts);
		this._type = type || 'jsapi';

		// jsapi_ticket路径
		this._ticketPath = path.join(prefix, `ticket_${this._type}.dat`);
	}
	// jsapi_ticket获取
	get() {
		const ticket = this._ticket;

		if(ticket && this._isValid(ticket))
			return Promise.resolve(ticket);

		// 判断文件是否存在
		return utils
				.existsFile(this._ticketPath)
				.then(() => {
					// 读取文件并解析数据
					return utils
							.readFile(this._ticketPath)
							.then(data => {
								if(!data) return this.update();

								try {
									data = JSON.parse(data);
								} catch(e) {
									console.error(e);
									return this.update();
								}

								if(!this._isValid(data))
									return this.update();

								this._ticket = data;
								return Promise.resolve(data);
							}, err => Promise.reject(err));

				}, err => {
					console.error(err);
					return this.update();
				});
	}

	// 保存ticket到文件中
    save(ticket){
        const ticket_str = typeof ticket === 'object' 
                        ? JSON.stringify(ticket)
                        : ticket;

        return utils.writeFile(this._ticketPath, ticket_str);
    }

    // 更新ticket
	update() {
		return this._accessToken.get().then(token => {
			const url = this._getUrl(token);

			return utils
					.request(url)
					.then(data => {
						let _ticket = {
							ticket: data.ticket,
							expires_in: Date.now() + (data.expires_in - 10) * 1000
						};

						this._ticket = _ticket;
						return this
								.save(_ticket)
								.then(() => Promise.resolve(_ticket), err => Promise.reject(err));

					}, err => Promise.reject(err));

		}, err => Promise.reject(err));
	}

	// 获取url
	_getUrl(token) {
		return `${this._prefix}ticket/getticket?access_token=${token.access_token}&type=${this._type}`;
	}

	// 验证ticket是否合法
	_isValid(ticket) {
		if(!ticket
			|| (ticket).constructor.name !== 'Object'
			|| !ticket.ticket
			|| !ticket.expires_in)
			return false;

		if(Date.now() 
			> ticket.expires_in)
			return false;

		return true;
	}
}

exports = module.exports = Ticket;