<template>
	<view class="container">
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
		>
			<view :class="item.status == 1 ? 'soucteItemOver' : 'soucteItem'" v-for="(item, index) in attrSource" :key="index" @click="funcSelectItem(item, index)">
				<view class="headerView">
					<view class="headerImage">
						<image v-if="attrType == 1" class="headerImageIcon" src="/static/renwu2.png"></image>
						<image v-if="attrType == 2" class="headerImageIcon" src="/static/pinglun2.png"></image>
						<image v-if="attrType == 3" class="headerImageIcon" src="/static/zhuli.png"></image>
					</view>
					<view class="headerRightInfo">
						<view>{{ item && item.message || "" }}</view>
					</view>
					<view class="" v-if="item.status == 1 && attrType == 1">
						<image class="imageIcon" src="../../../static/wancheng.png" mode=""></image>
					</view>
					<view class="" v-else>
						<text class="time"> {{ funcFormat(item.updated_at) }} </text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// mixins
import Mixins from '@/mixins/mixin.vue'
// API
import Api from "@/apis/apis.js"
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrSource: [],
			attrType: 1
		};
	},
	
	onLoad(options) {
		this.attrType = options.type || 1
		if(options.title) {
			uni.setNavigationBarTitle({
				title : options.title
			})
		}
	},
	
	methods: {
		/**
		 * 跳转到详情
		 */
		funcSelectItem(item, index) {
			this.funcMessageRead(item.id || "")
			switch (Number(item.type)) {
				case 1:
					if(this.attrType == 2) {
						uni.navigateTo({
							url : `../../pageTask/taskDetail?id=${item.source_id || item.task_id}`
						})
					} else {
						uni.navigateTo({
							url : `../../pageContract/contractDetail?id=${item.source_id || item.task_id}`
						})
					}
					break;
				case 2:
					if(this.attrType == 2) {
						uni.navigateTo({
							url : `../../pageVisit/visitDetail?id=${item.source_id || item.task_id}`
						})
					} else {
						uni.navigateTo({
							url : `../../pageReceivable/receivableDetail?id=${item.source_id || item.task_id}`
						})
					}
					break;
				case 3:
					break;
				case 4:
					uni.navigateTo({
						url : `../../pageReceivable/receivableProcess?id=${item.source_id || item.task_id}`
						// url : `../../pageOrder/orderInfo?id=${item.source_id || item.task_id}`
					})
					break;
				case 5:
					uni.navigateTo({
						url : `../../pageExpense/expenseDetail?id=${item.source_id || item.task_id}`
					})
					break;
				case 6:
					uni.navigateTo({
						url : `../../pageTask/taskDetail?id=${item.source_id || item.task_id}`
					})
					break;
				default:
					uni.navigateTo({
						url : `../../pageTask/taskDetail?id=${item.source_id || item.task_id}`
					})
					break;
			}
		},
		
		/**
		 * 消息已读
		 */
		funcMessageRead(id) {
			Api.getMessageRead({
				id:id
			}).then(res=>{
			
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			const ApiName = this.attrType == 1 ? 'getWorkMessageList' : this.attrType == 2 ? 'getCommentMessageList' : 'getMessageList'
			Api[ApiName]({
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
};
</script>

<style scoped lang="less">
	
	.headerView {
		display: flex;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		background-color: white;
		align-items: center;
	}
	
	.headerImage {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #a4abb3;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.headerImageIcon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.headerRightInfo {
		flex: 1;
		margin-left: 20rpx;
	}
	
	.time {
		font-size: 24rpx;
		color: #bfaeae;
		margin-top: 10rpx;
	}
	
	.point {
		width: 10rpx;
		height: 10rpx;
		background-color: #a4abb3;
		border-radius: 50%;
	}
	
	.buttonBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.pointOverdue {
		.point();
		background-color: red;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx 0rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #fbf3f3 solid;
		background-color: white;
	}
	
	.soucteItemOver {
		.soucteItem();
		filter: grayscale(1);
		
		.headerRightInfo {
			color: gainsboro;
		}
		
		.time {
			color: gainsboro;
		}
	}
	
	.imageIcon {
		width: 30rpx;
		height: 30rpx;
	}
</style>
