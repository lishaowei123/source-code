<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347"
			:y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="headerView">
			<view class="headerImage">
				{{ attrSource.manager_staff && funcSubName(attrSource.manager_staff.name) || "获取中" }}
			</view>
			<view class="headerRightInfo">
				<view>{{ attrSource.manager_staff && attrSource.manager_staff.name || "" }}</view>
				<view class="buttonBox">
					<text class="time">{{ attrSource.end_date ? funcOverdue(attrSource.end_date || "") : '暂无' }} </text>
					<text :class="[ funcOverdueStatus(attrSource.end_date) ? 'pointOverdue' : 'point' ]"></text>
				</view>
			</view>
		</view>
		<view class="content">
			{{ attrSource.content || "" }}
		</view>
		<view class="content">
			任务名称：
			<text>{{ attrSource.name }}</text>
		</view>
		<view class="content">
			关联客户：
			<text @click="funcPushDetail" style="margin-left: 10rpx; color:#007AFF" v-if="attrSource.customer && attrSource.customer.name">{{attrSource.customer && attrSource.customer.name || ''}}</text>
			<text v-else style="margin-left: 10rpx;">无</text>
		</view>
		<view class="content phoneView">
			<view class="phoneLeft">
				客户电话：
			</view>
			<view class="phoneRight">
				<view v-for="(item, index) in (attrSource.customer && attrSource.customer.contact)" :key="index">
					{{ item.realname }}
					<view class="phones" >
						<text class="phone" v-if="item.phone" @click="funcPhone(item.phone)">{{ item.phone || ''}}</text> 
						<text class="phone" v-if="item.phone2" @click="funcPhone(item.phone2)">{{ item.phone2 || ''}}</text> 
						<text class="phone" v-if="item.phone3" @click="funcPhone(item.phone3)">{{ item.phone3 || ''}}</text> 
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="label">
				技术负责人：{{ attrSource.skill && attrSource.skill.name || "无" }}
			</view>
			<view class="label">
				技术执行人：{{ attrSource.skill_staff && attrSource.skill_staff.name || "无"  }}
			</view>
			<view class="label">
				审计负责人：{{ attrSource.finance && attrSource.finance.name || "无" }}
			</view>
			<view class="label">
				审计执行人：{{ attrSource.finance_staff && attrSource.finance_staff.name || "无"  }}
			</view>
			<view class="label">
				销售负责人：{{ attrSource.manager && attrSource.manager.name || "无" }}
			</view>
			<view class="label">
				销售执行人：{{ attrSource.manager_staff && attrSource.manager_staff.name || "无" }}
			</view>
			<view class="label">
				截止时间：{{ attrSource.end_date || "" }} {{ funcOverdueStatus(attrSource.end_date) ? '(已过期)' : '无' }}
			</view>
			<view class="label">
				优先级：{{ attrSource.level || "无" }}
			</view>
			<view class="label">
				抄送：{{ attrSource.ccString  || "无" }}
			</view>
		</view>
		
		<view class="customerAddBase" @click="funcReviewGoods">
			<text>关联商品</text>
			<view class="customerAddBaseRight">
				<view class="">
					{{attrSource.goods && attrSource.goods.name || ""}}
					<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		<view class="content" v-if="attrImageList.length">
			<view class="imageItem" v-for="(item, index) in attrImageList" :key="index">
				<image class="imageItem" :src="item" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="buttomBox">
			<view class="buttomBoxLeft" @click="funcComment">
				<image class="icon" src="../../static/pinglun.png" mode=""></image> 评论
			</view>
			<view class="buttomBoxRight" @click="funcCompile">
				<image class="icon" src="../../static/bianji.png" mode=""></image>
				{{ attrSource.status == 1 ? '改为未完成' : '完成任务'}}
			</view>
		</view>
		
		<view :style="{marginTop : '20rpx; paddingButtom: 100rpx'}">
			<custom-comments :source="attrSource" @send="funcUpdate" :showComment="false" />
		</view>
	</view>
</template>

