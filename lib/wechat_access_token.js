'use strict';
const utils = require('./utils.js');
const path = require('path');
// access_token路径前缀
const prefix = path.resolve(__dirname, '../');

class AccessToken {
    constructor(opts, filename) {
        opts = opts || {};
        // access_token请求url
        this._url = [
            opts.prefix,
            'token?grant_type=client_credential',
            `&appid=${opts.appId}`,
            `&secret=${opts.appSecret}`
        ].join('');

        // access_token文件存储路径
        this._tokenPath = path.join(prefix, 'token.dat');
    }

    /* 获取access_token
     * @return {Promise}
     */
    get(){
        const token = this._token;
        // 如果缓存中有token且合法就直接从缓存中取
        if(token && this._isValid(token)) 
            return Promise.resolve(token);

        // 判断文件是否存在
        return utils
                .existsFile(this._tokenPath)
                .then(() => {
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
                }, err => {
                    console.error(err);
                    return this.update();
                });
    }

    /* 保存access_token
     * @param {String|Object} token 访问票据字符串或对象
     * @return {Promise}
     */
    save(token){
        const token_str = typeof token === 'object' 
                        ? JSON.stringify(token)
                        : token;

        return utils.writeFile(this._tokenPath, token_str);
    }

    /* 更新access_token
     * @return {Promise}
     */
    update(){
        return utils.request(this._url).then(data => {
            // 设置access_token的过期时间
            data.expires_in = Date.now() + (data.expires_in - 10) * 1000;
            this._token = data;
            return this
                    .save(data)
                    .then(() => Promise.resolve(data), err => Promise.reject(err));

        }, err => Promise.reject(err));
    }

    /* 判断access_token是否有效
     * @param {Object} token 访问票据对象
     * @return {Promise}
     */
    _isValid(token){
        if(typeof token !== 'object' 
            || !token.access_token 
            || !token.expires_in) return false;

        if(Date.now() 
            > token.expires_in) return false;
        
        return true;
    }
}

exports = module.exports = AccessToken;