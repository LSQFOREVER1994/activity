import React, { PureComponent } from 'react';
import { Form, DatePicker, Input,  Row, Col, Button, Modal  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect()
@Form.create()
class BatchFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      visible:false,
    }; 
  };

  componentDidMount() {
    // this.props.onRef( this )
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();

  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false
    let data = {};
    form.validateFields( ( err, values ) => {
      if ( err ) {
        haveError = err;
      }
      data = { ...detail, ...values };
    } );
    if ( haveError ) return 'error';
    
    return data;
  };

  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {    
     this.props.deleteDetail();
  }

  //  导出模板显示
  showModal = () => {
    this.setState( { visible:true } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
    } );
  };



  render() {

    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    // const groupIdList = selectedRowKeys.sort( ( n1, n2 )=> n1-n2 )

    const { visible } = this.state;
    return(
      <div>
        <Form layout='horizontal' onSubmit={filterSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label='批次ID' {...this.formLayout}>
                {getFieldDecorator( 'groupId', {
              } )(
                <Input
                  placeholder="请选择批次ID"
                  style={{ width: 230 }}
                /> )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label='卡券名称' {...this.formLayout}>
                {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="请输入卡券名称"
                  style={{ width: 230 }}
                /> )}
              </FormItem>
            </Col>

          </Row>

          <Row gutter={24}>

            <Col span={12}>
              <FormItem label='创建时间' {...this.formLayout}>
                {getFieldDecorator( 'createTime', {
                  // initialValue:[moment( start ), moment( end )]
                } )( <RangePicker showTime format="YYYY-MM-DD" style={{ width:330 }} /> )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem wrapperCol={{ span: 16, offset: 5 }}>
                <div>
                  <Button type='primary' style={{ marginRight:15 }} onClick={filterSubmit}>搜索</Button>
                  <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                  {/* <Button type='primary' onClick={() => this.showModal()} disabled={!hasSelected} loading={loadingButton}>导出</Button> */}
                </div>
              </FormItem>
            </Col>

          </Row>
        </Form>
        {
          visible ? 
            <Modal
              title="导出兑换码"
              visible={this.state.visible}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
            >
              {/* <p>批次导出ID：{groupIdList.join( "，" )}的兑换码</p> */}
            </Modal> : null
        }
      </div>
    )}
   
}

export default BatchFilterForm;
