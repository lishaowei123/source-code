<template>
	<view class="container">
		<mescroll-uni
			ref="mescrollRef"
			@up="funcUpLoad" 
			@down="downCallback" 
		>
			<view class="cell" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)"> 
				<view class="cellTop">
					<text style="font-size: 30rpx;">{{ item.title }}</text>
					<text style="font-size: 24rpx;">{{ funcGetDate("HH:mm", item.created_at) }}</text>
				</view>
				<text style="font-size: 26rpx;">报销¥ {{ item.total_price }}</text>
				<view class="statusBox">
					<text :class="item.status == 0 ? 'status' : item.status == 2 ? 'status2' : ''">
						状态：{{ item.status != 3 ? (item.user && item.user.name) : '' }}{{ item.status == 0 ? '正在处理中...' : item.status == 1 ? '审批完成' : item.status == 2 ? '已驳回' : '已撤销'}}
					</text>
					<text :class="item.status == 0 ? 'status' : ''" v-if="item.status != 2">{{ item.pay_status == 1 ? '已支付' : item.pay_status == 0 ? '未支付' : '' }}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// API
import Api from "../../apis/apis.js"
import Mixins from "../../mixins/mixin.vue"
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrSource: []
		};
	},

	methods: {
		/**
		 * 跳转到详情
		 */
		funcPushDetail(item) {
			uni.navigateTo({
				url : `./expenseDetail?id=${item.id}`
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getOrderSingles({
				page: page.num,
				per_page: page.size
			}).then(res => {
				const list = res.data.data || [];
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
	.cell {
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: center;
		padding: 20rpx;
		flex-direction: column;
		box-sizing: border-box;
		border-bottom: 1rpx #ededed solid;
	}
	
	.cellTop {
		display: flex;
		justify-content: space-between;
		padding-bottom: 10rpx;
	}
	
	.status {
		color: #FFA200;
	}
	
	.status2 {
		color: #e14f22;
	}
	
	.statusBox {
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
	}
</style>
