/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-21 10:51:40
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-09-05 09:27:43
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ActivityAudit/index.jsx
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import { Card, Tabs, Table, Modal, Steps, Button, Row, Col, Typography, Form, Input, Popconfirm } from 'antd';
import SearchBar from '@/components/SearchBar';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getUrlParameter } from '@/utils/utils';
import styles from './index.less';

const { Step } = Steps;
const { Paragraph } = Typography;
const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

const statusMap = {
  PENDING: '待审核',
  PASS: '审核通过',
  NOPASS: '审核驳回',
};

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const searchEleList = [
  {
    key: 'activityId',
    label: '活动ID',
    type: 'Input',
  },
  {
    key: 'name',
    label: '活动名称',
    type: 'Input',
  },
  {
    key: 'isUpdate',
    label: '审批业务',
    type: 'Select',
    optionList: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '活动发布流程',
        value: 'false',
      },
      {
        label: '活动修改流程',
        value: 'true',
      },
    ],
  },
  {
    key: 'createTime',
    label: '创建时间',
    type: 'RangePicker',
    format: 'YYYY-MM-DD',
    alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' },
  },
  {
    key: 'username',
    label: '创建人',
    type: 'Input',
  },
];

const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
const authority = authorityList.includes( 'ACTIVITY_APPROVAL_AUDIT' );

class ActivityAudit extends PureComponent {
  constructor( props ) {
    super( props );
    const isAudit = getUrlParameter( 'isAudit' )
    this.state = {
      activeKey: isAudit ? 'MINE' : 'APPROVAL',
      searchData:{},
      auditingFlow:false,
      auditVisible:false,
      auditRemark:'',
      preSearchData:{},
      pageSize:10,
      pageNum:1,
      sortedInfo:{
        columnKey: 'update_time',
        field: 'updateTime',
        order: 'descend',
      }
    }
    this.searchBar = React.createRef()
  }
 
  componentDidMount() {
    this.getAuditList( this.getPreSearch )
    this.getAuditNum()
  }

  getPreSearch = () => {
    const viewNowId = sessionStorage.getItem( 'viewNowId' )
    sessionStorage.removeItem( 'viewNowId' )
    if( viewNowId ){
      const data = { activityId:viewNowId }
      this.setState( {
        activeKey:'APPROVAL',
        preSearchData:data
      }, ()=>{
        this.filterSubmit( data )
      } )
    }
  }

