/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Modal, Input, Radio, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import RecordList from './recordList';
import { getPageQuery } from '@/utils/utils';

import styles from '../../Lists.less'

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const typeObj={
  "MOGUL_ATTENTION": '大佬关注',
  "INSTITUTIONAL_DISCUSSION":'机构热议',
  'MAIN_TREND':'主力方向',
  'LONG_TERM_LAYOUT':'长线布局'
}

const auditStateObj={ 
  'PENDING':'待审核',
  'PASSED':'已通过',
  'REJECTED':'已拒绝'
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  auditList: tool.auditList
} ) )
@Form.create()

class List extends PureComponent {
  constructor( props ) {
    super( props )
     const params = getPageQuery();
    const { id } = params;
    this.state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    auditState:"",
    auditVisible:false,
    recordVisible:false,
    activityId:id

  }
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  componentDidMount() {
    this.fetchList();
  };

  // 初始化 页面获取列表
  fetchList = () => {
    const { dispatch } = this.props;
    const { pageSize, pageNum, auditState, activityId } = this.state;
    dispatch( {
      type: 'tool/getAuditList',
      payload: {
        pageSize,
        pageNum,
        auditState,
        activityId,
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList () );
  };


  //  显示编辑 Modal
  showModal = ( type, item ) => {
    this.setState( {
      [`${type}`]: true,
      info:item
    } );
  };

  //  取消
  handleCancel = ( type ) => {
    this.setState( {
      [`${type}`]: false,
      info: undefined,
    } );
  };

  //  提交(添加或者编辑标签)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { info } = this.state;
    const id = info ? info.id : '';
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( info, fieldsValue ) : { ...fieldsValue };
      dispatch( {
        type: 'tool/submitPaper',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              info: undefined,
            } );
            $this.fetchList()
          },
        },
      } );
    } );
  };

  // 审核
  goAudit = ( e, type ) => {
    e.stopPropagation();
    const{ info }=this.state;
    const{ id }=info;
    const $this = this;
    const { dispatch }=this.props;
    dispatch( {
      type: 'tool/goAudit',
      payload: {
        newsId:id,
        state: type
      },
      callFunc: () => {
        $this.setState( { auditVisible:false } )
        $this.fetchList()
      },
    } );
  }


  onChange=( e )=>{
    this.setState( {
      auditState:e.target.value,
      pageNum:1,
      pageSize:10,
    }, ()=>this.fetchList() )
  }


  render() {
    const { loading, auditList: { total, list }, form: { getFieldDecorator, getFieldValue } } = this.props;
    const { pageSize, pageNum, visible, info = {}, auditVisible, recordVisible } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <span>审核状态：</span>
        <RadioGroup buttonStyle="solid" onChange={this.onChange} defaultValue="">
          <RadioButton value="">全部</RadioButton>
          {
           Object.keys( auditStateObj ).map( key => (
             <RadioButton key={key} value={key}>{auditStateObj[key]}</RadioButton>
            ) )
          }
        </RadioGroup>
      </div>
    );


    const columns = [
      {
        title: <span>文章标题</span>,
        dataIndex: 'title',
        width:350,
        render:title => <div className={styles.titleBox}>{title}</div>
      },
      {
        title: <span>类型</span>,
        dataIndex: 'type',
        render: type => <span>{typeObj[type] || '--'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime	|| '--'}</span>,
      },
      {
        title: <span>审核状态</span>,
        dataIndex: 'auditState',
        render: auditState => <span>{auditStateObj[auditState] || '--'}</span>,
      },
      {
        title: <span>审核时间</span>,
        dataIndex: 'auditTime',
        render: auditTime => <span>{auditTime || '--'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        fixed: 'right',
        width:150,
        render: ( id, item ) =>{
          if( item.auditState === 'PENDING' ){
            return(
              <div>
                <span
                  style={{ cursor:'pointer', color:'#1890ff'  }}
                  type="link"
                  onClick={() => this.showModal( 'auditVisible', item )}
                >
                  审核
                </span>

                <span
                  style={{  margin:'0 15px', cursor:'pointer', color:'#f5222d' }}
                  type="link"
                  onClick={() => this.showModal( 'visible', item )}
                >
                  详情
                </span>
              </div>
            )
          }
          return(
            <div>
              <span
                style={{ cursor:'pointer', color:'#1890ff'  }}
                type="link"
                onClick={() => this.showModal( 'visible', item )}
              >
                详情
              </span>

              <span
                style={{  margin:'0 15px', cursor:'pointer' }}
                type="link"
                onClick={() => this.showModal( 'recordVisible', item )}
              >
                审核记录
              </span>
            </div>
          )
        }
      },
    ];

    
    return (
      <GridContent>
        <div>
          <Card
            bordered={false}
            title="文章审核列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
            extra={extraContent}
          >

            {/* 显示列表 */}
            <Table
              size="large"
              rowKey="id"
              scroll={{ x: 1200 }}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>

        {/* 添加，编辑模板 */}
        <Modal
          title='详情(不可编辑)'
          width={840}
          bodyStyle={{ padding: '12px 24px', maxHeight: '75vh', overflow: "auto" }}
          destroyOnClose
          visible={visible}
          onCancel={()=>this.handleCancel( 'visible' )}
          footer={null}
        >
          <Form>
            <FormItem label='文章标题' {...this.formLayout}>
              {getFieldDecorator( 'title', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}文章标题` }],
                  initialValue: info.title,
                } )( <Input disabled /> )}
            </FormItem>

            <FormItem label='类型' {...this.formLayout}>
              {getFieldDecorator( 'type', {
                  rules: [{ required: true, message: `请选择类型` }],
                  initialValue: info.type,
                } )( 
                  <Select placeholder="请选择类型" disabled>
                    {
                      Object.keys( typeObj ).map( item =>(
                        <Option key={item}>{typeObj[item]}</Option>
                      ) )
                    }
                  </Select>
                )}
            </FormItem>

            <div style={{ display:'flex', justifyContent:'center', color:'#000000d9', fontSize:14 }}>
              <div style={{ display:'flex', paddingRight:'18%' }}>
                <div className={styles.edit_acitve_tab} style={{ paddingTop:'10px' }}>本篇付费：</div>
                <FormItem>
                  {getFieldDecorator( 'chargeType', {
                    rules: [{ required: true }],
                    initialValue: info.chargeType || 'CHARGE',
                  } )(
                    <RadioGroup disabled>
                      <Radio value="CHARGE">是</Radio>
                      <Radio value="FREE">否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>

              <div style={{ display:'flex', paddingLeft:15 }}>
                <div className={styles.edit_acitve_tab} style={{ paddingTop:'10px' }}>子栏目置顶：</div>
                <FormItem>
                  {getFieldDecorator( 'subSectionTop', {
                    rules: [{ required: true }],
                    initialValue: info.subSectionTop !== undefined ? info.subSectionTop : true,
                  } )(
                    <RadioGroup disabled>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'center', color:'#000000d9', fontSize:14 }}>
              <div style={{ display:'flex', paddingRight:'18%' }}>
                <div style={{ paddingTop:'10px' }}>首页展示：</div>
                <FormItem>
                  {getFieldDecorator( 'homeShow', {
                    rules: [{ required: false }],
                    initialValue: info.homeShow !== undefined ? info.homeShow : true,
                  } )(
                    <RadioGroup disabled>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>

              <div style={{ display:'flex', paddingLeft:20 }}>
                <div style={{ paddingTop:'10px' }}>首页置顶：</div>
                <FormItem>
                  {getFieldDecorator( 'homeTop', {
                    rules: [{ required: false }],
                    initialValue: info.homeTop !== undefined ? info.homeTop : false,
                  } )(
                    <RadioGroup disabled>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>

            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                rules: [{ required: true }],
                initialValue: info.state || 'DISABLE',
              } )(
                <RadioGroup disabled>
                  <Radio value='ENABLE'>上架</Radio>
                  <Radio value='DISABLE'>下架</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label='悬疑式标题' {...this.formLayout}>
              {getFieldDecorator( 'suspiciousTitle', {
                rules: [{ required: true, message: `请输入悬疑式标题` }],
                initialValue: info.suspiciousTitle,
              } )( <Input
                disabled 
                placeholder={`${formatMessage( { id: 'form.input' } )}悬疑式标题`}
              /> )}
            </FormItem>

            <FormItem label='悬疑式详情' {...this.formLayout}>
              {getFieldDecorator( 'suspiciousDetail', {
                rules: [{ required: getFieldValue( 'chargeType' ) !== 'CHARGE', message: `请输入悬疑式标题` }],
                initialValue: info.suspiciousDetail,
              } )( <BraftEditor
                readOnly 
                record={info.suspiciousDetail}
                fieldDecorator={getFieldDecorator}
                field="content"
                contentStyle={{ height: '350px' }}
              /> )}
            </FormItem>
            {
              getFieldValue( 'chargeType' ) === 'CHARGE' &&
              <div>
                <FormItem label='未解锁文章标题' {...this.formLayout}>
                  {getFieldDecorator( 'unlockedTitle', {
                    rules: [{ required: false }],
                    initialValue: info.unlockedTitle,
                  } )( <Input disabled /> )}
                </FormItem>
                <FormItem label='未解锁文章详情' {...this.formLayout}>
                  {getFieldDecorator( 'unlockedDetail', {
                    rules: [{ required: false }],
                    initialValue: info.unlockedDetail,
                  } )( <BraftEditor 
                    readOnly
                    record={info.unlockedDetail}
                    fieldDecorator={getFieldDecorator}
                    field="content"
                    contentStyle={{ height: '350px' }}
                  /> )}
                </FormItem>
              </div>
            }
            <FormItem label='解锁文章详情' {...this.formLayout}>
              {getFieldDecorator( 'lockedDetail', {
                rules: [{ required: true, message: `请输入解锁文章详情` }],
                initialValue: info.lockedDetail,
              } )( <BraftEditor
                readOnly
                record={info.lockedDetail}
                fieldDecorator={getFieldDecorator}
                field="content"
                contentStyle={{ height: '350px' }}
              /> )}
            </FormItem>

          </Form>
        </Modal>
        <Modal
          width={350}
          bodyStyle={{ textAlign:'center' }}
          destroyOnClose
          visible={auditVisible}
          onCancel={()=>this.handleCancel( 'auditVisible' )}
          footer={null}
        >
          <div style={{ padding:'20px 0' }}>
            是否通过审核？
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <Button type='primary' onClick={( e ) => this.goAudit( e, 'PASSED' )}>通过并发布</Button>
            <Button style={{ marginLeft:20 }} onClick={( e ) => this.goAudit( e, 'REJECTED' )}>拒绝</Button>
          </div>
        </Modal>
        <Modal
          title='审核记录'
          width={830}
          visible={recordVisible}
          onCancel={()=>this.handleCancel( 'recordVisible' )}
          destroyOnClose
          footer={null}
        >
          <RecordList newsId={info.id} />
        </Modal>
      </GridContent>
    );
  };
}

export default List;