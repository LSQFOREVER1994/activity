/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2019-08-14 18:42:45
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { cropService, pointsService } = serviceObj;
// 获取轮播图
export async function getBannerTags() {
  return request( `${cropService}/banners/tags/v2`, {
    method: 'GET',
  } );
}

export async function getBanners( obj ) {
  return request( `${pointsService}/banner/page`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 POST /banners
export async function addBanners( obj ) {
  return request( `${pointsService}/banner/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改 PUT /banners/{id}
export async function exitBanners( obj ) {
  return request( `${pointsService}/banner/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 删除 DELETE /banners/{id}
export async function delBanners( id ) {
  return request( `${pointsService}/banner/delete/${id}`, {
    method: 'POST',
    body: { id },
  }, 'JSON' );
}

// 获取预警商品列表
export async function getWarnGoodsSpu( obj ) {
  return request( `${pointsService}/goodsSpu/page`, {
      method: 'GET',
      body: obj
  } )
}

// 获取商品分类(分页)
export async function getGoodsCategoryList( obj ) {
    return request( `${pointsService}/category/page`, {
        method: 'GET',
        body: obj
    } )
}

// 新建商品分类
export async function addGoodsCategory( obj ) {
    return request( `${pointsService}/category/add`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}

// 编辑商品分类
export async function editGoodsCategory( obj ) {
    return request( `${pointsService}/category/update`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}


// 删除商品分类
export async function deleteGoodsCategory( obj ) {
    return request( `${pointsService}/category/delete/${obj.id}`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}

// 获取商品分类(列表)
export async function getGoodsCode( obj ) {
  return request( `${pointsService}/category/list`, {
      method: 'GET',
      body: obj
  } )
}

// 获取商品列表
export async function getGoodsSpu( obj ) {
  return request( `${pointsService}/goodsSpu/page`, {
      method: 'GET',
      body: obj
  } )
}
// 商品上下架操作
export async function changeShelf( obj ) {
  return request( `${pointsService}/goodsSpu/shelf`, {
      method: 'POST',
      body: obj
  } )
}
// 通过id删除spu商品
export async function delShelf( obj ) {
  return request( `${pointsService}/goodsSpu/delete/${obj.id}`, {
      method: 'POST',
      body: obj
  } )
}
// 新增spu商品
export async function addGood( obj ) {
  return request( `${pointsService}/goodsSpu/add`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}
// 更新spu商品
export async function updateGood( obj ) {
  return request( `${pointsService}/goodsSpu/update`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}

// 权益列表
export async function getRightList( obj ) {
    return request( `${pointsService}/right/page`, {
        method: 'GET',
        body: obj
    } )
}

 // 获取会员等级类型
 export async function getUserLevel( obj ) {
    return request( `${pointsService}/goodsSpu/user/level`, {
        method: 'GET',
        body: obj
    } )
}



// 获取所有账户
export async function getIntegralAccountList( obj ) {
  return request( `${pointsService}/integral/account/list`, {
      method: 'GET',
      body: obj
  } )
}

// 获取资格列表
export async function getEligibilityList( obj ) {
  return request( `${pointsService}/task/eligibility`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取资格类型
export async function getEligibilityType( obj ) {
  return request( `${pointsService}/task/eligibility/type`, {
    method: 'GET',
    body: obj,
  } );
}


// 删除任务
export async function delTask( obj ) {
  return request( `${pointsService}/task/delete/${obj.id} `, {
      method: 'POST',
      body: obj
  } )
}

// 获取任务列表
export async function getTaskList( obj ) {
  return request( `${pointsService}/task/page`, {
      method: 'GET',
      body: obj
  } )
}

// 修改任务状态
export async function updateTaskState( obj ) {
  return request( `${pointsService}/task/show`, {
      method: 'POST',
      body: obj
  } )
}

// 通过id查询商城订单
export async function getOrderInfo( obj ) {
  return request( `${pointsService}/orderInfo/${obj.id}`, {
      method: 'GET',
      body: obj
  } )
}

// 获取商品列表
export async function getOrderInfoList( obj ) {
  return request( `${pointsService}/orderInfo/page`, {
      method: 'GET',
      body: obj
  } )
}

// 获取快递公司
export async function getLogistics( obj ) {
  return request( `${pointsService}/orderLogistics/dict/${obj.type}`, {
      method: 'GET',
      body: obj
  } )
}

// 发货提交
export async function getDelivery( obj ) {
  return request( `${pointsService}/orderInfo/delivery`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}

// 新建任务
export async function createTask( obj ) {
  return request( `${pointsService}/task/add`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}

// 修改任务
export async function updateTask( obj ) {
  return request( `${pointsService}/task/update`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}

// 退货
export async function refuseGoods( obj ) {
  return request( `${pointsService}/orderReturn/return`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}
