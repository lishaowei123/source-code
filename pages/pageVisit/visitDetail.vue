<template>
	<view class="container">
		<custom-record-cell :source="attrSource" :showComments="false" :showEdit="true" :showType="false" />
		<view :style="{marginTop : '20rpx; paddingButtom: 100rpx'}">
			<custom-comments :source="attrSource" @send="funcUpdate" />
		</view>
	</view>
</template>

<script>
	// 评论组件
	import CustomComments from "@/components/custom-comments/custom-comments.vue"
	// 自定义cell 
	import CustomRecordCell from '@/components/custom-record-item/custom-record-item.vue'
	// 工具类
	import utils from '@/common/utils.js'
	// API
	import Api from "../../apis/apis.js"
	export default {
		data() {
			return {
				attrSourceId : void 0,
				attrSource : {}
			}
		},
		
		onLoad(options) {
			this.attrSourceId = options.id || void 0
			uni.setNavigationBarTitle({
				title : options.title
			})
		},
		
		mounted() {
			this.funcGetDetail()
		},
		
		components: {
			CustomComments,
			CustomRecordCell
		},
		
		methods: {
			/**
			 * 更新数据
			 */
			funcUpdate() {
				utils.funcDelay(500, () => {
					this.funcGetDetail()
				})
			},
			
			/**
			 * 获取接口数据
			 */
			funcGetDetail() {
				Api.getCustomerFollowsDetail({
					id : this.attrSourceId
				}).then(res => {
					let data = res.data || {}
					if(data && data.admin && data.admin.name.length > 2) {
						data.strName = data.admin.name.substring(1)
					}
					this.attrSource = data || {} 
				})
			},
		}
	}
</script>

<style scoped lang="less">
	

</style>
