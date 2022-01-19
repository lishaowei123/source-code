<template>
	<view class="container">
		<general-tip-component title="我可以查看的拜访记录" @click="funcReviewClick" />
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="80"
		>
			<view v-for="(item, idx) in attrSource" :key="idx" class="visitRecordItem" @click="funcPushDetail(item)">
				<custom-record-cell :source="item" @click="funcCustomerDetail" />
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义页面【 通用tip组件 】
	import GeneralTipComponent from '@/components/commonGeneralTip/commonGeneralTip.vue'
	// 自定义cell
	import CustomRecordCell from '@/components/custom-record-item/custom-record-item.vue'
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
			CustomRecordCell,
			GeneralTipComponent
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
			 * 点击navigation-item
			 */
			onNavigationBarButtonTap(e) {  
				uni.navigateTo({
					url : './visitCreate'
				})
			},
			
			/**
			 * 我可以查看的拜访记录
			 */
			funcReviewClick() {
				uni.navigateTo({
					url: '../pageVisit/visitRecord'
				})
			},
			
			/**
			 * 进入详情
			 */
			funcPushDetail(item) {
				uni.navigateTo({
					url: `./visitDetail?type=2&title=外勤拜访详情&id=${item.id}`
				})
			},
			
			/**
			 * 上拉加载 
			 */
			funcUpLoad(page) {
				Api.getCustomerFollows({
					type: 2,
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
	.goodItems {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #CCCCCC solid;
		background-color: white;
	}
	
	.visitRecordItem {
		display: flex;
		justify-content: space-between;
		background-color: white;
		border-bottom: 1rpx #f4eded solid;
	}
</style>
