<template>
	<view class="visitRecord">
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
		>
			<view v-for="(item, idx) in attrSource" :key="idx" class="visitRecordItem" @click="funcPushDetail(item)">
				<custom-record-cell :source="item" @click="funcCustomerDetail" />
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// API
	import Api from "../../apis/apis.js"
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// 自定义cell
	import CustomRecordCell from '@/components/custom-record-item/custom-record-item.vue'
	export default {
		mixins: [ CustomMescrollMixin,  ], 
		data() {
			return {
				attrDate : "",
				attrSource : []
			}
		},
		
		components: {
			CustomRecordCell
		},
		
		onLoad(options) {
			uni.setNavigationBarTitle({
				title : options.date
			})
			this.attrDate = options.date
		},

		methods: {
			/**
			 * 跳转到熬详情
			 */
			funcCustomerDetail(item) {
				uni.navigateTo({
					url : `../pageCustomer/customInfo?id=${item.customer_id}`
				})
			},
			
			/**
			 * 进入详情
			 */
			funcPushDetail(item) {
				const title = item.type == 1 ? '会话沟通详情' :  item.type == 2 ? '外勤拜访详情' : ''
				uni.navigateTo({
					url: `./visitDetail?title=${title}&id=${item.id}`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getReviewCustomerFollows({
					date : this.attrDate,
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
		},
	}
</script>

<style lang="less">
	
</style>
