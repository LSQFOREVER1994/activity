import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Table, Card, Form, Modal, Input, Tabs, DatePicker, Select, Checkbox, Row, Col, Icon, message  } from 'antd';
import { formatMessage } from 'umi/locale';
import { exportXlsx } from '@/utils/utils';
import { findDOMNode } from 'react-dom';
import copy from 'copy-to-clipboard';
import serviceObj from '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import  RedeemCoode from './redeemCode';
import BatchFilterForm from './batchFilterForm'
import styles from '../Lists.less';


const { sharePasswordUrl } = serviceObj;
const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  batchCodeList:strategyMall.batchCodeList,
  coupons: strategyMall.coupons,
  sharePassword:strategyMall.sharePassword
} ) )
@Form.create()

class BatchCode extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    loadPageSize:20,
    totalNum:-1,
    visible: false,
    visibleScan:false,
    visibleSpin:false,
    scanName:'',
    scanId:'',
    shareLink:'',
    sharePassword:'',
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    portionExportList:[],
    clickId:null,
    TabPaneKey:false,
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  componentDidMount() {
    this.fetchList();
  };

  //  获取批次兑换码
  fetchList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, username, createTime } = formValue;
    const start = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';

    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getBatchCodeList',
      payload: {
        pageSize,
        pageNum,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        groupIds:id,
        username,
        createTimeFrom:start,
        createTimeTo:end
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

  //  显示添加 Modal
  showAddModal = () => {
    this.onSearch();
    this.setState( {
      visible: true,
      current: undefined
    } );
  };

  //  显示扫描推广模板
  showScanModal=( e, item )=> {
    this.stop( e );
    this.setState( {
      visibleScan: true,
      scanName:item.couponName,
      scanId:item.id,
      sharePassword:item.password || '',
      shareLink:`${sharePasswordUrl}${item.id}`,
    } );
  }

  // 获取分享密码
  getSharePassword= ( e ) => {
    e.preventDefault()
    const { scanId } = this.state;
    const { dispatch } = this.props;
    this.setState( { visibleSpin:true } )
    dispatch( {
      type:'strategyMall/getSharePassword',
      payload:{
        id:scanId,
        callFunc:( result )=>{
          this.setState( { sharePassword:result, visibleSpin:false } )
        }
      }
    } )
    
  }

  //  取消扫描推广模板
  handleScanCancel=()=>{
    this.setState( {
      visibleScan: false,
      scanName:'',
      scanId:'',
      shareLink:'',
      sharePassword:'',
      current:undefined
    } )
  }

  // 复制链接及密码
  copyLinkPassword =( e ) => {
    e.preventDefault();
    const { shareLink, sharePassword } = this.state;
    if( shareLink === '' || sharePassword ==='' ){
      message.error( '复制出错,请检查链接或者密码是否为空' );
    }else{
 const tag = copy( 
        `推广链接：${shareLink}
分享密码：${sharePassword}`
       )
       if( tag ){
        message.success( '复制链接及密码成功' );
       }else{
        message.error( '复制失败,请重新点击或手动复制' );
       }
    }
  }


  // 获取优惠券列表
  fetchCouponList =() => {
    const { pageNum, loadPageSize, name, totalNum  } =this.state;
    const { dispatch, coupons:{ list, total  } } = this.props;
    if( list.length===totalNum )return
    dispatch( {
      type: 'strategyMall/getCoupons',
      payload: {
        pageNum,
        pageSize:loadPageSize,
        isFind:"false",
        name,
        state: "ENABLE"
      }
    } )
    this.setState( { loadPageSize:loadPageSize+10, totalNum:total } )
  }

  // 输入搜索优惠券
  onSearch = ( value ) =>{
    clearTimeout( this.timer );
    this.timer=setTimeout( () => {
      this.setState( { name:value }, ()=>this.fetchCouponList() )
    }, 500 );
  }
  
  // //  显示编辑 Modal
  // showEditModal = ( id ) => {
  //   const { tagsListResult: { list } } = this.props;
  //   const obj = list.find( o => o.id === id );

  //   this.setState( {
  //     visible: true,
  //     current: obj
  //   } );
  // };

  companyScroll = e => {
    e.persist();
    const { target } = e;
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {
      this.fetchCouponList()
    }
  };

  //  取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      loadPageSize:20,
      totalNum:-1
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = { ...fieldsValue };
      // const isUpdate = !!id;
      dispatch( {
        type: 'strategyMall/addBatchCodeList',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              loadPageSize:20,
              totalNum:-1
            }, ()=>$this.fetchList() );
          },
        },
      } );
    } );
  };

  
  //  全部导出
  allExport = () =>{
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, username, createTime } = formValue;
    const groupIds= id;
    const createTimeFrom = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const createTimeTo = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';
    const obj = { groupIds, username, createTimeFrom, createTimeTo };

    // 筛选全部导出
    let paramsStr = '';
    for( const key in obj ){
      if( obj[key] ){
        paramsStr+=`${paramsStr?'&':'?'}${key}=${obj[key]}`
      }
    }

    const uri = paramsStr ? `coupons-code/export${paramsStr}` : `coupons-code/export`;
    const xlsxName = paramsStr ? `兑换码_${groupIds ? `批次ID：${groupIds}` : ''}${username ? `创建人：${username}` : ''}${createTime ? `创建时间：${createTimeFrom}-` : '' }${createTimeTo || ''}.xlsx` : `兑换码批次订单.xlsx`;
    exportXlsx( {
      type:'strategyMallService',
      uri,
      xlsxName,
      callBack:() => {}
    } )
  }

  //  批量导出
  portionExport= () =>{
    const{ portionExportList } = this.state;
    if( !portionExportList.length )return
    const id = portionExportList.map( item => item.id );
    let idString = ''

    for( let i =0;i<id.length; i+=1 ){
      if( i===0 ){
        idString=`groupIds=${id[i]}`
      }else{
        idString +=`&groupIds=${id[i]}`
      }
    }

    const uri = `coupons-code/export?${idString}`;
    const xlsxName = `兑换码_${`批次ID：${id.join( ',' ) || ''}`}.xlsx`;
    exportXlsx( {
      type:'strategyMallService',
      uri,
      xlsxName,
      callBack:() => {}
    } )
  }

  // 阻止事件冒泡
  stop = ( e ) =>{
    e.stopPropagation();
  }

  checkBox = ( e, item ) => {
    e.stopPropagation();
    const{ portionExportList } = this.state;
    const resultIndex = portionExportList.findIndex( pItem => pItem.id===item.id );
    if( resultIndex===-1 ){
      portionExportList.push( item )
    }else{
      portionExportList.splice( resultIndex, 1 )
    }
  }

  //  tab切换事件
  onChange=( val )=>{
    this.setState( {
      clickId:null,
    }, ()=>{
      if( val ){
        if( this.redeemRef )this.redeemRef.fetchList()
      }else{
        this.fetchList()
      }
    } )
  }



  render() {
    const { loading, batchCodeList: { total, list }, form: { getFieldDecorator }, coupons } = this.props;
    const { pageSize, pageNum, visible, current = {}, sortedInfo, clickId, TabPaneKey, visibleScan, scanName, visibleSpin, shareLink, sharePassword  } = this.state;

    const couponsList = coupons.list ? coupons.list : [];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };


    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    
    const columns = [
      {
        title: (  
          <div>
            <span style={{ cursor:'pointer', color:'#1890FF' }} onClick={this.allExport}>全部导出</span>
            &nbsp;&nbsp;&nbsp;
            <span style={{ cursor:'pointer', color:'#1890FF' }} onClick={this.portionExport}>导出</span>
          </div>
        ),
        dataIndex: 'Checkbox',
        width:130,
        render:( id, item ) =><div style={{ textAlign:'center', position:'relative' }} onClick={this.stop}><Checkbox onChange={( e ) => this.checkBox( e, item )} key={item.id} /></div>
      },   
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>优惠券</span>,
        dataIndex: 'couponName',
        render: couponName => <span>{couponName}</span>,
      },
      {
        title: <span>数量</span>,
        dataIndex: 'number',
        render: number => <span>{number}</span>,
      },
      {
        title: <span>已兑换数量</span>,
        dataIndex: 'usedNumber',
        render: usedNumber => <span>{usedNumber || '0'}</span>,
      },
      {
        title: <span>使用数量</span>,
        dataIndex: 'buyCount',
        render: buyCount => <span>{buyCount || '0'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>失效日期</span>,
        dataIndex: 'endTime',
        key:'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{endTime}</span>,
      },
      {
        title: <span>导出状态</span>,
        width:90,
        dataIndex: 'isExport',
        render: isExport => <span>{isExport ? '已导出' : '未导出'}</span>,
      },
      {
        title: <span>创建人</span>,
        dataIndex: 'username',
        render: username => <span>{username || ''}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render: ( id, item ) => (
          <span
            style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
            onClick={( e ) => this.showScanModal( e, item )}
          >推广链接
          </span>
        ),
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card 
            className={styles.listCard}
            bordered={false}
            title="兑换码管理"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <Tabs defaultActiveKey={TabPaneKey.toString()} onChange={this.onChange}>
                <TabPane tab="批次" key={TabPaneKey}>
                  <BatchFilterForm
                    filterSubmit={this.filterSubmit}
                    wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                  />
                  <Button
                    type="dashed"
                    style={{ width: '100%', marginBottom: 8 }}
                    icon="plus"
                    onClick={() => this.showAddModal()}
                  >
                    新建
                  </Button>
           
                  <Table
                    size="large"
                    rowKey="id"
                    columns={columns}
                    loading={loading}
                    pagination={paginationProps}
                    dataSource={list}
                    onChange={this.tableChange}
                    onRow={( record )=> {
                      return {
                        // 点击行
                        onClick: event => {
                          event.stopPropagation()
                          this.setState( {
                            clickId:record.id,
                            TabPaneKey:!TabPaneKey
                          } );
                        }, 
                      };
                    }}
                  />
                </TabPane>

                <TabPane tab="兑换码" key={!TabPaneKey}>
                  <RedeemCoode
                    onRef={( redeem ) => {this.redeemRef = redeem}}
                    clickId={clickId}
                  />
                </TabPane>

              </Tabs>
            </div>
          </Card>
        </div>
      
        <Modal
          maskClosable={false}
          title="生成兑换码"
          className={styles.standardListForm}
          width={700}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='指定优惠券' {...this.formLayout}>
              {getFieldDecorator( 'couponId', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}指定优惠券` }],
                  initialValue: current.couponId,
                } )( 
                  <Select 
                    onSearch={this.onSearch}
                    showSearch
                    filterOption={false}
                    onChange={()=>this.onSearch}
                    onPopupScroll={this.companyScroll}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {
                      couponsList.length && couponsList.map( item=>(
                        <Option key={item.id} value={item.id}>
                          <span style={{ float:'left' }}>{item.name}&nbsp;&nbsp;&nbsp;</span>
                          {item.expType === "TIME" ? ( <span style={{ float:'right' }}>过期时间:{item.expTime}</span> ) : ''}
                          {item.expType === "DAYS" ? ( <span style={{ float:'right' }}>领取{item.receiveEffectiveDays}日内有效</span> ) : ''}
                        </Option>
                      ) )
                    }
                  </Select>
                )}
            </FormItem>

            <FormItem label='数量' {...this.formLayout}>
              {getFieldDecorator( 'number', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }],
                  initialValue: current.number,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}数量`} /> )}
            </FormItem>

            <FormItem label='兑换码失效时间' {...this.formLayout}>
              {getFieldDecorator( 'endTime', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}兑换码失效时间` }],
                  initialValue: current.endTime,
                } )( 
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  // disabledDate={this.disabledEndDate}
                    placeholder={`${formatMessage( { id: 'form.select' } )}兑换码失效时间`}
                  />
                )}
            </FormItem>

          </Form>
        </Modal>

        <Modal
          maskClosable={false}
          title={scanName}
          className={styles.standardListForm}
          width={700}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visibleScan}
          footer={false}
          onCancel={this.handleScanCancel}
        >
          
          <Row gutter={24} style={{ marginBottom:15 }}>
            <Col span={6} style={{ textAlign:'right', marginTop:'5px', fontSize:'14px', color:'#333' }}>
              <span>推广链接:</span>
            </Col>
            <Col span={12}>
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}推广链接`} value={shareLink} style={{ width:380 }} className="inputCopy" disabled />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6} style={{ textAlign:'right', marginTop:'5px', fontSize:'14px', color:'#333' }}>
              <span>提取密码:</span>
            </Col>
            <Col span={6}>
              <Input placeholder='右击刷新获取提取密码' style={{ width:170 }} value={sharePassword} className="inputCopy" disabled />
            </Col>
            <Col span={5} style={{ textAlign:'left', marginTop:'5px' }}>
              <Icon type="sync" spin={visibleSpin} style={{ cursor:'pointer' }} onClick={this.getSharePassword} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="primary" style={{ float:'right', margin:'20px 30px 20px 0' }} onClick={this.copyLinkPassword}>复制链接及密码</Button>
            </Col>
          </Row>
        </Modal>
      </GridContent>
    );
  };
}

export default BatchCode;