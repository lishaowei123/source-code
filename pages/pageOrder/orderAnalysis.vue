<template>
	<view class="container">
		<choose-cade-component pageHeight="0rpx" :dataSource="attrList" @select="funcSelect"></choose-cade-component>
		<view class="topTotalBase" @click="funcPushDetail('order_data', 1)">
			<view class="topPrice">
				<text>{{ attrSource.count || 0 }}</text>
				<text class="explain">订单数</text>
			</view>
			<view class="topTotal">
				<text>¥ {{ attrSource.price || 0 }}</text>
				<text class="explain">订单金额</text>
			</view>
		</view>

		<view class="personItem" @click="funcPushDetail('people_data', 2)">
			<view class="personArrowItem">
				<text class="itemLabel">成交的客户</text>
				<view class="itemLevel">
					<text class="itemLevelText">{{attrSource.people || 0 }}</text>
					<!-- <image class="itemArrow" src="../../static/choose-Cade/choose-Cadex.png" mode=""></image> -->
				</view>
			</view>
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
		});
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
	
	destroyed() {
		uni.removeStorageSync('orderAnalysisList')
	},
		
	methods: {
		/**
		 * 跳转到详情列表
		 */
		funcPushDetail(key, type) {
			uni.navigateTo({
				url : `./orderAnalysisList?key=${key}&type=${type}`
			})
		},
		
		/**
		 * 获取统计数据
		 */
		funcGetOrderStatistical() {
			Api.getOrderStatistical({
				...this.attrSearchSource
			}).then(res => {
				this.attrSource = res.data || {};
				uni.setStorageSync('orderAnalysisList', JSON.stringify(res.data))
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

.personItem {
	display: flex;
	align-items: center;
	height: 100rpx;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx #eee9e9 solid;
	background-color: white;
	border-top: 20rpx solid #f5f5f5;
}

.itemLabel {
}

.iteminput {
	margin-left: 20rpx;
	flex: 1;
	font-size: 28rpx;
}

.personArrowItem {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
	
.itemArrow {
	transform: rotate(-90deg);
	width: 36rpx;
	height: 36rpx;
}

.itemLevelText {
	height: 22px;
}

.itemLevel {
	display: flex;
	align-items: center;
}
</style>
