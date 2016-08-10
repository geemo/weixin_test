'use strict';
const crypto = require('crypto');

exports.genSign = genSign;
exports.genNonceStr = genNonceStr;
exports.genTimestamp = genTimestamp;

/* 生成签名值
 * @param {String} noncestr 随机字符串
 * @param {String} ticket jsapi_ticket票据
 * @param {String} timestamp 时间戳
 * @param {String} url 请求url
 * @return {String} 签名值
 */
function genSign(noncestr, ticket, timestamp, url){
	const sign_str = [
		'noncestr=' + noncestr,
	 	'jsapi_ticket=' + ticket,
	 	'timestamp=' + timestamp, 
	 	'url=' + url
	].sort().join('&');

	return crypto
			.createHash('sha1')
			.update(sign_str)
			.digest('hex');
}

/* 生成随机字符串
 * @param {Number} count 生成的字符数
 * @return {String} str 生成的随机字符串
 */
function genNonceStr(count) {
	const chars = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
		'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
		'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
		'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
		'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
		't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1',
		'2', '3', '4', '5', '6', '7', '8', '9'];

	let str = '';

	for(let i = 0; i < count; ++i) 
		str += chars[Math.round(Math.random() * (chars.length - 1))];
	
	return str;
}


/* 生成时间戳
 * @return {String} 时间戳
 */
function genTimestamp(){
	return String(Math.floor(Date.now() / 1000)); 
}