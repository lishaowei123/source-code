<template>
	<view class="container">
		<view class="box">
			<input class="inputBox" placeholder="请输入成员名称" type="text" v-model="attrSource.name" />
		</view>
		<view class="box">
			<input class="inputBox" placeholder="请输入成员电话" type="phone" maxlength="11" v-model="attrSource.phone" />
		</view>
		<view class="box">
			<input class="inputBox" placeholder="请输入员工职位" type="text" v-model="attrSource.position" />
		</view>
		<view class="box">
			<input class="inputBox" placeholder="请输入登录密码" type="text" password v-model="attrSource.password" />
		</view>
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectOrganization">
				<text class="itemLabel">部门</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIrganization.name || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem" v-if="attrShowAdd">
			<view class="personArrowItem" @click="funcSelectIsTask">
				<text class="itemLabel">任务创建权限</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsTask.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem" v-if="false">
			<view class="personArrowItem" @click="funcSelectIsCustomer">
				<text class="itemLabel">客户查看权限</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsCustomer.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem" v-if="attrShowAdd">
			<view class="personArrowItem" @click="funcSelectIsGoods">
				<text class="itemLabel">商品创建权限</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsGoods.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem" v-if="false">
			<view class="personArrowItem" @click="funcSelectIsReceivable">
				<text class="itemLabel">回款查看权限</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsReceivable.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem" v-if="false">
			<view class="personArrowItem" @click="funcSelectIsAccount">
				<text class="itemLabel">报销权限</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsAccount.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="personItem">
			<view class="personArrowItem" @click="funcSelectIsLeave">
				<text class="itemLabel">是否离职</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrSelectIsLeave.label || ""}}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<button class="addBtn" type="primary" @click="funcCreate">修改员工</button>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	import utils from '@/common/utils.js'
	export default {
		data() {
			return {
				attrSource : {
					name : '',
					phone : '',
					position : '',
					is_task : 0,
					password: '123456'
				},
				attrSelectIrganization: {},
				attrSelectIsTask: {},
				attrSelectIsCustomer : {},
				attrSelectIsGoods : {},
				attrSelectIsReceivable : {},
				attrSelectIsAccount : {},
				attrShowAdd: false,
				attrItem: {},
				attrSelectIsLeave: {},
				attrOrganizationsList : []
			}
		},
		
		onLoad(options) {
			if(options.item) {
				this.attrSource = JSON.parse(options.item) 
				this.attrSelectIsTask = {
					label : this.attrSource.is_task == 1 ? '有' : '无',
					value : this.attrSource.is_task
				}
				this.attrSelectIsCustomer = {
					label : this.attrSource.is_customer == 1 ? '有' : '无',
					value : this.attrSource.is_customer
				}
				this.attrSelectIsGoods = {
					label : this.attrSource.is_goods == 1 ? '有' : '无',
					value : this.attrSource.is_goods
				}
				this.attrSelectIsReceivable = {
					label : this.attrSource.is_hk == 1 ? '有' : '无',
					value : this.attrSource.is_hk
				}
				this.attrSelectIsAccount = {
					label : this.attrSource.is_bx == 1 ? '有' : '无',
					value : this.attrSource.is_bx
				}
				this.attrSelectIsLeave = {
					label : this.attrSource.is_departure == 1 ? '是' : '否',
					value : this.attrSource.is_departure
				}
			}
		},
		
		mounted() {
			this.funcGetOrganizations();
			const userInfo = uni.getStorageSync('UserInfo')
			if(userInfo && userInfo.is_admin) {
				this.attrShowAdd = true
			} else {
				this.attrShowAdd = false
			}
			EventBus.$on('SELECTORGANIZATION', (e) => {
				this.attrSelectIrganization = e
			})
			EventBus.$on('SELECTISTASK', (e) => {
				this.attrSelectIsTask = e
			})
			EventBus.$on('SELECTISCUSTOMER', (e) => {
				this.attrSelectIsCustomer = e
			})
			EventBus.$on('SELECTISGOODS', (e) => {
				this.attrSelectIsGoods = e
			})
			EventBus.$on('SELECTISREVEICABLE', (e) => {
				this.attrSelectIsReceivable = e
			})
			EventBus.$on('SELECTISACCOUNT', (e) => {
				this.attrSelectIsAccount = e
			})
			EventBus.$on('SELECTISLEAVE', (e) => {
				this.attrSelectIsLeave = e
			})
		},
		
		methods: {
			
			/**
			 * 获取组织列表
			 */
			funcGetOrganizations() {
				Api.getOrganizations().then(res => {
					this.attrOrganizationsList = res.data || [];
					res.data && res.data.map((item, index) => {
						if(item.id == this.attrSource.organization_id) {
							this.attrSelectIrganization = item
						}
					})
				});
			},
			
			/**
			 * 错误提示
			 */
			funcShowToast(title) {
				uni.showToast({
					title : title,
					icon : 'none'
				})
			},
			
			/**
			 * 是否有任务创建权限
			 */
			funcSelectIsTask() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISTASK&title=任务创建权限&type=5`
				})
			},
			
			
			/**
			 * 是否离职
			 */
			funcSelectIsLeave() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISLEAVE&title=是否离职&type=5`
				})
			},
			
			
			/**
			 * 是否有查看客户权限
			 */
			funcSelectIsCustomer() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISCUSTOMER&title=客户查看权限&type=5`
				})
			},
			
			/**
			 * 是否有商品创建权限
			 */
			funcSelectIsGoods() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISGOODS&title=商品创建权限&type=5`
				})
			},
			
			/**
			 * 是否有回款权限
			 */
			funcSelectIsReceivable() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISREVEICABLE&title=回款权限&type=5`
				})
			},
			
			/**
			 * 是否有报销权限
			 */
			funcSelectIsAccount() {
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTISACCOUNT&title=报销权限&type=5`
				})
			},
			
			/**
			 * 选择部门
			 */
			funcSelectOrganization() {
				uni.navigateTo({
					url : '../pageTabBar/organization/organizationList?select=1'
				})
			},
			
			/**
			 * 选择部门
			 */
			funcSelectOrganization() {
				uni.navigateTo({
					url : '../pageTabBar/organization/organizationList?select=1'
				})
			},
			
			/**
			 * 创建员工
			 */
			funcCreate() {
				if(!this.attrSource.name) {
					this.funcShowToast('员工姓名不能为空')
					return
				}
				if(!this.attrSource.phone) {
					this.funcShowToast('员工手机不能为空')
					return
				}
				Api.updateEmployees({
					id: this.attrSource.id,
					name : this.attrSource.name,	
					phone : this.attrSource.phone,	
					password: this.attrSource.password,
					organization_id: this.attrSelectIrganization.id,
					position: this.attrSource.position,
					is_task: this.attrSelectIsTask.value || 0,
					is_goods: this.attrSelectIsGoods.value || 0,	
					is_departure: this.attrSelectIsLeave.value || 0
				}).then(res => {
					if(res.error_code == 0) {
						this.funcShowToast('修改成功')
						
						utils.funcDelay(1000, () => {
							uni.navigateBack()
						})
					} else {
						this.funcShowToast(res.error_msg)
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.box {
		background-color: white;
		height: 100rpx;
		padding: 20rpx;
		border-top: 10rpx whitesmoke solid;
		box-sizing: border-box;
		.inputBox {
			width: 100%;
			height: 100%;
			font-size: 28rpx;
		}
	}
	
	.addBtn {
		width: 90%;
		margin-top: 60rpx;
	}
	
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #eee9e9 solid;
		background-color: white;
		margin-top: 10rpx;
	}
	
	.itemLabel {
		
	}
	
	.iteminput {
		margin-left: 20rpx;
		flex: 1;
		font-size: 28rpx;
	}
	
	.phoneItems {
		flex:1;
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
	
	.itemLevel{
			 display: flex;
			 align-items: center;
	}


</style>
