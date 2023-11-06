export const buttonsWithMenus = [
  {
    url: '/main/system/user-list',
    name: '用户管理',
    children: [
      { code: 'userList:add', name: '新增' },
      { code: 'userList:edit', name: '编辑' },
      { code: 'userList:del', name: '删除' },
      { code: 'userList:resetPwd', name: '重置密码' },
    ],
  },
  {
    url: '/main/system/role-list',
    name: '角色管理',
    children: [
      { code: 'roleList:add', name: '新增' },
      { code: 'roleList:edit', name: '编辑' },
      { code: 'roleList:del', name: '删除' },
    ],
  },
];
