'use strict';
const utils = require('./utils.js');
const resolve = require('path').resolve;
// access_token路径
const tokenPath = resolve('../token.dat');

class AccessToken {
    constructor(opts) {
        opts = opts || {};
        // access_token请求url
        this._url = [
            opts.prefix,
            'token?grant_type=client_credential',
            `&appid=${opts.appId}`,
            `&secret=${opts.appSecret}`
        ].join('');

        // access_token文件存储路径
        this._tokenPath = tokenPath;   
    }
    // 获取access_token
    get(){
        const token = this._token;
        // 如果缓存中有token且合法就直接从缓存中取
        if(token && this._isValid(token)) 
            return Promise.resolve(token);

        // 读取文件并解析数据
        return utils
                .readFile(this._tokenPath)
                .then(data => {
                    if(!data) return this.update();

                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        console.error(e);
                        return this.update();
                    }

                    if(this._isValid(data)) {
                        this._token = data;
                        return Promise.resolve(data);
                    }

                    return this.update();
                }, err => Promise.reject(err));
    }
    // 保存access_token
    save(token){
        const token_str = typeof token === 'object' 
                        ? JSON.stringify(token)
                        : token;

        return utils.writeFile(this._tokenPath, token_str);
    }
    // 更新access_token
    update(){
        return new Promise((resolve, reject) => {
            utils.request(this._url).then(data => {
                // 设置access_token的过期时间
                data.expires_in = Date.now() + (data.expires_in - 10) * 1000;
                this._token = data;
                this.save(data);
                resolve(data);
            }, err => reject(err));
        });
    }
    // 判断access_token是否有效
    _isValid(token){
        if(typeof token !== 'object' 
            || !token.access_token 
            || !token.expires_in) return false;

        if(Date.now() 
            < token.expires_in) return true;
        else return false;
    }
}

exports = module.exports = AccessToken;