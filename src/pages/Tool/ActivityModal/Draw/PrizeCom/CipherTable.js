import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Icon, message, Radio } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../ActivityModal.less';


const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();

@connect()
@Form.create()
class CipherTable extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      list: ( props.data && props.data.cipherList && props.data.cipherList.length )? props.data.cipherList.map( ( item, index ) => ( { ...item, rowKey:index } ) ) : [],
    };
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }


  getData = () =>{
    const { list } = this.state;
    return { cipherList: list }
  }

  getValues = () => {
    const { list } = this.state;
    return{ cipherList: list }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      cipherValue:'',
      explainValue:'',
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, prize ) => {
    e.stopPropagation();
    this.setState( {
      visible: true,
      prizeCurrent:prize,
      cipherValue:prize.cipherText || '',
      explainValue: prize.explanation || '',
    } );
  };

  cipherChange = ( e ) =>{
    this.setState( { cipherValue:e.target.value } )
  }

  explainChange = ( e ) =>{
    this.setState( { explainValue:e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      cipherValue:'',
      explainValue:'',
    } );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.cipherText}`,
      onOk:() => {
        const newList = list.filter( item => item.rowKey !==obj.rowKey );
        this.setState( { 
          list: newList,
        }, ()=>{
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  noPrizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const {  form } = this.props;
    const { prizeCurrent, list } = this.state;
    
    let newList = list
    const $this = this;
    
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      if ( prizeCurrent && JSON.stringify( prizeCurrent ) !== '{}' ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, prizeType: "ALL", rowKey:time() } ] )
        message.success( '添加成功' )
      }
      $this.setState( {
        list:newList,
        visible: false,
        prizeCurrent: undefined,
        cipherValue:'',
        explainValue:'',
      }, ()=>{
        this.onPreview()
      } );
    } );
  };


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible, prizeCurrent = {}, list, cipherValue, explainValue } = this.state;
    
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.noPrizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>签文</span>,
        dataIndex: 'cipherText',
        render:cipherText=><span>{cipherText}</span>
      },
      {
        title: <span>签语</span>,
        dataIndex: 'explanation',
        render: explanation => <span>{explanation || '--'}</span>,
      },
      {
        title: <span>概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability ? `${probability}%` : '--'}</span>
      },
      {
        title: <span>状态</span>,
        dataIndex: 'isSale',
        render: isSale => <span>{isSale ? '上架' : '下架'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <p style={{ color:'#D1261B' }}>设置解签弹窗的不同文案/奖品及其概率，需设置至少一种文案</p>
        <Table
          size="small"
          rowKey="rowKey"
          columns={columns}
          pagination={false}
          dataSource={list}
          footer={( ) => {
            return (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#1890FF',
                  cursor:'pointer'
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                添加签文（{list.length}）
              </div>
            )
          }}
        />
        {
          visible ?
            <Modal
              maskClosable={false}
              title={prizeCurrent.id ? '编辑签文' : '添加签文'}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                <Form className={styles.formHeight} onSubmit={this.noPrizeHandleSubmit}>

                  <FormItem label='签文' {...this.formLayout}>
                    {getFieldDecorator( 'cipherText', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}签文` }],
                      initialValue: prizeCurrent.cipherText,
                    } )(
                      <Input
                        maxLength={4}
                        onChange={this.cipherChange}
                        placeholder={`${formatMessage( { id: 'form.input' } )}签文的标题`}
                      />
                    )}
                    <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{cipherValue.length}/4</span>
                  </FormItem>

                  <FormItem label='签语' {...this.formLayout}>
                    {getFieldDecorator( 'explanation', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}签语` }],
                      initialValue: prizeCurrent.explanation,
                    } )( <TextArea
                      rows={2}
                      placeholder="请输入解签语" 
                      onChange={this.explainChange}
                      maxLength={20}
                    /> )}
                    <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{explainValue.length}/20</span>
                  </FormItem>
                                  
                  <FormItem 
                    label='概率' 
                    {...this.formLayout}
                    extra={<span style={{ color: '#D1261B', fontSize: 11 }}>*所有签文概率之和需为100%</span>}
                  >
                    {getFieldDecorator( 'probability', {
                      rules: [
                        { required: true, message: `${formatMessage( { id: 'form.input' } )}概率,并且只能输入数字` },
                        { pattern:new RegExp( /^(\d|[1-9]\d|100)(\.\d{1,2})?$/ ), message:'请输入0-100的数字,且最多有两位小数' }
                      ],
                      initialValue: prizeCurrent.probability,
                    } )( <Input
                      placeholder='请输入该签文出现的概率' 
                      precision={0}
                      min={0}
                      addonAfter='%'
                    />
                     )}
                  </FormItem>

                  <FormItem label='状态' {...this.formLayout}>
                    {getFieldDecorator( 'isSale', {
                      rules: [{ required: true, message: '请选择状态' }],
                      initialValue:prizeCurrent.isSale === undefined ? true : prizeCurrent.isSale
                    } )(  
                      <Radio.Group>
                        <Radio value>上架</Radio>
                        <Radio value={false}>下架</Radio>
                      </Radio.Group>
                      )}
                  </FormItem>

                </Form>
              </div>
            </Modal> : null
        }
      </GridContent>
    );
  }
}

export default CipherTable;
