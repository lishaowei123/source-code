<template>
	<view class="addGoodsBaseView">
		<view class="addGoodsBorderWidth"></view>
		<view class="addGoodsAddBase">
			<text>商品名称</text>
			<view class="addGoodsBaseRight">
				<input class="addGoodsAddBaseInput" placeholder="请输入商品名称(必填)" type="text" v-model="attrSource.name" />
			</view>
		</view>
		<view class="addGoodsAddBase">
			<text>商品编号</text>
			<view class="addGoodsBaseRight">
				<input class="addGoodsAddBaseInput" placeholder="请输入商品编号(必填)" type="text" v-model="attrSource.number" />
			</view>
		</view>
		<view class="addGoodsAddBase" @click="funcSelectUnit">
			<text>单位</text>
			<view class="addGoodsBaseRight">
				<text class="addGoodsBaseRightText">{{ attrSource.unitSource.label || ""}}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		<view class="addGoodsAddBase">
			<text>销售价(元)</text>
			<view class="addGoodsBaseRight">
				<input class="addGoodsAddBaseInput" placeholder="请输入销售价" type="price" v-model="attrSource.price" />
			</view>
		</view>
		<view class="addGoodsAddBase" @click="funcSelectGoodsStatus">
			<text>状态</text>
			<view class="addGoodsBaseRight">
				<text class="addGoodsBaseRightText">{{ attrSource.statusSource.label }}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		<view class="addGoodsAddBase" @click="funcSelectCategory">
			<text>商品分类</text>
			<view class="addGoodsBaseRight">
				<text class="addGoodsBaseRightText">{{ attrSource.categorySource.label }}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		<view class="addGoodsAddBase" @click="funcSelectXishu">
			<text>商品系数</text>
			<view class="addGoodsBaseRight">
				<text class="addGoodsBaseRightText">{{ attrSource.xishu.label }}</text>
				<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
			</view>
		</view>
		<view class="addGoodsBorderWidth"></view>
		<view class="uni-textarea" style="minHeight:200rpx">
			<textarea style="min-height:200rpx" placeholder="商品描述" v-model="attrSource.describe" auto-height
				maxlength=-1 />
		</view>

		<view class="imageBaseView">
			<image class="imageItem" v-for="(item, index) in attrImageList" :key="index" :src="item"
				mode='aspectFill' @click="funcShowImage(item)" />
			<view class="imageItemAdd" @click="funcGetPhotoImages">
				<image src="../../static/up.jpg" mode="widthFix"></image>
			</view>
		</view>
		<previewImage ref="previewImage" :imgs="attrImageList" ></previewImage>
	</view>
</template>

