const config = require('../../config/config.json');
// lib
const Ticket = require('../../lib/wechat_ticket');
const jsApi = require('../../lib/wechat_js_sign.js');

const ticket = new Ticket(config.wechat);

exports = module.exports = (req, res, next) => {
	ticket.get().then(tk => {
		const noncestr = jsApi.genNonceStr(15);
		const timestamp = jsApi.genTimestamp();
		const url = 'http://jsnode.cn' + (req.url.length === 1 ? '' : req.url);

		const signature = jsApi.genSign(noncestr, tk.ticket, timestamp, url);
		const data = {
			appId: config.wechat.appId,
			nonceStr: noncestr,
			timestamp: timestamp,
			signature: signature,
			jsApiList: [
	    		'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone',
				'startRecord',
				'stopRecord',
				'onVoiceRecordEnd',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'onVoicePlayEnd',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'translateVoice',
				'getNetworkType',
				'openLocation',
				'getLocation',
				'hideOptionMenu',
				'showOptionMenu',
				'hideMenuItems',
				'showMenuItems',
				'hideAllNonBaseMenuItem',
				'showAllNonBaseMenuItem',
				'closeWindow',
				'scanQRCode',
				'chooseWXPay',
				'openProductSpecificView',
				'addCard',
				'chooseCard',
				'openCard'
	    	] 
		};

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(data));
	}, err => next(err));
};