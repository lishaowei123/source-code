<template>
	<view class="container">
		<view class="address">
			<text>{{ attrDate }}</text>
			<view class="locationBox">
				<image class="locationImage" src="../../static/app-plus/location@3x.png" mode="widthFix"></image>
				<text>{{ attrAddress }}</text>
			</view>
		</view>
		
		<view class="createItem">
			<view class="item" @click="funcGetCustomerInfo">
				<text class="label">拜访客户</text>
				<view class="valueBox">
					<text class="value">{{ attrBaseSource.name }}</text>
					<image class="arrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="createItem noteBox" style="minHeight : 200rpx">
			<textarea class="itemTextarea"  :style="{minHeight: '200rpx'}" v-model="attrBaseSource.record" placeholder="请输入拜访总结" auto-height maxlength="-1" />
		</view>
		
		<view class="trackingView">
			<view class="imageBaseView">
				<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item" mode='aspectFill' />
				<view class="imageItemAdd" @click="funcGetPhotoImages">
					<image src="../../static/up.jpg" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 工具类
import utils from '../../common/utils.js';
// 事件处理
import EventBus from '../../common/bus.js'
// API
import Api from "../../apis/apis.js"
// Mixins
import Mixins from '@/mixins/mixin.vue'
export default {
	mixins : [Mixins],
	data() {
		const currentDate = utils.funcGetDate(2)
		return {
			attrImageList : [],
			attrDate : currentDate,
			attrTimer : void 0,
			attrBaseSource : {
				record : '',
				name : ''
			},
			attrCustomInfo : {},
			attrLocation : {},
			attrAddress : "获取中",
			
		};
	},
	
	onLoad() {
		this.funcGetLocation()
	},
	
	mounted() {
		/**
		 * 获取客户名称
		 */ 
		EventBus.$on('SELECTCUSTOMER', (e) => {
			this.attrBaseSource.name = e.name || ''
			this.attrCustomInfo = e
		}) 
	},

	// 页面周期与 onLoad 同级
	onBackPress(e) {
		if (e.from == 'backbutton') {
			uni.showModal({
				title: '是否取消创建',
				content: '',
				cancelText: "取消", 
				confirmText: "确定", 
				showCancel: true, 
				confirmColor: '#f55850',
				cancelColor: '#39B54A', 
				success: function (res) {
					if (res.confirm) {
						uni.navigateBack({
							delta: 1
						});
					} 
				}
			});
			return true; 
		}
	},
		
	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		
		const params = {
			customer_id : this.attrCustomInfo.id,
			record : this.attrBaseSource.record,
			visit_date : "",
			images : JSON.stringify(this.attrImageList),
			type: 2,
			map : this.attrAddress,
			longitude : this.attrLocation.longitude,
			latitude : this.attrLocation.latitude
		}
		
		if(!params.customer_id) {
			uni.showToast({
				title : '拜访客户不能为空',
				icon : 'none'
			})
			return
		}
		
		if(!params.longitude || !params.latitude) {
			uni.showToast({
				title : '未获取到定位信息',
				icon : 'none'
			})
			return
		}
		
		Api.createCustomerFollows(params).then(res => {
			if(res.error_code == 0) {
				uni.showToast({
					title : '创建成功',
					icon : 'none'
				})
				uni.navigateBack()
			} else {
				uni.showToast({
					title : res.error_msg || "失败",
					icon : 'none'
				})
			}
		})
	},

	destroyed() {
		clearInterval(this.attrTimer)
		this.attrTimer = null
	},

	methods: { 
		/**
		 * 获取定位
		 */
		funcGetLocation() {
			const self = this;
			uni.getLocation({
			    type: 'gcj02',
				geocode: true,
			    success: function (res) { 
					// #ifdef APP-PLUS
						const address = res.address || {}
						self.attrAddress = address.city + address.street + address.streetNum + address.poiName
					// #endif
					self.attrLocation = {
						longitude : res.longitude, 
						latitude : res.latitude
					}
					clearInterval(self.attrTimer)
			    }, 
				fail(err) {
					if(err.errMsg.includes("getLocation:fail [geolocation:12]缺少定位权限")) {
						uni.showToast({
							title : '请开启定位',
							icon: 'none'
						})
						self.attrTimer = setInterval(() => {  
							clearInterval(self.attrTimer)
							self.funcGetLocation()
						}, 5000)
					} 
				}
			});   
		},
		
		/**
		 * 获取相册
		 */
		funcGetPhotoImages() {
			this.funcGetPhoto((data) => {
				this.attrImageList = this.attrImageList.concat(data)
			})
		},
		
		/**
		 * 获取客户名称
		 */
		funcGetCustomerInfo() {
			uni.navigateTo({
				url:"../pageCustomer/customerList?title=选择我的客户"
			})
		}
	}
};
</script>

