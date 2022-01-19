<template>
	<view class="emptyBaseView">
		<text>{{ text }}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		
		props: {
			text: {
				type : String,
				default: "暂无数据"
			}
		},
		
		methods: {
			
		}
	}
</script>

<style scoped>
	.emptyBaseView {
		width: 100%;
		height: 100%;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}

</style>
