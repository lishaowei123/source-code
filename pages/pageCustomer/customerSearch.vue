<template>
	<view class="searchCustomerBaseView">
		<mescroll-uni
			ref="mescrollRef"
			:down="attrDownOption"
			@down="downCallback" 
			@up="funcUpLoad" 
		>
			<uni-search-bar :placeholder="'搜索' + attrPlaceholder" 
				focus
				@input="funcInput" 
				@cancel="funcCancelSearch"
			></uni-search-bar>
			<view class="searchOptions" v-if="!attrSearchValue.length">
				<text class="searchOptionsMain">选择搜索类型</text>
				<view class="searchOptionsLabel">
					<text  v-for="(item, index) in attrSearchTypeList" :key="item.type" @click="funcSelectSearchType(item, index)" :class="attrSearchType == item.type ? 'select' : 'noSelect'">{{ item.label }}</text>
				</view>
			</view>
			<view class="searchContentContainer" v-else>
				<view class="searchContentContainerItem" v-for="(item, index) in attrSource" :key="index" @click="funcClickCustom(item, index)">
					<text class="searchContentContainerItemTitle">{{ item.name || "" }}</text>
					<text class="searchContentContainerItemPerson">联系人：{{ item.realnameJoin || "" }}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
// 刷新组件
import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 搜索组件
import UniSearch from '../../components/uni-search-bar/uni-search-bar.vue'
// 事件处理
import EventBus from '../../common/bus.js'
// API
import Api from "../../apis/apis.js"
export default {
	mixins: [ CustomMescrollMixin ], 
	data() {
		return {
			attrPath : "",
			attrShowSearchType: true,
			attrPlaceholder: "客户名/联系人/电话",
			attrSearchTypeList : [
				{ type : 'name', label : '客户名/联系人/电话' },
				{ type : 'address', label : '客户地址' },
				{ type : 'source', label : '客户获取来源' },
				{ type : 'remark', label : '客户备注' },
				{ type : 'contact_remark', label : '联系人备注' }
			],
			attrSearchType : 'name',
			attrSearchValue : '',
			attrSource : [],
			attrIsDetail: false,
			attrDownOption: {
				use: false
			}
		}
	},
	
	components: {
		UniSearch	
	},
	
	onLoad(options) {
		if(options.path) {
			this.attrPath = JSON.parse(options.path) 
		}
		if(options.isDetail) {
			this.attrIsDetail = true
		}
	},
	
	methods: {
		/**
		 * 选择搜索类型
		 */
		funcSelectSearchType(item, index) {
			this.attrPlaceholder = item.label
			this.attrSearchType = item.type
		},
		
		/**
		 * 选中客户
		 */
		funcClickCustom(item) {
			if(this.attrIsDetail) {
				uni.navigateTo({
					url : `./customInfo?id=${item.id}`
				})
			} else {
				EventBus.$emit('SELECTCUSTOMER', item)
				if(this.attrPath) {
					uni.navigateBack({
						delta: 2
					})
				} else {
					uni.navigateBack()
				}
			}
		},
		
		/**
		 * 取消搜索
		 */
		funcCancelSearch() {
			uni.navigateBack()
		},
		
		/**
		 * 实时搜索数据
		 */
		funcInput(value) {
			this.attrSearchValue = value 
			if(!value) {
				return
			}
			this.funcGetSource()
		},
		
		/**
		 * 获取搜索客户列表
		 */
		funcGetSource() {
			this.attrSource = []
			Api.getCustomers({
				[this.attrSearchType] : this.attrSearchValue
			}).then(res=>{
				const data = res.data.data || []
				data && data.map((item, index) => {
					let realnameArr = [];
					item.contact && item.contact.map((i, idx) => {
						realnameArr.push(i.realname)
					})
					item.realnameJoin = realnameArr.join("、");
				})
				this.attrSource = data; 
			})	
		},

		/**
		 * 上拉加载
		 */
		funcUpLoad(page) {
			Api.getCustomers({
				[this.attrSearchType] : this.attrSearchValue,
				page : page.num,
				per_page : page.size
			}).then(res=>{
				const data = res.data.data || []
				data && data.map((item, index) => {
					let realnameArr = [];
					item.contact && item.contact.map((i, idx) => {
						realnameArr.push(i.realname)
					})
					item.realnameJoin = realnameArr.join("、");
				})
				this.mescroll.endByPage(data.length, res.data.total); 
				if(page.num == 1) this.attrSource = []; 
				this.attrSource = this.attrSource.concat(data); 
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

	.searchCustomerBaseView {
		width: 100%; 
		height: 100%;
		background-color: white;
	}
	
	.searchOptions {
		width: 100%;
		padding: 0rpx 20rpx 10rpx 20rpx;
		box-sizing: border-box;
	}
	
	.searchContentContainer {
		
	}
	
	.searchOptionsMain {
		font-size: 28rpx;
		padding: 10rpx 0rpx 10rpx 0rpx;
		display: block;
	}
	
	.searchOptionsLabel {
		display: flex;		
		flex-wrap: wrap;
	}
	
	.select {
		font-size: 24rpx;
		margin-top: 20rpx;
		border-radius: 100px;
		background-color: #6384D7;
		padding: 6rpx 20rpx;
		color: white;
		margin-right: 10rpx;
	}
	
	.noSelect {
		.select();
		background-color: #F6F6F6;
		color: #000000;
	}
	
	.searchContentContainerItem {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		padding-bottom: 20rpx;
	}
	
	.searchContentContainerItemTitle {
		font-size: 30rpx;
	}
	
	.searchContentContainerItemPerson {
		font-size: 24rpx;
		margin-top: 6rpx;
	}

</style>
