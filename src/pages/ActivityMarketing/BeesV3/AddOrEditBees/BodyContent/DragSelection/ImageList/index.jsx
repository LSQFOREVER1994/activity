import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Input, Select, Icon, Empty, Spin, Pagination, Radio } from 'antd';
import { connect } from 'dva';
import useDebounce from '@/hooks/useDebounce';
import styles from './index.less';
import UploadImgBtn from '@/components/UploadImgBtn';
import componentList from '../ComponentList/listData';
import { CommonOperationFun } from '../../../provider';
import { widthEnlargesPictureHeight } from '@/utils/utils'

const { Option } = Select;
const baseClass = 'imageList';
function ImageList( props ) {
  const { dispatch, grouping, categoryMap, loading, evalDragStart, evalDragEnd } = props;
  const { addComponentsFun } = useContext( CommonOperationFun );
  const [searchVal, setSearchVal] = useState( '' );
  const [groupingVal, setGroupingVal] = useState( '' );
  const [libraryType, setLibraryType] = useState( 'private' );
  const [pagingParameters, setPagingParameters] = useState( { pageNum: 1, pageSize: 10 } );
  const imgComponent = useMemo( () => {
    return componentList.find( item => item.type === 'IMAGE' );
  }, [componentList] );
  const queryGrouping = ( type = 'IMAGE' ) => {
    dispatch( {
      type: 'library/getCategoryList',
      payload: {
        mediaType: type,
        libraryType
      },
    } );
  };
  const queryImageList = useDebounce( () => {
    let type = 'library/getMineMaterialList';
    if( libraryType === 'public' ) type = 'library/getMaterialList';
    dispatch( {
      type,
      payload: {
        mediaType: 'IMAGE',
        categoryId: groupingVal,
        name: searchVal,
        page:pagingParameters
      },
    } );
  }, 500 );
  useEffect( () => {
    queryGrouping();
    setGroupingVal( '' )
  }, [libraryType] );
  useEffect( () => {
    queryImageList();
  }, [libraryType, groupingVal, searchVal, pagingParameters] );
  const changePagination = ( type, val ) => {
    setPagingParameters( { ...pagingParameters, [type]: val } );
  };
  const uploadImg = () => {
    changePagination( { pageSize: 1 } );
  };
  const handleChangeItem = async ( type, item, e ) => {
    if ( !imgComponent ) return;
    const newData = JSON.parse( JSON.stringify( imgComponent ) );
    newData.propValue.image = item.url;
    if ( type === 'drag' ) {
      newData.SET_HEIGHT = true
      evalDragStart( newData, e );
    } else {
      const { width } = newData.style
      newData.style.height = await widthEnlargesPictureHeight( item.url, width )
      addComponentsFun( newData );
    }
  };
  const { list = [], total = 0 } = categoryMap || {};
  return (
    <div className={styles[`${baseClass}Wrap`]}>
      <div className={styles[`${baseClass}Filter`]}>
        <div className={styles[`${baseClass}FilterItem`]}>
          <Radio.Group value={libraryType} onChange={e => {setLibraryType( e.target.value )}}>
            <Radio.Button value="private">我的素材</Radio.Button>
            <Radio.Button value="public">公共素材库</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles[`${baseClass}FilterItem`]}>
          <Input
            placeholder="搜索图片"
            suffix={
              <Icon
                type="search"
                style={{
                  color: 'rgba(0,0,0,.45)',
                }}
              />
            }
            value={searchVal}
            onChange={e => {
              setSearchVal( e.target.value );
            }}
          />
        </div>
        <div className={styles[`${baseClass}FilterItem`]}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            showSearch
            filterOption={( input, option ) =>
              option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
            }
            value={groupingVal}
            onChange={e => {
              setGroupingVal( e );
            }}
          >
            {grouping.map( item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ) )}
          </Select>
        </div>
      </div>
      {list.length ? (
        <Spin spinning={loading}>
          <div className={styles[`${baseClass}Container`]}>
            {list.map( item => (
              <div
                key={item.id}
                className={styles[`${baseClass}Item`]}
                onDragEnd={evalDragEnd}
                onDragStart={handleChangeItem.bind( null, 'drag', item )}
                onDoubleClick={handleChangeItem.bind( null, 'double', item )}
              >
                <div className={styles[`${baseClass}ItemImg`]}>
                  <img src={item.url} alt={item.name} />
                </div>
                <p className={styles[`${baseClass}ItemText`]}>{item.name}</p>
              </div>
            ) )}
          </div>
          <Pagination
            size="small"
            showSizeChanger
            showQuickJumper
            current={pagingParameters.pageNum}
            pageSize={pagingParameters.pageSize}
            total={total}
            onChange={num => {
              changePagination( 'pageNum', num );
            }}
            onShowSizeChange={( current, size ) => {
              changePagination( 'pageSize', size );
            }}
          />
        </Spin>
      ) : (
        <div className={styles[`${baseClass}Empty`]}>
          <Empty description="暂无图片" />
        </div>
      )}
      {
        libraryType ==='private' &&
        <UploadImgBtn
          size="large"
          label="上传图片"
          className={styles[`${baseClass}UploadBtn`]}
          categoryId={groupingVal}
          onChange={uploadImg}
        />
      }
    </div>
  );
}
const mapProps = ( { library } ) => ( {
  grouping: library.classList,
  categoryMap: library.categoryMap,
  loading: library.loading,
} );
export default connect( mapProps )( ImageList );
