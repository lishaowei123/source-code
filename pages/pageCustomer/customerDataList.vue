<template>
	<view class="">
		<view class="blueBase"></view>
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
			let data = uni.getStorageSync('customerData') ? JSON.parse(uni.getStorageSync('customerData')) : {}
			if(!Object.keys(data).length) { 
				data = JSON.parse(uni.getStorageSync('customerDetailSource'))
			}
			this.attrSource = data[key]
			console.log(options);
			uni.setNavigationBarTitle({
				title : options.title || "客户"
			})
		},

		methods: {
			/**
			 * 跳转到客户详情
			 */
			funcClickItem(item) {
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${item.id}`
				})
			} 
		},
		
	}
</script>

<style lang="less" scoped>
	
	.blueBase {
		width: 100%;
		height: 300rpx;
		background-color: #7676c4;
	}
	
	.baseView {
		position: absolute;
		top: 30rpx;
		width: 96%;
		height: 96%;
		background-color: white;
		left: 2%;
		border-radius: 10rpx;
		padding: 20rpx;
		box-sizing: border-box;
		overflow: auto;
	}
	
	.baseViewItem {
		height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-bottom: 1rpx #f6eaea solid;
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
	
</style>
