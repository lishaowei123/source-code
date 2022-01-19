<template>
	<view class="custom-base-view">
		<view class="custom-picker-base-view" :style="{ height: height }" @click.stop="">
			<!-- #ifndef APP-PLUS -->
			<slot></slot>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="custom-picker-slot">
				<view class="custom-picker-slot-cancel" @click="funcCancel">取消</view>
				<text class="custom-picker-slot-confirm" @click="funcConfirm">确定</text>
			</view>
			<!-- #endif -->
			<view class="custom-picker-box">
				<picker-view class="custom-picker-view" :indicator-style="attrIndicatorStyle" :value="attrPickerValue" @change="funcDateChange">
					<picker-view-column>
						<view class="item" v-for="(item, index) in attrYears" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in attrMonths" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in attrDays" :key="index">{{ item }}日</view>
					</picker-view-column>
					<template v-if="format == 'time'">
						<picker-view-column>
							<view class="item" v-for="(item, index) in attrHours" :key="index">{{ item }}{{suffix ? '时' : ''}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item, index) in attrMinutes" :key="index">{{ item }}{{suffix ? '分' : ''}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item, index) in attrSeconds" :key="index">{{ item }}{{suffix ? '秒' : ''}}</view>
						</picker-view-column>
					</template>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * @description picker组件 (待完善，请确认时间范围内包含选中时间|当前时间)
 * @use:
 * 	<view class="classname" v-if="attrShowPicker">
 *		<custom-priker-view :range="['2010-02-06', '2015-09-38']" :select="2010-02-10" @confrim="confirm" @cancel="cancel">
 *			<view class="classname">
 *				<view class="classname">取消</view>
 *				<text class="classname">确定</text>
 *			</view>
 *		</custom-priker-view>
 *	</view>
 */
