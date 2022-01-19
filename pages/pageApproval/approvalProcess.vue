<template>
	<view class="container">  
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="0"
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
								item.examine && item.examine.type == '1' ? '合同信息确认' :
								item.examine && item.examine.type == '2' ? '回款信息确认' :
								item.examine && item.examine.type == '3' ? '退款信息确认' :
								item.examine && item.examine.type == '4' ? '订单信息确认' : ""
							}}</view>
							<view v-if="item.status == 1">状态：已完成 </view>
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
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ],
		data() {
			return {
				attrSource: []
			}
		},
		
		onLoad(options) {
		 	uni.setNavigationBarTitle({
		 		title : options.title || ""
		 	})
		},
		
		methods: {
			/**
			 * 跳转到详情
			 */
			funcReceivableProcess(item) {
				uni.navigateTo({
					url : `../pageReceivable/receivableProcess?id=${item.examine.source_id}&type=${item.examine.type}&show=${item.status}`
					
					// url : `../pageReceivable/receivableProcess?id=${item.model_id}&type=${item.type}&show=0`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getNeed({
					status: 1,
					page : page.num,
					per_page : page.size
				}).then(res => {
					const list = res.data.data || []
					this.mescroll.endByPage(list.length, res.data.total); 
					if(page.num == 1) this.attrSource = []; 
					this.attrSource = this.attrSource.concat(list); 
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.approvalBaseView {
		width: 100%;
		height: 100%;
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
		background-color: white;
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
	}
	
	.headerRightDay {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
