<template>
	<view class="left-window-style">
		<view class="second-menu">
			<component v-bind:is="active"></component>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				nav: [
					'component',
					'API',
					'extUI',
					'template'
				]
			}
		},
		props: {
			matchLeftWindow: {
				type: Boolean
			}
		},
		components: {

		},
		computed: {
			
		},
		watch: {

		},
		methods: {
			
		}
	}
</script>

<style>
	@import '../common/uni-nvue.css';

	.left-window-style {
		min-height: calc(100vh - var(--top-window-height));
		background-color: #f8f8f8;
	}

	.second-menu {
		width: 350px;
		background-color: #F8F8F8;
	}

	.icon-image {
		width: 30px;
		height: 30px;
	}
</style>
