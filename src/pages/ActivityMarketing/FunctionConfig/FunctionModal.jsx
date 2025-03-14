import { Form, Input, Modal, Radio, Tooltip, Icon, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import RadioGroup from 'antd/lib/radio/group';
import { connect } from 'dva';
import React, { useEffect } from 'react';

const JUMP_TYPE = { COMMON: '通用跳转', FUNCTION: '功能跳转', TASK: '任务跳转' };
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const Index = props => {
  const { loading, dispatch, form, visible, data = null, setVisible, getConfigData } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;

  useEffect( () => {
    if ( visible ) {
      resetFields();
    }
  }, [visible] );

  const submit = () => {
    validateFields().then( res => {
      dispatch( {
        type: `functionConfig/${data ? 'updateFunctionConfig' : 'addFunctionConfig'}`,
        payload: {
          body: { ...data, ...res },
          callback: r => {
            if ( r ) {
              message.success( `${data ? '更新' : '添加'}成功` );
              setVisible( false );
              getConfigData();
            }
          },
        },
      } );
    } );
  };

  return (
    <Modal
      confirmLoading={loading}
      title={data ? '编辑' : '新增'}
      visible={visible}
      onCancel={() => setVisible( false )}
      onOk={submit}
    >
      <Form>
        <FormItem label="功能名称" {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator( 'name', {
            initialValue: data?.name || '',
            rules: [{ required: true, message: '请输入功能名称' }],
          } )( <Input placeholder="请输入功能名称" maxLength={30} /> )}
        </FormItem>
        <FormItem
          label={
            <span>
              功能类型&nbsp;
              <Tooltip
                title={
                  <>
                    <div>功能跳转：图片组件等组件里的设置跳转的功能配置</div>
                    <div>任务跳转：任务组件和登录资格里的设置跳转的功能配置</div>
                    <div>通用跳转：同时支持功能跳转和任务跳转。</div>
                  </>
                }
              >
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          {...FORM_ITEM_LAYOUT}
        >
          {getFieldDecorator( 'jumpType', {
            initialValue: data?.jumpType || 'COMMON',
            rules: [{ required: true }],
          } )(
            <RadioGroup>
              {Object.keys( JUMP_TYPE ).map( item => {
                return (
                  <Radio key={item} value={item}>
                    {JUMP_TYPE[item]}
                  </Radio>
                );
              } )}
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="自定义参数" {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator( 'parameter', {
            initialValue: data?.parameter || '',
            rules: [{ required: true, message: '请输入自定义参数' }],
          } )(
            <Input.TextArea
              maxLength={900}
              placeholder="请输入自定义参数"
              style={{ resize: 'none' }}
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
        <FormItem label="端内链接" {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator( 'link', {
            initialValue: data?.link || '',
          } )(
            <Input.TextArea
              maxLength={900}
              placeholder="请输入端内链接"
              style={{ resize: 'none' }}
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
        {/* <FormItem label="端外链接" {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator( 'emblemLink', {
            initialValue: data?.emblemLink || '',
          } )(
            <Input.TextArea
              placeholder="请输入端外链接"
              style={{ resize: 'none' }}
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem> */}
        <FormItem label="端外链接" {...FORM_ITEM_LAYOUT}>
          {getFieldDecorator( 'outLink', {
            initialValue: data?.outLink || '',
          } )(
            <Input.TextArea
              maxLength={80}
              placeholder="请输入端外链接"
              style={{ resize: 'none' }}
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
        
      </Form>
    </Modal>
  );
};

export default connect( ( { functionConfig } ) => ( {
  loading: functionConfig.loading,
} ) )( Form.create()( Index ) );
