<template>
	<view class="visitRecord">
		<mescroll-uni
			ref="mescrollRef"
			@down="downCallback" 
			@up="funcUpLoad" 
		>
			<view v-for="(i, idx) in attrSource" :key="idx" class="visitRecordItem" @click="funcPsuhDetail(i)">
				<text>{{ i.date }} {{ i.date | Ddate}}</text>
				<view class="visitRecordRight">
					<text>{{ i.total }}人提交</text>
					<uni-icons style="margin-left: 10rpx;" type="arrowright"></uni-icons>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	// 刷新组件
	import CustomMescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	// API
	import Api from "../../apis/apis.js"
	export default {
		mixins: [ CustomMescrollMixin ], 
		data() {
			return {
				attrType : 2,
				attrSourceKeys : [],
				attrSource : [],
			}
		},
		
		onLoad(options) {
			this.attrType = options.type || 2
		},
		
		mounted() {
			// this.attrSourceKeys = Object.keys(this.attrSource)
		},
		
		filters:{
			Ddate(d){
				 d = d.replace(/年|月/g, "-").replace(/日/g,"");
				 var index = (new Date(d)).getDay();
				 var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
				 return weekday[index]
			},
		},
		
		methods: {
			/**
			 * @param {Object} page
			 */
			funcPsuhDetail(item) {
				uni.navigateTo({
					url : `./visitDate?date=${item.date}`
				})
			},
			
			/**
			 * 上拉加载
			 */
			funcUpLoad(page) {
				Api.getReviewCustomerDate({
					type : this.attrType,
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
	}
</script>

<style scoped lang="less">
	.visitRecord {
		width: 100%;
	}
	
	.visitRecord {
		
	}
	
	.visitRecordItem {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: white;
		border-bottom: 1rpx #f4eded solid;
	}
	
	.visitRecordRight {
		
	}
	
</style>
