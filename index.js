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
    if (body.MsgType === 'event' && body.Event === 'subscribe') {
  		res.writeHead(200, {'Content-Type': 'application/xml'});
  //       res.reply({
  //       	ToUserName: body.FromUserName,
  //       	FromUserName: body.ToUserName,
		// 	Content: 'hello world'
		// });
		res.reply({
			ToUserName: body.FromUserName,
			FromUserName: body.ToUserName,
			Title: 'aaa',
			Description: 'bbb',
			MusicUrl: 'http://mp3.haoduoge.com/s/2016-08-07/1470550774.mp3'
		});
		// res.reply({
		// 	ToUserName: body.FromUserName,
		//  	FromUserName: body.ToUserName,
		//  	Articles: [
		//  		{
		//  			Title: 'asdf',
		//  			Description: 'bbb',
		//  			PicUrl: 'http://p4.music.126.net/g0qH9Xr9k4OKp03RLpqy_Q==/1367792466801028.jpg?param=130y130',
		//  			Url: 'http://music.163.com/'
		//  		},

		//  		{
		//  			Title: 'cccc',
		//  			Description: 'gggg',
		//  			PicUrl: 'http://p4.music.126.net/g0qH9Xr9k4OKp03RLpqy_Q==/1367792466801028.jpg?param=130y130',
		//  			Url: 'http://music.163.com/'
		//  		}
		//  	]
		// });

		// res.writeHead(200, {'Content-Type': 'application/xml'});
		// res.end(`<xml><ToUserName><![CDATA[${body.FromUserName}]]></ToUserName><FromUserName><![CDATA[${body.ToUserName}]]></FromUserName><CreateTime>1470551790</CreateTime><MsgType><![CDATA[music]]></MsgType><Music><Title><![CDATA[asdf]]></Title><Description><![CDATA[bbb]]></Description><MusicUrl><![CDATA[http://sc.111ttt.com/up/mp3/347508/FCAF062BECD1C24FAED2A355EF51EBDD.mp3]]></MusicUrl><HQMusicUrl><![CDATA[http://sc.111ttt.com/up/mp3/347508/FCAF062BECD1C24FAED2A355EF51EBDD.mp3]]></HQMusicUrl><ThumbMediaId><![CDATA[http://p4.music.126.net/g0qH9Xr9k4OKp03RLpqy_Q==/1367792466801028.jpg?param=130y130]]></ThumbMediaId></Music></xml>`);
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
