<template>
	<view class="container">
		<view class="imageBaseView" v-if="false">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item"
				mode='aspectFill' />
			<view class="imageItemAdd" @click="funcGetPhotoImages">
				<image src="../../static/up.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="clearance"></view>
		
		<view class="addGoodsAddBase">
			<text>任务名称</text>
			<view class="addGoodsBaseRight">
				<input class="addGoodsAddBaseInput" placeholder="请输入任务名称" type="text" v-model="attrSource.name" />
			</view>
		</view>
		
		<text class="tracking">业务负责人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrLeader3" :key="index" @click="funcTouchItem(item, index, 5)">
				<view :class="attrDeleteLeader3 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddLeader3">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrLeader3.length" @click="funcDeleteLeader3">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<text class="tracking">业务执行人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrAction3" :key="index" @click="funcTouchItem(item, index, 6)">
				<view :class="attrDeleteAction3 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddAction3">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrAction3.length" @click="funcDeleteAction3">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="clearance"></view>
		
		<text class="tracking">技术负责人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrLeader2" :key="index" @click="funcTouchItem(item, index, 3)">
				<view :class="attrDeleteLeader2 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddLeader2">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrLeader2.length" @click="funcDeleteLeader2">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<text class="tracking">技术执行人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrAction2" :key="index" @click="funcTouchItem(item, index, 4)">
				<view :class="attrDeleteAction2 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddAction2">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrAction2.length" @click="funcDeleteAction2">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="clearance"></view>
	
		<text class="tracking">审计负责人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrLeader1" :key="index" @click="funcTouchItem(item, index, 1)">
				<view :class="attrDeleteLeader1 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddLeader1">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrLeader1.length" @click="funcDeleteLeader1">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
		
		<text class="tracking">审计执行人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrAction1" :key="index" @click="funcTouchItem(item, index, 2)">
				<view :class="attrDeleteAction1 ? 'trackingItemDelete' : 'trackingItemDeleteHid'">x</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddAction1">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrAction1.length" @click="funcDeleteAction1">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>

		<view class="clearance"></view>
		
		<view class="customerAddBase" @click="funcSelectCustomer">
			<text>关联客户</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrSource.person && attrSource.person.name || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="clearance"></view>
		
		<view class="customerAddBase" @click="funcSelectGoods">
			<text>关联商品</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrSource.goods && attrSource.goods.name || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="clearance"></view>
		
		<view class="customerAddBase" @click="funcGetDate">
			<text>截止日期</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrSource.end_date || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="customerAddBase" @click="funcLevel">
			<text>优先级</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrSource.level.label || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		
		<view class="customerAddBase" @click="funcSelectCc">
			<text>抄送</text>
			<view class="customerAddBaseRight">
				<text class="customerAddBaseRightText">{{ attrCcPeople.length || "0"}}人</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>

		<view class="clearance"></view>
		
		<view class="pickerMask" v-if="attrShowPicker">
			<view class="custom-picker-base-view">
				<custom-priker-view :range="['2018-01-01 23:59:59', '2025-12-31 23:59:59']"
					:select="attrDate" 
					format="time"
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
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	// 工具
	import utils from '../../common/utils.js'
	import Mixins from '@/mixins/mixin'
	// 自定义选择时间组件
	import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
	import moment from 'moment'
	export default {
		mixins: [ Mixins ],
		data() {
			const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
			return {
				attrDate : currentDate,
				attrShowPicker: false,
				attrSource : {
					name: "",
					person : {},
					end_date : '',
					level: {},
					goods: {}
				},
				attrImageList: [],
				attrCcPeople : [],
				attrDeleteLeader1: false,
				attrDeleteLeader2: false,
				attrDeleteLeader3: false,
				attrDeleteAction1: false,
				attrDeleteAction2: false,
				attrDeleteAction3: false,
				attrLeader1: [],
				attrLeader2: [],
				attrLeader3: [],
				attrAction1: [],
				attrAction2: [],
				attrAction3: [],
				attrId: void 0
			}
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
				uni.setNavigationBarTitle({
					title: '设置'
				})
				this.funcGetDetail()
			}
		},
		
		components: {
			CustomPrikerView
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			// 获取抄送人id
			let ccIds = [], actions1 = [], actions2 = [], actions3 = [], leaders1 = [], leaders2 = [], leaders3 = [];
			this.attrCcPeople && this.attrCcPeople.map((item, index) => {
				ccIds.push(item.id)
			})
			
			this.attrLeader1 && this.attrLeader1.map((item, index) => {
				leaders1.push(item.id)
			})
			
			this.attrLeader2 && this.attrLeader2.map((item, index) => {
				leaders2.push(item.id)
			})
			
			this.attrLeader3 && this.attrLeader3.map((item, index) => {
				leaders3.push(item.id)
			})
			
			this.attrAction1 && this.attrAction1.map((item, index) => {
				actions1.push(item.id)
			})
			
			this.attrAction2 && this.attrAction2.map((item, index) => {
				actions2.push(item.id)
			})
			
			this.attrAction3 && this.attrAction3.map((item, index) => {
				actions3.push(item.id)
			})
			
			console.log(this.attrSource)
			
			// 获取
			let params = {
				// images : JSON.stringify(this.attrImageList),
				type : 1,
				customer_id	: this.attrSource.person.id,
				end_date: this.attrSource.end_date,
				level: this.attrSource.level.label,
				goods_id: this.attrSource.goods && this.attrSource.goods.id,
				name: this.attrSource.name,
				cc_id : ccIds,
				manager_id: leaders3[0] || '',	
				manager_staff_id: actions3[0] || '',	
				skill_id: leaders2[0] || '',
				skill_staff_id: actions2[0] || '',
				finance_id: leaders1[0] || '',
				finance_staff_id: actions1[0] || ''
			}
			
			if(this.attrId) {
				params = {
					...params,
					id: this.attrId
				}
			}

			let apiName = this.attrId ? 'updateTask' : 'createTask'
			Api[apiName](params).then((res) => {
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
		
		mounted() {

			/**
			 * 选中商品
			 */
			EventBus.$on('SELECTGOODS', (e) => {
				this.attrSource.goods = e
			})
			
			/**
			 * 获取选中的用户等级
			 */
			EventBus.$on('SELECTLEVEL', (e) => {
				this.attrSource.level = e
			})
			
			/**
			 * 获取选中的客户
			 */
			EventBus.$on('SELECTCUSTOMER', (e) => {
				this.attrSource.person = e
			})
			
			/**
			 * 获取抄送人
			 */
			EventBus.$on('SELECTCC', (e) => {
				this.attrCcPeople = JSON.parse(e)
			})
			
			/**
			 * 获取负责人1
			 */
			EventBus.$on('SELECTLEADER1', (e) => {
				this.attrLeader1 = [JSON.parse(e)]
			})
			
			/**
			 * 获取负责2
			 */
			EventBus.$on('SELECTLEADER2', (e) => {
				this.attrLeader2 = [JSON.parse(e)]
			})
			
			/**
			 * 获取负责3
			 */
			EventBus.$on('SELECTLEADER3', (e) => {
				this.attrLeader3 = [JSON.parse(e)]
			})
			
			/**
			 * 获取执行人1
			 */
			EventBus.$on('SELECTACTION1', (e) => {
				this.attrAction1 = [JSON.parse(e)]
			})
			
			/**
			 * 获取执行人2
			 */
			EventBus.$on('SELECTACTION2', (e) => {
				this.attrAction2 = [JSON.parse(e)]
			})
			
			/**
			 * 获取执行人3
			 */
			EventBus.$on('SELECTACTION3', (e) => {
				this.attrAction3 = [JSON.parse(e)]
			})
		},
		
		methods: {
			
			/**
			 * 获取详情数据
			 */
			funcGetDetail() {
				Api.taskDetail({
					id : this.attrId
				}).then(res => {
					const data = res.data || {}
					this.attrDate = data.end_date
					this.attrSource.name = data.name || ""
					this.attrSource.person = data.customer || {}
					this.attrSource.level = {
						label: data.level
					}
					this.attrCcPeople = data.cc
					this.attrSource.goods = data.goods
					this.attrSource.end_date = data.end_date
					this.attrLeader1 = data.finance ? [data.finance] : []
					this.attrLeader2 = data.skill ? [data.skill] : []
					this.attrLeader3 = data.manager ? [data.manager] : []
					this.attrAction1 = data.finance_staff ? [data.finance_staff] : []
					this.attrAction2 = data.skill_staff ? [data.skill_staff] : []
					this.attrAction3 = data.manager_staff ? [data.manager_staff] : []
				})
			},
			
			/**
			 * 关联商品id
			 */
			funcSelectGoods() {
				uni.navigateTo({
					url : '../pageGoods/goodsListSelect'
				})
			},
			
			/**
			 * 等级
			 */
			funcLevel() {
				const item = JSON.stringify(this.attrSource)
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTLEVEL&item=${item}&title=优先级&type=4`
				})
			},
			
			/**
			 * 获取回款日期
			 */
			funcGetDate() {
				this.attrShowPicker = true
			},
			
			/**
			 * 选择客户
			 */
			funcSelectCustomer() {
				uni.navigateTo({
					url: '../pageCustomer/customerList?title=选择客户&show=2'
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
			
			/**
			 * 点击Item
			 */
			funcTouchItem(item, index, type) {
				switch (type){
					case 1:
					if(this.attrDeleteLeader1) {
						this.attrLeader1.splice(index, 1);
					}
						break;
					case 2:
					if(this.attrDeleteAction1) {
						this.attrAction1.splice(index, 1);
					}
						break;
					case 3:
					if(this.attrDeleteLeader2) {
						this.attrLeader2.splice(index, 1);
					}
						break;
					case 4:
					if(this.attrDeleteAction2) {
						this.attrAction2.splice(index, 1);
					}
						break;		
					case 5:
					if(this.attrDeleteLeader3) {
						this.attrLeader3.splice(index, 1);
					}
						break;
					case 6:
					if(this.attrDeleteAction3) {
						this.attrAction3.splice(index, 1);
					}
						break;
					default:
						break;
				}
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
				this.attrSource.end_date = this.attrDate || ''
			},
			
			/**
			 * 选择时间
			 */
			funcSelectPicker() {
				this.funcShowPicker()
			},
			
			/**
			 * common add 
			 */
			funcComponAddPerson(source, event, sign = 1) {
				let ids = []
				source && source.map((item, index) => {
					ids.push(item.id)
				})
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(",")}&self=0&sign=${sign}&emit=${event}`
				})
			},
			
			/**
			 * 添加任务负责人1
			 */
			funcAddLeader1() {
				this.attrDeleteLeader1 = false
				this.funcComponAddPerson(this.attrLeader1, 'SELECTLEADER1')
			},
			
			/**
			 * 添加任务负责人2
			 */
			funcAddLeader2() {
				this.attrDeleteLeader2 = false
				this.funcComponAddPerson(this.attrLeader2, 'SELECTLEADER2')
			},
			/**
			 * 添加任务负责人3
			 */
			funcAddLeader3() {
				this.attrDeleteLeader3 = false
				this.funcComponAddPerson(this.attrLeader3, 'SELECTLEADER3')
			},
			
			/**
			 * 添加任务执行人1
			 */
			funcAddAction1() {
				this.attrDeleteAction1 = false
				this.funcComponAddPerson(this.attrAction1, 'SELECTACTION1')
			},
			
			/**
			 * 添加任务执行人2
			 */
			funcAddAction2() {
				this.attrDeleteAction2 = false
				this.funcComponAddPerson(this.attrAction2, 'SELECTACTION2')
			},
			/**
			 * 添加任务执行人3
			 */
			funcAddAction3() {
				this.attrDeleteAction3 = false
				this.funcComponAddPerson(this.attrAction3, 'SELECTACTION3')
			},
			
			/**
			 * 获取抄送人员
			 */
			funcSelectCc() {
				let ids = []
				this.attrCcPeople && this.attrCcPeople.map((item, index) => {
					ids.push(item.id)
				})
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(",")}&self=0&emit=SELECTCC`
				})
			},
			
			funcDeleteAction1() {
				this.attrDeleteAction1 = !this.attrDeleteAction1
			},
			
			funcDeleteAction2() {
				this.attrDeleteAction2 = !this.attrDeleteAction2
			},
			
			funcDeleteAction3() {
				this.attrDeleteAction3 = !this.attrDeleteAction3
			},
			
			funcDeleteLeader1() {
				this.attrDeleteLeader1 = !this.attrDeleteLeader1
			},
			
			funcDeleteLeader2() {
				this.attrDeleteLeader2 = !this.attrDeleteLeader2
			},
			
			funcDeleteLeader3() {
				this.attrDeleteLeader3 = !this.attrDeleteLeader3
			},
		},
	}
</script>

<style lang="less" scoped>
	
	.container {
		background-color: white;
	}
	
	.imageBaseView {
		display: flex;
		flex-wrap: wrap;
		padding: 0rpx 20rpx 20rpx 20rpx;
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
	
	.pickerMask {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
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
	 
	 .clearance {
	 	border-top: 20rpx #f5f5f5 solid;
	 }
	 
	 .tracking {
	 		display: flex;
	 		align-items: flex-end;
	 		width: 100%;
	 		height: 100rpx;
	 		padding-left: 20rpx;
	 		box-sizing: border-box;
	 		align-items: center;
			background-color: white;
			border-bottom: 1rpx #f2f2f2 solid;
	 }
	
	.addGoodsAddBase {
		display: flex;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0px 10px;
		box-sizing: border-box;
		border-bottom: 1rpx #F5F5F5 solid;
	}
	
	.addGoodsBaseRight {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.addGoodsAddBaseInput {
		width: 100%;
		margin-left: 20rpx;
	}

</style>