<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="contentView">
			<view class="headerView">
				<view class="headerImage">
					{{ attrSource && attrSource.admin && attrSource.admin.name || "获取中" }}
				</view>
				<view class="headerRightInfo">
					<view>{{ attrSource && attrSource.admin && attrSource.admin.name  || "获取中" }}</view>
					<text class="address">{{ attrSource && attrSource.created_at || "获取中" }} </text>
				</view>
			</view>
			<view class="content">
				<template v-if="attrType == 2">
					<text class="">回款信息确认</text>
					<view class="infoView">
						<text>回款金额 ¥ {{ attrSource.price }}</text>
						<text>回款时间 {{ attrSource.date }}</text>
						<text>回款方式 {{ attrSource.paytype && attrSource.paytype.name }}</text>
						<text>归属人员 {{ attrSource && attrSource.admin && attrSource.admin.name }}</text>
						<text>回款备注 {{ attrSource.remark }}</text>
					</view>
				</template>
				<text class="orderTitle">对应订单信息</text>
				<view class="orderInfo" @click="funcPushOrderInfo">
					<text>订单金额</text>
					<text class="price">¥{{ attrSource.order && attrSource.order.price }}</text>
					<text>客户: {{ attrSource.order && attrSource.order.customer && attrSource.order.customer.name }}</text>
					<text>下单日期: {{ attrSource && attrSource.order && attrSource.order.created_at }}</text>
					<text>订单编号: {{ attrSource && attrSource.order && attrSource.order.number }}</text>
				</view>
				<view class="imageBaseView"><image class="imageStyle" v-for="(item, index) in attrImages" :key="index" :src="item" mode="aspectFit"></image></view>
				<view class="dashed"></view>
			</view>
			<!-- <view class="clearance"></view> -->
			<view class="approval">
				<view>审批信息</view>
			</view>
			
			<customAppval-component :source="attrSource.examines" :originSource="attrSource" />
			
			<view class="clearance" v-if="attrShowUndo || attrShowModify"></view>
			
			<view class="undo" v-if="attrShowUndo || attrShowModify">
				<text class="undoText" @click="funcUndo" v-if="attrShowUndo">撤销</text>
				<text class="undoText" @click="funcModify" v-if="attrShowModify" style="color:#ff7145">修改</text>
			</view>
			
			<view class="clearance"></view>
			
			<view class="footer" v-if="attrShowFooter">
				<view class="success" @click="funcSuccess">
					同意
				</view>
				<view class="reject" @click="funcReject">
					驳回
				</view>
			</view>
			
		</view>

		<neil-modal 
			:show="attrShowModal" 
		    @confirm="funcConfirm"
			@close="funcCloseModal" 
			:title="attrSelectType == 1 ? '同意' : attrSelectType == 2 ? '驳回' : ''" confirm-text="确定" cancel-text="取消">
		    <view style="min-height: 90upx;padding: 32upx 24upx;">
			   <textarea v-model="attrInfoSource.remark" placeholder="请输入备注(选填)" />
		    </view>
		</neil-modal>
	</view>
</template>

<script>
// API
import Api from '../../apis/apis.js';
// 工具类
import utils from '../../common/utils.js';
// 自定义页面【 popup弹出层 】
import ChunLeiPopupsComponent from '@/components/chunLei-popups/chunLei-popups.vue';
// mixin
import Mixins from '../../mixins/mixin.vue';
import neilModal from '@/components/neil-modal/neil-modal.vue';
import CustomAppvalComponent from '@/components/custom-appval.vue'

