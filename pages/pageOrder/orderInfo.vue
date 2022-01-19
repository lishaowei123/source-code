<template>
	<view class="createPersonBaseView">
		<view class="topView">
			<view class="headerView">
				<view class="headerImage">
					{{ attrSource.admin && funcSubName(attrSource.admin.name)  || "获取中" }}
				</view>
				<view class="headerRightInfo">
					<view>{{ attrSource.admin && attrSource.admin.name || "获取中" }}</view>
				</view>
			</view>
			<text class="price">订单金额</text>
			<view class="priceNumber" @click="funcPushOrderDetail">
				<text class="itemLevelText">¥ {{ attrSource.price }}</text>
				<uni-icons style="color:white" type="arrowright"></uni-icons>
			</view>
			<text class="date">下单日期：{{ attrSource.order_date }}</text>
			<text class="date">订单编号：{{  attrSource.number }}</text>
		</view>
		
		<!-- 客户信息 -->
		<view class="header"></view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectCustomer">
				<text class="itemLabel">客户</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.customer && attrSource.customer.name}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcPushConract">
				<text class="itemLabel">合同</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.order_contract && attrSource.order_contract.length}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcPushPaymentOrders">
				<text class="itemLabel">回款</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSource.payment_orders && attrSource.payment_orders.length}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>

		<view class="header"></view>
		
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">销售商品 {{ attrSource.order_goods && attrSource.order_goods.length }}</text>
				<view class="itemLevel">
					<!-- <text class="itemLevelText">查看全部详情</text> -->
				</view>
			</view>
		</view>
		
		<view class="itemView" v-for="(item, index) in attrSource.order_goods" :key="index" @click="funcPushGoodsDetail(item)">
			<view class="itemViewCell">
				<text>{{ item.goods && item.goods.name }}</text>
				<text>{{ item.goods && item.goods.number }}</text>
				<text>数量：{{ item.number }}{{ item.unit }}</text>
				<text>金额：{{ item.price }}元</text>
			</view>
		</view>
		

	</view>
</template>

