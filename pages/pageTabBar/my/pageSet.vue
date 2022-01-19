<template>
	<view class="container">
		<view class="addGoodsAddBase" @click="funcChangePaddword">
			<text>修改密码</text>
			<view class="addGoodsBaseRight">
			</view>
		</view>
		<view class="addGoodsAddBase" @click="funcClearStorage">
			<text>退出登录</text>
			<view class="addGoodsBaseRight">
			</view>
		</view>
	</view>
</template>

<script>
	const userInfo = uni.getStorageSync('UserInfo')
	export default {
		data() {
			return {
				attrUserSource : userInfo || {},
				attrStorageSize : ''
			}
		},

		onLoad() {
			this.funcGetStorageSize();
		},

		methods: {
			/**
			 * 获取缓存
			 */
			funcGetStorageSize() {
				const self = this; 
				uni.getStorageInfo({
					success(res) {
						let size = res.currentSize;
						if (size < 1024) {
							self.attrStorageSize = size + ' B';
						} else if (size/1024>=1 && size/1024/1024<1) {
							self.attrStorageSize = Math.floor(size/1024*100)/100 + ' KB';
						} else if (size/1024/1024>=1) {
							self.attrStorageSize = Math.floor(size/1024/1024*100)/100 + ' M';
						}
					}
				})
			},
			
			/**
			 * 修改密码
			 */
			funcChangePaddword() {
				uni.navigateTo({
					url: './modifyPassword'
				})
			},
			
			/**
			 * 清除缓存
			 */
			funcClearStorage (){
				const self = this;
				uni.showModal({
					title:'提示',
					content:'确定重新登录吗?',
					confirmText:'确定',
					cancelText:"取消",
					success(res) {
						if(res.confirm){
							uni.clearStorageSync();
							//重新获取并显示清除后的缓存大小
							self.funcGetStorageSize();
							uni.showToast({
								title:'成功',
								icon : 'none'
							})
							uni.redirectTo({
								url : '../../pageLogin/pageLoginMain'
							})
						}
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		background-color: white;
	}
	.addGoodsAddBase {
		border-top: 1rpx #F5F5F5 solid;
		display: flex;
		height: 80rpx;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0px 10px;
		box-sizing: border-box;
	}
	
	.addGoodsBaseRight {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.addGoodsBaseRightText {
		text-align: right;
	}
	
</style>
