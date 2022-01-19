<template>
	<view class="container">
		<mescroll-empty v-if="!attrSource.length"></mescroll-empty>
		<mescroll-uni 
			v-if="attrSource.length"
			ref="mescrollRef"
			@down="funcDownLoad" 
			@up="funcUpLoad" 
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelectItem(item, index)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox">
						订单编号 {{ item.number || "" }}
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">订单金额: </text>
						<text class="value">{{item.money  }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">下单时间: </text>
						<text class="value">{{item.date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">商品: </text>
						<text class="value">{{item.goods }}</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 刷新组件 
import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 事件处理
import EventBus from '../../common/bus.js'
export default {
	mixins: [ CustomMescrollMixin ], 
	
	data() {
		return {
			attrSource: [{
				number : "NASK0091920",
				person : '达成数据有限公司',
				date : '2019-02-19',
				money : 10000,
				goods : '软件服务'
				
			},{
				number : "NASK0091920",
				person : '达成数据有限公司',
				date : '2019-02-19',
				money : 10000,
				goods : '软件服务'
			}]
		}
	},
	
	mounted() {
		// EventBus.$on('person', (e) => {
		// 	this.attAddContact
		// })
	},
	
	methods: {
		/**
		 * 点击我可以查看的客户
		 */
		funcReviewClick() {
			uni.navigateTo({
				url:'./customerReview'
			})
		},

		/**
		 * 选中子元素
		 */
		funcSelectItem(item, index) {
			EventBus.$emit("SELECTASSOCIATEDORDER", item)
			uni.navigateBack()
		},
		
		/**
		 * 下拉刷新
		 */
		funcDownLoad() {
			// use https://www.mescroll.com/uni.html
			console.log('请求数据');
			
			
			setTimeout(() => {
				this.mescroll.endSuccess()
			}, 2000)
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			this.mescroll.endErr()
			return
		},
	}
};
</script>

<style scoped lang="less">
	
	.container {
		height: 100%;
		// background-color: white;
	}
	
	.contentBaseView {
		position: relative;
		top: 80rpx;
		width: 100%;
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		height: calc(100% - 160rpx);
	}
	
	.mescroll-empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	
	.soucteItem {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
	.soucteItemLeft {
		font-size: 24rpx;
	}
	
	.soucteItemRight {
		font-size: 24rpx;
	}
</style>
