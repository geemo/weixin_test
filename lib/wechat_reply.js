'use strict';

exports = module.exports = ServerReponse => {
	ServerReponse.prototype.reply = function(data, ...args){

		if(!data || typeof data !== 'object') 
			return this.end(data || '', ...args);
		
		if(!data.ToUserName) {
			console.error('ToUserName field is required!');
			return false;
		}
		if(!data.FromUserName) {
			console.error('FromUserName field is required!');
			return false;
		}

		let msg_type;
		if(!data.MsgType) {
			// 消息类型识别
			if(data.Content) {
				msg_type = 'text';
			} else if(data.MusicUrl || data.HQMusicUrl || data.ThumbMediaId) {
				msg_type = 'music';
			} else if(data.Articles) {
				msg_type = 'news';
			} else {
				console.error('unrecognized message type!');
				return false;
			}
		} else {
			msg_type = data.MsgType;
		}

		let msg = [
			'<xml>',
			`<ToUserName><![CDATA[${data.ToUserName}]]></ToUserName>`,
			`<FromUserName><![CDATA[${data.FromUserName}]]></FromUserName>`,
			`<CreateTime>${Math.round(Date.now() / 1000)}</CreateTime>`,
			`<MsgType><![CDATA[${msg_type}]]></MsgType>`
		];

		switch(msg_type) {
			case 'text': {
				msg = msg.concat([
					`<Content><![CDATA[${data.Content || ''}]]></Content>`,
					'</xml>'
				]).join('');
				break;
			}
			case 'image': 
			case 'voice': {
				if(!data.MediaId){
					console.log(`MediaId field is required in ${msg_type} message object!`);
					return false;
				}
				let tag_txt = msg_type.replace(/^\w/, $0 => $0.toUpperCase());
				msg = msg.concat([
					`<${tag_txt}>`,
					`<MediaId><![CDATA[${data.MediaId}]]></MediaId>`,
					`</${tag_txt}>`,
					'</xml>'
				]).join('');
				break;
			}
			case 'video': {
				if(!data.MediaId){
					console.log(`MediaId field is required in ${msg_type} message object!`);
					return false;
				}

				msg = msg.concat([
					'<Video>',
					`<MediaId><![CDATA[${data.MediaId}]]></MediaId>`,
					`<Title><![CDATA[${data.Title || ''}]]></Title>`,
					`<Description><![CDATA[${data.Description || ''}]]></Description>`,
					'</Video>',
					'</xml>'
				]).join('');
				break;
			}
			case 'music': {
				msg = msg.concat([
					'<Music>',
					`<Title><![CDATA[${data.Title || ''}]]></Title>`,
					`<Description><![CDATA[${data.Description || ''}]]></Description>`,
					`<MusicUrl><![CDATA[${data.MusicUrl || ''}]]></MusicUrl>`,
					`<HQMusicUrl><![CDATA[${data.HQMusicUrl || ''}]]></HQMusicUrl>`,
					`<ThumbMediaId><![CDATA[${data.ThumbMediaId || ''}]]></ThumbMediaId>`,
					'</Music>',
					'</xml>'
				]).join('');
				break;
			}
			case 'news': {
				const articles = data.Articles;
				if(!articles){
					console.log(`Articles field is required in ${msg_type} message object!`);
					return false;
				}

				if(!Array.is(articles)) {
					console.log(`Articles field must be an array in ${msg_type} message object!`);
					return false;
				}

				msg = msg.concat([
					`<ArticleCount>${articles.length}</ArticleCount>`,
					'<Articles>'
				]);

				articles.forEach(article => {
					msg = msg.concat([
						'<item>',
						`<Title><![CDATA[${article.Title || ''}]]></Title>`,
						`<Description><![CDATA[${article.Description || ''}]]></Description>`,
						`<PicUrl><![CDATA[${article.PicUrl || ''}]]></PicUrl>`,
						`<Url><![CDATA[${article.Url || ''}]]></Url>`,
						'</item>'
					]);
				});

				msg.push('</Articles>', '</xml>');
				msg = msg.join('');
				break;
			}
			default: {
				console.error('message type error!');
				return false;
			}
		}

		return this.end(msg, ...args);		   
	};
};