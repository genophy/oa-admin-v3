export const buttons = [
  {
    path: '/main/goods/goods-cate',
    name: '拍品分类',
    children: [{ code: 'goodsCate:sync', name: '同步' }],
  },
  {
    path: '/main/auction/auction-goods',
    name: '拍品列表',
    children: [
      { code: 'auctionGoods:setRecommendIdx', name: '设置推荐指数' },
      { code: 'auctionGoods:viewSeller', name: '查看卖家' },
      { code: 'auctionGoods:audit', name: '审核' },
    ],
  },
  {
    path: '/main/goods/service-charge',
    name: '拍品手续费',
    children: [
      { code: 'serviceCharge:add', name: '新增' },
      { code: 'serviceCharge:edit', name: '编辑' },
      { code: 'serviceCharge:del', name: '删除' },
    ],
  },
  {
    path: '/main/goods/goods-recommend',
    name: '拍卖推荐',
    children: [{ code: 'goodsRecommend:del', name: '取消推荐' }],
  },
  {
    path: '/main/auction/auction-place',
    name: '拍卖专场',
    children: [
      { code: 'auctionPlace:add', name: '新增' },
      { code: 'auctionPlace:edit', name: '编辑' },
      { code: 'auctionPlace:del', name: '删除' },
    ],
  },
  {
    path: '/main/balance/balance-extract',
    name: '余额提现审核',
    children: [{ code: 'balanceExtract:audit', name: '审核' }],
  },
  {
    path: '/main/community/advertising-mgt',
    name: '资讯管理',
    children: [
      { code: 'advertisingMgt:add', name: '新增' },
      { code: 'advertisingMgt:edit', name: '编辑' },
      { code: 'advertisingMgt:del', name: '删除' },
    ],
  },
  {
    path: '/main/record/remind-msg',
    name: '消息管理',
    children: [
      { code: 'remindMsg:add', name: '新增' },
      { code: 'remindMsg:edit', name: '编辑' },
      { code: 'remindMsg:del', name: '删除' },
    ],
  },
  {
    path: '/main/system/user-list',
    name: '用户管理',
    children: [
      { code: 'userList:add', name: '新增' },
      { code: 'userList:edit', name: '编辑' },
      { code: 'userList:del', name: '删除' },
      { code: 'userList:resetPwd', name: '重置密码' },
    ],
  },
  {
    path: '/main/system/role-list',
    name: '角色管理',
    children: [
      { code: 'roleList:add', name: '新增' },
      { code: 'roleList:edit', name: '编辑' },
      { code: 'roleList:del', name: '删除' },
    ],
  },
];
