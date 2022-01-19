<template>
	<view class="container">
		<view class="tipView">
			<text>客户信息</text>
		</view>
		
		<view class="customerAddBase" v-if="attrCustomerSource.name">
			<text>客户名称</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.name || ""}}</text>
			</view>
		</view>
		
		<view class="customerAddBase" v-if="attrCustomerSource.address">
			<text>客户地址</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.address }}</text>
			</view>
		</view>
		
		<view class="customerAddBase" v-if="attrCustomerSource.source">
			<text>客户来源</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.source }}</text>
			</view>
		</view>
		
		<view class="customerAddBase" v-if="attrCustomerSource.level">
			<text>客户级别</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.level && attrCustomerSource.level.name }}</text>
			</view>
		</view>
		
		<view class="customerAddBase" v-if="attrCustomerSource.created_at">
			<text>创建时间</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.created_at }}</text>
			</view>
		</view>
		
		<view class="" v-for="(item, index) in attrCustomerSource.contact" :key="index">
			
			<view class="tipView">
				<text>联系人信息{{index + 1}}</text>
			</view>
			
			<view class="customerAddBase">
				<text>姓名</text>
				<view class="customerAddBaseRight">
					<text class="customerAddBaseRightText">{{ item.realname }}</text>
				</view>
			</view>
			
			<view class="customerAddBase" v-if="item.phone">
				<text>电话1</text>
				<view class="customerAddBaseRight">
					<text class="customerAddBaseRightText">{{ item.phone }}</text>
					<image class="phone" src="/static/phone-lined.png" @click="funcClickPhone(item.phone)"></image>
				</view>
			</view>
			
			<view class="customerAddBase" v-if="item.phone2">
				<text>电话2</text>
				<view class="customerAddBaseRight">
					<text class="customerAddBaseRightText">{{ item.phone2 }}</text>
					<image class="phone" src="/static/phone-lined.png" @click="funcClickPhone(item.phone2)"></image>
				</view>
			</view>
			
			<view class="customerAddBase" v-if="item.phone3">
				<text>电话3</text>
				<view class="customerAddBaseRight">
					<text class="customerAddBaseRightText">{{ item.phone3 }}</text>
					<image class="phone" src="/static/phone-lined.png" @click="funcClickPhone(item.phone3)"></image>
				</view>
			</view>
		</view>
		
		<view class="tipView">
			<text>跟进人</text>
		</view>
		
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrCustomerSource.trackUsers" :key="index" @click="funcTouchItem(item, index)">
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	// API
	import Api from "../../apis/apis.js"
	// 事件处理 
	import EventBus from '../../common/bus.js'
	// 工具类
	import utils from '../../common/utils.js'
	
	import Mixins from '@/mixins/mixin'
	export default {
		mixins: [ Mixins ],
		data() {
			return {
				attrCustomerSource : {},
			}
		},
		
		onLoad(options) {
			let data = uni.getStorageSync('customerDetailSource') ? JSON.parse(uni.getStorageSync('customerDetailSource')) : {}
			this.attrCustomerSource = data || {}
		},
		
		methods: {
			/**
			 * 拨打电话
			 */
			funcClickPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.tipView {
		background-color: #f1f1f1;
		display: flex;
		align-items: center;
		height: 80rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.brforeLine {
		height: 30rpx;
		width: 8rpx;
		background-color: #7aa2df;
		margin-right: 10rpx;
	}
	
	.customerAddBase {
		height: 100rpx;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: white;
		box-sizing: border-box;
		align-items: center;
		border-bottom: 1rpx #eee9e9 solid;
	}
	
	.customerAddBaseRight {
		flex: 0.9;
		display: flex;
		align-items: center;
		// justify-content: end;
		justify-content: space-between;
	}
	
	.customerAddBaseRightText {
		text-align: right;
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
	
	.imageItemAdd {
		padding: 6rpx;
		box-sizing: border-box;
		border: 1rpx #e5dcdc dashed;
		width: 100rpx;
		height: 100rpx;
		border-radius: 5rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		background-color: white;
	}
	
	.itemLabel {
		
	}
	
	.iteminput {
		font-size: 28rpx;
		margin-left: 20rpx;
		flex: 1;
	}
	
	.attachment {
		width: 100%;
		display: inline-block;
		text-align: center;
		margin: 0 auto;
		margin-top: 40rpx;
	}
	
	.custom-picker-base-view {
		position: fixed;
		bottom: 0rpx;
	    background-color: white;
		z-index: 2;
	}
	
	.custom-picker-slot {
		width: 100%;
		height: 80rpx;
		display: flex;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		border-bottom: 1px #F5F5F5 solid;
	}
	
	.custom-picker-slot-cancel {
		color: #333333;
		font-size:26rpx;
		font-family:PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:34px;
	}
	
	.custom-picker-slot-confirm {
		.custom-picker-slot-cancel();
		color: #ff7145;
	}
	
	.pickerMask {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
	}
	
	.phone {
		width: 40rpx;
		height: 40rpx;
	}
	.trackingView {
			width: 100%;
			background-color: white;
			min-height: 150rpx;
			padding: 10px;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
	}
	
	.trackingItemView {
			 display: flex;
			 align-items: center;
			 flex-direction: column;
			 position: relative;
			 width: 20%;
	}
	
	.trackingItem {
			 height: 100rpx;
			 width: 100rpx;
			 border-radius: 50%;
			 background-color: green;
			 display: flex;
			 align-items: center;
			 justify-content: center;
			 color: white;
	}
	
	
</style>
