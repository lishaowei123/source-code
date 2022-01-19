<template>
	<view class="container">
		<choose-cade-component pageHeight="0rpx" :dataSource="attrList" @select="funcSelect"></choose-cade-component>
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347" :y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<mescroll-uni ref="mescrollRef" @down="downCallback" @up="funcUpLoad" top="80">
			<view class="goodItems" v-for="(item, index) in attrSource" :key="index" @click="funcGoodsInfo(item)">
				<text class="goodItemsTitle">{{ item.name }}</text>
				<text class="goodItemsNumber">{{ item.bar_code }}</text>
				<text class="goodItemsPrice" v-if="item.price">销售价: {{ item.price }}元/{{ item.unit || "件" }}</text>
				<text class="goodItemsClass">分类：{{ item.category && item.category.name }}</text>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from '@/components/choose-Cade/choose-Cade.vue';
// 自定义弹出
import ChunLeiPopupsComponent from '@/components/chunLei-popups/chunLei-popups.vue';
// API
import Api from '../../apis/apis.js';
export default {
	mixins: [CustomMescrollMixin],
	data() {
		return {
			attrCategoryList : [],
			attrSearchSource : {},
			attrShowPopUp: false,
			attrPopUpDataSource: [
				{
					icon: '',
					title: '新建商品',
					index: 0
				// },
				// {
				// 	icon: '',
				// 	title: '批量导入商品',
				// 	index: 1
				}
			],
			attrSource: [],
			attrList: [
				// {
				// 	beforeIcon: '../../static/uni.png',
				// 	text: '搜索',
				// 	type: 0,
				// 	path: '',
				// 	useslot: '',
				// 	source: [],
				// 	showBottons: false,
				// 	customEvent: () => {
				// 		console.log(111);
				// 	}
				// },
				{
					beforeIcon: '',
					text: '全部状态',
					type: 2,
					path: '',
					useslot: '',
					key: 'status',
					source: [
						{
							select: true,
							value: "",
							label: '全部状态'
						},
						{
							select: false,
							value: 0,
							label: '已下架'
						},
						{
							select: false,
							value: 1,
							label: '已上架'
						}
					],
					showBottons: false
				},
				{
					beforeIcon: '',
					text: '全部分类',
					type: 2,
					path: '',
					useslot: '',
					key : 'category_id',
					source: [],
					showBottons: false
				},
				{
					beforeIcon : '',
					text : '商品系数',
					type : 2,
					path : "",
					value : 0,
					useslot : '',
					key : 'level_id',
					source: [],
					showBottons: false
				},
			]
		};
	},
	
	onShow() {
		const userInfo = uni.getStorageSync('UserInfo')
		if(!userInfo.is_goods) {
			// #ifdef APP-PLUS
				const webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text : ""
				});
			// #endif 
		} 
	},
	
	mounted() {
		this.funcGetXishu()
		this.funcGetGoodsCategory();
		const userInfo = uni.getStorageSync('UserInfo')
		if(!userInfo.is_goods) {
			// #ifdef APP-PLUS
				const webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text : ""
				});
			// #endif
		} 
	},

	components: {
		ChooseCadeComponent,
		ChunLeiPopupsComponent
	},

	methods: {
		/**
		 * 获取系数
		 */
		funcGetXishu() {
			Api.getXishu().then(res => {
				let source = [{
					label : '全部系数',
					value : ''
				}]
				res.data && res.data.map(item => {
					source.push({
						label : item.name,
						value : item.id
					})
				})
				this.$set(this.attrList[2], 'source',source )
			})
		},
		
		/**
		 * 单击趋势
		 */
		funcTouchQushi() {
			uni.navigateTo({
				url : './goodsAnalysis'
			})
		},
		
		/**
		 * 获取商品分类
		 */
		funcGetGoodsCategory() {
			Api.getGoodsCategory().then(res => {
				let source = []
				res.data && res.data.map((item, index) => {
					source.push({
						select : !index,
						label : item.name,
						value : item.id
					})
				})
				this.attrCategoryList = source
				this.$set(this.attrList[1], 'source', source)
				
			})
		},
		
		/**
		 * 点击navigation-item
		 */
		onNavigationBarButtonTap(e) {
			const userInfo = uni.getStorageSync('UserInfo')
			switch (e.index) {
				case 0:
					if(userInfo.is_goods == '1') {
						this.attrShowPopUp = true;
					} else {
						uni.showToast({
							title : '暂无权限',
							icon : 'none'
						})
					}
					break;
				case 1:
					break;
				default:
					break;
			}
		},

		/**
		 * 点击popup-item
		 */
		funcTapPopup(e) {
			switch (e.index) {
				case 0:
					uni.navigateTo({
						url: './goodsDetailCreate'
					});
					break;
				case 1:
					break;
				default:
					break;
			}
		},

		/**
		 * 下拉选择
		 */
		funcSelect(e) {
			e.source.map((item, index) => {
				let value = ''
				item.source.map((vue, idx) => {
					if(vue.select) {
						value = vue.value
					}
				})
				if(item.key) {
					this.attrSearchSource[item.key] = value
				}
			})
			this.funcGetGoods()
		},
		
		/**
		 * 请求列表
		 */
		funcGetGoods() {
			this.attrSource = []
			Api.getGoods({
				...this.attrSearchSource
			}).then(res => {
				const list = res.data.data || [];
				this.attrSource = list;
			})
		},
		
		/**
		 * 商品详情
		 */
		funcGoodsInfo(item) {
			uni.navigateTo({
				url : `./goodsInfo?id=${item.id}`
			})
		},

		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getGoods({
				page: page.num,
				per_page: page.size,
				...this.attrSearchSource
			}).then(res => {
				const list = res.data.data || [];
				this.mescroll.endByPage(list.length, res.data.total);
				if (page.num == 1) this.attrSource = [];
				this.attrSource = this.attrSource.concat(list);
			}).catch(() => {
				this.mescroll.endErr();
			});
		}
	}
};
</script>

<style scoped lang="less">
.goodItems {
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	padding: 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #f1f1f1 solid;
	background-color: white;
}

.goodItemsTitle {
	font-size: 26rpx;
}

.goodItemsNumber {
}

.goodItemsPrice {
}

.goodItemsClass {
}

.qushiImage {
	width: 100rpx;
	height: 100rpx;
	position: fixed;
	bottom: 20rpx;
	right: 20rpx;
	z-index: 100;
}
</style>
