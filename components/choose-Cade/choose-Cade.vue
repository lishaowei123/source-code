<!-- 头部的下拉options选择 -->
<template>
	<view class="chooseBaseView" :style="{
		'height': attrShowItemContent ? `calc(100% - ${attrHeight})` : 'auto', 
		'background-color' : attrShowItemContent ? 'rgba(0, 0, 0, 0.5)' : 'white'
	}" 
	@click="funcCloseMask">
		<view class="chooseBaseViewItems" @touchmove.stop="" @touch.stop="">
			<view class="chooseBaseViewItem" v-for="(item, index) in attrList" :key="item.text" @click.stop="funcClickItem(item, index)">
				<image v-if="item.beforeIcon" class="chooseBaseViewItemImage" :src="item.beforeIcon" mode="widthFix"></image>
				<text>{{item.text || ""}}</text>
				<template v-if="item.type">
					<!-- #ifndef APP-PLUS -->
						<span class="iconfont icon-xialajiantou" :class="attrSelectTitleIndex == index ? 'chooseBaseViewItemArrowFlip' : 'chooseBaseViewItemArrow'"></span>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
						<span :class="attrSelectTitleIndex == index ? 'chooseBaseViewItemArrowFlip' : 'chooseBaseViewItemArrow'"></span>
					<!-- #endif -->
				</template>
			</view>
		</view> 
		<view :class="attrShowItemContent ? 'chooseBaseViewItemContent' : 'chooseBaseViewItemContentNone'"  
			@touchmove.stop="" @touch.stop=""
		>
			<view v-if="attrShowItemContent && attrSelectTitleIndex >= 0">
				<template v-if="attrList[attrSelectTitleIndex].useslot">
					<!-- 自定义页面 -->
					<template v-if="attrList[attrSelectTitleIndex].useslot == 'custom-select'">
						<custom-customer-select ref="custom-select" :dataSource="attrCustomSource" />
					</template>
				</template> 
				<template v-if="!attrList[attrSelectTitleIndex].useslot">
					<view class="chooseBaseViewItemSelect" 
						v-for="(item, index) in attrList[attrSelectTitleIndex].source" 
						:key="index"
						@click="funcSelectItemIndex(item, index)"
					>
						<text :class="item.select ? 'select' : ''">{{item.label || ""}}</text> 
						<!-- #ifndef APP-PLUS -->
							<span v-show="item.select" class="iconfont icon-duihao"></span>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
							<text v-show="item.select">✔️</text>
						<!-- #endif -->
					</view> 
				</template>
			</view>
			<view class="stickyButton" v-if="attrList[attrSelectTitleIndex] && attrList[attrSelectTitleIndex].showBottons">
				<view class="clear" @click.stop="funcClear">
					清空条件
				</view>
				<view class="confirm" @click.stop="funcConfirm">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 自定义页面【 客户筛选条件 】
