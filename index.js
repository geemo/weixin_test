'use strict';
const http = require('http');
const path = require('path');
const app = require('connect')();

// 配置文件
const config = require('./config/config.json');

// 中间件
const favicon = require('./middleware/favicon.js');
const queryParser = require('./middleware/query-parser.js');
const staticPath = require('./middleware/static-path.js');
const checkSignature = require('./middleware/check-signature.js');
const bodyParser = require('./middleware/body-parser.js');

// 路由控制器
const wechat_web = require('./route/wechat_web/router_switcher.js');
const wechat_app = require('./route/wechat_app/index.js');

// 给http.ServerResponse扩展reply方法
require('./lib/wechat_reply.js')(http.ServerResponse);

// favicon响应处理
app.use(favicon);
// 查询字符串解析
app.use(queryParser);
// 消息体解析
app.use(bodyParser);
// 静态文件响应中间件
app.use('/weixin', staticPath(path.join(__dirname, './static')));
// 微信web端逻辑
app.use('/weixin', wechat_web);
// 校验签名
app.use(checkSignature(config.wechat));
// 微信app端逻辑
app.use(wechat_app);

// 404错误处理
app.use((req, res, next) => {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end(`the request URL ${req.url} was not found on this server!`);
});

// 500错误处理
app.use((err, req, res, next) => {
	if(err) console.log(err);
	
	if(res.headersSent) {
		next(err);
	} else {
		res.writeHead(500);
		res.end(err.stack);
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