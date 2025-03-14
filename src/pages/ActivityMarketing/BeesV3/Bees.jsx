/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { Popover, Popconfirm, Button, Table, Modal, Icon, message } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { getValue, activityStates } from './BeesEnumes';
import styles from './bees.less';
import SearchForm from './SearchForm';
import AddOrEditBees from './AddOrEditBees';

function Bees( props ) {
  const {
    dispatch,
    loading,
    contentWidth,
    bees: { total, list },
  } = props;
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'create_time',
    field: 'createTime',
    order: 'descend',
    pageSize: 10,
    pageNum: 1,
  } );
  const [activeObj, setActiveObj] = useState( {} );
  const [evalType, setEvalType] = useState( 0 ); // 0 不展示 1 编辑或新增 2yulan
  const searchFormEl = useRef( null );
  const showModal = currentId => {
    // 查询当前活动信息
    if ( currentId ) {
      // setActiveObj( item )
      dispatch( {
        type: 'beesVersionThree/getBeesInfo',
        payload: {
          query: {
            id: currentId,
          },
          successFun: res => {
            if ( res ) {
              const { pages } = res;
              const filterPages = pages.map( item => {
                const { componentData, style } = item
                if ( typeof style === 'string' ) {
                  item.style = JSON.parse( style );
                }
                componentData.forEach( comItem => {
                  if ( typeof comItem.animations === 'string' ) {
                    comItem.animations = JSON.parse( comItem.animations );
                  }
                  if ( typeof comItem.style === 'string' ) {
                    comItem.style = JSON.parse( comItem.style );
                  }
                  if ( comItem?.events?.length ) {
                    comItem.events.forEach( eventItem => {
                      if ( typeof eventItem.params === 'string' ) {
                        eventItem.params = JSON.parse( eventItem.params );
                      }
                    } );
                  }
                  // 处理组合数据
                  if ( comItem.type === 'GROUP' ) {
                    const { componentIds } = comItem.propValue
                    comItem.propValue.componentData = componentData.filter( groupItem => {
                      if ( componentIds.includes( groupItem.id ) ) {
                        groupItem.inCombination = true
                        return true
                      }
                      return false
                    } )
                  }
                } );
                return item;
              } );
              const resultEditData = { ...res, pages: filterPages };
              console.log( resultEditData, '编辑数据' );
              setEvalType( 1 );
              setActiveObj( resultEditData );
            }
          },
        },
      } );
    } else {
      setEvalType( 1 );
    }
  };
  const onEditBees = ( id, e ) => {
    e.stopPropagation();
    showModal( id );
  };
  // 打开二维码弹框
  const openQRCodeModal = ( item ) => {
    setActiveObj( item );
    setEvalType( 2 );
  };
  // 获取活动列表
  const getBeesList = num => {
    const { pageNum, pageSize } = sortedInfo;
    const sortValue = sortedInfo.order === 'descend' ? 'desc' : 'asc';
    const searchObj = searchFormEl.current.getSearchValue();
    dispatch( {
      type: 'beesVersionThree/getBees',
      payload: {
        query: {
          pageNum: num || pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          ...searchObj,
        },
        callBack: data => {
          // 有数据但是当前页没有查询最后一页
          if ( data?.list?.length || !data.total ) return;
          const lastPageNum = Math.ceil( data.total / pageSize );
          setSortedInfo( { ...sortedInfo, pageNum: lastPageNum } );
        },
      },
    } );
  };
  // 删除活动
  const onDeleteBees = id => {
    dispatch( {
      type: 'beesVersionThree/deleteBees',
      payload: {
        query: {
          id,
        },
        successFun: () => {
          getBeesList();
        },
      },
    } );
  };


  const jumpDataCenter = ( e, item ) => {
    const { history } = props;
    history.push( `/activityTemplate/thirdDataCenter?id=${item.id}&activityName=${item.name}` )
  }
  // 表格分页
  const tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter, pageNum: current, pageSize };
    setSortedInfo( sotrObj );
  };
  const tableColumn = useMemo( () => {
    const columns = [
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      // {
      //   title: <span>活动类型</span>,
      //   dataIndex: 'activityType',
      //   key: 'activityType',
      //   render: activityType => <span>{getValue( activityTypes, activityType )}</span>,
      // },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        key: 'start_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'start_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: startTime => <span>{moment( startTime ).format( 'YYYY-MM-DD' )}</span>,
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{moment( endTime ).format( 'YYYY-MM-DD' )}</span>,
      },
      {
        title: <span>活动期数</span>,
        dataIndex: 'periods',
        key: 'periods',
        // width: 120,
        render: periods => <span>{periods || '--'}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'state',
        key: 'state',
        // width: 160,
        render: state => {
          return <span>{getValue( activityStates, state )}</span>;
        },
      },
      {
        title: <span>创建时间</span>,
        width: 200,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>创建人</span>,
        dataIndex: 'createUsername',
        key: 'createUsername',
        // width: 120,
        render: createUsername => <span>{createUsername || '--'}</span>,
      },
      {
        title: <span>所属部门</span>,
        dataIndex: 'createUserOrg',
        key: 'createUserOrg',
        // width: 120,
        render: createUserOrg => <span>{createUserOrg || '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center' }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        // width: 210,
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={onEditBees.bind( null, id )}
            >
              编辑
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={openQRCodeModal.bind( null, item )}
            >
              预览
            </span>
            <Popover
              placement="bottomRight"
              content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#1890ff' }}
                    onClick={( e ) => this.onCopyBees( e, id )}
                  >复制活动
                  </span> */}

                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#1BB557' }}
                    onClick={( e ) => jumpDataCenter( e, item )}
                  >
                    数据中心
                  </span>
                  {/* <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                    onClick={( e ) => this.handleAddTemplate( e, item )}
                  >添加至模版
                  </span> */}
                  {/* <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                    onClick={( e ) => this.onOpenFeatureModal( e, item )}
                  >未来版本设置
                  </span> */}
                  <span style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#f5222d' }}>
                    <Popconfirm
                      placement="top"
                      title={`是否确认删除:${item.name}`}
                      onConfirm={e => onDeleteBees( id, e )}
                      okText="是"
                      cancelText="否"
                    >
                      <span>删除活动</span>
                    </Popconfirm>
                  </span>
                </div>
              }
            >
              <span style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}>更多</span>
            </Popover>
          </div>
        ),
      },
    ];
    return columns;
  }, [sortedInfo] );
  const tablePagination = useMemo( () => {
    const { pageSize, pageNum } = sortedInfo;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      pageSize,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      },
    };
    return paginationProps;
  }, [sortedInfo, total] );
  // 搜索组件查询
  const handleSearch = e => {
    e.preventDefault();
    getBeesList();
  };
  useEffect( () => {
    getBeesList();
  }, [sortedInfo] );

  // 关闭操作弹框
  const onCloseModal = () => {
    setEvalType( 0 );
    setActiveObj( {} );
     getBeesList();
  };
  // 复制链接
  const copyLink = ( e, publishLink ) => {
    e.stopPropagation();
    const tag = copy( publishLink );
    if ( tag ) {
      message.success( '复制链接成功' );
    } else {
      message.error( '复制失败，重新点击或手动复制' );
    }
  };
  // 预览二维码
  const renderQRCodeModal = () => {
    const { publishLink, name } = activeObj;
    return (
      <Modal
        title={name || '活动预览'}
        visible={evalType === 2}
        footer={null}
        onCancel={onCloseModal}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ cursor: 'pointer', marginBottom: '0px', color: '#1890FF' }}
            onClick={e => {
              copyLink( e, publishLink );
            }}
          >
            <span style={{ marginRight: '10px' }}>点击一键复制活动地址</span>
            <Icon type="copy" style={{ color: '#1890FF' }} />
          </div>
          or
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '10px' }}>扫码打开</div>
            <div>
              {publishLink && (
                <QRCode
                  value={publishLink} // value参数为生成二维码的链接
                  size={200} // 二维码的宽高尺寸
                  fgColor="#000000"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  return (
    <div className={`${styles.beesWrap} ${contentWidth === 'Fixed' ? 'wide' : ''}`}>
      <div>
        <div className={styles.beesTableSearch}>
          <SearchForm handleSearch={handleSearch} wrappedComponentRef={searchFormEl} />
        </div>
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10 }}
          icon="plus"
          onClick={() => showModal( '' )}
        >
          创建新活动
        </Button>
      </div>
      <div className={styles.beesTableList}>
        <Table
          scroll={{ x: 1300 }}
          size="middle"
          rowKey="id"
          columns={tableColumn}
          loading={loading}
          pagination={tablePagination}
          dataSource={list}
          onChange={tableChange}
        />
      </div>
      {/* 预览 */}
      {renderQRCodeModal()}
      {/* 新增或编辑 */}
      {
        /* evalType === 1 &&  */
        <AddOrEditBees
          visible={evalType === 1}
          editObj={activeObj}
          closeModal={onCloseModal}
        />
      }
    </div>
  );
}

export default connect( ( { beesVersionThree, setting } ) => ( {
  loading: beesVersionThree.loading,
  bees: beesVersionThree.bees,
  contentWidth: setting.contentWidth,
} ) )( Bees );
