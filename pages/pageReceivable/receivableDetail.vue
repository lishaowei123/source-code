<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="contentView">
			<view class="header" @click="funcPushProgress">
				<text>{{ attrSource && attrSource.status == 0 ? '未确认' : attrSource.status == 1 ? '已确认' : '' }}</text>
				<uni-icons type="arrowright"></uni-icons>
			</view>
			<view class="content">
				<text class="number">回款金额(元)</text>
				<text class="money">¥ {{ attrSource.price }}</text>
				<view class="infoView">
					<text>回款时间 {{ attrSource.date }}</text>
					<text>回款方式 {{ attrSource.paytype && attrSource.paytype.name }}</text>
					<text>归属人员 {{ attrSource.admin && attrSource.admin.name }}</text>
					<text>回款备注 {{ attrSource.remark }}</text>
				</view>
				<view class="imageBaseView"><image class="imageStyle" v-for="(item, index) in attrImages" :key="index" :src="item" mode="aspectFit" @click="funcShowImage(item)"></image></view>
				<view class="dashed"></view>
				<text class="orderTitle">对应订单信息</text>
				<view class="orderInfo" @click="funcPushOrderInfo">
					<text>订单金额</text>
					<text class="price">¥{{ attrSource.order && attrSource.order.price }}</text>
					<text>客户: {{ attrSource.order && attrSource.order.customer && attrSource.order.customer.name }}</text>
					<text>下单日期: {{ attrSource.order && attrSource.order.created_at }}</text>
					<text>订单编号: {{ attrSource.order && attrSource.order.number }}</text>
				</view>
			</view>
		</view>
		<previewImage ref="previewImage" :imgs="attrImages" ></previewImage>
	</view>
</template>

<script>
import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
// API
import Api from '../../apis/apis.js';
// 工具类
import utils from '../../common/utils.js';
// 自定义页面【 popup弹出层 】
import ChunLeiPopupsComponent from '@/components/chunLei-popups/chunLei-popups.vue';
// mixin
import Mixins from '../../mixins/mixin.vue';
const userInfo = uni.getStorageSync('UserInfo')
export default {
	mixins: [Mixins],
	data() {
		return {
			attrId: void 0,
			attrSource: {},
			attrImages: [],
			attrShowPopUp: false,
			attrPopUpDataSource: [
				{
					icon: '',
					title: '编辑回款',
					index: 0
				// },
				// {
				// 	icon: '',
				// 	title: '作废回款',
				// 	index: 1
				}
			]
		};
	},

	components: {
		PreviewImage,
		ChunLeiPopupsComponent
	},

	onLoad(options) {
		this.attrId = options.id;
	},

	onShow() {
		utils.funcDelay(1000, () => {
			this.funcGetDetail();
		});
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		if(userInfo.id == this.attrSource.admin_id) {
			this.attrShowPopUp = true;
		}
	},

	methods: {
		/**
		 * 展示大图
		 */
		funcShowImage(item) {
			this.$refs.previewImage.open(item)
		},
		
		/**
		 * 跳转到订单信息
		 */
		funcPushOrderInfo(item) {
			uni.navigateTo({
				url : `../pageOrder/orderInfo?id=${this.attrSource.order_id}`
			})
		},
		
		/**
		 * 删除合同
		 */
		funcDelectPaymentOrdersDetail(item, index) {
			Api.deleteOrderPaymentOrders({
				id: this.attrId
			}).then(res => {
				if (res.error_code == 0) {
					this.funcShowToast('删除成功');
					utils.funcDelay(1000, () => {
						uni.navigateBack();
					});
				} else {
					this.funcShowToast('删除失败');
				}
			});
		},

		/**
		 * 获取详情
		 */
		funcGetDetail() {
			Api.orderPaymentOrdersDetail({
				id: this.attrId
			}).then(res => {
				this.attrSource = res.data;
				if(userInfo.id != this.attrSource.admin_id) {
					// #ifdef APP-PLUS
						const webView = this.$mp.page.$getAppWebview();
						webView.setTitleNViewButtonStyle(0, {
							text : ""
						}); 
					// #endif
				}
				
				if (res.data.images) {
					if (res.data.images instanceof Array) {
						this.attrImages = res.data.images;
					} else {
						this.attrImages = JSON.parse(res.data.images);
					}
				}
			});
		},
		
		/**
		 * 跳转到审批流程
		 */
		funcPushProgress() {
			uni.navigateTo({
				url : `./receivableProcess?id=${this.attrId}&type=2&show=${this.attrSource.status}`
				// url : `./receivableProcess?id=${this.attrId}`
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
						url: `./receivableCreate?id=${this.attrId}&title=编辑回款`
					});
					break;
				case 1:
					self.funcDelectPaymentOrdersDetail();
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="less" scoped>
uni-page-body {
	background-color: #4b4bb8 !important;
	width: 100%;
	height: 100%;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #272786;
	background-color: #6abcd5;
	height: 40px;
	padding: 10px;
	box-sizing: border-box;
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

.contentView {
	overflow: auto;
	background-color: white;
	width: 100%;
	height: 97%;
	position: absolute;
	width: calc(100% - 20rpx);
	left: 10rpx;
	border-radius: 10rpx;
	top: 20rpx;
}

.content {
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
	border-top: 1rpx #e0bbbb dashed;
}

.number {
	color: #d9d9d9;
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

.money {
	display: block;
	color: #8d9c2c;
	font-size: 40rpx;
}

.price {
	font-size: 28rpx;
	font-weight: bold;
}
</style>
