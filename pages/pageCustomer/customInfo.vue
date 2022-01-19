<template>
	<view class="customInfoView">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="357"
			:y="-10" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="header">
			<view class="headerTop" @click="funcPushCustomDetail">
				<text class="title">{{ attrSource.name || "" }}</text>
				<view class="titleArrow">
					<text class="titleDetail">详情</text>
					<uni-icons type="arrowright" color="white"></uni-icons>
				</view>
			</view>
			<view class="topView">
				<text>客户联系人：{{ attrSource.names }}</text>
				<text>最后跟进时间： {{ attrSource.updated_at }} </text>
				<text>成交状态：{{ attrSource.status || '无' }}</text>
				<text>跟进人：{{ attrSource.users || "" }}</text>
			</view>
		</view>
		<view class="content">
			<view class="contentItem" v-for="(item, index) in attrCenterSource" :key="index" @click="funcClickItem(item, index)">
				<view class="contentItemValue">
					{{item.value}}
				</view>
				<view class="">
					{{item.label}}
				</view>
			</view>
		</view>
		<view class="record">
			跟进记录
		</view>
		<view v-for="(item, idx) in attrRecordSource" :key="idx" class="visitRecordItem" @click="funcPushDetail(item)">
			<custom-record-cell :source="item" />
		</view>
		
		<view class="noRecord" v-if="!attrRecordSource.length">
			暂无跟进记录
		</view>
		
		<view class="addRecord" @click="funcAddRecord">添加跟进记录+</view>
	</view>
</template>

