import request, { request2 } from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { userService, openService, libraryService, userUploadService } = serviceObj;

// GET /users/shortInfo
export async function getUsersInfo( ids ) {
  return request( `${userService}/users/shortInfo`, {
    method: 'GET',
    body: { ids },
  } );
}
// 修改密码
export async function editPassword( obj ) {
  return request( `${userService}/users/password`, {
    method: 'PUT',
    body: obj,
  } );
}


export async function getRoleList( obj ) {
  return request( `${userService}/roleGroup/page`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

export async function getUserList( obj ) {
  return request( `${userService}/users/user/get/new`, {
     method: 'POST',
     body: obj,
  }, 'JSON' );
}

// 创建用户
export async function createList( obj ) {
  return request( `${userService}/users/add`, {
    // return request( `${userService}/userManager/registe`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改密码
export async function resetPassword( obj ) {
  return request( `${userService}/users/admin`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 修改用户
export async function updateList( obj ) {
  const { id, tags } = obj;
  return request( `${userService}/users/update`, {
    method: 'PUT',
    body: { id, tags },
  }, 'JSON' );
}

export async function updateUserStatus( obj ){
  // 修改用户信息冻结解冻
  return request( `${userService}/users/status`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}


// 编辑角色权限管理列表
export async function updateRoleList( obj ) {
  return request( `${userService}/roleGroup/update`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 添加角色权限管理聊表
export async function createRoleList( obj ) {
  return request( `${userService}/roleGroup/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

export async function deleteRoleList( obj ) {
  return request( `${userService}/roleGroup/delete`, {
    method: 'DELETE',
    body: obj,
  } );
}

// 权限列表
export async function getPurviewList( obj ) {
  return request( `${userService}/authorization/permissions/new`, {
    method: 'GET',
    body: obj,
  } );
}

// 编辑权限
export async function upPurviewList( obj ) {
  return request( `${userService}/authorization/permissions`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 添加权限
export async function createPurviewList( obj ) {
  return request( `${userService}/authorization/permissions`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  操作记录
export async function getRecordList( obj ) {
  return request( `${userService}/records`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取平台对接列表
export async function getPlatformListAll( obj ) {
  return request( `${openService}/merchants`, {
    method: 'GET',
    body: obj,
} );
}

// 添加平台
export async function addPlatform( obj ) {
  return request( `${openService}/merchants`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 编辑平台
export async function updatePlatform( obj ) {
  return request( `${openService}/merchants`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除平台
export async function delpPlatform( id ) {
  return request( `${openService}/merchants/${id}`, {
    method: 'DELETE',
    body:{ id },
  } );
}

//  获取对接功能列表
export async function getDockingList( obj ) {
  return request( `${openService}/merchants/spu`, {
    method: 'GET',
    body: obj,
  } );
}
// 添加对接功能
export async function addDocking( obj ) {
  return request( `${openService}/merchants/spu`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
//  编辑对接功能
export async function updateDocking( obj ) {
  return request( `${openService}/merchants/spu`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 删除对接功能
export async function delpDocking( id ) {
  return request( `${openService}/merchants/spu/${id}`, {
    method: 'DELETE',
    body:{ id },
  } );
}


//  获取标签列表
export async function getTagList( obj ) {
  return request( `${userService}/users/tag-group`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  添加标签
export async function postTagList( obj ) {
  return request( `${userService}/users/tag-group/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}


//  编辑标签
export async function putTagList( obj ) {
  return request( `${userService}/users/tag-group/update`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  删除标签
export async function delTagList( obj ) {
  return request( `${userService}/users/tag-group/delete`, {
    method: 'DELETE',
    body:obj
  } );
}

//  用户贴标签
export async function stickTag( obj ) {
  return request( `${userService}/users/tag-user/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  获取角色树
export async function getMenuTree( obj ) {
  return request( `${userService}/roleGroup/getMenuTree`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取权限组列表
export async function getPermissionList( obj ) {
  return request( `${userService}/permissionGroup`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取权限组详情
export async function getPermissionDetail( obj ) {
  return request( `${userService}/permissionGroup/${obj.code}`, {
    method: 'GET',
    // body: obj,
  } );
}


// 编辑权限组
export async function getEditPermission( obj ) {
  return request( `${userService}/permissionGroup`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

export async function getExportList( data ){
  return request( `${libraryService}/export/list`, {
    method: 'GET',
    body: data,
  } );
}

export async function deleteExportListItem( obj ) {
  return request( `${libraryService}/export/delete`, {
    method: 'PUT',
    body: obj,
  } );
}

export async function cancelExportListItem( obj ) {
  return request( `${libraryService}/export/cancel`, {
    method: 'PUT',
    body: obj,
  } );
}

export async function retryExportListItem( obj ) {
  return request( `${libraryService}/export/retry`, {
    method: 'PUT',
    body: obj,
  } );
}

export async function getMenuTreeObject( obj ){
  return request( `${userService}/menu/tree`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

export async function getMenuTreeNodeDetail( obj ){
  return request( `${userService}/menu/detail`, {
    method: 'GET',
    body:obj
  } );
}

export async function deleteMenuTreeNode( obj ){
  return request( `${userService}/menu/delete`, {
    method: 'POST',
    body:obj
  } );
}

export async function updateMenuTreeNode( obj ){
  return request( `${userService}/menu/update`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

export async function addMenuTreeNode( obj ){
  return request( `${userService}/menu/add`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

export async function getMenuTreeNodeMission( obj ){
  return request( `${userService}/menu/permission`, {
    method: 'GET',
    body: obj,
  } );
}

export async function setPermission( obj ){
  return request( `${userService}/menu/setPermission`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

// 管理员列表
export async function getManagerUserList( obj ){
  return request( `${userService}/userManager/managerUserList`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

// 创建管理员
export async function getAddManager( obj ){
  return request( `${userService}/userManager/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 管理员列表
export async function getEditManager( obj ){
  return request( `${userService}/userManager/update`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}


// 重置管理员密码
export async function resetManagerPassword( obj ){
  return request( `${userService}/userManager/resetPassword`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 获取组织架构树木
export async function getDepartmentTree( obj ){
  return request( `${userService}/department/tree`, {
    method: 'POST',
    body: obj,
  } );
}

// 单点登录
export async function ssoLogin( obj ){
  return request( `${userService}userManager/ssoLogin`, {
    method: 'POST',
    body: obj,
  } );
}

// 用户列表导入
 export async function importUserList( obj ){
   return request2( `${userUploadService}/users/import`, {
     method: 'POST',
     body: obj.file,
   }, 'JSON' );
 }