<template>
	<view class="container">
		<uni-search-bar placeholder="搜索" v-model="attrSearchValue" @input="funcJumpSearch"></uni-search-bar>
		<mescroll-uni ref="mescrollRef" @down="downCallback" @up="funcUpLoad" top="104">
			<view class="goodItems" v-for="(item, index) in attrSource" :key="index" @click="funcGoodsSelect(item, index)">
				<view :class="item.select ? 'select' : 'noselect'"></view>
				<view class="goodItemsBase">
					<text class="goodItemsTitle">{{ item.name }}</text>
					<text class="goodItemsClass">{{ item && item.number }}</text>
					<text class="goodItemsPrice" v-if="item.price">销售价: {{ item.price }}元</text>
				</view>
			</view>
		</mescroll-uni>
		<view class="lastView" v-if="attrIsBack">
			<text>已选择 {{ attrSelectSource.length || 0 }}个商品 </text>
			<view class="button" @click="funcPushAddGoods">确定</view>
		</view>
	</view>
</template>

<script>
// 事件处理
import EventBus from '../../common/bus.js'
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// mixins
import Mixins from '../../mixins/mixin.vue'
// API
import Api from '../../apis/apis.js';
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {
			attrSource: [],
			attrSelectSource: [],
			attrIsBack : true,
			attrSearchValue : void 0
		};
	},
	
	onLoad(options) {
		if(options.back == 100) {
			this.attrIsBack = false
		}
	},
	
	onShow() {
		this.funcGetGoods();
	},
	
	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {  
		uni.navigateTo({
			url : './goodsDetailCreate'
		})
	},

	methods: {
		/**
		 * 跳转到搜索
		 */
		funcJumpSearch(e) {
			this.funcGetGoods({
				name : this.attrSearchValue
			})
		},
		
		/**
		 * 请求列表
		 */
		funcGetGoods(params) {
			this.attrSource = []
			Api.getGoods(params).then(res => {
				const list = res.data.data || [];
				this.attrSource = list;
			})
		},
		
		/**
		 * 商品选中
		 */
		funcGoodsSelect(item, index) {
			if(!this.attrIsBack) {
				EventBus.$emit("SELECTGOODS", item)
				uni.navigateBack()
				return
			}
			item.select = !item.select
			this.$set(this.attrSource, index, item)
			let arr = []
			this.attrSource && this.attrSource.map((item, index) => {
				if(item.select) {
					arr.push(item)
				}
			})
			this.attrSelectSource = arr
		},
		
		/**
		 * 跳转到商品添加页面
		 */
		funcPushAddGoods() {
			if(this.attrSelectSource.length) {
				uni.navigateTo({
					url : `./goodsAddPage?source=${JSON.stringify(this.attrSelectSource)}`
				})
			} else {
				this.funcShowToast("请选择商品")
			}
		},

		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getGoods({
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
.container {
	background-color: white;
}

.goodItems {
	align-items: center;
	display: flex;
	position: relative;
	width: 100%;
	padding: 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #cccccc solid;
	background-color: white;
}

.goodItemsBase {
	display: flex;
	flex-direction: column;
}

.goodItemsTitle {
	font-size: 26rpx;
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

.lastView {
	width: 100%;
	height: 80rpx;
	position: fixed;
	bottom: 0;
	background-color: white;
	display: flex;
	padding: 20rpx;
	box-sizing: border-box;
	align-items: center;
	justify-content: space-between;
	z-index: 1;
}

.button {
	width: 140rpx;
	background-color: #2b2ba5;
	text-align: center;
	justify-content: center;
	border-radius: 10rpx;
	color: white;
}
</style>
