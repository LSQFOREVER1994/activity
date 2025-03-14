import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../Lists.less';
import  LandingPageForm from './LandingPage.Form';

const { confirm } = Modal;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  landingPageData: tool.landingPageData,
} ) )
@Form.create()
class HistoryGains extends PureComponent {
  state = {
    visible: false,
    info: {}
  };

  componentDidMount() {
    this.fetchList();
  }


  //  获取列表
  fetchList = ( params = {} ) => {
    const { dispatch, landingPageData: { pageNum } } = this.props;
    dispatch( {
      type: 'tool/getLandingPageData',
      payload: {
        pageNum: pageNum || 1,
        pageSize: 10,
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
          type: 'tool/deleteLandingPage',
          payload: { id },
          callFunc: () => {
            that.fetchList();
          },
        } );
      },

    } );
  }

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
  }


  valueChange = ( value ) => {
    const { pageNum, pageSize, orderId } = this.state;
    this.setState( { orderId: value } )
    if ( value === '' && value !== orderId ) {
      this.fetchList( { pageNum, pageSize, orderId: value } );
    }
  }

  showEditModal = ( data ) => {
    this.setState( { visible: true, info: data } )
  }

  handleOk = () => {
    this.setState( { visible: false } )
    this.fetchList()
  }

  render() {
    const {
      loading, landingPageData: { list, total, pageNum }
    } = this.props;
    const { info, visible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: formatMessage( { id: 'strategyMall.category.name' } ),
        dataIndex: 'name',
      },
      {
        title: '主模块',
        dataIndex: 'mainTitle',
      },
      {
        title: '副模块',
        dataIndex: 'subTitle',
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        width:150,
        render: ( id, data ) => (
          <div>
            <span
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( data )}
            >编辑
            </span>

            <span
              style={{ marginRight:15, cursor:'pointer', color:'#f5222d' }}
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
          title="落地介绍页列表"
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
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
            title={`${info.id ? '编辑' : '添加'}落地介绍页`}
            visible={visible}
            footer={null}
            width={1000}
            bodyStyle={{ padding: '12px 24px', maxHeight: '80vh', overflow: "auto" }}
            onCancel={() => { this.setState( { visible: false } ) }}
          >
            { 
              visible && <LandingPageForm info={info} handleOk={this.handleOk} />
            }
          </Modal>
        </Card>
      </GridContent>
    );
  }
}

export default HistoryGains;