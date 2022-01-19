<template>
	<view class="container">
		<view class="personItem">
			<view class="personArrowItem" @click="funcSession">
				<text class="itemLabel">会话沟通</text>
				<view class="itemLevel">
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcAddress">
				<text class="itemLabel">外勤拜访</text>
				<view class="itemLevel">
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attrCustomerId : void 0
			}
		},
		
		onLoad(options) {
			this.attrCustomerId = options.id || void 0
		},

		methods: {
			/**
			 * 会话拜访
			 */
			funcSession() {
				uni.navigateTo({
					url: `../pageCommunication/communication?id=${this.attrCustomerId || ""}`
				})
			},
			
			/**
			 * 登录拜访
			 */
			funcAddress() {
				uni.navigateTo({
					url: './visitCreate'
				})
			},
		},
	}
</script>

<style lang="less">
	.container {
		width: 100%;
		background-color: white;
	}
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
	}
	
	.personArrowItem {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.itemArrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}
	
</style>
