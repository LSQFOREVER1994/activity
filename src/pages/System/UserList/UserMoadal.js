/*
 * @Author: RidingWind
 * @Date: 2018-07-11 18:28:17
 * @Last Modified by: 绩牛信息 - YANGJINGRONG
 * @Last Modified time: 2022-09-28 17:37:44
 */
/* eslint-disable no-lonely-if */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Form, Input, message, Select, Checkbox } from 'antd';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;
const { Group } = Checkbox
const { Option } = Select;


@connect( ( { system } ) => ( {
  updating: system.updating,
  roleData: system.roleData,
} ) )

@Form.create()

class ListModal extends PureComponent {

  constructor( props ) {
    super( props );
    this.state = {
      roleList: [...props.roleData.list] || [],
      roleVal: ''
    }
  }

  // 提交
  handleSubmit = () => {
    const {
      form: { validateFields, getFieldsValue }, dispatch,
      portfolio, onCloseModal, onLoadFunc, getRoleList
    } = this.props;

    validateFields( ( err, val ) => {
      if ( err ) return;
      const tags = [];
      getFieldsValue().tags.forEach( item => {
        tags.push( {
          tagId: item
        } )
      } )
      const newInfo = { ...portfolio, ...val, tags };
      if ( newInfo.roleGroupName ) delete newInfo.roleGroupName;
      if ( newInfo.roleGroupId ) delete newInfo.roleGroupId;
      if ( !newInfo.id && !newInfo.account && !newInfo.mobile ){
        message.error( '请输入资金账号或手机号' );
        return;
      }
      dispatch( {
        type: 'system/submitUser',
        payload: newInfo,
        successFunc: ( text ) => {
          message.success( text );
          getRoleList( {} )
          onCloseModal();
          onLoadFunc();
        },
      } )
    } )
  }

  companyScroll = ( e ) => {
    e.persist();
    const { target } = e;
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {
      this.props.getRoleList( { num: 10 } )
    }
  }

  onSearch = ( val ) => {
    const { roleData: { list } } = this.props;
    const arr = [];
    // // 清除定时器
    // clearTimeout( this.timer );
    // this.timer = setTimeout( () => {
    list.forEach( r => {
      if ( r.name && r.name.includes( val ) ) {
        arr.push( r )
      }
    } )
    this.setState( {
      roleList: [...arr],
      roleVal: val,
      time: new Date()
    } )
    // }, 500 );
  }

  onBlur = () => {
    const { roleData: { list } } = this.props;
    this.setState( {
      roleList: [...list],
    } )
  }

  onChange = () => {
    const { roleVal } = this.state;
    if ( roleVal ) {
      this.onBlur()
    }
  }



  render() {
    const { roleList } = this.state;

    const {
      form: { getFieldDecorator },
      visible, updating, portfolio, tagList, onCloseModal
    } = this.props;

    const modalTagList = tagList.map( item => (
      {
        label: item.name,
        value: item.id,
      }
    ) )

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const tags = [];
    if ( portfolio && portfolio.tags ) {
      portfolio.tags.forEach( item => {
        tags.push( item.tagId )
      } )
    }

    let initArr = []
    if ( portfolio.roleGroups && portfolio.roleGroups.length ) {
      initArr = portfolio.roleGroups.map( i => {
        return i.id.toString()
      } )
    }
    return (
      <Modal
        maskClosable={false}
        title={portfolio.id ? '编辑用户' : '新建用户'}
        visible={visible}
        width="70%"
        onCancel={onCloseModal}
        onOk={this.handleSubmit}
      >
        <Spin spinning={updating} tip="loading">
          <Form>
            {/* <FormItem label="头像" {...formItemLayout}>
              {getFieldDecorator( 'profilePhoto', {
                rules: [{ required: false, message: '请选择头像' }],
                initialValue: portfolio.profilePhoto
              } )(
                <UploadImg />
              )}
            </FormItem> */}

            <FormItem label="资金账号" {...formItemLayout}>
              {getFieldDecorator( 'account', {
                rules: [{ required: false, message: '请输入资金账号' }],
                initialValue: portfolio.account || ''
              } )(
                <Input placeholder="请输入资金账号" disabled={!!portfolio.id} />
              )}
            </FormItem>
            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator( 'mobile', {
                rules: [{ required: false, message: '请输入手机号' }],
                initialValue: portfolio.mobile || ''
              } )(
                <Input placeholder="请输入手机号" disabled={!!portfolio.id}  />
              )}
            </FormItem>

            <FormItem label="标签名称" {...formItemLayout}>
              {getFieldDecorator( 'tags', {
                rules: [{ required: false, message: '请选择标签' }],
                initialValue: tags
              } )(
                <Group options={modalTagList} />
              )}
            </FormItem>
            {/* {
              !portfolio.id &&
              <FormItem label="初始密码" {...formItemLayout}>
                {getFieldDecorator( 'password', {
                  rules: [{ required: false, message: '请输入初始密码' }],
                  initialValue: portfolio.password || '123456'
                } )(
                  <Input placeholder="默认:123456" />
                )}
              </FormItem>
            } */}
            {/* <FormItem label='角色' {...formItemLayout}>
              {getFieldDecorator( 'roleGroupIds', {
                // rules: [{ required: true, message: '请选择角色' }],
                initialValue: initArr
              } )(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择角色"
                  onSearch={( val ) => { this.onSearch( val ) }}
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  filterOption={false}
                >
                  {
                    roleList && roleList.map( item => (
                      <Option value={item.id ? item.id.toString() : ''} key={item.id}>
                        {item.name}
                      </Option>
                    ) )
                  }
                </Select>
              )}
            </FormItem> */}
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default ListModal;