<style lang="less" scoped>
	
.itemLabel {
	width: 150rpx;
}

.mainTitle {
	display: flex;
	align-items: flex-end;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #f1f1f1;
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
}

.createItem {
	display: flex;
	align-items: center;
	min-height: 100rpx;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #eee9e9 solid;
	background-color: white;
	border-top: 20rpx #f1f1f1 solid;

	.item {
		padding: 10rpx 0rpx;
		flex: 1;
		display: flex;
		justify-content: space-between;
	}

	.label {
		flex-shrink: 0;
		width: 200rpx;
		height: 22px;
	}

	.valueBox {
		display: flex;
		align-items: center;
	}

	.value {
		flex: 1;
	}

	.arrow {
		transform: rotate(-90deg);
		width: 36rpx;
		height: 36rpx;
	}
}

.itemInput {
	font-size: 28rpx;
	margin-left: 20rpx;
	flex: 1;
}

.itemTextarea {
	font-size: 28rpx;
	padding: 10rpx 0rpx;
	margin-left: 20rpx;
}

.noteBox {
	border-top: 20rpx #f1f1f1 solid;
	padding: 20rpx 0rpx;
	min-height: 300rpx;
	display: flex;
	align-items: baseline;
	
}

	
.imageBaseView {
	display: flex;
	flex-wrap: wrap;
	padding: 0rpx 20rpx 20rpx 20rpx;
	background-color: white;
	border-bottom: 20rpx #f1f1f1 solid;
}

.imageItem {
	width: 100rpx;
	height: 100rpx;
	border-radius: 5rpx;
	margin-right: 18rpx;
	margin-top: 10rpx;
}

.custom-picker-base-view {
	position: fixed;
	bottom: 0rpx;
    background-color: white;
	z-index: 2;
}

.custom-picker-slot {
	width: 100%;
	height: 80rpx;
	display: flex;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	border-bottom: 1px #F5F5F5 solid;
}

.custom-picker-slot-cancel {
	color: #333333;
	font-size:26rpx;
	font-family:PingFang SC;
	font-weight:400;
	color:rgba(51,51,51,1);
	line-height:34px;
}

.custom-picker-slot-confirm {
	.custom-picker-slot-cancel();
	color: #ff7145;
}

.address {
	padding: 20rpx 0rpx;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.imageBaseView {
	display: flex;
	flex-wrap: wrap;
	padding: 0rpx 20rpx 20rpx 20rpx;
	background-color: white;
	border-bottom: 20rpx #f1f1f1 solid;
}

.imageItem {
	width: 100rpx;
	height: 100rpx;
	border-radius: 5rpx;
	margin-right: 18rpx;
	margin-top: 10rpx;
}

.imageItemAdd {
	padding: 6rpx;
	box-sizing: border-box;
	border: 1rpx #e5dcdc dashed;
	width: 100rpx;
	height: 100rpx;
	border-radius: 5rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10rpx;
}

.locationBox {
	display: flex;
}

.locationImage {
	width: 60rpx;
	height: 60rpx;
	display: inline-block;
}
</style>
