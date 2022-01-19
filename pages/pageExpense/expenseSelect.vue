<template>
	<view class="container">
		<mescroll-uni ref="mescrollRef" @down="downCallback" @up="funcUpLoad" top="0">
			<view class="cell" v-for="(item, index) in attrSource" :key="index" @click="funcSelectInfo(item, index)">
				<image class="select" v-if="item.select" src="../../static/select.png" mode=""></image>
				<image class="noselect" v-if="!item.select" src="../../static/noselect.png" mode=""></image>
				<image class="icon" :src="item.type && funcMatchingImage(item.type).icon" mode="widthFix"></image>
				<view class="centerContent">
					<text>{{ item.type }}</text>
					<text>{{ item.date }}</text>
				</view>
				<text class="price">¥{{ item.price }}</text>
			</view>
		</mescroll-uni>
		<view class="buttom" v-if="attrSelectSource.length" @click="funcConfrim">
			合计 ¥ {{ attrTotalPrice }} 
			<text class="btn">确定</text>
		</view>
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
			attrSource: [],
			attrSelectSource : [],
			attrTotalPrice : 0
		};
	},
	methods: {
		/**
		 * 选中
		 */
		funcSelectInfo(item, index) {
			this.$set(this.attrSource[index], 'select', !this.attrSource[index].select)
			let totalPrice = 0
			const selectArr = []
			this.attrSource && this.attrSource.map((item, index) => {
				if(item.select) {
					selectArr.push(item)
					totalPrice += item.price
				}
			})
			this.attrSelectSource = selectArr
			this.attrTotalPrice = totalPrice
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
				this.mescroll.endByPage(list.length, res.data.total);
				if (page.num == 1) this.attrSource = [];
				this.attrSource = this.attrSource.concat(list);
			}).catch(() => {
				this.mescroll.endErr();
			});
		},
		
		/**
		 * 确定
		 */
		funcConfrim() {
			uni.navigateTo({
				url : `./expenseCreateAccount?data=${JSON.stringify(this.attrSelectSource)}`
			})
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
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		background-color: white;
		align-items: center;
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
	
	.noselect {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}
	
	.select {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	
	.buttom {
		justify-content: space-between;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		align-items: center;
		position: absolute;
		bottom: 0rpx;
		height: 100rpx;
		background-color: #ffa306;
		width: 100%;
		display: flex;
		color: white;
		z-index: 1;
	}
	
	.btn {
		width: 140rpx;
		background-color: white;
		height: 60rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffa306;
	}
</style>
