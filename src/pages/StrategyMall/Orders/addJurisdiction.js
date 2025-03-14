import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Form, Modal, Input,  Select, TreeSelect } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const payObj ={
  'SYSTEM_SEND': formatMessage( { id: 'strategyMall.order.SYSTEM_SEND' } ),
}

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  jurisdictionVisible: strategyMall.jurisdictionVisible,

  goodsSpecsTree: strategyMall.goodsSpecsTree,

  // datas: strategyMall.datas,
  // specsList: strategyMall.specsList,
  orders: strategyMall.orders,
} ) )
@Form.create()
class AddJurisdiction extends PureComponent {
  state = {
    // specsId:'',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch }=this.props;
    // 获取商品
    dispatch( {
      type:'strategyMall/getgoodsSpecs'
    } )

  }
 
  // 点击确定模板逻辑
  handleSubmit = ( e ) =>{
    e.preventDefault();
    const { dispatch, form, refreshFun } = this.props;
    
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      const params = Object.assign( fieldsValue ) ;
      dispatch( {
        type:'strategyMall/addJurisdiction',
        payload: {
          params,
          callFunc:()=>{
            refreshFun();
            dispatch( {
              type:'strategyMall/SetState',
              payload: { jurisdictionVisible: false }
            } )
          }
        },
      } )
    } )
    
  }

//  点击取消隐藏模板
  handleCancel = () =>{
    const { dispatch } = this.props;
    //  发送数据使模板关闭
    dispatch( {
      type:'strategyMall/SetState',
      payload: { jurisdictionVisible: false },
    } )
    
  }

  render() {
    const { jurisdictionVisible, form: { getFieldDecorator }, goodsSpecsTree } = this.props;
    
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    
    return (
      <Modal
        maskClosable={false}
        title='新建订单'
        className={styles.standardListForm}
        width={650}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={jurisdictionVisible}
        {...modalFooter}
      >
        <Form onSubmit={this.handleSubmit}>

          <FormItem label={formatMessage( { id: 'strategyMall.order.username' } )} {...this.formLayout}>
            {getFieldDecorator( 'usernames', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.order.username' } )}` }],
                  // initialValue: current.username,
                } )( <TextArea rows={3} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.order.username' } )}`} /> )}
          </FormItem>
          <div className={styles.infoPics}>用户ID用英文的逗号隔开，如：“id1,id2,id3”</div>

          <FormItem label={formatMessage( { id: 'strategyMall.order.standard' } )} {...this.formLayout}>
            {getFieldDecorator( 'specId', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specs' } )}` }],
                  // initialValue: current.specId ? `${current.specId}`: undefined,
                } )(
                  <TreeSelect
                    // disabled={current.id}
                    dropdownStyle={{ width:200, maxHeight: 400, overflow: 'auto' }}
                    treeData={goodsSpecsTree}
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specs' } )}`}
                    treeDefaultExpandAll
                    // onChange={this.onChange}
                  />
                )}
          </FormItem>
     
          <FormItem label={formatMessage( { id: 'strategyMall.order.orderType' } )} {...this.formLayout}>
            {getFieldDecorator( 'payType', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.order.orderType' } )}` }],
                  // initialValue: current.orderType,
                } )( 
                  <Select
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.order.orderType' } )}`}
                    autocomplete="off"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value="SYSTEM_SEND" selected="selected">{payObj.SYSTEM_SEND}</Option>
                  </Select>
                )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

export default AddJurisdiction;