<script>
	const userInfo = uni.getStorageSync('UserInfo')	
	// API
	import Api from "../../apis/apis.js"
	// mixin
	import Mixins from '../../mixins/mixin.vue'
	// 自定义cell
	import CustomRecordCell from '@/components/custom-record-item/custom-record-item.vue'
	// 工具类
	import utils from '@/common/utils.js'
	export default {
		mixins: [ Mixins ],
		data() {
			return {
				attrShowPopUp: false,
				attrPopUpDataSource: [{
					icon: '',
					title: '编辑客户',
					index: 0
				},{
					icon: '',
					title: '删除客户',
					index: 1
				},{
					icon: '',
					title: '修改跟进人',
					index: 2
				}],
				attrCustomerId : void 0,
				attrSource : {},
				attrRecordSource : [],
				attrCenterSource : [{
					label : '销售订单',
					value : '0',
					key : 'order_count_data'
				},{
					label : '报销',
					value : '0',
					key : 'order_single_data'
				},{
					label : '任务',
					value : '0',
					key : 'task_count_data'
				},{
					label : '回款',
					value : '0',
					key : 'payment_order_count_data'
				},{
					label : '合同',
					value : '0',
					key : 'order_contracts_data'
				},{
					label : '购买的商品',
					value : '0',
					key : 'order_goods_data'
				}]
			}
		},
		
		components: {
			CustomRecordCell
		},
		
		onLoad(options) {
			this.attrCustomerId = options.id || ""
		},
		
		onShow() {
			this.funcGetCustomerDetail()
		},

		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			this.attrShowPopUp = true
		},
		
		destroyed() {
			uni.removeStorageSync('customerDetailSource')
		},
		
		methods: {
			/**
			 * 点击popup-item
			 */
			funcTapPopup(e) {
				const self = this;
				if(self.attrSource.admin_id != userInfo.id) {
					uni.showToast({
						title : '只能修改自己的客户',
						icon: 'none'
					})
					return
				}
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url : `./customerCreate?id=${this.attrCustomerId}&title=编辑客户`
						})
						break;
					case 1:
						uni.showModal({
							title: '确定删除吗？',
							content: '',
							cancelText: "取消", 
							confirmText: "确定", 
							showCancel: true, 
							confirmColor: '#f55850',
							cancelColor: '#39B54A', 
							success: function (res) {
								if (res.confirm) {
									self.funcDeleteCustomer()
								} 
							}
						})
						break;
					case 2:
						uni.navigateTo({
							url : `./customerCreate?id=${this.attrCustomerId}&title=编辑客户`
						})
						break;
					default:
						break;
				}
			},
			
			/**
			 * 点击item
			 */
			funcClickItem(item, index) {
				uni.navigateTo({
					url : `./customerOrder?title=${item.label}&key=${item.key}&type=${index + 1}`
				})
			},
			
			/**
			 * 删除客户
			 */
			funcDeleteCustomer() {
				Api.deleteCustomersDetail({
					id : this.attrCustomerId
				}).then(res => {
					if(res.error_code == 0) {
						this.funcShowToast('删除成功')
						utils.funcDelay(1000, () => {
							uni.navigateBack()
						})
					} else {
						this.funcShowToast('删除失败')
					}
				})
			},
			
			/**
			 * 获取客户详情
			 */
			funcGetCustomerDetail() {
				Api.getCustomersDetail({
					id : this.attrCustomerId
				}).then(res => {
					if(res.error_code == 0) {
						let data = res.data || {}
						let names = [], users = []
						data.contact && data.contact.map((item, index) => {
							names.push(item.realname)
						})
						data.users && data.users.map((item, index) => {
							users.push(item.name)
						})
						data.trackUsers = data.users
						data.users = users.join("、")
						data.names = names.join("、")
						this.attrRecordSource = data.customer_follows || []
						this.attrSource = data
						if(data.admin_id != userInfo.id) {
							// #ifdef APP-PLUS
								const webView = this.$scope.$getAppWebview()
								webView.setTitleNViewButtonStyle(0, {
									width: '0'
								});
							// #endif 
						}
						this.attrCenterSource = [{
							label : '销售订单',
							value : data.order_count || 0,
							key : 'order_count_data',
						},{
							label : '报销',
							value : data.order_single_count || 0,
							key : 'order_single_data',
						},{
							label : '任务',
							value : data.task_count || 0,
							key : 'task_count_data',
						},{
							label : '回款',
							value : data.payment_order_count || 0,
							key : 'payment_order_count_data',
						},{
							label : '合同',
							value : data.order_contracts || 0,
							key : 'order_contracts_data',
						},{
							label : '购买的商品',
							value : data.order_goods || 0,
							key : 'order_goods_data',
						}]
						uni.setStorageSync('customerDetailSource', JSON.stringify(res.data))
					} else {
						this.funcShowToast('失败')
					}
				})
			},
			
			/**
			 * 进入客户详情
			 */
			funcPushCustomDetail() {
				uni.navigateTo({
					url : `./customerDetail`
				})
			},
			
			/**
			 * 进入详情
			 */
			funcPushDetail(item) {
				uni.navigateTo({
					url: `../pageVisit/visitDetail?type=2&title=外勤拜访详情&id=${item.id}`
				})
			},
			
			/**
			 * 添加跟进记录
			 */
			funcAddRecord() {
				uni.navigateTo({
					url: `../pageVisit/visitWay?id=${this.attrSource.id}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	
	.customInfoView {
		width: 100%;
		height: 100%;
	}
	
	.header {
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #6161b8;
		width: 100%;
		font-size: 22rpx;
		color: white;
		height: 400rpx;
		position: relative;
	}
		
	.content {
		width: 96%;
		background-color: white;
		left: 2%;
		margin-top: -50px;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		border-radius: 10rpx;
	}
	
	.title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.topView {
		display: flex;
		flex-direction: column;
	}
	
	.record {
		width: 100%;
		height: 100rpx;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
		border-top: 20rpx #efeff4 solid;
	}
	
	.visitRecordItem {
		display: flex;
		justify-content: space-between;
		background-color: white;
		border-bottom: 1rpx #f4eded solid;
	}
	
	.addRecord {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #5959e1;
		font-weight: 600;
	}
	
	.noRecord {
		height: 600rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #c3abab;
		background-color: white;
	}
	
	.contentItem {
		display: flex;
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 160rpx;
	}
	
	.contentItemValue {
		color: #44448d;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.headerTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.titleArrow {
		display: flex;
		align-items: center;
	}
	
	.titleDetail {
		font-size: 28rpx;
	}
</style>
