<template>
	<view class="container">
		<template v-if="attrType == 1">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem" v-for="(item, index) in attrSource" :key="index" @click="funcClickItem(item)">
					<view class="price">
						订单金额: ¥{{item.price || ""}}
					</view>
					<view class="person">客户: {{item.customer && item.customer.name || ""}}</view>
					<view class="person">订单编号: {{item.number|| ""}}</view>
					<view class="person">下单日期: {{item.order_date || ""}}</view>
					<view class="person">下单数量: {{item.order_goods_count || ""}}</view>
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
				<view class="baseViewItem2" v-for="(item, index) in attrSource" :key="index" @click="funcClickGoods(item)">
					<view class="">
						<view class="">{{item.goods && item.goods.name }} ({{item.goods_count || 0}})</view>
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
		
		<template v-if="attrType == 3">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem2" v-for="(item, index) in attrSource" :key="index" @click="funcClickCustomer(item)">
					<view class="">
						<view class="">{{item.name || ''}} ({{item.order_count || 0}})</view>
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
				attrSource: [],
				attrType: 1
			}
		},

		onLoad(options) {
			const key = options.key
			let data =  JSON.parse(uni.getStorageSync('goodsOrderList'))  
			this.attrSource = data[key] || []
			if(options.type) {
				this.attrType = options.type
			}
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title || ""
				})
			}
		},
		
		mounted() {
			
		},
		
		methods: {

			/**
			 * 跳转到详情
			 */
			funcClickItem(item) {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${item.id}`
				})
			},
			
			/**
			 * 跳转到商品详情
			 */
			funcClickGoods(item) {
				uni.navigateTo({
					url : `./goodsInfo?id=${item.good_id}`
				})
			},
			
			/**
			 * 跳转到客户列表
			 */
			funcClickCustomer(item) {
				const id = item.id
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${id}`
				})
			}
		},
		
	}
</script>

<style lang="less" scoped>

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
	
	.baseView {
		position: absolute;
		width: 100%;
		height: calc(100% - 120rpx);
		box-sizing: border-box;
		overflow: auto;
	}
	
	.baseViewItem {
		background-color: white;
		min-height: 60rpx;
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
	
	.price {
		color: #d1701b;
	}
	
</style>
