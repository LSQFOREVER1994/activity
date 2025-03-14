import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Input, Icon, Button, Modal, Radio, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const orderStatus  = {
  APPLIED: formatMessage( { id: 'strategyMall.refund.applied' } ),
  AGREED: formatMessage( { id: 'strategyMall.refund.agreed' } ),
  REJECTED: formatMessage( { id: 'strategyMall.refund.rejected' } ),
}

const { Search } = Input;
@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.refundLoading,
  refundList: strategyMall.refundList,
  page:strategyMall.refundPage,
  productsRightsBelongs: strategyMall.productsRightsBelongs,
} ) )
@Form.create()
class RefundLists extends PureComponent {
  state = {
    // searchValue: '',
    visible:false,
    visibleAdministrator:false,
    // orderDetail:{},
    statusType:'',
    orderId:'',
    username:'',
    checkData:null,
    checkValue:''
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    this.fetchList();
  }

  //  获取列表
  fetchList = ( params={} ) => {
    const { dispatch } = this.props;
    const { statusType, orderId, username } = this.state;
    dispatch( {
      type: 'strategyMall/getRefundList',
      payload: {
        state: statusType,
        pageNum: 1,
        pageSize: 10,
        orderId,
        username,
        orderBy: 'create_time desc',
        ...params
      },
    } );
  }



  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
  }

  onSearch = ( value, type ) => {
    const { pageNum, pageSize } = this.state;
    if( type === 'orderId' ){
      this.setState( { orderId: value }, ()=>this.fetchList( { pageNum, pageSize } ) )
    }
    if( type === 'username' ){
      this.setState( { username: value }, ()=>this.fetchList( { pageNum, pageSize } ) )
    }
  }

  valueChange = ( value, type ) => {
    const { pageNum, pageSize, orderId, username } = this.state;
    if( type === 'orderId' ){
      this.setState( { orderId: value } )
    }
    if( type === 'username' ){
      this.setState( { username: value } )
    }
    if ( value === '' && value !== orderId && value !== username ) {
      this.fetchList( { pageNum, pageSize } );
    }
  }

  renderFilterInput = ( type ) => {
    const { orderId, username } = this.state;
    const data = ( type === 'orderId' ) ? orderId : ( type === 'username' ? username : '' )
    return (
      <Search
        allowClear
        size="large"
        placeholder="搜索"
        value={data}
        onChange={( e ) => this.valueChange( e.target.value, type )}
        onSearch={value => this.onSearch( value, type )}
        style={{ width: 200 }}
      />
    )
  }

  refundCheck = ( data, state ) => {
    const { dispatch } = this.props;
    const { checkValue } = this.state;
    const params = {
      orderId: data.orderId,
      state,
      id:data.id,
      reason: checkValue
    }
    dispatch( {
      type: 'strategyMall/refundCheck',
      payload: params,
    } )
    this.setState( { visible:false } )
  }

  handleCancel = () => {
    this.setState( { visible:false } )
  }


  //  显示管理员退款 Modal
  AdministratorshowAddModal = () => {
    this.setState( {
      visibleAdministrator: true,
    } );
  };

  // 点击确定模板逻辑
  AdministratorhandleSubmit = ( e ) =>{
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageNum, pageSize, statusType, orderId } = this.state;
    
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      const params = Object.assign( fieldsValue );
      
      dispatch( {
        type:'strategyMall/refundAdministrator',
        payload: {
          params,
          callFunc:()=>{
            this.fetchList( pageNum, pageSize, statusType, orderId )
            this.setState( {
              visibleAdministrator: false,
            } );
          }
        },
      } )
    } )
  }


  //  取消管理员模板
  AdministratorhandleCancel = () => {
    this.setState( {
      visibleAdministrator: false,
    } );
  };


  // showOrder = ( orderId ) => {
  //   const { dispatch } = this.props;
  //   dispatch( {
  //     type: 'strategyMall/getOrder',
  //     payload: { orderId },
  //     success: ( orderDetail ) => {
  //       this.setState( { orderDetail, visible: true } )
  //     }
  //   } )
  // }

  changeState = ( e ) =>{
    this.setState( { statusType: e.target.value } )
    this.fetchList( { state: e.target.value } )
  }

  render() {
    const {
      loading, page, refundList, form: { getFieldDecorator }
    } = this.props;

    const { statusType, orderId, checkData, checkValue, username } = this.state;
    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...page,
      current: page.pageNum,
    };

    const columns = [

      {
        title: <span>{formatMessage( { id: 'strategyMall.order.id' } )}</span>,
        dataIndex: 'orderId',
        filterDropdown:()=> this.renderFilterInput( 'orderId' ),
        render: data => <span>{data || '--'}</span>,
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || orderId ? '#1890ff' : undefined }} /> ),
        width:220
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.nick' } )}</span>,
        dataIndex: 'user',
        filterDropdown:()=> this.renderFilterInput( 'username' ),
        render: user => <span>{user ? user.username  : '--'}</span>,
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || username ? '#1890ff' : undefined }} /> ),
        width: 120
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.category.products' } )}</span>,
        dataIndex: 'order',
        render: order => <span> { ( order && order.name ) ? order.name : '--'}</span>,
        width: 200
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.createTime' } )}</span>,
        dataIndex: 'createTime',
        width: 200
      },
      {
        title: <span>审批理由</span>,
        dataIndex: 'reason',
        render: reason => <span>{reason  || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.refund.explain' } )}</span>,
        dataIndex: 'memo',
        render: memo => <span>{memo  || '--'}</span>,
      },
      {
        title: <div style={{ textAlign: 'center', width: 130 }}>{formatMessage( { id: 'form.action' } )}</div>,
        key: 'operation',
        fixed: 'right',
        width: 130,
        render: ( data ) =>{
          if ( data.state === 'APPLIED' ) {
            return (
              <div style={{ display: 'flex', justifyContent:'space-around' }}>
                {/* <Button onClick={() => { this.refundCheck(data, 'AGREED')}} type="primary" size='small'>同意</Button>
                <Button onClick={() => { this.refundCheck(data, 'REJECTED') }} style={{ backgroundColor: '#ff4f3e', color: '#fff',opacity:.9 }} size='small'>拒绝</Button> */}
                <Button onClick={() => { this.setState( { visible: true, checkData: data } ) }} size='small' type="primary">{formatMessage( { id: 'strategyMall.approval' } )}</Button>
              </div>
            )
          }
          return <div style={{ textAlign:'center' }}>{orderStatus[data.state]}</div>
        }
      },
    ];
    const extraContent = (
      <div className={styles.extraContent}>

        <Button style={{ marginRight:15 }} onClick={() => this.AdministratorshowAddModal()}>管理员退款</Button>

        <span>{formatMessage( { id: 'strategyMall.product.state' } )}：</span>
        <RadioGroup onChange={this.changeState} defaultValue={statusType}>
          <RadioButton value="">全部</RadioButton>
          {Object.keys( orderStatus ).map( item => {
            return <RadioButton key={item} value={item}>{orderStatus[item]}</RadioButton>
          } )}
        </RadioGroup>
      </div>
    );
    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          extra={extraContent}
          title={formatMessage( { id: 'menu.strategyMall.refundList' } )}
        >
          <Table
            size="large"
            // scroll={{ y: 500 }}
            rowKey={item => item.id}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={refundList}
            onChange={this.tableChange}
          />
          
          <Modal
            title='管理员退款'
            destroyOnClose
            visible={this.state.visibleAdministrator}
            onCancel={this.AdministratorhandleCancel}
            onOk={this.AdministratorhandleSubmit}
          >
            <Form onSubmit={this.handleSubmit}>

              <FormItem label='订单号' {...this.formLayout}>
                {getFieldDecorator( 'orderId', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}订单号` }],
                        initialValue: '',
                    } )( <Input style={{ width:300 }} /> )}
              </FormItem>

              <FormItem label='退款类型' {...this.formLayout}>
                {getFieldDecorator( 'refundType', {
                      rules: [{ required: true, message: `请选择退款类型` }],
                      initialValue: '',
                    } )(
                      <RadioGroup>
                        <Radio value="ONLY_REFUND">仅退款</Radio>
                        <Radio value="RETURN_REFUND">退款退权</Radio>
                      </RadioGroup>
                    )}
              </FormItem>

            </Form>
          </Modal>

          <Modal
            title={formatMessage( { id: 'strategyMall.refund.approval' } )}
            visible={this.state.visible}
            footer={(
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => { this.refundCheck( checkData, 'REJECTED' ) }} style={{ backgroundColor: '#ff4f3e', color: '#fff', opacity: .9 }}>{formatMessage( { id: 'strategyMall.rejected' } )}</Button>
                <Button onClick={() => { this.refundCheck( checkData, 'AGREED' ) }} type="primary">{formatMessage( { id: 'strategyMall.agreed' } )}</Button>
              </div>
            )}
            onCancel={this.handleCancel}
          >
            <Row style={{ display: 'flex', marginBottom:20 }}>
              <div style={{ flexShrink: 0, marginRight: 10 }}>{formatMessage( { id: 'strategyMall.refund.explain' } )}:</div>
              <div>{checkData && checkData.memo}</div>
            </Row>
            <Row style={{ display: 'flex' }}>
              <div style={{ flexShrink: 0, marginRight: 10 }}>{formatMessage( { id: 'strategyMall.refund.reason' } )}:</div>
              <TextArea
                placeholder={formatMessage( { id: 'strategyMall.refund.approval.reason' } )}
                // autosize={{ minRows: 2, maxRows: 6 }}
                value={checkValue}
                onChange={( e ) => {this.setState( { checkValue:e.target.value } )}}
              />
            </Row>
          </Modal>
        </Card>
      </GridContent>
    );
  }
}

export default RefundLists;