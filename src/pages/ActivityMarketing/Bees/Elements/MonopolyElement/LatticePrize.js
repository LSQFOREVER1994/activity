import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Collapse, Select, Table, Button, Popconfirm, message } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './monopolyElement.less';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class LatticePrize extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    const { eleObj:{ images } } = this.props;
    this.state = {
      numList: images, // 抽奖格子的格子序号
      list:[],
      current:{},
      visible:false,
    }
  }
  
  componentDidMount() {
    this.initPeizeData()
  }

  static getDerivedStateFromProps( props, state ) {
    if ( props.eleObj.images !== state.numList ) {
      return {
        numList: props.eleObj.images
      }
    }
    return null
  }

  // 更新列表数据
  updatePrizeListData = () => {
    const { list }=this.state;
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { luckyGrids: [...list] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // 处理列表数据（动态添加key）
  initPeizeData = () => {
    const { eleObj = {} } = this.props
    let luckyGridsList = eleObj.luckyGrids ? eleObj.luckyGrids : []
    if ( eleObj.luckyGrids && eleObj.luckyGrids.length > 0 ) {
      luckyGridsList = eleObj.luckyGrids.map( info => {
        return {
          ...info,
          luckyGridId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
    }
    this.setState( {
      list:luckyGridsList
    } )
  }

  // 添加列表
  onAddItem=()=>{
    this.setState( {
      current:{},
      visible:true
    } )
  }

  // 编辑列表
  onEditItem=( e, info )=>{
    this.setState( {
      current:info,
      visible:true
    } )
  }

  // 关闭模版
  handleCancel=()=>{
    this.setState( {
      current:{},
      visible:false
    } )
  }

  // 添加/编辑提交
  handleSubmit=( e )=>{
    e.preventDefault();
    const { form } = this.props;
    const { current, list }=this.state;
    if( list && list.length > 17 ){
      message.error( '抽奖格子最大配置17格' )
      return
    }
    let newList = list;
    form.validateFields( ( err, fieldsValue )=>{
      if ( err ) return;
      const { gridId } = fieldsValue;
      if( list.find( i => i.gridId === gridId ) ){
        message.error( '该格子已配置' );
        return
      }
      if ( current && current.luckyGridId ) {
        newList = list.map( item => item.luckyGridId === current.luckyGridId ? ( { ...item, ...fieldsValue } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, luckyGridId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ) } ] )
        message.success( '添加成功' )
      }
      this.setState( {
        list:newList
      }, () =>{
        this.handleCancel()
        this.updatePrizeListData()
      } )
    } )
  }


  // 删除
  onDeleteItem=( e, info )=>{
    e.stopPropagation();
    const { list }=this.state;
    const newList = list.filter( item => item.luckyGridId !== info.luckyGridId );
    this.setState( { list: newList }, this.updatePrizeListData )
  }

  render() {
    const { list, visible, current, numList } = this.state;
    const { form: { getFieldDecorator } }= this.props;

    const columns = [
      {
        title: '格子序号',
        dataIndex: 'gridId',
        render:gridId=><span>{gridId}</span>
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditItem( e, item )}
            >编辑
            </span>

            <span
              style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
            >
              <Popconfirm placement="top" title={`是否删除序号:${item.gridId}`} onConfirm={( e ) => this.onDeleteItem( e, item )} okText="是" cancelText="否">
                <span>删除</span>
              </Popconfirm>
            </span>
          </div>
        ),
      },
    ];


    const modalFooter = {
      okText: '保存',
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };


    return (
      <div>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="抽奖格子配置" key="1">
            <div style={{ color: '#f73232', fontSize: 12 }}>
              *选择格子序号添加需要抽奖功能的格子，未设置的格子默认为普通格子，无任何功能。<br />
              只要经过该格子即可自动抽奖发放奖励。
            </div>
            <div style={{ marginTop:20 }}>
              <Table
                rowKey="gridId"
                rowClassName={() => styles['editable-row']}
                dataSource={list}
                columns={columns}
                bordered
                pagination={false}
                size='small'
              />
            </div>

            <Button
              type="dashed"
              style={{ width: '100%', marginTop: 10 }}
              icon="plus"
              onClick={() => this.onAddItem()}
            >
              添加抽奖格子
            </Button>
          </Panel>
        </Collapse>
        <Modal
          maskClosable={false}
          title={current.id ? '编辑' : '添加'}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form>
            <FormItem label='格子序号' {...this.formLayout}>
              {getFieldDecorator( 'gridId', {
              rules: [{ required: true, message: `请选择格子序号` }],
              initialValue: current.gridId,
            } )(  
              <Select 
                showSearch
                filterOption={false}
                placeholder="请选择要设置为抽奖格子的格子序号" 
              >
                {
                  numList.map( ( _, n )=>(
                    <Option value={n+1} key={Math.random().toString( 36 ).slice( 2 )}>{n+1}</Option>
                  ) )
                }
              </Select>
              )}
            </FormItem>
            <FormItem label='抽奖图标' {...this.formLayout}>
              {getFieldDecorator( 'image', {
                rules: [{ required: true, message: `请上传图标` }],
                initialValue: current.image,
              } )( <UploadModal  /> )}
              <div
                style={{ 
                  position: 'absolute', 
                  top:0, left:'125px', 
                  width:'180px',
                  fontSize: 13,
                  color: '#999', 
                  lineHeight:2,
                  marginTop:'10px',
                  marginLeft:'20px'
                }}
              >
                <div>格式：jpg/jpeg/png </div>
                <div>建议尺寸：180px*180px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

}

export default LatticePrize;
