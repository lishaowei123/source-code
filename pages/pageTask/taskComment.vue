<template>
	<view class="container">
		<textarea class="textareaView" v-model="attrComment" placeholder="请输入内容" />
	</view>
</template>

<script>
	// API
	import Api from "../../apis/apis.js"	// mixins
	import Mixins from '@/mixins/mixin.vue'
	// 工具类
	import utils from "../../common/utils.js"
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrComment : '',
				attrAdminId : void 0
			}
		},
		
		onLoad(options) {
			this.attrId = options.id
			this.attrAdminId = options.adminId
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			Api.taskComment({
				content : this.attrComment,
				task_id: this.attrId,
				admin_id : this.attrAdminId
			}).then(res => {
				if (res.error_code == 0) {
					this.funcShowToast('成功')
					utils.funcDelay(1000, () => {
						uni.navigateBack()
					})
				} else {
					this.funcShowToast(res.error_msg || "失败")
				}
			})
		},
		
		methods: {
			
		},
		
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		height: 100%;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.textareaView {
		width: 100%;
		min-height: 100rpx;
		font-size: 28rpx;
	}
</style>
