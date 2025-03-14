import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal, Tooltip, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../Lists.less';
import ModalForm from './PurchasesRecordForm.com';

const { confirm } = Modal;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  purchasesRecordData: tool.purchasesRecordData,
} ) )
@Form.create()
class HistoryGains extends PureComponent {
  state = {
    visible: false,
    info: {},
    inputValue:'',
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  };

  componentDidMount() {
    this.fetchList();
  }


  //  获取列表
  fetchList = ( params = {} ) => {
    const { sortedInfo={}, inputValue } = this.state
    const { dispatch, purchasesRecordData:{ pageNum } } = this.props;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'tool/getPurchasesRecordData',
      payload: {
        pageNum: pageNum || 1,
        pageSize: 10,
        name:inputValue,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        ...params
      },
    } );
  }


  deleteItem = ( data ) => {
    const { dispatch } = this.props;
    const { id, name } = data;
    const that = this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'tool/deletePurchasesRecord',
          payload: { id },
          callFunc: () => {
            that.fetchList();
          },
        } );
      },

    } );
  }

  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      sortedInfo: sotrObj
    }, ()=>this.fetchList( { pageNum: current, pageSize } ) )
  }


  valueChange = ( value ) => {
    const { pageNum, pageSize, orderId } = this.state;
    this.setState( { orderId: value } )
    if ( value === '' && value !== orderId ) {
      this.fetchList( { pageNum, pageSize, orderId: value } );
    }
  }

  //  获取筛选框值
  nameChange =( value ) => {
    this.setState( {
      inputValue:value,
    } )
  }

  //  搜索筛选
  handleSearch=()=>{
    const{ inputValue }=this.state;
    if( inputValue === '' )return
    this.fetchList()
  }

  // 清空
  emptyInput=()=>{
    this.setState( {
      inputValue:''
    }, ()=>this.fetchList() )
  }

  showEditModal = ( data ) => {
    this.setState( { visible:true, info:data } )
  }

  handleOk = () => {
    this.setState( { visible: false } )
    this.fetchList()
  }

  render() {
    const {
      loading, purchasesRecordData: { list, total, pageNum }
      
    } = this.props;
    const { info, visible, sortedInfo, inputValue } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'id',
        render: id =><span>{id}</span>,
      },
      {
        title: <span>记录名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name =><span>{name}</span>,
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
        title: formatMessage( { id: 'form.action' } ),
        render: ( data ) => (
          <div>
            <span
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( data )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( data )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          title="仿真购买记录列表"
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div>
            <span style={{ color:'#333' }}>记录名称：</span>
            <Input
              size="default"
              placeholder="请输入记录名称"
              value={inputValue}
              onChange={( e )=>this.nameChange( e.target.value )}
              style={{ width: 200 }}
            />
            <div style={{ float:'right' }}>
              <Button 
                type="primary"
                onClick={this.handleSearch}
              >搜索
              </Button>
              <Button 
                type="primary"
                style={{ marginLeft:30 }}
                onClick={this.emptyInput}
              >清空
              </Button>
            </div>
          </div>
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8, marginTop:30 }}
            icon="plus"
            onClick={() => { this.setState( { visible: true, info: {} } ) }}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button>
          <Table
            size="large"
            // scroll={{ y: 500 }}
            rowKey='id'
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
          <Modal
            title={`${info.id ? '编辑' : '添加'}仿真购买记录`}
            visible={visible}
            footer={null}
            width={860}
            bodyStyle={{ padding: '12px 24px' }}
            onCancel={() => { this.setState( { visible: false } ) }}
          // centered
          >
            {visible && <ModalForm info={info} handleOk={this.handleOk} />}
          </Modal>
        </Card>
      </GridContent>
    );
  }
}

export default HistoryGains;