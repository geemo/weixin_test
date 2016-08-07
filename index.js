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
