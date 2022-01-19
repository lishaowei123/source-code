<template>
	<view class="container">
		<view class="">
			<template v-if="attrSource.length">
				<view class="cell" v-for="(item, index) in attrSource" :key="index" @click="funcClickIndex(index)">
					<view class="cellItem">
						<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
						<text>{{ item.admin && item.admin.name }}</text>
					</view>
					<view class="cellItem">
						<text class="grayPrice">¥ {{ item.price }}</text>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="empty">暂无数据</view>
			</template>
		</view>
	</view>
</template>

<script>
// API
import Api from '../../apis/apis.js';
// Mixins
import Mixins from '@/mixins/mixin.vue';
export default {
	mixins: [Mixins],
	data() {
		return {
			attrSource: {},
		};
	},
	
	onLoad(options) {
		const index = options.index
		const data = JSON.parse(uni.getStorageSync('expenseAnalysisDetail'))  
		this.attrSource = data[index] && data[index].data || []
		if(options.title) {
			uni.setNavigationBarTitle({
				title : options.title
			})
		}
	},

	methods: {
		
		/**
		 * 跳转到详情
		 */
		funcClickIndex(index) {
			
		},
		
		/**
		 * 
		 */
		funcPushDetail(type) {
			// uni.navigateTo({
			// 	url: `./expenseAnalysisDetail?type=${type}`
			// })
		},
	}
};
</script>

<style scoped lang="less">
.topBaseView {
	padding-top: 80rpx;
	background-color: white;
	padding: 20rpx 20rpx 20rpx 0rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.clearance {
	height: 20rpx;
	background-color: whitesmoke;
}

.price {
    color: #838316;
    font-size: 40rpx;
    width: 100%;
    background-color: white;
    display: inline-block;
    padding-left: 20rpx;
	height: 160rpx;
	display: flex;
	align-items: center;
}

.mainTitle {
	display: flex;
	align-items: flex-end;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	border-top: 20rpx solid #f5f5f5;
	width: 100%;
	line-height: 80rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.cell {
	padding: 10rpx 20rpx;
	box-sizing: border-box;
	background-color: white;
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
	display: flex;
	align-items: center;
    min-height: 120rpx;
}

.empty {
	color: #d5bfbf;
	width: 100%;
	height: 160rpx;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
}

.totalPrice {
	padding-left: 20rpx;
	font-size: 26rpx;
}

.grayPrice {
	color: gray; 
 }
 
 .all {
 	background-color: white;
 	display: flex;
 	justify-content: center;
 	align-items: center;
 	font-size: 24rpx;
 	padding: 20rpx;
 	box-sizing: border-box;
 }
 
 .cellItem {
	 display: flex;
	 justify-content: center;
	 align-items: center;
 }
 
 .icon {
 	width: 80rpx;
	margin-right: 20rpx;
 }
 
 .itemArrow {
 	transform: rotate(-90deg);
 	width: 36rpx;
 	height: 36rpx;
 }
</style>
