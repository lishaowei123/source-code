<template>
	<view class="reviewBaseView">
		<choose-cade-component 
			pageHeight="0rpx"
			:dataSource="attrList"
			@select="funcSelect" 
			@clear="funcClear"
			@confirm="funcConfrim"
		>
			<custom-customer-select ref="custom-select" />
		</choose-cade-component>
		<view class="reviewContainer">
			<mescroll-uni
				ref="mescrollRef"
				@down="downCallback" 
				@up="funcUpLoad" 
				top="80"
			>
				<view class="contentItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)">
					<text class="contentItemTitle">{{ item.name || "" }}</text>
					<view class="contentItemPerson">
						<text>跟进人：{{ item.usersJoin || "" }}</text>
						<text>联系人：{{ item.realnameJoin || "" }}</text>
						<text>获取来源：{{ item.source || "" }}</text>
						<text>最后跟近时间：{{ item.updated_at || "" }}</text>
					</view>
				</view>
			</mescroll-uni>
			<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
		</view>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
// 自定义页面【 客户筛选条件 】
import CustomCustomerSelect from '@/components/custom-customer-select/custom-customer-select.vue';
// API
import Api from "../../apis/apis.js"
// 事件处理
import EventBus from '../../common/bus.js'
export default {
	mixins: [ CustomMescrollMixin ], 
	
	data() {
		return {
			attrSource: [],
			attrSearchSource : {},
			attrList : [{
				beforeIcon : '../../static/uni.png',
				text : '搜索',
				type : 0,
				path : "../../pages/pageCustomer/customerSearch?isDetail=1",
				useslot : '',
				source : [],
				showBottons: false
			}, 
			// {
			// 	beforeIcon : '',
			// 	text : '筛选',
			// 	type : 1,
			// 	path : "",
			// 	useslot : 'custom-select',
			// 	source : [],
			// 	showBottons: true
			// }, 
			// {
			// 	beforeIcon : '',
			// 	text : '最新创建',
			// 	type : 1,
			// 	path : "",
			// 	value : 0,
			// 	key : 'sort',
			// 	useslot : '',
			// 	source: [{
			// 		value : "created_at",
			// 		select : true,
			// 		label : '最新创建'
			// 	},{
			// 		value : "updated_at",
			// 		select : false,
			// 		label : '最后跟进'
			// 	},{
			// 		value : "follow7",
			// 		select : false,
			// 		label : '7天未跟进'
			// 	},{
			// 		value : "follow14",
			// 		select : false,
			// 		label : '14天未跟进'
			// 	},{
			// 		value : "follow30",
			// 		select : false,
			// 		label : '30天未跟进'
			// 	}],
			// 	showBottons: false
			// }, 
			
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
			}]
		}
	},
	
	mounted() {
		/**
		 * 选中人员
		 */
		EventBus.$on('SELECTPERSONGOODS', (e) => {
			const data = JSON.parse(e)
			this.attrSearchSource.user_id = data.id
			this.attrList[1].text = data.name
			this.attrList[1].source[1].label = data.name
			this.funcGetSource()
		})
	},
		
	components: {
		CustomCustomerSelect,
		ChooseCadeComponent
	},
	
	methods: {
		
		/**
		 * 单击趋势
		 */
		funcTouchQushi() {
			uni.navigateTo({
				url : './customerAnalysis'
			})
		},
		
		/**
		 * 进入详情
		 */
		funcPushDetail(item) {
			uni.navigateTo({
				url : `./customInfo?id=${item.id}`
			})
		},
		
		/**
		 * 清除自定义页面选中数据
		 */
		funcClear() {
			this.$refs['custom-select'].funcClear && this.$refs['custom-select'].funcClear()
		},
		
		/**
		 * 确定自定义页面选中
		 */ 
		funcConfrim() {
			const data = this.$refs['custom-select'].funcConfrim && this.$refs['custom-select'].funcConfrim()
		},
		
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
			
			this.funcGetSource()
		},
		
		/**
		 * 获取数据
		 */
		funcGetSource() {
			this.attrSource = []
			Api.getCustomers({
				...this.attrSearchSource
			}).then(res=>{
				const list = res.data.data || []
				this.attrSource = list
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getCustomers({
				...this.attrSearchSource,
				page : page.num,
				per_page : page.size
			}).then(res=>{
				const data = res.data.data || []
				data && data.map((item, index) => {
					let realnameArr = [], usersArr = [];
					item.contact && item.contact.map((i, idx) => {
						realnameArr.push(i.realname)
					})
					item.users && item.users.map((i, idx) => {
						usersArr.push(i.name)
					})
					item.realnameJoin = realnameArr.join("、");
					item.usersJoin = usersArr.join("、");
				})
				
				this.mescroll.endByPage(data.length, res.data.total); //必传参数(当前页的数据个数, 总页数)
				if(page.num == 1) this.attrSource = []; //如果是第一页需手动制空列表
				this.attrSource = this.attrSource.concat(data); //追加新数据
			}).catch(()=>{
				//联网失败, 结束加载
				this.mescroll.endErr();
			})
		},
	}
}
</script>

<style scoped lang="less">
	uni-page-body {
		height: 100%!important;
	}
	
	.reviewBaseView {
		width: 100%;
		height: 100%; 
		background-color: white;
	}
	
	.mescroll-empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	
	.reviewContainer {
		width: 100%;
		height: 100%;
	}
	
	.content {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: white;
		margin-top: 80rpx;
		padding: 0rpx 30rpx;
		box-sizing: border-box;
		overflow: auto;
	}
	
	.reviewContainer {
		width: 100%;
		height: calc(100% - 80rpx);
	}
	
	.contentItem {
		width: 100%;
		min-height: 200rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx #f1f1f1 solid;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
	}
	
	.contentItemTitle {
		font-size: 36rpx;
	}
	
	.contentItemPerson {
		color: #b28181;
		display: flex;
		flex-direction: column;
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
