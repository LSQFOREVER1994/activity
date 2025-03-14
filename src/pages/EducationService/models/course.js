import { message } from 'antd';

import {
  getAllCourseList, addCourse, updateCourse, delCourse,
  getChapterList, addChapter, updateChapter, delChapter,
  getAllTagsList, addTags, updateTags, delTags,
  getSubjectList, addSubject, updateSubject, delSubject, getSubjectDetail, getAllSubjects, delBatchSubject, importSubject,
  getTestPaperList, addTestPaper, updateTestPaper, delTestPaper, getTestPaperDetail,
  getPlateList, addPlate, updatePlate, delPlate, getPlateDetail,
  getPostList, getReplyList, addPost, addReply, updatePost, delPost,
  getUserBySearch, getAllUser, getCourseList, getSearchTopicList, getTopicDetail
} from '@/services/course.service';

import { getActivityList } from '@/services/tool.service';

export default {
  namespace: 'course',

  state: {
    loading: false,
    courseListResult:[],
    chapterListResult: {
      total: 0,
      list: []
    },
    tagsListResult: {
      total: 0,
      list: []
    },
    subjectListResult: {
      total: 0,
      list: []
    },
    testPaperListResult: {
      total: 0,
      list: []
    },
    allSubjectsResult: [],
    plateListResult : {
      total: 0,
      list: []
    },
    postListResult : {
      total: 0,
      list: []
    },
    userListResult : {
      total: 0,
      list: []
    },
    allUserListResult : {},
    replyPostListResult : {
      total: 0,
      list: []
    },
    courseTabList:[],
    signActivityList:[]
  },

  effects: {
     // 课程标签
    *getCourseTabs( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getAllTagsList, payload );
      if ( success ) {
        yield put( {
          type: 'setState',
          // payload: { courseTabList: [{ name: '无', id: 'all' }].concat(result.list)},
          payload: { courseTabList: result.list },
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 搜索帖子
    *topicSearch( { payload, callFunc }, { call } ) {
      const { success, result } = yield call( getSearchTopicList, payload );
      if ( success ) {
        callFunc( result.list )
      }
    },
    // 获取帖子详情
    *getTopicDetail( { payload, callFunc }, { call } ) {
      const { success, result } = yield call( getTopicDetail, payload );
      if ( success ) {
        callFunc( result )
      }
    },
    
    // 章节获取试卷列表
    *chapterTestPaperList( { payload, callFunc }, { call } ) {
      const { success, result } = yield call( getTestPaperList, payload );
      if ( success ) {
        callFunc( result.list )
      }
    },
    
    // 获取打卡活动列表
    *getSignActivity( { payload }, { call, put } ) {
      const { success, result } = yield call( getActivityList, payload );
      if( success ){
        yield put( {
          type: 'setState',
          payload: { signActivityList: result.list },
        } );
      }
    },
    // 获取所有课程列表
    *getAllCourseList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getAllCourseList, { ...params, tagId: params.tagId === 'all' ? '' : params.tagId } );
      if ( success ) {
        yield put( {
          type: 'setCourseList',
          payload: { list: result },
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 课程列表
    *getCourseList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getCourseList, { ...params, tagId: params.tagId === 'all' ? '' : params.tagId } );
      if ( success ) {
        yield put( {
          type: 'setCourseList',
          payload: result,
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交课程
    *submitCourse( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updateCourse, params ) : yield call( addCourse, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 删除课程
    *delCourse( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delCourse, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 章节列表
    *getChapterList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getChapterList, payload );
      if ( success ) {
        yield put( {
          type: 'setChapterList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交章节
    *submitChapter( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updateChapter, params ) : yield call( addChapter, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 删除章节
    *delChapter( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delChapter, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 标签列表
    *getTagsList( { payload: { params } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getAllTagsList, params );
      if ( success ) {
        yield put( {
          type: 'setTagsList',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交标签
    *submitTags( { payload: { params, isUpdate }, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = isUpdate ? yield call( updateTags, params ) : yield call( addTags, params );
      if ( data.success ) {
        message.success( data.message );
        callFunc();
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 删除课程
    *delTags( { payload: { id, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( delTags, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 题目列表
    *getSubjectList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getSubjectList, payload );
      if ( success ) {
        yield put( {
          type: 'setSubjectList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交题目
    *submitSubject( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updateSubject, params ) : yield call( addSubject, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    //  导入题目
    *importSubject( { payload: { importList, callFunc } }, { call } ) {
      const data = yield call( importSubject, importList )
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 删除课程
    *delSubject( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delSubject, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取课程详情
    *getSubjectDetail( { payload: { id, callFunc } }, { call } ) {
      const { success, result } = yield call( getSubjectDetail, id );
      if ( success ) {
        result.choice = JSON.parse( result.choice );
        callFunc( result );
      }
    },

    // 试卷列表
    *getTestPaperList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getTestPaperList, payload );
      if ( success ) {
        yield put( {
          type: 'setTestPaperList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交试卷
    *submitTestPaper( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updateTestPaper, params ) : yield call( addTestPaper, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取试卷详情
    *getTestPaperDetail( { payload: { id, callFunc } }, { call } ) {
      const { success, result } = yield call( getTestPaperDetail, id );
      if ( success ) {
        if ( result.bgColor ) {
          result.bgColor = result.bgColor.replace( '#', '' );
        }
        if ( result.themeColor ) {
          result.themeColor = result.themeColor.replace( '#', '' );
        }
        callFunc( result );
      }
    },

    // 删除试卷
    *delTestPaper( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delTestPaper, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 所有题目
    *getAllSubjects( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllSubjects, payload );
      if ( success ) {
        yield put( {
          type: 'setAllSubjects',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 批量删除题目
    *delBatchSubject( { payload: { ids, callFunc } }, { call } ) {
      const data = yield call( delBatchSubject, ids );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 板块列表
    *getPlateList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getPlateList, params );
      if ( success ) {
        yield put( {
          type: 'setPlateList',
          payload: result,
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交板块
    *submitPlate( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updatePlate, params ) : yield call( addPlate, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 删除板块
    *delPlate( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delPlate, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取板块详情
    *getPlateDetail( { payload: { id, callFunc } }, { call } ) {
      const { success, result } = yield call( getPlateDetail, id );
      if ( success ) {
        callFunc( result );
      }
    },

    // 帖子列表
    *getPostList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getPostList, params );
      if ( success ) {
        yield put( {
          type: 'setPostList',
          payload: result,
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交帖子
    *submitPost( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updatePost, params ) : yield call( addPost, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 删除帖子
    *delPost( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delPost, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 搜索用户列表
    *getUserBySearch( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getUserBySearch, payload );
      if ( success ) {
        yield put( {
          type: 'setUserList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 用户列表
    *getAllUser( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getAllUser, params );
      if ( success ) {
        yield put( {
          type: 'setAllUserList',
          payload: result,
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 回复帖子列表
    *getReplyList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getReplyList, params );
      if ( success ) {
        yield put( {
          type: 'setReplyPostList',
          payload: result,
        } );
        callFunc();
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 提交帖子
    *submitReplyPost( { payload: { params, isUpdate, callFunc } }, { call } ) {
      const data = isUpdate ? yield call( updatePost, params ) : yield call( addReply, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

  },

  reducers: {
    setState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
    setCourseList( state, { payload } ) {
      return {
        ...state,
        courseListResult: payload,
      };
    },
    setPlateList( state, { payload } ) {
      return {
        ...state,
        plateListResult: payload,
      };
    },
    setPostList( state, { payload } ) {
      return {
        ...state,
        postListResult: payload,
      };
    },
    setReplyPostList( state, { payload } ) {
      return {
        ...state,
        replyPostListResult: payload,
      };
    },
    setUserList( state, { payload } ) {
      return {
        ...state,
        userListResult: payload,
      };
    },
    setAllUserList( state, { payload } ) {
      return {
        ...state,
        allUserListResult: payload,
      };
    },
    setChapterList( state, { payload } ) {
      return {
        ...state,
        chapterListResult: payload,
      };
    },
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setTagsList( state, { payload } ) {
      return {
        ...state,
        tagsListResult: payload,
      };
    },
    setSubjectList( state, { payload } ) {
      return {
        ...state,
        subjectListResult: payload,
      };
    },
    setAllSubjects( state, { payload } ) {
      return {
        ...state,
        allSubjectsResult: payload,
      };
    },
    setTestPaperList( state, { payload } ) {
      return {
        ...state,
        testPaperListResult: payload,
      };
    },
  },
};
