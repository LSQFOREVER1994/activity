import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import _ from "lodash";
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Radio, Tooltip, Spin, InputNumber } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();
const { Option } = Select;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
} ) )
@Form.create()
class PrizeTable extends PureComponent {


  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };


  constructor( props ) {
    super( props );
    this.state = {
      list: ( props.prizes && props.prizes.length ) ? props.prizes.map( item => { if ( !item.prizeId ) { item.prizeId = "onWinPrize" } return ( { ...item, rowKey: item.id } ) } ) : [],
      useInventory: '',
      deleteIds: [0],
      popupValue: '',
      visible: false,
      groupIndex: null,
      newAllPrizeList: []
    };
  }


  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  }

  // 获取选择奖品列表
  getPrizeList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        pageNum: 1,
        pageSize: 30,
        name,
      },
      callFunc: ( res ) => {
        this.setState( { newAllPrizeList: [...res] } )
      }
    } );
  }

  getData = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  getValues = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  // 显示新建遮罩层
  showModal = ( groupIndex ) => {
    this.getPrizeList( {} )
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
      groupIndex,
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, item ) => {
    this.setState( {
      groupIndex: item.groupIndex
    } );
    e.stopPropagation();
    const { prizeId } = item;
    if( prizeId && prizeId !=='onWinPrize' ){
      const { newAllPrizeList } = this.state;
      const obj = newAllPrizeList.find( o => o.id === prizeId )
      if( obj ){
        this.setState( {
          useInventory: obj ? obj.activeCount : '',
        } );
      }else{
        const { dispatch } = this.props;
        dispatch( {
          type:'activity/getSinglePrizeList',
          payload:{ id:prizeId },
          callFunc:( res )=>{
            const arr = res ? newAllPrizeList.concat( res ) : newAllPrizeList;
            this.setState( {
              newAllPrizeList:arr,
              useInventory: res ? res.activeCount : '',
            } );
          }
        } )
      }
      this.setState( {
        prizeCurrent:item,
        popupValue: item.popupText,
        visible: true,
      } )
    }else{
        this.setState( {
        visible: true,
        prizeCurrent:{ ...item, prizeId:'onWinPrize' },
        popupValue: item.popupText,
      } );
    }
  }

  popuChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
      groupIndex: null
    } );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list, deleteIds } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk: () => {
        const newList = list.filter( item => item.rowKey !== obj.rowKey );
        let newDeleteIds = deleteIds;

        if ( obj.id ) {
          newDeleteIds = deleteIds.concat( [obj.id] )
        }
        this.setState( { list: newList, deleteIds: newDeleteIds }, () => {
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const { form } = this.props;
    const { prizeCurrent, list, useInventory, groupIndex } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { totalCount, rankFrom, rankTo } = fieldsValue
      if ( useInventory < totalCount ) {
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if ( rankFrom > rankTo ) {
        message.error( '首位名次不能大于末尾名次' )
        return
      }
      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ) : item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, groupIndex, prizeType: "ALL", rowKey: time(), sendMode: "RANKING" }] )
        message.success( '添加成功' )
      }
      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list: newList,
        groupIndex: null,
      }, () => {
        $this.onPreview()

      } );
    } );
  };

  //  奖品输入名称筛选
  onSearch = ( value ) => {
    clearTimeout( this.timer );
    this.timer = setTimeout( () => {
      this.getPrizeList( { name: value } );
    }, 500 );
  }

  popupChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  //  库存切换
  onChange = ( id ) => {
    const { form: { setFieldsValue } } = this.props;
    const { newAllPrizeList } = this.state;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    if( id === 'onWinPrize' || id === undefined || id === '' ){
      setFieldsValue( {
        popupText:'谢谢参与',
        name:'未中奖',
        // image:prizeCurrent && prizeCurrent.image ? prizeCurrent.image : ImgObj.winPrize,
      } )
      this.setState( { popupValue:'谢谢参与' } )
      return
    }
    setFieldsValue( {
      name: getInventory ? getInventory.name : '',
      popupText:`恭喜你，获得${getInventory.name}`,
      // image:prizeCurrent && prizeCurrent.image
    } )
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
      popupValue:`恭喜你，获得${getInventory.name}`,
    } )
  }

  renderPrizeModal = () => {
    const { visible, prizeCurrent = {}, newAllPrizeList = [], useInventory, popupValue, groupIndex } = this.state;

    const { loading, form: { getFieldDecorator } } = this.props;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };
    return (
      <Modal
        maskClosable={false}
        title={`${prizeCurrent.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${groupIndex ? "月榜" : "周榜"}`}
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={visible}
        {...modalFooter}
      >
        <Spin spinning={loading}>
          <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
            <FormItem label='奖品' {...this.formLayout}>
              {getFieldDecorator( 'prizeId', {
              rules: [{ required: true, message: `奖品不能为空!` }],
              initialValue: prizeCurrent.prizeId,
            } )(
              <Select
                onSearch={this.onSearch}
                showSearch
                filterOption={false}
                onChange={( e ) => this.onChange( e )}
              >
                {
                  newAllPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                }
              </Select>
            )}
            </FormItem>
            <FormItem label='奖品名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `奖品名称不能为空!` }],
                initialValue: prizeCurrent.name,
              } )(
                <Input placeholder='请输入奖品名称' />
              )}
            </FormItem>
            <FormItem label='弹窗文案' {...this.formLayout}>
              {getFieldDecorator( 'popupText', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
              initialValue: prizeCurrent.popupText,
            } )( <TextArea
              rows={2}
              placeholder="请输入抽奖结果弹窗文案"
              onChange={this.popupChange}
              maxLength={20}
            /> )}
              <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/20</span>
            </FormItem>

            {/* 名次 */}
            <div style={{ display: "flex", marginLeft: "130px" }}>
              <div style={{ lineHeight: ' 35px', color: "rgba(0, 0, 0, 0.85)" }}>
                <span className={styles.edit_acitve_tab} />
                名次
                <Tooltip title="相同榜单内不同奖品的名次不能重叠">
                  <Icon type="question-circle-o" />
                </Tooltip>：
              </div>
              <FormItem style={{ marginRight: "20px" }} {...this.formLayout}>
                {getFieldDecorator( 'rankFrom', {
                  rules: [{ required: true, message: `首位名次不能为空！` }],
                  initialValue: prizeCurrent.rankFrom,
                } )(
                  <InputNumber
                    placeholder='首位名次'
                    precision={0}
                    min={0}
                  />
                )}
              </FormItem>
              <FormItem {...this.formLayout}>
                {getFieldDecorator( 'rankTo', {
                  rules: [{ required: true, message: `末位名次不能为空！` }],
                  initialValue: prizeCurrent.rankTo,
                } )(
                  <InputNumber
                    placeholder='末位名次'
                    precision={0}
                    min={0}
                  />
                )}
              </FormItem>
            </div>
            <FormItem
              label='活动库存'
              {...this.formLayout}
              extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>当前可用库存：({useInventory}个)</span> : null}
            >
              {getFieldDecorator( 'inventory', {
                rules: [{ required: true, message: `活动库存不能为空!` }, { pattern: new RegExp( /^\+?(0|[1-9][0-9]*)$/ ), message: '请输入正整数' }],
                initialValue: prizeCurrent.inventory,
              } )( <Input
                placeholder='请输入该奖品库存数量'
                precision={0}
                min={0}
                addonAfter='个'
              />
              )}
            </FormItem>

            <FormItem label='是否开启库存预警' {...this.formLayout}>
              {getFieldDecorator( 'inventoryNotice', {
                rules: [{ required: false }],
                initialValue:!!prizeCurrent.inventoryNotice
              } )(
                <Radio.Group>
                  <Radio value={false}>禁用</Radio>
                  <Radio value>启用</Radio>
                </Radio.Group>
              )}
            </FormItem>

          </Form>
        </Spin>
      </Modal>
    )
  }

  renderPrizeTable = ( groupIndex ) => {
    const { list } = this.state;
    // this.setState( { groupIndex } );
    const sortList = _.filter( list, { 'groupIndex': groupIndex } );
    const columns = [
      {
        title: <span>奖项</span>,
        dataIndex: 'name',
        render: name => <span>{name || '未中奖'}</span>
      },
      {
        title: <span>名次</span>,
        dataIndex: 'rank',
        render: ( rank, record ) => {
          if ( record.rankFrom === record.rankTo ) {
            return <span>{record.rankFrom}</span>

          }
          return <span>{record.rankFrom}- {record.rankTo}</span>
        }
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText || '--'}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory || '--'}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || '--'}</span>,
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

    return <Table
      size="small"
      rowKey="rowKey"
      columns={columns}
      pagination={false}
      dataSource={sortList}
      footer={() => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1890FF',
              cursor: 'pointer'
            }}
            onClick={() => this.showModal( groupIndex )}
          >
            <Icon
              type="plus-circle"
              style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
            />
            添加奖品（{sortList.length ? sortList.length : 0}）
          </div>
        )
      }}
    />
  }


  render() {
    return (
      <GridContent>
        <p style={{ color: "#D1261B" }}>设置周榜和月榜的奖品,每期发奖请到猜涨跌数据中手动发放</p>
        <Alert
          style={{ marginBottom: 15 }}
          // className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
              <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` ) }} style={{ color: '#1890FF', cursor: 'pointer' }}>奖品管理</span>
            </div> )}
          banner
        />
        {/* 周榜奖品 */}
        <div style={{ margin: "10px 0" }}><span className={styles.edit_acitve_tab} />  周榜奖品设置:</div>
        {this.renderPrizeTable( 0 )}
        {/* 月榜奖品 */}
        <div style={{ margin: "10px 0" }}><span className={styles.edit_acitve_tab} />  月榜奖品设置:</div>
        {this.renderPrizeTable( 1 )}
        {/* 弹框 */}
        {this.renderPrizeModal()}
      </GridContent>
    );
  }
}

export default PrizeTable;
// const Content = ( props ) => {
//   const { style = {}, sizeText, } = props;
//   return (
//     <div style={{ display: "flex", padding: '10px 0 0 0', ...style }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: 'center',
//           paddingLeft: 15,
//           fontSize: 13,
//           color: '#999',
//           alignItems: 'center'
//         }}
//       >
//         {props.children}
//         <div style={{ marginLeft: 10, position: 'relative', top: -20 }}>
//           <p>格式：jpg/jpeg/png</p>
//           <p>建议尺寸：{sizeText}</p>
//           <p>图片大小建议不大于1M</p>
//         </div>
//       </div>
//     </div>
//   )
// }
