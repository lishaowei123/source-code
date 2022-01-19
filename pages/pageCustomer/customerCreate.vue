<template>
	<view class="createPersonBaseView">
		<!-- 客户信息 -->
		<view class="header">客户信息</view>
		<view class="personItem">
			<text class="itemLabel">名称</text>
			<input class="iteminput" type="text" v-model="attrPersonInfo.name" placeholder="请输入客户的名称(必填)" />
		</view>
		<view class="personItem">
			<text class="itemLabel">地址</text>
			<input class="iteminput" type="text" v-model="attrPersonInfo.address" placeholder="请输入客户地址" />
		</view>
		<view class="personItem">
			<text class="itemLabel">获取来源</text>
			<input class="iteminput" type="text" v-model="attrPersonInfo.source" placeholder="请输入客户信息" />
		</view>
		<view class="personItem">
			<view class="personArrowItem" @click="funcPushLevel">
				<text class="itemLabel">客户级别</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{ attrPersonInfo.level && (attrPersonInfo.level.label || attrPersonInfo.level.name) }}</text>
					<image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="personItem">
			<text class="itemLabel">备注</text>
			<input class="iteminput" type="text" v-model="attrPersonInfo.remark" placeholder="请输入客户备注" />
		</view>
		<!-- 联系人信息 -->
		<view class="" v-for="(item, index) in attrContactInfo" :key="index">
			<view class="header">
				<text>联系人信息</text>
				<text class="delete" v-if="attrContactInfo.length > 1" @click="funcDeleteContactInfo(index)">删除</text>
			</view>
			<view class="personItem">
				<text class="itemLabel">{{ item.nameLable }}</text>
				<input class="iteminput" type="text" v-model="item.realname" :placeholder="item.namePlaceholder" />
			</view>
			
			<view class="personItem" v-for="(pItem, pIndex) in item.phones" :key="pIndex">
				<text class="itemLabel">{{ pItem.phoneLable }}{{ !pIndex ? (item.phones.length > 1 ? '1' : '') : pIndex + 1  }}</text>
				<view class="phoneItems">
					<input class="iteminput" type="phone" maxlength="11" v-model="pItem.phoneValue" :placeholder="pItem.phonePlaceholder" />
					<text class="itemInputMore" v-if="pIndex == item.phones.length - 1 && pIndex != 2" @click="funcAddPersonInfo(index)">更多</text>
				</view>
			</view>
			
			<view class="personItem">
				<text class="itemLabel">{{ item.remarkLable }}</text>
				<input class="iteminput" type="text" v-model="item.remark" :placeholder="item.remarkPlaceholder" />
			</view>
			<text class="addContact" @click="funcAddContactInfo" v-if="index == attrContactInfo.length - 1">添加联系人+</text>
		</view>
		
		
		<text class="tracking">客户跟进人</text>
		<view class="trackingView">
			<view class="trackingItemView" v-for="(item, index) in attrTrackPeople" :key="index" @click="funcTouchItem(item, index)">
				<view :class="attrDeleteFlag && (index || attrEditId) ? 'trackingItemDelete' : 'trackingItemDeleteHid'">-</view>
				<view class="trackingItem">{{ item.name }}</view>
				<text class="trackingTitle">{{ item.name }}</text>
			</view>
			<view class="trackingItemView" @click="funcAddTracking">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jia.jpg" mode="widthFix"></image>
			</view>
			<view class="trackingItemView" v-if="attrTrackPeople.length > (attrEditId ? 0 : 1)" @click="funcDeleteTracking">
				<image class="trackingItem trackingItemJiaJian" src="../../static/jian.jpg" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	const phoneInfo = {'phoneLable' : '手机号', 'phonePlaceholder' : '请输入联系人手机', phoneValue : ''}
	const addContactTemplate = {
		nameLable : '姓名',
		realname : '',
		namePlaceholder : '请输入联系人姓名',
		phones : [JSON.parse(JSON.stringify(phoneInfo))],
		remarkLable : '备注',
		remark : '',
		remarkPlaceholder : '请输入联系人备注'
	}
	
	export default {
		data() {
			return {
				// 是否处于删除状态
				attrDeleteFlag: false,
				attrPersonInfo: {
					name : '',
					address : '',
					source : '',
					level : {},
					remark : ''
				},
				attrContactInfo : [JSON.parse(JSON.stringify(addContactTemplate))],
				attrTrackPeople : [uni.getStorageSync("UserInfo")],
				attrEditId: void 0
			}
		},
		
		onLoad(options) {
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title
				})
			}
			if(options.id) {
				this.attrEditId = options.id || ''
				this.funcGetSource()
			}
		},
		
		mounted() {
			/**
			 * 获取选中的用户等级
			 */
			EventBus.$on('SELECTLEVEL', (e) => {
				this.attrPersonInfo.level = e
			})
			
			/**
			 * 获取归属人
			 */
			EventBus.$on('SELECTEMPLOYEES', (e) => {
				if(this.attrEditId) {
					this.attrTrackPeople = JSON.parse(e)
				} else {
					this.attrTrackPeople = [uni.getStorageSync("UserInfo")].concat(JSON.parse(e)) 
				}
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			let phones = [], ids = [];
			this.attrContactInfo && this.attrContactInfo.map((item, index) => {
				let obj = {
					realname : item.realname,
					remark : item.remark || ""
				}
				item.phones && item.phones.map((pitem, pidx) => {
					obj[pidx ? ('phone' + pidx) : 'phone' ] = pitem.phoneValue
				})
				phones.push(obj)
				this.attrTrackPeople.map(item => {
					ids.push(item.id)
				})
			})
			let params = this.attrPersonInfo || {}
			params['level_id'] = this.attrPersonInfo.level && (this.attrPersonInfo.level.value || this.attrPersonInfo.level.id) || ""
			params['contact_array'] = phones || []
			params['user_array'] = ids || []
			if(this.attrEditId) {
				params['id'] = this.attrEditId
			}
			this.funcCreateCustomer(params)
		},
		
		// 页面周期与 onLoad 同级
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.showModal({
					title: this.attrEditId ? '是否取消修改' : '是否取消创建',
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
		
		methods: {
			/**
			 * 获取详情
			 */
			funcGetSource() {
				Api.getCustomersDetail({
					id : this.attrEditId
				}).then(res => {
					if(res.error_code == 0) {
						let data = res.data || {}
						this.attrPersonInfo = {
							name : data.name || "",
							address : data.address || "",
							source : data.source || "",
							level : data.level || {},
							remark : data.remark || ""
						}
						const phoneInfo = {'phoneLable' : '手机号', 'phonePlaceholder' : '请输入联系人手机', phoneValue : ''}
						let tempArray = []
						data.contact && data.contact.map((item, index) => {
							let copyItem = JSON.parse(JSON.stringify(addContactTemplate))
							let copyPhone = JSON.parse(JSON.stringify(phoneInfo))
							copyItem.realname = item.realname
							copyItem.remark = item.remark
							copyItem.phones = []
							if(item.phone) {
								copyPhone.phoneValue = item.phone
								copyItem.phones.push(copyPhone)
							}
							if(this.attrEditId) {
								if(!item.phone) {
									copyPhone.phoneValue = ''
									copyItem.phones.push(copyPhone)
								}
							}
							if(item.phone2) {
								copyPhone.phoneValue = item.phone2
								copyItem.phones.push(copyPhone)
							}
							if(item.phone3) {
								copyPhone.phoneValue = item.phone3
								copyItem.phones.push(copyPhone)
							}
							
							tempArray.push(copyItem)
						})
						
						this.attrContactInfo = tempArray

						this.attrTrackPeople = data.users

					} else {
						this.funcShowToast('失败')
					}
				})
			},
			
			/**
			 * 创建客户
			 */
			funcCreateCustomer(params) {
				const apiName = this.attrEditId ? 'updateCustomersDetail' : 'createCustomers'
				Api[apiName](params).then((res) => {
					if(res.error_code == 0) {
						EventBus.$emit("ADDCUSTOMSUCCESS")
						uni.navigateBack()
					} else {
						uni.showToast({
							title : res.error_msg || "失败",
							icon : 'none'
						})
					}
				})
			},
			
			/**
			 * 添加手机号
			 */
			funcAddPersonInfo(pIndex) {
				let phones = this.attrContactInfo[pIndex].phones
				if(phones.length >= 3) {
					return
				}
				phones.push(JSON.parse(JSON.stringify(phoneInfo)))
				this.attrContactInfo[pIndex].phones = phones
			},
			
			/**
			 * 添加联系人信息
			 */
			funcAddContactInfo() {
				let info = this.attrContactInfo
				this.attrContactInfo.push(JSON.parse(JSON.stringify(addContactTemplate)))
			},
			
			/**
			 * 删除联系人信息
			 */
			funcDeleteContactInfo(index) {
				this.attrContactInfo.splice(index, 1)
			},
			
			/**
			 * 打开客户等级页面
			 */
			funcPushLevel() {
				uni.navigateTo({
					url: './customerLevel'
				})
			},
			
			/**
			 * 点击Item
			 */
			funcTouchItem(item, index) {
				if(this.attrEditId) {
					this.attrTrackPeople.splice(index, 1);
					return
				}
				if(index && this.attrDeleteFlag) {
					this.attrTrackPeople.splice(index, 1);
				}
			},
			
			/**
			 * 添加跟踪
			 */
			funcAddTracking() {
				this.attrDeleteFlag = false
				let ids = []
				this.attrTrackPeople && this.attrTrackPeople.map((item, index) => {
					ids.push(item.id)
				})
				uni.navigateTo({
					url: `../pageEmployees/pageEmployeesMain?ids=${ids.join(",")}&self=1`
				})
			},
			
			/**
			 * 删除跟踪
			 */
			funcDeleteTracking() {
				this.attrDeleteFlag = !this.attrDeleteFlag
			}
		}
	}
</script>

<style scoped lang="less">
	.createPersonBaseView {
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: white;
		
	}
	
	.header {
		width: 100%;
		background-color: #F0EFF3;
		height:100rpx;
		line-height:100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		
		.delete {
			font-size: 26rpx;
			color: blue;
		}
		
	}
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #eee9e9 solid;
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
		align-items: center;
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
	 
	 .tracking {
		display: flex;
		align-items: flex-end;
		width: 100%;
		height: 100rpx;
		background-color: #F0EFF3;
		padding-left: 20rpx;
		box-sizing: border-box;
		align-items: center;
	 }
	 
	 .trackingView {
		width: 100%;
		background-color: white;
		min-height: 150rpx;
		padding: 10px;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
	 }
	 
	 .trackingItemView {
		 display: flex;
		 align-items: center;
		 flex-direction: column;
		 position: relative;
		 width: 20%;
	 }
	 
	 .trackingItem {
		 height: 100rpx;
		 width: 100rpx;
		 border-radius: 50%;
		 background-color: green;
		 display: flex;
		 align-items: center;
		 justify-content: center;
		 color: white;
	 }

	 .trackingItemJiaJian {
		 background-color: transparent;
		 border: 1rpx #f7e0e0 dashed;
		 padding: 20rpx;
		 box-sizing: border-box;
	 }
	 
	 .trackingTitle {
		 font-size: 20rpx;
	 }
	 
	 .trackingItemDelete {
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 font-weight: 500;
		 transform: scale(1.2);
		border-radius: 50%;
		width: 30rpx;
		height: 30rpx;
		background-color: #e9d9d9;
		position: absolute;
		left: 20rpx;
		top: -10rpx;
		opacity: 1;
		transition: all 0.3s;
	  }
	  
	  .trackingItemDeleteHid {
		  .trackingItemDelete();
		  opacity: 0;
		  transition: all 0.3s;
	  }

</style>
