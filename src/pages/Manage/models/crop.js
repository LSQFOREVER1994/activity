import { message } from 'antd';

import {
    getTagsListAll, updateTags, addTags, delTags,
    getArticleListAll, upDataArticle, addDataArticel, delArticle, disableArticle, enableArticle
} from '@/services/crop.service';

export default {
    namespace: 'crop',

    state: {
        loading: false,
        tagsListResult: {
            total: 0,
            list: []
        },
        articleListResult: {
            total: 0,
            list: []
        },
        ProductListResult: {
            total: 0,
            list: []
        }
    },

    effects: {
        // 获取标签列表
        *getTagsListAll( { payload: { params, callFunc } }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getTagsListAll, params );
            if ( success ) {
                yield put( {
                    type: 'setTagsList',
                    payload: result,
                } );
                callFunc();
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

        // 编辑或添加标签
        *upaddDataTag( { payload: { params, isUpdate, callFunc } }, { call } ) {
            const data = isUpdate ? yield call( updateTags, params ) : yield call( addTags, params );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },

        // 删除标签
        *delTags( { payload: { id, callFunc } }, { call } ) {
            const data = yield call( delTags, id );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },


        // 获取文章列表
        *getArticleListAll( { payload: { params, callFunc } }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getArticleListAll, params );
            if ( success ) {
                yield put( {
                    type: 'setArticleList',
                    payload: result,
                } );
                callFunc();
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 添加 或 编辑文章
        *upaddDatArticle( { payload: { params, isUpdate, callFunc } }, { call } ) {
            const data = isUpdate ? yield call( upDataArticle, params ) : yield call( addDataArticel, params );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },
        // 删除文章
        *delArticleList( { payload: { id, callFunc } }, { call } ) {
            const data = yield call( delArticle, id );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },
        // 禁用文章
        *disableArticle( { payload: { id, callFunc } }, { call } ) {
            const data = yield call( disableArticle, id );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },  
        // 启用文章
        *enableArticle( { payload: { id, callFunc } }, { call } ) {
            const data = yield call( enableArticle, id );
            if ( data.success ) {
                callFunc();
                message.success( data.message );
            }
        },

    },

    reducers: {
        setTagsList( state, { payload } ) {
            return {
                ...state,
                tagsListResult: payload,
            };
        },
        setArticleList( state, { payload } ) {
            return {
                ...state,
                articleListResult: payload
            }
        }
    }
}