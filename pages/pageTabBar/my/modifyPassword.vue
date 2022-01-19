<template>
	<view class="">
		<view class="box">
			<input class="inputBox" placeholder="请输入新的登录密码" type="text" password v-model="attrSource.newPassword1" />
		</view>
		<view class="box">
			<input class="inputBox" placeholder="请确定新的登录密码" type="text" password v-model="attrSource.newPassword2" />
		</view>
		
		<button class="addBtn" type="primary" @click="funcConfirm">确定</button>
	</view>
</template>

<script>
	// 工具
	import utils from '../../../common/utils.js'
	// API
	import Api from "../../../apis/apis.js"
	export default {
		data() {
			return {
				attrSource : {
					newPassword1 : '',
					newPassword2 : ''
				}
			}
		},
		
		mounted() {
			
		},
		
		methods: {
			
			/**
			 * 错误提示
			 */
			funcShowToast(title) {
				uni.showToast({
					title : title,
					icon : 'none'
				})
			},
			
			/**
			 * 修改
			 */
			funcConfirm() {
				if(this.attrSource.newPassword1 <= 6) {
					this.funcShowToast('密码不能小于6位')
					return 
				}
				if(this.attrSource.newPassword2 <= 6) {
					this.funcShowToast('密码不能小于6位')
					return 
				}
				if(this.attrSource.newPassword1 != this.attrSource.newPassword2) {
					this.funcShowToast('两次密码不一致')
				} else {
					Api.getUserPasswordUpdate({
						password: this.attrSource.newPassword1
					}).then(res => {
						if(res.error_code == 0) {
							this.funcShowToast('修改成功')
							utils.funcDelay(1000, () => {
								uni.clearStorageSync();
								uni.showToast({
									title:'成功',
									icon : 'none'
								})
								uni.redirectTo({
									url : '../../pageLogin/pageLoginMain'
								})
							})
						} else {
							this.funcShowToast(res.error_msg)
						}
					})
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.box {
		background-color: white;
		height: 100rpx;
		padding: 20rpx;
		border-top: 10rpx whitesmoke solid;
		box-sizing: border-box;
		.inputBox {
			width: 100%;
			height: 100%;
			font-size: 28rpx;
		}
	}
	
	.addBtn {
		width: 90%;
		margin-top: 60rpx;
	}
	
</style>
