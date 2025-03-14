import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Radio, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../education.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const SelectOption = Select.Option;

@connect( ( { course } ) => ( {
  loading: course.loading,
  plateListResult: course.plateListResult
} ) )
@Form.create()

class PlateList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    state: 'NORMAL',

    // 图片上传
    previewVisible: false,
    previewImage: '',
    fileLists: new Array( 7 ).fill( null ),
    coverSrc: '',
    imgagesSrc: '',
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { pageNum, pageSize, state } = this.state;
    this.fetchList( { pageNum, pageSize, state } );
  };

  fetchList = ( { pageSize, pageNum, state } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getPlateList',
      payload: {
        params: {
          pageSize,
          pageNum,
          state
        },
        callFunc(){}
      }
    } )
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

  // 删除上传的图片
  RemoveFunc = ( res, key ) => {
    const { fileLists, imgagesSrc } = this.state;
    fileLists[key] = null;
    this.setState( { fileLists: new Array( ...fileLists ) } );
    if ( key === 0 ) {
      this.setState( { coverSrc: '' } );
    } else {
      let imagesArr = imgagesSrc.split( ',' );
      imagesArr[key-1] = '';
      imagesArr = imagesArr.filter( item=>{ return item} )
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

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize, state } = pagination;
    this.fetchList( { pageNum: current, pageSize, state } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.srcForUpload( '' );
    this.setState( {
      visible: true,
      current: undefined,
      coverSrc: ''
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( code ) => {
    const { dispatch } = this.props;
    const $this = this;
    dispatch( {
      type: 'course/getPlateDetail',
      payload: {
        id: code,
        callFunc: ( result ) => {
          this.srcForUpload( result.image );
          $this.setState( {
            visible: true,
            current: result,
            coverSrc: result.image
          } );
        },
      }
    } )
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
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, state, coverSrc
    } = this.state;
    const id = current ? current.code : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, fieldsValue, { image: coverSrc } ) : { ...fieldsValue, image: coverSrc };
      const isUpdate = !!id;
      dispatch( {
        type: 'course/submitPlate',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, state } );
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
    const { pageSize, pageNum, state } = this.state;
    const { plateListResult: { list }, dispatch } = this.props;
    const obj = list.find( o => o.code === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.title}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delPlate',
          payload: {
            id: obj.code,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum, state } );
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

  // 改变状态
  changeListType = ( e ) => {
    const state = e.target.value;
    const { pageNum, pageSize } = this.state;
    this.fetchList( { pageNum, pageSize, state } );
    this.setState( { state } )
  }

  render() {
    const { loading, plateListResult: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {}, previewVisible, previewImage, fileLists, coverSrc, state } = this.state;
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
        <span>{formatMessage( { id: 'strategyMall.subject.enable' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={state}>
          <RadioButton value="NORMAL">已启用</RadioButton>
          <RadioButton value="DISABLE">未启用</RadioButton>
        </RadioGroup>
      </div>
    );

    let disabled = false;
    if ( Object.keys( current ).length > 0 ) {
      disabled = true;
    }

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'code',
        key: 'ID',
        render: code => <span>{code}</span>,
      },
      {
        title: <span>父板块</span>,
        dataIndex: 'parentCode',
        render: parentCode => <span>{parentCode}</span>,
      },
      {
        title: <span>标题</span>,
        dataIndex: 'title',
        render: title => <span>{title}</span>,
      },
      {
        title: <span>描述</span>,
        dataIndex: 'description',
        render: description => <span>{description}</span>,
      },
      {
        title: <span>背景图</span>,
        dataIndex: 'image',
        render: image => (
          <div className={styles.listImgBox} style={{ maxWidth:'200px' }}>
            <img className={styles.img} alt="logo" src={image} />
          </div>
        ),
      },
      {
        title: <span>状态</span>,
        dataIndex: 'state',
        render: value => <span>{value === 'NORMAL' ? '已启用' : '未启用'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.course.createAt' } )}</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: '操作',
        dataIndex: 'code',
        render: code => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( code )}
            >
                编辑
            </span>

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, code )}
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
            title="板块列表"
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
              rowKey="code"
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
          title={Object.keys( current ).length > 0 ? '编辑板块' : '添加板块'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label='父板块' {...this.formLayout}>
                {getFieldDecorator( 'parentCode', {
                  // rules: [{ required: true, message: `${formatMessage({ id: 'form.select' })}父板块` }],
                  initialValue: current.parentCode,
                } )(
                  <Select
                    placeholder={`${formatMessage( { id: 'form.select' } )}父板块`}
                  >
                    {list.map( plate => 
                      <SelectOption key={plate.code}>{plate.title}</SelectOption>
                    )}
                  </Select>
                )}
              </FormItem>

              <FormItem label='板块ID' {...this.formLayout}>
                {getFieldDecorator( 'code', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}板块ID` }],
                  initialValue: current.code,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}板块ID`} disabled={disabled} /> )}
              </FormItem>

              <FormItem label='板块标题' {...this.formLayout}>
                {getFieldDecorator( 'title', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}板块标题` }],
                  initialValue: current.title,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}板块标题`} /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.course.description' } )} {...this.formLayout}>
                {getFieldDecorator( 'description', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.description' } )}` }],
                  initialValue: current.description,
                } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.course.description' } )}`} /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.product.cover' } )} {...this.formLayout}>
                {getFieldDecorator( 'image', {
                  rules: [{ required: true, message: `请上传${formatMessage( { id: 'strategyMall.product.cover' } )}` }],
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

              <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                {getFieldDecorator( 'state', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                    initialValue: current.state || 'NORMAL',
                  } )(
                    <RadioGroup>
                      <Radio value="NORMAL">启用</Radio>
                      <Radio value="DISABLE">不启用</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
              
            </Form>
          }
        </Modal>
      </GridContent>
    );
  };
}

export default PlateList;