'use strict';

const Ticket = require('../lib/wechat_ticket.js');
const config = require('../config/config.json');
const utils = require('../lib/utils.js');

const ticket = new Ticket(config.wechat);

ticket
	.get()
	.then(tk => console.dir(tk), err => console.error(err));