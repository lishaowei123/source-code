<template>
	<view class="createPersonBaseView">
		<!-- 客户信息 -->
		<view class="header"></view>

		<view class="personItem">
			<text class="itemLabel">金额 ¥</text>
			<input class="iteminput" type="number" v-model="attrBaseView.price" placeholder="请输入金额" />
		</view>

		<view class="personItem">
			<view class="personArrowItem" @click="funcPushType">
				<text class="itemLabel">消费类型</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrBaseView.type.title }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="personItem">
			<view class="personArrowItem" @click="funcShowPicker">
				<text class="itemLabel">消费日期</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrBaseView.date }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="header"></view>

		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectCustomer">
				<text class="itemLabel">客户</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrBaseView.person && attrBaseView.person.name }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="header"></view>

		<view class="personItem">票据图片</view>

		<view class="imageBaseView">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item" mode="aspectFill" @click="funcShowImage(item)"/>
			<view class="imageItemAdd" @click="funcGetPhotoImages"><image src="../../static/up.jpg" mode="widthFix"></image></view>
		</view>

		<view class="personItem">
			<text class="itemLabel">描述</text>
			<input class="iteminput" type="text" v-model="attrBaseView.remark" placeholder="请输入客户备注" />
		</view>
		
		<view class="header"></view>
		<view class="delete" v-if="attrId" @click="funcDelete">
			删除
		</view>

		<view class="custom-picker-base-view" v-if="attrShowPicker">
			<custom-priker-view :range="['2018-01-01', '2025-12-31']" :select="attrDate" @confrim="funcChangeDate" @cancel="funcShowPicker">
				<!-- #ifndef APP-PLUS -->
				<view class="custom-picker-slot">
					<view class="custom-picker-slot-cancel">取消</view>
					<text class="custom-picker-slot-confirm">确定</text>
				</view>
				<!-- #endif -->
			</custom-priker-view>
		</view>
		
		<previewImage ref="previewImage" :imgs="attrImageList" ></previewImage>
	</view>
</template>

<script>
// 工具类
import utils from '../../common/utils.js';
// 事件处理
import EventBus from '../../common/bus.js';
// 自定义选择时间组件
import CustomPrikerView from '@/components/custom-picker-view/custom-picker-view.vue';
// API
import Api from '../../apis/apis.js';
// Mixins
import Mixins from '@/mixins/mixin.vue';

import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';

