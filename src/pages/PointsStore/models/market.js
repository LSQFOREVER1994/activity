import { message } from 'antd';
import {
    getBannerTags, getBanners, addBanners,
    exitBanners, delBanners
} from '@/services/pointsStore.service';

export default {
    namespace: 'market',
    state: {
        loading: false,
        bannerTags: [],
        messageTypes: [],
        banners: {
          total: 0,
          list: [],
        },
    },

    effects: {
        // 轮播图标签列表(运营位)
    *getBannerTags( _, { call, put } ) {
        yield put( {
          type: 'setLoading',
          payload: true,
        } );

        const { success, result } = yield call( getBannerTags );
        if ( success ) {
          yield put( {
            type: 'setBannerTags',
            payload: result,
          } );
        }

        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      },
      // 轮播图标签列表
      *getBanners( { payload }, { call, put } ) {
        yield put( {
          type: 'setLoading',
          payload: true,
        } );

        const { success, result } = yield call( getBanners, payload );
        if ( success ) {
          yield put( {
            type: 'setBanners',
            payload: result,
          } );
        }

        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      },
      *submitBanners( { payload: { params, callFunc } }, { call } ) {
        const data = params.id ? yield call( exitBanners, params ) : yield call( addBanners, params );
        if ( data.success ) {
          callFunc();
          message.success( data.message );
        } else {
          // message.error( data.message );
        }
      },
      *delBanners( { payload: { id, callFunc } }, { call } ) {
        const data = yield call( delBanners, id );
        if ( data.success ) {
          callFunc();
          message.success( data.message );
        } else {
          message.error( data.message );
        }
      },
    },

    reducers: {
        SetState( state, { payload } ){
          return {
            ...state,
            ...payload
          }
        },
        setLoading( state, { payload } ) {
          return {
            ...state,
            loading: payload,
          };
        },
        setBannerTags( state, { payload } ) {
          return {
            ...state,
            bannerTags: payload,
          };
        },
        setMessageTypes( state, { payload } ) {
          return {
            ...state,
            messageTypes: payload,
          };
        },
        setBanners( state, { payload } ) {
          return {
            ...state,
            banners: payload,
          };
        },
    }
}
