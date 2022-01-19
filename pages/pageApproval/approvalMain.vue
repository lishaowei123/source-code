<template>
	<view class="container">
		<custom-cell title="需要我审批的" icon="../../static/shenpi.png" borderColor="#CCC" @select="funcSelectMyApproval"></custom-cell>
		<custom-cell title="抄送给我的" icon="../../static/chaosong.png" @select="funcSelectMyAssociated"></custom-cell>
		<view class="myApply">我申请的流程</view>
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="206"
		>
			<view class="itemView" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)"> 
				<view class="itemViewLeft">
					<view>{{
						item.type == '1' ? '合同信息确认' :
						item.type == '2' ? '回款信息确认' :
						item.type == '3' ? '退款信息确认' :
						item.type == '4' ? '订单信息确认' : ""
					}}</view>
					<view class="status1" v-if="item.status == 1">状态已完成</view>
					<view class="status0" v-if="item.status == 2">状态：申请已驳回</view>
					<view class="status0" v-if="item.status == 0">状态：{{ item.user && item.user.name }}正在确认中...</view>
				</view>
				<text class="itemStatus">{{ item.created_at }} </text>
			</view>
		</mescroll-uni>
	</view>
</template>

<script> 
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义cell
	import CustomCell from '@/components/custom-cell/custom-cell.vue'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ],
		data() { 
			return {
				attrSource: [],
			}
		},
		
		components: {
			CustomCell
		},
		
		methods: {
			/**
			 * 点击navigation-item
			 */
			onNavigationBarButtonTap(e) {  
				switch(e.index) {
				    case 0:
						this.attrShowPopUp = true
				        break;
				    case 1:
				        break;
				    default:
					  break;
				} 
			},
			
			/**
			 * 需要我审批的
			 */
			funcSelectMyApproval() {
				uni.navigateTo({
					url : './approvalNeedMe'
				})
			}, 
			
			/**
			 * 抄送给我的
			 */
			funcSelectMyAssociated() {
				uni.navigateTo({
					url: './approvalProcess?title=抄送给我的流程'
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getExaminesUser({
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
			 * 跳转详情
			 */
			funcPushDetail(item) {
				uni.navigateTo({
					url : `../pageReceivable/receivableProcess?id=${item.source_id}&type=${item.type}&show=${item.status}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	uni-page-body {
		height: 100%!important;
		overflow: hidden;
	}
	
	.container {
		width: 100%;
		height: 100%;
		background-color: white;
	}
	
	.myApply {
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		font-size: 22rpx;
		background-color: #C0C0C0;
		display: inline-block;
		width: 100%;
	}
	
	.itemView {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		height: 150rpx;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx #ccc solid;
	}
	
	.itemViewLeft {
		
	}
	
	.itemStatus {
		font-size: 24rpx;
	}
	
	.status1 {
		
	}
	
	.status0 {
		font-size: 24rpx;
		color: #FFA200;
	}
	
</style>
