<template>
	<view class="container">
		<!-- <choose-cade-component
			pageHeight="0rpx"
			:dataSource="attrList" 
			@select="funcSelect" 
		>
		</choose-cade-component> -->
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="0"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushOrderInfo(item)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox">
						<text class="label">订单金额</text>
						<text class="value">：{{ item.price }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">客户</text>
						<text class="value">：{{ item.customer && item.customer.name  }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">下单日期</text>
						<text class="value">：{{item.order_date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">订单编号</text>
						<text class="value">：{{item.number }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">归属人</text>
						<text class="value">：{{item.admin && item.admin.name }}</text>
					</view>
				</view>
				<view class="soucteItemRight">
					<text style="color:#FFA200" v-if="item.status == 0">待确认</text>
					<text v-if="item.status == 1">已确认</text>
					<text v-if="item.status == 2">已驳回</text>
				</view>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义页面【 下拉选择页面 】
	import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			return {
				attrSource : [],
				attrList : [{
					beforeIcon : '',
					text : '全部时间',
					type : 2,
					path : "",
					useslot : '',
					source : [{
						select : true,
						index : 0,
						label : '全部时间'
					},{
						index : 1,
						select : false,
						label : '最后跟进'
					}],
					showBottons: false
				}, {
					beforeIcon : '',
					text : '全部状态',
					type : 2,
					path : "",
					useslot : '',
					source: [{
						select : true,
						index : 0,
						label : '已确认'
					},{
						index : 1,
						select : false,
						label : '待确认'
					},{
						index : 2,
						select : false,
						label : '已驳回'
					},{
						index : 3,
						select : false,
						label : '已作废'
					}],
					showBottons: false,
				}, {
					beforeIcon : '',
					text : '最新创建',
					type : 2,
					path : "",
					useslot : '',
					source: [{
						select : true,
						index : 0,
						label : '最新创建'
					},{
						index : 1,
						select : false,
						label : '最高金额'
					}],
					showBottons: false,
				}, {
					beforeIcon : '',
					text : '全部成员',
					type : 2,
					path : "",
					useslot : '',
					source: [{
						select : true,
						index : 0,
						label : '最新创建'
					},{
						index : 1,
						select : false,
						label : '选择成员'
					}],
					showBottons: false,
				}]
			}
		},
		
		components: {
			ChooseCadeComponent
		},
		
		methods: {
			/**
			 * 单击趋势
			 */
			funcTouchQushi() {
				uni.navigateTo({
					url : './orderAnalysis'
				})
			},
			
			/*
			 * 跳转到订单信息
			 */
			funcPushOrderInfo(item) {
				uni.navigateTo({
					url : `./orderInfo?id=${item.id}`
				})
			},
			
			/**
			 * 选中子元素
			 */
			funcSelect(e) {
				console.log(e);
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getOrders({
					page : page.num,
					per_page : page.size
				}).then(res=>{
					const list = res.data.data || []
					this.mescroll.endByPage(list.length, res.data.total); 
					if(page.num == 1) this.attrSource = []; 
					this.attrSource = this.attrSource.concat(list); 
				}).catch(()=>{
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.soucteItem {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
	.soucteItemLeft {
		font-size: 26rpx;
	}
	
	.soucteItemRight {
		font-size: 26rpx;
	}
	
	.label {
		display: inline-block;
		width: 120rpx;
		text-align-last: justify;
	}
	
	.qushiImage {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 100;
	}
</style>
