// import { message } from 'antd';
import { getComponentList } from '@/services/component.service';

export default {
  namespace: 'component',

  state: {
    loading: false,
    componentList: [],
  },


  effects: {
    // 获取组件列表
    *getComponentList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getComponentList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { componentList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    }
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
