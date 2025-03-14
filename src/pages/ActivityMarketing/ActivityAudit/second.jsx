/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-21 10:51:40
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-07-04 14:12:45
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ActivityAudit/index.jsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import { Card, Tabs, Table, Modal, Steps, Button, Row, Col, Typography, Form, Input, Popconfirm } from 'antd';
import SearchBar from '@/components/SearchBar';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getUrlParameter } from '@/utils/utils'
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
        value: false,
      },
      {
        label: '活动修改流程',
        value: true,
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
const viewNowId = getUrlParameter( 'viewNowId' );
function ActivityAudit( props ) {
  const {
    loading,
    dispatch,
    auditList: { list, total },
    auditFlow,
    history,
    auditCount:{ mine, approved, approval },
    auditItemDetail,
  } = props;
  
  const searchBar = useRef( null );
  const [activeKey, setActiveKey] = useState( 'MINE' );
  const [searchData, setSearchData] = useState( {} );
  const [auditingFlow, setAuditingFlow] = useState( false );
  const [auditVisible, setAuditVisible] = useState( false )
  const [auditRemark, setAuditRemark] = useState( '' )
  const [preSearchData, setPreSearchData] = useState( {} )
  const [pageObj, setPageObj] = useState( {
    pageSize: 10,
    pageNum: 1,
  } );
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'update_time',
    field: 'updateTime',
    order: 'descend',
  } );

  const getAuditList = () => {
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`;
    dispatch( {
      type: 'activityAudit/getAuditList',
      payload: {
        query: {
          page: {
            orderBy,
            ...pageObj,
          },
          type: activeKey,
          ...searchData,
        },
        callFunc: () => {},
      },
    } );
  };


  const getAuditNum = () => {
    dispatch( {
      type:'activityAudit/getAuditNum',
      payload:{
        query:{
          
        },
        callFunc:()=>{}
      }
    } )
  }

  const getAuditItemDetail = ( id ) => {
    dispatch( {
      type:'activityAudit/getAuditItemDetail',
      payload:{
        query:{ id },
        callFunc:()=>{
          setAuditVisible( true )
        }
      }
    } )
  }

  const handleOpenAuditFlowModal = id => {
    dispatch( {
      type: 'activityAudit/getAuditFlow',
      payload: {
        query: {
          id,
        },
        callFunc: () => {
          setAuditingFlow( true );
        },
      },
    } );
  };

  const filterSubmit = data => {
    const { isUpdate, ...rest } = data;
    const params = isUpdate === '' ? rest : data;
    setSearchData( params );
    setPageObj( {
      pageSize: 10,
      pageNum: 1,
    } );
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
      render: approvalState => <div>{approvalState}</div>,
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
              onClick={() => {getAuditItemDetail( record.id )}}
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
            >
              审核
            </span>
          ) : null}
          <span
            onClick={() => {
              handleOpenAuditFlowModal( record.id );
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

  const getActivityConfig = ( ) => {
    const { activityId } = auditItemDetail || {}
    if( !activityId ) return
    sessionStorage.setItem( 'auditId', activityId );
    history.push( `/activityTemplate/bees` );
  } 

  const getAudit = ( idea ) => {
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
          setAuditVisible( false )
          getAuditList()
        }
      }
    } )
  }

  // 预览二维码
  const renderAuditModal = () => {
    const { publishLink, coverPicture, appPublishLink, appQrCodePublishLink  } = auditItemDetail
    return (
      <Modal
        title='活动审核'
        visible={auditVisible}
        footer={null}
        onCancel={()=>{setAuditVisible( false )}}
        width="800px"
      >
        <Row className={styles.previewModal}>
          <Col span={12}>
            <div className={styles.coverPictureBox}>
              <img className={styles.coverPicture} src={coverPicture} alt="" />
            </div>
          </Col>
          <Col span={12} style={{ padding: '0 10px' }}>
            <div style={{ textAlign: 'right', paddingRight: '5px' }}>
              <Button type="primary" onClick={getActivityConfig}>查看配置内容</Button>
            </div>
            <Row style={{ marginTop: '20px' }}>
              <Col span={10} className={styles.label}>
                活动二维码:
              </Col>
              <Col span={14}>
                <QRCode value={publishLink} size={200} fgColor="#000000" />
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={10} className={styles.label}>
                活动链接:
              </Col>
              <Col span={14}>
                {' '}
                <Paragraph copyable>{publishLink}</Paragraph>
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={10} className={styles.label}>
                APP内活动二维码:
              </Col>
              <Col span={14}>
                <QRCode value={appQrCodePublishLink} size={200} fgColor="#000000" />
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={10} className={styles.label}>
                APP内活动链接:
              </Col>
              <Col span={14}>
                {' '}
                <Paragraph copyable>{appPublishLink}</Paragraph>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <FormItem label="审批意见" {...formLayout} style={{ marginTop: '20px' }}>
            <TextArea 
              maxLength={80}
              value={auditRemark}
              placeholder="请输入审批意见"
              suffix={<span>{`${auditRemark.length}/200`}</span>}
              onChange={( e )=>{setAuditRemark( e.target.value )}}
            />
          </FormItem>
          <div className={styles.btnBox}>
            <Popconfirm
              title="确定通过审批吗？"
              onConfirm={() => {
                getAudit( true )
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" style={{ width:'150px' }}>通过</Button>
            </Popconfirm>
            <Popconfirm
              title="确定驳回审批吗？"
              onConfirm={() => {
                getAudit( false )
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

  const renderAuditFlowModal = () => {
    if ( !auditFlow.length ) return null;
    const [item1 = {}, item2 = {}] = auditFlow;
    let text = '';
    if ( item2.approvalState === 'PASS' ) text = `${item2.username},于${item2.createTime}审批通过`;
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
          setAuditingFlow( false );
        }}
        footer={[
          <Button type="primary" onClick={() => setAuditingFlow( false )}>
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

  

  const tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter };
    setPageObj( {
      pageNum: current,
      pageSize,
    } );
    setSortedInfo( sotrObj );
  };

  const onTabsChange = key => {
    setPageObj( {
      pageNum: 1,
      pageSize: 10,
    } );
    setSearchData( {} );
    setActiveKey( key );
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageObj.pageSize,
    total,
    current: pageObj.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
    },
  };

  useEffect( () => {
    getAuditList();
  }, [searchData, pageObj] );

  useEffect( ()=>{
    filterSubmit( preSearchData )
  }, [preSearchData] )

  useEffect( ()=>{
    getAuditNum();
    if( viewNowId ){
      setActiveKey( 'APPROVAL' )
      setPreSearchData( { activityId : viewNowId } )
    } 
  }, [] )
  return (
    <GridContent>
      <Card bordered={false} title="活动审批" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
        <Tabs
          loading={loading}
          activeKey={activeKey}
          onChange={e => {
            onTabsChange( e );
          }}
        >
          <TabPane tab={`我的发起(${mine})`} key="MINE" />
          {authority && <TabPane tab={`待审批(${approval})`} key="APPROVAL" />}
          {authority && <TabPane tab={`已审批(${approved})`} key="APPROVED" />} 
          
        </Tabs>
        <SearchBar
          preSearchData={preSearchData}
          searchEleList={searchEleList}
          ref={searchBar}
          searchFun={filterSubmit}
          loading={loading}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          onChange={tableChange}
          pagination={paginationProps}
        />
      </Card>
      {renderAuditFlowModal()}
      {renderAuditModal()}
    </GridContent>
  );
}

export default connect( ( { activityAudit } ) => ( {
  loading: activityAudit.loading,
  auditList: activityAudit.auditList,
  auditFlow: activityAudit.auditFlow,
  auditCount:activityAudit.auditCount,
  auditItemDetail:activityAudit.auditItemDetail
} ) )( ActivityAudit );