/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Drawer, Layout, message, Modal } from 'antd';
import { connect } from 'dva';
import domtoimage from 'dom-to-image';
import _ from 'lodash'
import moment from 'moment';
import styles from './index.less';
import HeaderContent from './HeaderContent';
import BodyContent from './BodyContent';
import { DomDataContext, CurrentPages, CommonOperationFun } from './provider';
import { addDefaultObj, DEFAULT_GLOUP } from './addDefaultObj';
import { isContained } from '../DataVerification';
import 'animate.css';
import { calculateRotatedPointCoordinate } from './BodyContent/DragEdit/DragComponentsList/calculateComponentPositonAndSize';
import validateAddComponent from './BodyContent/validateAddComponent'

const { Header, Content } = Layout;
const bodyStyle = { padding: 0, height: '100%' };
const classBaseName = 'addOrEditBees';
let throttle = false;
let coverThrottle = false
let operationRecord = []; // 操作记录
let operationRecordIdx = []; // 当前索引
function AddOrEditBees( props ) {
  const { visible, closeModal, editObj = {}, dispatch, isEditTemp, editTempStr, history, getEditData, saveLoading, canSave } = props;
  const [domData, setDomData] = useState( {} );
  const [currentPage, setCurrentPage] = useState( 0 );
  const [oldData, setOldData] = useState( {} );
  const idsList = useRef( null );
  const currentPagesData = domData?.pages?.[currentPage] || {};
  const changeDomData = obj => {
    setDomData( { ...obj } );
  };

  const clearSetUp = () => {
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        currentEditId: undefined,
      },
    } );
  };
  /**
   * @example 增加操作历史
   * @returns
   */
  const addOperationRecord = newData => {
    const { componentData } = newData;
    const leg = componentData?.length;
    if ( !leg ) return;
    const idx = currentPage;
    const currentData = JSON.parse( JSON.stringify( componentData ) );
    // 编辑的时候先注入活动信息
    const oldComponentData = oldData?.pages?.[currentPage]?.componentData
    const firstComponentData = oldComponentData || []
    if ( !operationRecord[idx] ) operationRecord[idx] = [firstComponentData];
    const recordLeg = operationRecord[idx].length;
    if ( recordLeg === ( operationRecordIdx[idx] || 1 ) ) {
      operationRecord[idx].push( currentData );
    } else {
      operationRecord[idx].splice( operationRecordIdx[idx] + 1, recordLeg, currentData );
    }
    operationRecordIdx[idx] = operationRecord[idx].length;
  };
  /**
   * @example 当前页面参数改变
   * @param {number | object} data 修改的数据
   * @param {string} type num 改变当前页，默认修改当前页参数 record 记录操作历史
   * @returns
   */
  const changeCurrentPage = ( data, type ) => {
    if ( type === 'num' ) {
      if (
        typeof data !== 'number' ||
        Number.isNaN( data ) ||
        data < 0 ||
        data >= domData.pages.length
      ) {
        message.error( '页码无效' );
        return;
      }
      clearSetUp();
      setCurrentPage( data );
      return;
    }

    const newObj = { ...currentPagesData, ...data };
    if ( newObj.componentData ) {
      newObj.componentData = [...newObj.componentData];
    }
    domData.pages[currentPage] = newObj;
    if ( type === 'record' ) {
      addOperationRecord( newObj );
    }
    changeDomData( domData );
  };

  // TODO：在不选中组件的情况下通过组件id选择组件改变组件属性
  const changeComponentValue = ( id, val, key ) => {
    const { componentData } = currentPagesData;
    const value = val?.target ? val.target?.value : val;
    const currentComponent = componentData.find( item => item.id === id )
    const data = _.set( currentComponent, key, value )
    const newData = { ...currentComponent, ...data };
    const newComponentList = componentData.map( ( item ) => {
      if ( item.id === id ) {
        return newData
      }
      return item
    } )
    changeCurrentPage( { componentData: newComponentList } );
  };

  // 获取页面id
  const getPageId = () => {
    return new Promise( resolve => {
      dispatch( {
        type: 'beesVersionThree/getSingleId',
        payload: {
          successFun: data => {
            resolve( `page_${data}` );
          },
          failFun: () => {
            message.error( '获取页面id失败' )
            resolve()
          },
        },
      } );
    } );
  }

  useEffect( () => {
    clearSetUp();
    if ( Object.keys( editObj ).length ) {
      setDomData( editObj );
      return;
    }
    getPageId().then( res => {
      if( !res ) return
      addDefaultObj.pages[0].id = res;
      setDomData( JSON.parse( JSON.stringify( { ...addDefaultObj, name: `我的活动${moment().format( 'YYYYMMDDHHmmss' )}` } ) ) );
    } )
    setDomData( JSON.parse( JSON.stringify( addDefaultObj ) ) )
  }, [editObj] );

  /**
   * @example 批量获取id
   * @returns {undefined}
   */
  const getComponentIdsSync = () => {
    return new Promise( resolve => {
      dispatch( {
        type: 'beesVersionThree/getComponentIds',
        payload: {
          successFun: data => {
            if ( !data?.length ) return;
            idsList.current = idsList?.current?.length ? idsList.current.concat( data ) : data;
            resolve();
          },
          failFun: resolve,
        },
      } );
    } );
  };

  const evalBeforeunload = e => {
    if ( operationRecord?.length ) {
      e.preventDefault();
      e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
      return false;
    }
    return true;
  };
  useEffect( () => {
    getComponentIdsSync();
    window.addEventListener( 'beforeunload', evalBeforeunload );
    return () => {
      window.removeEventListener( 'beforeunload', evalBeforeunload );
    };
  }, [] );

  // 组件隐藏时恢复默认值,组件打开先保存第一次进来的组件数据
  useEffect( () => {
    if ( visible ) {
      // 先保存第一次进来的组件数据
      setOldData( JSON.parse( JSON.stringify( editObj ) ) );
    }
    operationRecord = []
    operationRecordIdx = []
    operationRecord.length = 0;
    operationRecordIdx.length = 0;
  }, [visible] );

  /**
   * @example 新增组件
   * @param {object | array} data 组件参数
   * @param {boolean} 是否组合已有组件
   */
  const addComponentsFun = async ( data, groupSelect ) => {
    let newData = data;
    if ( Object.prototype.toString.call( data ) === '[object Object]' ) newData = [data];
    const leg = newData.length;
    for ( let i = 0; i < leg; i += 1 ) {
      const item = newData[i];
      // 标识当前组件是新增还是编辑
      item.CURRENT_ADD = true;
      if ( !idsList?.current?.length ) { // TODO: 当批量ID获取之前限制组件生成，否则没有组件ID获取不到组件数据页面会崩。
        message.error( '接口尚未批量返回组件ID' )
        return
      }
      item.id = idsList?.current?.pop();
      if ( !item.style.left ) item.style.left = 0;
      if ( !item.style.top ) item.style.top = 0;
      if ( idsList?.current?.length < 5 ) {
        await getComponentIdsSync();
      }
      if( !validateAddComponent( domData, item.type ) ) return
      if ( currentPagesData?.componentData?.length ) {
        currentPagesData.componentData.push( item );
      } else {
        currentPagesData.componentData = [item];
      }
      // 复制组合的时候需要把对应子集也复印一份
      if ( item.type === 'GROUP' && !groupSelect ) {
        item.propValue.componentIds.length = 0;
        const { componentData } = item.propValue;
        const { length } = componentData;
        for ( let k = 0; k < length; k += 1 ) {
          const newId = idsList.current.pop();
          componentData[k].id = newId;
          item.propValue.componentIds.push( newId );
          if ( idsList.current.length < 5 ) {
            await getComponentIdsSync();
          }
        }
        currentPagesData.componentData.push( ...componentData );
      }
    }

    changeCurrentPage( currentPagesData, 'record' );
    setTimeout( () => {
      const lastIndex = currentPagesData?.componentData?.length - 1;
      const eleData = currentPagesData.componentData[lastIndex];
      const el = document.getElementById( eleData.id )?.parentNode?.parentNode;
      if ( eleData && el ) {
        window.changeActiveComponents( eleData, el, lastIndex, { offsetX: 0, offsetY: 0 }, true );
      }
    }, 200 )
  };

  /**
   * @example 删除组件
   * @param {number | array} idx 需要删除的索引
   * @param {boolean} lock 是否锁定
   * @returns
   */
  const removeComponentsFun = ( idx, noTip ) => {
    let title = '你确定要删除吗？';
    if ( typeof idx === 'number' ) {
      const { isLock } = currentPagesData.componentData[idx];
      if ( isLock ) {
        message.warning( '当前组件已锁定，无法删除' );
        return;
      }
    } else {
      title = `你确定要删除选中的组件吗？`;
    }
    const { componentData } = currentPagesData;
    const remove = () => {
      clearSetUp();
      const groupChildrenIds = [];
      if ( typeof idx === 'number' ) {
        const [removeItem] = componentData.splice( idx, 1 );

        if ( removeItem?.type === 'GROUP' ) {
          const { componentIds } = removeItem.propValue;
          groupChildrenIds.push( ...componentIds );
        }
      } else {
        idx = idx instanceof Array ? idx : [idx];
        currentPagesData.componentData = componentData.filter( ( item, index ) => {
          const flag = !idx.includes( item.id );
          if ( !flag && item.type === 'GROUP' ) {
            const { componentIds } = componentData[index]?.propValue || {};
            if ( componentIds?.length ) {
              groupChildrenIds.push( ...componentIds );
            }
          }
          return flag;
        } );
      }
      // 组合需要同步删除
      if ( groupChildrenIds.length ) {
        currentPagesData.componentData = currentPagesData.componentData.filter(
          item => !groupChildrenIds.includes( item.id )
        );
      }
      changeCurrentPage( currentPagesData, 'record' );
    };
    if ( noTip ) {
      remove();
      return;
    }
    Modal.confirm( {
      title,
      okText: '确认',
      cancelText: '取消',
      onOk: remove,
    } );
  };


  /**
   * @example 生成编辑区快照
   * @param { boolean } tip 是否显示Message
   * @returns {string} base64 jpeg img
   */
  const generateSnapshot = async tip => {
    if ( coverThrottle ) return '';
    coverThrottle = true;
    const el = document.getElementById( 'dragEditComponentsList' ) || document.getElementById( 'streamingLayoutComponentsList' );
    if ( !el ) {
      if ( tip ) message.warn( '请添加组件' );
      coverThrottle = false;
      return '';
    }
    const { backgroundColor, opacity, backgroundImage, backgroundLayout = 'ORIGINAL' } = currentPagesData.style;
    if ( backgroundLayout === 'ORIGINAL' ) el.style.background = `url(${backgroundImage || ''}) no-repeat 0 0 / 100%, ${backgroundColor}`;
    if ( backgroundLayout === 'TILE' ) el.style.background = `url(${backgroundImage || ''}) repeat 0 0 / 100%, ${backgroundColor}`
    if ( backgroundLayout === 'STRETCH' ) el.style.background = `url(${backgroundImage || ''}) no-repeat 0 0 / 100% 100%, ${backgroundColor}`
    if ( opacity ) el.style.opacity = opacity;
    const res = await domtoimage.toJpeg( el, { quality: 0.8 } ).catch( e => {
      console.log( `生成快照错误:${e}` );
      return '';
    } );
    el.style.background = '';
    el.style.opacity = '';
    currentPagesData.cover = res;
    changeCurrentPage( currentPagesData );
    coverThrottle = false;
    if ( tip ) {
      message.info( '更新成功' );
    }
    return res
  };

  /**
   * @example 保存活动
   * @param {type} type add 保存活动(默认) preView 预览活动
   * @returns {Promise<string>} 活动id
   */
  const saveActivity = useCallback(
    ( type = 'add' ) => {
      return new Promise( async ( resolve ) => {
        if ( throttle ) {
          Promise.resolve( '' );
          return;
        }
        throttle = true;
        const closeLoad = message.loading( '加载中', 0 );
        // TODO:这里会多触发一次校验
        // const flag = isContained( domData );
        // if ( !flag ) {
        //   throttle = false;
        //   resolve( '' );
        //   closeLoad();
        //   return;
        // }

        let dispatchType = 'beesVersionThree/addBeesOrEditBees';
        
        if ( type === 'preView' ) {
          dispatchType = 'beesVersionThree/setPreview';
        }
        if( type === 'publish' ) {
          dispatchType = 'beesVersionThree/setPublish';
        }
        await generateSnapshot()
        domData.coverPicture = domData.pages[0]?.cover || '';
        if ( saveLoading ) return;
        dispatch( {
          type: dispatchType,
          payload: {
            query: domData,
            successFun: res => {
              closeLoad();
              throttle = false;
              resolve( res );
              if ( type === 'preView' ) {
                return;
              }
              if ( type === 'add' ) {
                // changeDomData( { ...domData, id: res } );
                // 刷新数据
                
                getEditData( { id: res } )
              }
              message.info( '保存成功' );
            },
            failFunc: ( err ) => {
              closeLoad();
              if ( !err ) message.error( '系统异常，请稍后！' )
              throttle = false;
              resolve( '' );
            },
          },
        } );
      } );
    },
    [domData]
  );

  /**
   * @example 撤销
   * @returns
   */
  const editAreaUndo = () => {
    const idx = currentPage
    if ( !operationRecordIdx[idx] ) return;
    const subtract = operationRecord[idx].length === operationRecordIdx[idx] ? 2 : 1;
    const prevIdx = operationRecordIdx[idx] - subtract;
    const prevItem = operationRecord[idx][prevIdx];
    if ( !prevItem ) return;
    operationRecordIdx[idx] -= subtract;
    clearSetUp();
    changeCurrentPage( { componentData: JSON.parse( JSON.stringify( prevItem ) ) } );
  };
  /**
   * @example 恢复
   * @returns
   */
  const editAreaRecovery = () => {
    const idx = currentPage;
    const { length } = operationRecord[idx] || {};
    if ( !length || operationRecordIdx[idx] + 1 >= length ) return;
    const prevItem = operationRecord[idx][operationRecordIdx[idx] + 1];
    operationRecordIdx[idx] += 1;
    changeCurrentPage( { componentData: JSON.parse( JSON.stringify( prevItem ) ) } );
  };
  const operationRecordObj = useMemo( () => {
    const idx = operationRecordIdx?.[currentPage] || 0;
    return {
      firstRecord: idx === 0,
      lastRecord: idx + 1 >= ( operationRecord?.[currentPage]?.length || 0 ),
    };
  }, [operationRecordIdx[currentPage]] );

  /**
   * @example 组件组合
   * @param {array} data 需要组合的组件
   * @param {object} groupStyle 组合的样式
   * @returns
   */
  const evalGroupData = ( data, groupStyle ) => {
    if ( !data.length ) return [];
    const newData = [];
    const oldGroupId = [];
    const groupChildrenIds = [];
    const { componentData } = currentPagesData;
    data.forEach( item => {
      if ( item.type !== 'GROUP' ) {
        groupChildrenIds.push( item.id );
        item.inCombination = true;
        item.isLock = true;
        const { style } = item;
        const left = style.left - groupStyle.left;
        const top = style.top - groupStyle.top;
        style.left = left;
        style.top = top;
        newData.push( item );
        return;
      }
      const { style, propValue } = item;
      oldGroupId.push( item.id );
      propValue.componentData.forEach( comItem => {
        const {
          style: { left, top },
        } = comItem;
        comItem.style.left = left + style.left - groupStyle.left;
        comItem.style.top = top + style.top - groupStyle.top;
        newData.push( comItem );
      } );
    } );
    const ids = newData.map( item => item.id );
    const { length } = componentData
    for ( let i = length - 1; i >= 0; i -= 1 ) {
      const item = componentData[i]
      if ( groupChildrenIds.includes( item.id ) ) {
        item.inCombination = true;
        item.isLock = true;
      }
      if ( oldGroupId.includes( item.id ) ) {
        componentData.splice( i, 1 );
      }
    }

    const group = JSON.parse( JSON.stringify( DEFAULT_GLOUP ) );
    group.propValue.componentIds = ids;
    group.style = JSON.parse( JSON.stringify( { ...group.style, ...groupStyle } ) );
    group.propValue.componentData = newData;
    addComponentsFun( group, true );
    return [group];
  };

  /**
   * @example 计算解除组合的位置
   * @param {object} groupStyle 组合的样式
   * @param {object} itemStyle 子组件的样式
   * @returns {object} 计算好的left,top值
   */
  const computedUngroupPosition = ( groupStyle, itemStyle ) => {
    const { left, width, top, height, rotate } = groupStyle;
    const { left: itemLeft, top: itemTop, width: itemWidth, height: itemHeight } = itemStyle;
    const center = {
      x: left + ( width / 2 ),
      y: top + ( height / 2 ),
    };
    const itemLeftX = left + itemLeft;
    const itemtopY = top + itemTop;
    const coordinate = [];
    coordinate.push( calculateRotatedPointCoordinate( { x: itemLeftX, y: itemtopY }, center, rotate ) );
    coordinate.push(
      calculateRotatedPointCoordinate( { x: itemLeftX + itemWidth, y: itemtopY }, center, rotate )
    );
    coordinate.push(
      calculateRotatedPointCoordinate(
        { x: itemLeftX + itemWidth, y: itemtopY + itemHeight },
        center,
        rotate
      )
    );
    coordinate.push(
      calculateRotatedPointCoordinate( { x: itemLeftX, y: itemtopY + itemHeight }, center, rotate )
    );
    const boundary = coordinate.reduce(
      ( prev, point ) => {
        if ( point.x < prev.minX ) prev.minX = point.x;
        if ( point.y < prev.minY ) prev.minY = point.y;
        if ( point.x > prev.maxX ) prev.maxX = point.x;
        if ( point.y > prev.maxY ) prev.maxY = point.y;
        return prev;
      },
      {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      }
    );
    const { minX, maxX, minY, maxY } = boundary;
    const newLeft = Math.round( minX + ( ( maxX - minX ) / 2 ) - ( itemWidth / 2 ) );
    const newTop = Math.round( minY + ( maxY - minY ) / 2 - itemHeight / 2 );
    return {
      left: newLeft,
      top: newTop,
    };
  };
  /**
   * @example 组件解除组合
   * @param {object} data
   * @returns
   */


  const evalUngroupData = ( data ) => {
    if ( !data ) return;
    const { componentData } = data.propValue;
    clearSetUp();
    const { length } = currentPagesData.componentData
    for ( let idx = length - 1; idx >= 0; idx -= 1 ) {
      const item = currentPagesData.componentData[idx]
      if ( item.id === data.id ) {
        currentPagesData.componentData.splice( idx, 1 );
        continue;
      }
      if ( !componentData.some( dataItem => dataItem.id === item.id ) ) continue;
      item.isLock = false;
      delete item.inCombination;
      const {
        style: { rotate = 0 },
      } = item;
      const { style } = data;
      const { left, top } = computedUngroupPosition( style, item.style );
      item.style.left = left;
      item.style.top = top;
      item.style.rotate = rotate + style.rotate || 0;
    }
    changeCurrentPage( currentPagesData );
  }

  // TODO: 活动设置的积分别名，通过context获取
  const integralOtherName = domData?.dictConfig?.integralName
  return (
    // Todo: isEditTemp 用于判断编辑窗口当前处于 编辑活动 or 编辑模板 状态 （请勿改变数组顺序！！！！！）
    <DomDataContext.Provider value={[domData, changeDomData, isEditTemp]}>
      <CurrentPages.Provider value={[currentPagesData, changeCurrentPage, currentPage]}>
        <CommonOperationFun.Provider
          value={{
            getPageId,
            addComponentsFun,
            removeComponentsFun,
            saveActivity,
            editAreaUndo,
            editAreaRecovery,
            evalUngroupData,
            evalGroupData,
            generateSnapshot,
            ...operationRecordObj,
            DESTROY: !visible,
            integralOtherName,
            changeComponentValue,
          }}
        >
          <Drawer
            placement="right"
            closable={false}
            maskClosable={false}
            onClose={closeModal}
            visible={visible}
            keyboard={false}
            width="100%"
            bodyStyle={bodyStyle}
            style={{ transform: 'none' }}
            destroyOnClose
            zIndex={999}
          >
            <Layout className={styles[`${classBaseName}ContentWrap`]}>
              <Header className={styles[`${classBaseName}ContentHeader`]}>
                <HeaderContent closeModal={closeModal} isEditTemp={isEditTemp} canSave={canSave} history={history} editTempStr={editTempStr} dispatch={dispatch} domData={domData} />
              </Header>
              <Content className={styles[`${classBaseName}Content`]}>
                <BodyContent />
              </Content>
            </Layout>
          </Drawer>
        </CommonOperationFun.Provider>
      </CurrentPages.Provider>
    </DomDataContext.Provider>
  );
}

// 只有组件显示的时候再更新
export default memo( connect( ( state ) => ( { 
  saveLoading: state.beesVersionThree.saveLoading 
} ) )( AddOrEditBees ), ( props, nextProps ) => {
  return !props.visible && !nextProps.visible;
} );

