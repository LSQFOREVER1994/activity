import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, message, Radio, Icon, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import 'braft-editor/dist/index.css';
import styles from '../education.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;
const stateObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  "ENABLE": formatMessage( { id: 'strategyMall.product.state.ENABLE' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.product.state.DISABLE' } ),
}
const unlockTypeObj = {
  "DAY_UN_LOCK": formatMessage( { id: 'strategyMall.course.day.unLock' } ),
  "SEQUENCE_UN_LOCK": formatMessage( { id: 'strategyMall.course.sequence.unLock' } ),
  "NO_LOCK": formatMessage( { id: 'strategyMall.course.no.unLock' } ),
}
const clockTypeObj = {
  "ALL": formatMessage( { id: 'strategyMall.course.clock.all' } ),
  "MANUAL": formatMessage( { id: 'strategyMall.course.clock.manual' } ),
  "AUTO": formatMessage( { id: 'strategyMall.course.clock.auto' } ),
}
@connect( ( { course } ) => ( {
  loading: course.loading,
  courseListResult: course.courseListResult,
  courseTabList: course.courseTabList,
  signActivityList: course.signActivityList,
} ) )
@Form.create()

class CourseList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,

    // 图片上传
    previewVisible: false,
    previewImage: '',
    fileLists: new Array( 7 ).fill( null ),
    coverSrc: '',
    imgagesSrc: '',
    previewVisibleBefore: false,
    previewImageBefore:'',
    fileListsBefore: new Array( 7 ).fill( null ),
    coverSrcBefore:'',
    imgagesSrcBefore: '',
    previewVisibleAfter: false,
    previewImageAfter: '',
    fileListsAfter: new Array( 7 ).fill( null ),
    coverSrcAfter: '',
    imgagesSrcAfter: '',
    tagId:0,
    upperShelf:'',
    brightSpotList:null,
    targetList:null,
    commentTopicList:[],
    answerTopicList:[]
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayoutWithOutLabel = {
    wrapperCol: { offset:6, span: 14 },
  };

  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    this.fetchList( { pageNum, pageSize } );
    dispatch( {
      type: 'course/getCourseTabs',
      payload: { pageSize:100 }
    } )
    dispatch( {
      type:'course/getSignActivity',
      payload: { activityType:'SIGN', enable:true, pageSize:100 }
    } )
  };

  fetchList = ( params ) => {
    const { dispatch } = this.props;
    const { pageSize, pageNum, tagId, upperShelf } = this.state;
    dispatch( {
      type: 'course/getCourseList',
      payload: {
        params: {
          pageSize,
          pageNum,
          tagId,
          upperShelf,
          ...params
        },
        callFunc(){}
      }
    } )
  };

  // 上传图片
  ChangeFunc = ( res, key, type ) => {
    // const { fileLists, imgagesSrc } = this.state;
    // fileLists[key] = res;
    // 
    const list = this.state[`fileLists${type}`];
    list[key] = res;
    this.setState( { [`fileLists${type}`]: new Array( ...list ) } );
    if ( key === 0 ) {
      this.setState( { [`coverSrc${type}`]: res.url } );
    } else {
      const imagesArr = this.state[`imgagesSrc${type}`].split( ',' );
      imagesArr[key-1] = res.url;
     
      this.setState( { [`imgagesSrc${type}`]: imagesArr.join( ',' ) } );
    }
  }

  // 关闭图片预览
  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  // 删除上传的图片
  RemoveFunc = ( res, key, type ) => {
    const list = this.state[`fileLists${type}`];
    list[key] = null
    this.setState( { [`fileLists${type}`]: new Array( ...list ) } );
    if ( key === 0 ) {
      this.setState( { [`coverSrc${type}`]: '' } );
    } else {
      let imagesArr = this.state[`imgagesSrc${type}`].split( ',' );
      imagesArr[key-1] = '';
      imagesArr = imagesArr.filter( item=>{ return item} )
      this.setState( { [`imgagesSrc${type}`]: imagesArr.join( ',' ) } );
    }
  }

  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  // changeCoverSrc
  changeCoverSrc = ( e ) => {
    e.preventDefault();
    const { value } = e.target;
    this.srcForUpload( value, '' )
    this.setState( { coverSrc: value } );
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
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
      coverSrc: '',
      fileLists: new Array( 1 ).fill( null ),
      fileListsBefore: new Array( 1 ).fill( null ),
      fileListsAfter: new Array( 1 ).fill( null ),
      brightSpotList: [{ key: new Date().getTime(), value:"" }],
      targetList: [{ key: new Date().getTime()+1, value: "" }],
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {
    const { courseListResult: { list } } = this.props;
    const { fileLists, fileListsBefore, fileListsAfter } = this.state;

    const obj = list.find( o => o.id === id );
    const brightSpotList = obj && obj.brightSpot ? obj.brightSpot.split( '&&' ).map( ( item, index ) => ( { key: new Date().getTime() + index, value: item } ) ) : [{ key: new Date().getTime(), value:'' }]
    const targetList = obj && obj.target ? obj.target.split( '&&' ).map( ( item, index ) => ( { key: new Date().getTime() + index, value:item } ) ) : [{ key: new Date().getTime(), value: '' }]
    fileLists[0] = {
      uid: obj.logo,
      url: obj.logo,
    };
    fileListsBefore[0] = {
      uid: obj.beforeBanner,
      url: obj.beforeBanner,
    };
    fileListsAfter[0] = {
      uid: obj.afterBanner,
      url: obj.afterBanner,
    };
    if ( obj.commentTopicId ) {
      this.getTopicDetail( obj.commentTopicId, 'commentTopicList' )
    }
    if ( obj.answerTopicId ){
      this.getTopicDetail( obj.answerTopicId, 'answerTopicList' )
    }
    this.setState( {
      visible: true,
      current: obj,
      fileLists,
      fileListsBefore,
      fileListsAfter,
      coverSrc: obj.logo,
      coverSrcBefore: obj.beforeBanner,
      coverSrcAfter: obj.afterBanner,
      targetList,
      brightSpotList
    } );
  };

  getTopicDetail = ( ids, type ) =>{
    const { dispatch } = this.props;
    dispatch( {
      type:'course/getTopicDetail',
      payload:{ ids },
      callFunc:( list ) => {
        this.setState( { [type]:list } )
      }
    } )
  }
  
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
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, coverSrc, coverSrcBefore, coverSrcAfter,
    } = this.state;
    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      const { keys, brightSpots, Tkeys, targets, courseTag, ...values } = fieldsValue;
      if ( err ) return;
      if ( coverSrc==='' ){
        message.error( 'LOGO不能为空' );
        return;
      };
      if ( coverSrcBefore === '' ) {
        message.error( '购买前的banner不能为空' );
        return;
      }

      const list = Object.values( brightSpots );
      const targetList = Object.values( targets );
      const brightSpot = list.join( '&&' );
      const target = targetList.join( '&&' );
      const addParams = {
        courseTag: courseTag.map( item => id ? ( { tagId: item.key, courseId:id } ): ( { tagId:item.key } ) ),
        target,
        brightSpot,
        beforeBanner: coverSrcBefore,
        afterBanner: coverSrcAfter,
        logo: coverSrc,
      }
      const params = id ? Object.assign( current, values, { id, ...addParams } ) : { ...values, ...addParams };
      params.upperShelf = params.upperShelf === 'ENABLE' ? params.upperShelf = true : params.upperShelf = false;
      const isUpdate = !!id
      dispatch( {
        type: 'course/submitCourse',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize } );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  // 删除课程
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum } = this.state;
    const { courseListResult: { list }, dispatch } = this.props;
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
          type: 'course/delCourse',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum } );
              $this.setState( { pageSize, pageNum } )
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

  // 根据链接分配显示到上传组建
  srcForUpload = ( cover, images ) => {
    const { fileLists } = this.state;
    const imageArr = new Array( 6 ).fill( null );

    if ( cover ) {
      const coverObj = {
        uid: cover,
        url: cover,
      };
      fileLists[0] = coverObj;
    } else {
      fileLists[0] = null;
    }

    if ( images ) {
      images.split( ',' ).forEach( ( item, index ) => {
        const ITEM = item.replace( /\s+/g, '' );
        if ( ITEM ) {
          imageArr[index] = ITEM;
        } else {
          imageArr[index] = null;
        }
      } )
    }
    
    imageArr.forEach( ( item, index ) => {
      const imageObj = {
        uid: item,
        url: item,
      };
      if( item ) {
        fileLists[index+1] = imageObj;
      } else {
        fileLists[index+1] = null;
      }
    } );
    this.setState( { fileLists: new Array( ...fileLists ) } );
  }

  //  选择课程
    onTagChange = ( tagId ) => {
      if ( tagId ) {
        this.fetchList( { pageNum:1,  tagId } );
        this.setState( { tagId } );
        }
      }

  // 改变产品状态
  changeListType = ( e ) => {
    const upperShelf = e.target.value;
    this.fetchList( { upperShelf } );
    this.setState( { upperShelf } )
  }
  
  addBrightSpot = ( Keys ) => {
    const { form } = this.props;
    const keys = form.getFieldValue( Keys );
    const nextKeys = keys.concat( { key: new Date().getTime(), value:'' } );
    form.setFieldsValue( {
      [Keys]: nextKeys,
    } );
  }

  deleteBrightSpot = ( k, Keys ) => {
    const { form } = this.props;
    const keys = form.getFieldValue( Keys );
    const newKeys = keys.filter( key => key.key !== k.key )
    form.setFieldsValue( {
      [Keys]: newKeys,
    } );
  }

  renderBrightSpot = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    getFieldDecorator( 'keys', { initialValue: this.state.brightSpotList } );
    const keys = getFieldValue( 'keys' );
    return keys && keys.map( ( k, index ) => (
      <FormItem
        {...( index === 0 ? this.formLayout : this.formLayoutWithOutLabel )}
        required={false}
        label={index === 0 && formatMessage( { id: 'strategyMall.course.brightSpot' } )}
        key={k.key}
      >
        {getFieldDecorator( `brightSpots[${k.key}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue:k.value
        } )(
          <Input 
            placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.brightSpot' } )}`}
            className={styles.form_input}
          />
        )}
        <Button 
          shape="circle" 
          icon={index === 0 ? "plus" : "minus"} 
          type="primary" 
          className={styles.form_right_icon} 
          onClick={() => { 
            if ( index === 0 ) this.addBrightSpot( 'keys' )
            else this.deleteBrightSpot( k, 'keys' )
           }} 
        />
      </FormItem>
    ) )
  }

  renderTarget = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    getFieldDecorator( 'Tkeys', { initialValue: this.state.targetList } );
    
    const keys = getFieldValue( 'Tkeys' );
    return keys && keys.map( ( k, index ) => (
      <FormItem
        {...( index === 0 ? this.formLayout : this.formLayoutWithOutLabel )}
        required={false}
        label={index === 0 && formatMessage( { id: 'strategyMall.course.target' } )}
        key={k.key}
      >
        {getFieldDecorator( `targets[${k.key}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: k.value
        } )(
          <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.target' } )}`} className={styles.form_input} />
        )}
        <Button
          shape="circle"
          icon={index === 0 ? "plus" : "minus"}
          type="primary"
          className={styles.form_right_icon}
          onClick={() => {
            if ( index === 0 ) this.addBrightSpot( 'Tkeys' )
            else this.deleteBrightSpot( k, 'Tkeys' )
          }}
        />
      </FormItem>
    ) )
  }

  onSearchTopic = ( title, type ) => {
    const { dispatch } = this.props;
    dispatch( {
      type:'course/topicSearch',
      payload: { title },
      callFunc:( list ) => {
        this.setState( { [type] : list } )
      }
    } )

  }

  render() {
    const { loading, courseListResult: { total, list }, form: { getFieldDecorator }, courseTabList, signActivityList } = this.props;
    const { pageSize, pageNum, visible, previewVisible, previewImage, fileLists, current = {}, coverSrc, listType, brightSpotList, targetList,
      coverSrcBefore, previewVisibleBefore, previewImageBefore, fileListsBefore, coverSrcAfter, previewVisibleAfter, previewImageAfter, fileListsAfter, answerTopicList, commentTopicList  } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <span>{formatMessage( { id: 'strategyMall.tags.name' } )}：</span>
        <Select
          style={{ width: 150, borderRadius: '3px', marginRight: '20px' }}
          placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course' } )}${formatMessage( { id: 'strategyMall.tags.name' } )}`}
          defaultValue={formatMessage( { id: 'strategyMall.all' } )}
          onSelect={this.onTagChange}
        >
          <Option key='all'>{formatMessage( { id: 'strategyMall.all' } )}</Option>
          {courseTabList.length > 0 && courseTabList.map( course =>
            <Option key={course.id}>{course.name}</Option>
          )}
        </Select>

        <span>{formatMessage( { id: 'strategyMall.course.hasPutaway' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={listType}>
          <RadioButton value="">{formatMessage( { id: 'strategyMall.all' } )}</RadioButton>
          <RadioButton value="true">{formatMessage( { id: 'strategyMall.product.state.ENABLE' } )}</RadioButton>
          <RadioButton value="false">{formatMessage( { id: 'strategyMall.product.state.DISABLE' } )}</RadioButton>
        </RadioGroup>
      </div>
    );
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
        title: <span>{formatMessage( { id: 'strategyMall.course.description' } )}</span>,
        dataIndex: 'description',
        render: description => <span>{description}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.state' } )}</span>,
        dataIndex: 'upperShelf',
        key: 'upperShelf',
        render: upperShelf => (
          <span>{upperShelf ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.course.createAt' } )}</span>,
        dataIndex: 'createAt',
        render: createAt => <span>{createAt}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: id => (
          <div>
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff' }}
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
            title={formatMessage( { id: 'strategyMall.course.list' } )}
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
          title={`${Object.keys( current ).length > 0 ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${formatMessage( { id: 'strategyMall.course' } )}`}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label='permissionKey' {...this.formLayout}>
                {getFieldDecorator( 'permissionKey', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}permissionKey` }],
                  initialValue: current.permissionKey,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}permissionKey`} disabled={!!current.id} /> )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.productsRights.name' } )} {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.productsRights.name' } )}` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.productsRights.name' } )}`} /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.course.description' } )} {...this.formLayout}>
                {getFieldDecorator( 'description', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.description' } )}` }],
                  initialValue: current.description,
                } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.description' } )}`} /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                {getFieldDecorator( 'upperShelf', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                    initialValue: current.upperShelf ? 'ENABLE' : 'DISABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.product.cover' } )} {...this.formLayout}>
                {getFieldDecorator( 'logo', {
                  rules: [{ required: true, message: `请上传${formatMessage( { id: 'strategyMall.product.cover' } )}` }],
                  initialValue: coverSrc,
                } )(
                  <div className={styles.UploadLogoBox}>
                    <UploadImg
                      className={styles.UploadLogo}
                      previewVisible={previewVisible}
                      previewImage={previewImage}
                      fileList={fileLists[0] ? [{ ...fileLists[0] }] : []}
                      CancelFunc={() => { this.CancelFunc( '' )}}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, '' )}}
                      ChangeFunc={e => this.ChangeFunc( e, 0, '' )}
                      RemoveFunc={e => this.RemoveFunc( e, 0, '' )}
                    />
                  </div>
                )}
              </FormItem>
              <FormItem label='显示的banner' {...this.formLayout}>
                {getFieldDecorator( 'beforeBanner', {
                  rules: [{ required: true, message: `请上传显示的banner` }],
                  initialValue: coverSrcBefore,
                } )(
                  <div className={styles.UploadLogoBox}>
                    <UploadImg
                      className={styles.UploadLogo}
                      previewVisible={previewVisibleBefore}
                      previewImage={previewImageBefore}
                      fileList={fileListsBefore[0] && fileListsBefore[0].url ? [{ ...fileListsBefore[0] }] : []}
                      CancelFunc={() => { this.CancelFunc( 'Before' ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, 'Before' ) }}
                      ChangeFunc={e => this.ChangeFunc( e, 0, 'Before' )}
                      RemoveFunc={e => this.RemoveFunc( e, 0, 'Before' )}
                    />
                  </div>
                )}
              </FormItem>
              <FormItem label='购买后显示的banner' {...this.formLayout}>
                {getFieldDecorator( 'beforeBanner', {
                  // rules: [{ required: true, message: `请上传购买后显示的banner` }],
                  initialValue: coverSrcAfter,
                } )(
                  <div className={styles.UploadLogoBox}>
                    <UploadImg
                      className={styles.UploadLogo}
                      previewVisible={previewVisibleAfter}
                      previewImage={previewImageAfter}
                      fileList={fileListsAfter[0] && fileListsAfter[0].url? [{ ...fileListsAfter[0] }] : []}
                      CancelFunc={() => { this.CancelFunc( 'After' ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, 'After' ) }}
                      ChangeFunc={e => this.ChangeFunc( e, 0, 'After' )}
                      RemoveFunc={e => this.RemoveFunc( e, 0, 'After' )}
                    />
                  </div>
                )}
              </FormItem>
              {brightSpotList && this.renderBrightSpot()}
              {targetList && this.renderTarget() }
              <FormItem label={formatMessage( { id: 'strategyMall.course.clock.type' } )} {...this.formLayout}>
                {getFieldDecorator( 'clockType', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                  initialValue: current.clockType || "ALL",
                } )(
                  <RadioGroup>
                    {Object.keys( clockTypeObj ).map( ( item ) => (
                      <Radio value={item} key={item}>{clockTypeObj[item]}</Radio>
                    ) )}
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.course.unLock.type' } )} {...this.formLayout}>
                {getFieldDecorator( 'unlockType', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                  initialValue: current.unlockType || "DAY_UN_LOCK",
                } )(
                  <RadioGroup>
                    {Object.keys( unlockTypeObj ).map( ( item ) => (
                      <Radio value={item} key={item}>{unlockTypeObj[item]}</Radio>
                    ) )}
                  </RadioGroup>
                )}
              </FormItem>
              
              <FormItem label={formatMessage( { id: 'strategyMall.course.clock.activity' } )} {...this.formLayout}>
                {getFieldDecorator( 'signActivityId', {
                  initialValue: current.signActivityId || '',
                } )(
                  <Select
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course.clock.activity' } )}`}
                  >
                    {signActivityList && signActivityList.map( item =>
                      <Option key={item.id}>{item.name}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.course.comment.topic' } )} {...this.formLayout}>
                {getFieldDecorator( 'commentTopicId', {
                  initialValue: current.commentTopicId ? current.commentTopicId : undefined,
                } )(
                  <Select
                    showSearch
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course.comment.topic' } )}`}
                    onSearch={( e ) => { this.onSearchTopic( e, 'commentTopicList' )}}
                    filterOption={false}
                    notFoundContent={null}
                  >
                    {
                      commentTopicList.length > 0 && commentTopicList.map( item =>
                        <Option key={item.id} value={item.id}>{item && item.title}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.course.answer.topic' } )} {...this.formLayout}>
                {getFieldDecorator( 'answerTopicId', {
                  initialValue: current.answerTopicId ? current.answerTopicId : undefined,
                } )(
                  <Select
                    showSearch
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course.answer.topic' } )}`}
                    onSearch={( e ) => { this.onSearchTopic( e, 'answerTopicList' ) }}
                    filterOption={false}
                    notFoundContent={null}
                  >
                    {
                      answerTopicList.length > 0 && answerTopicList.map( item =>
                        <Option key={item.id} value={item.id}>{item && item.title}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem label={`${formatMessage( { id: 'strategyMall.course' } )}${formatMessage( { id: 'strategyMall.tags.name' } )}`} {...this.formLayout}>
                {getFieldDecorator( 'courseTag', {
                  initialValue: current.courseTag && current.courseTag.length > 0 ? current.courseTag.map( item => ( { key: item.tagId } ) ) : [],
                } )(
                  <Select
                    mode="multiple"
                    labelInValue
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course' } )}${formatMessage( { id: 'strategyMall.tags.name' } )}`}
                  >
                    {courseTabList.map( course =>
                      <Option value={course.id} key={course.id}>{course.name}</Option>
                    )}
                  </Select>,
                )}
              </FormItem>
              <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.course.introduce' } )}>
                {getFieldDecorator( 'introduce', {
                    initialValue: current.introduce,
                  } )(
                    <BraftEditor record={current.introduce || ''} fieldDecorator={getFieldDecorator} field="introduce" />
                  )}
              </FormItem>
            </Form>
          }
        </Modal>
      </GridContent>
    );
  };
}

export default CourseList;