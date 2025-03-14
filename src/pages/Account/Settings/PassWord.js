import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Input, Button, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './PassWord.less';

const FormItem = Form.Item;

@connect()
@Form.create()
class PassWord extends PureComponent {
  onSubmit = () => {
    const {
      dispatch, form: { validateFields, resetFields },
    } = this.props;
    validateFields((err, {
      password, confirm, oldPassword,
    }) => {
      if (confirm !== password) {
        message.error(formatMessage({ id: 'acount.password.err.info' }));
      }
      if (!err && (confirm === password)) {
        dispatch({
          type: 'account/editPassWord',
          payload: {
            query: {
              password,
              oldPassword,
            },
            callFunc: (res) => {
              const { code } = res;
              if (code === 200) {
                message.success(res.message);
                resetFields();
              } else {
                message.error(res.message);
              }
            },
          },
        });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <GridContent className={styles.password}>
        <Card
          style={{ width: 600 }}
          // title="修改密码"
          bordered={false}
        >
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'acount.old.password' })}
          >
            {getFieldDecorator('oldPassword', {
              rules: [{
                required: true, message: formatMessage({ id: 'acount.old.password.info' }),
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'acount.new.password' })}
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: formatMessage({ id: 'acount.new.password.info' }),
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'acount.confirm.password' })}
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: formatMessage({ id: 'acount.confirm.password.info' }),
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" />,
            )}
          </FormItem>
          <div className={styles.btn}>
            <Button type="primary" onClick={this.onSubmit}>{formatMessage({ id: 'acount.password.btnText' })}</Button>
          </div>
        </Card>
      </GridContent>
    );
  }
}

export default PassWord;
