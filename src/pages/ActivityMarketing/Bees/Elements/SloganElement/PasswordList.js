import React, { PureComponent } from 'react';
import{ Form, Table, Button, Modal, Input, DatePicker, message, Popconfirm } from 'antd';
import moment from 'moment';


const { RangePicker } = DatePicker;

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

@Form.create()
class PasswordTable extends PureComponent{

  constructor( props ){
    super( props );
    this.state = {
      visible: false,
      saveObj:{}
    }
  }

  componentDidMount(){
    this.initListData()
  }

  initListData=()=>{
    const { eleObj = {} } = this.props
    let newSloganList = eleObj.sloganList ? eleObj.sloganList : []
    if ( eleObj.sloganList && eleObj.sloganList.length > 0 ) {
      newSloganList = eleObj.sloganList.map( info => {
        return {
          ...info,
          rowKey: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
    }
    this.updateSloganListData( newSloganList )
  }

  // 更新列表数据
  updateSloganListData = ( list ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { sloganList: [...list] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState({
      date: new Date()
    })
  }

  onModalConfirm = () => {
    const { form, eleObj:{ sloganList } } = this.props;
    const { saveObj:{ rowKey } } = this.state;
    form.validateFields( ( err, fieldsValue ) => {
      if( err )return;
      const params = fieldsValue;
      const { rangeTime } = fieldsValue;
      params.startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
      params.endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
      delete params.rangeTime;
      let newList = [...sloganList];
      if( rowKey ){ // 编辑
        newList = sloganList.map( item => item.rowKey === rowKey ? ( { ...item, ...params } ): item )
        message.success( '编辑成功' )
      }else{
        const key = Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        newList = sloganList.concat( [{ ...params, rowKey:key } ] )
        message.success( '添加成功' )
      }
      this.updateSloganListData( newList )
      this.setState( {
        saveObj:{},
        visible: false,
      } )
    } )
  }

  editItem=( data )=>{
    this.setState( {
      saveObj:data,
      visible: true,
    } )
  }

  onAddItem=()=>{
    this.setState( {
      visible: true,
    } )
  }

  onModalCancel=()=>{
    this.setState( {
      saveObj:{},
      visible: false,
    } )
  }

  onDeleteItem=( e, data )=>{
    e.stopPropagation();
    const { eleObj:{ sloganList } } = this.props;
    let newList = sloganList
    if ( sloganList.length > 0 ) {
      newList = sloganList.filter( info => {
        return info.id !== data.id
      } )
    }
    this.updateSloganListData( newList )
  }

  render() {
    const { visible, saveObj={} } = this.state;
    const { form: { getFieldDecorator }, eleObj:{ sloganList=[] } } = this.props;
    const columns = [
      {
        title: '口令名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '口令文案',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align:'center',
        render: ( id, item ) => {
          return (
            <div style={{ display:'flex', justifyContent:"center" }}>
              <span
                style={{ marginRight: 20, cursor: 'pointer', color: '#1890ff' }}
                onClick={()=>this.editItem( item )}
              >
                编辑
              </span>

              <span
                style={{ cursor: 'pointer', color: '#f5222d' }}
              >
                <Popconfirm
                  placement="top"
                  title={`是否确认删除:${item.name}`}
                  onConfirm={( e ) => this.onDeleteItem( e, item )}
                  okText="是"
                  cancelText="否"
                >
                  删除
                </Popconfirm>
              </span>
            </div>
          )
        }
      }
    ];

    const modalFooter = {
      okText: '保存',
      onOk: this.onModalConfirm,
      onCancel: this.onModalCancel,
    };

    return(
      <div>
        <Table
          rowKey="rowKey"
          size="small"
          pagination={false}
          columns={columns}
          dataSource={sloganList}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10 }}
          icon="plus"
          onClick={() => this.onAddItem()}
        >
          添加口令
        </Button>
        <Modal
          maskClosable={false}
          title={saveObj.rowKey ? '编辑口令' : '添加口令'}
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form>
            <FormItem label="口令名称" {...formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: '请输入口令名称' }],
                initialValue: saveObj.name
              } )(
                <Input placeholder="请输入口令名称" />
              )}
            </FormItem>
            <FormItem label="口令文案" {...formLayout}>
              {getFieldDecorator( 'content', {
                rules: [{ required: true, message: '请输入口令文案' }],
                initialValue: saveObj.content
              } )(
                <Input placeholder="请输入口令文案" />
              )}
            </FormItem>
            <FormItem label="口令有效时间" {...formLayout}>
              {getFieldDecorator( 'rangeTime', {
                rules: [{ required: false, message: '请输入口令有效时间' }],
                initialValue: saveObj.startTime ? [moment( saveObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( saveObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] :[]
              } )(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:'100%' }} />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}


export default PasswordTable;