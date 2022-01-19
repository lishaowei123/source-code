<template>
	<view class="">
		<view class="headerView">
			<view class="headerImage">
				{{ attrSource.admin && funcSubName(attrSource.admin.name) || "获取中" }}
			</view>
			<view class="headerRightInfo">
				<view>{{ attrSource.admin && attrSource.admin.name || "" }}</view>
				<text class="time">{{ funcGetDate("MM-DD HH:mm",  attrSource.updated_at || "") }} </text>
			</view>
		</view>
		<view class="content">
			<text>{{ attrSource.title || "" }}</text>
			<view style="margin-top: 20rpx;">
				<text class="label">报销金额： </text>
				<text class="price"> {{ attrSource.total_price || 0 }}元</text>
			</view>
			<text class="label">备注：{{ attrSource.remark || "无" }}</text>
			<text class="ordersn">报销单号：{{ attrSource.order_sn || "" }}</text>
		</view>
		<view class="header"></view>
		<view class="headerDetail">
			<text>消费详情</text>
			<view class="">
				<text>{{ attrSource.singles && attrSource.singles.length }}笔消费</text>
				<text v-if="attrSource.price">,1项补助</text>
			</view>
		</view>
		
		<view class="expenseContent">
			<view class="cell" v-for="(item, index) in attrSource.singles" :key="index" @click="funcPushInfo(item)">
				<view class="cellContent">
					<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
					<view class="centerContent">
						<text>{{ item.type }}</text>
						<text>{{ item.date }}</text>
					</view>
					<text class="price">¥{{ item.price }}元</text>
				</view>
				<text class="addressMap" @click.stop="funcCustomerDetail" >
					<view style="background-color: #e8d7d7; display: inline-block; padding: 0rpx 10rpx;">
						<image class="company" src="../../static/gongsi.png" mode="widthFix"></image>
						<text>{{ item.customer && item.customer.name }}</text>
					</view>
				</text>
				<view class="imageBaseView">
					<image class="imageStyle" :src="it" v-for="(it, id) in item.imgs" :key="id" mode="scaleToFill" @click="funcShowImage(it, item.imgs)"></image>
				</view>
				<view class="">
				</view>
			</view>
		</view>
		
		<view class="subsidiesBox">
			<view class="subsidiesBoxLeft">
				<image class="subsidiesBoxLeftImage" src="../../static/buzhu.png" mode=""></image>
				<text>补助</text>
			</view>
			<text class="price">¥{{ attrSource.price }}元</text>
		</view>
		
		<view class="header"></view>
		
		<view class="headerDetail">
			<text>审批信息</text>
			<text class="payStatus0" v-if="attrSource.pay_status == 0">未支付</text>
			<text class="payStatus1" v-if="attrSource.pay_status == 1">已支付</text>
		</view>
		
		<customAppval-component 
			:source="attrSource.examines" 
			:originSource="attrSource" 
			:showSubTitle="false"
			startLabel="提交审批"
			endLabel="结束审批"
		/>
		
		<text class="undoText" @click="funcUndo" :class="attrShowFooter ? 'affiliated' : ''" v-if="attrShowUndo">撤销</text>
		
		<view style="height: 100rpx;"></view>
		
		<neil-modal
			:show="attrShowModal" 
		    @confirm="funcConfirm"
			@close="funcCloseModal" 
			:title="attrSelectType == 1 ? '同意' : attrSelectType == 2 ? '驳回' : ''" confirm-text="确定" cancel-text="取消">
		    <view style="min-height: 90upx;padding: 32upx 24upx;">
			   <textarea v-model="attrInfoSource.remark" placeholder="请输入原因" />
		    </view>
		</neil-modal>
		
		<view class="footer" v-if="attrShowFooter">
			<view class="success" @click="funcSuccess">
				同意
			</view>
			<view class="reject" @click="funcReject">
				驳回
			</view>
		</view>
		
		<view class="rejected" v-if="attrSource.status == 2" @click="funcPushDetail">
			已被驳回, 去修改
		</view>
		<view v-if="attrSource.pay_status == 0 && attrSource.status == 1">
			<view class="success1" v-if="attrIsOptions" @click="funcUpdate">
				标记为已支付
			</view>
		</view>
		<previewImage ref="previewImage" :imgs="attrImages" ></previewImage>
	</view>
</template>

