// import { message } from 'antd';
import {
  getBees, getBeesInfo, addBees, editBees, deleteBees, getPrizeTypeList, getPrizeList, getFundList, userTemplate, copyActivity,
  userComponent, addToTemplate, getComponentList, getEligibilityList, getEligibilityType, getLiveList, getExamineList, getInitFunds,
  getActivityDraft, addActivityDraft, deleteActivityDraft, editActivityDraft, getTagList, getTemplate, importActivity,
  getMerchantList, getVisibleGoodsList, getActiveStatistics, getRoleGroupList, getCollaborators, addCollaborators, deleteCollaborators,
  updateCollaborators, getCurrentCollaborsInfo, getAllActivityList, getDrawElement
} from '@/services/bees.service';
import { typeFunctionConfig } from '@/services/systemConfig.service';

import { editTemplate } from '@/services/template.service';


export default {
  namespace: 'bees',

  state: {
    loading: false,
    bees: {
      total: 0,
      list: [],
    },
    prizeTypeList: [],
    prizeList: [],
    fundsList: [],
    template: {},
    eligibilityList: [],
    eligibilityType: [],
    initFundsList: [],
    searchTagListMap: [],
    merchantList: [],
    merchantVisibleList: [],
    activeStatisticsData: {},
    loginModalVisible: false,
    roleGroupList: [],
    collaboratorList: [],
    allActivityList: [],
    drawElementList: [],
    liveData: [],
    examineList: [],
  },


  effects: {
    *setState( { payload }, { put } ) {
      yield put( {
        type: 'SetState',
        payload,
      } );
    },


    *LoginModalSwitch( { payload: { loginModalVisible } }, { put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loginModalVisible,
        }
      } )
    },

    *getBees( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getBees, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { bees: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取单个活动的信息
    *getBeesInfo( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getBeesInfo, query );
      if ( data.success ) {
        successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    //  获取全部活动列表
    *getAllActivityList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllActivityList, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { allActivityList: result },
        } );
        if ( callFunc ) {
          callFunc( result )
        }
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取活动的抽奖组件
    *getDrawElement( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getDrawElement, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { drawElementList: data.result },
        } )
        if( successFun ) {
          successFun()
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 新增活动
    *addBees( { payload: { query, successFun, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( addBees, query );
      if ( data.success ) {
        successFun( data.result )
      } else if ( failFunc ) {
        failFunc()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 编辑活动
    *editBees( { payload: { query, successFun, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( editBees, query );
      if ( data.success ) {
        successFun()
      } else if ( failFunc ) {
        failFunc()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 删除活动
    *deleteBees( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( deleteBees, query );
      if ( data.success ) {
        successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 查询奖品类型
    *getPrizeTypeList( { payload, successFun }, { call, put } ) {
      const data = yield call( getPrizeTypeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeTypeList: data.result },
        } );
        if ( successFun ) successFun( data.result );

      }
    },

    // 模糊搜索奖品
    *getPrizeList( { payload, successFun }, { call, put } ) {
      const data = yield call( getPrizeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeList: data.result.list },
        } );
        if ( successFun ) successFun( data.result.list );
      }
    },

    // 模糊搜索基金列表
    *getFundList( { payload, callFunc }, { call, put } ) {
      const data = yield call( getFundList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { fundsList: data.result.list },
        } );
        if ( callFunc ) callFunc();
      }
    },

    // 初始化基金列表
    *getInitFunds( { payload }, { call, put } ) {
      const data = yield call( getInitFunds, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { initFundsList: data.result },
        } );
      }
    },

    // 清空基金初始化列表
    *clearInitFunds( { }, { put } ) {
      yield put( {
        type: 'SetState',
        payload: { initFundsList: [] },
      } );
    },

    // 使用活动模版
    *userTemplate( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( userTemplate, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { template: data.result },
        } );
        if ( successFun ) {
          successFun( data.result )
        }
      }
    },

    // 查询模版信息
    *getTemplate( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getTemplate, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { template: data.result },
        } );
        if ( successFun ) {
          successFun( data.result )
        }
      }
    },

    *editTemplate( { payload, callFunc }, { call } ) {
      const data = yield call( editTemplate, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result )
        }
      }
    },

    // 复制活动
    *copyActivity( { payload: { query, successFun } }, { call } ) {
      const data = yield call( copyActivity, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result )
        }
      }
    },

    // 使用组件模版
    *userComponent( { payload: { query, successFun } }, { call } ) {
      const data = yield call( userComponent, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result )
        }
      }
    },

    // 添加至模版库
    *addToTemplate( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        }
      } )
      const data = yield call( addToTemplate, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        }
      } )
    },
    // 获取组件列表
    *getComponentList( { payload }, { call, put } ) {
      const data = yield call( getComponentList, payload );
      if ( data.success ) {
        let list = []
        if ( data.result && data.result.length > 0 ) {
          const obj = {};
          data.result.forEach( ( item ) => {
            const { groupType } = item;
            if ( !obj[groupType] ) {
              obj[groupType] = {
                groupType,
                list: [],
              };
            }
            obj[groupType].list.push( item );
          } );
          list = Object.values( obj );
        }
        yield put( {
          type: 'SetState',
          payload: { componentList: list },
        } );
      }
    },

    // 获取资格列表
    *getEligibilityList( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        }
      } )
      const data = yield call( getEligibilityList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { eligibilityList: data.result },
        } );
        if ( successFun ) {
          successFun( data.result )
        }
      } else {
        yield put( {
          type: 'SetState',
          payload: { eligibilityList: [] },
        } );
        if ( successFun ) {
          successFun( [] )
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        }
      } )
    },

    // 获取资格类型
    *getEligibilityType( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getEligibilityType, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { eligibilityType: data.result },
        } );
        successFun( data.success )
      }
    },

    // 获取直播列表
    *getLiveList( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getLiveList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { liveData: data?.result?.webinarList || [] },
        } );
        successFun( data.success )
      }
    },

    // 获取审核人员列表
    *getExamineList( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getExamineList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { examineList: data?.result || [] },
        } );
        successFun( data.success )
      }
    },
    

    // // 选择期数
    // *selectPeriodsDate( { payload: { query, successFun }  }, { call } ) {
    //   const data = yield call( selectPeriodsDate, query );
    //   if ( data.success && successFun ) {
    //     successFun( data.message )
    //   }
    // },

    // 查询未来版本
    *getActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( getActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data )
      }
    },

    // 新增未来版本
    *addActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( addActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data )
      }
    },

    // 删除未来版本
    *deleteActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( deleteActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data )
      }
    },

    // 编辑未来版本
    *editActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( editActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data )
      }
    },

    // 搜索标签列表
    *SearchTagList( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getTagList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { searchTagListMap: data.result.list },
        } );
        if ( callFunc ) callFunc()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 导入活动
    *importActivity( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( importActivity, query );
      if ( data && data.success ) {
        successFun( data )
      } else {
        successFun( false )
      }
    },

    /** 活动对接权益中心 */


    // 获取商户可见列表
    *getVisibleGoodsList( { payload, successFun, failFunc }, { call, put } ) {
      const data = yield call( getVisibleGoodsList, payload );
      if ( data?.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantVisibleList: data.result.list },
        } );
        if ( successFun ) successFun( data.result.list, data.result );
      } else if ( failFunc ) failFunc()
    },

    // 获取商户列表
    *getMerchantList( { payload, successFun }, { call, put } ) {
      const data = yield call( getMerchantList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantList: data.result },
        } );
        if ( successFun ) successFun( data.result );
      }
    },

    // 获取活动状态数据
    *getActiveStatistics( { payload }, { call, put } ) {
      const data = yield call( getActiveStatistics, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { activeStatisticsData: data.result },
        } );
      }
    },

    // 获取权限对应角色列表
    *getRoleGroupList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getRoleGroupList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { roleGroupList: data.result },
        } );
        if ( callBackFunc ) callBackFunc( data.result );
      }
    },

    // 获取活动协作者列表
    *getCollaborators( { payload, successFun }, { call, put } ) {
      const data = yield call( getCollaborators, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { collaboratorList: data.result },
        } );
        if ( successFun ) successFun( data.result );
      }
    },
    // 获取当前活动协作者信息
    *getCurrentCollaborsInfo( { payload, successFun }, { call, put } ) {
      const data = yield call( getCurrentCollaborsInfo, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result || data );
      }
    },
    // 添加活动协作者
    *addCollaborators( { payload, successFun }, { call, put } ) {
      const data = yield call( addCollaborators, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result );
      }
    },
    // 删除活动协作者
    *deleteCollaborators( { payload, successFun }, { call, put } ) {
      const data = yield call( deleteCollaborators, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result );
      }
    },
    // 修改活动协作者
    *updateCollaborators( { payload, successFun }, { call, put } ) {
      const data = yield call( updateCollaborators, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result );
      }
    },

    *typeFunctionConfig( { payload: { body, callback } }, { call } ) {
      const data = yield call( typeFunctionConfig, body );
      if ( data.success ) {
        callback( data.result );
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
  },
};
