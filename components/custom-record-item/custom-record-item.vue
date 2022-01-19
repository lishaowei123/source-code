<template>
	<view class="baseView">
		<view class="headerView">
			<view class="headerImage">
				{{ source.admin && funcSubName(source.admin.name) || "获取中" }}
			</view>
			<view class="headerRightInfo">
				<view>{{ source.admin && source.admin.name || "获取中" }}</view>
				<text class="address">{{ source.updated_at || "获取中" }} </text>
				<text class="address">{{ (source.map || (source.latitude + source.longitude)) || "" }}</text>
			</view>
		</view>
		<view class="record">
			{{source.record || ""}}
		</view>
		<view class="imageView">
			<image class="images" v-for="(item, index) in attrImageList" :key="index" :src="item" mode="widthFix" @click="funcShowImage(item)"></image>
		</view>
		<text class="addressMap" @click.stop="funcCustomerDetail">
			<image class="company" src="../../static/gongsi.png" mode="widthFix"></image>
			<text>{{ source.customer && source.customer.name }}</text>
		</text>
		<text class="edit" v-if="showEdit">内容编辑于 {{ source.updated_at || "" }}</text>
		<text class="type" v-if="showType">{{ source.type == 1 ? '会话沟通' : source.type == 2 ? '外勤拜访' : "" }}</text>
		<view class="comments" v-show="showComments">
			<image class="commentsImage" src="../../static/comments.jpg" mode=""></image>评论
		</view>
		<previewImage ref="previewImage" :imgs="attrImageList" ></previewImage>
	</view>
</template>

<script>
	import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrImageList : []
			}
		},
		components: {
			PreviewImage
		},
		props: {
			source : {
				type : Object,
				default: {}
			},
			showComments: {
				type : Boolean,
				default: true
			},
			showEdit: {
				type : Boolean,
				default: false
			},
			showType: {
				type : Boolean,
				default: true
			}
		},
		
		watch: {
			source: {
				handler (newVal) {
					this.funcParseImage()
				},
				deep: true,
				immediate: true
			}
		},
		 
		mounted() {
			this.funcParseImage();
		},
		
		methods: {
			/**
			 * 展示大图
			 */
			funcShowImage(item) {
				this.$refs.previewImage.open(item)
			},
			
			/**
			 * 跳转到熬详情
			 */
			funcCustomerDetail() {
				this.$emit("click", this.source)
			},
			
			/**
			 * 解析图片
			 */
			funcParseImage() {
				if(this.source.images) {
					if(this.source.images instanceof Array) {
						this.attrImageList = this.source.images 
					} else {
						this.attrImageList = JSON.parse(this.source.images)
					}
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.baseView {
		width: 100%;
		background-color: white;
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
	
	.headerRightInfo {
		margin-left: 20rpx;
	}
	
	.record {
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.comments {
		padding: 20rpx;
		box-sizing: border-box;
		height: 100rpx;
		border-top: 1rpx #efeff4 solid;
		border-bottom: 20rpx #efeff4 solid;
		display: flex;
		align-items: center;
	}
	
	.address { 
		font-size: 22rpx;
		color: #6D6D72;
		margin-right: 10rpx;
	}
	
	.commentsImage {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	
	.edit {
		font-size: 20rpx;
		color: #e2b7b7;
		padding: 0rpx 20rpx;
	}
	
	.imageView {
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.images {
		width: 100rpx;
		height: 100rpx;
		margin-right: 10rpx;
	}
	
	.type {
		display: block;
		margin-left: 20rpx;
		width: 140rpx;
		border: 1rpx #c0b5b5 solid;
		border-radius: 60rpx;
		text-align: center;
		font-size: 24rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.addressMap {
		display: inline-block;
		background-color: #e8d7d7;
		color: #8e7878;
		margin-left: 20rpx;
		padding: 0rpx 10rpx;
		box-sizing: border-box;
		border-radius: 4rpx;
		font-size: 24rpx;
	}
	
	.company {
		top: 6rpx;
		width: 30rpx;
		height: 40rpx;
	}
</style>
