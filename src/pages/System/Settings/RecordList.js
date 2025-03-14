import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import ReactJson from 'react-json-view'
import { Table, Card, Input, Icon, DatePicker, Button, Modal } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
// import styles from './recordList.less'

const {  RangePicker } = DatePicker;
const { Search } = Input;


@connect( ( { system } ) => ( {
  loading: system.loading,
  recordList: system.recordList
} ) )

class RecordList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    start: moment().subtract( 1, 'M' ).format( 'YYYY-MM-DD' ),
    end: moment().format( 'YYYY-MM-DD' ),
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    searchValue: '',
    moduleValue: '',
    params: '',
    visible: false
  };

  fetchInit = {
    pageNum: 1,
    pageSize: 10,
    start: moment().subtract( 1, 'M' ).format( 'YYYY-MM-DD' ),
    end: moment().format( 'YYYY-MM-DD' ),
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    searchValue: '',
    moduleValue: ''
  }

  componentDidMount() {
    const { start, end, sortedInfo } = this.state;
    this.fetchList( { pageNum: 1, pageSize: 10, start, end, sortedInfo } );
  }

  //  获取列表
  fetchList = ( { pageNum, pageSize, start, end, sortedInfo={}, searchValue, moduleValue } ) => {
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getRecordList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        },
        username: searchValue,
        module: moduleValue,
        start,
        end,
      },
    } );
  }

  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    const { start, end, searchValue, moduleValue } = this.state;
    this.fetchList( { pageNum: current, pageSize, start, end, sortedInfo: sotrObj, searchValue, moduleValue } );
    this.setState( { pageNum: current, pageSize, sortedInfo: sorter } );
  }

  //  时间变化的回调
  onDateChange = ( dates, dateStrings ) => {
  const start = dateStrings[0];
  const end = dateStrings[1];
  const { searchValue, moduleValue } = this.state;
  this.setState( { searchValue, moduleValue, start, end } );
  this.fetchList( { pageNum:1, pageSize:10, start, end, } );
  }

  onSearch = ( value, type ) =>{
    this.fetchList( { ...this.state, [type]: value, pageNum: 1 } );
    this.setState( { [type]: value } );
  }

  valueChange = ( value, type ) =>{
    this.fetchList( { ...this.state, [type]: value, pageNum: 1 } );
    this.setState( { [type]: value } );
  }

  getParams = ( id ) => {
    const { recordList: { list } } = this.props;
    const { params } = list.find( o => o.id === id );
    this.setState( {
      params,
      visible: true
    } );
  }

  cancelModal = () => {
    this.setState( {
      visible: false
    } );
  }




  renderFilterInput = ( type ) =>{
    return(
      <Search
        allowClear
        size="large"
        placeholder="搜索"
        value={this.state[type]}
        onChange={( e )=>this.valueChange( e.target.value, type )}
        onSearch={value => this.onSearch( value, type )}
        style={{ width: 200 }}
      />
    )
  }

  render() {
    const { loading, recordList: { total, list } } = this.props;
    const  { pageSize, pageNum, start, end, sortedInfo, searchValue, moduleValue, params, visible }  = this.state;




    const extraContent = (
      <div>
        <RangePicker allowClear={false} style={{ marginRight: 15 }} onChange={this.onDateChange} value={[moment( start ), moment( end )]} />
      </div>
    );

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title: <span>用户</span>,
        width: 180,
        dataIndex: 'username',
        filterDropdown: () =>this.renderFilterInput( 'searchValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || searchValue ? '#1890ff' : undefined }} /> ),
        render: username => <span>{username}</span>,
      },
      {
        title: <span>IP地址</span>,
        dataIndex: 'ip',
        width: 180,
        render: ip => <span>{ip}</span>,
      },
      {
        title: <span>请求方法</span>,
        dataIndex: 'method',
        width: 160,
        render: method => <span>{method}</span>,
      },
      {
        title: <span>操作模块</span>,
        width: 220,
        dataIndex: 'module',
        filterDropdown: () =>this.renderFilterInput( 'moduleValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || moduleValue ? '#1890ff' : undefined }} /> ),
        render: module => <span>{module}</span>,
      },
      {
        title: <span>具体操作</span>,
        width: 160,
        dataIndex: 'operation',
        render: operation => <span>{operation}</span>,
      },
      {
        title: <span>创建时间</span>,
        width: 160,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['ascend', 'descend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>查看参数</span>,
        dataIndex: 'id',
        width: 70,
        render: id => (
          <div style={{ textAlign:'center' }}>
            <span
              style={{ cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.getParams( id )}
            >
              预览
            </span>
          </div>
        ),
      }
    ];

    return (
      <GridContent>
        <div>
          <Card
            bordered={false}
            extra={extraContent}
            title='操作记录'
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Table
              size="default"
              rowKey={item => item.id}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable
          title='请求参数'
          width={800}
          bodyStyle={{ padding: '28px 0 28px' }}
          destroyOnClose
          visible={visible}
          onCancel={this.cancelModal}
          footer={null}
        >
          {
            <div style={{ margin: '0 auto', width: '80%', color: 'black', fontWeight: 'normal' }}>
              <ReactJson
                name={false}
                src={
                { 'params' : params ? JSON.parse( params ) : "" }
              }
              />
            </div>

          }
        </Modal>
      </GridContent>
    );
  }
}

export default RecordList;