<template>
	<view class="container">
		<view class="personItem">
			<text class="itemLabel">商品名称</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.name" />
		</view>
		<view class="personItem">
			<text class="itemLabel">商品编号</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.number" />
		</view>
		<view class="personItem">
			<text class="itemLabel">销售价</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.price" />
		</view>
		<view class="personItem">
			<text class="itemLabel">状态</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.status" />
		</view>
		<view class="personItem">
			<text class="itemLabel">商品分类</text>
			<input class="iteminput" disabled type="text" v-model="attrSource.category && attrSource.category.name" />
		</view>
		<view class="personItemTextArea">
			<text class="itemLabel">商品描述</text>
			<view class="uni-textarea" style="minHeight:200rpx;padding:10rpx;">
				<textarea disabled style="minHeight:200rpx" v-model="attrSource.describe" auto-height maxlength=-1 />
			</view>
		</view>
		
		<view class="imageBaseView">
			<image class="image" v-for="(item, index) in attrImageList" :key="index" :src="item"></image>
		</view>
	</view>
</template>

<script>
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrGoodsId : void 0,
				attrSource : {},
				attrImageList : []
			}
		},
		
		onLoad(options) {
			this.attrGoodsId = options.id
			this.funcGetGoodsInfo()
		},
		
		methods: {
			/**
			 * 获取商品详情
			 */
			funcGetGoodsInfo() {
				Api.getGoodsDetail({
					id : this.attrGoodsId
				}).then(res => {
					this.attrSource = {
						...res.data,
						price : res.data.price + '/' + res.data.unit,
						status : res.data.status == 0 ? '下架中' : res.data.status == 1 ? "上架中" :  ""
					}
					if(res.data.images) {
						this.attrImageList = JSON.parse(res.data.images)
					}
				})
			},
		},
	}
</script>

<style lang="less">
	
	.personItem {
		display: flex;
		align-items: center;
		min-height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		background-color: white;
	}
	
	.personItemTextArea {
		 .personItem();
		 font-size: 28rpx;
		 align-items: baseline;
	 }
	 
	.itemLabel {
		width: 150rpx;
		flex-shrink: 0;
	}
	
	.iteminput {
		margin-left: 20rpx;
		flex: 1;
		font-size: 28rpx;
	}
	
	.imageBaseView {
		padding: 20rpx;
		box-sizing: border-box;
		width: 100%;
		background-color: white;
	}
	
	.image {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}
</style>
