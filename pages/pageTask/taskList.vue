<template>
	<view class="container">
		<template v-if="attrSource.length">
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
		</template>
		<template v-else>
			<view class="empty">暂无数据</view>
		</template>
	</view>
</template>

<script>
	// mixins
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrSource : []
			}
		},
		
		onLoad(options) {
			const index = options.index
			const key = options.key
			const data = JSON.parse(uni.getStorageSync('taskAnalysis'))  
			this.attrSource = data[key] && data[key][index] && data[key][index].data || []
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title
				})
			}
			
			if(options.type) {
				this.attrType = options.type
			}
			if(options.title) {
				uni.setNavigationBarTitle({
					title : options.title
				})
			}
		},
		
		mounted() {
			
		},
		
		methods: {
			/**
			 * 跳转详情
			 */
			funcSelect(item, index) {
				uni.navigateTo({
					url : `./taskDetail?id=${item.id}`
				})
			},
		},
		
	}
</script>

<style lang="less" scoped>
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
	
	.time {
		font-size: 24rpx;
		color: #bfaeae;
		margin-top: 10rpx;
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
	
	.empty {
		color: #d5bfbf;
		width: 100%;
		height: 160rpx;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
</style>
