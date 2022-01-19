<template>
	<view class="container">
		<image class="logo" src="../../static/60x60.png" mode=""></image>
		<view class="accountAndPassword">
			<view class="account">
				<image class="beforeIcon" src="../../static/username.png" mode="widthFix"></image>
				<input class="inputValue" placeholder="请输入账号" type="number" maxlength="11" v-model="attrSource.account" />
			</view>
			<view class="password"> 
				<view class="passwordLeft">
					<image class="beforeIcon" src="../../static/password.png" mode="widthFix"></image>
					<input class="inputValue" placeholder="请输入密码" type="text" password v-model="attrSource.password" />
				</view>
				<text @click="funcRetrievePassword" v-if="false">忘记密码？</text>
			</view>
		</view>
		<button class="loginButton" type="primary" style="background-color: #000000;" @click="funcLogin">登录</button>
		<view class="buttonView" v-if="false">
			<text @click="funcRegister">注册账号</text>
			<text class="clearance"> | </text>
			<text @click="funcMoreOptions">更多选项</text>
		</view>
	</view>
</template>

<script>
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrSource: {
					account : void 0,
					password : void 0
				}
			}
		},
		
		methods: {
			/**
			 * 提示
			 */
			funcShowToast(string) {
				uni.showToast({
					title : string,
					icon : 'none'
				})
			},
			
			/**
			 * 登录
			 */
			funcLogin() {
				if(!this.attrSource.account) {
					this.funcShowToast('电话不能为空')
					return
				}
				if(!this.attrSource.password) {
					this.funcShowToast('密码不能为空')
					return
				}
				Api.login({
					phone: this.attrSource.account,
					password : this.attrSource.password,
				}).then(res => {
					if(res.error_code == 500) {
						this.funcShowToast(res.error_msg || "")
						return
					} else {
						if(res.data.access_token) {
							uni.setStorageSync('Authorization', res.data.access_token || "")
							uni.setStorageSync('UserInfo', res.data.info || "")
							uni.switchTab({
								url : '../pageTabBar/work/work'
							})
						}
					}
				})
			},
			
			/**
			 * 找回密码
			 */
			funcRetrievePassword() {
				uni.navigateTo({
					url : './pageLoginRetrievePassword'
				})
			},
			
			/**
			 * 注册
			 */
			funcRegister() {
				uni.navigateTo({
					url : './pageLoginRegister'
				})
			},
			
			/**
			 * 更多选项
			 */
			funcMoreOptions() {
				
			}
		}
	}
</script>

<style scoped lang="less">
	uni-page-body {
		width: 100%;
		height: 100%; 
		background-color: white!important;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.container {
		background-color: white!important;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		width: 100%;
		align-items: center;
	}
	
	.accountAndPassword {
		width: 90%;
		left: 5%;
		margin-top: 100rpx;
	}
	
	.account {
		display: flex;
		background-color: #fff1f1;
		height: 100rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
	}
	
	.password {
		.account();
		margin-top: 20rpx;
	}
	
	.passwordLeft {
		display: flex;
		flex: 1;
	}
	
	.passwordRight {
		flex-shrink: 0;
	}
	
	.logo {
		height: 120rpx;
		width: 120rpx;
		display: flex;
	}
	
	.beforeIcon {
		width: 40rpx;
		height: 40rpx;
	}
	
	.loginButton {
		width: 90%;
		margin-top: 60rpx;
	}
	
	.inputValue {
		margin-left: 20rpx;
		flex: 1;
	}
	
	.buttonView {
		position: absolute;
		bottom: 20rpx;
		margin : 0 auto;
	}
	
	.clearance {
		margin: 0rpx 20rpx;
	}
</style>
