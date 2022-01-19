<template>
	<view class="container">
		<view class="personItem">
			<text class="itemLabel">客户名称</text>
			<textarea class="itemTextarea " placeholder="请输入客户名称" v-model="attrPersonInfo.customerName" auto-height maxlength=-1 />
		</view>
		<view class="personItem">
			<text class="itemLabel">联系人名称</text>
			<input class="itemInput" placeholder="请输入联系人名称" v-model="attrPersonInfo.name" />
		</view>
		<view class="personItem">
			<text class="itemLabel">联系人电话</text>
			<input class="itemInput" placeholder="请输入联系人电话" v-model="attrPersonInfo.phone" />
		</view>
		
		<button type="primary" class="queryButton" @click="funcQuery">查询</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attrPersonInfo: {
					customerName : '',
					name : '',
					phone : ''
				},
			}
		},
		
		methods: {
			funcQuery() {
				uni.navigateTo({
					url : `./customerRepeat?customerInfo=${JSON.stringify(this.attrPersonInfo)}`
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.personItem {
		display: flex;
		align-items: center;
		min-height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		background-color: white;
	}
	
	.itemLabel {
		
	}
	
	.itemInput {
		font-size: 28rpx;
		margin-left: 20rpx;
		flex: 1;
	}
	
	.itemTextarea {
		.itemInput();
		padding: 10rpx 0rpx;
		box-sizing: border-box;
	}
	
	.queryButton {
		width: 90%;
		margin-top: 40rpx;
	}
	
</style>
