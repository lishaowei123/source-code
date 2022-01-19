<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347"></chunLei-popups>
		<view class="baseView" @click="funcPushGoodDetail">
			<view class="baseViewLeft">
				<text class="title">{{ attrSource && attrSource.name || "" }}</text>
				<text>{{ attrSource.number || "" }}</text>
				<text class="price">销售价：{{ attrSource.price || "" }}</text>
				<text>状态：{{ attrSource && attrSource.status == 0 ? '下架中' : attrSource.status == 1 ? "上架中" :  "" }}</text>
				<text>分类：{{ attrSource && attrSource.category && attrSource.category.name || "" }}</text>
			</view>
			<view class="baseViewRight">
				<uni-icons :style="{color: 'white'}" type="arrowright"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	// 工具类
	import utils from '../../common/utils.js'
	// 自定义页面【 popup弹出层 】
	import ChunLeiPopupsComponent from "@/components/chunLei-popups/chunLei-popups.vue";
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrPopUpDataSource: [{
					icon: '',
					title: '编辑商品',
					index: 0
				}, {
					icon: '',
					title: '删除商品',
					index: 1
				}],
				attrShowPopUp: false,
				attrGoodsId : void 0,
				attrSource : {}
			}
		},
		
		components: {
			ChunLeiPopupsComponent
		},
		
		onLoad(options) {
			this.attrGoodsId = options.id
		},
		
		onShow() {
			this.funcGetGoodsInfo()
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			this.attrShowPopUp = true
		},
		
		methods: {
			/**
			 * 点击popup-item
			 */
			funcTapPopup(e) {
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url : `./goodsDetailCreate?type=1&id=${this.attrGoodsId}`
						})
						break;
					case 1:
						uni.showModal({
							title: '',
							content: '是否删除改商品',
							confirmText: "是",
							cancelText: "否",
							success: res => {
								if (res.confirm) {
									this.funcDelectGoods()
								}
							}
						});
						break;
					default:
						break;
				}
			},
			
			/**
			 * 删除商品
			 */
			funcDelectGoods() {
				Api.deleteGoods({
					id : this.attrGoodsId
				}).then(res => {
					if(res.error_code == 0) {
						uni.showToast({
							title : '删除成功',
							icon : 'none'
						})
						utils.funcDelay(1000, () => {
							uni.navigateBack()
						})
					} else {
						uni.showToast({
							title : res.error_msg || "失败",
							icon : 'none'
						})
					}
				})
			},
			
			/**
			 * 获取商品详情
			 */
			funcGetGoodsInfo() {
				Api.getGoodsDetail({
					id : this.attrGoodsId
				}).then(res => {
					if(res.error_code == 0) {
						this.attrSource = res.data
					} else {
						uni.showToast({
							title : res.error_msg || "失败",
							icon : 'none'
						})
					}
				})
			},
			
			/**
			 * 跳转到详
			 */
			funcPushGoodDetail() {
				uni.navigateTo({
					url : `./goodsDetail?id=${this.attrGoodsId}`
				})
			}
		},
	}
</script>

<style lang="less">
	.baseView {
		width: 100%;
		background-color: #7575bd;
		display: flex;
		color: white;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 20rpx;
	}
	
	.baseViewLeft {
		display: flex;
		flex-direction: column;
	}
	
	.title {
		font-size: 30rpx;
	}
	
	.price {
		margin-top: 20rpx;
	}
	
	.baseViewRight {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
</style>
