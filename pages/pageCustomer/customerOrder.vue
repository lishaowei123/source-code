<template>
	<view class="container">
		<template v-if="attrType == 1">
			<view class="baseView" v-if="attrSource.length">
				<view class="baseViewItem" v-for="(item, index) in attrSource" :key="index" @click="funcClickItem(item)">
					<view class="">
						订单金额: ¥{{item.price || ""}}
					</view>
					<view class="person">客户: {{item.customer && item.customer.name || ""}}</view>
					<view class="person">下单日期: {{item.order_date || ""}}</view>
					<view class="person">订单编号: {{item.number|| ""}}</view>
					<view class="person">归属人: {{item.admin && item.admin.name || ""}}</view>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 2">
			<view class="expenseHeaderBase">
				<view class="expenseHeader">
					<view :class="['expenseItem', attrSelectIndex == 1 ? 'expenseItemSelect' : '' ]" @click="funcClickIndex(1)">时间排序</view>
					<view :class="['expenseItem', attrSelectIndex == 2 ? 'expenseItemSelect' : '' ]" @click="funcClickIndex(2)">金额排序</view>
				</view>
			</view>
			<view class="baseView" v-if="attrSource.length">
				<view class="cell" v-for="(item, index) in attrSource" :key="index" @click="funcPushInfo(item)">
					<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
					<view class="centerContent">
						<text>{{ item.customer && item.customer.name }}</text>
						<text style="font-size:24rpx;">{{ item.date }}</text>
					</view>
					<text class="price">¥{{ item.price }}</text>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 3">
			<view class="baseView" v-if="attrSource.length">
				<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelect(item, index)">
					<view :class=" item.status == 0 ? 'headerView' : 'headerViewDis'">
						<view class="headerImage" v-if="item.status == 0">
							{{ item.admin && funcSubName(item.admin.name) || "获取中" }}
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
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 4">
			<view class="baseView" v-if="attrSource.length">
				<view class="soucteItem" style="padding:20rpx 20rpx;flex-direction:initial" v-for="(item, index) in attrSource" :key="index" @click="funcPushKuiKuanDetail(item)">
					<view class="soucteItemLeft">
						<view class="soucteItemLeftBox coarse">
							回款金额 ¥{{ item.price || "" }}
						</view>
						<view class="soucteItemLeftBox">
							<text class="label">回款日期: </text>
							<text class="value">{{item.date }}</text>
						</view>
						<view class="soucteItemLeftBox">
							<text class="label">方式: </text>
							<text class="value">{{item.paytype && item.paytype.name }}</text>
						</view>
						<view class="soucteItemLeftBox">
							<text class="label">归属人: </text>
							<text class="value">{{item.admin && item.admin.name  }}</text>
						</view>
					</view>
					<view class="soucteItemRight">
						<text>{{ item.status == 0 ? '未确认' : item.status == 1 ? '已确认' : '' }}</text>
					</view>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 5">
			<view class="baseView" v-if="attrSource.length">
				<view class="soucteItem" style="padding:20rpx 20rpx" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item, index)">
					<view class="soucteItemLeftBox">
						 {{ item.title || "" }}
					</view>
					<view class="soucteItemLeftBox">
						<text class="person">截止日期: </text>
						<text class="person">{{item.end_date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="person">归属人: </text>
						<text class="person">{{item.admin && item.admin.name }}</text>
					</view>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
		<template v-if="attrType == 6">
			<view class="baseView" v-if="attrSource.length">
				<view class="goodItems" v-for="(item, index) in attrSource" :key="index" @click="funcGoodsInfo(item)">
					<text class="goodItemsTitle">{{ item.goods && item.goods.name }}</text>
					<text class="person">{{ item.goods && item.goods.bar_code }}</text>
					<text class="person" v-if="item.goods.price">销售价: {{ item.goods && item.goods.price }}元/{{ item.goods && item.goods.unit || "件" }}</text>
					<text class="person">分类：{{ item.goods.category && item.goods.category.name || '无' }}</text>
					<text class="person">购买数量：{{ item.number || '' }}</text>
				</view>
			</view>
			<view class="emptyBaseView" v-else>
				<view class="person">
					暂无数据
				</view>
			</view>
		</template>
		
	</view>
</template>

<script>
	const userInfo = uni.getStorageSync('UserInfo')
	// mixins
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins: [Mixins],
		data() {
			return {
				attrSource : [],
				attrType: 1,
				attrSelectIndex: 1,
				attrTotalSource : {}
			}
		},
		
		onLoad(options) {
			const key = options.key
			let data =  JSON.parse(uni.getStorageSync('customerDetailSource'))  
			this.attrTotalSource = data
			this.attrSource = data[key] || []
			uni.setNavigationBarTitle({
				title : options.title || "客户"
			})
			if(options.type) {
				this.attrType = options.type
				if(this.attrType == 6 || (data.admin_id != userInfo.id)) {
					// #ifdef APP-PLUS
					const webView = this.$scope.$getAppWebview()
					webView.setTitleNViewButtonStyle(0, {
						width: '0'
					});
					// #endif
				}
			}
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			if(this.attrTotalSource.admin_id != userInfo.id) {
				return
			}
			if(this.attrType == 1) {
				uni.navigateTo({
					url: '../pageOrder/orderCreate'
				})
			} else if(this.attrType == 2) {
				uni.navigateTo({
					url: '../pageExpense/expenseMain'
				})
			} else if(this.attrType == 3) {
				uni.navigateTo({
					url: '../pageTask/taskCreate'
				})
			} else if(this.attrType == 4) {
				uni.navigateTo({
					url: '../pageReceivable/receivableCreate'
				})
			} else if(this.attrType == 5) {
				uni.navigateTo({
					url: '../pageContract/contractCreate'
				})
			} else if(this.attrType == 6) {
				return
				uni.navigateTo({
					url: '../pageGoods/goodsDetailCreate'
				})
			}
		},

		methods: {
			
			/**
			 * 跳转详情
			 */
			funcPushInfo(item) {
				uni.navigateTo({
					url : `../pageExpense/expenseDetail?id=${item.order_single_id}`
				})
			},
			
			/**
			 * 店家索引
			 */
			funcClickIndex(index) {
				this.attrSelectIndex = index
			},
			
			/**
			 * 商品详情
			 */
			funcPushKuiKuanDetail(item) {
				uni.navigateTo({
					url : `../pageReceivable/receivableDetail?id=${item.id}`
				})
			},
			
			/**
			 * 商品详情
			 */
			funcGoodsInfo(item) {
				uni.navigateTo({
					url : `../pageGoods/goodsInfo?id=${item.id}`
				})
			},
			
			/**
			 * 跳转到详情
			 */
			funcPushDetail(item, index) {
				uni.navigateTo({
					url : `../pageContract/contractDetail?id=${item.id}`
				})
			},
			
			/**
			 * 跳转详情
			 */
			funcSelect(item, index) {
				uni.navigateTo({
					url : `../pageTask/taskDetail?id=${item.id}`
				})
			},
			
			/**
			 * 跳转到客户详情
			 */
			funcClickItem(item) {
				uni.navigateTo({
					url : `../pageOrder/orderInfo?id=${item.id}`
				})
			} 
		},
		
	}
</script>

<style lang="less" scoped>

	.blueBase {
		width: 100%;
		height: 300rpx;
		background-color: #7676c4;
	}
	
	.baseView {
		position: absolute;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: auto;
	}
	
	.baseViewItem {
		background-color: white;
		min-height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 10rpx;
		padding: 20rpx 20rpx;
		border-top: 10rpx #f5f5f5 solid;
	}
	
	.person {
		font-size: 24rpx;
		color: #a79f9f;
	}
	
	.emptyBaseView {
		.baseView();
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx 0rpx;
		border-bottom: 1rpx #fbf3f3 solid;
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
	
	.goodItems {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		background-color: white;
	}
	
	.goodItemsTitle {
		font-size: 26rpx;
	}
	
	.soucteItemLeft {
		font-size: 24rpx;
	}
	
	.soucteItemRight {
		font-size: 24rpx;
	}
	
	.coarse {
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}
	
	.expenseHeader {
		display: flex;
		width: 350rpx;
		height: 70rpx;
		border: 1rpx #ea7e06 solid;
		margin: 0 auto;
		border-radius: 4rpx;
		background-color: white;
		color: #ea7e06;
	}
	
	.expenseItem {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}
	
	.expenseItemSelect {
		background-color: #ea7e06;
		color: white
	}
	
	.expenseHeaderBase {
		width: 100%;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	
	.cell {
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		background-color: white;
		align-items: center;
		border-bottom: 1rpx #f6eeee solid;
	}
	
	.icon {
		width: 80rpx;
	}
	
	.centerContent {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.price {
		color: #FFA200;
	}
</style>
