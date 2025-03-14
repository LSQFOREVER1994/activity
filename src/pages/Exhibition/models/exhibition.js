import { message } from 'antd';

import {
  getResourceData, getMyOrgs, getUserList, getUserTotal, getBrachList,
  updateUser, addUser,
   getModalData, editResourceData, addResourceData, deleteResourceData,
  getCommentList, getAmountData, getRankData, getNewsData, getInformationData, getMallData,
  getDetaillData, getUserPagesList, upDataComment, getViewPanel, getSharePanel, getfavoritePanel, getUserAnalysisData,
  getRankingData, getLivenessData, getUserNameList, getPosterList, getPosterTypeList, addPosterTypeList, editPosterTypeList,
  delPosterTypeList, getPosterTypeAllList, addPoster, delPoster, editPoster,
  getInformationsList, editInformationsData, addInformationsData, deleteInformations, delBatchInformations,
  getCategoryList, editCategoryData, addCategoryData, deleteCategory,
} from '@/services/businessCard.service';

export default {
  namespace: 'exhibition',

  state: {
    loading: false,
    resourceData: {
      total: 0,
      list: []
    },
    userData: {
      total: 0,
      list: []
    },
    commentData:{
      total: 0,
      list: []
    },
    userPagesList:{
      total: 0,
      list: [],
    },
    amountData:{
      total: 0,
      list: []
    },
    rankData:{
      total: 0,
      list: []
    },
    productAnalysisData:{
      total: 0,
      list: []
    },
    panelData:{
      view:{},
      share:{},
      favorite:{}
    },
    userAnalysisData:{},
    typeUserData:{
      total: 0,
      list: []
    },
    posterData:{
      total:0,
      list:[],
    },
    posterTypeData:{
      total:0,
      list:[],
    },
    posterTypeAllList:[],
    informationsList:{},
    categoryList:{}
  },

  effects: {
    // 获取标签列表
    *getMyOrgs( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getMyOrgs, payload );
      if( success ){
        yield put( {
          type:'SetState',
          payload: { myOrgs:result }
        } )
        callFunc( result )
      }
    },
    *getBrachList( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getBrachList, payload );
      if( success ){
        callFunc( result )
      }
    },
    // 获取资源位列表
    *getResourceData( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getResourceData, payload );
      if( success ){
        yield put( {
          type: 'resourceDataList',
          payload: result,
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{ loading:false },
      } );
    },

    //  获取模板运营位
    *getModalData( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getModalData, payload );
      if( success ){
        callFunc( result )
      }
      yield put( {
        type: 'SetState',
        payload:{ loading:false },
      } );
    },

    // 编辑，添加资源位列表数据 
    *submitResourceData( { payload:{ params, callFunc } }, { call } ){
      const data = params.id ? yield call( editResourceData, params ) : yield call( addResourceData, params )
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    // 删除资源位列表
    *deleteResourceData( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( deleteResourceData, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },




    *getProductAnalysisData( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { type, ...Payload } = payload
      const serverObj = {
        news:getNewsData,
        information:getInformationData,
        // combination:getInvestCombinationData,
        // view:getInvestViewData,
        mall:getMallData
      }
      
      const { success, result } = yield call( serverObj[type], Payload );      
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { productAnalysisData: result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    *getUserAnalysisData( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getUserAnalysisData, payload );
      
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { userAnalysisData: result.visitUv },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    *getAmountData( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getAmountData, payload );
      
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { amountData: result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    *getRankData( { payload }, { call, put } ) {
      const { success, result } = yield call( getRankData, payload );
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { rankData: result },
        } );
      }
    },
    *getPanelData( { payload }, { call, put } ) {
      const { type, ...Payload } = payload;
      const serviceObj = {
        view:getViewPanel,
        share:getSharePanel,
        favorite:getfavoritePanel
      }
      const { success, result } = yield call( serviceObj[type], Payload );
      if( success ){
        yield put( {
          type: 'setPanelData',
          payload: { data: result, type },
        } );
      }

    },
    
    *getUserData( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getUserList, payload );
      
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { userData: result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    *updateUser( { payload, callFunc }, { call } ) {
      const data = yield call( updateUser, payload );
      if( data.success ){
        callFunc( data.result )
        // message( data.message )
      }
    },
    
    // *deleteUser( { payload, callFunc }, { call } ) {
    //   const { success, result } = yield call( deleteUser, payload.id );
    //   if( success ){
    //     callFunc( result )
    //   }
    // },
    
    *getUserTotal( { payload }, { call, put } ) {
      const { success, result } = yield call( getUserTotal, payload );
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { userTotalData: result },
        } );
        
      }
    
    },

    // 编辑或添加标签
    *submitUser( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updateUser, params ) : yield call( addUser, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取点评列表
    *getCommentList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getCommentList, payload );
      if( success ){
        yield put( {
          type: 'commentDataList',
          payload: result,
        } );
        callFunc()
      }
      yield put( {
        type:'SetState',
        payload: { loading:false },
      } );
    },

    // 获取点评详细信息
    *getDetaillData( { payload, callFunc }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getDetaillData, payload );

      if( success ){
        callFunc( result )
      }
      yield put( {
        type:'SetState',
        payload: { loading:false },
      } );
    },

    //  获取用户相详情列表
    *getUserPagesList( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getUserPagesList, payload );

      if( success ){
        yield put( {
          type: 'setUserPagesList',
          payload: result,
        } );
      }
      yield put( {
        type:'SetState',
        payload: { loading:false },
      } );
    },
    
    // 更新（编辑）点评文章状态
    *upDataComment( { payload: { params, callFunc } }, { call } ) {
      const data =  yield call( upDataComment, params )
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    
    //  获取员工数据列表
    *getTypeUserData( { payload }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { type, ...Payload } = payload
      const serverObj = {
        ranking:getRankingData, // 获取员工数据排名列表
        liveness:getLivenessData, // 获取员工数据活跃度列表
      }
      const { success, result } = yield call( serverObj[type], Payload );      
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { typeUserData: result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    //  获取员工名字列表 
    *getUserNameList( { payload, callFunc }, { call } ) {
      
      const data =  yield call( getUserNameList, payload )
      if ( data.success ) {
        callFunc( data.result );
        // message.success( data.message );
      }
    },
// 海报管理 TODO:加载状态未处理
    // 查找海报列表
    *getPosterList( { payload }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result, message } = yield call( getPosterList, payload );
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { posterData: result },
        } );
        message.success( message );
      }else{
        message.error( message );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    // 增加海报
    *addPoster( { payload, callFunc }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result, message } = yield call( addPoster, payload );
      if( success ){
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    // 删除海报
    *delPoster( { payload, callFunc }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result, message } = yield call( delPoster, payload );
      if( success ){
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    //  获取咨询管理列表 
    *getInformationsList( { payload }, { call, put } ) {
    yield put( {
      type:'SetState',
      payload: { loading:true },
    } );
    const { success, result } = yield call( getInformationsList, payload );
    if( success ){
      yield put( {
        type: 'SetState',
        payload: { informationsList: result },
      } );
    }
    yield put( {
      type: 'SetState',
      payload: { loading: false },
    } );
  },

    // 编辑或添加咨询管理列表
    *submitInformationsData( { payload: { params }, callFunc }, { call } ) {
      const data = params.id ? yield call( editInformationsData, params ) : yield call( addInformationsData, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    //  删除资讯管理列表
    *deleteInformations( { payload: { id }, callFunc }, { call } ) {
      const data = yield call( deleteInformations, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    //  批量删除资讯管理列表 
    *delBatchInformations( { payload: { ids, callFunc } }, { call } ) {
      const data = yield call( delBatchInformations, ids );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },


    //  获取类别列表
    *getCategoryList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result } = yield call( getCategoryList, payload );
      if( success ){
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { categoryList: result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    // 编辑海报
    *editPoster( { payload, callFunc }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );

      const { success, result, message } = yield call( editPoster, payload );
      if( success ){
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    //  编辑或者添加类别列表 
    *submitCategoryData( { payload: { params }, callFunc }, { call } ) {
      const data = params.id ? yield call( editCategoryData, params ) : yield call( addCategoryData, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    //  删除类别列表 
    *deleteCategory( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( deleteCategory, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    // 查找海报分类列表
    *getPosterTypeList( { payload }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result, message } = yield call( getPosterTypeList, payload );
      yield put( {
        type: 'SetState',
        payload: { posterTypeData: result, loading: false  },
      } );
    },
    // 查找全部海报分类
    *getPosterTypeAllList( { payload }, { call, put } ){
      const { success, result, message } = yield call( getPosterTypeAllList, payload );
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { posterTypeAllList: result },
        } );
      }
    },
    // 增加海报分类
    *addPosterType( { payload, callFunc }, { call, put } ){
      yield put( {
        type:'SetState',
        payload: { loading:true },
      } );
      const { success, result, message } = yield call( addPosterTypeList, payload );
      if( success ){
        callFunc();
        message.success( message );
      }else{
        message.error( message );
      }
   
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },
    // 修改海报分类
    *editPosterType( { payload, callFunc }, { call, put } ){
      const { success, result, message } = yield call( editPosterTypeList, payload );
      if( success ){
        callFunc();
        message.success( message );
      }else{
        message.error( message );
      }
    },
    // 删除海报分类
    *delPosterType( { payload, callFunc }, { call, put } ){
      const { success, result, message } = yield call( delPosterTypeList, payload );
      if( success ){
        callFunc();
        message.success( message );
      }else{
        message.error( message );
      }
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload
      }
    },

    setPanelData( state, { payload } ) {
      const { panelData } = state;
      panelData[payload.type] = payload.data
      const newData = JSON.parse( JSON.stringify( panelData ) )
      return {
        ...state,
        panelData: newData,
      };
    },
    resourceDataList( state, { payload } ) {
      return {
        ...state,
        resourceData: payload,
      };
    },

    commentDataList( state, { payload } ) {
      return {
        ...state,
        commentData: payload,
      };
    },
    setUserPagesList( state, { payload } ) {
      return {
        ...state,
        userPagesList: payload,
      };
    },

  }
}
