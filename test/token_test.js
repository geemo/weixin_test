'use strict';

const AccessToken = require('../lib/access_token');
const config = require('../config/config.json');

const token = new AccessToken(config.wechat);

token
    .get()
    .then(tk => console.log(tk),
         err => console.log(err));