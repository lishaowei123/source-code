<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<general-tip-component title="我可以查看的订单" @click="funcReviewClick" />
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="80"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushOrderInfo(item)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox">
						<text class="label">订单金额</text>
						<text class="value">：{{ item.price }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">客户</text>
						<text class="value">：{{ item.customer && item.customer.name }}</text>
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
					<text v-if="item.status == 3">已撤销</text>
				</view>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>


<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义页面【 通用tip组件 】
	import GeneralTipComponent from '@/components/commonGeneralTip/commonGeneralTip.vue'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			return {
				attrSource : [],
				attrShowPopUp: false,
				attrPopUpDataSource: [
					{
						icon: '',
						title: '创建订单',
						index: 0
					}
				],
			}
		},
		
		components: {
			GeneralTipComponent
		},
		
		mounted() {
			const userInfo = uni.getStorageSync('UserInfo')
			if(userInfo.is_admin) {
				this.attrPopUpDataSource.push({
					icon: '',
					title: '审批人设置',
					index: 1
				})
			} 
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			this.attrShowPopUp = true;
		},

		onShow() {
			// Api.getOrders().then(res=>{
			// 	const list = res.data.data || []
			// 	this.mescroll.endByPage(list.length, res.data.total); 
			// 	if(page.num == 1) this.attrSource = []; 
			// 	this.attrSource = this.attrSource.concat(list); 
			// }).catch(()=>{
			// 	this.mescroll.endErr();
			// })	
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
			
			/**
			 * 点击popup-item
			 */
			funcTapPopup(e) {
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url : './orderCreate'
						});
						break;
					case 1:
						uni.navigateTo({
							url : '../pageApprovalSet/pageApprovalSet'
						});
						break;
					default:
						break;
				}
			},
			
			/**
			 * 跳转到订单信息
			 */
			funcPushOrderInfo(item) {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${item.id}`
				})
			},
			
			/**
			 * 我可以查看的订单
			 */
			funcReviewClick() {
				uni.navigateTo({
					url : './orderReviewList'
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getMyOrders({
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
		font-size: 24rpx;
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
