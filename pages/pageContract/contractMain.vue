<template>
	<view class="container">
		<general-tip-component title="我可以查看的合同" @click="funcReviewClick" />
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="80"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item, index)">
				<view class="soucteItemLeftBox">
					 {{ item.title || "" }}
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">客户: </text>
					<text class="value">{{item.customer && item.customer.name  }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">归属人: </text>
					<text class="value">{{item.admin && item.admin.name }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">截止日期: </text>
					<text class="value">{{item.end_date }}</text>
				</view>
			</view>
		</mescroll-uni>
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
				attrSource : []
			}
		},
		
		components: {
			GeneralTipComponent
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			switch(e.index) {
			    case 0:
					uni.navigateTo({
						url : './contractCreate'
					})
			        break;
			    case 1:
				
			        break;
			    default:
				  break;
			} 
		},
		
		methods: {
			
			/**
			 * 跳转到详情
			 */
			funcPushDetail(item, index) {
				uni.navigateTo({
					url : `./contractDetail?id=${item.id}`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getMyOrderContracts({
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
			
			/**
			 * 我可以查看的合同
			 */
			funcReviewClick() {
				uni.navigateTo({
					url : './contractReview'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		height: 100%;
		background-color: white;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
</style>
