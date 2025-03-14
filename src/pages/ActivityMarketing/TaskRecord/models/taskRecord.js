import { getTaskRecord, getTaskData } from '@/services/taskRecord.service';

export default {
    namespace: 'taskRecord',
    state: {
        loading: false,
        result: [],
        lineData: []
    },
    effects: {
        // 任务完成明细
        *getTaskRecord( { payload }, { call, put } ) {
            yield put( {
                type: 'SetState',
                payload: {
                    loading: true
                },
            } );
            const data = yield call( getTaskRecord, payload );
            if ( data.success ) {
                yield put( {
                    type: 'SetState',
                    payload: { result: data.result },
                } );
            }
            yield put( {
                type: 'SetState',
                payload: {
                    loading: false
                },
            } );
        },

        // 图表数据
        *getLineData( { payload, callFunc }, { call, put } ) {
            yield put( {
              type: 'SetState',
              payload: {
                loading: true
              },
            } );
            const data = yield call( getTaskData, payload );
            if ( data.success ) {
              yield put( {
                type: 'SetState',
                payload: { lineData: data.result },
              } );
            };
            callFunc();
            yield put( {
              type: 'SetState',
              payload: {
                loading: false
              },
            } );
          },
    },

    reducers: {
        SetState( state, { payload } ) {
            return {
                ...state,
                ...payload
            }
        },
    },
};