import CustomCustomerSelect from '@/components/custom-customer-select/custom-customer-select.vue'; 
export default {
	data() {
		return {
			attrHeight : '40rpx',
			attrSelectTitleIndex: -1,
			attrShowItemContent : false,
			attrList : [],
			attrCustomSource : []
		}; 
	}, 
	
	components:{
		CustomCustomerSelect
	},
	
	props: {
		pageHeight: {
			type : String,
			default: '40rpx'
		},
		dataSource: {
			type : Array,
			default: []
		}
	},
	
	watch: {
		dataSource: {
			handler(nvue, ovue) {
			  this.attrList = nvue
			},
			immediate: true
		},
		pageHeight: {
			handler(nvue, ovue) {
			  this.attrHeight = nvue
			},
			immediate: true
		}
	},

	methods: {
		
		/**
		 * 初始状态
		 */
		funcInit() {
			this.attrShowItemContent = false
			this.attrSelectTitleIndex = -1
		},
		
		/**
		 * 清除所有选中
		 */
		funcClear() {
			const data = this.$refs['custom-select'].funcClear && this.$refs['custom-select'].funcClear()
		},
		
		/**
		 * 自定义页面确定 
		 */
		funcConfirm() {
			this.funcInit()
			const data = this.$refs['custom-select'].funcConfrim && this.$refs['custom-select'].funcConfrim()
			this.attrCustomSource = data
		},
		
		/**
		 * 关闭遮罩
		 */
		funcCloseMask() {
			this.funcInit()
		},
		
		/**
		 * 点击item
		 */
		funcClickItem(item, index) { 
			if(!item.type) {
				this.funcInit()
				if(item.customEvent) {
					item.customEvent()
				}
				if(item.path) {
					uni.navigateTo({
						url: item.path
					})
				}
				return
			}
			this.attrShowItemContent = index != this.attrSelectTitleIndex ? true : !this.attrShowItemContent
			this.attrSelectTitleIndex = !this.attrShowItemContent ? -1 : index
		},
		
		/**
		 * select 选中子元素
		 */
		funcSelectItemIndex(item, index) {
			this.attrList[this.attrSelectTitleIndex].text = item.label || "未选中"
			this.attrList[this.attrSelectTitleIndex].source.map((it, idx) => {
				it.select = idx == index
			})
			if(item.path) {
				uni.navigateTo({
					url : item.path
				})
				return
			}
			//获取父元素数据
			const parentSource = this.attrList[this.attrSelectTitleIndex]
			this.funcInit()
			this.$emit('select', { 
				...item, 
				pSource : parentSource,
				source : this.attrList
			})
		},
	}
};
</script>

<style scoped lang="less">
	
	uni-page-body {
		height: 100%!important;
	}
	
	.chooseBaseView {
		background-color: rgba(0,0,0,0.5);
		width: 100%;
		box-sizing: border-box;
		position: absolute;
		z-index: 1000;
		opacity: 1;
		transition: all 0.3s;
	}
	
	.chooseBaseViewItems {
		background-color: #fcfcfc;
		border-bottom: 1rpx #f1f1f1 solid;
		padding: 0rpx 20rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}
	
	.chooseBaseViewItem {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.chooseBaseViewItemImage {
		width: 16px;
		height: 16px;
		margin-right: 6rpx;
	}
	
	.chooseBaseViewItemArrow {
		margin-left: 6rpx;
		font-size: 22rpx;
		transform-origin: center;
		transform: rotate(0deg);
		transition: all 0.3s;
		/* #ifdef APP-PLUS */
			border-width: 12rpx;
			border-style: solid;
			border-color: #000000 transparent transparent transparent;
			margin-top: 12rpx;
		/* #endif */
	}
	
	.chooseBaseViewItemArrowFlip {
		margin-left: 6rpx;
		font-size: 22rpx;
		transform: rotate(180deg);
		transform-origin: center;
		transition: all 0.3s;
		/* #ifdef APP-PLUS */
			border-width: 12rpx;
			border-style: solid;
			border-color: #000000 transparent transparent transparent;
			margin-top: -12rpx;
		/* #endif */
	}
	
	.chooseBaseViewItemContentNone {
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		background-color: white;
		min-height: 0rpx;
		max-height: 80%;
		overflow: auto;
		opacity: 0;
		transition: all 0.3s;
		-webkit-overflow-scrolling : touch;

	}
	
	.chooseBaseViewItemContent {
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		background-color: white;
		min-height: 0rpx;
		max-height: 80%;
		overflow: auto;
		opacity: 1;
		transition: all 0.3s;
		-webkit-overflow-scrolling : touch;
	}
	
	.chooseBaseViewItemSelect {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		border-bottom: 2px #eeeaea solid;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.select {
			color: #5687ED;
		}
	}
	
	.stickyButton {
		position: sticky;
		bottom: 0px;
		z-index: 1;
		background-color: white;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		font-weight: bold;
		
		.clear {
			border-radius: 10rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin-right: 10rpx;
			flex: 1;
			background-color: #F8F8F8;
		}
		
		.confirm {
			border-radius: 10rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin-left: 10rpx;
			flex: 1; 
			background-color: #5687ED;
			color: white;
		}
	}
	
</style>
