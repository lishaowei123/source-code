<template>
	<view class="container">
		<view class="comments">
			评论 {{ source.comment_count || "" }}
		</view>
		<view class="commentsView">
			<view class="commentsItem" v-for="(item, index) in source.comments" :key="index">
				<view class="commentsItemTop">
					<view class="commentsItemLeft">
						<view class="headerImage">
							<view class="name">{{ funcSubstringName(item.user &&  funcSubName(item.user.name) || "" ) }}</view>
						</view>
						<view class="headerName">
							{{ item.user && item.user.name  || "" }}
						</view>
					</view>
					<view class="headerTime">
						{{ item && item.created_at || "" }}
					</view>
				</view>
				
				<view class="commentsString">
					{{ item.content }}
				</view>
			</view>
			<view class="commentInputView" v-if="showComment">
				<input class="commentInput" type="text" v-model="attrComments" />
				<text class="send" @click="funcSend">发送</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Mixins from '@/mixins/mixin.vue'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrComments : ""
			}
		}, 
		
		props: {
			showComment : {
				type : Boolean,
				default: true
			},
			source : {
				type : Object,
				default: {}
			},
		},
		
		mounted() {
			
		},
		
		methods: {
			/**
			 * 
			 */
			funcSubstringName(name) {
				if(name.length > 2) {
					return name.substring(1)
				} else {
					return name
				}
			},
			
			/**
			 * 评论
			 */
			funcSend() {
				if(!this.attrComments) {
					uni.showToast({
						title : '评论不能为空'
					})
					return
				}
				this.funcCreateComments()
			},
			
			/**
			 * 获取接口数据
			 */
			funcCreateComments() {
				const id = this.source.id
				Api.createComments({
					content : this.attrComments,
					customer_follow_id: id
				}).then(res => {
					if(res.error_code == 0) {
						this.$emit("send")
						this.attrComments = ""
					} else {
						uni.showToast({
							title : res.error_msg || "失败",
							icon : 'none'
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.container {
		background-color: white;
		width: 100%;
		height: 100%;
	}
	
	.comments {
		padding: 0rpx 20rpx;
		display: flex;
		align-items: center;
		height: 80rpx;
		width: 100%;
		border-bottom: 1rpx #e9e9e9 solid;
	}
	
	.commentInputView {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		background-color: white;
		display: flex;
		align-items: center;
		padding: 0rpx 20rpx;
		height: 100rpx;
	}
	
	.send {
		width: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.commentInput {
		height: 80rpx;
		flex: 1;
		flex-shrink: 0;
		border: 1rpx #bcb4b4 solid;
		border-radius: 100rpx;
		padding: 0rpx 30rpx;
		box-sizing: border-box;
	}
	
	.commentsItem {
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #dddddd solid;
	}
	
	.commentsItemLeft {
		display: flex;
		align-items: center;
	}
	
	.headerImage {
		width: 60rpx;
		height: 60rpx;
		background-color: #225796;
		border-radius: 50%;
		font-size: 10rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.commentsItemTop {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}
	
	.headerName {
		margin-left: 20rpx;
		color: #225796;
	}
	
	.headerTime {
		color: #a7a0a0;
		font-size: 24rpx;
	}
	
	.commentsString {
		padding: 20rpx 0rpx;
	}
	
	.commentsView {
		padding-bottom: 100rpx;
	}
	
	.name {
		font-size: 24rpx;
		transform: scale(0.8);
	}
</style>
