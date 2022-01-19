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
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcSelectItem(item, index)">
				<view class="headerView">
					<view class="headerImage">
						{{ item.admin && funcSubName(item.admin.name) || "获取中" }}
					</view>
					<view class="headerRightInfo">
						<view>{{ item && item.name || "" }}</view>
						<view class="buttonBox">
							<template v-if="item.status == 0">
								<text class="time" v-if="item.status == 0">{{ funcOverdue(item.end_date || "", ) }} </text>
								<text :class="[ funcOverdueStatus(item.end_date) ? 'pointOverdue' : 'point' ]"></text>
							</template>
							<template v-if="item.status == 1">
								<text class="time" v-if="item.status == 1">截止 {{ funcFormat(item.end_date) }} </text>
								<text class="point"></text>
							</template>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 事件处理
import EventBus from '../../common/bus.js'
// 刷新组件
import CustomMescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// 自定义页面【 下拉选择页面 】
import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
// mixins
import Mixins from '@/mixins/mixin.vue'
// API
import Api from "../../apis/apis.js"
export default {
	mixins: [CustomMescrollMixin, Mixins],
	data() {
		return {		
			attrSource: [],
			attrList : [{
				beforeIcon : '',
				text : '最新发布',
				type : 2,
				path : "",
				key : "solt",
				useslot : '',
				source : [{
					select : true,
					value : 1,
					label : '最新发布'
				}, {
					value : 2,
					select : false,
					label : '截止时间'
				}],
				showBottons: false
			}, {
				beforeIcon : '',
				text : '全部成员',
				type : 2,
				path : "",
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
				showBottons: false,
			}, {
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
			}],
			attrType : 1,
			attrSearchSource: {},
			
		};
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
		/**
		 * 
		 * 选中商品
		 */
		EventBus.$on('SELECTGOODS', (e) => {
			const data = e
			this.attrSearchSource.goods_id = data.id
			this.attrList[2].text = data.name
			this.attrList[2].source[1].label = data.name
			this.funcGetSource()
		})	
	},
	
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: options.title || ""
		})
		this.attrType = options.type || this.attrType
	},

	components: {
		ChooseCadeComponent
	},
	
	/**
	 * 点击navigation-item
	 */
	onNavigationBarButtonTap(e) {  
		const userInfo = uni.getStorageSync('UserInfo')
		if(userInfo.is_task) {
			uni.navigateTo({ 
				url : './taskCreate'
			})
		} else {
			uni.showToast({
				title : '暂无权限',
				icon : 'none'
			})
		}
	},
		
	methods: {
		/**
		 * 选中子元素
		 */
		funcSelect(e) {
			e.source && e.source.map((item, index) => {
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
		 * 跳转到详情
		 */
		funcSelectItem(item, index) {
			uni.navigateTo({
				url : `./taskDetail?id=${item.id}`
			})
		},
		
		/**
		 * 获取数据
		 */
		funcGetSource() {
			const apiName = this.attrType == 1 ? 'myTaskAdmin' : 'myReceiveTask'
			Api[apiName]({
				...this.attrSearchSource
			}).then(res=>{
				const list = res.data.data || []
				this.mescroll.endByPage(list.length, res.data.total);
				this.attrSource = list
			})
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			const apiName = this.attrType == 1 ? 'myTaskAdmin' : 'myReceiveTask'
			Api[apiName]({
				page : page.num,
				per_page : page.size,
				...this.attrSearchSource
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
	
	.headerView {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
	}
	
	.headerImage {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #a4abb3;
		flex-shrink: 0;
		color: white;
		font-size: 22rpx;
	}
	
	.headerRightInfo {
		flex: 1;
		margin-left: 20rpx;
	}
	
	.time {
		font-size: 24rpx;
		color: #bfaeae;
		margin-top: 10rpx;
	}
	
	.point {
		width: 10rpx;
		height: 10rpx;
		background-color: #a4abb3;
		border-radius: 50%;
	}
	
	.buttonBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.pointOverdue {
		.point();
		background-color: red;
	}
	
	.soucteItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx 0rpx;
		box-sizing: border-box;
		border-bottom: 1rpx #fbf3f3 solid;
		background-color: white;
	}
</style>
