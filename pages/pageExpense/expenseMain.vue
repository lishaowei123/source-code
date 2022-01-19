<template>
	<view class="container">
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		
		<mescroll-uni ref="mescrollRef" @down="downCallback" @up="funcUpLoad" top="0">
			<custom-cell title="我提交的报销单" icon="../../static/baoxiao.png" borderColor="#f8eeee" @select="funcSelectMySubmit"></custom-cell>
			<custom-cell title="需要我审批的报销单" icon="../../static/shenqingbaoxiao.png" borderColor="#f8eeee" @select="funcSelectMyApproval"></custom-cell>
			<custom-cell title="需要我支付的报销单" icon="../../static/shenqingbaoxiao.png" borderColor="#f8eeee" @select="funcSelectMyPay"></custom-cell>
			<view class="myApply">消费记录({{ attrPageSource.total || 0 }})</view>
			<view class="cell" v-for="(item, index) in attrSource" :key="index" @click="funcPushInfo(item)">
				<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
				<view class="centerContent">
					<text>{{ item.type }}</text>
					<text style="font-size:24rpx;">{{ item.date }}</text>
				</view>
				<text class="price">¥{{ item.price }}</text>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// 自定义cell
import CustomCell from '@/components/custom-cell/custom-cell.vue';
// API
import Api from "../../apis/apis.js"
// Mixins
import Mixins from '@/mixins/mixin.vue';

export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {
			attrPageSource : {},
			attrSource: [],
			attrShowPopUp: false,
			attrPopUpDataSource: [
				{
					icon: '',
					title: '添加消费记录',
					index: 0
				},
				{
					icon: '',
					title: '创建报销单',
					index: 1
				}
			],
		};
	},

	components: {
		CustomCell
	},
	
	mounted() {
		const userInfo = uni.getStorageSync('UserInfo')	
		if(userInfo.is_admin) {
			this.attrPopUpDataSource.push({
				icon: '',
				title: '审批人设置',
				index: 2
			})
		} 
	},

	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {
		this.attrShowPopUp = true;
	},

	methods: {
		/**
		 * 跳转到统计分析
		 */
		funcTouchQushi() {
			uni.navigateTo({
				url : './expenseAnalysis'
			})
		},
		
		/**
		 * 点击popup-item
		 */
		funcTapPopup(e) {
			switch (e.index) {
				case 0:
					uni.navigateTo({
						url: "./expenseCreate"
					});
					break;
				case 1:
					uni.navigateTo({
						url: "./expenseSelect"
					});
					break;
				case 2:
					uni.navigateTo({
						url: "./expenseCreatePerson"
					});
					break;
				default:
					break;
			}
		},
		
		/**
		 * 跳转到详情
		 */
		funcSelectMyPay() {
			uni.navigateTo({
				url : './expenseMyPay'
			})
		},
		
		/**
		 * 跳转详情
		 */
		funcPushInfo(item) {
			uni.navigateTo({
				url : `./expenseCreate?id=${item.id}`
			})
		},
		
		/**
		 * 我提交的报销单
		 */
		funcSelectMySubmit() {
			uni.navigateTo({
				url: './expenseAccount?type=1&title=我提交的报销单'
			});
		},

		/**
		 * 需要我审批的报销单
		 */
		funcSelectMyApproval() {
			uni.navigateTo({
				url: './expenseNeedMyApproval'
			});
		},

		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getSingles({
				page: page.num,
				per_page: page.size
			}).then(res => {
				const list = res.data.data || [];
				this.attrPageSource = res.data || {}
				this.mescroll.endByPage(list.length, res.data.total);
				if (page.num == 1) this.attrSource = [];
				this.attrSource = this.attrSource.concat(list);
			}).catch(() => {
				this.mescroll.endErr();
			});
		}
	}
};
</script>

<style scoped lang="less">
	.myApply {
		display: flex;
		align-items: center;
		height: 56rpx;
		font-size: 24rpx;
		padding: 0rpx 20rpx;
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
	
	.qushiImage {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 100;
	}
</style>
