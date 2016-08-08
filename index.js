'use strict';
const http = require('http');
const app = require('connect')();

// middlewares
const queryParser = require('./middleware/query-parser.js');
const checkSignature = require('./middleware/check-signature.js');
const bodyParser = require('./middleware/body-parser.js');
// config
const config = require('./config/config.json');

// 给http.ServerResponse扩展reply方法
require('./lib/wechat_reply.js')(http.ServerResponse);

app.use(queryParser);
app.use(checkSignature(config.wechat));
app.use(bodyParser);
app.use((req, res, next) => {

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
			 			Title: 'asdf',
			 			Description: 'bbb',
			 			PicUrl: 'http://p4.music.126.net/g0qH9Xr9k4OKp03RLpqy_Q==/1367792466801028.jpg?param=130y130',
			 			Url: 'http://music.163.com/'
			 		},
			 		{
			 			Title: 'cccc',
			 			Description: 'gggg',
			 			PicUrl: 'http://p4.music.126.net/g0qH9Xr9k4OKp03RLpqy_Q==/1367792466801028.jpg?param=130y130',
			 			Url: 'http://music.163.com/'
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
});

app.use((err, req, res, next) => {
	if(err) console.log(err);
	
	if(req.headersSent) {
		next(err);
	} else {
		res.writeHead(500);
		res.end();
	}
});

http
	.createServer(app)
	.listen(config.port, () => console.log(`server start on port ${config.port}`));
