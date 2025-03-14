import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, message, Card, Form, Modal, Breadcrumb } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import RenderReissueForm from './RenderReissueForm'
import { getValue, reissueStatus, reissueTypes } from './rewardReissueEnumes'
import { exportXlsx } from '@/utils/utils';

@connect( ( { rewardReissue } ) => ( {
  loading: rewardReissue.loading,
  rewardReissueMap: rewardReissue.rewardReissueMap,
  prizeTypeList: rewardReissue.prizeTypeList,
  taskList: rewardReissue.taskList,
  merchantList: rewardReissue.merchantList,
  activityPrizes: rewardReissue.activityPrizes
} ) )
@Form.create()
class RewardReissue extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      isAdd: true, // 是否新增
      isReAdd: false, // 是否再次补发
      failRecordVisible: false, // 失败名单弹窗控制
      addOrViewVisible: false, // 查看或新增弹窗控制
      fileObj: null, // 文件上传存放，
      viewItem: {},
      elementPrizesList: [], // 活动内奖品列表
    }
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'status',
        label: '补发状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '补发完成', value: 'FINISH' },
          { label: '部分补发', value: 'PART_FINISH' },
          { label: '失败', value: 'FAIL' },
          { label: '处理中', value: 'PROCESSING' },
          { label: '待补发', value: 'AWAIT' },
        ]
      },
      {
        key: 'type',
        label: '补发类型',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '次数', value: 'COUNT' },
          { label: '积分', value: 'INTEGRAL' },
          { label: '奖品', value: 'PRIZE' },
          { label: '任务', value: 'TASK' },
        ]
      },
      {
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
      }
    ]
  }

  componentDidMount() {
    this.getReissueList(); // 获取补发列表
    this.getActivityTask(); // 获取任务列表
    // this.getPrizeTypeList(); // 获取奖品类型列表
    this.getMerchantList() // 获取新模式商户列表
    this.getInfoPrizeList() // 获取活动内奖品列表
    this.getDrawElement() // 获取活动的抽奖组件
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getReissueList( data );
    } )
  }

  // 获取活动内奖品列表
  getInfoPrizeList = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'rewardReissue/getInfoPrizeList',
      payload: {
        query: {
          activityId,
          hasInventory: true
        },
      },
    } );
  }
  
  // 获取活动的抽奖组件
  getDrawElement = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'bees/getDrawElement',
      payload: {
        query: activityId,
        successFun: () => { },
      }
    } )
  }

  // 文件上传前的钩子
  beforeUpload = ( file ) => {
    if ( file ) {
      if ( file.name && file.name.length > 25 ) {
        message.error( '文件名过长' )
        return false
      }
      const { addActiveItem } = this.state
      const newAddActiveItem = { ...addActiveItem, file }
      message.success( '上传成功' )
      this.setState( {
        fileObj: file,
        addActiveItem: newAddActiveItem
      } )
    } else {
      const { addActiveItem } = this.state
      const newAddActiveItem = { ...addActiveItem, file: null }
      this.setState( {
        fileObj: null,
        addActiveItem: newAddActiveItem
      } )
    }
    return false // 方法中返回false，存储文件后手动上传
  }

  // 获取补发任务列表
  getActivityTask = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'rewardReissue/getTaskList',
      payload: {
        query: { activityId },
      }
    } );
  }

  // 获取商品列表
  getVisibleGoodsList = ( code, type ) => {
    const { dispatch, merchantList } = this.props;
    let merchantId = '';
    if ( !code ) return
    if ( merchantList ) {
      merchantList.forEach( item => {
        if ( item.code === code ) {
          merchantId = item.id;
        }
      } )
    }

    dispatch( {
      type: 'rewardReissue/getVisibleGoodsList',
      payload: {
        page:{
          pageNum: 1,
          pageSize: 500,
        },
        merchantId,
        type,
      },
      callBackFunc: ( res ) => {
        this.setState( {
          merchantVisibleList: res
        } )
      }
    } );
  };

  // 获取商户列表
  getMerchantList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'rewardReissue/getMerchantList',
    } );
  };

  // 获取奖品类型列表
  getPrizeTypeList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'rewardReissue/getPrizeTypeList',
    } );
  }

  // 模糊搜索奖品列表
  getPrizeList = ( rightName, relationPrizeType ) => {
    const { dispatch } = this.props;
    if ( !relationPrizeType ) return
    dispatch( {
      type: 'rewardReissue/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType
      },
      callBackFunc: ( res ) => {
        if ( res && res.length ) {
          this.setState( {
            prizeList: res
          } )
        }
      }
    } );
  }

  // 获取积分次数补发列表
  getReissueList = ( data ) => {
    const { dispatch, activityId } = this.props;
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const params = { ...data }
    if( !params.status ) delete params.status;
    if( !params.type ) delete params.type;
    const loadobj = {
      page:{
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
      },
      activityId,
      ...params
    }
    if ( !sortedInfo.columnKey ) {
      delete loadobj.orderBy;
    }
    dispatch( {
      type: 'rewardReissue/getReissueList',
      payload: loadobj,
    } );
  }

  // 查看补发信息
  getRewardReissueViewInfo = ( e, item, isReAdd ) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    if ( !item?.id ) return
    dispatch( {
      type: 'rewardReissue/getBufaInfo',
      payload: {
        query: {
          id: item.id
        },
        callBackFunc: ( res ) => {
          if ( res ) {
            let elementPrizesList = [];
            if ( res.isActivity ) {
              elementPrizesList = this.props.activityPrizes.find( ele => ele.elementId === res.elementId ).prizeList
            }
            this.setState( {
              isAdd: false,
              isReAdd,
              addOrViewVisible: true,
              viewItem: res,
              elementPrizesList,
            } )
            if ( res.prize ) {
              const { awardMode, relationPrizeType } = res.prize
              if ( awardMode === 'RIGHT' ) {
                this.getVisibleGoodsList( relationPrizeType )
              } else {
                this.getPrizeList( '', relationPrizeType )
              }
            }
          }
        }
      }
    } )
  }

  // 获取失败名单
  getFailRecords = ( e, item ) => {
    const { dispatch } = this.props;
    if ( !item?.id ) return
    const { id } = item;
    dispatch( {
      type: 'rewardReissue/getBufaFailedUserList',
      payload: {
        query: { id },
        callBackFunc: ( res ) => {
          if ( res && res.length > 0 ) {
            this.setState( {
              partFailedRecords: res,
              failRecordVisible: true
            } )
          }
        }
      }
    } )
  }

  // 商户/奖品类型选择回调
  handlePrizeTypeSelect = ( val, productType, awardMode ) => {
    if ( !val ) return
    if ( awardMode === 'RIGHT' ) {
      this.getVisibleGoodsList( val, productType )
    } else {
      this.getPrizeList( '', val )
    }
  }

  // 模版下载
  handleDownModal = () => {
    window.open( 'https://media.jiniutech.com/%E8%A1%A5%E5%8F%91%E5%90%8D%E5%8D%95.xlsx' )
  }

  // 新增或查看控制
  handleAddOrView = ( type ) => {
    this.setState( { isAdd: !this.state.isAdd, isReAdd: false }, () => {
      this.handleModalVisible( type )
    } )
  }

  // 弹窗控制
  handleModalVisible = ( type, isClose ) => {
    if ( !type ) return
    if ( type === 'fail' ) {
      this.setState( {
        failRecordVisible: !this.state.failRecordVisible
      } )
    }
    if ( type === 'addOrView' ) {
      this.setState( {
        addOrViewVisible: !this.state.addOrViewVisible,
        viewItem: {},
      }, () => {
        if ( isClose ) {
          this.setState( {
            fileObj: null
          } )
        }
      } )
    }
  }

  // 导出补发名单
  downLoadReissueRecord = () => {
    const { viewItem } = this.state
    if ( !viewItem?.id ) return
    const ajaxUrl = `reissue/user/export`
    exportXlsx( {
      type: 'activityService',
      uri: ajaxUrl,
      data:{ id:viewItem.id },
      responseType: 'POST',
      xlsxName: `补发名单.xlsx`,
      callBack: () => { }
    } )
  }

  // 表格change函数
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sorter,
    }, () => this.getReissueList( this.searchBar.current.data ) );
  };

  // 子组件需要调用的置空函数
  resetEmpty = ( type ) => {
    if ( !type ) return
    if ( type === 'prize' ) {
      this.setState( {
        merchantVisibleList: [],
        prizeList: []
      } )
    }
    if ( type === 'file' ) {
      this.setState( {
        fileObj: null
      } )
    }
  }

  handleComponentChange = ( id ) => {
    const { activityPrizes } = this.props
    const elementPrizesList = activityPrizes.find( ele => ele.elementId === id )?.prizeList;
    this.setState( {
      elementPrizesList
    } )
  }

  // 渲染失败名单
  renderFailRecords = () => {
    const { partFailedRecords, failRecordVisible } = this.state
    const columns = [
      {
        title: <span>用户</span>,
        dataIndex: 'account',
        key: 'account',
        render: account => <span>{account}</span>,
      },
      {
        title: <span>失败原因</span>,
        dataIndex: 'reason',
        key: 'reason',
        render: reason => <span>{reason}</span>,
      },
    ];
    return (
      <Modal
        title="失败名单"
        visible={failRecordVisible}
        okText='确定'
        onOk={() => this.handleModalVisible( 'fail' )}
        onCancel={() => this.handleModalVisible( 'fail' )}
        footer={[<Button key="submit" type="primary" onClick={() => this.handleModalVisible( 'fail' )}>确定</Button>]}
      >
        <div>
          <Table
            size="middle"
            rowKey="account"
            columns={columns}
            dataSource={partFailedRecords}
            pagination={false}
          />
        </div>
      </Modal>
    )
  }

  render() {
    const { loading, rewardReissueMap: { total, list }, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state
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

    // 补发表单props
    const reissueFormSetting = {
      activityId: this.props.activityId,
      isAdd: this.state.isAdd,
      isReAdd: this.state.isReAdd,
      loading: this.state.loading,
      addOrViewVisible: this.state.addOrViewVisible,
      viewItem: this.state.viewItem,
      fileObj: this.state.fileObj,
      prizeList: this.state.prizeList,
      activityPrizes: this.props.activityPrizes,
      elementPrizesList: this.state.elementPrizesList,
      merchantVisibleList: this.state.merchantVisibleList,
      handleComponentChange: this.handleComponentChange,
      resetEmpty: this.resetEmpty,
      downLoadReissueRecord: this.downLoadReissueRecord,
      handlePrizeTypeSelect: this.handlePrizeTypeSelect,
      beforeUpload: this.beforeUpload,
      handleDownModal: this.handleDownModal,
      getReissueList: this.getReissueList,
      handleAddOrView: this.handleAddOrView,
      handleModalVisible: this.handleModalVisible,
      getVisibleGoodsList: this.getVisibleGoodsList,
      getPrizeList: this.getPrizeList,
    }

    const columns = [
      {
        title: <span>补发状态</span>,
        dataIndex: 'status',
        key: 'status',
        render: status => <span>{getValue( reissueStatus, status )}</span>,
      },
      {
        title: <span>补发类型</span>,
        dataIndex: 'type',
        key: 'type',
        render: type => <span>{getValue( reissueTypes, type )}</span>,
      },
      {
        title: <span>创建人</span>,
        dataIndex: 'createUsername',
        key: 'createUsername',
        render: ( createUsername ) => {
          return <span>{createUsername}</span>
        }
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
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff', display: 'inline-block' }}
              onClick={( e ) => {
                this.getRewardReissueViewInfo( e, item, false )
              }}
            >
              查看
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff', display: item.status === 'PART_FINISH' || item.status === 'FAIL' ? 'inline-block' : 'none' }}
              onClick={( e ) => this.getFailRecords( e, item )}
            >
              失败名单
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff', display: 'inline-block' }}
              onClick={( e ) => {
                this.getRewardReissueViewInfo( e, item, true )
              }}
            >
              再次补发
            </span>
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>奖励补发</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title='奖励补发'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
          />
          <Button onClick={() => { this.handleModalVisible( 'addOrView' ) }} type='primary'>+新增</Button>
          <Table
            style={{ marginTop: 10 }}
            scroll={{ x: 1300 }}
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        {/* 新增或查看补发信息 */}
        <RenderReissueForm {...reissueFormSetting} />
        {/* 失败名单 */}
        {this.renderFailRecords()}
      </GridContent>
    );
  };
}
export default RewardReissue;
