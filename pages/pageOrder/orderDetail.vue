<template>
	<view class="createPersonBaseView">
		<view class="header"></view>
		
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">订单金额</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.price }}</text>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">订单编号</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.number }}</text>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectCustomer">
				<text class="itemLabel">客户名称</text>
				<view class="itemLevel">
					<text class="itemLevelText" style="color:#007aff">{{ attrSource.customer && attrSource.customer.name }}</text>
					<!-- <uni-icons type="arrowright"></uni-icons> -->
				</view>
			</view>
		</view>

		
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">下单日期</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.order_date }}</text>
				</view>
			</view>
		</view>

		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">归属人</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.admin && attrSource.admin.name }}</text>
				</view>
			</view>
		</view>
		
		<view class="header"></view>
		
		<view class="personItem">
			<text class="itemLabel">备注</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.customer && attrSource.customer.remark" />
		</view>
		
		<view class="header"></view>
		
		<view class="imageBaseView">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item"
				mode='aspectFill' 
			/>
		</view>
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">审批信息</text>
			</view>
		</view>
		
		<customAppval-component :source="attrSource.examines" :originSource="attrSource" />
		
	</view>
</template>

<script>
	import CustomAppvalComponent from '@/components/custom-appval.vue'
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrSource: {},
				attrId: void 0,
				attrImageList: []
			}
		},
		
		components: {
			CustomAppvalComponent
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
				this.funcGetOrdersDetail()
			}
		},
		
		methods: {
			/**
			 * 获取订单详情
			 */
			funcGetOrdersDetail() {
				Api.getOrdersDetail({
					id : this.attrId
				}).then(res => {
					if (res.error_code == 0) {
						this.attrSource = res.data
						if(this.attrSource.images) {
							if(this.attrSource.images instanceof Array) {
								this.attrImageList = this.attrSource.images 
							} else {
								this.attrImageList = JSON.parse(this.attrSource.images)
							}
						}
					} else {
						this.funcShowToast('获取失败');
					}
				});
			},
			
	
			/**
			 * 选择客户
			 */
			funcSelectCustomer() {
				const id = this.attrSource.customer.id
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${id}`
				})
			},

		}
	}
</script>

<style scoped lang="less">
	.createPersonBaseView {
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: white;
		
	}
	
	.header1 {
		width: 100%;
		background-color: #F0EFF3;
		height:100rpx;
		min-height:100rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 20rpx;
		.delete {
			font-size: 26rpx;
			color: #2b2ba5;
		}
	}
	
	.header {
		width: 100%;
		background-color: #F0EFF3;
		height:20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
	}
	
	.itemLabel {
		
	}
	
	.iteminput {
		font-size: 28rpx;
		margin-left: 20rpx;
		flex: 1;
		text-align: right;
	}
	
	.personArrowItem {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.imageBaseView {
		display: flex;
		flex-wrap: wrap;
		padding: 0rpx 20rpx 20rpx 20rpx;
		background-color: white;
		border-bottom: 20rpx #f1f1f1 solid;
		margin-top: 40rpx;
	}
	
	
	.imageItem {
		width: 100rpx;
		height: 100rpx;
		border-radius: 5rpx;
		margin-right: 18rpx;
		margin-top: 10rpx;
	}
	
	

</style>
