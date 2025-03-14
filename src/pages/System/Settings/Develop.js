import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Select, Card, Form, Table, Button, Modal, Input, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './develop.less'


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

@connect( ( { system } ) => ( {
  loading: system.loading,
  // 平台列表
  platformyListAll:system.platformyListAll,
  // 对接功能列表
  dockingList:system.dockingList,
} ) )
@Form.create()
class DockingPlatform extends PureComponent {
  state = {
    pageNum:1,
    pageSize:10,
    visible: false,
    // selectKey: '',
    openId: null,
    modalType:'',
    platformySelectList:[],
    idValue:'',
    nameValue:'',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    this.fetchList();
  }

  //  获取平台列表
  fetchList = () => {
    const { pageNum, pageSize, idValue, nameValue } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getPlatformListAll',
      payload: {
        page:{
          pageNum,
          pageSize,
        },
        name:nameValue,
        id:idValue,
      },
    } );
  }

  // 展开触发
  onExpandFunc = ( expanded, id ) => {
    if ( expanded ) {
      this.fetchSpecs( id );
      this.setState( { openId: id } );
    }else{
      this.setState( { openId: null } );
    }
  }

  // 获取规格(对接功能列表)
  fetchSpecs = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getDockingList',
      payload: {
        merchantId:id,
        pageNum: 1,
        pageSize: 100
      },
    } );
  }

  // 获取模版的平台列表
  getPlatformySelectList = () =>{
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getPlatformListAll',
      payload: {
        page:{
          pageNum: 1,
          pageSize: 200,
        }
      },
      callFun:( res )=>{
        const { list=[] }= res||{};
        this.setState( {
          platformySelectList:list,
        } )
      }
    } );
  }

  //  显示模板
  showModal = ( type ) => {
    if( type === 'platform' ){
      this.setState( {
        visible: true,
        current: undefined,
        currentDocking:undefined,
        modalType:type
      } );
    }else {
      this.getPlatformySelectList();
      setTimeout( () => {
        this.setState( {
          visible: true,
          current: undefined,
          currentDocking:undefined,
          modalType:type
        } )
      }, 500 );
    }

  }

  // 显示编辑模板
  showEditModal = ( e, item, type ) => {
    e.stopPropagation();
    if ( type === 'platform' ) {
      this.setState( {
        visible: true,
        current: item,
        modalType: type,
      } );
    }else{
      this.setState( {
        visible: true,
        currentDocking: item,
        modalType: type,
      } );
    }
  }

  //  取消模板
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      currentDocking:undefined
    } );
  };

   //  提交(添加或者编辑标签)
  handleSubmit = ( e, submitType ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current, currentDocking, openId } = this.state;

    const $this = this;
    if( submitType === 'platform' ){
      const id = current ? current.id : '';

      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) return;
        // 判断编辑或者新增
        const params = id ? Object.assign( current, fieldsValue, { id } ) : { ...fieldsValue }
        const isUpdate = !!id;

        dispatch( {
          type: 'system/submitPlatform',
          payload: {
            params,
            isUpdate,
            callFunc: () => {
              $this.setState( {
                visible: false,
                current: undefined,
              } );
              $this.fetchList()
            },
          },
        } );
      } );
    }else{
      const id = currentDocking ? currentDocking.id : '';

      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) return;
        // 判断编辑或者新增
        const params = id ? Object.assign( currentDocking, fieldsValue, { id } ) : { ...fieldsValue }
        const isUpdate = !!id;
        dispatch( {
          type: 'system/submitDocking',
          payload: {
            params,
            isUpdate,
            callFunc: () => {
              $this.fetchSpecs( openId )
              $this.setState( {
                visible: false,
                currentDocking: undefined,
              } );
              $this.fetchList();
            },
          },
        } );
      } );
    }

  };

  // 删除:平台(platform)、功能(docking)
  deleteItem = ( e, { id }, submitType ) => {
    e.stopPropagation();
    const $this = this;
    const { openId } = this.state;
    const { platformyListAll: { list }, dockingList, dispatch } = this.props;
    const obj = submitType === 'platform' ? list.find( o => o.id === id ) : dockingList.list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        if( submitType === 'platform' ){
          dispatch( {
            type: 'system/delpPlatform',
            payload: {
              id,
              // submitType,
              callFunc: () => {
                $this.fetchList();
                // $this.setState( { pageNum, pageSize } )
              },
            },
          } );
        }else{
          dispatch( {
            type: 'system/delpDocking',
            payload: {
              id,
              // submitType,
              callFunc: () => {
                $this.fetchSpecs( openId )
                $this.fetchList();
                // $this.setState( { pageNum, pageSize, } )
              },
            },
          } );
        }

      },
      onCancel() {

      },
    } );
  }

  expandedRowRender = () => {
    const{ dockingList:{ list } } = this.props;
    const columns = [
      {
        title: '对接功能ID',
        width:300,
        dataIndex: 'ID',
        render: ( id, item ) => <span>{item.id || '匿名'}</span>,
      },
      {
        title: '对接功能',
        width:300,
        dataIndex: 'name',
        render: id => <span>{id || '匿名'}</span>,
      },
      {
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, 'docking' )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item, 'docking' )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    )
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  };

  goSearch=()=>{
    this.setState( {
      pageNum:1,
    }, ()=>this.fetchList() );
  }

  empty=()=>{
    this.setState( {
      idValue:'',
      nameValue:'',
      pageNum:1,
    }, ()=>this.fetchList() );
  }

  searchChange=( val, type )=>{
    this.setState( {
      [type]:val,
    } );
  }


  render() {
    const {
      loading, platformyListAll: { total, list }, form: { getFieldDecorator }
    } = this.props;

    const {
      pageSize, openId, visible, current={}, currentDocking={},
      modalType, pageNum, platformySelectList, idValue, nameValue
    } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <span className={styles.btn}>平台ID:</span>
        <Input
          value={idValue}
          placeholder="输入平台ID"
          onChange={( e ) => this.searchChange( e.target.value, 'idValue' )}
          style={{ width: 150, margin:'0 20px 0 5px' }}
        />
        <span className={styles.btn}>平台名称:</span>
        <Input
          value={nameValue}
          placeholder="输入平台名称"
          onChange={( e ) => this.searchChange( e.target.value, 'nameValue' )}
          style={{ width: 150, margin:'0 20px 0 5px' }}
        />
        <Button type="primary" onClick={this.goSearch}>搜索</Button>
        <Button onClick={this.empty} style={{ margin:'0 20px' }}>清空</Button>
        <Button
          type="primary"
          onClick={() => this.showModal( 'platform' )}
        >
          新建平台
        </Button>
        <Button
          type="primary"
          style={{ marginLeft:20 }}
          onClick={() => this.showModal( 'docking' )}
        >新建对接功能
        </Button>

      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter ={
      okText: formatMessage( { id: 'form.save' } ),
      onOk: ( e ) => this.handleSubmit( e, modalType ),
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>平台ID</span>,
        width:300,
        dataIndex: 'ID',
        render: ( id, item ) => <span>{item.id || '匿名'}</span>,
      },
      {
        title: <span>平台</span>,
        width:300,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, 'platform' )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item, 'platform' )}
            >删除
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
            extra={extraContent}
            title="平台对接"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div className={styles.formTopStyle}>
              <Table
                rowKey="id"
                size="large"
                loading={loading}
                columns={columns}
                pagination={paginationProps}
                expandedRowKeys={[openId]}
                expandedRowRender={this.expandedRowRender}
                onExpand={( expanded, record ) => this.onExpandFunc( expanded, record.id )}
                dataSource={list}
                expandRowByClick
                onChange={this.tableChange}
              />
            </div>
          </Card>
        </div>
        {
          visible?

            <Modal
              maskClosable={false}
              title={
                // eslint-disable-next-line no-nested-ternary
                modalType === 'platform' ?
                  ( Object.keys( current ).length > 0 ? '编辑平台对接' : '新建对接平台' )
                :
                  ( Object.keys( currentDocking ).length > 0 ? '编辑功能对接' : '新建功能对接' )
              }
              className={styles.standardListForm}
              width={700}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                {
                  modalType === 'platform' ?
                  (
                    <Form onSubmit={( e ) => this.handleSubmit( e, modalType )}>

                      <FormItem label='平台ID' {...this.formLayout}>
                        {getFieldDecorator( 'id', {
                          rules: [{ required: true, message: `请输入平台ID` }],
                          initialValue: current.id,
                        } )( <Input placeholder='请输入平台ID' disabled={!!current.id} /> )}
                      </FormItem>

                      <FormItem label='平台' {...this.formLayout}>
                        {getFieldDecorator( 'name', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}平台名称` }],
                          initialValue: current.name,
                        } )(
                          <Input placeholder='请输入平台名称' /> )
                          }
                      </FormItem>

                      {/* <FormItem label='描述' {...this.formLayout}>
                        {getFieldDecorator( 'description', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}描述` }],
                          initialValue:current.description,
                        } )( <TextArea rows={4} /> )}
                      </FormItem> */}

                      <FormItem label='密钥' {...this.formLayout}>
                        {getFieldDecorator( 'secretKey', {
                          rules: [{ required: false, message: `密钥在5-100位之间`, pattern:new RegExp( /^[\u4E00-\u9FA5a-zA-Z0-9]{5,100}$/, '' ) }],
                          initialValue: current.secretKey,
                        } )(
                          <Input.Password placeholder="请输入密钥" autoComplete="new-password" />
                          )
                        }
                      </FormItem>
                    </Form>
                  )
                  :
                  (
                    <Form onSubmit={( e ) => this.handleSubmit( e, modalType )}>

                      <FormItem label='平台' {...this.formLayout}>
                        {getFieldDecorator( 'merchantId', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}平台` }],
                          initialValue:currentDocking.merchantId,
                        } )(
                          <Select
                            disabled={!!currentDocking.id}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            placeholder="请选择平台"
                            // onSearch={this.onSearch}
                            // showSearch
                            // filterOption={false}
                            // onChange={this.onChange}
                            // allowClear
                          >
                            {platformySelectList.length > 0 && platformySelectList.map( item =>
                              <Option key={item.id} value={item.id}>{item.name}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>

                      <FormItem label='对接功能' {...this.formLayout}>
                        {getFieldDecorator( 'name', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}对接功能` }],
                          initialValue: currentDocking.name,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}对接功能`} /> )
                          }
                      </FormItem>

                      <FormItem label='描述' {...this.formLayout}>
                        {getFieldDecorator( 'description', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}描述` }],
                          initialValue: currentDocking.description,
                        } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}描述`} /> )}
                      </FormItem>

                      <FormItem label='发放接口' {...this.formLayout}>
                        {getFieldDecorator( 'api', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}发放接口` }],
                          initialValue: currentDocking.api,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}发放接口`} /> )
                          }
                      </FormItem>

                      <FormItem label='下单接口' {...this.formLayout}>
                        {getFieldDecorator( 'orderApi', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}下单接口` }],
                          initialValue: currentDocking.orderApi,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}下单接口`} /> )
                          }
                      </FormItem>

                      <FormItem label='业务参数备注' {...this.formLayout}>
                        {getFieldDecorator( 'apiComment', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}业务参数备注` }],
                          initialValue: currentDocking.apiComment,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}业务参数备注`} /> )
                          }
                      </FormItem>
                      <FormItem label='通知接口' {...this.formLayout}>
                        {getFieldDecorator( 'notifyApi', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}通知接口` }],
                          initialValue: currentDocking.notifyApi,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}通知接口`} /> )
                          }
                      </FormItem>

                      {/* <FormItem label='使用链接' {...this.formLayout}>
                        {getFieldDecorator( 'useLink', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}使用链接` }],
                          initialValue: currentDocking.useLink,
                        } )(
                          <Input placeholder={`${formatMessage( { id: 'form.input' } )}使用链接`} /> )
                          }
                      </FormItem> */}
                    </Form>
                  )
                }
              </div>

            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default DockingPlatform;
