<template>
	<view class="container">
		<mescroll-uni
			ref="mescrollRef"
			@up="funcUpLoad" 
			@down="downCallback" 
			top="0"
		>
			<custom-cell title="已审批的报销单" icon="../../static/shenqingbaoxiao.png" @select="funcTouch"></custom-cell>
			<view class="myApply">需要我审批的({{ attrPageSource.total }})</view>
			<view class="cellBox" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)"> 
				<view class="headerImage">
					{{ item.order_single && item.order_single.admin && funcSubName(item.order_single.admin.name) || "获取中" }}
				</view>
				<view class="cellRight">
					<view class="cell">
						<text style="font-size:30rpx;padding-bottom: 10rpx;">{{ item.order_single && item.order_single.title }}</text>
						<text style="font-size:26rpx">报销¥ {{ item.order_single && item.order_single.total_price }}</text>
						<text class="status">状态：{{ item.status == 0 ? '正在处理中' : item.status == 1 ? '' : ''}}</text>
					</view>
					
					<view class="time">
						{{ item.updated_at && funcGetDate("MM-DD HH:mm", item.updated_at)}}
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 自定义cell
import CustomCell from '@/components/custom-cell/custom-cell.vue';
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// API
import Api from "../../apis/apis.js"

import Mixins from '@/mixins/mixin.vue'
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrPageSource : {},
			attrSource: []
		};
	},
	components: {
		CustomCell
	},
	methods: {
		/**
		 * 跳转到熬已审批的报销单
		 */
		funcTouch() {
			uni.navigateTo({
				url: './expenseBeenApproval'
			})
		},
		
		/**
		 * 跳转到详情
		 */
		funcPushDetail(item) {
			uni.navigateTo({
				url : `./expenseDetail?id=${item.model_id}`
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getNeed({
				status : 0,
				type : 5,
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
	
	.cellBox {
		display: flex;
		background-color: white;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx #ededed solid;
	}
	
	.cellRight {
		flex:1;
		display: flex;
	}
	
	.cell {
		width: 100%;
		height: 160rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		box-sizing: border-box;
		margin-left: 20rpx;
	}
	
	.headerImage {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #225796;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.status {
		font-size: 24rpx;
		color: #FFA200;
	}
	
	.time {
		width: 200rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
