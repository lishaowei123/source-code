<template>
	<view class="customerListBaseView">
		<uni-search-bar placeholder="搜索" @focus="funcJumpSearch"></uni-search-bar>
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="104"
		>
			<view class="searchContentContainer">
				<view class="searchContentContainerItem" v-for="(item, index) in attrSource" :key="index" @click="funcTouchCuctomer(item)">
					<text class="searchContentContainerItemTitle">{{ item.name || "" }}</text>
					<text class="searchContentContainerItemPerson">有地址</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 搜索组件
	import UniSearch from '../../components/uni-search-bar/uni-search-bar.vue'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ],
		data() {
			return {
				attrSource: [],
				attrShow: 1
			}
		},
		
		components: {
			UniSearch	
		},
		
		onLoad(options) {
			if(options.title) {
				uni.setNavigationBarTitle({
					title: options.title || "选择我的客户"
				})
			}
			
			if(options.show) {
				this.attrShow = options.show || 1
			}
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url : './customerCreate'
			})
		},
		
		methods: {
			/**
			 * 跳转到搜索
			 */
			funcJumpSearch(e) {
				let path = JSON.stringify('pages/pageVisit/visitCreate')
				uni.navigateTo({
					url : `./customerSearch?path=${path}`
				})
			},
			
			/**
			 * 点击客户
			 */
			funcTouchCuctomer(item) {
				EventBus.$emit('SELECTCUSTOMER', item)
				uni.navigateBack()
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getCustomersList({
					page : page.num,
					per_page : page.size,
					show: this.attrShow
				}).then(res=>{
					const list = res.data.data || []
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

<style lang="less" scoped>
	uni-page-body {
		height: 100%!important;
		background-color: white!important;
	}
	
	.customerListBaseView {
		width: 100%; 
		background-color: white;
	}
	
	.searchContentContainer {
		padding: 20rpx;
		background-color: white;
	}
	
	.searchContentContainerItem {
		border-bottom: 1rpx #efecec solid;
		display: flex;
		flex-direction: column;
		padding: 20rpx 0rpx;
	}
	
	.searchContentContainerItemTitle {
		
	}
	
	.searchContentContainerItemPerson {
		background-color: #92cbef;
		color: #2b2ba5;
		font-size: 22rpx;
		width: 100rpx;
		text-align: center;
		border-radius: 6rpx;
		margin-top: 4rpx;
	}
	
</style>
