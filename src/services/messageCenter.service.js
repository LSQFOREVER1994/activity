import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { userService } = serviceObj;

// 获取消息列表
export async function getMessageList( obj ) {
	return request( `${userService}/admin/message`, {
		method: 'GET',
		body: obj
	} )
}

// 消息全部已读
export async function getAllRead( obj ) {
	return request( `${userService}/admin/message/allRead`, {
		method: 'POST',
		body:obj
	} )
}

// 未读消息数量
export async function getUnreadCount( obj ) {
	return request( `${userService}/admin/message/unreadCount`, {
		method: 'POST',
		body: obj
	} )
}

// 标记消息已读 

export async function markRead( obj ) {
	return request( `${userService}/admin/message/read`, {
		method: 'POST',
		body: obj
	} )
}

// 获取新消息提示列表
export async function getMessageModalList() {
	return request( `${userService}/admin/message/newMessage`, {
		method: 'POST',
		body: {}
	}, 'JSON' )
}

