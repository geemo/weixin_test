'use strict';
const http = require('http');
const app = require('express')();

// middlewares
const checkSignature = require('./middleware/check-signature.js');
const bodyParse = require('./middleware/body-parser.js');
// config
const config = require('./config/config.json');

// 给http.ServerResponse扩展reply方法
require('./lib/wechat_reply.js')(http.ServerResponse);

app.use(checkSignature(config.wechat));
app.use(bodyParse);
app.use((req, res, next) => {

    const body = req.body;
    if (body.MsgType === 'event' && body.Event === 'subscribe') {
  		res.writeHead(200, {'Content-Type': 'application/xml'});
        res.reply({
        	ToUserName: body.FromUserName,
        	FromUserName: body.ToUserName,
			Content: 'hello world'
		});
    } else {
    	res.end('');
    }
});

app.use((err, req, res, next) => {
	if(err) console.log(err);
	if(req.headersSent) next(err);
	else res.status(500).end('');
});

http
	.createServer(app)
	.listen(config.port, () => console.log(`server start on port ${config.port}`));
