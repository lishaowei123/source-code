<template>
	<view class="container">
		<text class="mainTitle">对应的订单信息</text>

		<view class="createItem">
			<view class="item" @click="funcGetCustomerInfo">
				<text class="label">客户名称</text>
				<view class="valueBox">
					<text class="value">{{ attrCustomerSource && attrCustomerSource.name }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="createItem">
			<view class="item" @click="funcGetCustomOrder">
				<text class="label">对应订单</text>
				<view class="valueBox">
					<text class="value">{{ attrCustomerOrderSource && attrCustomerOrderSource.number }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<text class="mainTitle">回款信息</text>

		<view class="createItem">
			<text class="itemLabel">回款金额</text>
			<input class="itemInput" v-model="attrBaseSource.price" type="number" placeholder="请输入金额" />
		</view>

		<view class="createItem">
			<view class="item" @click="funcGetDate">
				<text class="label">回款日期</text>
				<view class="valueBox">
					<text class="value">{{ attrBaseSource.date }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="createItem">
			<view class="item" @click="funcGetWay">
				<text class="label">回款方式</text>
				<view class="valueBox">
					<text class="value">{{ attrPayTypes.name }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="createItem">
			<view class="item" @click="funcGetBelonging">
				<text class="label">归属人</text>
				<view class="valueBox">
					<text class="value">{{ attrTrackPeople.name }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="createItem noteBox">
			<text class="itemLabel">备注</text>
			<textarea class="itemTextarea" v-model="attrBaseSource.remark" placeholder="请输入备注" auto-height maxlength="-1" />
		</view>

		<view class="trackingView">
			<view class="imageBaseView">
				<image class="imageItem" v-for="(item, index) in attrCredentials" :key="index" :src="item" mode='aspectFill' />
				<view class="imageItemAdd" @click="funcGetPhotoImages">
					<image src="../../static/up.jpg" mode="widthFix"></image>
				</view>
			</view>
		</view>

		<view class="custom-picker-base-view" v-if="attrShowPicker">
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
</template>

<script>
// 工具类
import utils from '../../common/utils.js';
// 事件处理
import EventBus from '../../common/bus.js'
// 自定义选择时间组件
import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
// API
import Api from "../../apis/apis.js"
// Mixins
import Mixins from '@/mixins/mixin.vue'
export default {
	mixins : [Mixins],
	data() {
		const currentDate = utils.funcGetDate()
		return {
			attrId: void 0,
			attrDate : currentDate,
			attrShowPicker:false,
			attrDeleteFlag: false,
			attrCredentials: [],
			attrCustomerSource : {},
			attrCustomerOrderSource: {},
			attrPayTypes: {},
			attrTrackPeople : uni.getStorageSync("UserInfo"),
			attrBaseSource : {
				name : '',
				order : '',
				price : void 0,
				date : '',
				way : '',
				belonging : '',
				remark : ''
			}
		};
	},
	
	components: {
		CustomPrikerView
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
	
	mounted() {
		
		/**
		 * 获取归属人
		 */ 
		EventBus.$on('SELECTEMPLOYEES', (e) => {
			this.attrTrackPeople = JSON.parse(e)
		}) 
		
		/**
		 * 获取到用户点击的订单
		 */
		EventBus.$on('SELECTCUTOMERORDER', (e) => {
			this.attrCustomerOrderSource = e
		})
		
		/**
		 * 获取客户名称
		 */
		EventBus.$on('SELECTCUSTOMER', (e) => {
			this.attrCustomerSource = e
		})

		/**
		 * 获取付款方式
		 */
		EventBus.$on('SELECTMETHODPAYMENT', (e) => {
			this.attrPayTypes = e
		})
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		const params = {
			customer_id : this.attrCustomerSource.id,
			order_id: this.attrCustomerOrderSource.id,
			price: this.attrBaseSource.price,
			date : this.attrBaseSource.date,
			remark : this.attrBaseSource.remark,
			images: JSON.stringify(this.attrCredentials),
			paytype_id: this.attrPayTypes.id,
			type: 1,
			refund_reason : ''
		}
		Api.createOrderPaymentOrders(params).then(res => {
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

	// 页面周期与 onLoad 同级
	onBackPress(e) {
		if (e.from == 'backbutton') {
			uni.showModal({
				title: '是否取消创建',
				content: '',
				cancelText: '取消',
				confirmText: '确定',
				showCancel: true,
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: function(res) {
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
		 * 获取详情
		 */
		funcGetDetail() {
			Api.orderPaymentOrdersDetail({
				id: this.attrId
			}).then(res => {
				const data = res.data
				if (data.images) {
					if (data.images instanceof Array) {
						this.attrCredentials = data.images;
					} else {
						this.attrCredentials = JSON.parse(data.images);
					}
					this.attrCustomerSource = data.customer
					this.attrCustomerOrderSource = data.order
					this.attrPayTypes = data.paytype
					this.attrBaseSource = {
						order : data.order && data.order.number,
						price : data.price,
						date : data.date,
						way : data.paytype.name,
						belonging : data.admin.name,
						remark : data.remark
					}
				}
			});
		},
		
		/**
		 * 获取相册
		 */
		funcGetPhotoImages() {
			this.funcGetPhoto((data) => {
				this.attrCredentials = this.attrCredentials.concat(data)
			})
		},

		/**
		 * 获取客户名称
		 */
		funcGetCustomerInfo() {
			uni.navigateTo({
				url:"../pageCustomer/customerList?title=选择我的客户"
			})
			
		},
		
		/**
		 * 获取对应订单
		 */
		funcGetCustomOrder() {
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
		
		/**
		 * 获取回款日期
		 */
		funcGetDate() {
			this.attrShowPicker = true
		},
		
		/**
		 * 获取回款方式
		 */
		funcGetWay() {
			uni.navigateTo({
				url : '../pageCommon/methodPayment'
			})
		},
		
		/**
		 * 获取归属人
		 */
		funcGetBelonging() {
			const ids = this.attrTrackPeople.id
			uni.navigateTo({
				url: `../pageEmployees/pageEmployeesMain?self=0&sign=1&ids=${ids}`
			})
		},
		
		/**
		 * 显隐pciker
		 */
		funcShowPicker() {
			this.attrShowPicker = !this.attrShowPicker
		},
		
		/**
		 * 确定日期
		 */
		funcChangeDate(res) {
			this.funcShowPicker()
			this.attrDate = res.date
			this.attrBaseSource.date = this.attrDate || ''
		},
	}
};
</script>

<style lang="less" scoped>
.mainTitle {
	display: flex;
	align-items: flex-end;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #f1f1f1;
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
}

.createItem {
	display: flex;
	align-items: center;
	min-height: 100rpx;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #eee9e9 solid;
	background-color: white;

	.item {
		padding: 10rpx 0rpx;
		flex: 1;
		display: flex;
		justify-content: space-between;
	}

	.label {
		flex-shrink: 0;
		width: 200rpx;
		height: 22px;
	}

	.valueBox {
		display: flex;
		align-items: center;
	}

	.value {
		flex: 1;
	}

	.arrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}
}

.itemInput {
	font-size: 28rpx;
	margin-left: 20rpx;
	flex: 1;
}

.itemTextarea {
	font-size: 28rpx;
	padding: 10rpx 0rpx;
	margin-left: 20rpx;
}

.noteBox {
	border-top: 20rpx #f1f1f1 solid;
	border-bottom: 20rpx #f1f1f1 solid;
}

	
.imageBaseView {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
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
</style>
