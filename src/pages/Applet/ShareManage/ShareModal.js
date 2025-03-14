import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Button, Modal, Form, DatePicker, Row, Col, Checkbox } from 'antd';
import moment from 'moment';

import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import PermissionListForm from './PermissionList.Form';

import styles from '../Lists.less';

const { openService } = serviceObj;

const FormItem = Form.Item;


const { confirm } = Modal;

const time = () => new Date().getTime();



@connect()
@Form.create()
class List extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

  permissionListForm = {}

  constructor(props) {
    const permissionlist = props.current && props.current.permissionList && props.current.permissionList.length > 0 ? props.current.permissionList : [];
    const permissionList = permissionlist.length > 0 ? permissionlist.map((item, index) => ({ ...item, key: time() + index })) : [];
    super(props);
    this.state = {
      // image图
      checked: props.current.forceLogin !== undefined ? props.current.forceLogin : false,
      // coverSrcimage: '',
      // imgagesSrcimage: '',
      // previewVisibleimage: false,
      // previewImageimage: '',
      // fileListimage: props.current.image ? [{ url: props.current.image, uid: props.current.image }] : [],
      permissionList,
    };
  }



  componentWillMount() {

  }

  // componentWillReceiveProps( nextProps ){
  //   if( this.props.current !== nextProps.current ){
  //     console.log( 1213213213213213232 );
  //     this.setState( { fileListimage: nextProps.current.image ? [{ url: nextProps.current.image, uid: nextProps.current.image }] : [], checked: nextProps.current.forceLogin } )
  //   }
  // }

  onRef = (ref, key) => {
    this.permissionListForm[`permissionListForm-${key}`] = ref
  }

  // 删除列表项
  deleteItem = (e, id,) => {
    e.stopPropagation();
    const $this = this;
    const { listType } = this.state;
    const { shareManageData: { list }, dispatch } = this.props;
    const obj = list.find(o => o.id === id);
    confirm({
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage({ id: 'form.del.tit' })}：${obj.title}`,
      onOk() {
        setTimeout(() => {
          if ($this[`delProBtn${id}`]) { $this[`delProBtn${id}`].blur(); }
          if ($this[`delSpeBtn${id}`]) { $this[`delSpeBtn${id}`].blur(); }
        }, 0)

        dispatch({
          type: 'applet/delShareManageData',
          payload: { id },
          callFunc: () => {
            $this.fetchList({ listType });;
          },
        });
      },
      onCancel() {
        setTimeout(() => {
          if ($this[`delProBtn${id}`]) { $this[`delProBtn${id}`].blur(); }
          if ($this[`delSpeBtn${id}`]) { $this[`delSpeBtn${id}`].blur(); }
        }, 0)
      },
    });
  }

  // 取消
  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel()

  };

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, handleSubmit, current } = this.props;
    const { deleteIds } = this.state;
    const id = current ? current.id : '';
    const { permissionListForm } = this;

    let haveError = false;
    Object.keys(permissionListForm).forEach((key) => {
      if (permissionListForm[key].getFormError()) haveError = true
    })
    form.validateFields((err, fieldsValue) => {
      if (err || haveError) return;
      const permissions = [];
      Object.keys(permissionListForm).forEach((key) => {
        const formData = permissionListForm[key].getValues();
        permissions.push(formData);
      })
      const params = id ? Object.assign(fieldsValue, { id },) : fieldsValue;

      dispatch({
        type: 'global/submitShareManageData',
        payload: {
          ...params,
          permissionList: permissions,
          deleteIds
        },
        callFunc: (res) => {
          if (id) {
            handleSubmit()
          } else {
            handleSubmit(res.id)
          }
        }
      })
    });
  };


  onChange = () => {
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
  };

  addPermission = () => {
    const { permissionList } = this.state;

    const newPermissionList = permissionList.concat({ key: time() });
    this.setState({ permissionList: newPermissionList });
  }

  deletePermission = (permission, index) => {
    const { permissionListForm } = this;
    const permissions = [];
    Object.keys(permissionListForm).forEach((key) => {
      const formData = permissionListForm[key].getValues();
      permissionListForm[key].formReset();
      permissions.push(formData);

    })
    const newPermissionList = permissions.filter((item) => item && item.key !== index)
    delete this.permissionListForm[`permissionListForm-${index}`];
    this.setState({ permissionList: newPermissionList });

  }


  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { checked, permissionList } = this.state;
    const { visible, current = {} } = this.props;
    const modalFooter = {
      okText: formatMessage({ id: 'form.save' }),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    return (
      <Modal
        maskClosable={false}
        title={`${current.title ? formatMessage({ id: 'form.exit' }) : formatMessage({ id: 'form.add' })}`}
        className={styles.standardListForm}
        width={650}
        bodyStyle={{ padding: '12px 24px', maxHeight: '72vh', overflow: "auto" }}
        destroyOnClose
        visible={visible}
        {...modalFooter}
      >
        <div>
          <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
            <FormItem label='标题' {...this.formLayout}>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: `${formatMessage({ id: 'form.input' })}标题` }],
                initialValue: current.title,
              })(<Input style={{ width: 350 }} placeholder={`${formatMessage({ id: 'form.input' })}标题`} />)}
            </FormItem>

            <FormItem label='封面图' {...this.formLayout}>
              {getFieldDecorator('image', {
                initialValue: current.image,
              })(<UploadImg aspectRatio={5 / 4} />
              )}
            </FormItem>
            <FormItem label='链接' {...this.formLayout}>
              {getFieldDecorator('link', {
                rules: [{ required: true, message: `${formatMessage({ id: 'form.input' })}链接` }],
                initialValue: current.link,
              })(<Input disabled={!!current.id} style={{ width: 350 }} placeholder={`${formatMessage({ id: 'form.input' })}链接`} />)}
            </FormItem>
            <FormItem label='分享过期时间' {...this.formLayout}>
              {getFieldDecorator('endTime', {
                rules: [{ required: false }],
                initialValue: current.endTime ? moment(current.endTime) : '',
              })(<DatePicker
                placeholder='请选择分享过期时间'
                style={{ width: 200 }}
              />)}
            </FormItem>
            <FormItem label='登录页图标' {...this.formLayout}>
              {getFieldDecorator('logo', {
                initialValue: current.logo,
              })(<UploadImg aspectRatio={1 / 1} />
              )}
              <span style={{ color: '#999' }}>图片建议尺寸 1:1</span>
            </FormItem>
            <FormItem>
              {getFieldDecorator('forceLogin', {
                valuePropName: 'checked',
                initialValue: checked
              })(
                <Checkbox onChange={this.onChange}>需登录才能访问</Checkbox>
              )}
            </FormItem>
            {
              checked && (
                <Row style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 12 }} className={styles.form_gains_detail}>
                  <Col span={7}>用户手机</Col>
                  <Col span={7}>过期时间</Col>
                  <Col span={7}>备注</Col>
                  <Col span={3}>{formatMessage({ id: 'form.action' })}</Col>
                </Row>
              )
            }
            {
              checked && permissionList && permissionList.map(item => (
                <PermissionListForm
                  key={item.key}
                  permission={item}
                  onRef={(ref) => { this.permissionListForm[`permissionListForm-${item.key}`] = ref }}
                  deletePermission={() => { this.deletePermission(item, item.key) }}
                />
              ))
            }

            {checked && (
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 30 }}
                icon="plus"
                onClick={() => this.addPermission()}
              >
                {formatMessage({ id: 'form.add' })}
              </Button>
            )}
            {
              current.id &&
              <FormItem label="小程序分享图" {...this.formLayout}>
                {getFieldDecorator('miniImg', {
                })(
                  <img
                    style={{ width: '150px', height: '150px', border: '1px solid #eee' }}
                    src={`${openService}/wx-mini/qr-codes?configId=1&scene=${current.id}`}
                    alt=''
                  />
                )}
              </FormItem>
            }
          </Form>

        </div>
      </Modal>
    );
  }
}

export default List;