<script>
	// mixins
	import Mixins from '@/mixins/mixin.vue'
	// API
	import Api from "../../apis/apis.js"
	// 评论组件
	import CustomComments from "@/components/custom-comments/custom-comments.vue"
	// 工具类
	import utils from "../../common/utils.js"
	// 自定义页面【 popup弹出层 】
	import ChunLeiPopupsComponent from "@/components/chunLei-popups/chunLei-popups.vue";
	const userInfo = uni.getStorageSync('UserInfo')
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrShowPopUp: false,
				attrPopUpDataSource: [{
					icon: '',
					title: '删除任务',
					index: 0
				},{
					icon: '',
					title: '编辑任务',
					index: 1
				}],
				attrId : void 0,
				attrSource : {},
				attrImageList : []
			}
		},
		
		components: {
			CustomComments,
			ChunLeiPopupsComponent
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrId = options.id
			}
			
			// #ifdef APP-PLUS
			if(userInfo.is_admin != 1) {
				const webView = this.$scope.$getAppWebview()
				webView.setTitleNViewButtonStyle(0, {
					width: '0'
				});
			}
			// #endif
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			if(userInfo.is_admin == 1) {
				this.attrShowPopUp = true;
			} else {
				this.funcShowToast("暂无权限")
			}
		},
				
		onShow() {				
			this.funcGetDetail()
		},
		
		methods: {
			/**
			 * 跳转到详情
			 */
			funcPushDetail() {
				const id = this.attrSource.customer.id
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${id}`
				})
			},
			
			/**
			 * 拨打电话
			 */
			funcPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			
			/**
			 * 点击商品
			 */
			funcReviewGoods() {
				uni.navigateTo({
					url : `../pageGoods/goodsDetail?id=${this.attrSource.goods_id}`
				})
			},
			
			/**
			 * 点击popup-item
			 */
			funcTapPopup(e) {
				if(userInfo.is_admin != 1) {
					this.funcShowToast("暂无权限")
					return
				}
				if(e.index){
					uni.navigateTo({
						url : `./taskCreate?id=${this.attrSource.id}`
					})
				} else {
					Api.deleteTask({
						id : this.attrId
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
				}
			},
			
			/**
			 * 获取详情数据
			 */
			funcGetDetail() {
				Api.taskDetail({
					id : this.attrId
				}).then(res => {
					let ccArr = [], mmembers = []
					const data = res.data || {}
					data.cc && data.cc.map((item,index) => {
						ccArr.push(item.name)
					})
					data.user && data.cc.map((item,index) => {
						mmembers.push(item.name)
					})
					data.members = mmembers.join("、") 
					data.ccString = ccArr.join("、")
					this.attrSource = data || {}
					this.attrImageList = data.images ? JSON.parse(data.images) : []
				})
			},
			
			/**
			 * 更新数据
			 */
			funcUpdate() {
				utils.funcDelay(500, () => {
					this.funcGetDetail()
				})
			},
			
			/**
			 * 评论
			 */
			funcComment() {
				uni.navigateTo({
					url : `./taskComment?id=${this.attrSource.id}&adminId=${this.attrSource.admin.id}`
				})
			},
			
			/**
			 * 完成任务
			 */
			funcCompile() {
				const userInfo = uni.getStorageSync('UserInfo')
				if(userInfo.is_task) {
					Api.updateTask({
						id : this.attrId,
						status : this.attrSource.status == 1 ? 0 : 1
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
				} else {
					uni.showToast({
						title : '暂无权限',
						icon : 'none'
					})
				}
				
			},
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
		background-color: #a4abb3;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.time {
		font-size: 24rpx;
		color: #bfaeae;
		margin-top: 10rpx;
	}
	
	.headerRightInfo {
		flex: 1;
		margin-left: 20rpx;
	}
	
	.content {
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
		border-bottom: 1rpx #F0F0F0 solid;
	}
	
	.label {
		.time();
	}
	
	.imageItem {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}
	
	.buttomBox {
		box-sizing: border-box;
		height: 100rpx;
		padding: 20rpx;
		position: fixed;
		bottom: 0rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		width: 100%;
	}
	
	.buttomBoxLeft {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		.icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}
	
	.buttomBoxRight {
		.buttomBoxLeft();
		border-left: 1rpx #f0f0f0 solid;
	}
	
	.customerAddBase {
		height: 100rpx;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: white;
		box-sizing: border-box;
		align-items: center;
		border-bottom: 1rpx #eee9e9 solid;
	}
	
	.customerAddBaseRight {
		flex: 0.9;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.customerAddBaseRightText {
		text-align: right;
	}
	
	.phoneView {
		display: flex;
	}
	
	.phoneLeft {
		
	}
	
	.phoneRight {
		margin-left: 10rpx;
		display: flex;
		flex-direction: column;
	}
	
	.phone {
		color: #4e6ef2;
	}
	
	.phones {
		display: flex;
		flex-direction: column;
	}
</style>
