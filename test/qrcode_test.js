'use strict';

const Qrcode = require('../lib/wechat_qrcode.js');
const utils = require('../lib/utils.js');

const qrcode = new Qrcode();

// qrcode
// 	.createTmpQrcode(1234)
// 	.then(data => console.dir(data), err => console.error(err));


qrcode
	.createLimitQrcode(1234)
	.then(data => {
		console.dir(data)
		const url = qrcode.getShowQrcodeUrl(data.ticket);
		console.log(url);

	}, err => console.error(err));

	https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGl8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xLzdUX3FTZmpsNXc2ZXNQNlNVeE5wAAIE8e2rVwMEAAAAAA==