<template>
<view class="baseView">
		<view class="item" v-for="(item, index) in attrList" :key="index" @click="funcSelectItem(item)">
			{{ item.label || "" }}
			<!-- #ifndef APP-PLUS -->
				<span v-show="attrSelectItem.value == item.value" class="iconfont icon-duihao"></span>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
				<text v-show="attrSelectItem.value == item.value">✔️</text>
			<!-- #endif -->
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
				attrList : [],
				attrSelectItem : {},
				attrPropsSource : {},
			}
		},
		
		onLoad(options) {
			this.attrPropsSource = options || {}
			this.attrSelectItem = options.item && JSON.parse(options.item) || {} 
			uni.setNavigationBarTitle({
				title: options.title
			})
			switch (options.type){
				case '1':
					this.attrList = [{
						label : '上架中',
						value : 1
					}, {
						label : '下架中',
						value : 0
					}]
					break;
				case '2':
					this.funcGetGoodsCategory();
					break;
				case '3':
					this.attrList = [{
						label : '个',
						value : 1
					},{
						label : '件',
						value : 2
					},{
						label : '箱',
						value : 3
					}]
					break;
				case '4':
					this.attrList = [{
						label : '低',
						value : 1
					},{
						label : '中',
						value : 2
					},{
						label : '高',
						value : 3
					}]
					break;
				case '5':
					this.attrList = [{
						label : '有',
						value : 1
					}, {
						label : '无',
						value : 0
					}]
					break;
					case '6':
						this.funcGetXishu();
						break;
				default:
					break;
			}
		},
		
		methods: {
			/**
			 * 选择商品
			 */
			funcSelectItem(item) {
				EventBus.$emit(this.attrPropsSource.event, item)
				uni.navigateBack()
			},
			
			/**
			 * 获取商品分类
			 */
			funcGetGoodsCategory() {
				Api.getGoodsCategory().then(res => {
					let source = []
					res.data && res.data.map(item => {
						source.push({
							label : item.name,
							value : item.id
						})
					})
					this.attrList = source
				})
			},
			
			/**
			 * 获取系数
			 */
			funcGetXishu() {
				Api.getXishu().then(res => {
					let source = []
					res.data && res.data.map(item => {
						source.push({
							label : item.name,
							value : item.id
						})
					})
					this.attrList = source
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.baseView {
		width: 100%;
	}
	
	.item {
		border-top: 1rpx #fef5f5 solid;
		height: 80rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		align-items: center;
		font-size: 26rpx;
		background-color: white;
	}
</style>
