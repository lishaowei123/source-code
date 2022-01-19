<template>
	<view class="container">
		<general-tip-component title="我可以查看的跟进记录" @click="funcReviewProgress" />
		<choose-cade-component 
			pageHeight="80rpx"
			:dataSource="attrList" 
			@select="funcSelect" 
		>
		</choose-cade-component>
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="160"
		>
			<view v-for="(item, idx) in attrSource" :key="idx" class="visitRecordItem" @click="funcPushDetail(item)">
				<custom-record-cell :source="item" @click="funcCustomerDetail" />
			</view>
		</mescroll-uni>
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
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义页面【 通用tip组件 】
	import GeneralTipComponent from '@/components/commonGeneralTip/commonGeneralTip.vue'
	// 自定义页面【 下拉选择页面 】
	import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
	// 自定义选择时间组件
	import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue'
	// 自定义cell
	import CustomRecordCell from '@/components/custom-record-item/custom-record-item.vue'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			const currentDate = this.funcGetDate()
			return {
				attrSearchSource : {
					type : ''
				},
				attrSource : [],
				// attrList type 0 跳转 1 选择 2 下拉 【100下拉类型中的选择日期】 3 日期 source 下拉选择的数据 useslot 使用自定义页面 path:'跳转的页面路径'
				attrList : [{
					beforeIcon : '',
					text : '全部时间',
					type : 2,
					path : "",
					useslot : '',
					key: "date",
					source : [{
						select : true,
						index : 0,
						label : '全部时间'
					},{
						select : false,
						value : currentDate,
						label : '今天'
					},{ 
						value : currentDate,
						select : false,
						type : 100,
						label : '选择日期'
					}],
					showBottons: false
				}, {
					beforeIcon : '',
					text : '全部类型',
					key: "type",
					type : 2,
					path : "",
					useslot : '',
					source: [{
						value : "",
						select : true,
						label : '全部类型'
					},{
						value : 1,
						select : false,
						label : '会话沟通'
					},{
						value : 2,
						select : false,
						label : '外勤拜访'
					}],
					showBottons: false,
				}],
				attrShowPicker: false,
				attrDate : currentDate,
			}
		},
		
		components: {
			GeneralTipComponent,
			ChooseCadeComponent,
			CustomPrikerView,
			CustomRecordCell
		},
		
		onShow() {
			this.mescroll && this.mescroll.triggerDownScroll()	
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			uni.navigateTo({
				url: '../pageVisit/visitWay'
			})
		},
		
		methods: {
			/**
			 * 跳转到熬详情
			 */
			funcCustomerDetail(item) {
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${item.customer_id}`
				})
			},
			
			/**
			 * 获取列表数据
			 */
			funcGetSource() {
				this.attrSource = []
				Api.getCustomerFollows({
					...this.attrSearchSource
				}).then(res=>{
					const list = res.data.data || []
					this.attrSource = list; 
				})
			},
			
			/**
			 * 进入详情
			 */
			funcPushDetail(item) {
				const title = item.type == 2 ? '外勤拜访详情' : '会话拜访详情'
				uni.navigateTo({
					url: `../pageVisit/visitDetail?type=1&title=${title}&id=${item.id}`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getCustomerFollows({
					type: 1,
					page : page.num,
					per_page : page.size,
					...this.attrSearchSource
				}).then(res=>{
					const list = res.data.data || []
					this.mescroll.endByPage(list.length, res.data.total); 
					if(page.num == 1) this.attrSource = []; 
					this.attrSource = this.attrSource.concat(list); 
				}).catch(()=>{
					this.mescroll.endErr();
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
			 * 查看跟进记录
			 */
			funcReviewProgress() {
				uni.navigateTo({
					url : '../pageVisit/visitRecord?type=1'
				})
			},
			
			/**
			 * 选中子元素
			 */
			funcSelect(e) {
				if(e.type == 100) {
					this.attrShowPicker = (e.type == 100)
					return
				}
				e.source.map((item, index) => {
					let value = ''
					item.source.map((vue, idx) => {
						if(vue.select) {
							value = vue.value
						}
					})
					if(item.key) {
						this.attrSearchSource[item.key] = value
					}
				})
				this.funcGetSource()
			},
			
			/**
			 * 点击日期
			 */
			funcTouchPicker() {
				this.attrShowPicker = true
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
				this.attrList[0].text = this.attrDate
				this.attrList[0].source[2].select = true
				this.attrList[0].source[2].value = this.attrDate
				this.attrSearchSource['date'] = this.attrDate
				this.funcGetSource()
			},
		}
	}
</script>

<style scoped lang="less">
	
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
