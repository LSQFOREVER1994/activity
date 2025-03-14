import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Modal, Button, Table } from 'antd'
import styles from './SingleGoods.less'

@connect( ( { equityGoods } ) => {
  return {
    ...equityGoods
  }
} )
class SaleDetail extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {}
  }

  componentDidMount() { }

  addDecimals = ( a, b, type ) => {
    const factor = 100; // 放大倍数，可以根据小数位数调整
    const result = ( Math.round( a * factor ) + Math.round( b * factor ) ) / factor;
    return ( type === 'RED' || type === 'JN_RED' ) ? result.toFixed( 2 ) : result;
  };
  
  
  render() {
    const { visible, handleVisible, goodsInfo, saleDetailData } = this.props;
    const { type, name, stock, preApprovalCount } = goodsInfo;
    const columns = [
      {
        title: '商户名称',
        align: 'center',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '预售量',
        align: 'center',
        dataIndex: 'num',
        key: 'num',
        defaultSortOrder: 'descend',
        sorter: ( a, b ) => ( a.inventory + a.lockCount ) - ( b.inventory + b.lockCount ),
        render: ( item, record ) => {
          const num = this.addDecimals( record.inventory, record.lockCount, type );
          return num
        }
      },
      {
        title: '最后更新时间',
        align: 'center',
        dataIndex: 'updateTime',
        sorter: ( a, b ) => a.updateTime > b.updateTime ? 1 : -1,
        key: 'updateTime',
      },
    ];
    const redMap = ['RED', 'JN_RED']

    return (
      <Modal
        title="预售明细"
        className={styles.global_styles}
        destroyOnClose
        visible={visible}
        onOk={handleVisible}
        onCancel={handleVisible}
        bodyStyle={{ paddingTop: 0 }}
        footer={[
          <Button key="submit" type="primary" onClick={handleVisible}>关闭</Button>,
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span>商品名称：{`${name}`}</span>
          <span>{redMap.includes( type ) ? '余额：' : '库存：'}{stock}</span>
          <span>总预售量：{redMap.includes( type ) ? preApprovalCount.toFixed( 2 ) : preApprovalCount}</span>
        </div>
        <Table
          rowKey='id'
          size='middle'
          columns={columns}
          pagination={false}
          scroll={{ y: 250 }}
          dataSource={saleDetailData}
        />
      </Modal>
    )
  }
}

export default SaleDetail;
