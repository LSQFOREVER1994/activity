/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-24 10:22:24
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-22 15:01:16
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelLink/ChannelLink.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'dva';
import moment from 'moment';
import { Card, Breadcrumb, Row, Col, DatePicker, Table, message, Button, Form, Select, Modal, Popconfirm } from 'antd';
import copy from 'copy-to-clipboard';
import * as QRCode from 'qrcode';
import { Pie } from '@antv/g2plot';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './channelLink.less';

const columns = [
  {
    title: '渠道',
    dataIndex: 'channelName',
  },
  {
    title: '浏览量',
    dataIndex: 'viewNum',
  },
  {
    title: '页面平均浏览时长',
    dataIndex: 'stayTime',
  },
]

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;

const timeRanges = [
  { key: 'today', label: '今日', range: [moment().startOf( 'day' ), moment().endOf( 'day' )] },
  { key: 'lastWeek', label: '近7天', range: [moment().subtract( 6, 'days' ).startOf( 'day' ), moment().endOf( 'day' )] },
  { key: 'lastMonth', label: '近30天', range: [moment().subtract( 29, 'days' ).startOf( 'day' ), moment().endOf( 'day' )] },
];
 function ChannelLink( props ) {
  const { closeUserActionPage, dispatch, activityId, form, channelData, channelList, selectChannelList, loading } = props
  const { getFieldDecorator, validateFields } = form
  const [currentTimeRange, setCurrentTimeRange] = useState( 'today' )
  const [rangePickerValue, setRangePickerValue] = useState( timeRanges.find( tr => tr.key === 'today' ).range );
  const [addChannelModalVisible, setAddChannelModalVisible] = useState( false )
  const containerRef = useRef( null );
  const canvasRef = useRef( null );

  const getActivityChannelList = () => {
    dispatch( {
      type:'channelDetail/getActivityChannelList',
      payload:{
        query:{
          activityId
        },
        callFunc:()=>{

        }
    } } )
  }

  // 活动数据来源类型channelType(1.渠道 2.客户经理)
  const getActivityChannelData = () => {
    if ( !rangePickerValue || rangePickerValue.length !== 2 ) return
    const beginTime = moment( rangePickerValue[ 0 ] ).format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = moment( rangePickerValue[ 1 ] ).format( 'YYYY-MM-DD HH:mm:ss' );
    dispatch( {
      type:'channelDetail/getActivityChannelData',
      payload:{
        query:{
          appId:activityId,
          beginTime,
          endTime,
          channelType: 1
        },
        callFunc:()=>{

        }
      } 
    } )
  }

  const getSelectChannelList = () => {
    dispatch( {
      type:'channelDetail/getActivityAllChannel',
      payload:{
        query:{},
        callFunc:()=>{
          setAddChannelModalVisible( true )
        }
      }
    } )
  }

  const getAddNewChannel = ( params ) => {
    dispatch( {
      type:'channelDetail/addActivityChannel',
      payload:{
        query:params,
        callFunc:()=>{
          getActivityChannelList()
          setAddChannelModalVisible( false )
          form.resetFields()
        }
      }
    } )
  }

  const updateChannelStatus = ( params ) => {
    dispatch( {
      type:'channelDetail/updateChannelStatus',
      payload:{
        query:params,
        callFunc:()=>{
          getActivityChannelList()
        }
      }
    } )
  }

  const copyLink = ( e, publishLink ) => {
    e.stopPropagation();
    const tag = copy( publishLink );
    if ( tag ) {
      message.success( '复制链接成功' );
    } else {
      message.error( '复制失败，重新点击或手动复制' );
    }
  };
  
  const generateAndDownloadQRCode = async ( url ) => {
    const canvas = canvasRef.current;
    try {
      await QRCode.toCanvas( canvas, url, { width: 300 } );
      const link = document.createElement( 'a' );
      link.href = canvas.toDataURL( 'image/png' );
      link.download = 'qrcode.png';
      link.click();
      message.success( '下载二维码成功' );
    } catch ( error ) {
      message.error( '下载二维码失败' );
    }
  };

  const handleRangePickerChange = ( dates ) => {
    setRangePickerValue( dates );
    setCurrentTimeRange( '' );
  };

  const renderAddChannelModal = () => {
    return (
      <Modal
        title='新增渠道链接'
        visible={addChannelModalVisible}
        okText='确定'
        cancelText='取消'
        onOk={()=>{
          validateFields( ( err, values ) => {
            if ( !err ) {
              const params = { ...values, activityId }
              getAddNewChannel( params )
            }
          } );
        }}
        onCancel={()=> {
          setAddChannelModalVisible( false )
          form.resetFields()
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="渠道名称">
            {getFieldDecorator( 'channelId', {
              rules: [{ required: true, message: '请选择渠道名称' }],
            } )( 
              <Select placeholder="请选择渠道名称">
                {
                 selectChannelList?.length && selectChannelList.map( ( item )=>(
                   <Option key={item.id} value={item.id}>{item.name}</Option>
                ) )
                }
              </Select> )}
          </FormItem>
        </Form>
        
      </Modal>
    )
  }

  const renderTimeRangeButton = ( timeRange ) => (
    <div
      key={timeRange.key}
      className={currentTimeRange === timeRange.key ? styles.active : ''}
      onClick={() => setCurrentTimeRange( timeRange.key )}
    >
      {timeRange.label}
    </div>
  );

  const columns2 = [
    {
      title: '渠道',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: ( status ) => {
        return status ? '启用' : '禁用'
      }
    },
    {
      title: '链接',
      dataIndex: 'link',
    },
    {
      title: '操作',
      render: ( record ) => {
        return (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( event )=>{  copyLink( event, record.link ) }}
            >
              复制链接
            </span>
            <span 
              style={{ cursor: 'pointer', marginRight: 15, color: '#1F3883' }}
              onClick={()=>{ generateAndDownloadQRCode( record.qrCodeLink )}}
            >
              下载二维码
            </span>
            <Popconfirm
              placement="top"
              title={`是否确认${record.status ? '禁用' : '启用'}`}
              onConfirm={()=>{ updateChannelStatus( { id: record.id, status: !record.status } )}}
              okText="是"
              cancelText="否"
            >
              <span 
                style={{ cursor: 'pointer', marginRight: 15, color: record.status ? '#f5222d' : '#1890ff' }}
              >
                {record.status ? '禁用' : '启用'}
              </span>
            </Popconfirm>
          </div>
        )
      }
    },
  ]

  useEffect( ()=>{
    const piePlot = new Pie( containerRef.current, {
      appendPadding: 10,
      data:channelData,
      angleField: 'value',
      colorField: 'channelName',
      radius: 0.6,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name} {percentage}',
      },
      interactions: [{ type: 'element-active' }],
      tooltip: {
        showTitle: false,
        showMarkers: false,
      },
      state: {
        active: {
          style: {
            shadowBlur: 4,
            stroke: '#000',
            fillOpacity: 0.65,
          },
        },
      },
      legend: {
        position: 'bottom',
      },
    } );
    // 渲染图表
    piePlot.render();

    // 清理函数
    return () => {
      piePlot.destroy();
    };
  }, [channelData]  )

  useEffect( ()=>{
    getActivityChannelList()
  }, [] )

  useEffect( () => {
    if( currentTimeRange ){
      const selectedRange = timeRanges.find( tr => tr.key === currentTimeRange ).range;
      setRangePickerValue( selectedRange );
    }
  }, [currentTimeRange] );

  useEffect( ()=>{
    getActivityChannelData();
  }, [rangePickerValue] )


  return (
    <GridContent>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <a onClick={() => { closeUserActionPage() }}>数据中心</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>渠道链接</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        bordered={false}
        title='渠道链接'
        bodyStyle={{ padding: '20px 32px 40px 32px' }}
      >
        <Row>
          <Col span={13}>{}
            <div ref={containerRef} />
            <div style={{ textAlign: 'center' }}>每一小时更新一次数据</div>
          </Col> 
          <Col span={11}>
            <Row>
              <Col span={10}>
                <div className={styles.timeRangeContainer}>
                  {timeRanges.map( renderTimeRangeButton )}
                </div>
              </Col>
              <Col span={12} style={{ marginLeft:'10px' }}>
                <RangePicker value={rangePickerValue} onChange={handleRangePickerChange} />
              </Col>
            </Row>
            <div style={{ marginTop:'24px' }}>
              <Table 
                dataSource={channelData}
                columns={columns}
                rowKey="id"
                size='small'
                pagination={false}
                loading={loading}
              />
            </div>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        title='渠道链接详情'
        bodyStyle={{ padding: '20px 32px 40px 32px' }}
        style={{ marginTop:'20px' }}
      >
        <div style={{ textAlign:'right', marginBottom:'20px' }}>
          <Button type='primary' onClick={getSelectChannelList}>新增渠道链接</Button>
        </div>
        <Table 
          dataSource={channelList}
          columns={columns2}
          rowKey="channel"
          size='small'
          pagination={false}
          loading={loading}
        />
      </Card>
      {renderAddChannelModal()}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </GridContent>
  )
}

export default connect( ( state )=>( {
  loading: state.channelDetail.loading,
  channelList:state.channelDetail.channelList,
  selectChannelList:state.channelDetail.selectChannelList,
  channelData:state.channelDetail.channelData,
} ) )( Form.create()( ChannelLink )  ) ;