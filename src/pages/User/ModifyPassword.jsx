import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { connect } from 'dva';

function ModifyPassword( props ) {

  const { form, location: { pathname } } = props;
  const { getFieldDecorator, validateFields } = form;
  const [confirmDirty, setConfirmDirty] = useState( false );
  const [username, setUsername] = useState( '' )
  const inUserCenter = pathname.includes( 'account' )

  useEffect( () => {
    if ( inUserCenter ) {
      const userInfo = window.localStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' )
      setUsername( userInfo ? JSON.parse( userInfo ).username : '' )
    }
  }, [] )

  const checkSequence = ( value ) => {
    if ( !value ) return true
    const len = value.length
    for ( let i = 0; i < len; i += 1 ) {
      if ( i + 3 < len ) {
        const u1 = value.charCodeAt( i )
        const u2 = value.charCodeAt( i + 1 )
        const u3 = value.charCodeAt( i + 2 )
        const u4 = value.charCodeAt( i + 3 )

        const m = u2 - u1
        if ( m === 1 || m === -1 ) {
          if ( u3 - u2 === m && u4 - u3 === m ) return true
        }
      }
    }
    return false
  }


  const validateToNextPassword = ( rule, value, callback ) => {
    if ( !value ) {
      callback();
      return
    }

    // 至少包含大写字母、小写字母、数字、特殊符号中的 3 种以上
    const regex = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/;
    if ( !regex.test( value ) ) {
      callback( '您的密码必须包含大写字母、小写字母、数字和特殊符号中的3种以上。' );
    }
    // 密码不能相同字符连续3位或3位以上。
    const regex2 = /(.)\1{2,}/;
    if ( regex2.test( value ) ) {
      callback( '您的密码不能包含相同字符的连续3位或3位以上。' );
    }

    // 密码不能连续字符（如1234、abcd）连续4位或4位以上
    if ( checkSequence( value ) ) {
      callback( '您的密码不能包含连续的4位或4位以上字符。' );
    }

    // 至少包含8个字符
    if ( value && value.length < 8 ) {
      callback( '您的密码长度必须至少为8个字符。' );
    }

    // 密码中不得包含系统默认密码admin、password、root等及其变种。
    const valueToLowerCase = value.toLowerCase();
    if ( valueToLowerCase.includes( 'admin' ) || valueToLowerCase.includes( 'password' ) || valueToLowerCase.includes( 'root' ) ) {
      callback( '您的密码不能包含系统默认密码admin、password、root等及其变种。' );
    }

    if ( confirmDirty ) {
      form.validateFields( ['newPasswordRepeat'], { force: true } );
    }

    callback();
  };

  const compareToFirstPassword = ( rule, value, callback ) => {
    if ( value && value !== form.getFieldValue( 'newPassword' ) ) {
      callback( '两次密码输入不一致！' );
    } else {
      callback();
    }
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty( confirmDirty || !!value );
  };

  const logOut = () => {
    const { dispatch } = props;
    dispatch( {
      type: 'login/logout',
    } );
  }

  const handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch } = props;
    validateFields( ( err, values ) => {
      if ( err ) return;
      const query = { ...values }
      delete query.newPasswordRepeat
      dispatch( {
        type: 'login/modifyPassword',
        payload: query,
        callBack: () => {
          message.success( '修改成功! 正在为您跳转到登录页' );
          if ( !inUserCenter ) {
            setTimeout( () => {
              window.location.href = '#/user/login';
            }, 1000 )
          } else {
            logOut()
          }
        }
      } )
    } )
  }

  return (
    <Form style={{ maxWidth: 300, margin: '0 auto' }} onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator( 'username', {
          rules: [{ required: true, message: '请输入工号！' }],
          initialValue: username
        } )(
          <Input
            disabled={!!username}
            placeholder="工号"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator( 'password', {
          rules: [{ required: true, message: '请输入旧密码！' }],
        } )(
          <Input
            type="password"
            placeholder="旧密码"
          />,
        )}
      </Form.Item>
      <Form.Item hasFeedback>
        {getFieldDecorator( 'newPassword', {
          rules: [
            { required: true, message: '请输入新密码！', whitespace: true },
            { validator: validateToNextPassword, }
          ],
        } )(
          <Input.Password
            placeholder="新密码"
          />,
        )}
      </Form.Item>
      <Form.Item hasFeedback>
        {getFieldDecorator( 'newPasswordRepeat', {
          rules: [
            { required: true, message: '请再次输入新密码！', whitespace: true },
            { validator: compareToFirstPassword, }
          ],
        } )(
          <Input.Password
            placeholder="再次输入新密码"
            onBlur={handleConfirmBlur}
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          style={{ width: '100%' }}
          htmlType='submit'
        >
          保存更改
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create( { name: 'ModifyPassword' } )( connect()( ModifyPassword ) )
