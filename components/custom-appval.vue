<template>
	<view class="contentBox">
		<view class="point" v-if="originSource.status == 2 || originSource.status == 1">
			<text class="start"></text>
			<text>{{ endLabel }}</text>
		</view>
		<view class="contentApproval" v-for="(item, index) in source" :key="index">
			<view class="contentApprovalItem">
				<view class="examinesContent" v-if="item.pivot.status != 0">
					<view class="examinesContentLeft">
						<view class="headerImageExamines">
							{{ funcSubName(item.name) || "" }}
						</view>
						<view class="line"></view>
					</view>
					<view class="rightContent">
						<text class="titlePerson" style="marginLeft: 10rpx;">{{ showSubTitle ? (!index ? '提交申请' : '负责人审核') : '' }}</text>
							<view class="itemContent">
							<view class="itemContentTop">
								<view class="imagesBox">
									<image v-if="item.pivot.status == 2" 
										style="width:34rpx;margin-right:10rpx;" 
										src="../static/bohui.png" 
										mode="widthFix">
									</image>
									<image v-if="item.pivot.status == 1" 
										style="width:34rpx;margin-right:10rpx;" 
										src="../static/tongyi.png" 
										mode="widthFix">
									</image>
									{{ item.name || "" }}
								</view>
								<text> {{ item.pivot.examined_at && funcGetDate("MM-DD HH:mm", item.pivot.examined_at || "") }}</text> 
							</view>
							<view class="">
								<text> {{ item.pivot.status == 1 ? '同意理由：' : item.pivot.status == 2 ? '驳回理由：' : '' }}</text>
								<text> {{ item.pivot.remark || ""}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="examinesContent" v-else>
					<view class="examinesContentLeft">
						<view class="headerImageExamines">
							{{ funcSubName(item.name) || "" }}
						</view>
						<view class="line"></view>
					</view>
					<!-- <view class="headerImageExamines">
						{{ funcSubName(item.name) || "" }}
					</view> -->
					<view class="rightContent">
						<text class="titlePerson" v-if="showSubTitle" style="marginLeft: 10rpx;">负责人审核</text>
						<view class="itemContent">
							<image style="width:34rpx;margin-right:10rpx;" src="../static/time.png" mode="widthFix"></image>
							<text style="margin-top: 10rpx;">等待{{ item.name }}审批</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="point">
			<text class="end"></text>
			<text>{{ startLabel }}</text>
		</view>
	</view>
</template>

<script>
	import Mixins from '@/mixins/mixin.vue'
	export default {
		name:"custom-appval",
		mixins: [Mixins],
		data() {
			return {
				
			};
		},
		
		methods: {
			/**
			 * 截取名字
			 */
			funcSubName(name) {
				if(name.length > 2) {
					return name.substr(1)
				} else {
					return name
				}
			},
		},
		
		props: {
			showSubTitle: {
				type : Boolean,
				default: true
			},
			startLabel : {
				type : String,
				default: "开始申请"
			},
			endLabel : {
				type : String,
				default: "流程结束"
			},
			originSource : {
				type : Object
			},
			source : {
				type : Array
			}
		}
	}
</script>

<style scoped lang="less">

.headerImage {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #225796;
	flex-shrink: 0;
	color: white;
	font-size: 22rpx;
}

.contentBox {
	padding: 20rpx;
	box-sizing: border-box;
}

.contentApproval {
	padding: 20rpx 0rpx;
}

.point {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
}

.start, .end {
	width: 20rpx;
	height: 20rpx;
	background-color: #c9bcbc;
	border-radius: 50%;
	margin-right: 10rpx;
}

.titlePerson {
	font-size: 22rpx;
}

.examinesContent {
	display: flex;
}

.contentApprovalItem {
	
}

.headerImageExamines {
	.headerImage();
	width: 60rpx;
	height: 60rpx;
}

.rightContent {
	display: flex;
	flex-direction: column;
    width: 100%;
}

.itemContent {
	display: flex;
	align-items: center;
	background-color: #f5ecec;
	font-size: 26rpx;
	margin-left: 10rpx;
	width: 100%;
	margin-top: 10rpx;
	border-radius: 5rpx;
	padding: 20rpx;
	box-sizing: border-box;
	color: #e08514;
	flex-direction: column;
	align-items: baseline;
}

.itemContentTop {
    width: 100%;
	display: flex;
	justify-content: space-between;
	color: black;
}

.imagesBox {
	display: flex;
	align-items: center;
}

.examinesContentLeft {
	display: flex;
	flex-direction:column;
	align-items: center;
}

.line {
	height: 120rpx;
	border-left: 1rpx #efe4e4 solid;
	margin-top: 20rpx;
 }

</style>
