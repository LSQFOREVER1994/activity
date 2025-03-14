import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Tooltip, Icon, Card, message } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx, activityObj } from '@/utils/utils';
import FilterForm from './FilterForm';
import styles from './award.less';

const awardStateObj= {
  "SENDING": '发送中',
  "SEND_SUCCESS": '发送成功',
  "SEND_FAILED": '发送失败',
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  awardrecordsData: tool.awardrecordsData,
} ) )
@Form.create()
class AwardRecords extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    repeatId:"",
  }

  componentDidMount() {
    this.fetchList()
  }



  // 获取列表
  fetchList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { state, rangeTime, activityName, username, platform, prizeName, activityType, awardState } = formValue;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'
    const start = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const end = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getAwardrecords',
      payload: {
        pageNum,
        pageSize,
        state,
        start,
        end,
        activityName,
        username,
        platform,
        prizeName,
        activityType,
        awardState,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
      }
    } );
  }
  

  
  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    this.setState( {
      pageNum:1
    }, ()=>this.fetchList() )
  }


  tableChange = ( pagination, filters, sorter ) =>{
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj
    }, ()=>this.fetchList() );
  };


   //  导出
   handleExport = () => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { rangeTime, activityName, username, platform, prizeName, activityType } = formValue;
    const start = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const end = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const obj = { activityName, username, platform, prizeName, activityType, start, end };

    let paramsStr = '';
    // eslint-disable-next-line no-restricted-syntax
    for( const key in obj ){
      if( obj[key] ){
        paramsStr+=`${paramsStr?'&':'?'}${key}=${encodeURIComponent( obj[key] )}`
      }
    }

    const uri = paramsStr ? `awardrecords/export${paramsStr}` : `awardrecords/export`;
    const xlsxName = `中奖名单.xlsx`;
    
    exportXlsx( {
      type:'cropService',
      uri,
      xlsxName,
      callBack: () => { }
    } )
  }

  onRepeatPrize = ( orderId ) => {
    const { repeatId } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/editAwardReissue',
      payload: { orderId },
    } );

    this.setState( { repeatId:orderId } );

    this.interval = setInterval( () => {
      this.setState( { repeatId:"" } );
      if ( !repeatId ) {
        message.success( "发送成功！" );
        this.setState( {
          pageNum: 1,
          pageSize: 10,
        }, ()=>this.fetchList() );
        clearInterval( this.interval );
      }
    }, 2000 );
  }

  render() {
    const {
      loading, awardrecordsData:{ list, total }, name, type,
    } = this.props;
    const {
      pageSize, pageNum, sortedInfo, repeatId
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const arr = name && type ? [] : [
      {
        title: <span>活动名称</span>,
        dataIndex: 'activityName',
        key: 'activityName',
        render: activityName => <span>{activityName || '--'}</span>,
      },
      {
        title: <span>活动类型</span>,
        dataIndex: 'activityType',
        key: 'activityType',
        render: activityType => <span>{activityType && activityObj[activityType] ? activityObj[activityType].name : '--'}</span>,
      },
    ];


    const columns = [
      {
        title: <span>用户名</span>,
        dataIndex: 'user',
        key: 'user',
        render: user => <span>{user && user.username || '--'}</span>,
      },
      ...arr,
      {
        title: <span>对应平台</span>,
        dataIndex: 'platform',
        key: 'platform',
        render: platform =><span>{platform || '--'}</span>,
      },
      {
        title: <span>奖品名称</span>,
        dataIndex: 'prizeName',
        key: 'prizeName',
        render: prizeName =><span>{prizeName || '--'}</span>,
      },
      {
        title: <span>发奖时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render : ( createTime ) => <span>{createTime}</span>
      },
      {
        title: <span>发奖状态</span>,
        dataIndex: 'awardState',
        key: 'awardState',
        render: ( awardState, record ) => {
          const repeatBtn = awardStateObj.SEND_SUCCESS !== awardStateObj[awardState] &&
            <span className={styles.repeat_prize_btn} onClick={()=>{this.onRepeatPrize( record.orderId )}}>
              <Tooltip title='点击再次发放奖品'>
                {/* <Icon type="loading" /> */}
                {/* <Icon style={{color:"#1890ff"}} type={loading}  redo/> */}
                <Icon style={{ color:"#1890ff" }} type={`${record.orderId === repeatId && repeatId ? "loading":"redo"}`} />
              </Tooltip>
            </span>;

          // 失败原因提示框
          const toastIcon = record && record.remark && 
          <span className={styles.repeat_prize_btn}>
            <Tooltip title={`失败原因：${record.remark || ''}`}>
              <Icon style={{ color:"#faad14" }} type="warning" />
            </Tooltip>
          </span>

          return ( 
            <span>
              {awardStateObj[awardState]}
              {repeatBtn}
              {toastIcon}
            </span>
            )
        }
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title={!name && "中奖名单"}
            bodyStyle={name ? { padding: '20px 32px 40px 32px' } : {}}
          >
            <FilterForm
              name={name}
              type={type}
              filterSubmit={this.filterSubmit}
              handleExport={this.handleExport}
              wrappedComponentRef={( ref ) => { this.filterForm = ref}}
            />
            <Table
              scroll={{ x: 1200 }}
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
      </GridContent>
    );
  }
}

export default AwardRecords;
