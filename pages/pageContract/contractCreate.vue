<template>
	<view class="container">
		<view class="tipView">
			<text class="brforeLine"></text>
			<text>对应订单信息</text>
		</view>
		
		<view class="customerAddBase" @click="funcSelectCustomer">
			<text>客户名称</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCustomerSource.name || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="customerAddBase" @click="funcSelectOrder">
			<text>对应订单</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ this.attrCustomerOrderSource.number }}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="tipView">
			<text class="brforeLine"></text>
			<text>合同信息</text>
		</view>
		
		<view class="personItem">
			<text class="itemLabel">合同标题</text>
			<input class="iteminput" type="text" v-model="attrContarctSource.title" placeholder="请输入合同标题(必填)" />
		</view>
		
		<view class="personItem">
			<text class="itemLabel">合同编号</text>
			<input class="iteminput" type="text" v-model="attrContarctSource.number" placeholder="请输入合同编号" />
		</view>
		
		<view class="customerAddBase" @click="funcSelectStartDate">
			<text>开始时间</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrContarctSource.start_date || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="customerAddBase" @click="funcSelectEndDate">
			<text>结束时间</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrContarctSource.end_date || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="personItem">
			<text class="itemLabel">合同备注</text>
			<input class="iteminput" type="text" v-model="attrContarctSource.remark" placeholder="请输入合同备注" />
		</view>
		
		<view class="trackingView">
			<view class="imageBaseView">
				<image class="imageItem" v-for="(item, index) in attrContractImage" :key="index" :src="item" mode='aspectFill' />
				<view class="imageItemAdd" @click="funcGetPhotoImages">
					<image src="../../static/jia.jpg" mode="widthFix"></image>
				</view>
			</view>
		</view>
		
		<text v-if="false" class="attachment" @click="funcAddAttachment">添加附件</text>
		
		<view class="pickerMask" v-if="attrShowPicker">
			<view class="custom-picker-base-view">
				<custom-priker-view :range="['2018-01-01', '2025-12-31']" 
					:select="attrDate" 
					@confrim="funcChangeDate" 
					@cancel="funcShowPicker"
				>
				<!-- #ifndef APP-PLUS -->
					<view class="custom-picker-slot">
						<view class="custom-picker-slot-cancel">取消</view>
						<text class="custom-picker-slot-confirm">确定</text>
					</view>
				<!-- #endif -->
				</custom-priker-view>
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
	// 自定义选择时间组件
	import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
	import Mixins from '@/mixins/mixin'
	export default {
		mixins: [ Mixins ],
		data() {
			const currentDate = utils.funcGetDate()
			return {
				attrId : void 0,
				attrSelectPicker : 1,
				attrDate : currentDate,
				attrShowPicker : false,
				attrCustomerSource : {},
				attrCustomerOrderSource : {},
				attrContractImage : [],
				attrContarctSource : {
					start_date : '',
					end_date : '',
					remark : '',
					title : '',
					number : '',
					customer_id : ''
				}
			}
		},
		
		onLoad(options) {
			uni.setNavigationBarTitle({
				title : options.title
			})
			if(options.id) {
				this.attrId = options.id
				this.funcGetDetail()
			}
		},
		
		components: {
			CustomPrikerView	
		},
		
		mounted() {
			/**
			 * 获取选中的用户等级
			 */
			EventBus.$on('SELECTCUSTOMER', (e) => {
				this.attrCustomerSource = e
			})
			
			/**
			 * 获取到用户点击的订单
			 */
			EventBus.$on('SELECTCUTOMERORDER', (e) => {
				this.attrCustomerOrderSource = e
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			this.funcCreateCustomer()
		},
		
		/**
		 * 返回
		 */
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
			 * 开始时间
			 */
			funcSelectStartDate() {
				this.attrSelectPickerType = 1
				this.funcShowPicker()
			},
			
			/**
			 * 结束时间
			 */
			funcSelectEndDate() {
				this.attrSelectPickerType = 2
				this.funcShowPicker()
			},
			
			/**
			 * 显隐pciker
			 */
			funcShowPicker() {
				this.attrShowPicker = !this.attrShowPicker
			},
			
			/**
			 * 获取详情
			 */
			funcGetDetail() {
				Api.getOrderContractsDetail({
					id : this.attrId
				}).then(res => {
					const data = res.data
					if(res.data.images) {
						this.attrContractImage = JSON.parse(res.data.images)
					} 
					this.attrCustomerOrderSource = data.order
					this.attrCustomerSource = data.order.customer || {}
					this.attrContarctSource = {
						start_date : data.start_date,
						end_date : data.end_date,
						remark : data.remark,
						title : data.title,
						number : data.number,
						order_id : data.order_id,
						customer_id : data.customer_id
					}
				})
			},
			
			/**
			 * 确定日期
			 */
			funcChangeDate(res) {
				this.funcShowPicker()
				this.attrDate = res.date
				if(this.attrSelectPickerType == 1) {
					this.attrContarctSource.start_date = this.attrDate || ''
				} else {
					this.attrContarctSource.end_date = this.attrDate || ''
				}
			},
			
			/**
			 * 选择时间
			 */
			funcSelectPicker() {
				this.funcShowPicker()
			},
			
			/**
			 * 添加附件
			 */
			funcAddAttachment() {
					
			},
			
			/**
			 * 获取相册
			 */
			funcGetPhotoImages() {
				this.funcGetPhoto((data) => {
					this.attrContractImage = this.attrContractImage.concat(data)
				})
			},
			
			/**
			 * 创建合同
			 */
			funcCreateCustomer() {
				const params = {
					id: this.attrId || "",
					customer_id	: this.attrCustomerSource.id,
					order_id : this.attrCustomerOrderSource.id,
					title:this.attrContarctSource.title,
					number:this.attrContarctSource.number,	
					start_date:this.attrContarctSource.start_date,	
					end_date:this.attrContarctSource.end_date,	
					remark:this.attrContarctSource.remark,	
					images: JSON.stringify(this.attrContractImage)
				}
				
				if(!params.customer_id) {
					this.funcShowToast('请选择客户')
					return
				}
				if(!params.order_id) {
					this.funcShowToast('请选择订单')
					return
				}
				if(!params.title) {
					this.funcShowToast('请输入合同标题')
					return
				}
				let apistring = 'createOrderContracts'
				if(this.attrId) {
					apistring = 'updateOrderContracts'
				}
				Api[apistring](params).then((res) => {
					if(res.error_code == 0) {
						uni.navigateBack()
					} else {
						uni.showToast({
							title : res.error_msg || "失败",
							icon : 'none'
						})
					}
				})
			},
			
			/**
			 * 选择客户
			 */
			funcSelectCustomer() {
				uni.navigateTo({
					url: '../pageCustomer/customerList'
				})
			},
			
			/**
			 * 选择订单
			 */
			funcSelectOrder() {
				if(!this.attrCustomerSource.id) {
					uni.showToast({
						title : '请选择客户',
						icon : 'none'
					})
					return
				}
				uni.navigateTo({
					url : `../pageOrder/orderCorresponding?id=${this.attrCustomerSource.id}`
				})
			},
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
	
	
</style>
