import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { userService } = serviceObj;
// 登录
export async function loginFUNC( obj ) {
  return request( `${userService}/userManager/managerLogin`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 单点登录
export async function getSsoLogin( obj ) {
  return request( `${userService}/userManager/ssoLogin`, {
    method: 'POST',
    body: obj,
  } );
}

// 退出
export async function logoutFunc() {
  return request( `${userService}/users/logout`, {
    method: 'POST',
    body: {},
  }, 'JSON' );
}

// 修改当前有效企业
export async function changeOrgFunc( org ) {
  return request( `${userService}/users/org`, {
    method: 'POST',
    body: { org },
  } );
}

// 获取菜单树
export async function fetchMenuList() {
  return request( `${userService}/menu/user`, {
    method: 'POST',
    body: {},
  }, 'JSON' );
}

// 未登陆修改密码
export async function modifyPassword( obj ) {
  return request( `${userService}/userManager/updatePassword`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