<script>
	// 工具类
	import utils from '../../common/utils.js'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// 自定义选择时间组件
	import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
	// API
	import Api from "../../apis/apis.js"
	import Mixins from '@/mixins/mixin.vue'
	const addContactTemplate = {
		nameLable : '合同标题',
		nameValue : '',
		namePlaceholder : '请输入合同标题',
		
		numberLable : '合同编号',
		numberValue : '',
		numberPlaceholder : '请输入合同编号',
		
		startDateLabel : '开始时间',
		startValue : '',
		
		endDateLabel : '开始时间',
		endValue : '',
		
		remarkLable : '合同备注',
		remarkValue : '',
		remarkPlaceholder : '请输入合同备注',
		
		images : []
	}
	
	export default {
		mixins: [ Mixins ],
		data() {
			return {
				attrId: void 0,
				attrSource: {},
				attrImageList: [],
				attrPersonInfo: {
					name : '',
					price : '',
					date : '',
					remark : ''
				},
				attrCustomInfo: {},
				attrTrackPeople : uni.getStorageSync("UserInfo"),
				attrSelectGoods : []
			}
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
				this.funcGetOrdersDetail()
			}
		},

		mounted() {

			/**
			 * 获取客户名称
			 */ 
			EventBus.$on('SELECTCUSTOMER', (e) => {
				this.attrPersonInfo.name = e.name || ''
				this.attrCustomInfo = e
			}) 
			
			/**
			 * 获取归属人
			 */ 
			EventBus.$on('SELECTEMPLOYEES', (e) => {
				this.attrTrackPeople = JSON.parse(e)
			}) 
			
			/**
			 * 新建订单时选中的商品
			 */
			EventBus.$on('SELECTADDGOODS', (e) => {
				this.attrSelectGoods = e
				let strings = []
				let price = 0
				e && e.map((item, index) => {
					strings.push(item.name)
					price += item.totalPrice
				})
				this.$set(this.attrPersonInfo, "goods", strings.join("、"))
				this.$set(this.attrPersonInfo, "price", price)
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			
		},
		
		methods: {
			/**
			 * 跳转到订单详情
			 */
			funcPushOrderDetail() {
				uni.navigateTo({
					url : `./orderDetail?id=${this.attrSource.id}`
				})
			},
			
			/**
			 * 跳转到回款
			 */
			funcPushPaymentOrders() {
				uni.navigateTo({
					url : `../pageReceivable/receivableMain`
				})
			},
			
			/**
			 * 跳转到合同列表
			 */
			funcPushConract() {
				uni.navigateTo({
					url : `../pageContract/contarctList?orderId=${this.attrSource.id}`
				})
			},
			
			/**
			 * 跳转到熬商品详情
			 */
			funcPushGoodsDetail(item) {
				uni.navigateTo({
					url : `../pageGoods/goodsDetail?id=${item.goods.id}`
				})
			},
			
			/**
			 * 获取订单详情
			 */
			funcGetOrdersDetail() {
				Api.getOrdersDetail({
					id : this.attrId
				}).then(res => {
					if (res.error_code == 0) {
						this.attrSource = res.data || {}
					} else {
						this.funcShowToast('获取失败');
					}
				});
			},
			
			/**
			 * 跳转到流程页面
			 */
			funcPushProcess() {
				uni.navigateTo({
					url : '../pageApprovalSet/pageApprovalCreate?noset=1'
				})
			},
			
			/**
			 * 选择归属人
			 */
			funcSelectPerson() {
				const ids = this.attrTrackPeople.id
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?self=0&sign=1&ids=${ids}`
				})
			},
			
			/**
			 * 跳转到商品
			 */
			funcPushGoods() {
				uni.navigateTo({
					url : '../pageGoods/goodsList'
				})
			},
			
			/**
			 * 选择客户
			 */
			funcSelectCustomer() {
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${this.attrSource.customer.id}`
				})
				return
			},
		}
	}
</script>

<style scoped lang="less">
	
	.topView {
		width: 100%;
		height: 400rpx;
		background-color: #6161b8;
	}
	
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
	
	.iteminput {
		font-size: 28rpx;
		margin-left: 20rpx;
		flex: 1;
		text-align: right;
	}
	
	.phoneItems {
		flex:1;
		display: flex;
		justify-content: space-between;
		margin-left: 20rpx;
	}
	
	.addContact {
		color: #2b2ba5;
		width: 100%;
		height: 50px;
		display: block;
		line-height: 50px;
		text-align: center;
	}
	
	.personArrowItem {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.itemArrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}
	
	.itemLevelText {
		height: 22px;
	}
	
	 .itemLevel{
		 display: flex;
		 align-items: center;
	 }
	 
	 .headerView {
	 	display: flex;
	 	padding: 20rpx;
	 	box-sizing: border-box;
		align-items: center;
		color: white;
	 }
	 
	 .headerImage {
	 	width: 100rpx;
	 	height: 100rpx;
	 	border-radius: 50%;
	 	display: flex;
	 	justify-content: center;
	 	align-items: center;
	 	background-color: #ce389f;
	 	flex-shrink: 0;
	 	color: white;
	 	font-size: 22rpx;
	 }
	 
	 .headerRightInfo {
	 	margin-left: 20rpx;
	 }
	 
	.price {
		color: white;
		font-size: 22rpx;
		margin-left: 20rpx;
	}
	
	.priceNumber {
		height: 80rpx;
		justify-content: space-between;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		font-size: 40rpx;
		color: white;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}
	
	.date {
		font-size: 22rpx;
		display: block;
		color: white;
		padding: 5rpx 20rpx;
		box-sizing: border-box;
	}
	
	.itemView {
		width: 100%;
		background-color: white;
		border-bottom: 1rpx #ebe4e4 solid;
	}
	
	.itemViewCell {
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
