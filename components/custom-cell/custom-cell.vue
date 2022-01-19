<template>
	<view class="suctomCellBaseView" @click="funcClick" :style="{'border-bottom': `1rpx ${borderColor} solid`}">
		<view class="suctomCellLeft">
			<image class="suctomCellLeftImage" v-if="showImage" :src="icon" mode=""></image>
			<text class="suctomCellLeftText">{{ title || "" }}</text>
		</view>
		<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		
		props: {
			icon : {
				type :String,
				default: "../../static/60x60.png"
			},
			title : {
				type :String,
				default: ""
			},
			borderColor: {
				type : String,
				default: "#FFFFFF"
			},
			showImage: {
				type : Boolean,
				default: true	
			}
		},
		
		methods: {
			/**
			 * 点击
			 */
			funcClick() {
				this.$emit("select")
			}
		}
	}
</script>

<style lang="less" scoped>
	.suctomCellBaseView {
		font-size: 0;
		width: 100%;
		height: 80rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.suctomCellLeft {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.suctomCellLeftImage {
		width: 50rpx;
		height: 50rpx;
	}
	
	.suctomCellLeftText {
		font-size: 24rpx;
		margin-left: 20rpx;
	}
</style>
