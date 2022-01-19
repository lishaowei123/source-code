<template>
	<view class="goodsStatusBaseView">
		<view class="goodsStatusItem" v-for="(item, index) in attrStatus" :key="index" @click="funcSelectGoodsStatus(item)">
			{{ item.label || "" }}
			<!-- #ifndef APP-PLUS -->
				<span v-show="attrSelectIndex == item.status" class="iconfont icon-duihao"></span>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
				<text v-show="attrSelectIndex == item.status">✔️</text>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	export default {
		data() {
			return {
				attrStatus:  [{
					label : '上架中',
					status : 1
				}, {
					label : '下架中',
					status : 0
				}],
				attrSelectIndex : -1
			}
		},
		
		onLoad(options) {
			if(options.status) {
				this.attrSelectIndex = options.status 
			}
		},
		
		methods: {
			/**
			 * 选择商品
			 */
			funcSelectGoodsStatus(item) {
				EventBus.$emit('SELECTGOODSSTSATUS', item)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="less">
	.goodsStatusBaseView {
		width: 100%;
	}
	
	.goodsStatusItem {
		border-top: 1rpx #CCCCCC solid;
		height: 80rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		align-items: center;
		font-size: 26rpx;
		background-color: white;
	}
</style>
