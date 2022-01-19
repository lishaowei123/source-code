const util = {
	/**
	 * @description 延迟执行
	 * @param {Number} ms 延迟时间
	 * @param {Function} fn 延迟结束后执行函数
	 */
	funcDelay(ms = 0, fn) {
		return new Promise((resolve, reject) => {
			let timer = setTimeout(() => {
				resolve(fn && fn())
				clearTimeout(timer)
			}, ms);
		})
	},
	
	/**
	 * @description 上传图片
	 */
	funcUploadImage(count = 1, cb, sourceType = ['album', 'camera']) {
		uni.chooseImage({
			count: count,
			sizeType: ["original", "compressed"],
			sourceType: sourceType,
			success: (res) => {
				cb(res)
			},
			complete() {
				uni.hideLoading()
			}
		});
	},
	
	/**
	 * 获取当前日期
	 */
	funcGetDate(type = 1) {
		const date = new Date();
		let year = date.getFullYear(); 
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		const d = `${year}-${month}-${day}`
		if(type == 1) {
			return d;
		} else {
			const hous = date.getHours()
			const mins = date.getMinutes()
			return `${month}-${day} ${hous}:${mins}`;
		}
	}
}

export default util
