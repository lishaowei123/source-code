<template>
	<view class="createPersonBaseView">
		<!-- 客户信息 -->
		<view class="header"></view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectCustomer">
				<text class="itemLabel">客户名称</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrPersonInfo.name }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcPushGoods">
				<text class="itemLabel">商品</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrPersonInfo.goods }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="personItem">
			<text class="itemLabel">输入金额</text>
			<input class="iteminput" type="number" v-model="attrPersonInfo.price" placeholder="请输入金额" />
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcShowPicker">
				<text class="itemLabel">下单日期</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrPersonInfo.date }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectPerson">
				<text class="itemLabel">归属人</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrTrackPeople.name }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="header"></view>
		
		<view class="personItem">
			<text class="itemLabel">备注</text>
			<input class="iteminput" type="text" v-model="attrPersonInfo.remark" placeholder="请输入客户备注" />
		</view>
		
		<view class="header"></view>
		<view class="imageBaseView">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item"
				mode='aspectFill' />
			<view class="imageItemAdd" @click="funcGetPhotoImages">
				<image src="../../static/up.jpg" mode="widthFix"></image>
			</view>
			<!-- <text>-----------{{attrImageList && attrImageList[0]}}</text> -->
		</view>
	
		<!-- 合同信息 -->
		<view class="" v-for="(item, index) in attrContactInfo" :key="index">
			<view class="header1">
				<text>合同 {{index + 1}}</text>
				<text class="delete" v-if="attrContactInfo.length > 1" @click="funcDeleteContactInfo(index)">删除</text>
			</view>
			<view class="personItem">
				<text class="itemLabel">{{ item.nameLable }}</text>
				<input class="iteminput" type="text" v-model="item.nameValue" :placeholder="item.namePlaceholder" />
			</view>
			
			<view class="personItem">
				<text class="itemLabel">{{ item.numberLable }}</text>
				<input class="iteminput" type="text" v-model="item.numberValue" :placeholder="item.numberPlaceholder" />
			</view>
			
			<view class="personItem">
				<view class="personArrowItem" @click="funcSelectPicker(index, 'startDateValue')">
					<text class="itemLabel">{{ item.startDateLabel }}</text>
					<view class="itemLevel">
						<text class="itemLevelText">{{ item.startDateValue }}</text>
						<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
					</view>
				</view>
			</view>
			
			<view class="personItem">
				<view class="personArrowItem" @click="funcSelectPicker(index, 'endDateValue')">
					<text class="itemLabel">{{ item.endDateLabel }}</text>
					<view class="itemLevel">
						<text class="itemLevelText">{{ item.endDateValue }}</text>
						<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
					</view>
				</view>
			</view>
			
			<view class="personItem">
				<text class="itemLabel">{{ item.remarkLable }}</text>
				<input class="iteminput" type="text" v-model="item.remarkValue" :placeholder="item.remarkPlaceholder" />
			</view>
			
			<view class="header"></view>
			
			<view class="imageBaseView">
				<image class="imageItem" v-for="(i, idx) in item.images" :key="idx" :src="i"
					mode='aspectFill' />
				<view class="imageItemAdd" @click="funcGetContractPhoto(item, index)">
					<image src="../../static/up.jpg" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="header"></view>
			
			<text class="addContact" @click="funcAddContactInfo" v-if="index == attrContactInfo.length - 1">添加合同</text>
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
		
		<view class="personItem">
			<view class="personArrowItem">
				<text class="itemLabel">订单审批信息</text>
			</view>
		</view>
		
		<custom-examines :source="attrExamines" tipString="提交订单信息"/>
		
	</view>
</template>

