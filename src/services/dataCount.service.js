/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { equityCenterService } = serviceObj;

// 获取库存与消耗
export async function getConsumeData(obj) {
    return request(`${equityCenterService}/statistics/consume/balance`, {
        method: 'GET',
        body: obj,
    });
}

// 商品类型消耗排行
export async function getRightConsumeRank(obj) {
    return request(`${equityCenterService}/statistics/consume/rank`, {
        method: 'GET',
        body: obj,
    });
}

// 消耗趋势
export async function getRightTrend(obj) {
    return request(`${equityCenterService}/statistics/consume/trend`, {
        method: 'GET',
        body: obj,
    });
}

// 消耗明细
export async function getConsumeDetail(obj) {
    return request(`${equityCenterService}/statistics/consume/detail`, {
        method: 'GET',
        body: obj
    })
}

// 消耗类型排名
export async function getTypeRank(obj) {
    return request(`${equityCenterService}/statistics/consume/type`, {
        method: 'GET',
        body: obj
    })
}


//获取商户名称列表
export async function getMerchantNames(obj) {
    return request(`${equityCenterService}/merchant/all`, {
        method: 'GET',
        body: obj
    })
}
//获取商户名称列表
export async function exportDetail(obj) {
    return request(`${equityCenterService}/statistics/consume/detail/export`, {
        method: 'GET',
        body: obj
    })
}
