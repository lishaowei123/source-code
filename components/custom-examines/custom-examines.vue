<template>
	<view class="container">
		<view class="examinesBaseView" v-for="(item, index) in source" :key="item.id">
			<view class="tip">
				<view class="lineTriangle"></view>
				<view class="line"></view>
			</view>
			<view class="headerView">
				<view class="headerImageBorder">
					<view class="headerImage">
						{{ funcSubName(item.name) || "获取中" }}
					</view>
				</view>
				<view class="headerRightInfo">
					<view>{{ item.name  || "获取中" }}</view>
					<view style="color:#ddb008e3;" v-if="!index">
						{{tipString || ""}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Mixins from '@/mixins/mixin.vue'
	export default {
		mixins: [ Mixins ],
		data() {
			return {
				
			}
		},
		
		props: {
			tipString : {
				type : String,
			},
			source : {
				type :Array
			}
		}
	}
</script>

<style scoped lang="less">
	
.examinesBaseView {
	background-color: #f0eff3;
}

.tip {
	background-color: #f0eff3;
    padding: 0rpx 50rpx;
	display: flex;
    flex-direction: column;
    align-items: center;
    width: 40rpx;
}

.lineTriangle {
	margin-top: -4rpx;
	width: 0rpx;
	border-width: 14rpx 14rpx 0rpx 14rpx;
	border-style: solid;
	border-color: #d8c6c6 transparent transparent transparent;
}

.line {
	height: 20rpx;
	width: 1rpx;
	margin-left: -1rpx;
	margin-top: -2rpx;
	background-color: #d8c6c6;
}


.headerView {
	display: flex;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #f0eff3;
}

.headerImage {
	width:90rpx;
	height:90rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #225796;
	flex-shrink: 0;
	color: white;
	font-size: 22rpx;
}

.headerRightInfo {
	margin-left: 20rpx;
}

.headerImageBorder {
	border: 1rpx #d9c1c1 solid;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100rpx;
	height: 100rpx;
}

</style>