export default {
	mixins: [Mixins],
	data() {
		const currentDate = this.funcGetDate();
		return {
			attrId : void 0,
			attrImageList: [],
			attrShowPicker: false,
			attrDate: currentDate,
			attrBaseView: {
				type: {},
				person: {},
				price: '',
				date: '',
				remark: ''
			}
		};
	},
	
	onLoad(options) {
		if(options.id) {
			this.attrId = options.id
			uni.setNavigationBarTitle({
				title : '编辑消费记录'
			})
			this.funcGetDtail()
		}
	},

	components: {
		PreviewImage,
		CustomPrikerView
	},

	mounted() {
		/**
		 * 获取客户名称
		 */
		EventBus.$on('SELECTCUSTOMER', e => {
			this.attrBaseView.person = e;
		});

		/**
		 * 获取报销类型
		 */
		EventBus.$on('SELECTCONSUMPTIONTYPE', e => {
			this.attrBaseView.type = e;
		});
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		const params = {
			id: this.attrId,
			price: this.attrBaseView.price,
			type: this.attrBaseView.type.title,
			date: this.attrBaseView.date,
			customer_id: this.attrBaseView && this.attrBaseView.person && this.attrBaseView.person.id || '',
			images: JSON.stringify(this.attrImageList),
			remark: this.attrBaseView.remark
		};
		
		if(!params.price) {
			this.funcShowToast('请输入消费金额')
			return
		}
		
		if(!params.type) {
			this.funcShowToast('请选择消费类型')
			return
		}
		
		if(!params.date) {
			this.funcShowToast('请选择消费日期')
			return
		}
		
		// if(!params.customer_id) {
		// 	this.funcShowToast('请选择公司')
		// 	return
		// }
		
		let apiName = "createSingles"
		if(this.attrId) {
			apiName = "updateSingles"
		}
		Api[apiName](params).then(res => {
			if (res.error_code == 0) {
				uni.navigateBack();
				EventBus.$emit("UPDATESINGLES", params)
			} else {
				uni.showToast({
					title: res.error_msg || '失败',
					icon: 'none'
				});
			}
		});
	},

	// 页面周期与 onLoad 同级
	onBackPress(e) {
		if (e.from == 'backbutton') {
			uni.showModal({
				title: this.attrId ? '是否取消编辑' : '是否取消创建',
				content: '',
				cancelText: '取消',
				confirmText: '确定',
				showCancel: true,
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: function(res) {
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

	methods: {
		/**
		 * 删除
		 */
		funcDelete() {
			Api.deleteSingles({
				id : this.attrId
			}).then(res => {
				if(!res.error_code) {
					uni.showToast({
						title : '删除成功',
						icon : 'none'
					})
					utils.funcDelay(1000, () => {
						uni.navigateBack()
					})
				}
			});
		},
		
		/**
		 * 展示大图
		 */
		funcShowImage(item) {
			this.$refs.previewImage.open(item)
		},
		
		/**
		 * 获取详情
		 */
		funcGetDtail() {
			Api.getSinglesDetail({
				id : this.attrId
			}).then(res => {
				const data = res.data || {}
				this.attrBaseView = {
					price: data.price,
					type: this.funcMatchingImage(data.type),
					date: data.date,
					person: data.customer,
					remark: data.remark
				}
				this.attrImageList = JSON.parse(data.images)
			});
		},
		
		/**
		 * 跳转到类型
		 */
		funcPushType() {
			uni.navigateTo({
				url: './expenseTypeList'
			});
		},

		/**
		 * 获取相册
		 */
		funcGetPhotoImages() {
			this.funcGetPhoto(data => {
				this.attrImageList = this.attrImageList.concat(data);
			});
		},

		/**
		 * 获取当前日期
		 */
		funcGetDate() {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			const d = `${year}-${month}-${day}`;
			return d;
		},

		/**
		 * 选中显示索引
		 */
		funcSelectPicker(index, key) {
			this.funcShowPicker();
		},

		/**
		 * 显隐pciker
		 */
		funcShowPicker() {
			this.attrShowPicker = !this.attrShowPicker;
		},

		/**
		 * 确定日期
		 */
		funcChangeDate(res) {
			this.funcShowPicker();
			this.attrDate = res.date
			this.attrBaseView['date'] = this.attrDate;
		},

		/**
		 * 选择客户
		 */
		funcSelectCustomer() {
			uni.navigateTo({
				url: '../pageCustomer/customerList'
			});
		}
	}
};
</script>

<style scoped lang="less">
.createPersonBaseView {
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: white;
}

.header1 {
	width: 100%;
	background-color: #f0eff3;
	height: 100rpx;
	min-height: 100rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0rpx 20rpx;
	.delete {
		font-size: 26rpx;
		color: #2b2ba5;
	}
}

.header {
	width: 100%;
	background-color: #f0eff3;
	height: 20rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}

.personItem {
	display: flex;
	align-items: center;
	height: 100rpx;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #f1f1f1 solid;
}

.itemLabel {
}

.iteminput {
	margin-left: 20rpx;
	flex: 1;
	text-align: right;
	font-size: 28rpx;
}

.phoneItems {
	flex: 1;
	display: flex;
	justify-content: space-between;
	margin-left: 20rpx;
}

.addContact {
	color: #2b2ba5;
	width: 100%;
	height: 50px;
	display: block;
	line-height: 50px;
	text-align: center;
	background-color: #f0eff3;
}

.personArrowItem {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.itemArrow {
	transform: rotate(-90deg);
	width: 36rpx;
	height: 36rpx;
}

.itemLevelText {
	height: 22px;
}

.itemLevel {
	display: flex;
	align-items: center;
}

.custom-picker-base-view {
	position: fixed;
	bottom: 0rpx;
	background-color: rgba(0,0,0,0.3);
	z-index: 2;
	width: 100%;
	height: 100%;
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
	border-bottom: 1px #f5f5f5 solid;
}

.custom-picker-slot-cancel {
	color: #333333;
	font-size: 26rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 34px;
}

.custom-picker-slot-confirm {
	.custom-picker-slot-cancel();
	color: #ff7145;
}

.imageBaseView {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 20rpx 20rpx 20rpx;
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

.delete {
	color: red;
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
