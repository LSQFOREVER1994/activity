import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService } = serviceObj;

// 任务完成明细
export async function getTaskRecord( obj ) {
    return request( `${activityService}/task/record/page`, {
        method: 'GET',
        body: obj,
    } );
}

// 导出参与次数
export async function exportTaskRecord( obj ) {
    return request( `${activityService}/task/record/export`, {
        method: 'GET',
        body: obj,
    } );
}

// 获取图表数据
export function getTaskData( obj ) {
    return request( `${activityService}/task/record/statisticsData`, {
      method: 'GET',
      body: obj
    } )
  }
