export default class request {
    // 配置项
    constructor(options) {
        //请求公共地址
        this.baseUrl = options.baseUrl || "";
        //公共文件上传请求地址
        this.fileUrl = options.fileUrl || "";
        //默认请求头
        this.header = options.header || {};
        //默认配置
        this.config = {
            // 这是对于接口的错误是否提示
            isPrompt: options.isPrompt === false ? false : true,
            // 是否加载动画提示
            load: options.load === false ? false : true,
            // 是否需要token
            needToken: options.needToken === false ? false : true,
            // 公共数据的处理
            isFactory: options.isFactory === false ? false : true,
			// 加载更多
            loadMore: options.loadMore === false ? false : true
        };
    }

    // 获取默认信息
    getDefault(data, options = {}) {
        //判断url是不是链接
        let urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(data.url);
        let config = Object.assign({}, this.config, options, data);
        if (data.method == "FILE") {
            config.url = urlType ? data.url : this.fileUrl + data.url;
        } else {
            config.url = urlType ? data.url : this.baseUrl + data.url;
        }
        //请求头
        if (options.header) {
            config.header = Object.assign({}, this.header, options.header);
        } else if (data.header) {
            config.header = Object.assign({}, this.header, data.header);
        } else {
            config.header = this.header;
        }
        return config;
    }

    //post请求
    post(url = '', data = {}, options = {}) {
        return this.request({
            method: "POST",
            data: data,
            url: url,
            ...options
        });
    }

    //get请求
    get(url = '', data = {}, options = {}) {
        return this.request({
            method: "GET",
            data: data,
            url: url,
            ...options
        });
    }

    //put请求
    put(url = '', data = {}, options = {}) {
        return this.request({
            method: "PUT",
            data: data,
            url: url,
            ...options
        });
    }

    //delete请求
    delete(url = '', data = {}, options = {}) {
        return this.request({
            method: "DELETE",
            data: data,
            url: url,
            ...options
        });
    }

    //接口请求方法
    request(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!data.url) {
                console.log("request缺失数据url");
                reject({
                    errMsg: "缺失数据url",
                    statusCode: 0
                });
                return;
            }
			
            let requestInfo = this.getDefault(data);
			
            //请求前回调
            if (self.requestStart) {
                let requestStart = this.requestStart(requestInfo);
                if (typeof requestStart == "object") {
					requestInfo = {
						...requestInfo,
						...requestStart
					}
                    // requestInfo.data = requestStart.data;
                    // requestInfo.header = requestStart.header;
                    // requestInfo.isPrompt = requestStart.isPrompt;
                    // requestInfo.needToken = requestStart.needToken;
                    // requestInfo.load = requestStart.load;
                    // requestInfo.isFactory = requestStart.isFactory;
                } else {
                    //请求完成回调
                    self.requestEnd && self.requestEnd(requestInfo, {
                        errMsg: "请求开始拦截器未通过",
                        statusCode: 0
                    });
                    reject({
                        errMsg: "请求开始拦截器未通过",
                        statusCode: 0
                    });
                    return;
                }
            }
					
            const requestData = {
                url: requestInfo.url,
				method:requestInfo.method,
				data: requestInfo.data,
                header: requestInfo.header, //加入请求头
                success: (res) => {
                    //请求完成回调
                    this.requestEnd && this.requestEnd(requestInfo, res);
                    //是否用外部的数据处理方法
                    if (requestInfo.isFactory && this.dataFactory) {
                        //数据处理
                        this.dataFactory({
                            ...requestInfo,
                            response: res,
                            resolve: (source) => {
								resolve(source);
							},
                            reject: reject
                        });
                    } else {
                        resolve(res);
                    }
                },
                fail: (err) => {
                    console.log("请求失败", err);
                    //请求完成回调
                    this.requestEnd && this.requestEnd(requestInfo, err);
                    reject(err);
                }
            };
			return uni.request(requestData);
        })
    }
}