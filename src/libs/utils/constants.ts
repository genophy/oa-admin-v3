// 性别
export const SEX_TYPE = [
  { id: 0, name: '女' },
  { id: 1, name: '男' },
  { id: 2, name: '其他' },
];

// 用户权限范围
export const USER_PERMISSION_SCOPE = [
  { id: 0, name: '无' },
  { id: 1, name: '仅当前部门' },
  { id: 2, name: '仅子部门' },
  { id: 3, name: '包括子部门' },
];

// 学历类型
export const ACADEMIC_TYPE = [
  { id: 0, name: '不限' },
  { id: 1, name: '小学' },
  { id: 2, name: '初中' },
  { id: 3, name: '高中' },
  { id: 4, name: '大专' },
  { id: 5, name: '大学' },
  { id: 6, name: '硕士' },
  { id: 7, name: '博士' },
];

// 月份
export const MONTH = [
  { id: 0, name: '一月' },
  { id: 1, name: '二月' },
  { id: 2, name: '三月' },
  { id: 3, name: '四月' },
  { id: 4, name: '五月' },
  { id: 5, name: '六月' },
  { id: 6, name: '七月' },
  { id: 7, name: '八月' },
  { id: 8, name: '九月' },
  { id: 9, name: '十月' },
  { id: 10, name: '十一月' },
  { id: 11, name: '十二月' },
];

// 星期
export const WEEK = [
  { id: 0, name: '周日' },
  { id: 1, name: '周一' },
  { id: 2, name: '周二' },
  { id: 3, name: '周三' },
  { id: 4, name: '周四' },
  { id: 5, name: '周五' },
  { id: 6, name: '周六' },
];

// 支付状态
export const OFFER_STATE_TYPE = [
  { id: '1', name: '领先' },
  { id: '2', name: '出局' },
];

// 拍卖状态 状态  0-待审核 1-待开拍 2-已开拍 3-已拍出 4-已下架 5-已过期 6-审核未通过 7-失效 8-转卖中
export const AUCTION_STATUS_TYPE = [
  { id: 0, name: '待审核' },
  { id: 1, name: '待开拍' },
  { id: 2, name: '已开拍' },
  { id: 3, name: '已拍出' },
  { id: 4, name: '已下架' },
  { id: 5, name: '已过期' },
  { id: 6, name: '审核未通过' },
  { id: 7, name: '失效' },
  { id: 8, name: '转卖中' },
];

// 订单状态 1-创建2支付中3已完成4-已退款5-支付失败6-退款失败7领取藏品完成
export const ORDER_STATUS_TYPE = [
  { id: 1, name: '创建' },
  { id: 2, name: '支付中' },
  { id: 3, name: '已完成' },
  { id: 4, name: '已退款' },
  { id: 5, name: '支付失败' },
  { id: 6, name: '退款失败' },
  { id: 7, name: '领取藏品完成' },
];

// 保证金状态 1-创建 2-支付中 3-已完成 4-已退回 5-支付失败 6-退款失败
export const DEPOSIT_ORDER_STATUS = [
  { id: 1, name: '待支付' },
  { id: 2, name: '支付中' },
  { id: 3, name: '已支付' },
  { id: 4, name: '已退回' },
  { id: 5, name: '支付失败' },
  { id: 6, name: '退款失败' },
];

// 流水类型 1-保证金支付流水2-保证金退款流水3-尾款支付流水4-订单退款流水5-订单结算6-提现流水7-卖家手续费8-买家手续费9-卖家个人所得税10-未支付尾款,保证金入账11-重复支付退款流水
export const FLOW_TYPE = [
  { id: 1, name: '保证金支付流水' },
  { id: 2, name: '保证金退款流水' },
  { id: 3, name: '尾款支付流水' },
  { id: 4, name: '订单退款流水' },
  { id: 5, name: '订单结算' },
  { id: 6, name: '提现流水' },
  { id: 7, name: '卖家手续费' },
  { id: 8, name: '买家手续费' },
  { id: 9, name: '卖家个人所得税' },
  { id: 10, name: '未支付尾款' },
  { id: 11, name: '重复支付退款流水' },
];

// 支付流水
export const FLOW_STATUS = [
  { id: 0, name: '创建中' },
  { id: 1, name: '支付中' },
  { id: 2, name: '成功' },
  { id: 3, name: '失败' },
  { id: 4, name: '已退款' },
  { id: 5, name: '退款中' },
];

// 银行账号类型
export const BANKACCT_TYPE = [
  { id: 'BANKACCT_PRI', name: '对私账号' },
  { id: 'BANKACCT_PUB', name: '对公账号' },
];

// 提现状态
export const EXTRACT_STATUS_TYPE = [
  { id: 1, name: '待审核' },
  { id: 2, name: '打款中' },
  { id: 3, name: '提现完成' },
  { id: 4, name: '审核失败' },
  { id: 5, name: '提现失败' },
];
