<template>
	<view class="container">
		<view class="expenseHeaderBase">
			<view class="expenseHeader">
				<view :class="['expenseItem', attrSelectIndex == 1 ? 'expenseItemSelect' : '' ]" @click="funcClickIndex(1)">{{attrButtons[0]}}</view>
				<view :class="['expenseItem', attrSelectIndex == 2 ? 'expenseItemSelect' : '' ]" @click="funcClickIndex(2)">{{attrButtons[1]}}</view>
			</view>
		</view>
		
		<template v-if="attrType == 1">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem" v-for="(item, index) in attrSource" :key="index" @click="funcClickItem(item)">
					<view class="">
						订单金额: ¥{{item.price || ""}}
					</view>
					<view class="person">客户: {{item.customer && item.customer.name || ""}}</view>
					<view class="person">下单日期: {{item.order_date || ""}}</view>
					<view class="person">订单编号: {{item.number|| ""}}</view>
					<view class="person">归属人: {{item.admin && item.admin.name || ""}}</view>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 2">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem2" v-for="(item, index) in attrSource" :key="index" @click="funcClickOrder(item)">
					<view class="">
						<view class="">{{item.name || ""}}</view>
						<view class="person">成交{{item.people_count || 0}}次, 金额¥{{item.order_price || 0}}</view>
					</view>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
					
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				attrButtons : ['最新创建', '最高金额'],
				attrSource: [],
				attrSelectIndex: 1,
				attrType: 1
			}
		},

		onLoad(options) {
			const key = options.key
			let data =  JSON.parse(uni.getStorageSync('orderAnalysisList'))  
			this.attrSource = data[key] || []
			if(options.type) {
				this.attrType = options.type
				if(this.attrType == 2) {
					this.attrButtons = ['最多成交次数', '最高成交金额']
				}
			}
			
		},
		
		mounted() {
			
		},
		
		methods: {
			/**
			 * 店家索引
			 */
			funcClickIndex(index) {
				this.attrSelectIndex = index
			},
			
			/**
			 * 跳转到详情
			 */
			funcClickItem(item) {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${item.id}`
				})
			},
			
			/**
			 * 跳转到客户详情
			 */
			funcClickOrder(item) {
				uni.setStorageSync('orderPeopleList', JSON.stringify(item.order_data))
				uni.navigateTo({
					url : `../pageOrder/orderAnalysisOrder?key=order_data&title=${item.name}`
				})
			},
		},
		
	}
</script>

<style lang="less" scoped>
	
	.expenseHeader {
		display: flex;
		width: 400rpx;
		height: 70rpx;
		border: 1rpx #ea7e06 solid;
		margin: 0 auto;
		border-radius: 4rpx;
		background-color: white;
		color: #ea7e06;
	}
	
	.expenseItem {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}
	
	.expenseItemSelect {
		background-color: #ea7e06;
		color: white
	}
	
	.expenseHeaderBase {
		width: 100%;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.baseView {
		position: absolute;
		width: 100%;
		height: calc(100% - 120rpx);
		box-sizing: border-box;
		overflow: auto;
	}
	
	.baseViewItem {
		background-color: white;
		min-height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 4rpx;
		padding: 20rpx 20rpx;
	}
	
	.baseViewItem2 {
		.baseViewItem();
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.person {
		font-size: 24rpx;
		color: #a79f9f;
	}
	
	.emptyBaseView {
		.baseView();
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.itemArrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}
	
</style>
