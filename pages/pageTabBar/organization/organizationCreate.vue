<template>
	<view class="container">
		<view class="addGoodsAddBase">
			<text>部门名称</text>
			<view class="addGoodsBaseRight">
				<input class="addGoodsAddBaseInput" placeholder="请输入部门名称" type="text" v-model="attrName" />
			</view>
		</view>
		<view class="addGoodsAddBase">
			<view class="addGoodsBaseRight" @click="funcClick">
				<text>部门领导</text>
				<view class="addGoodsBaseRight">
					<text>{{ attrLeader.name || ''}}</text>
					<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		<button class="buttonStyle" v-if="attrEdit" type="warn" @click="funcDeleteOrganizations">删除</button>
	</view>
</template> 
<script>
	// 事件处理
	import EventBus from '../../../common/bus.js'
	import Api from "../../../apis/apis.js"
	export default {
		data() {
			return { 
				attrEdit : void 0,
				attrName : "",
				attrLeader: {}
			}
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrEdit = options.id || void 0
				this.attrName = options.name || ""
				if(options.leader) {
					this.attrLeader = JSON.parse(options.leader)
				}
				uni.setNavigationBarTitle({
					title: '编辑部门'
				})
			}
		},
		
		onNavigationBarButtonTap(e) {
			let apiName = 'createOrganizations'
			if(this.attrEdit) {
				apiName = 'updateOrganizations'
			} 
			Api[apiName]({
				id : this.attrEdit || '',
				name : this.attrName,
				user_id: this.attrLeader.id
			}).then(res => {
				if(res.error_code == 0) {
					uni.navigateBack()
				} else {
					uni.showToast({
						title: res.error_msg,
						icon : 'none'
					})
				}
			});
		},
		
		mounted() {
			/**
			 * 获取归属人
			 */ 
			EventBus.$on('SELECTEMPLOYEES', (e) => {
				this.attrLeader = JSON.parse(e)
			}) 	
		},

		methods: {
			/**
			 * 选择leader
			 */
			funcClick() {
				let ids = [this.attrLeader.id];
				uni.navigateTo({
					url: `../../pageEmployees/pageEmployeesMain?sign=1&ids=${ids.join(",")}`
				})
			},
			/**
			 * 删除组织
			 */
			funcDeleteOrganizations() {
				const self = this
				uni.showModal({
				    title: '提示',
				    content: '确定删除该部门吗？',
				    success: function (res) {
				        if (res.confirm) {
							Api.deleteOrganizations({
								id : self.attrEdit || ''
							}).then(res => {
								if(res.error_code == 0) {
									uni.navigateBack()
								} else {
									uni.showToast({
										title: res.error_msg,
										icon : 'none'
									})
								}
							});
				        } 
				    }
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.addGoodsAddBase {
		border-top: 1rpx #F5F5F5 solid;
		display: flex;
		height: 80rpx;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0px 10px;
		box-sizing: border-box;
		background-color: white;
	}
	.addGoodsBaseRight {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.addGoodsAddBaseInput {
		width: 100%;
		margin-left: 20rpx;
		font-size: 28rpx;
	}
	
	.buttonStyle {
		position: fixed;
		bottom: 20px;
		width: 90%;
		margin: auto;
		left: 5%;
	}
	
</style>