<script>
	// API
	const userInfo = uni.getStorageSync('UserInfo')
	import CustomAppvalComponent from '@/components/custom-appval.vue'
	import Api from "../../apis/apis.js"
	import Mixins from '@/mixins/mixin.vue'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrImages: [],
				attrIsOptions: false,
				attrSelfPerson : uni.getStorageSync("UserInfo"),
				attrShowFooter: false,
				attrInfoSource: {
					remark : ''
				},
				attrSelectType: void 0,
				attrShowModal: false,
				attrSource : {},
				attrId : void 0,
				attrShowUndo: false,
			}
		},
		
		components: {
			neilModal,
			PreviewImage,
			CustomAppvalComponent
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
			}
		},
		
		onShow() {
			this.funcGetDetail()
		},
		
		methods: {
			
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
							Api.updateOrderSinglesDtail({
								id: self.attrId,
								status: 3
							}).then(res => {
								uni.navigateBack()
							});
						}
					}
				});
			},
			
			/**
			 * 是否展示撤销按钮
			 */
			funcShowUndo() {
				this.attrShowFooter = this.attrSource.is_sp
				if(this.attrSource.admin && this.attrSource.admin.id == userInfo.id && this.attrSource.status != 1 && this.attrSource.status != 3) {
					this.attrShowUndo = true
				}
				// if(this.attrSource.admin && this.attrSource.admin.id == userInfo.id && this.attrSource.status == 2) {
				// 	this.attrShowUndo = true
				// }
				if(this.attrSource.admin && this.attrSource.admin.id != userInfo.id) {
					this.attrShowUndo = false
				}
			},
			
			/**
			 * 更新
			 */
			funcUpdate() {
				Api.updateOrderSinglesDtail({
					id: this.attrId,
					pay_status: 1
				}).then(res => {
					this.funcGetDetail()
				});
			},
			
			
			/**
			 * 跳转详情
			 */
			funcPushInfo(item) {
				
				// if(this.attrSource.admin && this.attrSource.admin.id != userInfo.id) {
				// 	return
				// }
				
				// uni.navigateTo({
				// 	url : `./expenseCreate?id=${item.id}`
				// })
			},
			
			
			/**
			 * 跳转到详情
			 */
			funcPushDetail() {
				
				if(this.attrSource.admin && this.attrSource.admin.id != userInfo.id) {
					return
				}
				
				const data = {
					price: this.attrSource.price,
					remark: this.attrSource.remark,
					title: this.attrSource.title
				}
				uni.navigateTo({
					url : `./expenseCreateAccount?data=${JSON.stringify(this.attrSource.singles)}&baseSource=${JSON.stringify(data)}&edit=1&mainId=${this.attrSource.id}`
				})
			},
			
			/**
			 * 获取详情
			 */
			funcGetDetail() {
				Api.getOrderSinglesDtail({
					id : this.attrId
				}).then(res => {
					if(res.data.is_sp == 1) {
						this.attrShowFooter = true
					} else {
						this.attrShowFooter = false
					}
					// res.data.examines = res.data.examines.reverse()
					this.attrSource = res.data
					//是否可以操作标记支付
					this.attrIsOptions = res.data.cashier_id == this.attrSelfPerson.id
					
					this.attrSource && this.attrSource.singles && this.attrSource.singles.map((item, index) => {
						item.imgs = item.images ? JSON.parse(item.images) : []
					})
					
					this.funcShowUndo()
				})
			},
			
			/**
			 * 跳转到熬详情
			 */
			funcCustomerDetail() {
				const id = this.attrSource.singles[0] && this.attrSource.singles[0].customer_id
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${id}`
				})
			},
			
			/**
			 * 提交
			 */
			funcConfirm() {
				if(!this.attrInfoSource.remark) {
					if(this.attrSelectType == 2) {
						this.funcShowToast('请输入原因')
						return 
					}
				}
				Api.agreeExamines({
					status : this.attrSelectType,
					source_id: this.attrId,
					remark : this.attrInfoSource.remark
				}).then(res => {
					this.attrShowModal = false
					this.funcGetDetail()
				});
			},
			
			/**
			 * 展示大图
			 */
			funcShowImage(item, imgs) {
				this.attrImages = imgs
				this.$refs.previewImage.open(item)
			},
			
			/**
			 * 关闭弹窗
			 */
			funcCloseModal() {
				this.attrShowModal = !this.attrShowModal
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
		},
	}
</script>

<style lang="less" scoped>
	
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
		margin-left: 20rpx;
	}
	
	.record {
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.headerDetail {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		height: 80rpx;
		justify-content: space-between;
		background-color: #fef9f9
	}
	
	.content {
		background-color: white;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.expenseContent {
		background-color: white;
	}
	
	.ordersn {
		font-size: 24rpx;
		float: right;
		color: #b3a1a1;
	}
	
	.cell {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		border-top: 1rpx #ededed solid;
	}
	
	.icon {
		width: 80rpx;
	}
	
	.centerContent {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.price {
		color: #b3a1a1;
		// color: #FFA200;
	}
	
	.cellContent {
		box-sizing: border-box;
		display: flex;
		background-color: white;
		align-items: center;
	}
	
	.addressMap {
		display: inline-block;
		color: #8e7878;
		margin-left: 98rpx;
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
	
	.subsidiesBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
		border-top: 1rpx #ededed solid;
	}
	
	.subsidiesBoxLeft {
		display: flex;
		align-items: center;
	}
	
	.subsidiesBoxLeftImage {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	
	.header {
		width: 100%;
		background-color: #f0eff3;
		height: 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
	
.footer {
    background-color: white;
	position: fixed;
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

.rejected {
	height: 80rpx;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ff8700;
	color: white;
}

.success1 {
	.rejected();
	background-color: #28c728;
}

.payStatus0 {
	background-color: #ffa40c;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100rpx;
	border-radius: 50px;
	color: white;
}

.payStatus1 {
	.payStatus0();
	background-color: #46be33;
}

.time {
	font-size: 24rpx;
}

.label {
	font-size: 24rpx;
	color: #b3a1a1;
}

.undoText {
	color: red;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background-color: white;
	text-align: center;
	display: flex;	
	align-items: center;
	justify-content: center;
}

.affiliated {
	margin-bottom: 40rpx;
	border-bottom: 20rpx whitesmoke solid;
}

 .imageBaseView {
	margin-top: 20rpx;
	display: flex;
	margin-left: 100rpx;
 }
 
 .imageStyle {
 	 width: 100rpx;
 	 height: 100rpx;
 	 margin-left: 10rpx;
 }
 
</style>
