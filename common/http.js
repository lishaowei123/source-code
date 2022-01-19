// 请求地址
import request from "./request";

import {
	flag
} from '../config/config.js'

const baseURL = flag ? "http://crm.hndczx.top/api/" : "http://121.5.184.2/api/";

// 可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: baseURL,
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	header: {
		'content-type': 'application/json;charset=UTF-8'
	},
	//是否提示--默认提示
	isPrompt: true,
	//  1 请求是否带token 默认带token
	needToken: true,
	//是否显示请求动画
	load: true,
	//是否使用处理数据模板 
	isFactory: true
});

// 当前接口请求数
let requestNum = 0;

// 登录弹窗次数
let loginPopupNum = 0;

// 登录接口
const LOGININTERFACE = 'login'

/**
 * @description 请求拦截
 */
$http.requestStart = function(options) {
	// console.info('请求前拦截器生效', options)
	if (options.load) {
		if (requestNum <= 0) {
			//打开加载动画
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		}
		requestNum += 1;
	}

	// 本次请求是否需要token
	if (options.needToken) {
		// 是否存在token
		const token = uni.getStorageSync('Authorization');
		if(token) {
			// 请求头中配置token
			options.header['Authorization'] = 'Bearer ' + token
		} else {
			uni.showModal({
				title: '温馨提示',
				content: '此时此刻需要您登录喔~',
				confirmText: "去登录",
				cancelText: "再逛会",
				success: res => {
					loginPopupNum--;
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/pageLogin/pageLoginMain"
						});
					}
				}
			});
		}
	}

	return options;
}

/**
 * @description 响应拦截
 */
$http.requestEnd = function(options, resolve) {
	// console.info('响应前拦截器生效', options)
	//判断当前接口是否需要加载动画
	if (options.load) {
		requestNum = requestNum - 1;
		if (requestNum <= 0) {
			uni.hideLoading();
		}
	}
	
	if (resolve.errMsg && resolve.statusCode && resolve.statusCode > 300) {
		const timer = setTimeout(() => {
			uni.showToast({
				title: "网络错误，请检查一下网络",
				icon: "none"
			});
			clearTimeout(timer)
		}, 500);
	}
}

/**
 * @description 所有接口数据处理（可在接口里设置不调用此方法）
 */
$http.dataFactory = function(res) {
	
	console.log(`%c请求状态码为:[${res.response.statusCode}] = (${res.url}):`, 'color:red');
	
	console.log(`统一处理数据结果`, res.response);
	
	// 判断接口请求是否成功
	if (res.response.statusCode || res.response.statusCode == 200) {

		let httpData = res.response.data;

		//判断数据是否请求成功
		if (res.response.statusCode == 200 || res.response.statusCode == 201) {
			if(httpData.error_code == 401) {
				uni.removeStorageSync('Authorization')
				uni.removeStorageSync('UserInfo')
				uni.navigateTo({
					url: "/pages/pageLogin/pageLoginMain"
				});
			}
			// 返回正确的结果(then接受数据)
			res.resolve(httpData);
		} else if (res.response.statusCode == 401 || res.response.statusCode == 403) {
			uni.showModal({
				title: '温馨提示',
				content: '此时此刻需要您登录喔~',
				confirmText: "去登录",
				cancelText: "取消",
				success: res => {
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/pageLogin/pageLoginMain"
						});
					}
				}
			});
		} else { 
			//其他错误提示
			if (res.isPrompt) { 
				//设置可以提示的时候
				const timer = setTimeout(function() {
					uni.showToast({
						title: httpData.info, //提示后台接口抛出的错误信息
						icon: "none",
						duration: 3000
					});
					clearTimeout(timer)
				}, 500);
			}
			// 返回错误的结果(catch接受数据)
			res.reject(res.response);
		}
	} else {
		// 返回错误的结果(catch接受数据)
		res.reject(res.response);
	}
};

export default $http;
