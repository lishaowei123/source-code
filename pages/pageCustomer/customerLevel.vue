<template>
	<view class="customerLevel">
		<text class="customerLevelText">客户级别</text>
		<text class="customerLevelValue" v-for="(item, index) in attrLevel":key="index" @click="funcSelectLevel(item)">{{ item.label || "" }}</text>
	</view>
</template>

<script>
	import EventBus from '../../common/bus.js'
	export default {
		data() {
			return {
				attrLevel : [{
					label : '无',
				 	value : '0'
				},{
					label : '重要客户',
					value : '1'
				},{
					label : '普通客户',
					value : '2'
				},{
					label : '小客户',
					value : '3'
				}]
			}
		},
		
		methods: {
			/**
			 * 获取选中等级
			 */
			funcSelectLevel(item) {
				EventBus.$emit("SELECTLEVEL", item)
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.customerLevel {
		width: 100%;
		background-color: white;
		min-height: 100rpx;
		padding: 30rpx;
		box-sizing: border-box;
		
	}
	
	.customerLevelText {
		font-size: 36rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.customerLevelValue {
		padding: 10rpx 20rpx;
		border-radius: 100rpx;
		background-color: #f8ebeb;
		margin-right: 10rpx;
	}

</style>
