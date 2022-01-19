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
			@down="downCallback" 
			@up="funcUpLoad" 
			top="80"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item, index)">
				<view class="soucteItemLeftBox">
					 {{ item.title || "" }}
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">客户: </text>
					<text class="value">{{item.customer && item.customer.name  }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">归属人: </text>
					<text class="value">{{item.admin && item.admin.name }}</text>
				</view>
				<view class="soucteItemLeftBox">
					<text class="label">截止日期: </text>
					<text class="value">{{item.end_date }}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 事件处理
import EventBus from '../../common/bus.js'
// 刷新组件 
import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
// API
import Api from "../../apis/apis.js"
export default {
	mixins: [ CustomMescrollMixin ], 
	
	data() {
		return {
			attrSource: [],
			attrSearchSource: {},
			attrList : [{
				beforeIcon : '../../static/uni.png',
				text : '搜索',
				type : 0,
				path : "../../pages/pageCustomer/customerSearch?isDetail=1",
				useslot : '',
				source : [],
				showBottons: false
			}, {
				beforeIcon : '',
				text : '最新创建',
				type : 2,
				path : "",
				key : 'sort',
				useslot : '',
				source: [{
					select : true,
					value : 'created_at',
					label : '最新创建'
				},{
					select : false,
					value : 'end_date',
					label : '截止日期'
				}],
				showBottons: false,
			}, {
				beforeIcon : '',
				text : '全部成员',
				type : 2,
				path : "",
				useslot : '',
				source: [{
					select : true,
					index : 0,
					label : '全部成员'
				}, {
					index : 1,
					select : false,
					label : '其他成员',
					path : `../../pages/pageEmployees/pageEmployeesMain?self=0&sign=1&emit=SELECTPERSONGOODS`
				}],
				showBottons: false,
			}]
		};
	},
	
	components: {
		ChooseCadeComponent
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
			this.funcGetList()
		})	
	},
	
	methods: {
		/**
		 * 选中子元素
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
			this.funcGetList()
		},
	
		/**
		 * 跳转到详情
		 */
		funcPushDetail(item, index) {
			uni.navigateTo({
				url : `./contractDetail?id=${item.id}`
			})
		},
		
		/**
		 * 获取详情
		 */
		funcGetList() {
			Api.getMyReviewOrderContracts({
				...this.attrSearchSource
			}).then(res => {
				const list = res.data.data || []
				this.attrSource = list 
			})
		},
	
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getMyReviewOrderContracts({
				...this.attrSearchSource,
				page : page.num,
				per_page : page.size
			}).then(res=>{
				const list = res.data.data || []
				this.mescroll.endByPage(list.length, res.data.total); 
				if(page.num == 1) this.attrSource = []; 
				this.attrSource = this.attrSource.concat(list); 
			}).catch(()=>{
				this.mescroll.endErr();
			})
		},
	}
};
</script>

<style scoped lang="less">
	
	.container {
		height: 100%;
		background-color: white;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
	.soucteItemLeftBox {
		
	}
	
</style>
