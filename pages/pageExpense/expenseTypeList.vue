<template>
	<view class="baseView">
		<view class="item" v-for="(item, index) in attrTypeList" :key="index" @click="funcTouchType(item)">
			<image class="icon" :src="item.icon" mode="heightFix"></image>
			<text class="iconName">{{ item.title }}</text>
		</view>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins: [Mixins],
		data() {
			return {
				
			}
		},
		
		onLoad(options) {
			
		},
		
		methods: {
			/**
			 * 点击类型
			 */
			funcTouchType(item) {
				EventBus.$emit("SELECTCONSUMPTIONTYPE", item)
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="less" scoped>
	.baseView {
		display: flex;
		flex-wrap: wrap;
	}
	
	.item {
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: white;
		padding: 20rpx 10rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		border: 1rpx #f8f8f8 solid;
	}
	
	.icon {
		height: 80rpx;
	}
	
	.iconName {
		margin-top: 10rpx;
	}
</style>
