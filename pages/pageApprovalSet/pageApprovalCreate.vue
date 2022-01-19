<template>
	<view class="container">
		<text class="title">流程审批设置</text>
		<view class="headers">
			<view class="item" v-for="(item, index) in attrTrackPeople" :key="index" @click="funcDelect(item, index)">
				<uni-icons class="del" type="close"></uni-icons>
				<view class="item1">
					<view class="baseView">
						<view class="baseViewHeader">
							<text>{{ item.name || "" }}</text>
						</view>
					</view>
				</view>
				<text style="marginLeft:10rpx"> -></text>
			</view>

			<view class="item1" @click="funcAddPerson">
				<view class="baseView">
					<view class="baseAddViewHeader">
						<image class="jia" src="../../static/jia.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	// 共用
	import Mixin from '../../mixins/mixin.vue'
	// 工具
	import utils from '../../common/utils.js'
	export default {

		mixins: [Mixin],

		data() {
			return {
				// attrTrackPeople : [uni.getStorageSync("UserInfo")],
				attrTrackPeople: [],
				attrPerson: []
			}
		},

		mounted() {
			/**
			 * 获取选中的用户等级
			 */
			EventBus.$on('SELECTEMPLOYEES', (e) => {
				const data = JSON.parse(e)
				this.attrTrackPeople = data
			})
			
			this.funcGetExamines()
		},

		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			this.funcCreateExamines()
		},

		methods: {
		
			/**
			 * 创建审批信息
			 */
			funcCreateExamines() {
				var a = 1;
				var ab = [];
				for(var i=0;i<this.attrTrackPeople.length;i++) {
					ab.push({
						'sort':a,
						'name':this.attrTrackPeople[i].name,
						'user_id':this.attrTrackPeople[i].user_id || this.attrTrackPeople[i].id ,
					});
					a++;
				}
				Api.createExamines({
					type: 4,
					content: ab
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
			 * 获取审批设置
			 */
			funcGetExamines() {
				Api.getExamines({
					type: 4
				}).then(res => {
					if (res.error_code == 0) {
						if (res.data.content) {
							this.attrTrackPeople = res.data.content
						}
					} else {
						this.funcShowToast(res.error_msg || "失败")
					}
				})
			},

			/**
			 * 添加审批员工
			 */
			funcAddPerson() {
				let ids = []
				this.attrTrackPeople && this.attrTrackPeople.map((item, index) => {
					ids.push(item.id || item.user_id)
				})
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(",")}&self=0`
				})
			},

			/**
			 * 删除
			 */
			funcDelect(item, index) {
				this.attrTrackPeople.splice(index, 1)
			}
		},
	}
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
</style>