import moment from 'moment';
const sDate = '2000-01-01';
const date = new Date();
const year = date.getFullYear();
export default {
	data() {
		const years = [],months = [],days = [],hours = [],minutes = [];
		for (let i = 2000; i <= date.getFullYear(); i++) {
			years.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			months.push(i);
		}
		for (let i = 1; i <= 31; i++) {
			days.push(i);
		}
		for (let i = 0; i < 24; i++) {
			hours.push(i);
		}
		for (let i = 0; i < 60; i++) {
			minutes.push(i);
		}
		return {
			attrYears: years,
			attrMonths: months,
			attrDays: days,
			attrHours: hours,
			attrMinutes: minutes,
			attrSeconds: minutes,
			attrIndicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
			attrDateRange: void 0,
			attrStartDate: void 0,
			attrEndDate: void 0,
			attrPickerValue: [0, 0, 0],
			attrPickerValueFormat: void 0,
			attrSlotsCancelElement: void 0,
			attrSlotsConfrimElement: void 0
		};
	},

	watch: {
		/**
		 * 日期计算
		 */
		attrDateRange(nvue, ovue) {
			this.funcCalculateDateRange(nvue);
		}
	},

	props: {
		/**
		 * 展示格式
		 */
		format: {
			type: String,
			default: 'date'
		},
		
		/**
		 * 显示后缀
		 */
		suffix: {
			type: Boolean,
			default: false
		},

		/**
		 * picker-view高度
		 */
		height: {
			type: String,
			default: `${Math.round((uni.getSystemInfoSync().screenWidth / 375) * 250)}px`
		},

		/**
		 * 选中的日期
		 */
		select: {
			type: String,
			default: moment().format('YYYY-MM-DD')
			// default: moment().format('YYYY-MM-DD HH:mm:ss')
		},

		/**
		 * 开始日期和结束日期范围 粒度（ 年-月-日 ）
		 */
		range: {
			type: Array,
			default: () => {
				return [sDate, moment().format('YYYY-MM-DD')];
			}
		}
	},

	mounted() {
		this.attrPickerValue = this.format == 'time' ? [0, 0, 0, 0, 0, 0] : this.attrPickerValue;
		this.attrDateRange = this.range || [];
		this.attrStartDate = this.format == 'time' ? this.range[0] : this.range[0].split(' ')[0];
		this.attrEndDate = this.format == 'time' ? this.range[1] : this.range[1].split(' ')[0];
		// #ifndef APP-PLUS
		let child = this.$slots?.default?.[0].componentOptions?.children;
		if (child) {
			this.attrSlotsCancelElement = child[0].elm;
			this.attrSlotsConfrimElement = child[1].elm;
		}
		if (this.attrSlotsCancelElement) {
			this.attrSlotsCancelElement.addEventListener('click', this.funcCancel, false);
		}
		if (this.attrSlotsConfrimElement) {
			this.attrSlotsConfrimElement.addEventListener('click', this.funcConfirm, false);
		}
		// #endif
	},

	methods: {
		/**
		 * 计算开始日函数
		 */
		funcCalculateDateRange(nvue) {
			let sDate = void 0, eDate = void 0, sTime = void 0, eTime = void 0, 
				years = [], months = [], days = [], hours = [], 
				minutes = [], seconds = [], 
				selectDate = '', selectTime = '';
				
			if (Array.isArray(nvue)) {
				sDate = nvue[0] || sDate;
				eDate = nvue[1] || moment().format('YYYY-MM-DD');
			}
			//是否是展示时分秒
			if (this.format == 'time') {
				sTime = sDate && sDate.split(' ')[1];
				eTime = eDate && eDate.split(' ')[1];
				sDate = sDate && sDate.split(' ')[0];
				eDate = eDate && eDate.split(' ')[0];
				selectDate = this.select.split(' ')[0] && this.select.split(' ')[0].split('-');
				selectTime = this.select.split(' ')[1] && this.select.split(' ')[1].split(':');
			} else {
				selectDate = this.select.split('-')
			}
			//当前开始日期和结束日期
			const startDate = sDate && sDate.split('-'), endDate = eDate && eDate.split('-')
			//当前开始日期和结束日期的时间
			const startTime = sTime && sTime.split(':'), endTime = eTime && eTime.split(':')
			//当前开始的月份有多少天
			const monthDay = new Date(Number(startDate[0]), Number(startDate[1]), 0).getDate() || 31;
			//当前年份
			const currentYear = Number(startDate[0] || 2000);
			//是否是同年
			const isSameYear = startDate[0] == endDate[0];
			if (currentYear > year) {
				uni.showToast({
					title: '开始年份无效',
					icon: 'none'
				});
				return;
			}

			let day = Number(startDate[2]);

			let actualDay = this.getMonthDay(startDate[0], startDate[1]);

			for (let i = Number(startDate[0]); i <= Number(endDate[0]); i++) {
				years.push(i);
			}
			for (let i = Number(startDate[1]); i <= (isSameYear ? Number(endDate[1]) : 12); i++) {
				months.push(i);
			}
			if (startDate[0] == selectDate[0] && startDate[1] == selectDate[1]) {
			} else {
				day = 1;
			}
			for (let i = Number(day > actualDay ? actualDay : day); i <= monthDay; i++) {
				days.push(i);
			}
			for (let i = 0; i < 24; i++) {
				hours.push(i);
			}
			for (let i = 0; i < 60; i++) {
				minutes.push(i);
			}
			for (let i = 0; i < 60; i++) {
				seconds.push(i);
			}
			this.attrYears = years;
			this.attrMonths = months;
			this.attrDays = days;
			this.attrHours = hours;
			this.attrMinutes = minutes;
			this.attrSeconds = seconds;

			//判断select年月日是否在开始和结束时间范围（待补充)
			this.attrPickerValue = [
				this.attrYears.indexOf(Number(selectDate[0])), 
				this.attrMonths.indexOf(Number(selectDate[1])), 
				this.attrDays.indexOf(Number(selectDate[2]))
			];

			this.attrPickerValueFormat = [
				selectDate[0], 
				selectDate[1], 
				selectDate[2]
			];

			//是否是展示时分秒
			if (this.format == 'time') {
				this.attrPickerValue = [
					...this.attrPickerValue, 
					this.attrHours.indexOf(Number(selectTime && selectTime[0] || 0)),
					this.attrMinutes.indexOf(Number(selectTime && selectTime[1] || 0)),
					this.attrSeconds.indexOf(Number(selectTime && selectTime[2] || 0))
				];
				this.attrPickerValueFormat = [
					...this.attrPickerValueFormat, 
					selectTime && selectTime[0] || 0,
					selectTime && selectTime[1] || 0,
					selectTime && selectTime[2] || 0
				];
			}
		},

		/**
		 * @param {sm}  开始的月
		 * @param {sd}  开始的天
		 * @param {em}  结束的月
		 * @param {ed}  结束的天
		 */
		funcResetMonthsDay(sm = 1, em = 12, sd = 1, ed = 31) {
			let months = [],
				days = [];

			for (let i = Number(sm); i <= Number(em); i++) {
				months.push(i);
			}
			for (let i = Number(sd); i <= Number(ed); i++) {
				days.push(i);
			}

			this.attrMonths = months;
			this.attrDays = days;
		},

		/**
		 * @description 每月多少天
		 * @param {number}
		 */
		funcResetDay(year, month) {
			const day = new Date(year, month, 0).getDate();
			let days = [];
			for (let i = 1; i <= day; i++) {
				days.push(i);
			}
			this.attrDays = days;
		},

		/**
		 * @description 获取本月的天数
		 */
		getMonthDay(year, month) {
			return new Date(year, month, 0).getDate();
		},

		/**
		 * 日期改变
		 */
		funcDateChange(e) {
			//最新数据
			let value = e.target.value;
			//是否是时间
			const flag = this.format == 'time'
			//获取年月
			const years = value[0], months = value[1];
			//开始的年份
			const sy = this.format == 'time' ? +this.attrStartDate.split(' ')[0].split('-')[0] : +this.attrStartDate.split('-')[0];
			//开始的月份
			const sm = this.format == 'time' ? +this.attrStartDate.split(' ')[0].split('-')[1] : +this.attrStartDate.split('-')[1];
			//开始的天数
			const sd = this.format == 'time' ? +this.attrStartDate.split(' ')[0].split('-')[2] : +this.attrStartDate.split('-')[2];
			//结束的年份
			const ey = this.format == 'time' ? +this.attrEndDate.split(' ')[0].split('-')[0] : +this.attrEndDate.split('-')[0];
			//结束的月份
			const em = this.format == 'time' ? +this.attrEndDate.split(' ')[0].split('-')[1] : +this.attrEndDate.split('-')[1];
			//结束的天数
			const ed = this.format == 'time' ? +this.attrEndDate.split(' ')[0].split('-')[2] : +this.attrEndDate.split('-')[2];
			//最大的天数
			const maxDay = Number(sd) >= this.getMonthDay(sy, sm) ? this.getMonthDay(sy, sm) : Number(sd);
			
			//判断滚动的是某一列
			let changeColumnIndex = void 0;
			this.attrPickerValue.map((item, index) => {
				if (value[index] != item) {
					changeColumnIndex = index;
				}
			});
			//操作是第一列
			if (!changeColumnIndex) {
				value = flag ? [years, 0, 0, value[3], value[4], value[5]] : [years, 0, 0];
				//首年
				if (!years) {
					//设置开始日期
					this.funcResetMonthsDay(sm, 12, maxDay, this.getMonthDay(sy, sm));
				} else {
					//最后一年
					if (years == this.attrYears.length - 1) {
						//设置结束日期
						this.funcResetMonthsDay(1, em, 1);
					} else {
						//中间年
						this.funcResetMonthsDay(1, 12, 1);
					}
				}
			} else if (changeColumnIndex == 1) {
				//操作是第二列
				value = flag ? [years, months, 0, value[3], value[4], value[5]] : [years, months, 0];
				//判断是否是最后一年最后一月，重置当前月份的天数
				if (!(years == this.attrYears.length - 1) && !(months == this.attrMonths.length - 1)) {
					this.funcResetDay(this.attrYears[years], this.attrMonths[months]);
				}
				//最后一年
				if (years == this.attrYears.length - 1) {
					//最后一月
					if (months == this.attrMonths.length - 1) {
						this.funcResetMonthsDay(sm, em, 1, Number(ed) > this.getMonthDay(ey, em) ? this.getMonthDay(ey, em) : Number(ed));
					} else {
						//首月
						if (!months) {
							this.funcResetMonthsDay(1, 12, 1, this.getMonthDay(this.attrYears[years], this.attrMonths[months]));
						} else {
							this.funcResetDay(this.attrYears[years], this.attrMonths[months]);
						}
					}
				} else {
					if (years) {
						//中间年
						this.funcResetMonthsDay(1, 12, 1, this.getMonthDay(this.attrYears[years], this.attrMonths[months]));
					} else {
						//是否是第一月
						if (!months) {
							this.funcResetMonthsDay(sm, 12, maxDay, this.getMonthDay(sy, sm));
						}
					}
				}
			}  else {
				value = value;
			}
			this.attrPickerValue = value;
			this.attrPickerValueFormat = [
				this.attrYears[value[0]] + '',
				this.attrMonths[value[1]] <= 9 ? `0${this.attrMonths[value[1]]}` : `${this.attrMonths[value[1]]}`,
				this.attrDays[value[2]] <= 9 ? `0${this.attrDays[value[2]]}` : `${this.attrDays[value[2]]}`
			];
			if(this.format == 'time') {
				this.attrPickerValueFormat = [
					...this.attrPickerValueFormat,
					this.attrHours[value[3]] <= 9 ? `0${this.attrHours[value[3]]}` : `${this.attrHours[value[3]]}`,
					this.attrMinutes[value[4]] <= 9 ? `0${this.attrMinutes[value[4]]}` : `${this.attrMinutes[value[4]]}`,
					this.attrSeconds[value[5]] <= 9 ? `0${this.attrSeconds[value[5]]}` : `${this.attrSeconds[value[5]]}`,
				];
			}
		},

		/**
		 * 确定
		 */
		funcConfirm() {
			const lastDate = this.attrPickerValueFormat
			let results = `${lastDate[0]}-${lastDate[1]}-${lastDate[2]}`;
			if(this.format == 'time') {
				let time = `${lastDate[3]}:${lastDate[4]}:${lastDate[5]}`;
				results = results + " " + time
			}
			this.$emit('confrim', {
				date: results || this.attrPickerValueFormat
			});
		},

		/**
		 * 取消
		 */
		funcCancel() {
			this.$emit('cancel');
		}
	}
};
</script>

<style lang="less">
uni-picker-view-column {
	text-align: center;
	line-height: 100rpx;
}

.custom-base-view {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: white;
}

.custom-picker-view {
	width: 100%;
	height: 100%;
}

.custom-picker-base-view {
	width: 100%;
}

.custom-picker-box {
	width: 100%;
	height: 100%;
}

.custom-picker-slot {
	width: 100%;
	height: 80rpx;
	display: flex;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	border-bottom: 1px #f5f5f5 solid;
}

.custom-picker-slot-cancel {
	color: #333333;
	font-size: 26rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 34px;
}

.custom-picker-slot-confirm {
	.custom-picker-slot-cancel();
	color: #ff7145;
}
</style>
