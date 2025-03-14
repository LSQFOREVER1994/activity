import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Input, DatePicker, Select, Button, Icon, InputNumber } from 'antd';
import _ from 'lodash'
import moment from 'moment';
import useThrottle from '@/hooks/useThrottle';
import { exportXlsx } from '@/utils/utils';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 去除对象中的空值
function getNonEmptyAttributes( obj = {} ) {
  return Object.keys( obj ).reduce( ( acc, key ) => {
    if ( obj[key] !== undefined && obj[key] !== null && obj[key] !== '' ) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} );
}


/**
 *
 * @param {Array} searchEleList 输入域配置
 * @param {Function} searchFun 列表搜索函数
 * @param {Boolean} loading 列表请求状态
 * @param {Object} exportConfig 导出接口的参数配置
 * @param {Object} preSearchData 初始参数，用于父组件路由接受参数
 */
function SearchBar( props, ref ) {
  const { searchEleList, searchFun, loading, exportConfig, preSearchData, beforeExportFun } = props;
  const [searchData, setSearchData] = useState( null );
  const [showMore, setShowMore] = useState( true ); // 展示更多
  const [isExPLoading, setIsExPLoading] = useState( false );
  const [selectDate, setSelectDate] = useState( null );
  // 初始化搜索数据
  const initSearchData = ( callBackFun = () => { } ) => {
    const data = {}
    if ( searchEleList?.length ) {
      searchEleList.forEach( item => {
        const { key, alias, initialValue } = item
        if ( key ) {
          if ( alias ) {
            Object.keys( alias ).forEach( ( i, index ) => {
              data[i] = initialValue ? initialValue[index] : ''
            } )
          } else {
            data[key] = initialValue || ''
          }
        }
      } );
    }
    setSearchData( data )
    setTimeout( () => callBackFun( data ), 0 );
  }

  // 搜索条件更新
  const updateSearchData = ( val, key ) => {
    const newSearchData = _.cloneDeep( searchData )
    newSearchData[key] = val;
    setSearchData( newSearchData )
  }

  // 重置
  const handleReset = () => {
    initSearchData( ( data ) => {
      const res = getNonEmptyAttributes( data )
      if ( searchFun ) searchFun( res )
    } )
  }

  // 搜索
  const handleSearch = () => {
    const res = getNonEmptyAttributes( searchData )
    if ( searchFun ) searchFun( res )
  }

  // ref可以拿到的实例对象：参数数据、重置函数
  useImperativeHandle( ref, () => ( {
    data: getNonEmptyAttributes( searchData || {} ),
    handleReset
  } ) )

  // 导出
  const handleExport = () => {
    if ( !exportConfig ) return
    const { type, ajaxUrl, xlsxName, extraData, responseType = "POST" } = exportConfig;
    const obj = { ...searchData, ...extraData }
    if( Object.prototype.hasOwnProperty.call( obj, 'searchCount' ) ) delete obj.searchCount
    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )
    let uri = ajaxUrl;
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      uri = `${ajaxUrl}?${paramStr}`
    }
    setIsExPLoading( true )
    exportXlsx( {
      type,
      uri,
      xlsxName,
      responseType,
      callBack: () => {
        setIsExPLoading( false )
      }
    } )
  }

  const changeRangePicker = ( e, alias ) => {
    const newSearchData = _.cloneDeep( searchData )
    Object.keys( alias ).forEach( ( itemKey, index ) => {
      const obj = {}
      const val = e[index] ? e[index].format( alias[itemKey] ) : ''
      obj[itemKey] = val
      Object.assign( newSearchData, obj )
    } )
    setSearchData( newSearchData )
  }

  // 日期数据回显
  const evalRangeValue = ( alias ) => {
    const val = []
    Object.keys( alias ).forEach( ( i, index ) => {
      Object.keys( searchData ).forEach( ( item ) => {
        if ( i === item ) {
          val[index] = searchData[item] ? moment( searchData[item] ) : undefined
        }
      } )
    } )
    return val
  };

  // 限制时间范围
  const disabledDate = ( current, limit ) => {
    if ( !limit || !current || !selectDate ) return false;
    const selectValue = selectDate.valueOf();
    const currenValue = current.valueOf();
    return !!( ( ( currenValue - limit ) > selectValue || ( currenValue + limit ) < selectValue ) );
  }

  // 选择时间变化
  const onDateChange = ( dates ) => {
    if ( !dates || !dates.length ) return;
    setSelectDate( dates[0] )
  }

  // 初始参数
  useEffect( () => {
    if ( preSearchData !== null ) {
      setSearchData( preSearchData )
    }
  }, [preSearchData] );

  // 回车搜索
  const onkeydown = useThrottle( e => {
    const theEvent = e || window.event;
    const code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if ( code === 13 ) {
      e.preventDefault();
      handleSearch()
    }
  }, 0 );

  useEffect( () => {
    initSearchData()
  }, [] );

  const getEleItem = ( item ) => {
    const {
      type, key, label, // 共同设置项
      optionList, // 下拉框选项
      format = 'YYYY-MM-DD HH:mm:ss', alias, limit, // RangePicker设置项：格式、开始&结束的参数名、范围限制
      maxLength, max, min, precision, // 数字输入框设置项
    } = item
    let Element;
    switch ( type ) {
      case 'DatePicker':
        Element = (
          <DatePicker
            value={searchData[key] ? moment( searchData[key], format ) : undefined}
            onChange={e => {
              const val = e ? e.format( format ) : '';
              updateSearchData( val, key );
            }}
            format={format}
            className={styles.search_item_ele_default}
            getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
          />
        );
        break;
      case 'Select':
        Element = (
          <Select
            showSearch
            value={searchData[key]}
            onChange={e => {
              updateSearchData( e, key );
            }}
            placeholder={`请选择${label}`}
            optionFilterProp="children"
            filterOption={( input, option ) =>
              option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
            }
            className={styles.search_item_ele_default}
            getPopupContainer={triggerNode => triggerNode.parentElement || document.body}
          >
            {optionList.map( optionItem => (
              <Option key={optionItem.value} value={optionItem.value}>
                {optionItem.label}
              </Option>
            ) )}
          </Select>
        );
        break;
      case 'RangePicker':
        Element = (
          <RangePicker
            value={evalRangeValue( alias )}
            disabledDate={current => disabledDate( current, limit )}
            allowClear={!limit}
            onCalendarChange={onDateChange}
            onOpenChange={() => setSelectDate( null )}
            onChange={e => changeRangePicker( e, alias )}
            format={format}
            className={styles.search_item_ele_double}
            getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
          />
        );
        break;
      case 'InputNumber':
        Element = (
          <InputNumber
            value={searchData[key]}
            onChange={e => {
              updateSearchData( e, key );
            }}
            placeholder={`请输入${label}`}
            className={styles.search_item_ele_default}
            maxLength={maxLength}
            max={max}
            min={min}
            precision={precision}
          />
        );
        break;
      default:
        Element = (
          <Input
            value={searchData[key]}
            onChange={e => {
              const val = e?.target?.value;
              updateSearchData( val, key );
            }}
            placeholder={`请输入${label}`}
            className={styles.search_item_ele_default}
          />
        );
        break;
    }
    return Element
  }

  const renderContent = useMemo( () => {
    if ( !searchData ) return null
    let searchBox
    let moreBtn
    let searchEleData = _.cloneDeep( searchEleList );
    if ( searchEleList?.length ) {
      if ( searchEleList.length > 4 ) {
        if ( showMore ) {
          moreBtn = <Button onClick={() => setShowMore( false )} type="link">收起 <Icon type="up" /></Button>
        } else {
          moreBtn = <Button onClick={() => setShowMore( true )} type="link">展开<Icon type="down" /></Button>
          searchEleData = _.cloneDeep( searchEleList ).splice( 0, 3 )
        }
      }

      const eleItem = searchEleData.map( item => {
        return (
          <div className={styles.search_item} key={item.key}>
            <div className={styles.search_item_label}>{`${item.label}:`}</div>
            {getEleItem( item )}
          </div>
        )
      } )
      searchBox = (
        <div className={styles.search_box} onKeyDown={onkeydown}>
          {eleItem}
          <div className={styles.search_box_btnGroup}>
            <Button onClick={handleSearch} type="primary" loading={loading} icon="search" className={styles.btnGroup_item}>搜索</Button>
            <Button onClick={handleReset} type="primary" loading={loading} icon="undo" className={styles.btnGroup_item}>重置</Button>
            {exportConfig && <Button onClick={() => beforeExportFun ? beforeExportFun( handleExport ) : handleExport()} loading={isExPLoading} type="primary" icon='export' className={styles.btnGroup_item}>导出</Button>}
            {exportConfig && <Button onClick={() => window.open( `#/system/exportList` )} type="link">查看导出列表</Button>}
            {/* {moreBtn} */}
          </div>
        </div>
      )
    }
    return searchBox
  }, [searchEleList, searchData, showMore, loading, isExPLoading, selectDate] );

  return (
    <>
      {renderContent}
    </>
  )
}

export default forwardRef( SearchBar )
