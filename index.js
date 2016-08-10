'use strict';
const http = require('http');
const app = require('connect')();
const ejs = require('ejs');
const path = require('path');

// middlewares
const queryParser = require('./middleware/query-parser.js');
const checkSignature = require('./middleware/check-signature.js');
const bodyParser = require('./middleware/body-parser.js');
// config
const config = require('./config/config.json');
// lib
const Ticket = require('./lib/wechat_ticket');
const jsApi = require('./lib/wechat_js_sign.js');

const ticket = new Ticket(config.wechat);

// 给http.ServerResponse扩展reply方法
require('./lib/wechat_reply.js')(http.ServerResponse);

app.use((req, res, next) => {
	if(/^\/favicon.ico/.test(req.url)) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		return res.end('Not Found');
	}

	next();
});
app.use(queryParser);
app.use(bodyParser);
app.use((req, res, next) => {
	if(/^\/weixin/.test(req.url)){
		ticket.get().then(tk => {
			const noncestr = jsApi.genNonceStr(15);
			const timestamp = jsApi.genTimestamp();
			const url = 'http://jsnode.cn' + req.url;
			console.log(url);
			const signature = jsApi.genSign(noncestr, tk.ticket, timestamp, url);
			const data = {
				name: 'geemo',
				noncestr: noncestr,
				timestamp: timestamp,
				signature: signature
			};

			console.dir(data);

			ejs.renderFile(path.resolve('./static/html/index.html'), data, (err, str) => {
				if(err) return next(err);
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(str);
			});
		}, err => next(err));
	} else {
		next();
	}
});
app.use(checkSignature(config.wechat));
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


process.on('uncaughtException', err => {
	console.error(err);
});

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
});