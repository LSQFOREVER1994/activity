/*
 * @Author: RidingWind
 * @Date: 2018-07-11 18:28:17
 * @Last Modified by: 绩牛金融 - RidingWind
 * @Last Modified time: 2018-12-25 11:41:09
 */
/* eslint-disable no-lonely-if */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Spin } from 'antd';
import TreeTable from './TreeTable';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { confirm } = Modal;


const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};

@connect( ( { system } ) => ( {
  updating: system.updating,
} ) )
@Form.create()

class RoleModal extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      isRoleErr: false,
      menuTrees:[],
      menuIds:[]
    };
  }

  componentDidMount(){
    this.fetchList()
  }

  // 提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const{ form, current:{ id, isUse } }= this.props;
    const { menuIds } = this.state;
    let isError = false;
    form.validateFields( ( err, fieldsValue )=>{
      if( err ){
        isError = true;
        return;
      };
      if( menuIds.length === 0 ){
        isError = true;
        this.setState( {
          isRoleErr:true
        } )
        return;
      }
      if( !isError ){
        const data = Object.assign( { ...fieldsValue }, { menuIds }, { id } );
        const { enable } = data;
        const that = this;
        if( !enable && isUse ){
          confirm( {
            cancelText:'取消',
            okText:'确定',
            title:'角色提示',
            content:'此角色下有用户，禁用将导致角色不能使用系统，确认要禁用此角色吗？',
            onOk(){
              that.submitRoleManage( data )
            }
          } )
        }else{
          this.submitRoleManage( data );
        }
      }
    } )
  };

   //  发送数据
  submitRoleManage=( info )=>{
    const { dispatch, onCloseModal, fetchList }=this.props;
    dispatch( {
      type:'system/editRoleListFunc',
      payload:{
        ...info
      },
      callFunc:()=>{
        fetchList();
        onCloseModal();
      }
    } )
  }

  fetchList = () => {
    const { dispatch, current: { id } } = this.props;
    dispatch( {
      type: 'system/getMenuTree',
      payload: {
        id
      },
      callBack: ( res ) => {
        const { menuTrees, menuIds } = res;
        this.setState( {
          menuTrees,
          menuIds
        } )
      }
    } )
  }


  render() {
    const { updating, form: { getFieldDecorator }, current, visible, onCloseModal } = this.props;
    const { isRoleErr, menuTrees, menuIds }= this.state;

    return (
      <Modal
        maskClosable={false}
        title={current.id ? '编辑角色' :'新建角色'}
        visible={visible}
        width="60%"
        onCancel={onCloseModal}
        onOk={this.handleSubmit}
      >
        <Spin spinning={updating}>
          <Form>
            <FormItem label="角色名称" {...formItemLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: '角色名称不能为空' }],
                initialValue: current.name
              } )(
                <Input placeholder="请输入昵称" maxLength={30} />
              )}
            </FormItem>

            <FormItem label="状态" {...formItemLayout} hidden>
              {getFieldDecorator( 'enable', {
              rules: [{ required: true, message: '状态不能为空' }],
                initialValue: current.enable !==undefined ? current.enable : true
              } )(
                <RadioGroup>
                  <Radio value>启用</Radio>
                  <Radio value={false}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator( 'description', {
                rules: [{ required: true, message: '描述不能为空' }],
                initialValue: current.description
              } )(
                <TextArea rows={3} placeholder="输入描述" maxLength={80} />
              )}
            </FormItem>
            <FormItem label="角色代码" {...formItemLayout}>
              {getFieldDecorator( 'code', {
                rules: [{ required: false, message: '请输入角色代码' }],
                initialValue: current.code
              } )(
                <Input placeholder="请输入角色代码" />
              )}
            </FormItem>

            <FormItem
              label={
                <span>
                  <span style={{ color:'#f5222d', marginRight:4 }}>*</span>
                  权限选择
                </span>
              }
              {...formItemLayout}
            >
              <TreeTable 
                data={menuTrees}
                checkedKeys={menuIds}
                onChange={( data )=>{this.setState( { menuIds:data } )}}
              />
              { isRoleErr && <div style={{ color:'#f5222d', fontSize:'14px' }}>请添加权限选择</div>}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );

  }
}

export default RoleModal;
