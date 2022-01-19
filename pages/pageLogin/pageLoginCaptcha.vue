<template>
	<view class="container">
		<view class="captcha">
			<view class="captchaLeft">
				<image class="beforeIcon" src="../../static/logo.png" mode="widthFix"></image>
				<input class="inputValue" placeholder="请输入验证码" type="text" v-model="attrCaptcha" />
			</view>
			<text @click="funcSignGet">重新获取</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attrCaptcha : void 0
			}
		},
		
		onLoad(options) {
				
		},
		
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: './pageLoginCaptcha'
			});
		},
		
		methods: {
			/**
			 * 再次获取
			 */
			funcSignGet() {
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
	
	.captcha {
		display: flex;
		background-color: #fff1f1;
		height: 100rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		margin-top: 40rpx;
	}
	
	.captchaLeft {
		display: flex;
		flex: 1;
	}

	.beforeIcon {
		width: 40rpx;
		height: 40rpx;
	}
	
	.inputValue {
		margin-left: 20rpx;
		flex: 1;
	}
</style>
