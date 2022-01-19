<template>
	<view class="container">
		<view class="wayItem" v-for="(item, index) in attrWayList" :key="index" @click="funcSelectWay(item)">
			<text>{{ item.name }}</text>
		</view>
	</view>
</template>

<script>
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrWayList : []
			}
		},
		
		mounted() {
			this.funcGtePay()
		},
		
		methods: {
			/**
			 * 点击客户
			 */
			funcSelectWay(item) {
				EventBus.$emit('SELECTMETHODPAYMENT', item)
				uni.navigateBack()
			},
			
			/**
			 * 获取支付方式
			 */
			funcGtePay() {
				Api.getPaytypes().then(res => {
					this.attrWayList = res.data
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.wayItem {
		border-bottom: 1rpx #e8e0e0 solid;
		font-size: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
	}

</style>
