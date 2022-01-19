<template>
	<view class="container">
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="0"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item, index)">
				<view class="soucteItemLeftBox">
					《 {{ item.title || "" }} 》
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			return {
				attrSource : [],
				attrOrderId: void 0
			}
		},
		
		onLoad(options) {
			if(options.orderId) {
				this.attrOrderId = options.orderId
			}
		},
		
		methods: {
			/**
			 * 跳转到详情
			 */
			funcPushDetail(item, index) {
				uni.navigateTo({
					url : `./contractDetail?id=${item.id}&part=1`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getMyReviewOrderContracts({
					page : page.num,
					per_page : page.size,
					order_id : this.attrOrderId
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
	}
</script>

<style scoped lang="less">
	.container {
		height: 100%;
		background-color: white;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #fbf3f3 solid;
		background-color: white;
	}
</style>
