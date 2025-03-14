import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Tooltip, Form, Modal, Input, Radio, Icon, Select, InputNumber, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import 'braft-editor/dist/index.css';
import styles from '../education.less'

const FormItem = Form.Item;
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;

const stateObj = {
  "ENABLE": formatMessage( { id: 'strategyMall.coupons.true' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.coupons.false' } ),
}

@connect( ( { course } ) => ( {
  loading: course.loading,
  chapterListResult: course.chapterListResult,
  courseListResult: course.courseListResult,
} ) )
@Form.create()

class ChapterList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    courseId: 'all',
    listType: '',

    // 图片上传
    previewVisible: false,
    previewImage: '',
    fileLists: new Array( 7 ).fill( null ),
    coverSrc: '',
    imgagesSrc: '',
    testPaperList:[],
    fileList: [{ key: new Date().getTime(), value:'' }]
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayoutWithOutLabel = {
    wrapperCol: { offset: 6, span: 14 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, pageNum, listType } = this.state;
    this.fetchList( { pageSize, pageNum, listType } );
    this.getTestPaperList();
    dispatch( {
      type:'course/getCourseTabs',
      payload:{ pageSize:100 }
    } )
    dispatch( {
      type: 'course/getAllCourseList',
      payload: {
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
        callFunc: () => {
        }
      }
    } )
    dispatch( {
      type:'course/chapterTestPaperList',
      payload: { pageSize:100 },
      callFunc: ( testPaperList ) => {
        this.setState( { testPaperList } )
      }
    } )
  };

  fetchList = ( { pageSize, pageNum, courseId, listType } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getChapterList',
      payload: {
        pageSize,
        pageNum,
        courseId: courseId === 'all' ? '' :courseId,
        hasPublish: listType
      }
    } )
  };

  getTestPaperList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getTestPaperList',
      payload: {
        pageSize: 10000,
        pageNum: 1
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    const { courseId, listType } = this.state;
    this.fetchList( { pageNum: current, pageSize, courseId, listType } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      fileList: [{ key: new Date().getTime(), value: '' }]
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( obj ) => {
    this.srcForUpload( obj.img );
    const fileList = obj.tools && obj.tools.length > 0 ? obj.tools.map( ( tool, index ) => ( { key:new Date().getTime() +index, value:tool.link, url:tool.img, file:'init' } ) ) : [{ key:new Date().getTime(), value:'' }]
    this.setState( {
      visible: true,
      current: obj,
      coverSrc: obj.img,
      fileList
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
      current: undefined,
      coverSrc: '',
      fileLists: new Array( 7 ).fill( null )
    } );
  };
  

  // 上传图片
  ChangeFunc = ( res, key ) => {
    const { fileLists, imgagesSrc } = this.state;
    fileLists[key] = res;
    this.setState( { fileLists: new Array( ...fileLists ) } );
    if ( key === 0 ) {
      this.setState( { coverSrc: res.url } );
    } else {
      const imagesArr = imgagesSrc.split( ',' );
      imagesArr[key-1] = res.url;
      
      this.setState( { imgagesSrc: imagesArr.join( ',' ) } );
    }
  }

  // 关闭图片预览
  CancelFunc = () => this.setState( { previewVisible: false } );

  // 关闭图片预览
  toolsCancelFunc = () => {
    this.setState( { previewVisible: false } )
  };

  // 删除上传的图片
  RemoveFunc = ( res, key ) => {
    const { fileLists, imgagesSrc } = this.state;
    fileLists[key] = null;
    this.setState( { fileLists: new Array( ...fileLists ) } );
    if ( key === 0 ) {
      this.setState( { coverSrc: '' } );
    } else {
      let imagesArr = imgagesSrc.split( ',' );
      imagesArr[key - 1] = '';
      imagesArr = imagesArr.filter( item => { return item } )
      this.setState( { imgagesSrc: imagesArr.join( ',' ) } );
    }
  }

  // 打开图片预览
  PreviewFunc = ( file ) => {
    this.setState( {
      previewImage: file.url,
      previewVisible: true,
    } );
  }

  // 根据链接分配显示到上传组建
  srcForUpload = ( cover ) => {
    const { fileLists } = this.state;

    if ( cover ) {
      const coverObj = {
        uid: cover,
        url: cover,
      };
      fileLists[0] = coverObj;
    } else {
      fileLists[0] = null;
    }

    this.setState( { fileLists: new Array( ...fileLists ) } );
  }

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, courseId, listType, coverSrc
    } = this.state;
    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      const { Tkeys, toolsUrl, ...values } = fieldsValue;
     
      if ( err ) return;
      
      const params = id ? Object.assign( current, values, { update: true }, { img: coverSrc } ) : { ...values, img: coverSrc };
      const tools = Tkeys.filter( ( item ) => !!item.file || item.file === 'init' ).map( tool => ( { img: tool.url, link: toolsUrl[tool.key] } ) )
      params.tools = tools;
      params.hasDirectory = params.hasDirectory === 'ENABLE' ? params.hasDirectory = true : params.hasDirectory = false;
      params.hasPublish = params.hasPublish === 'ENABLE' ? params.hasPublish = true : params.hasPublish = false;
      params.tryRead = params.tryRead === 'ENABLE' ? params.tryRead = true : params.tryRead = false;
      // params.courseId = parseInt(courseId, 10);
      const isUpdate = !!id;
      // if (!params.hasDirectory && (!params.content || params.content === '<p></p>')) {
      //   message.error(`${formatMessage({ id: 'form.input' })}${formatMessage({ id: 'strategyMall.chapter.content' })}`);
      //   return;
      // }
      if ( params.hasDirectory ) {
        params.content = '';
      }
      dispatch( {
        type: 'course/submitChapter',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, courseId, listType } );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  // 删除文章
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum } = this.state;
    const { courseId, listType } = this.state;
    const { chapterListResult: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delChapter',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum, courseId, listType } );
              $this.setState( { pageSize, pageNum, courseId, listType } )
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

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    const { pageSize, courseId } = this.state;
    this.fetchList( { pageNum:1, pageSize, courseId, listType } );
    this.setState( { listType } )
  }

  //  选择课程
  onCourseChange = ( courseId ) => {
    const { pageSize, listType } = this.state;
    if ( courseId ) {
      this.fetchList( { pageNum:1, pageSize, courseId, listType } );
      this.setState( { courseId } );
    } 
  }

  //  获取课程名称
  getCourseName = ( courseId ) => {
    const { courseListResult:{ list } } = this.props;
    return courseId && courseId !== 'all' ? list.find( item => item.id.toString() === courseId.toString() ).name : '';
  }

  // 上传图片
  toolsChangeFunc = ( res, key ) => {
    const { fileList } = this.state;
    const { form } = this.props;
    const toolsUrl = form.getFieldValue( 'toolsUrl' );
    // const tools = form.getFieldValue('tools');
    // const newTools = Object.keys(tools).map(item => ({ ...tools[item], value: toolsUrl[item] })).concat({ key: new Date().getTime(), value: '' });
    // const newToolsUrl = toolsUrl.concat({ key: new Date().getTime(), value: '' });

    const newList = fileList.map( item => item.key === key ? ( { ...item, file: res, url: res.url, value: toolsUrl[item.key] } ) : ( { ...item, value: toolsUrl[item.key] } ) );
    this.setState( { fileList: [...newList] } );
    // form.setFieldsValue({
    //   newToolsUrl,
    //   newTools
    // });
  }

  toolsRemoveFunc = ( res, key ) => {
    const { fileList } = this.state;
    const newList = fileList.map( item => ( item.key === key ? { ...item, file: null, url:'' } : item ) )
    this.setState( { fileList: new Array( ...newList ) } );

  }

  addTools = () => {
    const { fileList } = this.state;
    const newList = fileList.concat( { key: new Date().getTime(), value: '' } )
    this.setState( { fileList: newList } );
  }

  deleteTools = ( key ) => {
    const { fileList } = this.state;
    const newList =fileList.filter( item => item.key !== key );
    this.setState( { fileList: newList } );
  }
  
  renderTools = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    getFieldDecorator( 'Tkeys', { initialValue: this.state.fileList } );
    const keys = getFieldValue( 'Tkeys' );
    
    return keys && keys.map( ( k, index ) => (
      <FormItem
        {...( index === 0 ? this.formLayout : this.formLayoutWithOutLabel )}
        label={index === 0 && formatMessage( { id: 'strategyMall.chapter.related.tool.add' } )}
        key={k.key}
      >
        <Row style={{ position:'relative' }}>
          <Col span={10}>
            {getFieldDecorator( `tools[${k.key}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: k.url 
              } )(
                <div className={styles.UploadLogoBox}>
                  <UploadImg
                    className={styles.UploadLogo}
                    // eslint-disable-next-line no-nested-ternary
                    fileList={k.file && k.file !=='init' ? [{ ...k.file }] : k.url ? [{ url:k.url, uid:k.url }] : []}
                    previewImage={k.value}
                    ChangeFunc={e => this.toolsChangeFunc( e, k.key, k )}
                    RemoveFunc={e => this.toolsRemoveFunc( e, k.key )}
                  />
                </div>
              )}
          </Col>
          <Col span={12} style={{ position: "absolute", top: '50%', transform: "translateY(-50%)", right:60 }}>
            {getFieldDecorator( `toolsUrl[${k.key}]`, {
                validateTrigger: ['onChange', 'onBlur'],
              initialValue: k.value  ? k.value : ''
              } )(
                <Input
                  placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tool.link' } )}`}
                />
              )}
          </Col>
        
          <Col span={2} style={{ position: "absolute", top: '50%', transform: "translateY(-50%)", right: 0 }}>
            <Button
              shape="circle"
              icon={index === 0 ? "plus" : "minus"}
              type="primary"
              onClick={() => {
                if ( index === 0 ) this.addTools() 
                else this.deleteTools( k.key ) 
                }}
            />
          </Col>
        </Row>
       
       
      </FormItem>
    ) )
  }

  render() {
    const { loading, chapterListResult: { total, list }, form: { getFieldDecorator }, courseListResult } = this.props;
    const { pageSize, pageNum, visible, current = {}, listType, courseId, previewVisible, previewImage, fileLists, coverSrc, testPaperList } = this.state;
    const courseList = courseListResult.list || [];
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

    const extraContent = (
      <div className={styles.extraContent}>
        <span>{formatMessage( { id: 'strategyMall.course' } )}：</span>
        {courseList.length > 0 &&
          <Select
            style={{ width: 150, borderRadius: '3px', marginRight: '20px' }}
            placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course' } )}`}
            defaultValue='all'
            onSelect={this.onCourseChange}
          >
            <Option key='all'>{formatMessage( { id: 'strategyMall.all' } )}</Option>
            { courseList.map( course =>
              <Option key={course.id} value={course.id}>{course.name}</Option>
            )}
          </Select>
        }
        
        <span>{formatMessage( { id: 'strategyMall.chapter.hasPublish' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={listType}>
          <RadioButton value="">{formatMessage( { id: 'strategyMall.all' } )}</RadioButton>
          <RadioButton value="true">{formatMessage( { id: 'strategyMall.chapter.hasPublish.true' } )}</RadioButton>
          <RadioButton value="false">{formatMessage( { id: 'strategyMall.chapter.hasPublish.false' } )}</RadioButton>
        </RadioGroup>
      </div>
    );

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.course.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.chapter.hasDirectory' } )}</span>,
        dataIndex: 'hasDirectory',
        key: 'hasDirectory',
        render: hasDirectory => (
          <span>{hasDirectory ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.chapter.hasPublish' } )}</span>,
        dataIndex: 'hasPublish',
        key: 'hasPublish',
        render: hasPublish => (
          <span>{hasPublish ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.chapter.tryRead' } )}</span>,
        dataIndex: 'tryRead',
        key: 'tryRead',
        render: tryRead => (
          <span>{tryRead ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.course.createAt' } )}</span>,
        dataIndex: 'createAt',
        render: createAt => <span>{createAt}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: ( id, data ) => (
          <div>
            
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( data )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
                编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
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
          <Card
            className={styles.listCard}
            bordered={false}
            title={formatMessage( { id: 'strategyMall.chapter.list' } )}
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
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
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable={false}
          title={`${Object.keys( current ).length > 0 ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${formatMessage( { id: 'strategyMall.chapter' } )}`}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label={formatMessage( { id: 'strategyMall.chapter.course' } )} {...this.formLayout}>
                {getFieldDecorator( 'courseId', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.chapter.course' } )}` }],
                  initialValue: current.courseId || ( courseId !== 'all' ? courseId : undefined )
                } )(
                  <Select
                    style={{ width: 150, borderRadius: '3px', marginRight: '20px' }}
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course' } )}`}
                  >
                    {courseList.length > 0 && courseList.map( course => 
                      <Option key={course.id} value={course.id}>{course.name}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.chapter.name' } )} {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.chapter.name' } )}` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.chapter.name' } )}`} /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.chapter.small.title' } )} {...this.formLayout}>
                {getFieldDecorator( 'smallName', {
                  initialValue: current.smallName,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.chapter.small.title' } )}`} /> )}
              </FormItem>

              <FormItem label='展示图' {...this.formLayout}>
                {getFieldDecorator( 'img', {
                  initialValue: coverSrc,
                } )(
                  <div className={styles.UploadLogoBox}>
                    <UploadImg
                      className={styles.UploadLogo}
                      previewVisible={previewVisible}
                      previewImage={previewImage}
                      fileList={fileLists[0] ? [{ ...fileLists[0] }] : []}
                      CancelFunc={this.CancelFunc}
                      PreviewFunc={this.PreviewFunc}
                      ChangeFunc={e => this.ChangeFunc( e, 0 )}
                      RemoveFunc={e => this.RemoveFunc( e, 0 )}
                    />
                  </div>
                )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.product.time' } )} {...this.formLayout}>
                <Tooltip title="学完课程所需时间，单位为：分钟">
                  {getFieldDecorator( 'studyTime', {
                  initialValue: current.studyTime,
                } )(
                  <InputNumber min={1} style={{ width: 70 }} precision={0} />
                  )}
                </Tooltip>
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.chapter.related.testPaper' } )} {...this.formLayout}>
                {getFieldDecorator( 'questionPackageId', {
                  initialValue: current.questionPackageId || undefined
                } )(
                  <Select
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.chapter.related.testPaper' } )}`}
                  >
                    {testPaperList.length > 0 && testPaperList.map( item =>
                      <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                    )}
                  </Select>,
                )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.chapter.hasDirectory' } )} {...this.formLayout}>
                {getFieldDecorator( 'hasDirectory', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.chapter.hasDirectory' } )}` }],
                    initialValue: current.hasDirectory ? 'ENABLE' : 'DISABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.chapter.hasPublish' } )} {...this.formLayout}>
                {getFieldDecorator( 'hasPublish', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.chapter.hasPublish' } )}` }],
                    initialValue: current.hasPublish ? 'ENABLE' : 'DISABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
              
              <FormItem label={formatMessage( { id: 'strategyMall.chapter.tryRead' } )} {...this.formLayout}>
                {getFieldDecorator( 'tryRead', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.chapter.tryRead' } )}` }],
                    initialValue: current.tryRead ? 'ENABLE' : 'DISABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
              { this.renderTools()}
              <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.chapter.content' } )}>
                {getFieldDecorator( 'content', {
                    // rules: [{ required: true, message: `${formatMessage({ id: 'form.input' })}${formatMessage({ id: 'strategyMall.chapter.content' })}` }],
                    initialValue: current.content,
                  } )(
                    <BraftEditor record={current.content} fieldDecorator={getFieldDecorator} field="content" />
                  )}
              </FormItem>
            </Form>
          }
        </Modal>
      </GridContent>
    );
  };
}

export default ChapterList;