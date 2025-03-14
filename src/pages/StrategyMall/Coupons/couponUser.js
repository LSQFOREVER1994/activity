import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Input, Row, Col, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';
import { exportXlsx } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;


const { Search } = Input;
const stateObj = {
  'ENABLE': formatMessage( { id: 'strategyMall.coupons.state.ENABLE' } ),
  'LOCK': formatMessage( { id: 'strategyMall.coupons.state.LOCK' } ),
  'DISABLE': formatMessage( { id: 'strategyMall.coupons.state.DISABLE' } ),
  'USED': formatMessage( { id: 'strategyMall.coupons.state.USED' } ),
  'OUT_TIME': formatMessage( { id: 'strategyMall.coupons.state.OUT_TIME' } ),
};

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  couponsUsers: strategyMall.couponsUsers,
  couponsProductList: strategyMall.couponsProductList
} ) )
@Form.create()
class couponUser extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    searchValue: '',
    orderBy:'create_time desc',
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  formLayout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getCouponsProduct'
    } );
    this.fetchList();

  }

  //  获取列表
  fetchList = () => {
    const { dispatch } = this.props;
    const { username, start, end, state, name, productId } = this.getFormValues()
    const { pageNum, pageSize, orderBy } = this.state;
    dispatch( {
      type: 'strategyMall/getCouponsUsers',
      payload: {
        pageNum,
        pageSize,
        orderBy,
        username,
        name,
        productId,
        start,
        state,
        end,
        // ...params,
      },
    } );
  }

  // //  pageSize  变化的回调
  // onShowSizeChange = (current, pageSize) => {
  //   this.setState({ pageSize });
  //   this.fetchList(1, pageSize);
  // }

  // //  页码变化回调
  // changePageNum = (pageNumber) => {
  //   const { pageSize } = this.state;
  //   this.fetchList(pageNumber, pageSize);
  // }

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }

  onSearch = ( value ) => {
    this.setState( { pageNum: 1, searchValue: value }, ()=>this.fetchList() )
  }

  valueChange = ( value ) => {
    const { searchValue } = this.state;
    if ( value === '' && value !== searchValue ) {
      this.setState( { pageNum:1, searchValue: value }, ()=>this.fetchList() );
    }
  }

  renderFilterInput = () => {
    const { searchValue } = this.state;
    return (
      <Search
        allowClear
        size="large"
        placeholder="搜索"
        value={searchValue}
        onChange={( e ) => this.valueChange( e.target.value )}
        onSearch={value => this.onSearch( value )}
        style={{ width: 200 }}
      />
    )
  }

  getFormValues = () => {
    const { form } = this.props;
    let Values = {}
    form.validateFields( ( err, values ) => {
      const { name = '', username, state, productId = '', rangTime } = values
      let start = '';
      let end = '';
      if ( rangTime && rangTime.length ) {
        start = rangTime[0].format( 'YYYY-MM-DD' )
        end = rangTime[1].format( 'YYYY-MM-DD' )
      }
      Values = { name, username, state: state === 'all' ? '' : state, productId: productId === 'all' ? '' : productId, start, end }

    } )
    return Values
  }

  handleExport = () => {
    const { name, username, state, productId, start, end } = this.getFormValues()
    exportXlsx( {
      type:'strategyMallService',
      uri: `coupons/export?coupon.name=${name}&username=${username}&start=${start}&end=${end}&state=${state}&coupon.productId=${productId}`,
      xlsxName: `用户优惠券${start}-${end}.xlsx`,
      callBack: () => {}
    } )
  }


  handleSearch = () => { 
    this.setState( {
      pageNum:1
    }, ()=>this.fetchList() )
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      loading, couponsUsers: { total, list }, form: { getFieldDecorator }, couponsProductList
    } = this.props;

    const { pageSize, pageNum } = this.state;

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      // onChange: this.changePageNum,
      // onShowSizeChange: this.onShowSizeChange, 
    };

    const columns = [
      // {
      //   title: <span>{formatMessage({ id: 'strategyMall.productsRights.profilePhoto' })}</span>,
      //   dataIndex: 'profilePhoto',
      //   width: 80,
      //   fixed: 'left',
      //   render: profilePhoto => <Avatar className={styles.imgBorder} src={profilePhoto} shape="square" size="large" />,
      // },
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        width: 80,
        fixed: 'left',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.nick' } )}</span>,
        dataIndex: 'user',
        width: 150,
        fixed: 'left',
        // filterDropdown: this.renderFilterInput,
        render: ( user ) => <span>{user && user.username ? user.username : '--'}</span>,
        // filterIcon: filtered => (<Icon type="search" style={{ fontSize: 16, color: filtered || searchValue ? '#1890ff' : undefined }} />)
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.coupon.name' } )}</span>,
        dataIndex: 'coupon',
        key: 'coupon.name',
        render: coupon => <span>{coupon.name || '--'}</span>,
      },
      {
        title: <span>创建时间</span>,
        // width: 220,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>使用时间</span>,
        // width: 220,
        dataIndex: 'useTime',
        render: useTime => <span>{useTime || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.specifiedGoods' } )}</span>,
        dataIndex: 'coupon',
        key: 'coupon.product',
        render: coupon => <span>{coupon.product ? coupon.product.name : '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.tit' } )}</span>,
        width:300,
        dataIndex: 'channel',
        render: channel => <span>{channel || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.state' } )}</span>,
        dataIndex: 'state',
        render: state => <span>{stateObj[state]}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.expTime' } )}</span>,
        // width: 200,
        fixed: 'right',
        dataIndex: 'expTime',
        render: expTime => <span className={moment( expTime ).isAfter( new Date() ) ? '' : styles.errText}>{expTime}</span>,
      },
    ];

    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
        >
          <Row>
            <Form>
              <Col xxl={3} md={6}>
                <FormItem label='用户' {...this.formLayout1}>
                  {getFieldDecorator( 'username', {
                      initialValue: '',
                    } )(
                      <Input placeholder='请输入用户' />
                    )}
                </FormItem>
              </Col>
              <Col xxl={3} md={6}>
                <FormItem label='名称' {...this.formLayout1}>
                  {getFieldDecorator( 'name', {
                      initialValue: '',
                    } )(
                      <Input placeholder='请输入名称' />
                    )}
                </FormItem>
              </Col>
              <Col xxl={6} md={10}>
                <FormItem label='使用时间' {...this.formLayout}>
                  {getFieldDecorator( 'rangTime', {
                      initialValue: '',
                    } )(
                      <RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} />
                    )}
                </FormItem>
              </Col>
              {/* <Col xxl={4} md={8}>
                  <FormItem label='指定商品' {...this.formLayout1}>
                    {getFieldDecorator( 'productId', {
                      initialValue: 'all',
                    } )(
                      <Select>
                        <Option key='all' value='all'>全部</Option>
                        {couponsProductList && couponsProductList.length > 0 &&
                          couponsProductList.map( item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          ) )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col> */}
              <Col xxl={3} md={6}>
                <FormItem label='状态' {...this.formLayout1}>
                  {getFieldDecorator( 'state', {
                      initialValue: 'all',
                    } )(
                      <Select>
                        <Option key='all' value='all'>全部</Option>
                        <Option key='ENABLE' value='ENABLE'>可用</Option>
                        <Option key='USED' value='USED'>已用</Option>
                        <Option key='DISABLE' value='DISABLE'>不可用</Option>
                      </Select>
                    )}
                </FormItem>
              </Col>
            </Form>
            <Col xxl={4} md={7} style={{ paddingTop: 4, textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleSearch}>
                  搜索
              </Button>
              <Button style={{ margin:'0 20px' }} onClick={this.formReset}>
                  清空
              </Button>
              <Button type="primary" onClick={this.handleExport}>
                  导出
              </Button>
            </Col>
          </Row>

          <Table
            size="large"
            scroll={{ x: 1200 }}
            rowKey={item => `${item.id}-${item.userId}-${item.couponId}`}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    );
  }
}

export default couponUser;