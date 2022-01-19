<template>
	<view class="generalTipBaseView" @click="funcTouch">
		<text class="generalTipBaseViewText">{{ title || "" }}</text> 
		<uni-icons type="arrowright"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			title : {
				type: String,
				default: ""
			}
		},
		methods: {
			/**
			 * 点击事件
			 */
			funcTouch() {
				this.$emit("click")
			}
		}
	}
</script>

<style scoped>
	
	.generalTipBaseView {
		width: 100%;
		height: 80rpx;
		font-size: 30rpx;
		line-height: 80rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		padding: 0px 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #ffeaea solid;
		/* z-index: 100; */
		/* position: relative; */
	}
	
	.generalTipBaseViewText {
		width: 100%;
		font-size: 30rpx;
	}

</style>
