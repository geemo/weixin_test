'use strict';
const Express = require('express');
const crypto = require('crypto');
const config = require('./config.json');
const utils = require('./lib/utils.js');

const app = new Express();

// middlewares
const checkSignature = require('./middleware/check-signature.js');
const bodyParse = require('./middleware/body-parser.js');

app.use(checkSignature(config.wechat));
app.use(bodyParse);
app.use((req, res, next) => {

    const body = req.body;
    if (body.MsgType === 'event' && body.Event === 'subscribe') {
		let reply_txt = `<xml>
						<ToUserName><![CDATA[${body.FromUserName}]]></ToUserName>
						<FromUserName><![CDATA[${body.ToUserName}]]></FromUserName>
						<CreateTime>${Date.now()}</CreateTime>
						<MsgType><![CDATA[text]]></MsgType>
						<Content><![CDATA[hi, my dog]]></Content>
						</xml>`

		console.log(body);
		console.log(reply_txt);

  		res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(reply_txt);
    } else {
    	res.end('');
    }
});

app.use((err, req, res, next) => {
	if(err) console.log(err);
	if(req.headersSent) next(err);
	else res.status(500).end('');
});

app.listen(config.port, () => console.log(`server start on port ${config.port}`));
