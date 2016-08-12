'use strict';

module.exports = (req, res, next) => {

    const body = req.body;
    console.log(body);
    if (body.MsgType === 'text') {
    	if (body.Content === '1'){
    		// 文本消息
	  		res.reply({
	  		  	ToUserName: body.FromUserName,
	  		  	FromUserName: body.ToUserName,
			 	Content: 'hello world'
			});
    	} else　if (body.Content === '2') {
    		// 音乐消息
			res.reply({
				ToUserName: body.FromUserName,
				FromUserName: body.ToUserName,
				Title: 'aaa',
				Description: 'bbb',
				MusicUrl: 'http://mp3.haoduoge.com/s/2016-08-07/1470550774.mp3'
			});
    	} else if (body.Content === '3') {
    		// 图文消息
			res.reply({
				ToUserName: body.FromUserName,
			 	FromUserName: body.ToUserName,
			 	Articles: [
			 		{
			 			Title: 'node公众号测试',
			 			Description: 'js-sdk测试',
			 			PicUrl: 'http://img5.imgtn.bdimg.com/it/u=1372548949,303274540&fm=21&gp=0.jpg',
			 			Url: 'http://jsnode.cn/weixin'
			 		}
			 	]
			});
    	} else if (body.Content === '4') {
    		// 图片消息
    		res.reply({
    			ToUserName: body.FromUserName,
    			FromUserName: body.ToUserName,
    			MsgType: 'image',
    			MediaId: 'JrSYA7Uz-y2xoUn2qXYt1t8nFayhGv4BaIzfnXYkBQAanOoEMMiKQrX6ebnUDaBz'
    		});
    	} else {
    		res.reply({
    			ToUserName: body.FromUserName,
    			FromUserName: body.ToUserName,
    			Content: '未知消息'
    		});
    	}

    } else {
    	res.end('');
    }
};