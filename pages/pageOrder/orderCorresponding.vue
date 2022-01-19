<template>
	<view class="container">
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelecrOrder(item)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox">
						<text class="label">订单编号: </text>
						<text class="value">{{ item.number  }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">订单金额: </text>
						<text class="value">{{ item.price }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">下单日期: </text>
						<text class="value">{{ item.order_date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">商品: </text>
						<text class="value">{{ item.goodsName }}</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			return {
				attrCustomerId : void 0,
				attrSource : []
			}
		},
		
		onLoad(options) {
			this.attrCustomerId = options.id
		},
		
		methods: {
			/**
			 * 选中订单
			 */
			funcSelecrOrder(item) {
				EventBus.$emit("SELECTCUTOMERORDER", item)
				uni.navigateBack()
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getOrders({
					customer_id: this.attrCustomerId,
					page : page.num,
					per_page : page.size
				}).then(res=>{
					const list = res.data.data || []
					list && list.map((item, index) => {
						let goods = []
						item.order_goods && item.order_goods.map((i) => {
							goods.push(i.goods && i.goods.name)
						})
						item.goodsName = goods.join('、')
					})
					
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

<style scoped lang="less">
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
