function ajax(obj) {
    if (XMLHttpRequest) {

        if (obj && typeof obj === 'object') {

            var url = obj.url || '';
            var method = obj.method ? obj.method.toUpperCase() : 'GET';
            var async = obj.async || true;
            var jsonp = obj.jsonp || undefined;
            var headers = obj.headers || null;
            var data = obj.data || undefined;
            var callback = obj.callback || null;

            if (jsonp) {

                var script = document.createElement('script');
                script.src = url;
                document.body.appendChild(script);

            } else {

                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (callback) {
                            var data = {};
                            data.status = xhr.status;
                            if (/json/.test(xhr.getResponseHeader('Content-Type')))
                                data.data = JSON.parse(xhr.responseText);
                            else
                                data.data = xhr.responseText;

                            if(/^(?:4|5)\d\d$/.test(String(data.status)))
                                callback(data);
                            else
                                callback(null, data);
                        }   
                    }
                };

                xhr.open(method, url, async);

                if (headers && typeof headers === 'object' && Object.keys(headers).length) {
                    for (var key in headers) {
                        if (headers.hasOwnProperty(key)) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    }
                }

                if(data){

                    if(data && typeof data === 'object'){
                        var bodyDate = JSON.stringify(data);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Content-Length', bodyDate.length);
                        xhr.send(bodyDate);

                    } else if(typeof data === 'string') {
                        xhr.setRequestHeader('Content-Type', 'text/plain');
                        xhr.setRequestHeader('Content-Length', data.length);
                        xhr.send(data);
                    } else {
                        throw new Error('data type error!');
                    }

                } else {
                    xhr.send(null);
                }

            }

        }
    } else {
        throw new Error('您的浏览器太旧,请升级浏览器!');
    }
}