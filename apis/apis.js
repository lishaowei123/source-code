/**
 * @description 请求
 */
import request from '../common/http.js'

/**
 * @description 公共样板，单次请求的实例( #公共# )配置 (会覆盖request文件全局实例配置，只对当次请求有效)
 * 				如果某个请求需要单独设置参数, 在请求中覆盖重写即可：如 apiOrderPay 接口
 */
const BASE_CONFIG = {
	/**
	 * 请求公共携带参数
	 */
	//params: {},

	/**
	 * 请求的header数据
	 */
	//header: {},

	/**
	 * 请求基地址
	 */
	//baseURL: "",

	/**
	 * 请求超时时间，默认为0 不限制请求时间
	 */
	//timeout: 30000,

	/**
	 * 请求跨域时是否发送cookie
	 */
	//withCredentials: false,

	/**
	 * 请求二进制数据
	 */
	//responseType:"arraybuffer" || "blob"
}

const api = {
	
	// 上传
	upload: (params) => request.post('upload', params, {
		...BASE_CONFIG
	}),
	
	// 登录
	login: (params) => request.post('user/login', params, {
		needToken : false,
		...BASE_CONFIG
	}),
	
	// 获取员工列表
	getEmployeesList : (params) => request.get('users', params, BASE_CONFIG),
	
	// 创建员工
	createEmployees : (params) => request.post('user/create', params, BASE_CONFIG),
	
	// 更新员工
	updateEmployees : (params) => request.put(`users/${params.id}`, params, BASE_CONFIG),

	// 获取客户详情
	getCustomersDetail: (params) => request.get(`customers/${params.id}`, params, BASE_CONFIG),
	
	// 更新客户详情
	updateCustomersDetail: (params) => request.put(`customers/${params.id}`, params, BASE_CONFIG),
	
	// 删除客户
	deleteCustomersDetail: (params) => request.delete(`customers/${params.id}`, params, BASE_CONFIG),
	
	// 获取客户统计
	getCustomersTj: (params) => request.get(`customers/tj`, params, BASE_CONFIG),
	
	// 获取客户列表
	getCustomersList: (params) => request.get('customers/user', params, BASE_CONFIG),
	
	// 获取客户
    getCustomers: (params) => request.get('customers', params, BASE_CONFIG),
	
	// 创建客户
	createCustomers: (params) => request.post('customers', params, BASE_CONFIG),
	
	// 跟进记录列表
	getCustomerFollows: (params) => request.get('customer_follows/user', params, BASE_CONFIG),
	
	// 我可以看的日期列表
	getReviewCustomerDate: (params) => request.get('customer_follows/date', params, BASE_CONFIG),
	
	// 我可以看的跟进记录列表
	getReviewCustomerFollows: (params) => request.get('customer_follows', params, BASE_CONFIG),
	
	// 创建跟进记录-会话沟通 or 外勤
	createCustomerFollows: (params) => request.post('customer_follows', params, BASE_CONFIG),
	
	// 获取跟进记录-会话沟通 详情
	getCustomerFollowsDetail: (params) => request.get(`customer_follows/${params.id}`, params, BASE_CONFIG),
	
	// 订单列表
	getOrders: (params) => request.get('orders', params, BASE_CONFIG),
	
	// 订单详情
	getOrdersDetail: (params) => request.get(`orders/${params.id}`, params, BASE_CONFIG),
	
	// 订单创建
	createOrders: (params) => request.post('orders', params, BASE_CONFIG),
	
	// 我的订单列表
	getMyOrders: (params) => request.get('orders/user', params, BASE_CONFIG),
	
	// 我的合同
	getMyOrderContracts: (params) => request.get('order_contracts/user', params, BASE_CONFIG),
	
	// 我可以看的合同列表
	getMyReviewOrderContracts: (params) => request.get('order_contracts', params, BASE_CONFIG),
	
	// 创建合同
	createOrderContracts: (params) => request.post('order_contracts', params, BASE_CONFIG),
	
	// 更新合同
	updateOrderContracts: (params) => request.put(`order_contracts/${params.id}`, params, BASE_CONFIG),
	
	// 删除合同
	deleteOrderContracts: (params) => request.delete(`order_contracts/${params.id}`, params, BASE_CONFIG),
	
	// 合同详情
	getOrderContractsDetail: (params) => request.get(`order_contracts/${params.id}`, params, BASE_CONFIG),
	
	// 回款统计
	getOrderPaymentStatistical: (params) => request.get('payment_orders/tj', params, BASE_CONFIG),
	
	// 回款列表
	getOrderPaymentOrders: (params) => request.get('payment_orders/user', params, BASE_CONFIG),
	
	// 我可以看的回款
	getMyOrderPaymentOrders: (params) => request.get('payment_orders', params, BASE_CONFIG),
	
	// 创建回款
	createOrderPaymentOrders: (params) => request.post('payment_orders', params, BASE_CONFIG),
	
	// 删除回款
	deleteOrderPaymentOrders: (params) => request.delete('payment_orders', params, BASE_CONFIG),
	
	// 回款详情
	orderPaymentOrdersDetail: (params) => request.get(`payment_orders/${params.id}`, params, BASE_CONFIG),
	
	// 商品列表
	getGoods: (params) => request.get('goods', params, BASE_CONFIG),
	
	// 商品详情
	getGoodsDetail: (params) => request.get(`goods/${params.id}`, params, BASE_CONFIG),
	
	// 商品分类
	getGoodsCategory: (params) => request.get('categorys', params, BASE_CONFIG),
	
	// 创建商品
	postGoods: (params) => request.post('goods', params, BASE_CONFIG),
	
	// 修改商品
	putGoods: (params) => request.put(`goods/${params.id}`, params, BASE_CONFIG),
	
	// 删除商品
	deleteGoods: (params) => request.delete(`goods/${params.id}`, params, BASE_CONFIG),
	
	// 商品统计
	getGoodsStatistical: (params) => request.get(`goods/tj`, params, BASE_CONFIG),
	
	// 发布评论
	createComments: (params) => request.post('comments', params, BASE_CONFIG),
	
	// 获取审批配置信息
	getExamines: (params) => request.get('examines', params, BASE_CONFIG),
	
	// 创建审批配置信息
	createExamines: (params) => request.post('examines', params, BASE_CONFIG),
	
	// 我申请的审批列表
	getExaminesUser: (params) => request.get('examines/user', params, BASE_CONFIG),
	
	// 获取支付方式
	getPaytypes: (params) => request.get('paytypes', params, BASE_CONFIG),
	
	// 我的审批列表
	getNeed: (params) => request.get('examines/get_need', params, BASE_CONFIG),
	
	// 同意审批
	agreeExamines: (params) => request.post('examines/update', params, BASE_CONFIG),
	
	// 撤销
	agreeOrderCx: (params) => request.post('order/cx', params, BASE_CONFIG),
	
	// 创建消费记录
	createSingles: (params) => request.post('singles', params, BASE_CONFIG),
	
	// 获取消费记录
	getSingles: (params) => request.get('singles', params, BASE_CONFIG),
	
	// 更新消费记录
	updateSingles: (params) => request.put(`singles/${params.id}`, params, BASE_CONFIG),
	
	// 获取消费详情
	getSinglesDetail: (params) => request.get(`singles/${params.id}`, params, BASE_CONFIG),
	
	// 删除组织
	deleteSingles: (params) => request.delete(`singles/${params.id}`, params, BASE_CONFIG),
	
	// 我提交的报销单
	getOrderSingles: (params) => request.get('order_singles', params, BASE_CONFIG),
	
	// 报销单统计
	getOrderSinglesStatistical: (params) => request.get('order_singles/tj', params, BASE_CONFIG),
	
	// 获取订单统计
	getOrderStatistical: (params) => request.get(`orders/tj`, params, BASE_CONFIG),
	
	// 更新审批
	updateOrderSinglesDtail: (params) => request.put(`order_singles/${params.id}`, params, BASE_CONFIG),
	
	// 获取报销单详情
	getOrderSinglesDtail: (params) => request.get(`order_singles/${params.id}`, params, BASE_CONFIG),
	
	// 创建报销单
	createOrderSingles: (params) => request.post('order_singles', params, BASE_CONFIG),
	
	// 获取支付列表
	getCashier: (params) => request.get('order_singles/index_cashier', params, BASE_CONFIG),
	
	// 创建任务
	createTask: (params) => request.post('tasks', params, BASE_CONFIG),
	
	// 我收到的任务
	myReceiveTask: (params) => request.get('tasks/cc', params, BASE_CONFIG),
	
	// 我发布的
	myTaskAdmin: (params) => request.get('tasks/admin', params, BASE_CONFIG),
	
	// 我的任务
	myTask: (params) => request.get('tasks', params, BASE_CONFIG),
	
	// 任务详情
	taskDetail: (params) => request.get(`tasks/${params.id}`, params, BASE_CONFIG),
	
	// 更新详情
	updateTask: (params) => request.put(`tasks/${params.id}`, params, BASE_CONFIG),
	
	// 删除详情
	deleteTask: (params) => request.delete(`tasks/${params.id}`, params, BASE_CONFIG),
	
	// 评论
	taskComment: (params) => request.post(`task_comments`, params, BASE_CONFIG),
	
	// 任务统计
	getTaskStatistical: (params) => request.get(`task/tj`, params, BASE_CONFIG),
	
	// 获取组织列表
	getOrganizations: (params) => request.get(`organizations`, params, BASE_CONFIG),
	
	// 创建组织
	createOrganizations: (params) => request.post(`organization/create`, params, BASE_CONFIG),
	
	// 更新组织
	updateOrganizations: (params) => request.post(`organization/update`, params, BASE_CONFIG),
	
	// 删除组织
	deleteOrganizations: (params) => request.post(`organization/delete`, params, BASE_CONFIG),
	
	// 获取用户信息
	getUserInfoUpdate: (params) => request.get('api/triage/receive', params, BASE_CONFIG),
	
	// 获取用户密码
	getUserPasswordUpdate: (params) => request.post('user/cz', params, BASE_CONFIG),
	
	// 获取消息未读
	getMessageCount: (params) => request.get('homes/count', params, BASE_CONFIG),
	
	// 获取工作提醒列表
	getWorkMessageList: (params) => request.get('homes/work', params, BASE_CONFIG),
	
	// 获取评论提醒列表
	getCommentMessageList: (params) => request.get('homes/comment', params, BASE_CONFIG),
	
	// 获取小助理提醒列表
	getMessageList: (params) => request.get('homes/message', params, BASE_CONFIG),
	
	// 消息已读
	getMessageRead: (params) => request.post('homes/put_message', params, BASE_CONFIG),
	
	// 系数
	getXishu: (params) => request.get('goods/level', params, BASE_CONFIG),
}

export default api