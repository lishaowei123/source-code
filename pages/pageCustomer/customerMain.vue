<template>
	<view class="container">
		<template>
			<general-tip-component title="我可以查看的客户" @click="funcReviewClick" />
		</template>
		<chunLei-popups @tapPopup="funcTapPopup" v-model="attrShowPopUp" :popData="attrPopUpDataSource" :x="347"
			:y="0" maskBg="rgba(0,0,0,0.4)" placement="top-end" />
		<choose-cade-component pageHeight="80rpx" :dataSource="attrList" @select="funcSelect"></choose-cade-component>
		<view class="">
			<mescroll-uni 
				ref="mescrollRef" 
				@down="downCallback" 
				@up="funcUpLoad"
				top="160"
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
	// 自定义页面【 通用tip组件 】
	import GeneralTipComponent from '@/components/commonGeneralTip/commonGeneralTip.vue'
	// 自定义页面【 popup弹出层 】
	import ChunLeiPopupsComponent from "@/components/chunLei-popups/chunLei-popups.vue";
	// 自定义页面【 下拉选择页面 】
	import ChooseCadeComponent from "@/components/choose-Cade/choose-Cade.vue";
	// 事件处理 【事件处理】
	import EventBus from '../../common/bus.js'
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [CustomMescrollMixin],
		data() {
			return {
				attrSearchSource : {},
				attrSource : [],
				attrShowPopUp: false,
				attrPopUpDataSource: [{
					icon: '',
					title: '手动创建',
					index: 0
				}],
				// attrPopUpDataSource: [{
				// 	icon: '',
				// 	title: '手动创建',
				// 	index: 0
				// }, {
				// 	icon: '',
				// 	title: '扫名片',
				// 	index: 1
				// }, {
				// 	icon: '',
				// 	title: '导入客户',
				// 	index: 2
				// }, {
				// 	icon: '',
				// 	title: '客户查重',
				// 	index: 3
				// }],
				// attrList type 0 跳转 1 选择 2 下拉 source 下拉选择的数据 useslot 使用自定义页面 path:'跳转的页面路径'
				attrList: [{
					beforeIcon: '../../static/uni.png',
					text: '搜索',
					type: 0,
					path: "../../pages/pageCustomer/customerSearch?isDetail=1",
					useslot: '',
					source: [],
					showBottons: false
				}, 
				// {
				// 	beforeIcon: '',
				// 	text: '筛选',
				// 	type: 1,
				// 	path: "",
				// 	useslot: 'custom-select',
				// 	source: [],
				// 	showBottons: true
				// }, 
				{
					beforeIcon: '',
					text: '全部',
					type: 2,
					key : 'sort',
					path: "",
					useslot: '',
					source: [{
						select: true,
						value : '',
						label: '全部'
					},{
						select: false,
						value : 'created_at',
						label: '最新创建'
					}, {
						value : 'updated_at',
						select: false,
						label: '最后跟进'
					}, {
						value : 'follow7',
						select: false,
						label: '7天未跟进'
					}, {
						value : 'follow14',
						select: false,
						label: '14天未跟进'
					}, {
						value : 'follow30',
						select: false,
						label: '30天未跟进'
					}],
					showBottons: false,
				}]
			};
		},

		components: {
			GeneralTipComponent,
			ChunLeiPopupsComponent,
			ChooseCadeComponent
		},
		
		mounted() {
			/**
			 * 添加成功
			 */
			EventBus.$on('ADDCUSTOMSUCCESS', (e) => {
				this.funcUpLoad()
			})
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
			 * 获取列表数据
			 */
			funcGetSource() {
				this.attrSource = []
				Api.getCustomersList({
					...this.attrSearchSource
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
					this.attrSource = data
				})
			},
			
			/**
			 * 点击我可以查看的客户
			 */
			funcReviewClick() {
				uni.navigateTo({
					url: './customerReview'
				})
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
			 * 点击navigation-item
			 */
			onNavigationBarButtonTap(e) {
				switch (e.index) {
					case 0:
						this.attrShowPopUp = true
						break;
					case 1:
						console.info(e.index)
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
							url: './customerCreate'
						})
					case 1:
						console.info(e.index)
						break;
					case 2:
						console.info(e.index)
						break;
					case 3:
						uni.navigateTo({
							url: './customerRechecking'
						})
						break;
					default:
						break;
				}
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page = {}) {
				Api.getCustomersList({
					...this.attrSearchSource,
					page : page.num || 15,
					per_page : page.size || 1
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
					this.mescroll.endByPage(data.length, res.data.total); 
					if(page.num == 1) this.attrSource = []; 
					this.attrSource = this.attrSource.concat(data); 
				}).catch(()=>{
					this.mescroll.endErr();
				})
			}
		}
	};
</script>

<style scoped lang="less">
	.container {
		height: 100%;
		background-color: white;
	}

	.contentBaseView {
		position: relative;
		top: 80rpx;
		width: 100%;
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		height: calc(100% - 160rpx);
	}

	.mescroll-empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	
	.contentItem {
		width: 100%;
		min-height: 200rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx #f1f1f1 solid;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		background-color: white;
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