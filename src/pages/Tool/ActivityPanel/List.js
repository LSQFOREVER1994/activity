import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import { findDOMNode } from 'react-dom';
import { Card, Modal, Form, Table, message, Popover } from 'antd';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { activityObj } from '../../../utils/utils';
import FilterForm from './FilterForm';
import ShareModal from '../../Applet/ShareManage/ShareModal';
import styles from './ActivityPanle.less';

const { confirm } = Modal;

const activityStateObj = {
  GOING: "进行中",
  COMING: "即将开始",
  FINISH: "已结束",
  FORBID: "未启用"
}

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allActivityList: activity.allActivityList
} ) )
@Form.create()
class ActivesLists extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    activityStateType: '',
    activityType: '',
    activityId: '',
    newWholeList:[],
    ActivityStateNumObj: '',
    shareModalVisible: false,
    shareModalCurrent: {},
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  };

  // formLayout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };

  // formLayout1 = {
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 20 },
  // };

  // formLayout2 = {
  //   labelCol: { span: 5 },
  //   wrapperCol: { span: 10 },
  // };

  componentWillMount() {
    this.fetchList();
    this.getActivityStateNum()
  }

  // 获取列表
  fetchList = () => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { pageNum, pageSize, sortedInfo = {}, activityStateType } = this.state;
    const { type, rangeTime, name } = formValue;
    const startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    // const $this = this
    dispatch( {
      type: 'activity/getAllActivityList',
      payload: {
        pageNum,
        pageSize,
        startTime,
        endTime,
        name,
        orderBy: sortedInfo.columnKey ? `${sortedInfo.columnKey || ''} ${sortValue}` : 'create_time desc',
        activityState: activityStateType,
        isSale: activityStateType !== '' ? ( activityStateType === 'FORBID' ? 'false' : 'true' ) : '',
        type
      },
      callFunc: ( result ) => {
        this.getClickNum( result )
      }
    } );
  }

  //  获取活动对应的点击人数
  getClickNum = ( result ) => {
    const { list } = result;
    const appidList = [];
    list.forEach( ( item ) => {
      if ( item.buryPointId ) {
        appidList.push( item.buryPointId )
      }
    } )
    this.setState( {
      newWholeList: list
    } )
  }


  // 获取各种状态对应的个数
  getActivityStateNum = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getActivityStateNum',
      payload: {
        callFunc: ( result ) => {
          this.setState( { ActivityStateNumObj: result } )
        }
      }
    } )
  }

  // 删除列表项
  deleteItem = ( e, id, ) => {
    e.stopPropagation();
    const $this = this;
    // const { listType } = this.state;
    const { allActivityList: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )

        dispatch( {
          type: 'activity/deleteActivityData',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList();
            }
          }
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }


  // 筛选表单提交 请求数据
  filterSubmit = () => {
    setTimeout( () => {
      this.setState( {
        pageNum: 1,
      }, () => this.fetchList() )
    }, 100 );
  }


  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.fetchList() );
  };

  // 显示编辑框
  showEditModal = ( e, item ) => {
    e.stopPropagation();
    const { type, id } = item
    if ( activityObj[type] && activityObj[type].sessionType ) {
      sessionStorage.setItem( activityObj[type].sessionType, id )
      this.props.history.push( `/oldActivity/activityModal/${activityObj[type].editUrl}?id=${id}` )
    } else {
      message.error( '暂无配置' )
    }
  }


  // 显示小程序弹框
  showShareModal = ( item ) => {
    const{ name, type, id, wxShareId }=item
    const { dispatch } = this.props;
    let shareModalCurrent = {
      title: name,
      link: activityObj[type] && activityObj[type].activityUrl ? `${activityObj[type].activityUrl}?id=${id}` : '',
    };
    if ( wxShareId ) {
      dispatch( {
        type: 'activity/getMiniShareData',
        payload: {
          id: wxShareId,
        },
        callFunc: ( res ) => {
          if ( res ) {
            shareModalCurrent = res;
            this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
          } else {
            this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
          }
        }
      } )
    } else {
      this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
    }
  }

  // 取消
  shareModalHandleCancel = () => {
    this.setState( {
      shareModalVisible: false,
      shareModalCurrent: {},
    } );
  };


  // 提交
  shareModalHandleSubmit = ( wxShareId ) => {
    const { dispatch, } = this.props;
    const { current } = this.state;
    const $this = this;
    // 有小程序id更新活动列表
    if ( wxShareId ) {
      dispatch( {
        type: 'activity/submitSecondKillData',
        payload: {
          ...current,
          wxShareId,
          deleteIds: ['0'],

        },
        callFunc: () => {
          $this.fetchList();
          this.setState( {
            shareModalVisible: false,
            shareModalCurrent: {},
          } );
        }
      } )

    } else {
      this.setState( {
        shareModalVisible: false,
        shareModalCurrent: {},
      } );
    }
  };

  // 边框样式改变及切换
  changeModal = ( e, type ) => {
    e.stopPropagation();
    this.setState( {
      pageNum: 1,
      activityStateType: type
    }, () => {
      this.fetchList();
    } )
  }

  // 打开预览框
  popover = ( e, item ) => {
    e.stopPropagation();
    this.setState( {
      activityType: item.type,
      activityId: item.id
    } )
  }

  // 打开新页面
  openNewLink = ( e ) => {
    e.stopPropagation();
    const { activityType, activityId } = this.state;
    if ( !activityObj[activityType].activityUrl ) {
      message.error( '本活动暂时无链接,请手动搜索' )
      return
    }
    const strWindowFeatures = "width=375,height=667,top=0,right=0,scrollbars=no";
    window.open( `${activityObj[activityType].activityUrl}?id=${activityId}`, '_blank', strWindowFeatures )
  }

  //  复制链接
  copyLink = ( e ) => {
    e.preventDefault();
    const { activityType, activityId } = this.state;
    if ( !activityObj[activityType].activityUrl ) {
      message.error( '本活动暂时无链接,请手动搜索' )
      return
    }
    const tag = copy( `${activityObj[activityType].activityUrl}?id=${activityId}` )
    if ( tag ) {
      message.success( '复制链接成功' );
    } else {
      message.error( '复制失败,请重新点击或手动复制' );
    }
  }

  goData=( item )=>{
    if( sessionStorage.getItem( 'activityData' ) )sessionStorage.removeItem( 'activityData' )
    sessionStorage.setItem( 'activityData', JSON.stringify( item ) );
    setTimeout( () => {
      // window.open( `${window.location.origin}/oldActivity/activityData`, '_blank' )
      this.props.history.push( `/oldActivity/activityData` );
    }, 500 );
  }


  render() {
    const {
      loading, allActivityList: { total },
    } = this.props;

    const {
      pageSize, pageNum, shareModalVisible, shareModalCurrent, sortedInfo, activityStateType, ActivityStateNumObj, newWholeList
    } = this.state;

    console.log( 'newWholeList', newWholeList )

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };

    const content=( item ) => (
      <div style={{ textAlign: 'center' }}>
        <p>您可以打开&nbsp;<span className={styles.popover_content} onClick={( e ) => { this.openNewLink( e ) }}>新窗口预览</span>&nbsp;</p>
        <p>或&nbsp;<span className={styles.popover_content} onClick={( e ) => { this.copyLink( e ) }}>一键复制活动地址</span>&nbsp;</p>
        <p style={{ marginBottom:0 }}>也可生成&nbsp;<span className={styles.popover_content} onClick={() => this.showShareModal( item )}>分享小程序</span></p>
      </div>
    )



    const columns = [
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>活动类型</span>,
        dataIndex: 'type',
        key: 'type',
        render: type => <span>{activityObj[type] ? activityObj[type].name : '--'}</span>,
      },
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
        title: <span>活动天数</span>,
        dataIndex: 'totalDays',
        key: 'totalDays',
        // width: 120,
        render: totalDays => <span>{totalDays || 0}</span>
      },
      {
        title: <span>活动状态</span>,
        dataIndex: 'activityState',
        key: 'activityState',
        // width: 160,
        render: ( activityState, item ) => {
          if ( activityStateObj[activityState] === '进行中' ) {
            return (
              <div style={{ width: '70px', height: '8px', borderRadius: '8px', backgroundColor: '#eee', margin: '6px auto' }}>
                <div style={{ width: ( item.totalDays - item.lastDays ) / ( item.totalDays ) * 70, height: '8px', borderRadius: '8px', backgroundColor: '#1889FF' }} />
              </div>
            )
          }
          return ( <span>{activityStateObj[activityState]}</span> )
        }
      },
      {
        title: <span>创建时间</span>,
        // width: 160,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>{formatMessage( { id: 'form.action' } )}</span>,
        dataIndex: 'id',
        fixed: 'right',
        // width: 210,
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <span
              style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
            >删除
            </span>
            <span style={{ marginRight: 15, cursor: 'pointer', color: '#1BB557' }} onClick={( e ) => { this.popover( e, item ) }}>
              <Popover placement="rightTop" content={content( item )} trigger="click">
                预览
              </Popover>
            </span>
            <span
              style={{ cursor: 'pointer', color: '#efb208' }}
              onClick={() => this.goData( item )}
            >数据
            </span>
          </div>
        ),
      },
    ];

    const activityState = [
      {
        name: '全部',
        type: '',
        amount: ActivityStateNumObj ? ActivityStateNumObj.GOING + ActivityStateNumObj.COMING + ActivityStateNumObj.FINISH + ActivityStateNumObj.FORBID : 0,
      },
      {
        name: '进行中',
        type: 'GOING',
        amount: ActivityStateNumObj && ActivityStateNumObj.GOING ? ActivityStateNumObj.GOING : 0,
      },
      {
        name: '即将开始',
        amount: ActivityStateNumObj && ActivityStateNumObj.COMING ? ActivityStateNumObj.COMING : 0,
        type: 'COMING'
      },
      {
        name: '已结束',
        amount: ActivityStateNumObj && ActivityStateNumObj.FINISH ? ActivityStateNumObj.FINISH : 0,
        type: 'FINISH'
      },
      {
        name: '未发布',
        amount: ActivityStateNumObj && ActivityStateNumObj.FORBID ? ActivityStateNumObj.FORBID : 0,
        type: 'FORBID'
      }
    ]

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div style={{ marginBottom: 20, overflow: 'hidden' }}>
              <div className={styles.extraContent} style={{ background: 'rgba(166,206,244,0.1)', borderRadius: '5px' }}>
                {
                  activityState.map( ( item )=>{
                    return(
                      <div className={styles[item.type]} style={{ border:activityStateType === item.type && '1px solid #1890FF' }} onClick={( e )=>{this.changeModal( e, item.type )}} key={item.type}>
                        <span>{item.name}</span>
                        <p>{item.amount}</p>
                      </div>
                    )
                  } )
                }
              </div>
              <div className={styles.extraContent1} style={{ marginTop: 8, float: 'right' }}>
                <FilterForm
                  activityObj={activityObj}
                  filterSubmit={this.filterSubmit}
                  wrappedComponentRef={( ref ) => { this.filterForm = ref }}
                />
              </div>
            </div>
            <div className={styles.panelList}>
              <Table
                scroll={{ x: 1400 }}
                size="middle"
                rowKey="id"
                columns={columns}
                loading={loading}
                pagination={paginationProps}
                dataSource={newWholeList}
                onChange={this.tableChange}
              />
            </div>
          </Card>
        </div>
        <ShareModal visible={shareModalVisible} current={shareModalCurrent} handleSubmit={this.shareModalHandleSubmit} handleCancel={this.shareModalHandleCancel} />
      </GridContent>
    );
  }
}

export default ActivesLists;
