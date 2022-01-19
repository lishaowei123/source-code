<template>
	<view class="container">
		<custom-cell title="我发布的" borderColor="#f0f0f0" icon="../../static/renwu.png" @select="funcSelectMyRelease"></custom-cell>
		<custom-cell title="抄送给我的" icon="../../static/renwu1.png" @select="funcSelectMyAssociated"></custom-cell>
		<view class="myApply">我收到的任务</view>
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="225"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelect(item, index)">
				<view :class=" item.status == 0 ? 'headerView' : 'headerViewDis'">
					<view class="headerImage" v-if="item.status == 0">
						{{ item.manager_staff && funcSubName(item.manager_staff.name) || "获取中" }}
					</view>
					<image v-else class="headerImage" src="../../static/wanchengrenwu.png" mode=""></image>
					<view class="headerRightInfo">
						<view>{{ item && item.name || "" }}</view>
						<view class="buttonBox">
							<template v-if="item.status == 0">
								<text class="time" v-if="item.status == 0">{{ funcOverdue(item.end_date || "", ) }} </text>
								<text :class="[ funcOverdueStatus(item.end_date) ? 'pointOverdue' : 'point' ]"></text>
							</template>
							<template v-if="item.status == 1">
								<text class="time" v-if="item.status == 1">截止 {{ funcFormat(item.end_date) }} </text>
								<text class="point"></text>
							</template>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// API
import Api from "../../apis/apis.js"
// mixins
import Mixins from '@/mixins/mixin.vue'

export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrSource: []
		}
	},
 
	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {  
		const userInfo = uni.getStorageSync('UserInfo')
		if(userInfo.is_task) {
			uni.navigateTo({ 
				url : './taskCreate'
			})
		} else {
			uni.showToast({
				title : '暂无权限',
				icon : 'none'
			})
		}
	},  
	
	onShow() {
		const userInfo = uni.getStorageSync('UserInfo')
		if(!userInfo.is_task) {
			// #ifdef APP-PLUS
				const webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text : ""
				});
			// #endif 
		} 
	},
	
	mounted() {
		const userInfo = uni.getStorageSync('UserInfo')
		if(!userInfo.is_task) {
			// #ifdef APP-PLUS
				const webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text : ""
				});
			// #endif
		} 
	},
			
	methods: {
		/**
		 * 单击趋势
		 */
		funcTouchQushi() {
			uni.navigateTo({
				url : './taskAnalysis'
			})
		},
		
		/**
		 * 我发布的
		 */
		funcSelectMyRelease() {
			uni.navigateTo({
				url : './taskRelease?type=1&title=发布的任务'
			})
		},
		
		/**
		 * 抄送给我的
		 */
		funcSelectMyAssociated() {
			uni.navigateTo({
				url : './taskRelease?type=2&title=抄送我的任务'
			})
		},
		
		/**
		 * 跳转详情
		 */
		funcSelect(item, index) {
			uni.navigateTo({
				url : `./taskDetail?id=${item.id}`
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.myTask({
				page : page.num,
				per_page : page.size
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
};
</script>

<style scoped lang="less">
	.myApply {
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		background-color: whitesmoke;
	}
	
	.container {
		background-color: white;
	}
	
	.headerView {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
	}
	
	.headerViewDis {
		.headerView();
		color: #bfaeae;
	}
	
	.headerImage {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #a4abb3;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.headerRightInfo {
		flex: 1;
		margin-left: 20rpx;
	}
	
	.point {
		width: 10rpx;
		height: 10rpx;
		background-color: #a4abb3;
		border-radius: 50%;
	}
	
	.buttonBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.pointOverdue {
		.point();
		background-color: red;
	}
	
	.time {
		font-size: 24rpx;
		color: #bfaeae;
		margin-top: 10rpx;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx 0rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #fbf3f3 solid;
		background-color: white;
	}
	
	.qushiImage {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 100;
	}
	
</style>
