<template>
	<view class="container">
		<view class="person" @click="funcPushNoWork(1, `未处理工作${attrSource.work_rw_count + attrSource.work_sp_count}个`)"> 
			<view class="personHeaderText">
				<image class="headerImageIcon" src="/static/renwu2.png"></image>
			</view>
			<view class="personBody">
				<text class="personName">未处理工作（{{attrSource.work_count || 0}}）</text>
				<text class="subName" style="color:rgb(216 163 0)">{{attrSource.work_rw_count || 0}}个任务 {{attrSource.work_sp_count || 0}}个审批</text>
			</view>
		</view>
		<view class="person" @click="funcPushNoWork(2, '评论')">
			<view class="personHeaderText">
				<image class="headerImageIcon" src="/static/pinglun2.png"></image>
			</view>
			<view class="personBody">
				<text class="personName">评论 ({{attrSource.comment_count || 0}})</text>
				<text class="subName">{{attrSource.comment_count || 0}}个评论</text>
			</view>
		</view>
		<view class="person" @click="funcPushNoWork(3, '助理')">
			<view class="personHeaderText">
				<image class="headerImageIcon" src="/static/zhuli.png"></image>
			</view>
			<view class="personBody">
				<text class="personName">小助理 ({{attrSource.xzl_count || 0}})</text>
				<text class="subName">你的任务({{attrSource.xzl_count || 0}})</text>
			</view>
		</view>
	</view>
</template>
<script>
const userInfo = uni.getStorageSync('UserInfo')
// API
import Api from '@/apis/apis.js';
export default {
	data() {
		return {
			attrSource: {},
			attrUserSource : userInfo || {},
		}
	},
	
	onShow() {
		
		this.attrUserSource = uni.getStorageSync('UserInfo')
		
		const authorization = uni.getStorageSync('Authorization')
		
		if(!authorization) {
			uni.reLaunch({
				url: "../../pageLogin/pageLoginMain"
			})
		} else {
			this.funcGetMessageList()
		}
	},
	
	methods: {
		/**
		 * 跳转到未处理工作
		 */
		funcPushNoWork(type, title) {
			uni.navigateTo({
				url : `./noWork?type=${type}&title=${title}`
			})
		},
		
		/**
		 * 获取消息列表数量
		 */
		funcGetMessageList() {
			Api.getMessageCount().then(res => {
				this.attrSource = res.data || {}
			})	
		},
	}
};
</script>

<style>
	@import '../../../common/uni-nvue.css';

	.container {
		/* min-height: 1400rpx; */
		height: 100%;
		flex-direction: column;
		background-color: white;
	}
	
	.person {
		border-top : 1rpx #ccc solid;
		height: 160rpx;
		background-color: white; 
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
	}
	
	.personHeaderText {
		width: 90rpx;
		height: 90rpx; 
		border-radius: 50%;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		font-weight: bold;
		color: white;
	}
	
	.personBody {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
	}
	
	.subName {
		font-size: 24rpx;
	}
	
	.personName {
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.clearButton {
		flex: 1;
		background-color: white;
	}
	
	.content {
		position:fixed;
		flex-direction: row;
		bottom: 160rpx;
	}
	
	.headerImageIcon {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		overflow: hidden;
	}
	
</style>
