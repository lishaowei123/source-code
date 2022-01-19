<template>
	<view class="container">
		<choose-cade-component
			pageHeight="0rpx"
			:dataSource="attrList" 
			@select="funcSelect" 
		>	
		</choose-cade-component>
		<mescroll-uni
			ref="mescrollRef"
			@up="funcUpLoad" 
			@down="downCallback" 
			top="80"
		>
			<view class="cellBox" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)">
				<view class="cell">
					<text style="font-size: 30rpx;">{{ item.title }}</text>
					<text style="font-size:24;">报销¥ {{ item.total_price }}</text>
					<view class="statusBox">
						<text :class="item.status == 0 ? 'status' : item.status == 2 ? 'status2' : ''">状态：{{ item.status == 0 ? '正在处理中' : item.status == 1 ? '审批完成' : '已驳回'}}</text>
					</view>
				</view>
				
				<view class="time">
					<text>{{ item.updated_at && funcGetDate("MM-DD HH:mm", item.updated_at)}}</text>
					<text :class="item.status == 0 ? 'status' : ''" v-if="item.status != 2">{{ item.pay_status == 1 ? '已支付' : item.pay_status == 0 ? '未支付' : '' }}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 自定义cell
import CustomCell from '@/components/custom-cell/custom-cell.vue';
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// API
import Api from "../../apis/apis.js"
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
import Mixins from '@/mixins/mixin.vue'
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrSearchSource : {},
			attrSource: [],
			attrList : [{
				beforeIcon : '',
				text : '全部',
				type : 2,
				path : "",
				useslot : '',
				key: "pay_status",
				source : [{
					select : true,
					value : "",
					label : '全部'
				},{
					select : false,
					value : 1,
					label : '已支付的'
				},{ 
					value : 0,
					select : false,
					label : '未支付的'
				}],
				showBottons: false
			}, 
			{
				key: "admin_id",
				beforeIcon : '',
				text : '全部成员',
				type : 1,
				path : "",
				useslot : '',
				source: [{
					index : 0,
					select : true,
					value : "",
					label : '全部成员'
				}],
				showBottons: false
			}]
		};
	},
	components: {
		CustomCell,
		ChooseCadeComponent
	},
	methods: {
		/**
		 * 跳转到详情
		 */
		funcPushDetail(item) {
			uni.navigateTo({
				url : `./expenseDetail?id=${item.id}`
			})
		},
		
		/**
		 * 选中子元素
		 */
		funcSelect(e) {
			if(e.type == 100) {
				this.attrShowPicker = (e.type == 100)
				return
			}
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
			this.funcGetSource()
		},
		
		/**
		 * 获取列表数据
		 */
		funcGetSource() {
			Api.getCashier({
				...this.attrSearchSource,
			}).then(res => {
				const list = res.data.data || [];
				this.attrSource = list
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getCashier({
				page: page.num,
				per_page: page.size
			}).then(res => {
				const list = res.data.data || [];
				this.attrPageSource = res.data || {}
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
	.myApply {
		display: flex;
		align-items: center;
		height: 56rpx;
		font-size: 24rpx;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
	}
	
	.cellBox {
		display: flex;
		background-color: white;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx #ededed solid;
	}
	
	.cellRight {
		flex:1;
		display: flex;
	}
	
	.cell {
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: center;
		flex-direction: column;
		box-sizing: border-box;
	}
	
	.status {
		font-size: 24rpx;
		color: #FFA200;
	}
	
	.cellBox {
		display: flex;
		justify-content: space-between;
	}
	
	.statusBox {
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.status {
		color: #FFA200;
	}
	
	.time {
		width: 200rpx;
		font-size: 24rpx;
		display: flex;
		min-height: 160rpx;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
	}
</style>
