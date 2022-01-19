<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347"
			:y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="header">
			<view class="content">
				<text class="title">{{ attrSource && attrSource.title || "" }}</text>
				
				<text class="number">合同编号 {{ attrSource.number }}</text>
				
				<view class="infoView">
					<text>开始时间 {{ attrSource.start_date }}</text>
					<text>截止时间 {{ attrSource.end_date }}</text>
					<text>合同备注 {{ attrSource.remark }}</text>
				</view>
				<view class="imageBaseView">
					<image class="imageStyle" v-for="(item, index) in attrImages" :key="index" :src="item" mode="aspectFit" @click="funcShowImage(item)"></image>
				</view>
				<template v-if="attrPart">
					<view class="dashed"></view>
					<text class="orderTitle">对应订单信息</text>
					<view class="orderInfo" @click="funcPushDetail">
						<text>订单金额</text>
						<text class="price">¥{{ attrSource.order && attrSource.order.price}}</text>
						<text>客户: {{ attrSource.order && attrSource.order.customer && attrSource.order.customer.name }}</text>
						<text>下单日期: {{ attrSource.order && attrSource.order.created_at }}</text>
						<text>订单编号: {{ attrSource.order && attrSource.order.number }}</text>
				</view>
				</template>
			</view>
		</view>
		<previewImage ref="previewImage" :imgs="attrImages" ></previewImage>
	</view>
</template>

<script>
	import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	// API
	import Api from "../../apis/apis.js"
	// 工具类
	import utils from '../../common/utils.js'
	// 自定义页面【 popup弹出层 】
	import ChunLeiPopupsComponent from "@/components/chunLei-popups/chunLei-popups.vue";
	// mixin
	import Mixins from '../../mixins/mixin.vue'
	
	export default {
		mixins: [ Mixins ],
		data() {
			return {
				attrPart: true,
				attrId : void 0,
				attrSource : {},
				attrImages : [],
				attrShowPopUp: false,
				attrPopUpDataSource: [{
					icon: '',
					title: '编辑合同',
					index: 0
				},{
					icon: '',
					title: '删除合同',
					index: 1
				}],
			}
		},
		
		components: {
			PreviewImage,
			ChunLeiPopupsComponent
		},
		
		onLoad(options) {
			if(options.part) {
				this.attrPart = false
			} else {
				this.attrPart = true
			}
			this.attrId = options.id
		},
		
		onShow() {
			utils.funcDelay(1000, () => {
				this.funcGetDetail()
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			this.attrShowPopUp = true
		},
		
		methods: {
			/**
			 * 展示大图
			 */
			funcShowImage(item) {
				this.$refs.previewImage.open(item)
			},
			
			/**
			 * 跳转到详情
			 */
			funcPushDetail() {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${this.attrSource.order_id}`
				})
			},
			
			/**
			 * 删除合同
			 */
			funcDelectContract(item, index) {
				Api.deleteOrderContracts({
					id : this.attrId
				}).then(res => {
					if(res.error_code == 0) {
						this.funcShowToast('删除成功')
						utils.funcDelay(1000, () => {
							uni.navigateBack()
						})
					} else {
						this.funcShowToast('删除失败')
					}
				})
			},
			
			/**
			 * 获取详情
			 */
			funcGetDetail() {
				Api.getOrderContractsDetail({
					id : this.attrId
				}).then(res => {
					this.attrSource = res.data || {}
					if(!res.data) {
						uni.showToast({
							title : '数据无效',
							icon: 'none'
						})
						utils.funcDelay(1000, () => {
							uni.navigateBack()
						})
						return
					}
					if(res.data && res.data.images) {
						if(res.data.images instanceof Array) {
							this.attrImages = res.data && res.data.images
						} else {
							this.attrImages = JSON.parse(res.data.images)
						}
					} 
				})
			},

			/**
			 * 点击popup-item
			 */ 
			funcTapPopup(e) {
				const self = this;
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url: `./contractCreate?id=${this.attrId}&title=编辑合同`
						})
						break;
					case 1:
						self.funcDelectContract()
						break;
					default:
						break;
				}
			},
			
		},
	}
</script>

<style lang="less">
 .header {
	 background-color: #696976;
	 height: 400rpx;
 }	
 
 .title {
	padding-left: 20rpx; 
	font-size: 30rpx;
	font-weight: bold;
	display: inline-block;
	width: 100%;
	border-left: 6rpx #bed966 solid;
	margin-left: -20rpx;
 }
 
 .content {
	 background-color: white;
	 width: 100%;
	 height: 97%;
	 position: absolute;
	 width: calc(100% - 20rpx);
	left: 10rpx;
	border-radius: 10rpx;
	top: 20rpx;
	padding: 20rpx;
	box-sizing: border-box; 
 }
 
 .imageBaseView {
	margin-top: 20rpx;
	display: flex;
 }
 
 .imageStyle {
	 width: 100rpx;
	 height: 150rpx;
	 margin-left: 10rpx;
 }
 
 .infoView {
	 display: flex;
	 flex-direction: column;
	 text {
		 display: inline-block;
		 padding: 10rpx 0rpx;
	 }
 }
 
 .dashed {
	 margin-top: 60rpx;
	 border-top: 1rpx #e0bbbb dashed
 }
 
 .number {
	 color: #D9D9D9;
	 font-size: 20rpx;
	display: inline-block;
	padding: 20rpx 0rpx; 
 }
 
 .orderTitle {
	 display: inline-block;
	 padding: 20rpx;
 }
 
 .orderInfo {
	 display: flex;
	 flex-direction: column;
	 font-size: 20rpx;
	 background-color: #ede9e9;
	 border-radius: 10rpx;
	 padding: 20rpx;
	 text {
		 display: inline-block;
		 padding: 5rpx;
	 }
 }
 
 .price {
	 font-size: 28rpx;
	 font-weight: bold;
 }
</style>
