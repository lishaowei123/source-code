<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<general-tip-component title="我可以查看的回款" @click="funcReviewClick" />
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="80"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox coarse">
						回款金额 {{ item.price || "" }}
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">客户: </text>
						<text class="value">{{item.customer && item.customer.name  }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">回款日期: </text>
						<text class="value">{{item.date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">方式: </text>
						<text class="value">{{item.paytype && item.paytype.name }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">归属人: </text>
						<text class="value">{{item.admin && item.admin.name  }}</text>
					</view>
				</view>
				<view class="soucteItemRight">
					<text>{{ item.status == 0 ? '未确认' : item.status == 1 ? '已确认' : '' }}</text>
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
						title: '添加回款',
						index: 0
					}
				],
			}
		},
		
		components: {
			GeneralTipComponent,
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
		
		methods: {
			
			/**
			 * 单击趋势
			 */
			funcTouchQushi() {
				uni.navigateTo({
					url : './receivableAnalysis'
				})
			},
			
			/**
			 * 点击popup-item
			 */
			funcTapPopup(e) {
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url : './receivableCreate'
						});
						break;
					case 1:
						uni.navigateTo({
							url: "./receivableCreatePerson"
						});
						break;
					default:
						break;
				}
			},
			
			/**
			 * 跳转回款详情
			 */
			funcPushDetail(item) {
				uni.navigateTo({
					url : `./receivableDetail?id=${item.id}`
				})
			},
			
			/**
			 * 查看我的回款
			 */
			funcReviewClick() {
				uni.navigateTo({
					url : './receivableAndRefundList?title=我可以查看的回款'
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getOrderPaymentOrders({
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
		font-size: 24rpx;
	}
	
	.soucteItemRight {
		font-size: 24rpx;
	}
	
	.coarse {
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 20rpx;
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
