<template>
	<view class="container">
		<view class="personItem">
			<view class="personArrowItem" @click="funcPushSet">
				<text class="itemLabel">审批设置</text>
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
				
			}
		},
		
		methods: {
			/**
			 * 跳转到审批设置
			 */
			funcPushSet() {
				uni.navigateTo({
					url : './pageApprovalCreate'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.personArrowItem {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.personItem {
		background-color: white;
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		border-top: 20rpx #eee9e9 solid;
	}
	
	.itemLabel {
		
	}
	
	.iteminput {
		font-size: 28rpx;
		margin-left: 20rpx;
		flex: 1;
	}
	
	.phoneItems {
		flex:1;
		display: flex;
		justify-content: space-between;
		margin-left: 20rpx;
	}
	.itemArrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}

	 .itemLevel{
		 display: flex;
		 align-items: center;
	 }
</style>
