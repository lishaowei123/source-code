<!-- 自定义下拉内容选择 -->
<template>
	<view class="customSelectCustomer" @click.stop="">
		<view class="customSelectContainer" v-for="(item, index) in attrSource" :key="item.label || index">
			<text class="customSelectMainLabel">{{ item.label || "" }}</text>
			<view class="customSelectContainerItems">
				<view :class="jItem.select ? 'customSelectContainerItemsLabelSelect' : 'customSelectContainerItemsLabel'"
					v-for="(jItem, jIndex) in item.source" 
					:key="jIndex" 
					@click.stop="funcClickItem(jItem, jIndex, index)"
				>
					{{ jItem.label }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() { 
		return {
			attrSource : [{
				label : '客户级别',		// 主标题
				resetIndex : 0,			// 索引相等时重置
				source : [{				// 内容
					label : '无',		// 内容ITEM标题
					select : false
				},{
					label : '重要客户',
					select : false
				},{
					label : '普通客户',
					select : false
				},{
					label : '小客户',
					select : false
				}]
			},{
				label : '是否跟进',
				resetIndex : 0,
				source : [{
					label : '暂无',
					select : false
				},{
					label : '跟进一次',
					select : false
				},{
					label : '跟进多次',
					select : false
				}]
			},{
				label : '是否成交',
				resetIndex : 0,
				source : [{
					label : '暂无',
					select : false
				},{
					label : '已成交',
					select : false
				},{
					label : '多次成交',
					select : false
				}]
			},{
				label : '跟进认数',
				resetIndex : -1,
				source : [{
					label : '1人跟进',
					select : false
				},{
					label : '多人跟进',
					select : false
				}]
			}]
		}
	},
	
	mounted() {
		this.attrCopySource = JSON.parse(JSON.stringify(this.attrSource)) 
		if(this.dataSource && this.dataSource.length) {
			this.attrSource = this.dataSource
		}
	},
	
	props: {
		dataSource: {
			type : Array,
			default: []
		}
	},
	
	methods: {
		/**
		 * 点击ITEM
		 */
		funcClickItem(item, index, pIndex) {
			if(index == this.attrSource[pIndex].resetIndex) {
				this.attrSource[pIndex].source.map((item, index) => {
					item.select = !index
				})
			} else {
				this.attrSource[pIndex].source[0].select = false
				this.attrSource[pIndex].source[index].select = !this.attrSource[pIndex].source[index].select 
			}
		},
		
		/**
		 * 清除所有选中
		 */
		funcClear() {
			this.$parent.$data.attrCustomSource = []
			this.attrSource = JSON.parse(JSON.stringify(this.attrCopySource))
		},
		
		/**
		 * 确定所有选中
		 */
		funcConfrim() {
			return this.attrSource
		}
	}
}
</script>

<style scoped lang="less">
	.customSelectCustomer {
		width: 100%;
		height: 100%;
		background-color: white;
	}
	
	.customSelectContainer {
		width: 100%;
		padding: 20rpx 0rpx;
		box-sizing: border-box;
	}
	
	.customSelectMainLabel {
		font-size: 40rpx;
		font-weight: bold;
	}
	
	.customSelectContainerItems {
		display: flex;
		flex-wrap: wrap;
	}
	
	.customSelectContainerItemsLabel {
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		background-color: #F7F7F7;
		font-size: 28rpx;
		min-width: 140rpx;
		text-align: center;
		margin-right: 20rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
		border: 1rpx transparent solid;
	}
	
	.customSelectContainerItemsLabelSelect {
		.customSelectContainerItemsLabel();
		color: #5888EE;
		border: 1rpx #5888EE solid;
		background-color: #E5EDF9;
	}

</style>
