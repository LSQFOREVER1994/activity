import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Modal, message } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import RedeemFilterForm from './redeemFilterForm'
import styles from '../Lists.less';

const { confirm } = Modal;

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  vouchersCardList:strategyMall.vouchersCardList,
} ) )
@Form.create()

class RedeemCoode extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
   }
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    // const { clickId, clickName } = this.props;
    // if( clickId )this.filterForm.props.form.setFieldsValue( { groupId: clickId } )
    // if( clickName )this.filterForm.props.form.setFieldsValue( { name: clickName } )
    this.fetchList();
  };

  // 获取卡密
  fetchList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { groupId, name, code, username, isSentOut, expireTime, createTime } = formValue;
    const expireFrom = ( expireTime && expireTime.length ) ?  moment( expireTime[0] ).format( 'YYYY-MM-DD' ):'';
    const expireTo = ( expireTime && expireTime.length ) ? moment( expireTime[1] ).format( 'YYYY-MM-DD' ):'';
    const from = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const to = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getVouchersList',
      payload: {
        pageSize,
        pageNum,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        groupId,
        name,
        code,
        username,
        isSentOut,
        expireFrom,
        expireTo,
        from,
        to,
      }
    } )
  };

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    this.setState( {
      pageNum:1
    }, ()=>this.fetchList() )
  }


  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };

  //  删除
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch } = this.props;
    const{ id, name, isSentOut }=obj;
    if( isSentOut ){
      message.error( '已发送的卡密不可删除' )
      return false
    }
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type:'strategyMall/delVouchers',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList();
            }
          }
        } );
      },
    } );
  }
  

  // 导出
  handleExport = () =>{
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { groupId, name, code, username, isSentOut, expireTime, createTime } = formValue;
    const expireFrom = ( expireTime && expireTime.length ) ?  moment( expireTime[0] ).format( 'YYYY-MM-DD' ):'';
    const expireTo = ( expireTime && expireTime.length ) ? moment( expireTime[1] ).format( 'YYYY-MM-DD' ):'';
    const from = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const to = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';
    const obj = { groupId, name, code, username, isSentOut, expireFrom, expireTo, from, to };
 
    // 筛选导出
    let paramsStr = '';
    // eslint-disable-next-line no-restricted-syntax
    for( const key in obj ){
      if( obj[key] ){
        paramsStr+=`${paramsStr?'&':'?'}${key}=${obj[key]}`
      }
    }

    const uri = paramsStr ? `vouchers/export${paramsStr}` : `vouchers/export`;
    const xlsxName = '卡密明细导出列表.xlsx';
    exportXlsx( {
      type:'strategyMallService',
      uri,
      xlsxName,
      callBack:() => {}
    } )
  }
   
  render() {
    const { loading, vouchersCardList: { total, list }, clickId, clickName } = this.props;

    const { pageSize, pageNum, sortedInfo } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns2 = ( clickId ) ? [
      {
        title: <span>卡券名称</span>,
        dataIndex: 'name',
        render: name => <span>{name || '--'}</span>,
      },
    ] : [];

    const columns =[
      {
        title: <span>批次ID</span>,
        dataIndex: 'groupId',
        fixed: 'left',
        render: groupId => <span>{groupId}</span>,
      },
      ...columns2,
      // {
      //   title: <span>卡券名称</span>,
      //   dataIndex: 'name',
      //   render: name => <span>{name || '--'}</span>,
      // },
      {
        title: <span>卡密</span>,
        dataIndex: 'code',
        width:300,
        render: code => <span>{code}</span>,
      },
      {
        title: <span>失效日期</span>,
        dataIndex: 'expireTime',
        key:'expire_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'expire_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: expireTime => <span>{expireTime || '--'}</span>,
      },
      {
        title: <span>发送时间</span>,
        dataIndex: 'updateTime',
        key:'update_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => <span>{updateTime || '--'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>发送状态</span>,
        dataIndex: 'isSentOut',
        render: isSentOut => <span>{isSentOut ? '已发送' : '未发送'}</span>
      },
      {
        title: <span>用户</span>,
        dataIndex: 'username',
        width:300,
        render: username => <span>{username || '--'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'Id',
        align:'center',
        render: ( id, item ) => (
          <span
            style={{ cursor:'pointer', color:item.isSentOut ? '#ccc' : '#f5222d' }}
            type="link"
            onClick={( e ) => this.deleteItem( e, item )}
          >删除
          </span>
        ),
      }
    ]

    return (
      <GridContent>
        <div className={styles.standardList}>
          <RedeemFilterForm
            clickId={clickId} 
            clickName={clickName}
            filterSubmit={this.filterSubmit}
            handleExport={this.handleExport}
            wrappedComponentRef={( ref ) => { this.filterForm = ref}}
          />
          <Table
            scroll={{ x:1400 }}
            size="large"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </div>
      </GridContent>
    );
  };
}

export default RedeemCoode;