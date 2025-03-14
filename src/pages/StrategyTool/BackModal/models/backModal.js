import { message } from 'antd';
import {
  getModalList, getGroups, getModalDetail, addModal, delModal
} from '@/services/loopbackService.service';

export default {
  namespace: 'backModal',

  state: {
    loading: false,
    modals: [],
    groups: [],
    modalDetail: {}
  },

  effects: {
    *getModalList( { payload }, { call, put } ) {

      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getModalList, payload );
      if ( success ) {
        yield put( {
          type: 'setModals',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *submitModal( { payload: { params, callFunc } }, { call } ) {
      const data = yield call( addModal, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    *getGroups( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGroups, payload );
      if ( success ) {
        yield put( {
          type: 'setGroups',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *getModalDetail( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getModalDetail, params );
      if ( success ) {
        callFunc();
        yield put( {
          type: 'setModalDetail',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *delModal( { payload: { params, callFunc } }, { call } ) {
      const data = yield call( delModal, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      };
    }
  },

  reducers: {
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setModals( state, { payload } ) {
      return {
        ...state,
        modals: payload,
      };
    },
    setGroups( state, { payload } ) {
      return {
        ...state,
        groups: payload,
      };
    },
    setModalDetail( state, { payload } ) {
      return {
        ...state,
        modalDetail: payload,
      };
    },
  },
};
