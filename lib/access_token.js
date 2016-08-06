'use strict';
const https = require('https');
const utils = require('./utils.js');

class AccessToken {
    constructor(opts) {
        opts = opts || {};
        // access_token请求url
        this._url = [
            opts.tokenPrefix,
            '?grant_type=client_credential',
            `&appid=${opts.appId}`,
            `&secret=${opts.appSecret}`
        ].join('');

        // access_token文件存储路径
        this._tokenPath = opts.tokenPath;      
    }

    get(){
        const token = this._token;
        // 如果缓存中有token且合法就直接从缓存中取
        if(token && this.isValid(token)) 
            return Promise.resolve(token);

        // 读取文件并解析数据
        return utils
                .readFile(this._tokenPath)
                .then(data => {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        console.log(e);
                        return this.update();
                    }

                    if(this.isValid(data)) {
                        this._token = data;
                        return Promise.resolve(data);
                    }

                    return this.update();
                }, err => Promise.reject(err));
    }

    save(token){
        const token_str = typeof token === 'object' 
                        ? JSON.stringify(token)
                        : token;

        return utils.writeFile(this._tokenPath, token_str);
    }

    update(){
        return new Promise((resolve, reject) => {
            https.get(this._url, res => {
                let chunks = [];

                res.on('data', data => chunks.push(data));

                res.on('end', () => {
                    let data = Buffer.concat(chunks).toString('utf8');

                    try{
                        data = JSON.parse(data);
                    } catch(e) {
                        reject(e);
                    }

                    if (data.errcode || data.errmsg) {
                        let err = new Error(`${data.errcode} ${data.errmsg}`);
                        reject(err);
                    } else {
                        // 设置access_token的过期时间
                        data.expires_in = Date.now() + (data.expires_in - 10) * 1000;
                        this._token = data;
                        this.save(data);
                        resolve(data);
                    }
                });
            }).on('error', err => reject(err));
        });
    }

    isValid(token){
        if(typeof token !== 'object' 
            || !token.access_token 
            || !token.expires_in) return false;

        if(Date.now() 
            < token.expires_in) return true;
        else return false;
    }
}

module.exports = AccessToken;