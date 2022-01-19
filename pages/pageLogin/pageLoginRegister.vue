<template>
	<view class="container">
		<text>新用户注册</text>
		<view class="accountAndPassword">
			<view class="account">
				<image class="beforeIcon" src="../../static/logo.png" mode="widthFix"></image>
				<input class="inputValue" type="number" maxlength="11" v-model="attrMobile" placeholder="请输入手机号码" />
			</view>
		</view>
		<button class="loginButton" type="primary" @click="funcNext">下一步</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attrMobile : void 0
			}
		},
		
		onLoad(options) {
				
		},
		
		methods: {
			/**
			 * 下一步
			 */
			funcNext() {
				console.log(this.attrMobile);
			}
		}
	}
</script>

<style scoped lang="less">
	uni-page-body {
		width: 100%;
		height: 100%; 
		background-color: white!important;
	}
	
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
	}
	
	.accountAndPassword {
		width: 100%;
		margin-top: 40rpx;
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
	
	.beforeIcon {
		width: 40rpx;
		height: 40rpx;
	}
	
	.inputValue {
		margin-left: 20rpx;
		flex: 1;
	}
	
	.loginButton {
		width: 100%;
		margin-top: 60rpx;
	}
</style>
