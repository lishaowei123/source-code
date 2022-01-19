<template>
	<view class="addSessionBaseView">
		<view class="costomerBorderWidth"></view>
		<view class="customerAddBase" @click="funcSelectCustomer" v-if="!attrCustomerId">
			<text>客户名称</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerName || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="uni-textarea" style="minHeight : 200rpx">
			<textarea placeholder="请输入沟通记录" :style="{minHeight: '200rpx'}" v-model="attrTextContent" auto-height maxlength=-1 />
		</view>
		
		<view class="imageBaseView">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item" mode='aspectFill' />
			<view class="imageItemAdd" @click="funcGetPhotoImages">
				<image src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
		</view>
		<view class="costomerBorderWidth"></view>
		<view class="customerAddBase" @click="funcSelectCustomer" v-if="false">
			<text>下次回访提醒</text>
			<view class="">
				<text class="customerAddBaseRightText">选填</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
			
	</view>
</template>

<script>
	// 工具类
	import utils from '../../common/utils.js'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	// Mixins
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins : [Mixins],
		data() {
			return {
				attrTextContent : '',
				attrCustomerName : '',
				attrCustomerSource : {},
				attrImageList : [],
				attrCustomerId : void 0
			}
		},
		
		
		onLoad(options) {
			this.attrCustomerId = options.id || void 0
		},
		
		mounted() {
			EventBus.$on('SELECTCUSTOMER', (e) => {
				this.attrCustomerSource = e
				this.attrCustomerName = e.name
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			Api.createCustomerFollows({
				customer_id	: this.attrCustomerSource.id || this.attrCustomerId,
				record: this.attrTextContent || "",
				visit_date : '',	
				images	: JSON.stringify(this.attrImageList),
				type : 1
			}).then(res => {
				if(res.error_code == 0) {
					uni.navigateBack({
						delta:2
					})
				} else {
					uni.showToast({
						title : res.error_msg || "失败",
						icon : 'none'
					})
				}
			})
		},
		
		// 页面周期与 onLoad 同级
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.showModal({
					title: '是否取消创建',
					content: '',
					cancelText: "取消", 
					confirmText: "确定", 
					showCancel: true, 
					confirmColor: '#f55850',
					cancelColor: '#39B54A', 
					success: function (res) {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							});
						} 
					}
				});
				return true; 
			}
		},
		
		methods: {
			/**
			 * 选择客户
			 */
			funcSelectCustomer() {
				uni.navigateTo({
					url : '../pageCustomer/customerList'
				})
			},

			/**
			 * 获取相册
			 */
			funcGetPhotoImages() {
				this.funcGetPhoto((data) => {
					this.attrImageList = this.attrImageList.concat(data)
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.addSessionBaseView {
		box-sizing: border-box;
		width: 100%;
		background-color: white;
	}
	
	.customerAddBase {
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.costomerBorderWidth {
		border-top: 20rpx #F5F5F5 solid;;
	}
	
	.customerAddBaseRight {
		flex: 0.9;
		display: flex;
		align-items: center;
		justify-content: flex-end;
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
	
</style>
