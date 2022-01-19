<template>
	<view class="">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347"
			:y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<view class="cell" v-for="(item,index) in attrOrganizationsList" :key="index" @click="funcPushDetail(item)">
			<text class="addGoodsBaseRightText">{{ item.name  || ""}}</text>
			<view class="addGoodsBaseRight" v-if="!attrSelect">
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		<wyb-popup ref="popup" type="center" height="400" width="500" radius="4">
		    <view class="popup-content">
		        <view class="cell" v-for="(item,index) in attrOrganizationsList" :key="index" @click="funcPushEdit(item)">
		        	<text class="addGoodsBaseRightText">{{ item.name  || ""}}</text>
		        </view>
		    </view>
		</wyb-popup>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../../common/bus.js'
	// API
	import Api from "../../../apis/apis.js"
	// 自定义页面【 popup弹出层 】
	import ChunLeiPopupsComponent from "@/components/chunLei-popups/chunLei-popups.vue";
	import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
	export default {
		data() {
			return {
				attrShowPopUp: false,
				attrPopUpDataSource: [{
					icon: '',
					title: '新建部门',
					index: 0
				},{
					icon: '',
					title: '编辑部门',
					index: 1
				}],
				attrOrganizationsList : [],
				attrSelect: void 0,
				attrParams: {}
			}
		},
		
		components: {
			wybPopup,
			ChunLeiPopupsComponent
		},
		
		onLoad(options) {
			if(options.select) {
				this.attrSelect = options.select
			}
			this.attrParams = options
		},
		
		onShow() {
			this.funcGetOrganizations()
		},
		
		mounted() {
			const userInfo = uni.getStorageSync('UserInfo')
			if(!userInfo.is_admin) {
				// #ifdef APP-PLUS
					const webView = this.$mp.page.$getAppWebview();
					webView.setTitleNViewButtonStyle(0, {
						text : ""
					});
				// #endif
			}
		},
	
		onNavigationBarButtonTap(e) {
			const userInfo = uni.getStorageSync('UserInfo')
			if(userInfo.is_admin) {
				this.attrShowPopUp = true
			} else {
				uni.showToast({
					title : '暂无权限',
					icon : 'none'
				})
			}
		},
		
		methods: {
			/**
			 * 点击popup-item
			 */ 
			funcTapPopup(e) {
				const self = this;
				switch (e.index) {
					case 0:
						uni.navigateTo({
							url : './organizationCreate'
						})
						break;
					case 1:
						self.$refs.popup.show() // 显示
						break;
					default:
						break;
				}
			},
			
			/**
			 * 跳转到编辑
			 */
			funcPushEdit(item) {
				this.$refs.popup.hide()
				uni.navigateTo({
					url : `./organizationCreate?id=${item.id}&name=${item.name}&leader=${JSON.stringify({
						id: item.user && item.user.id,
						name: item.user && item.user.name
					})}`
				})
			},
			
			/**
			 * 跳转到详情
			 */
			funcPushDetail(item) {
				if(this.attrSelect) {
					EventBus.$emit('SELECTORGANIZATION', item)
					uni.navigateBack()
				} else {
					if(this.attrParams.emit) {
						uni.navigateTo({
							url: `../../pageEmployees/pageEmployeesMain?organization_id=${item.id}&self=${this.attrParams.self}&sign=${this.attrParams.sign}&emit=${this.attrParams.emit}&layer=2`
						})
					} else {
						uni.navigateTo({
							url: `../../pageEmployees/pageEmployeesMain?organization_id=${item.id}&review=1`
						})
					}
				}
			},
			
			/**
			 * 获取组织列表
			 */
			funcGetOrganizations() {
				Api.getOrganizations().then(res => {
					this.attrOrganizationsList = res.data || [];
				});
			}
		},
	}
</script>

<style lang="less" scoped>
	.cell {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
		border-bottom: 1rpx #faf2f2 solid;
		height: 110rpx;
		align-items: center;
	}
	
	.addGoodsBaseRight {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.addGoodsBaseRightText {
		text-align: right;
	}
</style>
