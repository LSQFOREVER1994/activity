import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, InputNumber, Tooltip, Input, Radio, Modal, Icon  } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { formatMessage } from 'umi/locale';
import ClassifyFilterForm from './ClassifyFilterForm'
import styles from '../exhibition.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  categoryList:exhibition.categoryList,
} ) )
@Form.create()

class Classify extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible:false,
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    this.fetchList();
  };

  //  获取类别列表
  fetchList = () =>{
    const{ pageNum, pageSize }=this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { name, isSale } = formValue;
    const { dispatch }=this.props;
    dispatch( {
      type:'exhibition/getCategoryList',
      payload:{
        page:{
          pageSize,
          pageNum,
          orderBy: 'sort desc',
        },
        name,
        isSale
      },
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
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
      info: undefined
    } );
  };

  
  //  显示编辑 Modal
  showEditModal = ( e, item ) => {
    e.stopPropagation()
    const { categoryList: { list } } = this.props;
    const obj = list.find( o => o.id === item.id );
    this.setState( {
      visible: true,
      info: obj
    } );
  };

  //  取消
  handleCancel = () => {
    const { info } = this.state;
    const id = info ? info.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      info: undefined,
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { info } = this.state;
    const id = info ?  info.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( { ...info, ...fieldsValue } ) : { ...fieldsValue };
      dispatch( {
        type: 'exhibition/submitCategoryData',
        payload: {
          params
        },
        callFunc: () => {
          this.fetchList();
          this.setState( {
            visible: false,
            info:undefined
          } );
        },
      } );
    } );
  };

  //  删除列表
  deleteItem=( e, item )=>{
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id, name } = item;
    const that = this;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'exhibition/deleteCategory',
          payload: {
            id,
            callFunc: () => {
              that.fetchList()
            },
          },
        } );
      },
    } );
  }


  render() {
    const { loading, categoryList: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, info={} } = this.state;

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

    const columns =[
      {
        title: <span>类别名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        render: sort => <span>{sort}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'isSale',
        render: isSale => <span>{isSale ? '已上架' : '已下架'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render:( id, item )=>{
          return(
            <div>
              <span
                style={{ marginRight:15, cursor: 'pointer', color: '#1890ff' }}
                type="link"
                onClick={( e ) => this.showEditModal( e, item )}
              >编辑
              </span>
        
              <span
                style={{ cursor: 'pointer', color: '#f5222d' }}
                type="link"
                onClick={( e ) => this.deleteItem( e, item )}
              >删除
              </span>
            </div>
          )
        }
      },
    ]

    return (
      <GridContent>
        <div className={styles.standardList}>
          <ClassifyFilterForm
            filterSubmit={this.filterSubmit}
            showAddModal={this.showAddModal}
            wrappedComponentRef={( ref ) => { this.filterForm = ref}}
          />
          <Table
            size="large"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </div>

        <Modal
          maskClosable={false}
          title={info.id ? '编辑分类管理':'添加分类管理'}
          className={styles.standardListForm}
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='类别名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}类别名称` }],
                initialValue: info.name,
              } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}类别名称`} /> )}
            </FormItem>

            <FormItem
              label={( 
                <span>排序
                  <Tooltip title="数值越大越靠前，最小值为1">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              {...this.formLayout}
            >
              {getFieldDecorator( 'sort', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序` }],
                initialValue: info.sort,
                } )(  
                  <InputNumber min={1} style={{ width:'170px' }} placeholder={`${formatMessage( { id: 'form.input' } )}排序`} />
                )}
            </FormItem>

            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'isSale', {
                  rules: [{ required: true, message: '请选择状态' }],
                  initialValue: ( info.isSale === undefined || JSON.stringify( info.isSale ) === '{}' ) ? true : info.isSale
                } )( 
                  <RadioGroup>
                    <Radio value>上架</Radio>
                    <Radio value={false}>下架</Radio>
                  </RadioGroup>
                )}
            </FormItem>

          </Form>
        </Modal>

      </GridContent>
    );
  };
}

export default Classify;