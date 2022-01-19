<template>
	<view class="container">
		<view class="" v-for="(item, index) in attrSource" :key="index">
			<view class="header">
				<text>商品 {{ index + 1 }}</text>
				<text class="delete" v-if="attrSource.length > 1" @click="funcDeleteContactInfo(index)">删除</text>
			</view>
			<view class="personItem">
				<text class="itemLabel">名称</text>
				<input class="iteminput" type="text" v-model="item.name" />
			</view>
			<view class="personItem">
				<text class="itemLabel">单价</text>
				<input class="iteminput" type="text" v-model="item.price" />
			</view>		
			<view class="personItem">
				<text class="itemLabel">数量</text>
				<view class="numberView">
					<text class="clearance" @click="funcJian(item, index)">-</text>
					<input class="numberViewInput" type="number" disabled v-model="item.count" />
					<text class="clearance" @click="funcAdd(item, index)">+</text>
				</view>
			</view>
			<view class="personItem">
				<text class="itemLabel">折扣%</text>
				<input class="iteminput" type="text" v-model="item.discount" />
			</view>		
			<view class="personItem">
				<text class="itemLabel">金额</text>
				<view class="numberView">
					<input class="numberViewInput" style="width:150rpx" type="number" v-model="item.totalPrice" @input="funcChange(item, index)"/> 
					<text style="margin-left:10rpx">元</text>
				</view>
			</view>
			<view class="personItem">
				<text class="itemLabel">备注</text>
				<input class="iteminput" type="text" v-model="item.describe" placeholder="请输入备注" />
			</view>
			<!-- <text class="addContact" @click="funcAddGoods" v-if="index == attrSource.length - 1">添加商品+</text> -->
		</view>
	</view>
</template>

<script>
	import Apis from "@/apis/apis.js";
	// 事件处理
	import EventBus from '../../common/bus.js'
	export default {
		data() {
			return {
				attrSource : []
			}
		},
		
		onLoad(options) {
			if(options.source) {
				const data = JSON.parse(options.source)
				data && data.map((item, index) => {
					item.describe = ""
					item.count = 1
					item.discount = 0
					item.totalPrice = item.count * +item.price
				})
				this.attrSource = data
			}
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {  
			/**
			 * 获取选中的用户等级
			 */
			EventBus.$emit('SELECTADDGOODS', this.attrSource)
			
			uni.navigateBack({
				delta: 2
			})
		},
		
		methods: {
			/**
			 * 手动修改价格失去焦点 
			 */
			funcChange(item, index) {
				if(+item.totalPrice <= 0) {
					this.$set(this.attrSource[index], 'discount', '')
					return
				}
				let discount =  Number(+item.totalPrice / +item.price * 100000 / 1000).toFixed(2)
				
				if(discount <= 1 && discount > 0) {
					this.$set(this.attrSource[index], 'discount', 1)	
					return
				}
				this.$set(this.attrSource[index], 'discount', discount)
				
			},
			
			/**
			 * 添加数量
			 */
			funcAdd(item, index) {
				item.count = item.count + 1
				item.totalPrice = item.count * +item.price
				this.attrSource[index] = item
			},
			
			/**
			 * 减少数量
			 */
			funcJian(item, index) {
				if(item.count <= 0) {
					return
				}
				item.count = item.count - 1
				item.totalPrice = item.count * +item.price
				this.attrSource[index] = item
			},
			
			/**
			 * 删除商品
			 */
			funcDeleteContactInfo(index) {
				this.attrSource.splice(index, 1)
			},
			
			/**
			 * 添加商品
			 */
			funcAddGoods() {
				uni.navigateBack()
			}
		},
		
	}
</script>

<style lang="less" scoped>
	.header {
		width: 100%;
		background-color: #F0EFF3;
		height:100rpx;
		line-height:100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		.delete {
			font-size: 26rpx;
			color: #2b2ba5;
		}
	}
	
	.personItem {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #f1f1f1 solid;
		justify-content: space-between;
		background-color: white;
	}
	
	.addContact {
		color: #2b2ba5;
		width: 100%;
		height: 50px;
		display: block;
		line-height: 50px;
		text-align: center;
	}
	
	.iteminput {
		font-size: 28rpx;
		text-align: right;
	}
	
	.clearance {
		margin: 0rpx 20rpx;
		font-weight: bold;
		transform: scale(1.5);
	}
	
	.numberView {
		display: flex;
		align-items: center;
	}
	
	.numberViewInput {
		border-radius: 5rpx;
		border: 1rpx #e4d5d5 solid;
		width: 100rpx;
		text-align: center;
	}
	
	
</style>
