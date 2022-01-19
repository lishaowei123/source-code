<template>
	<view class="container">
		<mescroll-empty v-if="!attrSource.length"></mescroll-empty>
		<template v-if="attrSource.length">
			<view class="customerItem" v-for="(item, index) in attrSource" :key="index">
				jaisjai
			</view>
		</template>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [ CustomMescrollMixin ],
		data() {
			return {
				attrSource: []
			}
		}
	}
</script>

<style scoped lang="less">
	
	.customerItem {
		
	}

	
</style>
