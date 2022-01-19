<template>
	<view class="container">
		<choose-cade-component pageHeight="0rpx" :dataSource="attrList" @select="funcSelect"></choose-cade-component>
		<view class="clearance" style="padding-top: 70rpx;"></view>
		<view class="topBaseView">
			<text class="price">¥ {{ attrSource.total_price || 0 }}</text>
			<text class="totalPrice grayPrice">总报销金额</text>
		</view>
		
		<text class="mainTitle">销售类型分布</text>
		<text class="price grayPrice">¥ {{ attrSource.consume_price || 0 }}</text>
		
		<view class="">
			<template v-if="attrSource.consume && attrSource.consume.length">
				<view class="cell" v-for="(item, index) in attrSource.consume" :key="index">
					<text>{{ item.type }}</text>
					<text class="grayPrice">¥ {{ item.price }}</text>
				</view>
				<view class="all" @click="funcPushDetail(1)">
					查看全部
				</view>
			</template>
			<template v-else>
				<view class="empty">暂无数据</view>
			</template>
		</view>
		
		<text class="mainTitle">客户消费分布</text>
		<text class="price grayPrice">¥ {{ attrSource.customers_price || 0 }}</text>
		
		<view class="">
			<template v-if="attrSource.customers && attrSource.customers.length">
				<view class="cell" v-for="(item, index) in attrSource.customers" :key="index">
					<text>{{ item.customer && item.customer.name }}</text>
					<text class="grayPrice">¥ {{ item.price }}</text>
				</view>
				<view class="all" @click="funcPushDetail(2)">
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
import moment from 'moment';
export default {
	mixins: [CustomMescrollMixin],
	data() {
		return {
			attrCategoryList: [],
			attrSearchSource: {},
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
						// path : `../../pages/pageEmployees/pageEmployeesMain?self=0&sign=1&emit=SELECTPERSONGOODS`
						path : `../../pages/pageTabBar/organization/organizationList?self=0&sign=1&emit=SELECTPERSONGOODS`
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
			this.funcGetOrderStatistical()
		})
		this.attrList[0].source.map(e => {
			if (e.value == moment().format('YYYY')) {
				this.attrList[0].text = e.label;
				e.select = true;
				this.attrSearchSource.year = e.value;
			}
		});
		this.attrList[1].source.map(e => {
			if (e.value == moment().format('MM')) {
				this.attrList[1].text = e.label;
				e.select = true;
				this.attrSearchSource.month = e.value;
			}
		});

		this.funcGetOrderStatistical();
	},

	components: {
		ChooseCadeComponent
	},

	methods: {
		/**
		 * 
		 */
		funcPushDetail(type) {
			uni.navigateTo({
				url: `./expenseAnalysisDetail?type=${type}`
			})
		},
		
		/**
		 * 获取统计数据
		 */
		funcGetOrderStatistical() {
			Api.getOrderSinglesStatistical({
				...this.attrSearchSource
			}).then(res => {
				this.attrSource = res.data || {};
			});
		},

		/**
		 * 下拉选择
		 */
		funcSelect(e) {
			e.source.map((item, index) => {
				let value = '';
				item.source.map((vue, idx) => {
					if (vue.select) {
						value = vue.value;
					}
				});
				if (item.key) {
					this.attrSearchSource[item.key] = value;
				}
			});
			this.funcGetOrderStatistical();
		}
	}
};
</script>

<style scoped lang="less">
.topBaseView {
	padding-top: 80rpx;
	background-color: white;
	padding: 20rpx 20rpx 20rpx 0rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.clearance {
	height: 20rpx;
	background-color: whitesmoke;
}

.price {
    color: #838316;
    font-size: 20px;
    width: 100%;
    background-color: white;
    display: inline-block;
    padding-left: 10px;
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
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
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

.totalPrice {
	padding-left: 20rpx;
	font-size: 26rpx;
}

.grayPrice {
	color: gray; 
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
