<template>
	<view class="container">
		<choose-cade-component pageHeight="0rpx" :dataSource="attrList" @select="funcSelect"></choose-cade-component>
		<view class="topTotalBase">
			<view class="topPrice" @click="funcPushDetail('order_data', 1, '订单相关')">
				<text>{{ attrSource.number }}</text>
				<text class="explain">销量</text>
			</view>
			<view class="topTotal" @click="funcPushDetail('order_data', 1, '订单相关')">
				<text>¥ {{ attrSource.total_price }}</text>
				<text class="explain">销售额（估算）</text>
			</view>
		</view>
		
		<text class="mainTitle">销售情况</text>
		
		<view class="">
			<template v-if="attrSource.goods && attrSource.goods.length">
				<view class="cell" v-for="(item, index) in attrSource.goods" :key="index">
					<text>{{ item.goods.name || '' }} ({{ item.goods_count }})</text>
				</view>
				<view class="all" @click="funcPushDetail('goods', 2, '销售情况')">
					查看全部
				</view>
			</template>
			<template v-else>
				<view class="empty">暂无数据</view>
			</template>
		</view>
		
		<text class="mainTitle">销售客户分布</text>
		
		<view class="">
			<template v-if="attrSource.users && attrSource.users.length">
				<view class="cell" v-for="(item, index) in attrSource.users" :key="index">
					<text>{{ item.customer.name || '' }} ({{ item.order_goods_data_count }})</text>
				</view>
				<view class="all" @click="funcPushDetail('user_data', 3, '销售客户分布')">
					查看全部
				</view>
			</template>
			<template v-else>
				<view class="empty">暂无数据</view>
			</template>
		</view>
	</view>
</template>

<script>
// 事件处理
import EventBus from '../../common/bus.js'
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from '@/components/choose-Cade/choose-Cade.vue';
// API
import Api from '../../apis/apis.js';
import moment from 'moment'
export default {
	mixins: [CustomMescrollMixin],
	data() {
		return {
			attrCategoryList : [],
			attrSearchSource : {
				
			},
			attrSource: {},
			attrList: [
				{
					beforeIcon: '',
					text: '2021',
					type: 2,
					path: '',
					useslot: '',
					key: 'year',
					source: [
						{ select: false, value: 2021, label: '2021年' },
						{ select: true, value: 2022, label: '2022年' },
						{ select: false, value: 2023, label: '2023年' },
						{ select: false, value: 2024, label: '2024年' },
						{ select: false, value: 2025, label: '2025年' }
					],
					showBottons: false
				},
				{
					beforeIcon: '',
					text: '一月',
					type: 2,
					path: '',
					useslot: '',
					key: 'month',
					source: [
						{ select: false, value: '17', label: '全年' },
						{ select: false, value: '13', label: '一季度' },
						{ select: false, value: '14', label: '二季度' },
						{ select: false, value: '15', label: '三季度' },
						{ select: false, value: '16', label: '四季度' },
						{ select: false, value: '01', label: '一月' },
						{ select: false, value: '02', label: '二月' },
						{ select: false, value: '03', label: '三月' },
						{ select: false, value: '04', label: '四月' },
						{ select: false, value: '05', label: '五月' },
						{ select: false, value: '06', label: '六月' },
						{ select: false, value: '07', label: '七月' },
						{ select: false, value: '08', label: '八月' },
						{ select: false, value: '09', label: '九月' },
						{ select: false, value: '10', label: '十月' },
						{ select: false, value: '11', label: '十一月' },
						{ select: false, value: '12', label: '十二月' }
					],
					showBottons: false
				},
				{
					beforeIcon : '',
					text : '全部成员',
					type : 2,
					path : "",
					value : 0,
					useslot : '',
					key : 'user_id',
					source: [{
						index : 0,
						select : true,
						label : '全部成员'
					}, {
						index : 1,
						select : false,
						label : '其他成员',
						path : `../../pages/pageEmployees/pageEmployeesMain?self=0&sign=1&emit=SELECTPERSONGOODS`
					}],
					showBottons: false
				},
				{
					beforeIcon : '',
					text : '全部商品',
					type : 2,
					path : "",
					value : 0,
					useslot : '',
					key : 'goods_id',
					source: [{
						index : 0,
						select : true,
						label : '全部商品'
					}, {
						index : 1,
						select : false,
						label : '单个商品',
						path : `../../pages/pageGoods/goodsList?back=100`
					}],
					showBottons: false
				},
			]
		};
	},
	
	mounted() {	
		/**
		 * 选中人员
		 */
		EventBus.$on('SELECTPERSONGOODS', (e) => {
			const data = JSON.parse(e)
			this.attrSearchSource.user_id = data.id
			this.attrList[2].text = data.name
			this.attrList[2].source[1].label = data.name
			this.funcGetGoodsStatistical()
		})
		/**
		 * 选中商品
		 */
		EventBus.$on('SELECTGOODS', (e) => {
			const data = e
			this.attrSearchSource.goods_id = data.id
			this.attrList[3].text = data.name
			this.attrList[3].source[1].label = data.name
			this.funcGetGoodsStatistical()
		})
		this.attrList[0].source.map(e => {
			if(e.value == moment().format('YYYY')) {
				this.attrList[0].text = e.label
				e.select = true
				this.attrSearchSource.year = e.value
			}
		})
		this.attrList[1].source.map(e => {
			if(e.value == moment().format('MM')) {
				this.attrList[1].text = e.label
				e.select = true
				this.attrSearchSource.month = e.value
			}
		})
		
		this.funcGetGoodsStatistical()
	},

	components: {
		ChooseCadeComponent
	},
	
	destroyed() {
		uni.removeStorageSync('goodsOrderList')
	},

	methods: {
		/**
		 * 跳转到详情
		 */
		funcPushDetail(key, type, title) {
			uni.navigateTo({
				url: `./goodsOrderList?key=${key}&type=${type}&title=${title}`
			})
		},
		
		/**
		 * 获取统计数据
		 */
		funcGetGoodsStatistical() {
			Api.getGoodsStatistical({
				...this.attrSearchSource
			}).then(res => {
				this.attrSource = res.data || {}
				uni.setStorageSync('goodsOrderList', JSON.stringify(res.data))
			})	
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
			this.funcGetGoodsStatistical()
		},
	}
};
</script>

<style scoped lang="less">
.topTotalBase {
	display: flex;
	height: 150rpx;
	width: 100%;
	background-color: white;
	padding-top: 100rpx;
	padding-bottom: 20rpx;
}

.topPrice {
	color: #d36f27;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	flex: 0.4;
	flex-direction: column;
}

.topTotal {
	.topPrice();
	border-left: 1rpx #fff3f3 solid;
	flex: 0.6;
}

.explain {
	color: #b0a3a3;
	font-size: 24rpx;
}

.mainTitle {
	display: flex;
	align-items: flex-end;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	border-top: 20rpx solid #f5f5f5;
	width: 100%;
	line-height: 80rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.cell {
	padding: 10rpx 20rpx;
	box-sizing: border-box;
	background-color: white;
}

.empty {
	color: #d5bfbf;
	width: 100%;
	height: 160rpx;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
}

.all {
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24rpx;
	padding: 20rpx;
	box-sizing: border-box;
}
</style>
