<template>
	<view class="container">
		<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushOrderInfo(item)">
			<view class="soucteItemLeft">
				<view class="soucteItemLeftBox">
					<text class="label">订单金额</text>
					<text class="value">：{{ item.price }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">客户</text>
					<text class="value">：{{ item.customer && item.customer.name }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">下单日期</text>
					<text class="value">：{{item.order_date }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">订单编号</text>
					<text class="value">：{{item.number }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">归属人</text>
					<text class="value">：{{item.admin && item.admin.name }}</text>
				</view>
			
			</view>
			<view class="soucteItemRight">
				<text style="color:#FFA200" v-if="item.status == 0">待确认</text>
				<text v-if="item.status == 1">已确认</text>
				<text v-if="item.status == 2">已驳回</text>
				<text v-if="item.status == 3">已撤销</text>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				attrSource : []
			}
		},
		
		onLoad(options) {
			const key = options.key
			this.attrSource = JSON.parse(uni.getStorageSync('orderPeopleList'))  
			uni.setNavigationBarTitle({
				title : options.title || ""
			})
		},
		
		destroyed() {
			uni.removeStorageSync('orderPeopleList')
		},
		
		methods: {
			/**
			 * 跳转到订单详情
			 */
			funcPushOrderInfo(item) {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${item.id}`
				})
			},
			
			
		},
		
	}
</script>

<style lang="less" scoped>
	.soucteItem {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
	.label {
		display: inline-block;
		width: 120rpx;
		text-align-last: justify;
	}
	
	.soucteItemLeft {
		font-size: 26rpx;
	}
	
	.soucteItemRight {
		font-size: 24rpx;
	}
	
	.person {
		font-size: 24rpx;
		color: #a79f9f;
	}
</style>