  getAuditList = ( callFunc ) => {
    const { dispatch,  } = this.props
    const { pageSize, pageNum, sortedInfo, activeKey, searchData } = this.state
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`;
    dispatch( {
      type: 'activityAudit/getAuditList',
      payload: {
        query: {
          page: {
            pageSize,
            pageNum,
            orderBy,
          },
          type: activeKey,
          ...searchData,
        },
        callFunc: ( res ) => {
          if( res && callFunc ) callFunc()
        },  
      },
    } );
  };

  getAuditNum = () => {
    const { dispatch,  } = this.props
    dispatch( {
      type:'activityAudit/getAuditNum',
      payload:{
        query:{},
        callFunc:()=>{}
      }
    } )
  }

  getAuditItemDetail = ( id ) => {
    const { dispatch,  } = this.props
    dispatch( {
      type:'activityAudit/getAuditItemDetail',
      payload:{
        query:{ id },
        callFunc:()=>{
          this.setState( { auditVisible:true } )
        }
      }
    } )
  }

  handleOpenAuditFlowModal = id => {
    const { dispatch,  } = this.props
    dispatch( {
      type: 'activityAudit/getAuditFlow',
      payload: {
        query: {
          id,
        },
        callFunc: () => {
          this.setState( { auditingFlow: true } );
        },
      },
    } );
  };
  
  filterSubmit = data => {
    const { isUpdate, ...rest } = data;
    const params = isUpdate === '' ? rest : data;
    this.setState( {
      pageNum:1,
      pageSize:10,
      searchData:params,
    }, ()=>{
      this.getAuditList()
    } )
  };

  getActivityConfig = ( ) => {
    const { auditItemDetail, history } = this.props
    const { activityId } = auditItemDetail || {}
    if( !activityId ) return
    sessionStorage.setItem( 'auditId', activityId );
    history.push( `/activityTemplate/bees` );
  } 

  getAudit = ( idea ) => {
    const { auditItemDetail, dispatch, } = this.props;
    const { auditRemark } = this.state
    const { id } = auditItemDetail || {}
    const approvalState = idea ? 'PASS' : 'NOPASS'
    dispatch( {
      type:'activityAudit/getAudit',
      payload:{
        query:{
          id,
          approvalState,
          remark:auditRemark
        },
        callFunc:()=>{
          this.setState( {
            auditVisible:false, 
            auditRemark:''
          }, ()=>{
            this.getAuditList()
            this.getAuditNum()
          } )
        }
      }
    } )
  }

  renderAuditModal = () => {
    const { auditItemDetail:{ publishLink, coverPicture, appPublishLink, appQrCodePublishLink } } = this.props
    const { auditVisible, auditRemark } = this.state
    return (
      <Modal
        title='活动审核'
        visible={auditVisible}
        footer={null}
        onCancel={()=>{
          this.setState( { auditVisible:false, auditRemark:'' } )
        }}
        width="800px"
        centered
      >
        <div className={styles.modalTips}><span>活动审批还未通过，预览仅限于查看编辑效果，请勿面客</span></div>
        <Row className={styles.previewModal}>
          <Col span={10}>
            <div className={styles.coverPictureBox}>
              <img className={styles.coverPicture} src={coverPicture} alt="" />
            </div>
          </Col>
          <Col span={14} style={{ padding: '0 10px' }}>
            <div style={{ textAlign: 'right', paddingRight: '5px' }}>
              <Button type="primary" onClick={this.getActivityConfig}>查看配置内容</Button>
            </div>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>活动二维码:</Col>
              <Col span={16}>
                <QRCode
                  value={publishLink}  
                  size={130}
                  fgColor="#000000"
                />
              </Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>活动链接:</Col>
              <Col span={16}> <Paragraph copyable>{publishLink}</Paragraph></Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>APP内活动二维码:</Col>
              <Col span={16}> 
                <QRCode
                  value={appQrCodePublishLink}  
                  size={130}
                  fgColor="#000000"
                />
              </Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>APP内活动链接:</Col>
              <Col span={16}> <Paragraph copyable>{appPublishLink}</Paragraph></Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <FormItem label="审批意见" {...formLayout}>
            <TextArea 
              maxLength={80}
              value={auditRemark}
              placeholder="请输入审批意见"
              suffix={<span>{`${auditRemark.length}/200`}</span>}
              onChange={( e )=>{
                this.setState( {
                  auditRemark: e.target.value
                } )
              }}
            />
          </FormItem>
          <div className={styles.btnBox}>
            <Popconfirm
              title="确定通过审批吗？"
              onConfirm={() => {
                this.getAudit( true )
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" style={{ width:'150px' }}>通过</Button>
            </Popconfirm>
            <Popconfirm
              title="确定驳回审批吗？"
              onConfirm={() => {
                this.getAudit( false )
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ width:'150px' }} type='danger'>驳回</Button>
            </Popconfirm>
            
          </div>
        </Row>
      </Modal>
    );
  };

  renderAuditFlowModal = () => {
    const { auditFlow } = this.props;
    const { auditingFlow } = this.state;
    if ( !auditFlow.length ) return null;
    const [item1 = {}, item2 = {}] = auditFlow;
    let text = '';
    if ( item2.approvalState === 'PASS' ) 
      text =  (
        <div>
          <div>{`${item2.username},于${item2.createTime}审批通过`}</div>
          {item2.remark ? <div style={{ marginTop: '10px' }}>审批意见: {item2.remark}</div> : null}
        </div>
    );
    if ( item2.approvalState === 'NOPASS' )
      text = (
        <div>
          <div>{`${item2.username},于${item2.createTime}审批不通过`}</div>
          {item2.remark ? <div style={{ marginTop: '10px' }}>审批意见: {item2.remark}</div> : null}
        </div>
      );
    if ( item2.approvalState === 'PENDING' ) text = item2.username;
    return (
      <Modal
        title="审批流程"
        visible={auditingFlow}
        okText="确定"
        onCancel={() => {
          this.setState( {
            auditingFlow: false,
          } );
        }}
        footer={[
          <Button
            type="primary"
            onClick={() => {this.setState( {
            auditingFlow: false,
          } );}}
          >
            确定
          </Button>
        ]}
      >
        <Steps direction="vertical" current={auditFlow.length - 1}>
          <Step title="提交成功" description={`${item1.username},于${item1.createTime}提交审批`} />
          <Step title={statusMap[item2.approvalState]} description={text} />
        </Steps>
      </Modal>
    );
  };

  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter };
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo:sotrObj
    }, ()=>{
      this.getAuditList()
    } )
  };

  onTabsChange = key => {
    this.setState( {
      activeKey: key,
      pageNum: 1,
      pageSize: 10,
      searchData:{}
    }, ()=>{
      this.filterSubmit( {} )
    } );
  };

  render () {
    const { loading, auditCount:{ mine, approved, approval }, auditList: { list, total }, } = this.props;
    const { activeKey, preSearchData, pageNum, pageSize, sortedInfo } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      },
    }; 

    const columns = [
      {
        title: '审批业务',
        dataIndex: 'isUpdate',
        render: isUpdate => <div>{isUpdate ? '活动修改' : '活动发布'}</div>,
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        render: name => <div>{name}</div>,
      },
      {
        title: '活动ID',
        dataIndex: 'activityId',
        render: createTime => <div>{createTime}</div>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'start_time',
        render: startTime => <div>{startTime || '--'}</div>,
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'start_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'end_time',
        render: endTime => <div>{endTime || '--'}</div>,
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '审核状态',
        dataIndex: 'approvalState',
        render: approvalState => <div>{statusMap[approvalState]}</div>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'update_time',
        render: createTime => <div>{createTime || '--'}</div>,
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '创建人',
        dataIndex: 'createUsername',
        render: createNick => <div>{createNick}</div>,
      },
      {
        title: '操作',
        render: record => (
          <>
            {activeKey === 'APPROVAL' ? (
              <span
                onClick={() => {this.getAuditItemDetail( record.id )}}
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                type="link"
              >
                审核
              </span>
            ) : null}
            <span
              onClick={() => {
                this.handleOpenAuditFlowModal( record.id );
              }}
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
            >
              审批流
            </span>
          </>
        ),
      },
    ];
    return (
      <GridContent>
        <Card bordered={false} title="活动审批" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
          <Tabs
            activeKey={activeKey}
            onChange={e => {
              this.onTabsChange( e );
            }}
          >
            <TabPane tab={`我的发起(${mine})`} key="MINE" />
            {authority && <TabPane tab={`待审批(${approval})`} key="APPROVAL" />}
            {authority && <TabPane tab={`已审批(${approved})`} key="APPROVED" />} 
            
          </Tabs>
          <SearchBar
            preSearchData={preSearchData}
            searchEleList={searchEleList}
            ref={this.searchBar}
            searchFun={this.filterSubmit}
            loading={loading}
          />
          <Table
            rowKey="id"
            columns={columns}
            loading={loading}
            dataSource={list}
            onChange={this.tableChange}
            pagination={paginationProps}
          />
        </Card>
        {this.renderAuditFlowModal()}
        {this.renderAuditModal()}
      </GridContent>
    );
  }
}



export default connect( ( { activityAudit } ) => ( {
  loading: activityAudit.loading,
  auditList: activityAudit.auditList,
  auditFlow: activityAudit.auditFlow,
  auditCount:activityAudit.auditCount,
  auditItemDetail:activityAudit.auditItemDetail
} ) )( ActivityAudit );