<template>
	<view class="container">
		<template v-if="attrType == 1">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem" v-for="(item, index) in attrSource" :key="index" @click="funcClickItem(item)">
					<view class="">
						{{item.name || ""}}
					</view>
					<view class="person">
						跟进人: {{item.admin && item.admin.name || ""}}
					</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attrSource : [],
				attrType : 1
			}
		},
		
		onLoad(options) {
			const key = options.key
			const index = options.index
			this.attrType = options.type
			const data = JSON.parse(uni.getStorageSync('customerData')) 
			this.attrSource = data[key] && data[key][index] && data[key][index].data || []
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title || ""
				})
			}
		},
		
		methods: {
			/**
			 * 跳转到客户详情
			 */
			funcClickItem(item) {
				let _id = this.attrType == 1 ? item.id : item.customer.id
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${_id}`
				})
			} 
		},
	}
</script>

<style lang="less" scoped>
	uni-page-body {
		background-color: white!important;
	}
	.container {
		width: 100%;
		height: 100%;
		background-color: white;
	}
	.baseView {
		width: 100%;
		height: 100%;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
		overflow: auto;
	}
	
	.baseViewItem {
		min-height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-bottom: 1rpx #f6eaea solid;
		padding: 20rpx 0rpx;
	}
	
	.person {
		font-size: 24rpx;
		color: #a79f9f;
	}
	
	.emptyBaseView {
		.baseView();
		height: 1100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
