<template>
	<view class="container">
		<uni-search-bar placeholder="员工搜索" v-model="attrSearchValue" @input="funcJumpSearch"></uni-search-bar>
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="104"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelect(item, index)">
				<view v-if="!attrReview" :class="item.select ? 'select' : 'noselect'"></view>
				<image v-if="item.avatar" class="userImage" :src="item.avatar" mode=""></image>
				<text v-else="!item.avatar" class="userImage">{{ funcSubName(item.name || "" )}}</text>
				<text class="userName">{{ item.name || "" }}</text>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import Mixins from '@/mixins/mixin.vue'
	// 搜索组件
	import UniSearch from '../../components/uni-search-bar/uni-search-bar.vue'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// API
	import Api from "../../apis/apis.js"
	// 用户信息
	const UserInfo = uni.getStorageSync('UserInfo')
	export default {
		mixins: [ CustomMescrollMixin, Mixins ], 
		data() {
			return {
				attrSearchValue: void 0,
				attrReview: false,
				attrIds : [],
				attrSource : [],
				attrEmployeesList : [],
				attrContainsSelf : true,
				attrSignTouch : false,
				attrEmit : "SELECTEMPLOYEES",
				attrOrganizationId : void 0,
				attrLayer: 1
			}
		},
		
		components: {
			UniSearch	
		},
		
		onLoad(options) {
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title
				})
			}
			if(options.review) {
				this.attrReview = options.review
			}
			if(options.organization_id) {
				this.attrOrganizationId = options.organization_id
			}
			if(options.emit) {
				this.attrEmit = options.emit || this.attrEmit
			}
			if(options.ids) {
				this.attrIds = options.ids.split(",") || []
			}
			if( options.self == '1') {
				this.attrContainsSelf = true
			} else {
				this.attrContainsSelf = false
			}
			if( options.sign == '1') {
				this.attrSignTouch = true
			} else {
				this.attrSignTouch = false
			}
			
			this.attrLayer = options.layer || 1
			
		},
		
		onShow() {
			this.mescroll && this.mescroll.triggerDownScroll()	
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			if(this.attrReview) {
				uni.navigateBack()
				return
			}
			let lastSource = []
			this.attrSource && this.attrSource.map((item, index) => {
				if(this.attrContainsSelf) {
					if(item.select && UserInfo.id != item.id) {
						lastSource.push(item)
					}
				} else {
					if(item.select) {
						lastSource.push(item)
					}
				}
			})
			EventBus.$emit(this.attrEmit, JSON.stringify(lastSource))
			uni.navigateBack()
		},
		
		methods: {
			/**
			 * 选中员工
			 */
			funcSelect(item, index) {
				const obj =JSON.stringify(item)
				if(this.attrReview) {
					if(UserInfo.is_admin) {
						uni.navigateTo({
							url:`./pageEmployeesEdit?item=${obj}`
						})
					}
					return
				}
				if(UserInfo.id == item.id && this.attrContainsSelf) {
					uni.showToast({
						title : '自己不能取消',
						icon : 'none'
					})
					return
				}
				item.select = !item.select
				this.$set(this.attrSource, index, item)
				if(this.attrSignTouch) {
					EventBus.$emit(this.attrEmit, JSON.stringify(item))
					uni.navigateBack({
						delta: Number(this.attrLayer) || 1
					})
				}
			},
			
			/**
			 * 跳转到搜索
			 */
			funcJumpSearch(e) {
				this.attrSource = []
				Api.getEmployeesList({
					name:this.attrSearchValue,
					organization_id : this.attrOrganizationId || ''
				}).then(res=>{
					const list = res.data.data || []
					list && list.map((item, index) => {
						if(this.attrIds.includes(item.id)) {
							item.select = true
						}
					})
					this.attrSource = this.attrSource.concat(list); 
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getEmployeesList({
					page : page.num,
					per_page : page.size,
					organization_id : this.attrOrganizationId || ''
				}).then(res=>{
					const list = res.data.data || []
					list && list.map((item, index) => {
						if(this.attrIds.includes(item.id)) {
							item.select = true
						}
					})
					this.mescroll.endByPage(list.length, res.data.total); 
					if(page.num == 1) this.attrSource = []; 
					this.attrSource = this.attrSource.concat(list); 
				}).catch(()=>{
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style scoped lang="less">
.soucteItem {
	display: flex;
	align-items: center;
	width: 100%;
	background-color: white;
	padding: 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #ccc solid;
}
.userImage {
	color: white;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20rpx;
	background-color: green;
}

.userName {
	margin-left: 20rpx;
}

.select {
	margin-right: 20rpx;
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	background-color: #cec1c1;
	border: 1rpx transparent solid;
}

.noselect {
	.select();
	border: 1rpx #decdcd solid;
	background-color: transparent;
}

.uni-searchbar {
	background-color: white;
}
</style>