const userInfo = uni.getStorageSync('UserInfo')
export default {
	mixins: [Mixins],
	data() {
		return {
			attrInfoSource: {
				remark : ''
			},
			attrSelectType : 1,
			attrShowModal : false,
			attrShowFooter: false,
			attrType : void 0,
			attrId: void 0,
			attrSource: {},
			attrImages: [],
			attrShowPopUp: false,
			attrShowUndo: false,
			attrShowModify: false,
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
		neilModal,
		CustomAppvalComponent,
		ChunLeiPopupsComponent
	},

	onLoad(options) {
		this.attrType = options.type
		this.attrId = options.id;
	},

	onShow() {
		this.funcGetInterface()
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		this.attrShowPopUp = true;
	},

	methods: {
		/**
		 * 修改
		 */
		funcModify() {
			uni.navigateTo({
				url : `../pageOrder/orderCreate?id=${this.attrSource.id}`
			})
		},
		
		/**
		 * 撤销
		 */
		funcUndo() {
			const self = this
			uni.showModal({
				title: '是否撤销',
				content: '',
				cancelText: '取消',
				confirmText: '确定',
				showCancel: true,
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: function(res) {
					if (res.confirm) {
						Api.agreeOrderCx({
							id: self.attrSource.id
						}).then(res => {
							uni.navigateBack()
						});
					}
				}
			});
		},
		
		/**
		 * 获取数据
		 */
		funcGetInterface() {
			const self = this;
			utils.funcDelay(1000, () => {
				// 1是合同审核2是回款审批3是退款审批4是订单审批
				if(self.attrType == 1) {
					self.funcGetContractDetail()
				} else if(self.attrType == 2) {
					self.funcGetReceivableDetail()
				} else if(self.attrType == 3) {
					self.funcGetDetail();
				} else {
					self.funcGetOrdersDetail()
				}
				
			});
		},
		
		/**
		 * 是否展示撤销按钮
		 */
		funcShowUndo() {
			this.attrShowFooter = this.attrSource.is_sp
			
			if(this.attrType != 4 || this.attrSource.status == 1) {
				this.attrShowModify = false
				this.attrShowUndo = false
				return
			}
			
			if(this.attrSource.admin && this.attrSource.admin.id == userInfo.id && this.attrSource.status == 0) {
				this.attrShowUndo = true
				this.attrShowModify = true
			}
			if(this.attrSource.admin && this.attrSource.admin.id == userInfo.id && this.attrSource.status == 2) {
				this.attrShowUndo = false
				this.attrShowModify = true
			}
			
			if(this.attrSource.admin && this.attrSource.admin.id != userInfo.id) {
				this.attrShowUndo = false
				this.attrShowModify = false
			}
		},
		
		/**
		 * 提交
		 */
		funcConfirm() {
			Api.agreeExamines({
				status : this.attrSelectType,
				source_id: this.attrId,
				remark : this.attrInfoSource.remark
			}).then(res => {
				this.attrShowModal = false
				this.funcGetInterface()
			});
		},
		
		/**
		 * 
		 */
		funcCloseModal() {
			this.attrShowModal = !this.attrShowModal
		},

		/**
		 * 获取订单详情
		 */
		funcGetOrdersDetail() {
			Api.getOrdersDetail({
				id : this.attrId
			}).then(res => {
				if (res.error_code == 0) {
					const data = {
						price : res.data.price,
						customer : res.data.customer,
						created_at : res.data.created_at,
						number: res.data.number
					}
					this.attrSource = res.data
					this.$set(this.attrSource, 'order', data)
					this.funcShowUndo()
				} else {
					this.funcShowToast('获取失败');
				}
			});
		},
		
		/**
		 * 获取合同详情
		 */
		funcGetContractDetail() {
			Api.getOrderContractsDetail({
				id : this.attrId
			}).then(res => {
				this.attrSource = res.data || {}
				this.funcShowUndo()
				if(res.data && res.data.images) {
					if(res.data.images instanceof Array) {
						this.attrImages = res.data.images
					} else {
						this.attrImages = JSON.parse(res.data.images)
					}
				} 
			})
		},
		
		/**
		 * 获取详情
		 */
		funcGetReceivableDetail() {
			Api.orderPaymentOrdersDetail({
				id: this.attrId
			}).then(res => {
				this.attrSource = res.data || {};
				this.funcShowUndo()
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
		 * 跳转到订单信息
		 */
		funcPushOrderInfo(item) {
			uni.navigateTo({
				url : `../pageOrder/orderInfo?id=${this.attrSource.order_id || this.attrSource.id}`
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
				this.attrSource = res.data || {};
				this.funcShowUndo()
				if (res.data && res.data.images) {
					if (res.data.images instanceof Array) {
						this.attrImages = res.data.images;
					} else {
						this.attrImages = JSON.parse(res.data.images);
					}
				}
			});
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
		},
		
		/**
		 * 通过
		 */
		funcSuccess() {
			this.attrInfoSource = {
				remark : ''
			}
			this.attrSelectType = 1
			this.funcCloseModal()
		},
		
		/**
		 * 拒绝
		 */
		funcReject() {
			this.attrInfoSource = {
				remark : ''
			}
			this.attrSelectType = 2
			this.funcCloseModal()
		}
	}
};
</script>

<style lang="less" scoped>
uni-page-body {
	background-color: #FFFFFF !important;
	width: 100%;
	height: 100%;
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
	// padding-bottom: 120rpx;
	overflow: auto;
	width: 100%;
	// height: 97%;
	position: absolute;
	width: 100%;
	border-radius: 10rpx;
	background-color: white;
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
	padding: 20rpx 0rpx;
	box-sizing: border-box;
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

.headerView {
	display: flex;
	padding: 20rpx;
	box-sizing: border-box;
    border-bottom: 1px #ffe7e7 solid;
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

.footer {
    background-color: white;
	// position: fixed;
	bottom: 0rpx;
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	text-align: center;
	color: white;
	line-height: 100rpx;
	font-size: 30rpx;
}

.success {
	border-radius: 5rpx;
	width: 45%;
	height: 90rpx;
	background-color: #28c728;
}

.reject {
	.success();
	background-color: #db7319;
}

.approval {
	height: 100rpx;
	display: flex;
	padding:20rpx;
	border-bottom: 1rpx #f3e4e4 solid;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}

.undo {
	color: red;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background-color: white;
	text-align: center;
	display: flex;	
}

.undoText {
	flex: 1;
}

.clearance {
	border-top: 20rpx #efeff4 solid;
}

</style>
