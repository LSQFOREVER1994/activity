import React, { PureComponent } from 'react';
import { Form, Input, Select, Button, Upload, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from './bees.less'

const FormItem = Form.Item;
const { Option } = Select;

const cardIcon = require( '@/assets/cardListIcon.png' );

@connect()
@Form.create()
class FilterForm extends PureComponent {
  state = {
    uploading: false
  };


  componentDidUpdate( preProps ){
    const { form:{ setFieldsValue }, formProps, filterSubmit } = this.props;
    if( formProps?.id && formProps?.id !== preProps?.formProps?.id ){
      setFieldsValue( { id: formProps.id } )
      filterSubmit()
    }
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
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

  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 回车搜索
  onkeydown = ( e ) => {
    const { filterSubmit } = this.props;
    const theEvent = e || window.event;
    const code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if ( code === 13 ) {
      e.preventDefault();
      filterSubmit();
    }
  }


  beforeUpload = ( file ) => {
    if ( !file ) return
    const { filterSubmit } = this.props;
    const { lastModified, name } = file;
    if( name.substring( name.length - 3 ) !== 'txt' ){
      message.error( '文件格式类型不是txt' )
      return
    }
    this.setState( { uploading: true } );
    const formData = new FormData();
    if ( lastModified ) {
      formData.append( "file", file ); // 文件对象
    } else {
      formData.append( "file", file, name );
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/importActivity',
      payload: {
        query: {
          file: formData
        },
        successFun: ( res ) => {
          if ( res ) {
            filterSubmit()
            message.success( '导入活动成功，奖品需重新配置' )
          };
          this.setState( { uploading: false } );
        }
      }
    } );
  };




  render() {
    const { uploading } = this.state
    const { form: { getFieldDecorator }, filterSubmit, seachListStyles, listStyles } = this.props;
    return (
      <div className={styles.filter_container}>
        <div style={{ display: 'flex' }}>
          <Form onSubmit={filterSubmit} layout="inline">
            <FormItem label='活动名称'>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="活动名称"
                  style={{ width: 170 }}
                  maxLength={60}
                  onKeyDown={( e ) => {
                    this.onkeydown( e )
                  }}
                />
              )}
            </FormItem>
            <FormItem label='活动ID'>
              {getFieldDecorator( 'id', {
              } )(
                <Input
                  placeholder="活动ID"
                  style={{ width: 170 }}
                  maxLength={60}
                  onKeyDown={( e ) => {
                    this.onkeydown( e )
                  }}
                />
              )}
            </FormItem>

            {/* <FormItem label="协作状态">
            {getFieldDecorator( 'roles', {
              initialValue: '',
            } )(
              <Select style={{ width: 150 }}>
                <Option value="">全部</Option>
                <Option value="CREATOR">我的</Option>
                <Option value="MANAGER,EDITOR,VIEWER">我协作的</Option>
              </Select>
            )}
          </FormItem> */}

            {/* <FormItem label='活动状态'>
          {getFieldDecorator( 'state', {
            initialValue: ''
          } )(
            <Select style={{ width: 150 }}>
              <Option value=''>全部</Option>
              <Option value='ENABLE'>{getValue( activityStates, 'ENABLE' )}</Option>
              <Option value='DISABLE'>{getValue( activityStates, 'DISABLE' )}</Option>
              <Option value='PAUSE'>{getValue( activityStates, 'PAUSE' )}</Option>
            </Select>
          )}
        </FormItem> */}
            {/*
        <FormItem label='审核状态'>
          {getFieldDecorator( 'state', {
          initialValue: ''
        } )(
          <Select style={{ width: 150 }}>
            <Option value=''>全部</Option>
            <Option value='11'>未审核</Option>
            <Option value='22'>待审核</Option>
            <Option value='33'>审核通过</Option>
            <Option value='44'>审核失败</Option>
          </Select>
        )}
        </FormItem> */}
          </Form>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="primary" style={{ marginRight: 10 }} onClick={filterSubmit}>搜索</Button>
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.formReset}>清空</Button>
            <Upload
              fileList={[]}
              beforeUpload={this.beforeUpload}
              disabled={uploading}
              accept='.txt'
              style={{ width: 'auto', height: 'auto', background: 'none', border: 'none' }}
            >
              <Button type='primary' loading={uploading}>导入活动</Button>
            </Upload>
            {/* {
              listStyles === 'card' ?
                <Icon type="unordered-list" className={styles.iconList} onClick={() => seachListStyles( 'list' )} />
                :
                <img alt='' src={cardIcon} className={styles.cardIcon} onClick={() => seachListStyles( 'card' )} />
            } */}
          </div>
        </div>
      </div>

    )
  }

}

export default FilterForm;
