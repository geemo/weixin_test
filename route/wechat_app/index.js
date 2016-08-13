'use strict';
const Kugou = require('../../lib/kugou_music.js');
const kugou = new Kugou();

module.exports = (req, res, next) => {
    const body = req.body;
    console.log(body);

    let reply_opts = {
        ToUserName: body.FromUserName,
        FromUserName: body.ToUserName   
    };

    if (body.MsgType === 'text' || body.MsgType === 'voice') {
        const content = body.Content || body.Recognition;

    	if (content === '1'){
    		// 文本消息
            reply_opts.Content = 'hello world';
	  		res.reply(reply_opts);
    	} else if (content === '2') {
    		// 图文消息
            reply_opts.Articles = [{
                Title: 'node公众号测试',
                Description: 'js-sdk测试',
                PicUrl: 'http://img5.imgtn.bdimg.com/it/u=1372548949,303274540&fm=21&gp=0.jpg',
                Url: 'http://jsnode.cn/weixin'
            }];
			res.reply(reply_opts);
    	} else if (content === '3') {
    		// 图片消息
            reply_opts.MsgType = 'image';
            reply_opts.MediaId = 'JrSYA7Uz-y2xoUn2qXYt1t8nFayhGv4BaIzfnXYkBQAanOoEMMiKQrX6ebnUDaBz';
            res.reply(reply_opts);
    	} else {
            if(content.length > 10) {
                reply_opts.Content = '未知消息';
                res.reply(reply_opts);
            } else {
                kugou
                    .getSong(content)
                    .then(song => {
                        reply_opts.Title = song.songname;
                        reply_opts.Description = song.album_name;
                        reply_opts.MusicUrl = song.songUrl;
                        res.reply(reply_opts);
                    }, err => {
                        reply_opts.Content = JSON.stringify(err);
                        res.reply(reply_opts);
                    });
            }
    	}
    } else if(body.MsgType === 'event') {
    	if(body.Event === 'subscribe') {
            reply_opts.Content = '欢迎关注本订阅号\n' +
                                 '回复1显示一段文字\n' +
                                 '回复2显示一篇图文信息\n' +
                                 '回复3显示图片信息\n' +
                                 '回复其他(字数不能超过10个字)进行音乐搜索';

            res.reply(reply_opts);
        }
    } else {
        res.end('');
    }
};