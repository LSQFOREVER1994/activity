/*
 * @Author       : ZQ
 * @Date         : 2023-11-28 14:03:31
 * @LastEditors  : ZQ
 * @LastEditTime : 2023-11-28 14:05:03
 */
// 系统管理菜单
const systemMenu = {
  name: 'system',
  icon: 'robot',
  path: '/system',
  authority: [
    'USER_LIST_GET',
    'ROLE_LIST_GET',
    'PERMISSION_LIST_GET',
    'OPERATION_RECORD_GET',
    'DEVELOPMENT_CONFIGURATION_GET',
  ],
  routes: [
    // 系统管理 -> 用户列表
    {
      path: '/system/userList',
      name: 'userList',
      component: './System/UserList',
      authority: ['USER_LIST_GET'],
    },
    {
      path: '/system/adminList',
      name: 'adminList',
      component: './System/AdminList',
      // authority: ['ADMIN_LIST_GET'],
    },
    // 系统管理 -> 角色列表
    {
      path: '/system/roleList',
      name: 'roleList',
      component: './System/RoleList',
      authority: ['ROLE_LIST_GET'],
    },
    // 系统管理 -> 权限列表
    // {
    //   path: '/system/purviewList',
    //   name: 'purviewList',
    //   component: './System/PurviewList',
    //   authority: ['PERMISSION_LIST_GET'],
    // },
    // 系统管理 -> 权限配置
    // {
    //   path: '/system/permissionList',
    //   name: 'permissionList',
    //   component: './System/PermissionConfig/PermissionList',
    //   authority: [
    //     'PERMISSION_GROUP_GET',
    //     'PERMISSION_GROUP_POST',
    //     'PERMISSION_GROUP_PUT',
    //     'PERMISSION_GROUP_DELETE',
    //   ],
    // },

    // 系统管理 -> 菜单权限配置
    {
      path: '/system/menuPermission',
      name: 'menuPermission',
      component: './System/MenuPermission/MenuPermission',
      authority: [
        'PERMISSION_GROUP_GET',
        'PERMISSION_GROUP_POST',
        'PERMISSION_GROUP_PUT',
        'PERMISSION_GROUP_DELETE',
      ],
    },

    // 系统管理 -> 操作记录
    {
      path: '/system/recordList',
      name: 'recordList',
      component: './System/Settings/RecordList',
      authority: ['OPERATION_RECORD_GET'],
    },
    // 系统管理 -> 导出记录
    {
      path: '/system/exportList',
      name: 'exportList',
      hideInMenu: true,
      component: './System/ExportList',
      authority: ['OPERATION_RECORD_GET'],
    },
    // 系统管理 -> 开发配置
    {
      path: '/system/develop',
      name: 'develop',
      component: './System/Settings/Develop',
      authority: ['DEVELOPMENT_CONFIGURATION_GET'],
    },
  ],
};

export default systemMenu;
