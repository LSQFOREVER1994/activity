import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Table, Input, message } from 'antd';
import { exportXlsx } from '@/utils/utils';
import styles from './Inventory.less';

const FormItem = Form.Item;

@connect( ( { merchantRights } ) => {
  return {
    ...merchantRights
  }
} )
@Form.create()
class FreezeDetail extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      isExPLoading: false,
      selectedRowKeys: [],
    }
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  // 名称字数限制
  limitWords = ( txt ) => {
    let newStr
    const len = txt.length
    if ( len > 24 ) {
      newStr = `${txt.slice( 0, 24 )}...`
      return newStr
    }
    return txt
  }

  // 千分符
  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => {
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  handleUnfreeze = ( id ) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if ( !id && !selectedRowKeys.length ) {
      message.error( '请选择解冻项' )
      return
    }
    const idList = id ? [id] : selectedRowKeys;
    Modal.confirm( {
      title: '解冻确认',
      content: <>提货码解冻后将<span style={{ color: 'red' }}>变成过期状态，无法使用</span><br />解冻后无法撤销，确定解冻？</>,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch( {
          type: 'merchantRights/unlockFreezeVouchers',
          payload: {
            list:idList
          },
          callBackFunc: () => {
            this.getFreezeDetail( 1 )
            this.setState( {
              selectedRowKeys: []
            } )
            message.success( '解冻成功' )
          }
        } );
      },
      onCancel() { },
    } );
  }

  onSelectChange = ( selectedRowKeys ) => {
    this.setState( {
      selectedRowKeys
    } )
  }

  // 获取列表数据
  getFreezeDetail = ( num ) => {
    const { dispatch, inventoryInfo } = this.props;
    const { productId, merchantCode } = inventoryInfo;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const formValue = this.getValues();
    dispatch( {
      type: 'merchantRights/getFreezeDetail',
      payload: {
        page:{
          pageNum: num || pageNum,
          pageSize,
          orderBy: sortedInfo.columnKey ? `${sortedInfo.columnKey || ''} ${sortValue}` : 'sort desc',
        },
        productId,
        merchantCode,
        ...formValue
      },
      callBackFunc: () => {
        this.setState( {
          selectedRowKeys: []
        } )
      }
    } )
  }

  // 导出列表数据
  exportFreezeDetail = () => {
    const { inventoryInfo } = this.props;
    const { productId, merchantCode } = inventoryInfo;
    const { sortedInfo } = this.state;
    const formValue = this.getValues();
    const obj = {
      productId,
      merchantCode,
      ...formValue,
      orderBy: `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    }

    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )

    let ajaxUrl = `vouchers/lock/details/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `vouchers/lock/details/export?${paramStr}`
    }

    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'equityCenterService',
        uri: ajaxUrl,
        xlsxName: `冻结明细.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
  }

  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time'
    } else if ( sortObj.columnKey === 'expireTime' ) {
      sortObj.columnKey = 'expire_time'
    }
    this.setState( {
      sortedInfo: sortObj,
      pageNum: current,
      pageSize,
      selectedRowKeys: []
    }, () => this.getFreezeDetail() );
  }

  render() {
    const { visible, handleCancel, inventoryInfo, form: { getFieldDecorator }, freezeDetail: { list, total }, loading } = this.props;
    if ( !inventoryInfo ) return null
    const { productName, productType, lockCount, productId, merchantCode, merchantName } = inventoryInfo;
    const { selectedRowKeys, sortedInfo, pageSize, pageNum, isExPLoading } = this.state;
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
    const columns = [
      {
        title: '用户名',
        align: 'center',
        dataIndex: 'bindAccount',
        key: 'bindAccount',
      },
      {
        title: '冻结数量',
        align: 'center',
        dataIndex: 'lockAmount',
        key: 'lockAmount',
      },
      {
        title: '流水号',
        align: 'center',
        dataIndex: 'tradeId',
        key: 'tradeId',
      },
      {
        title: '提货码',
        align: 'center',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        key: 'createTime',
      },
      {
        title: '过期时间',
        align: 'center',
        dataIndex: 'expireTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'expire_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        key: 'expireTime',
      },
      {
        title: '来源渠道',
        align: 'center',
        dataIndex: 'channel',
        key: 'channel',
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   dataIndex: 'operation',
      //   key: 'operation',
      //   render: ( item, record ) => {
      //     return <a style={{ color: "#5087ec" }} onClick={() => this.handleUnfreeze( record.id )}>解冻</a>
      //   }
      // },
    ];

    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    return (
      <Modal
        title="冻结明细"
        width={1200}
        destroyOnClose
        visible={visible}
        bodyStyle={{ paddingTop: 0 }}
        className={styles.global_styles}
        onCancel={handleCancel}
        footer={[<Button key={`${merchantCode}_${productId}`} type="primary" onClick={handleCancel}>关闭</Button>]}
      >
        <div className={styles.freeze_detail_item}>
          <span>商户名称：{merchantName}</span>
          <span>商品名称：{productName}</span>
          <span />
        </div>
        <Form layout='inline' className={styles.freeze_detail_item}>
          {/* <Button type="primary" onClick={() => this.handleUnfreeze()}>批量解冻</Button> */}
          <FormItem label='用户名'>
            {getFieldDecorator( 'bindAccount', {
            } )(
              <Input placeholder='请输入用户名' style={{ width: '200px' }} allowClear />
            )}
          </FormItem>
          <FormItem label='来源渠道'>
            {getFieldDecorator( 'channel', {
            } )(
              <Input placeholder='请输入来源渠道' style={{ width: '200px' }} allowClear />
            )}
          </FormItem>
          <FormItem label='提货码'>
            {getFieldDecorator( 'account', {
            } )(
              <Input placeholder='请输入完整提货码' style={{ width: '200px' }} allowClear />
            )}
          </FormItem>
          <Button type="primary" onClick={() => this.getFreezeDetail( 1 )} icon='search' loading={loading}>搜索</Button>
          <Button type="primary" onClick={() => this.exportFreezeDetail()} icon='export' loading={isExPLoading}>导出</Button>
        </Form>
        <Table
          rowKey='id'
          size='middle'
          columns={columns}
          rowSelection={rowSelection}
          pagination={paginationProps}
          loading={loading}
          scroll={{ y: 350 }}
          dataSource={list}
          onChange={this.tableChange}
        />
      </Modal>
    )
  }
}

export default FreezeDetail;
