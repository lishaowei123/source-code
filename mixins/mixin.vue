<template>

</template>

<script>
	import {
		UPLOADPATH
	} from '../config/config.js'
	import utils from '../common/utils.js'
	import moment from 'moment'
	export default {
	    data() {
	        return {
				// 消费类型type
	            attrTypeList : [
	            	// { icon : '../../static/feiji.png', title : "长途费",type : '1' },
	            	// { icon : '../../static/daba.png', title : "交通费",type : '2' },
	            	{ icon : '../../static/zhusu.png', title : "住宿费",type : '3' },
	            	// { icon : '../../static/canyin.png', title : "餐饮费",type : '4' },
	            	// { icon : '../../static/dianhua.png', title : "通讯费",type : '5' },
	            	{ icon : '../../static/zhaodai.png', title : "招待费",type : '6' },
	            	// { icon : '../../static/lipin.png', title : "礼品费",type : '7' },
	            	{ icon : '../../static/qita.png', title : "其他",type : '8' },
					{ icon : '../../static/gongguan.png', title : "公关费",type : '9' },
					{ icon : '../../static/kafei.png', title : "技术服务费",type : '10' },
					{ icon : '../../static/gongwenbao.png', title : "三方费",type : '11' },
					{ icon : '../../static/jiayou.png', title : "加油费",type : '12' },
					{ icon : '../../static/guolu.png', title : "过路费",type : '13' },
					{ icon : '../../static/tingche.png', title : "交通费",type : '14' },
					{ icon : '../../static/canbu.png', title : "餐补",type : '15' },
					{ icon : '../../static/kuaidi.png', title : "快递费",type : '16' },
					{ icon : '../../static/paidan.png', title : "派单成本",type : '17' },
					
	            ]
	        }
	    },
		
	    methods: {
			/**
			 * 获取时间
			 */
			funcGetDate(type = "YYYY-MM-DD HH:mm:ss", data) {
				return moment(data).format(type)
			},
			
			/**
			 * 是否过期
			 */
			funcOverdue(time) {
				const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
				const flag = moment(time).isBefore(currentTime)
				if(flag) {
					return "已过期"
				} else {
					return '截止' + moment(time).format('YYYY-MM-DD')
				}
			},
			
			/**
			 * @param {Object} time格式化日期
			 */
			funcFormat(date, format = 'YYYY-MM-DD') {
				return moment(date).format(format)
			},
			
			/**
			 * 过期状态
			 */
			funcOverdueStatus(time) {
				const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
				const flag = moment(time).isBefore(currentTime)
				if(flag) {
					return true
				} else {
					return false
				}
			},
			
			/**
			 * 提示
			 */
			funcShowToast(title = '') {
				uni.showToast({
					title : title,
					icon : 'none'
				})
			},
			
			/**
			 * 截取名字
			 */
			funcSubName(name) {
				if(name && name.length == 3) {
					return name.substr(1)
				} else if(name && name.length >= 4) {
					return name.substring(name.length, 3)
				} else {
					return name
				}
			},
			
			/**
			 * 匹配图片
			 */
			funcMatchingImage(title) {
				const item = this.attrTypeList.filter(item => {
					if(item.title.includes(title)) {
						return item[0]
					}
					return item.title == title || {}
				})
				return item[0] || {}
			},
			
			/**
			 * 获取相册
			 */
			funcGetPhoto(callback) {
				utils.funcUploadImage(3, (res) => {
					uni.showLoading({
						title : '上传中..'
					})
					res.tempFilePaths.map((file) => {
						uni.uploadFile({
							url: UPLOADPATH,
							filePath: file,
							name: "file",
							success: (uploadFileRes) => {
								const response = JSON.parse(uploadFileRes.data);
								callback && callback(response.data.url)
							},
							complete:() => {
								uni.hideLoading()
							}
						})
					})
				})
			},
			
			/**
			 * 排序
			 */
			funcPriceSort() {
				
			}
			
	    }
	}
</script>

<style lang="less">
	
</style>
