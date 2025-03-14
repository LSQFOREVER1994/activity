/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Form, Modal, Input, message, Radio, Checkbox, Icon, Upload, Row, Col, Tag  } from 'antd';
import { findDOMNode } from 'react-dom';
import cookies from 'js-cookie';
import moment from 'moment';
import serviceObj from  '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import FilterForm from './FilterForm'
import styles from '../education.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { courseService, subjectUrl } = serviceObj;

@connect( ( { course } ) => ( {
  loading: course.loading,
  tagsListResult: course.tagsListResult,
  subjectListResult: course.subjectListResult
} ) )
@Form.create()

class SubjectList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    choices: Array( 4 ),
    selectedRowKeys: [],
    settingState:"entering",
    indexFileList:0,
    importList:[],
    questionType:'CHOICE', // 题目类型
    detail:null,
    choicesDetail:null,
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getTagsList',
      payload: {
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
      }
    } )
    this.fetchList()
  };

  fetchList = () => {
    const { pageSize, pageNum } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, content, createTime, enable, tagsId } = formValue;
    const startTime = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const endTime = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getSubjectList',
      payload: {
        pageSize,
        pageNum,
        id,
        orderBy: 'create_at desc',
        'tag.id': tagsId,
        enable,
        content,
        startTime,
        endTime
      }
    } );
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>{this.fetchList()} );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      settingState:'entering',
      current: { choice: [{}, {}, {}, {}] }
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {
    const { dispatch } = this.props;
    const $this = this;
    dispatch( {
      type: 'course/getSubjectDetail',
      payload: {
        id,
        callFunc: ( result ) => {
          $this.setState( {
            visible: true,
            settingState:'entering',
            current: result,
            choicesDetail:result.choice,
            detail:result,
            questionType:result.type
          } );
        },
      }
    } );
  };

  //  取消
  handleCancel = () => {
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      choicesDetail:null,
      detail:null,
      settingState:'entering',
      questionType:'CHOICE', // 题目类型
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, tagsListResult: { list } } = this.props;
    const { current, settingState, importList } = this.state;
    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      if( settingState==="entering" ){
        const params = Object.assign( current, fieldsValue, { update: true } );
        // params.enable = params.enable === 'ENABLE' ? params.enable = true : params.enable = false;
        params.tags = params.tags.map( item => { return { id: item, name: list.find( o => o.id === item ).name }} );
        const isUpdate = !!id;
        params.choice = params.choice.filter( item => item.answer );
        if ( params.choice.filter( item => item.result ).length <= 0 ) {
          message.error( '请选择一个正确答案' );
          return;
        }
        dispatch( {
          type: 'course/submitSubject',
          payload: {
            params,
            isUpdate,
            callFunc: () => {
              $this.setState( {
                visible: false,
                choicesDetail:null,
                detail:null,
                settingState:'entering',
                questionType:'CHOICE', // 题目类型
              }, ()=>{$this.fetchList()} );
            },
          },
        } );
      }else{
        const params = { ...fieldsValue }
        params.tags = params.tags.map( item => { return { id: item, name: list.find( o => o.id === item ).name }} );
        importList.map( ( item )=>{
          return Object.assign( item, { ...params } )
        } )
        dispatch( {
          type: 'course/importSubject',
          payload:{
            importList,
            callFunc: () => {
              $this.setState( {
                visible: false,
                settingState:'entering',
                indexFileList:0,
              }, ()=>{$this.fetchList()} );
            },
          }
        } )
      }

    } );
  };

  // 删除文章
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum } = this.state;
    // const { tagsId } = this.state;
    const { dispatch } = this.props;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: '确定删除该题目',
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delSubject',
          payload: {
            id,
            callFunc: () => {
              $this.setState( { pageSize, pageNum, settingState:'entering' }, ()=>{$this.fetchList()} );
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  // //  获取课程名称
  // getCourseName = ( tagsId ) => {
  //   const { tagsListResult: { list } } = this.props;
  //   return list.find( item => item.id === parseInt( tagsId, 10 ) ) ? list.find( item => item.id === parseInt( tagsId, 10 ) ).name : ''
  // }

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    this.setState( {
      pageNum: 0,
    }, () => {
      this.fetchList()
    } )
  }

  //  选项更改
  choiceChange = ( e, index ) => {
    const { value } = e.target;
    const { choices } = this.state;
    choices.fill( value, index, index + 1 );
    this.setState( { choices } )
  }

  editChoice = ( e, index ) => {
    const { current } = this.state;
    current.choice[index].answer = e.target.value;
    this.setState( { current } );
  }

  editChoiceResult = ( e, index ) => {
    const { current } = this.state;
    current.choice[index].result = e.target.checked;
    this.setState( { current } );
  }

  addChoice = () => {
    const { current } = this.state;
    current.choice.push( {} );
    this.setState( { current: Object.assign( {}, current ) } );
  }

  deleteChoice = ( index ) => {
    const { current } = this.state;
    current.choice = current.choice.filter( ( item, i ) => i !== index );
    this.setState( { current: Object.assign( {}, current ) } );
  }

  //  批量删除
  delBatch = () => {
    const { pageSize, pageNum, selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    const $this = this;
    dispatch( {
      type: 'course/delBatchSubject',
      payload: {
        ids: selectedRowKeys,
        callFunc: () => {
          $this.setState( { pageSize, pageNum, selectedRowKeys: [], settingState:'entering' }, ()=>{$this.fetchList()} );
        },
      }
    } );
  }

  // 多选
  onSelectChange = ( selectedRowKeys ) => {
    this.setState( { selectedRowKeys } );
  }

  // 设置方式切换
  settingChang =( e )=>{
    this.setState( {
      settingState: e.target.value,
    } );
  }


  //  上传
  getPdfURL=()=>{
    const { indexFileList } = this.state;
    const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
    const tokenObj = token ? { 'X-Auth-Token': token } : {};
    const $this = this
    const importProps = {
      name: 'file',
      action: `${courseService}/questions/import`,
      accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,",
      headers:{ Accept: 'application/json', ...tokenObj },
      onChange( info ) {
        if ( info.file.status !== 'uploading' ) {
          // message.warning( '上传中' )
          console.log( 'uploading 上传中...' )
        }
        if ( info.file.status === 'done' && info.fileList[indexFileList].response !== '' ) {
          const { response:{ result } }=info.file;
          $this.setState( { importList:result, indexFileList:indexFileList+1 } )
          message.success( '导入题目成功，请选择标签名称并保存' );
        } else if ( info.file.status === 'error' || info.fileList[indexFileList].response === '' ) {
          $this.setState( { indexFileList:indexFileList+1 } )
          message.error( '导入失败，请查看模板内容是否正确或者手动录入' );
        }
      },
    }
    return importProps
  }

  questionTypeChange = ( e ) => {
    const type = e.target.value;
    const { current }=this.state
    if( !current.id ){
      if( type==='SIMPLE' ){
        current.choice=[{ result:true }]
      }else if( type==='CHOICE'  ){
        current.choice=[{}, {}, {}, {}]
      }
    }else if( current.id ){
      if( type === this.state.detail.type ){
        this.state.current.choice = this.state.choicesDetail
      }else if( type !== this.state.detail.type && type==='CHOICE'  ){
        this.state.current.choice=[{}, {}, {}, {}]
      }else if( type !== this.state.detail.type && type==='SIMPLE'  ){
        this.state.current.choice=[{ result:true }]
      }
    }
    this.setState( { questionType: type } )
  }


  render() {
    const { loading, subjectListResult: { total, list }, form: { getFieldDecorator }, tagsListResult } = this.props;
    const { pageSize, pageNum, visible, current = {}, selectedRowKeys, settingState, questionType } = this.state;
    const tagsList = tagsListResult.list || [];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: '保存',
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    let tags = [];
    if ( current.id ) {
      tags= current.tags.map( item => item.id );
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>题目</span>,
        dataIndex: 'content',
        render:content =>(
          <div className={styles.subject_content}>
            {content && content.replace( /<[^<>]+>/g, "" )}
          </div>
        )
      },
      {
        title: <span>题目类型</span>,
        dataIndex: 'type',
        align:'center',
        width:100,
        render:type=>(
          <div>
            {
             type?
               <div>{type==='CHOICE'?'选择题':'简答题'}</div>:<div>--</div>
           }
          </div>
        )
      },
      {
        title: <span>标签名称</span>,
        dataIndex: 'tags',
        align:'center',
        render:( tags )=>(
          <div style={{ maxWidth:'300px' }}>
            {
              tags && tags.length && tags.length>0 ?
              tags.map( ( item, index )=>{
                return(
                  // <p style={{ marginTop:'10px' }} key={index}>{item.name}</p>
                  <Tag color='green' key={index}>
                    {item.name}
                  </Tag>
                )
              } )
              : (
                <p>--</p>
              )
            }
          </div>
        )
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createAt',
        align:'center',
        render: createAt => <span>{createAt || '--'}</span>,
      },
      // {
      //   title: <span>选项</span>,
      //   dataIndex: 'choice',
      //   width: 300,
      //   render: choice => (
      //     <div>
      //       <RadioGroup disabled style={{ width: 300 }} defaultValue>
      //         {choice && JSON.parse( choice ).map( ( item, y ) => {
      //           return (
      //             <Tooltip title={item.answer} key={y}>
      //               <Radio style={{ display: 'inline-block', width: 300, overflow: 'hidden', textOverflow: 'ellipsis' }} value={item.result}>
      //                 {item.answer}
      //               </Radio>
      //             </Tooltip>
      //           )
      //         } )}
      //       </RadioGroup>
      //     </div>
      //   ),
      // },
      {
        title: <span>状态</span>,
        dataIndex: 'enable',
        width:60,
        render: enable => <span>{enable ? '启用' : '禁用'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width:60,
        render: id => (
          <div>

            <span
              style={{ display:'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( id )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              编辑
            </span>

            <span
              style={{ display:'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, id )}
              ref={component => {
                /* eslint-disable */
                this[`delProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              删除
            </span>
          </div>
        ),
      },
    ];



    return (
      <GridContent>
        <div className={styles.standardList}>
          <FilterForm
            wrappedComponentRef={( ref ) => { this.filterForm = ref}}
            filterSubmit={this.filterSubmit}
            delBatch={this.delBatch}
            tagsList={tagsList}
          />
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={() => this.showAddModal()}
            ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
          >
            添加
          </Button>
          <Table
            size="large"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            rowSelection={rowSelection}
            onChange={this.tableChange}
          />
        </div>
        {visible &&
        <Modal
          maskClosable={false}
          title={current.id ? '编辑题目' : '添加题目'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <div style={{ width:'63%', margin:'0 auto 20px auto', fontSize:'14px', color:'rgba(0, 0, 0, 0.85)' }}>
              <span>设置方式：</span>
              <Radio.Group onChange={this.settingChang} value={settingState} disabled={!!current.id}>
                <Radio value="entering">录入</Radio>
                <Radio value="single">导入</Radio>
              </Radio.Group>
            </div>
            {
                settingState === 'entering' ?
                  <div>
                    <FormItem label='题目类型' {...this.formLayout}>
                      {getFieldDecorator( 'type', {
                    rules: [{ required: true, message: "请选择题目类型" }],
                    initialValue:current.type?current.type:'CHOICE'
                  } )(
                    <RadioGroup onChange={this.questionTypeChange} value={questionType}>
                      <Radio value="CHOICE">选择题</Radio>
                      <Radio value="SIMPLE">简答题</Radio>
                    </RadioGroup>
                  )}
                    </FormItem>
                    <FormItem label='题目' {...this.formLayout}>
                      {getFieldDecorator( 'content', {
                        rules: [{ required: true, message: "请输入题目" }],
                        initialValue: current.content,
                      } )(
                        <BraftEditor record={current.content} fieldDecorator={getFieldDecorator} field="content" contentStyle={{ height: '350px' }} />
                     )}
                    </FormItem>

                    {questionType === 'CHOICE'&&
                    <FormItem label='选项' {...this.formLayout}>
                      {getFieldDecorator( 'ignore', {
                        rules: [{ required: true, message: "请输入选项" }],
                        initialValue: current.choice,
                      } )(
                        <div>
                          {current.choice.map( ( item, y ) => {
                            return (
                              <Input.Group compact key={`${current.id}-${y}`}>
                                <Checkbox style={{ width: '5%' }} checked={item.result} onChange={e => this.editChoiceResult( e, y )} />
                                <Input style={{ width: '83%' }} value={item.answer} onChange={e => this.editChoice( e, y )} />
                                <Button style={{ width: '12%' }} type="danger" onClick={() => this.deleteChoice( y )}>删除</Button>
                              </Input.Group>
                            )
                          } )}
                          <Button
                            type="dashed"
                            style={{ width: '100%', marginBottom: 8 }}
                            icon="plus"
                            onClick={() => this.addChoice()}
                          >
                            添加
                          </Button>
                        </div>
                      )}
                    </FormItem>
                    }

                    {questionType !== 'CHOICE'&&
                    <FormItem label='答案' {...this.formLayout}>
                      {getFieldDecorator( 'ignore', {
                        rules: [{ required: true, message: "请输入答案" }],
                        initialValue: current && current.choice[0] && current.choice[0].answer
                      } )(
                        <Input style={{ width: '100%' }} onChange={e => this.editChoice( e, 0 )} />
                      )}
                    </FormItem>
                    }

                    <FormItem label='解析' {...this.formLayout}>
                      {getFieldDecorator( 'resolve', {
                        rules: [{ required: false, message: "请输入解析" }],
                        initialValue: current.resolve,
                      } )( <TextArea rows={4} placeholder="请输入解析" maxLength={80} /> )}
                    </FormItem>
                  </div>
                :
                  <FormItem label="题目" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} required message="请输入题目">
                    <Row gutter={24}>
                      <Col span={2}>
                        <Upload
                          {...this.getPdfURL()}
                          showUploadList={false} // 是否展示列表
                        >
                          <Icon style={{ color:'#1880FF', cursor:'pointer', fontSize:'16px' }} type="download" />
                        </Upload>
                      </Col>
                      <Col span={3}>
                        <Button href={subjectUrl}>模板下载</Button>
                      </Col>
                    </Row>
                  </FormItem>
              }

            <FormItem label="标签名称" {...this.formLayout}>
              {getFieldDecorator( 'tags', {
                  rules: [{ required: true, message: "请选择标签名称" }],
                  initialValue: tags,
                } )(
                  <Checkbox.Group>
                    {tagsList.length > 0 && tagsList.map( item => {
                      return (
                        <Checkbox value={item.id} key={item.id}>{item.name}</Checkbox>
                      )
                    } )}
                  </Checkbox.Group>
                )}
            </FormItem>

            <FormItem label='是否启用' {...this.formLayout}>
              {getFieldDecorator( 'enable', {
                    rules: [{ required: true, message: "请选择是否启用" }],
                    initialValue:current.enable === undefined ? 'true' : current.enable.toString()
                  } )(
                    <RadioGroup>
                      <Radio value="true">是</Radio>
                      <Radio value="false">否</Radio>
                    </RadioGroup>
                  )}
            </FormItem>
          </Form>
        </Modal> }
      </GridContent>
    );
  };
}

export default SubjectList;
