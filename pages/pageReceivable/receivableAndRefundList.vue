<template>
	<view class="container">
		<!-- <choose-cade-component 
			pageHeight="0rpx"
			:dataSource="attrList" 
			@select="funcSelect" 
		> -->
		</choose-cade-component>
		<mescroll-uni 
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
			top="0"
		>
			<view class="soucteItem" v-for="(item, index) in attrSource" :key="index" @click="funcPushDetail(item)">
				<view class="soucteItemLeft">
					<view class="soucteItemLeftBox coarse">
						回款金额 ¥{{ item.price || "" }}
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">客户: </text>
						<text class="value">{{item.customer && item.customer.name  }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">回款日期: </text>
						<text class="value">{{item.date }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">方式: </text>
						<text class="value">{{item.paytype && item.paytype.name }}</text>
					</view>
					<view class="soucteItemLeftBox">
						<text class="label">归属人: </text>
						<text class="value">{{item.admin && item.admin.name  }}</text>
					</view>
				</view>
				<view class="soucteItemRight">
					<text>{{ item.status == 0 ? '未确认' : item.status == 1 ? '已确认' : '' }}</text>
				</view>
			</view>
		</mescroll-uni>
		<image class="qushiImage" src="../../static/qushi.png" mode="widthFix" @click="funcTouchQushi"></image>
	</view>
</template>

<script>
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
			// attrList type 0 跳转 1 选择 2 下拉 source 下拉选择的数据 useslot 使用自定义页面 path:'跳转的页面路径'
			attrList : [{
				beforeIcon : '',
				text : '全部时间',
				type : 2,
				path : "",
				useslot : '',
				source : [{
					select : true,
					index : 0,
					label : '全部时间'
				},{
					index : 1,
					select : false,
					label : '最后跟进'
				}],
				showBottons: false
			}, {
				beforeIcon : '',
				text : '全部状态',
				type : 2,
				path : "",
				useslot : '',
				source: [{
					select : true,
					index : 0,
					label : '已确认'
				},{
					index : 1,
					select : false,
					label : '待确认'
				},{
					index : 2,
					select : false,
					label : '已驳回'
				},{
					index : 3,
					select : false,
					label : '已作废'
				}],
				showBottons: false,
			}, {
				beforeIcon : '',
				text : '最新创建',
				type : 2,
				path : "",
				useslot : '',
				source: [{
					select : true,
					index : 0,
					label : '最新创建'
				},{
					index : 1,
					select : false,
					label : '最高金额'
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
					label : '最新创建'
				},{
					index : 1,
					select : false,
					label : '选择成员'
				}],
				showBottons: false,
			}]
		};
	},
	
	components: {
		ChooseCadeComponent
	},
	
	methods: {
		
		/**
		 * 单击趋势
		 */
		funcTouchQushi() {
			uni.navigateTo({
				url : './receivableAnalysis'
			})
		},
		
		/**
		 * 点击我可以查看的客户
		 */
		funcReviewClick() {
			uni.navigateTo({
				url:'./customerReview'
			})
		},
		
		/**
		 * 跳转回款详情
		 */
		funcPushDetail(item) {
			uni.navigateTo({
				url : `./receivableDetail?id=${item.id}`
			})
		},
		
		/**
		 * 选中子元素
		 */
		funcSelect(e) {
		},
		
		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getMyOrderPaymentOrders({
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
		}
	}
};
</script>

<style scoped lang="less">
	
	.container {
		height: 100%;
		// background-color: white;
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
	
	.soucteItem {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		box-sizing: border-box;
		border-bottom: 5px #fbf3f3 solid;
		background-color: white;
	}
	
	.soucteItemLeft {
		font-size: 24rpx;
	}
	
	.soucteItemRight {
		font-size: 24rpx;
	}
	
	.coarse {
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 20rpx;
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
