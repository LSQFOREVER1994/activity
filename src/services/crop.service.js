
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { cropService } = serviceObj;

// 获取所有标签列表
export async function getTagsListAll( obj ) {
    return request( `${cropService}/tags`, {
        method: 'GET',
        body: obj
    } )
}
// 编辑标签
export async function updateTags( obj ) {
    const { id } = obj;
    return request( `${cropService}/tags/${id}`, {
        method: 'PUT',
        body: obj
    }, 'JSON' )
}
// 添加标签
export async function addTags( obj ) {
    return request( `${cropService}/tags`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}

// 删除标签
export async function delTags( id ) {
    return request( `${cropService}/tags/${id}`, {
        method: 'DELETE',
        body: { id }
    } )
}



// 获取文章所有列表
export async function getArticleListAll( obj ) {
    return request( `${cropService}/articles/all`, {
        method: 'GET',
        body: obj
    } )
}
// 分页获取活动资源
export async function getActivityResource( obj ) {
    return request( `${cropService}/activityResource`, {
        method: 'GET',
        body: obj
    } )
}
// 获取活动资源类型列表
export async function getActivityResourceType( obj ) {
    return request( `${cropService}/activityResourceType`, {
        method: 'GET',
        body: obj
    } )
}
// 编辑文章
export async function upDataArticle( obj ) {
    const { id } = obj;
    return request( `${cropService}/articles/${id}`, {
        method: 'PUT',
        body: obj
    }, 'JSON' )
}
// 添加文章
export async function addDataArticel( obj ) {
    return request( `${cropService}/articles`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}
// 获取文章
export async function getArticel( obj ) {
    const { id } = obj;
    return request( `${cropService}/articles/${id}`, {
        method: 'GET',
        body: obj
    }, 'JSON' )
}
// 删除文章
export async function delArticle( id ) {
    return request( `${cropService}/articles/${id}`, {
        method: 'DELETE',
        body: { id }
    } )
}
// 禁用文章
export async function disableArticle( id ) {
    return request( `${cropService}/articles/${id}/enable`, {
        method: 'PUT',
        body: { id }
    } )
}
// 启用文章
export async function enableArticle( id ) {
    return request( `${cropService}/articles/${id}/disable`, {
        method: 'PUT',
        body: { id }
    } )
}