<script>
	// 工具类
	import utils from '../../common/utils.js'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// 自定义选择时间组件
	import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
	// 审批组件
	import CustomExamines from '@/components/custom-examines/custom-examines.vue'
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
		startDateValue : '',
		
		endDateLabel : '结束时间',
		endDateValue : '',
		
		remarkLable : '合同备注',
		remarkValue : '',
		remarkPlaceholder : '请输入合同备注',
		
		images : []
	}
	
	export default {
		mixins : [Mixins],
		data() {
			const currentDate = this.funcGetDate()
			return {
				attrSelectPickerIndex : 0,
				attrAddContractKey : '',
				attrImageList: [],
				attrShowPicker: false,
				attrDate : currentDate,
				attrPersonInfo: {
					name : '',
					price : '',
					date : '',
					remark : ''
				},
				attrCustomInfo: {},
				attrContactInfo : [JSON.parse(JSON.stringify(addContactTemplate))],
				attrTrackPeople : uni.getStorageSync("UserInfo"),
				attrSelectGoods : [],
				attrExamines : [],
				attrId: void 0,
			}
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
				this.funcGetOrderDetail()
				uni.setNavigationBarTitle({
					title: '修改订单'
				})
			}
		},
		
		components: {
			CustomExamines,
			CustomPrikerView
		},

		mounted() {
			this.funcGetExamines();
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
			let goods = [], contacts = []
			this.attrSelectGoods && this.attrSelectGoods.map((item, index) => {
				let obj = {
					"good_id": item.good_id || item.id,
					"number": item.count || item.number,
					"price": item.price,
					"total_price": item.totalPrice || item.total_price,
					"discount": 0,
					"remark": item.describe
				}
				goods.push(obj)
			})
			
			this.attrContactInfo && this.attrContactInfo.map((item, index) => {
				let obj = {
					"customer_id": this.attrTrackPeople.id,
					"title": item.nameValue,
					"customer_id": item.numberValue,
					"number": item.numberValue,
					"start_date": item.startDateValue,
					"end_date": item.endDateValue,
					"remark": item.remarkValue,
					"images": JSON.stringify(item.images),
				}
				contacts.push(obj)
			})
			
			let params = {
				"customer_id": this.attrCustomInfo.id,
				"price": this.attrPersonInfo.price,
				"order_date": this.attrPersonInfo.date,
				"images": JSON.stringify(this.attrImageList),
			    "remark": this.attrPersonInfo.remark,
			    "goods_array": goods,
				"contract_array": contacts
			}
			
			if(this.attrId) {
				params = {
					...params,
					edit : 1,
					id: this.attrId
				}
			}
	
			Api.createOrders(params).then((res) => {
				if(res.error_code == 0) {
					uni.navigateBack({
						delta: 2
					});
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
					title: this.attrId ? '是否取消修改' : '是否取消创建',
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
			 * 获取详情
			 */
			funcGetOrderDetail() {
				Api.getOrdersDetail({
					id : this.attrId
				}).then(res => {
					if (res.error_code == 0) {
						let data = res.data || {}
						
						this.attrCustomInfo = data.customer
						
						this.attrTrackPeople = data.admin
						
						this.attrPersonInfo = {
							name : data.customer.name,
							price : data.price,
							date : data.order_date && data.order_date.split(' ')[0],
							remark : data.remark
						}
						
						this.attrSelectGoods = data.order_goods
						let strings = [], price = 0
						this.attrSelectGoods && this.attrSelectGoods.map((item, index) => {
							strings.push(item.goods && item.goods.name)
							price += item.total_price
						})
						this.$set(this.attrPersonInfo, "goods", strings.join("、"))
						this.$set(this.attrPersonInfo, "price", price)
						
						this.attrImageList = JSON.parse(data.images)
						let orderContract = []
						data.order_contract && data.order_contract.map((item, index) => {
							orderContract.push({
								nameLable : '合同标题',
								nameValue : item.title,
								namePlaceholder : '请输入合同标题',
								numberLable : '合同编号',
								numberValue : item.number,
								numberPlaceholder : '请输入合同编号',
								startDateLabel : '开始时间',
								startDateValue : item.start_date,
								endDateLabel : '结束时间',
								endDateValue : item.end_date,
								remarkLable : '合同备注',
								remarkValue : item.remark,
								remarkPlaceholder : '请输入合同备注',
								images : JSON.parse(item.images)
							})
						})
						
						this.attrContactInfo = orderContract.reverse()
						
						this.attrSource = res.data || {}
					} else {
						this.funcShowToast(res.error_msg || '获取失败');
					}
				});
			},
			
			/**
			 * 获取审批设置
			 */
			funcGetExamines() {
				Api.getExamines({
					type: 4
				}).then(res => {
					if (res.error_code == 0) {
						if (res.data.content) {
							this.attrExamines = res.data.content
						}
					} else {
						this.funcShowToast(res.error_msg || "失败")
					}
				})
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
			 * 合同相册
			 */
			funcGetContractPhoto(item, index) {
				this.funcGetPhoto((data) => {
					this.attrContactInfo[index].images = this.attrContactInfo[index].images.concat(data)
				})
			},
			
			/**
			 * 获取相册
			 */
			funcGetPhotoImages() {
				this.funcGetPhoto((data) => {
					this.attrImageList = this.attrImageList.concat(data)
					console.info(this.attrImageList)
				})
			},
			
			/**
			 * 获取当前日期
			 */
			funcGetDate() {
				const date = new Date();
				let year = date.getFullYear(); 
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				const d = `${year}-${month}-${day}`
				return d;
			},
			
			/**
			 * 选中显示索引 
			 */
			funcSelectPicker(index, key) {
				this.attrAddContractKey = key
				this.attrSelectPickerIndex = index
				this.funcShowPicker()
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
				if(this.attrAddContractKey) {
					this.attrContactInfo[this.attrSelectPickerIndex][this.attrAddContractKey] = this.attrDate
				} else {
					this.attrPersonInfo['date'] = this.attrDate
				}
				this.attrAddContractKey = ''
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
					url : '../pageCustomer/customerList'
				})
			},
			
			/**
			 * 创建客户
			 */
			funcCreateCustomer(params) {
				Api.createCustomers(params).then((res) => {
					if(res.error_code == 0) {
						EventBus.$emit("ADDCUSTOMSUCCESS")
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
			 * 添加合同信息
			 */
			funcAddContactInfo() {
				let info = this.attrContactInfo
				this.attrContactInfo.push(JSON.parse(JSON.stringify(addContactTemplate)))
			},
			
			/**
			 * 删除联系人信息
			 */
			funcDeleteContactInfo(index) {
				this.attrContactInfo.splice(index, 1)
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
		margin-left: 20rpx;
		flex: 1;
		text-align: right;
		font-size: 28rpx;
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
		background-color: #f0eff3;
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
	 
	 .tracking {
		display: flex;
		align-items: flex-end;
		width: 100%;
		height: 100rpx;
		background-color: #F0EFF3;
		padding-left: 20rpx;
		box-sizing: border-box;
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
	 }

	 .trackingItemJiaJian {
		 background-color: transparent;
		 border: 1rpx #f7e0e0 dashed;
		 padding: 20rpx;
		 box-sizing: border-box;
	 }
	 
	 .trackingTitle {
		 font-size: 20rpx;
	 }
	 
	 .trackingItemDelete {
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 font-weight: 500;
		 transform: scale(1.2);
		border-radius: 50%;
		width: 30rpx;
		height: 30rpx;
		background-color: #e9d9d9;
		position: absolute;
		left: 20rpx;
		top: -10rpx;
		opacity: 1;
		transition: all 0.3s;
	  }
	  
	  .trackingItemDeleteHid {
		  .trackingItemDelete();
		  opacity: 0;
		  transition: all 0.3s;
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

	.imageBaseView {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 20rpx 20rpx 20rpx;
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

.headerView {
	display: flex;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #f0eff3;
}

.headerImage {
	width:90rpx;
	height:90rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #225796;
	flex-shrink: 0;
	color: white;
	font-size: 22rpx;
}

.headerRightInfo {
	margin-left: 20rpx;
}

.headerImageBorder {
	border: 1rpx #d9c1c1 solid;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100rpx;
	height: 100rpx;
}

.examinesBaseView {
	background-color: #f0eff3;
}

.tip {
	background-color: #f0eff3;
    padding: 0rpx 50rpx;
	display: flex;
    flex-direction: column;
    align-items: center;
    width: 40rpx;
}

.lineTriangle {
	margin-top: -4rpx;
	width: 0rpx;
	border-width: 14rpx 14rpx 0rpx 14rpx;
	border-style: solid;
	border-color: #d8c6c6 transparent transparent transparent;
}

.line {
	height: 20rpx;
	width: 1rpx;
	margin-left: -1rpx;
	margin-top: -2rpx;
	background-color: #d8c6c6;
}

</style>