<script>
	const status = [{
		label : '下架中',
		value : 0
	}, {
		label : '上架中',
		value : 1
	}]
	const units = [{
		label : '个',
		value : 1
	},{
		label : '件',
		value : 2
	},{
		label : '箱',
		value : 3
	}]
	// 工具类
	import utils from '../../common/utils.js'
	// 事件处理
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	// Mixins
	import Mixins from '@/mixins/mixin.vue'
		import PreviewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	export default {
		mixins : [Mixins],
		data() {
			return {
				attrType : 2,	//2 创建 1 编辑
				attrGoodsId : void 0,
				attrImageList: [],
				attrSource: {
					name: '',
					number : '',
					unitSource: {
						label: '',
						value: ''
					},
					price: '',
					statusSource: {
						label: '',
						value: '1'
					},
					categorySource: {
						label: '',
						value: ''
					},
					xishu: {
						label: '',
						value: ''
					},
					describe: ''
				}
			}
		},

		// 页面周期与 onLoad 同级
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.showModal({
					title: this.attrType == 1 ? '是否取消编辑' : '是否取消创建',
					content: '',
					cancelText: "取消",
					confirmText: "确定",
					showCancel: true,
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
				return true;
			}
		},
		
		components: {
			PreviewImage
		},
		
		onLoad(options) {
			if(options.id) {
				this.attrGoodsId = options.id
				this.attrType = options.type
				this.funcGetGoodsInfo()
			}
			uni.setNavigationBarTitle({
				title: options.type == 1 ? '编辑商品' : '新建商品'
			})
		},
		mounted() {

			EventBus.$on('SELECTGOODSUNITS', (e) => {
				this.$set(this.attrSource, 'unitSource', e)
			})

			EventBus.$on('SELECTGOODSSTSATUS', (e) => {
				this.$set(this.attrSource, 'statusSource', e)
			})

			EventBus.$on('SELECTGOODSCATEGOTY', (e) => {
				this.$set(this.attrSource, 'categorySource', e)
			})
			
			EventBus.$on('SELECTGOODSXISHU', (e) => {
				this.$set(this.attrSource, 'xishu', e)
			})
		},

		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			if(!this.attrSource.name) {
				uni.showToast({
					title : '商品名称不能为空',
					icon : 'none'
				})
				return
			}
			if(!this.attrSource.number) {
				uni.showToast({
					title : '商品编号不能为空',
					icon : 'none'
				})
				return
			}
			
			let params = {
				'name' : this.attrSource.name,
				'number' : this.attrSource.number,
				'price': this.attrSource.price,
				'unit': this.attrSource.unitSource.label,
				'status': this.attrSource.statusSource.value,
				'category_id': this.attrSource.categorySource.value,
				'bar_code': "",
				'level_id': this.attrSource.xishu.value,
				'describe': this.attrSource.describe,
				'images' : JSON.stringify(this.attrImageList),
			}
			
			if(this.attrType == 1) {
				params['id'] = this.attrGoodsId
			}
			
			Api[this.attrType == 1 ? 'putGoods' : 'postGoods'](params).then(res => {
				if(res.error_code == 0) {
					uni.navigateBack()
				} else {
					uni.showToast({
						title : res.error_msg || "失败",
						icon : 'none'
					})
				}
			})
		},

		methods: {
			/**
			 * 展示大图
			 */
			funcShowImage(item) {
				this.$refs.previewImage.open(item)
			},
			
			/**
			 * 获取商品详情
			 */
			funcGetGoodsInfo() {
				Api.getGoodsDetail({
					id : this.attrGoodsId
				}).then(res => {
					this.attrSource = {
						...res.data,
						unitSource: units.filter(item => item.label == res.data.unit)[0],
						statusSource: status[res.data.status],
						categorySource: {
							label: res.data.category.name,
							value: res.data.category.id
						},
					}
					if(res.data.images) {
						this.attrImageList = JSON.parse(res.data.images)
					}
				})
			},
			
			/**
			 * 获取相册
			 */
			funcGetPhotoImages() {
				this.funcGetPhoto((data) => {
					this.attrImageList = this.attrImageList.concat(data)
				})
			},
			
			/**
			 * 选择单位
			 */
			funcSelectUnit() {
				const item = JSON.stringify(this.attrSource.unitSource)
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTGOODSUNITS&item=${item}&title=选择单位&type=3`
				})
			},

			/**
			 * 选择商品状态
			 */
			funcSelectGoodsStatus() {
				const item = JSON.stringify(this.attrSource.statusSource)
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTGOODSSTSATUS&item=${item}&title=选择商品状态&type=1`
				})
			},

			/**
			 * 选择分类
			 */
			funcSelectCategory() {
				const item = JSON.stringify(this.attrSource.categorySource)
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTGOODSCATEGOTY&item=${item}&title=选择商品分类&type=2`
				})
			},
			
			/**
			 * 选择分类
			 */
			funcSelectXishu() {
				const item = JSON.stringify(this.attrSource.categorySource)
				uni.navigateTo({
					url: `../pageCommon/unitList?event=SELECTGOODSXISHU&item=${item}&title=选择洗漱&type=6`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.addGoodsBaseView {
		box-sizing: border-box;
		width: 100%;
		background-color: white;
	}

	.addGoodsBorderWidth {
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #f4eeee;
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

	.imageBaseView {
		display: flex;
		flex-wrap: wrap;
		padding: 0rpx 20rpx 20rpx 20rpx;
	}

	.imageItem {
		width: 100rpx;
		height: 100rpx;
		border-radius: 5rpx;
		margin-right: 18rpx;
		margin-top: 10rpx;
	}

	.imageItemAdd {
		padding: 6rpx;
		box-sizing: border-box;
		border: 1rpx #e5dcdc dashed;
		width: 100rpx;
		height: 100rpx;
		border-radius: 5rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.addGoodsAddBaseInput {
		width: 100%;
		margin-left: 20rpx;
	}
	
	uni-textarea-wrapper {
		color: red;
		height: 100%!important;
	}
</style>
