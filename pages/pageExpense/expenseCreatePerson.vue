<template>
	<view class="container">
		<text class="title">请添加完整的报销审批步骤</text>
		<view class="headers">
			<!-- <view class="item">
				<view class="item1">
					<view class="baseView">
						<view class="baseViewHeader">
							<text>{{ attrSelfPerson.name || "" }}</text>
						</view>
					</view>
				</view>
				<text style="marginLeft:10rpx"> -></text>
			</view> -->
			
			<view class="item" v-for="(item, index) in attrPerson" :key="index" @click="funcDelect(item, index)">
				<uni-icons class="del" type="close"></uni-icons>
				<view class="item1">
					<view class="baseView">
						<view class="baseViewHeader">
							<text>{{ item.name || '' }}</text>
						</view>
					</view>
				</view>
				<text style="marginLeft:10rpx">-></text>
			</view>

			<view class="item1" @click="funcAddPerson">
				<view class="baseView">
					<view class="baseAddViewHeader"><image class="jia" src="../../static/jia.jpg" mode="widthFix"></image></view>
				</view>
			</view>
		</view>

		<view class="header"></view>
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectPerson">
				<text class="itemLabel">出纳人员</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrCashier[0] && attrCashier[0].name }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		<text class="tip">报销单将抄送给出纳人员</text>
		
	</view>
</template>

<script>
// 事件处理
import EventBus from '../../common/bus.js';
// API
import Api from '../../apis/apis.js';
// 共用
import Mixin from '../../mixins/mixin.vue';
// 工具
import utils from '../../common/utils.js';
export default {
	mixins: [Mixin],

	data() {
		return {
			attrSelfPerson : uni.getStorageSync("UserInfo"),
			attrPerson: [],
			attrCashier: []
		};
	},

	mounted() {
		/**
		 * 获取选中的用户等级
		 */
		const self = this
		EventBus.$on('SELECTEMPLOYEES', e => {
			const data = JSON.parse(e)
			let arrs = []
			self.attrPerson && self.attrPerson.map((item, index) => {
				if((item.user_id || item.id) != data.id) {
					arrs.push(item)
				}
			})
			arrs.push(data)
			self.attrPerson = arrs
		});
		
		EventBus.$on('SELECTECASHIER', e => {
			const data = JSON.parse(e)
			self.attrCashier = [data]
		});
		
		this.funcGetExamines(5)
		this.funcGetExamines(6)
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		this.funcCreateExamines(5)
		if(this.attrSelfPerson.is_admin) {
			this.funcCreateExamines(6)
		}
	},

	methods: {
		/**
		 * 创建审批信息
		 */
		funcCreateExamines(type) {
			let dataArr = []
			let tempData = type == 5 ? this.attrPerson : this.attrCashier
			tempData &&  tempData.map((item, index) => {
				dataArr.push({
					sort: index + 1,
					name : item.name,
					user_id : item.id || item.user_id,
				})
			})
			 
			Api.createExamines({
				type: type,
				content: dataArr,
			}).then(res => {
				if (res.error_code == 0) {
					this.funcShowToast('成功')
					utils.funcDelay(1000, () => {
						uni.navigateBack()
					})
				} else {
					this.funcShowToast(res.error_msg || "失败")
				}
			})
		},
		
		/**
		 * 选择员工
		 */
		funcSelectPerson() {
			if(this.attrSelfPerson.is_admin) {
				let ids = [];
				this.attrCashier && this.attrCashier.map((item, index) => {
					ids.push(item.id || item.user_id);
				});
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(',')}&&self=0&sign=1&emit=SELECTECASHIER`
				})
			}
		},
	
		/**
		 * 获取审批设置
		 */
		funcGetExamines(type) {
			Api.getExamines({
				type: type
			}).then(res => {
				if (res.error_code == 0) {
					if (res.data.content) {
						if(type == 5) {
							this.attrPerson = res.data.content
						} else {
							this.attrCashier = res.data.content
						}
					}
				} else {
					this.funcShowToast(res.error_msg || '失败');
				}
			});
		},

		/**
		 * 添加审批员工
		 */
		funcAddPerson() {
			let ids = [];
			this.attrPerson && this.attrPerson.map((item, index) => {
				ids.push(item.id || item.user_id);
			});
			uni.navigateTo({
				url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(',')}&self=0&sign=1`
			});
		},

		/**
		 * 删除
		 */
		funcDelect(item, index) {
			this.attrPerson.splice(index, 1);
		}
	}
};
</script>

<style lang="less" scoped>
.headers {
	display: flex;
	padding: 20rpx;
	box-sizing: border-box;
	background-color: white;
	flex-wrap: wrap;
}

.baseView {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 1rpx #e2d8d8 solid;
	display: flex;
	justify-content: center;
	align-items: center;
}

.baseViewHeader {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #e2d8d8;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20rpx;
}

.title {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	height: 80rpx;
	width: 100%;
	padding: 0rpx 20rpx;
	background-color: white;
	font-weight: bold;
	font-size: 26rpx;
	border-bottom: 1rpx #ccc solid;
}

.item {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
}

.item1 {
	display: flex;
	flex-direction: column;
}

.baseAddViewHeader {
	.baseViewHeader();
	background-color: white;
}

.del {
	position: absolute;
	top: -12rpx;
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
	background-color: white;
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

.tip {
	font-size: 22rpx;
	padding: 20rpx;
	box-sizing: border-box;
}
</style>
