<template>
	<view class="container">
		<view class="clearance"></view>
		<view class="personItem">
			<text class="itemLabel">标题</text>
			<input class="iteminput" type="text" v-model="attrBaseInfo.title" placeholder="请输入报销单名称(必填)" />
		</view>
		<view class="tip">
			<text>比如：出差去上海交通报销</text>
		</view>
		<view class="header">需报销的消费({{ this.attrSelectSource.length || 0 }})</view>
		<view class="cell" v-for="(item, index) in attrSelectSource" :key="index" @click="funcPushInfo(item, index)">
			<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
			<view class="centerContent">
				<text>{{ item.type }}</text>
				<text>{{ item.date }}</text>
			</view>
			<text class="price">¥{{ item.price }}</text>
		</view>
		<view class="header">
			<text></text>
			<text class="totalPrice">共计: ¥{{ this.attrTotalPrice || 0 }}</text>
		</view>
		<view class="clearance"></view>
		<view class="personItem">
			<text class="itemLabel">补助(元)</text>
			<input class="iteminput" type="text" v-model="attrBaseInfo.price" placeholder="请填写补助金额(选填)" />
		</view>
		<view class="personItem">
			<text class="itemLabel">备注</text>
			<input class="iteminput" type="text" v-model="attrBaseInfo.remark" placeholder="请输入备注(选填)" />
		</view>
		<view class="clearance"></view>
		<view class="header">报销审批步骤</view>
		
		<custom-examines :source="attrExamines" tipString="提交报销单" />
	</view>
</template>

<script>
const userInfo = uni.getStorageSync('UserInfo')
// API
import Api from "../../apis/apis.js"
// Mixins
import Mixins from '@/mixins/mixin.vue';
// 审批组件
import CustomExamines from '@/components/custom-examines/custom-examines.vue'
// 事件处理
import EventBus from '../../common/bus.js';
export default {
	mixins: [Mixins],
	data() {
		return {
			attrExamines: [],
			attrSelectIds: [],
			attrBaseInfo : {
				title : '',
				price : 0,
				remark : '',
			},
			attrSelectSource : [],
			attrTotalPrice : 0,
			attrIsEdit: false,
			attrMainId : void 0
		}
	},
	
	components: {
		CustomExamines
	},
	
	onLoad(options) {
		if(options.data) {
			this.attrSelectSource = JSON.parse(options.data)
		}
		if(options.baseSource) {
			let source = JSON.parse(options.baseSource)
			this.attrBaseInfo = {
				title : source.title,
				price : source.price,
				remark : source.remark
			}
		}
		if(options.edit == 1) {
			this.attrIsEdit = true
			this.attrMainId = options.mainId
			uni.setNavigationBarTitle({
				title : '修改报销单'
			})
		}
		// if(options.originData) {
		// 	this.attrBaseInfo = JSON.parse(options.data)
		// }
	},
	
	mounted() {
		EventBus.$on('UPDATESINGLES', (e) => {
			this.$set(this.attrSelectSource, this.attrSelectIndex, e)
			this.funcGetTocalPrice()
		})
		this.funcGetExamines();
		this.funcGetTocalPrice()
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		if(!this.attrBaseInfo.title) {
			this.funcShowToast('标题不能为空')
			return
		}
		
		uni.showModal({
			title: '',
			content: `您报销的金额为 ${+this.attrTotalPrice + +this.attrBaseInfo.price}元`,
			cancelText: "取消", 
			confirmText: "确定",
			showCancel: true, 
			confirmColor: '#FFA200',
			success: (res) => {
				if(res.confirm) {  
					this.funcCreate()
				} 
			} 
		})
	},
	
	methods: {
		/**
		 * 跳转详情
		 */
		funcPushInfo(item, index) {
			this.attrSelectIndex = index
			// if(this.attrSource.admin && this.attrSource.admin.id != userInfo.id) {
			// 	return
			// }
			
			uni.navigateTo({
				url : `./expenseCreate?id=${item.id}`
			})
		},
		
		/**
		 * 创建
		 */
		funcCreate() {
			let params = {
				total_price: +this.attrTotalPrice + +this.attrBaseInfo.price,
				title : this.attrBaseInfo.title,
				single_id : this.attrSelectIds,
				price: this.attrBaseInfo.price,
				remark: this.attrBaseInfo.remark
			};
			
			let apiName = "createOrderSingles"
			
			if(this.attrIsEdit) {
				params = {
					...params,
					edit: 1,
					id: this.attrMainId
					
				}
				// apiName = "updateSingles"
			}
			
			Api[apiName](params).then(res => {
				if (res.error_code == 0) {
					uni.navigateBack({
						delta: 2
					})
				} else {
					this.funcShowToast( res.error_msg || '失败')
				}
			});
		},

		/**
		 * 计算价格获取id
		 */
		funcGetTocalPrice() {
			let totalPrice = 0, ids = []
			
			this.attrSelectSource && this.attrSelectSource.map((item, index) => {
				totalPrice += item.price * 1
				ids.push(item.id)
			})
			this.attrSelectIds = ids 
			this.attrTotalPrice = totalPrice
		},
		
		/**
		 * 获取详情
		 */
		
		/**
		 * 获取审批设置
		 */
		funcGetExamines() {
			Api.getExamines({
				type: 5
			}).then(res => {
				if (res.error_code == 0) {
					if (res.data.content) {
						this.attrExamines = res.data.content
					}
				} else {
					this.funcShowToast(res.error_msg || "失败")
				}
			})
		},
	},
}
</script>

<style lang="less" scoped>
	
	.header {
		width: 100%;
		background-color: white;
		height:100rpx;
		line-height:100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
	
	.clearance {
		border-top: 20rpx #f5f5f5 solid;
	}
	
	.itemLabel {
		
	}
	
	.iteminput {
		margin-left: 20rpx;
		flex: 1;
		font-size: 28rpx;
	}
	
	
	.personItem {
		background-color: white;
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #eee9e9 solid;
	}
	
	.tip {
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		font-size: 22rpx;
		display: flex;
		justify-content: flex-start;
		padding-bottom: 30rpx;
	}
	
	.cell {
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		background-color: white;
		align-items: center;
		border-bottom: 1rpx #f2f2f2 solid;
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
	
	.totalPrice {
		color: #FFA200;
	}
</style>
