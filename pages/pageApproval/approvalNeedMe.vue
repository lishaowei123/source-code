<template>
	<view class="container">
		<custom-cell title="已审批的流程" @select="funcSelectMyHaveApproval" :showImage="false"></custom-cell>
		<view class="myApply">需要我审批的</view>
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="130"
		>
			<view v-for="(item, index) in attrSource" :key="index" @click="funcReceivableProcess(item)">  
				<view class="headerView">
					<view class="headerImage">
						{{ item.name || "获取中" }}
					</view>
					<view class="headerRightInfo">
						<view class="headerLeft">
							<view>{{ item.name || "获取中" }}</view>
							<view>{{
								item.examine.type == '1' ? '合同信息确认' :
								item.examine.type == '2' ? '回款信息确认' :
								item.examine.type == '3' ? '退款信息确认' :
								item.examine.type == '4' ? '订单信息确认' : ""
							}}</view>
							<view style="color: #FFA200;" v-if="item.status == 0">状态：等待审批中</view>
							<view v-if="item.status == 1">状态：已审批</view>
						</view>
						<view class="headerRightDay">
							{{ item.created_at }}
						</view>
					</view>
				</view>
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
				attrSource: []
			}
		},
		
		components: {
			CustomCell
		},
		
		methods: {
			/**
			 * 跳转到详情
			 */
			funcReceivableProcess(item) {
				uni.navigateTo({
					url : `../pageReceivable/receivableProcess?id=${item.examine.source_id}&type=${item.examine.type}&show=${item.status}`
				})
			},
			
			/**
			 * 已审批的流程
			 */
			funcSelectMyHaveApproval() {
				uni.navigateTo({
					url: './approvalProcess?title=已审批的流程'
				})
			},

			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getNeed({
					status: 0,
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
	
	.headerView {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.headerImage {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #225796;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.headerImage {
		width: 100rpx;
		height: 100rpx;
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
		width: 100%;
		margin-left: 20rpx;
		border-bottom: 1rpx #ffeaea solid;
		display: flex;
	}
	
	.headerLeft {
		flex: 1;
	}
	
	.status {
		color: #FFA200;
	}
	
	.headerRightDay {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
