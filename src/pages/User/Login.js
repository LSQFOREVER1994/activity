import React, { Component } from 'react';
import { connect } from 'dva';
import cookies from 'js-cookie';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
// import Link from 'umi/link';
import { Alert, Spin } from 'antd';
import { getUrlParameter } from '@/utils/utils';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect( ( { login, loading } ) => ( {
  login,
  submitting: loading.effects['login/login'],
} ) )
class LoginPage extends Component {
  constructor( props ) {
    const superToken = getUrlParameter( 'portalUser' )
    const hiddenBar = getUrlParameter( 'hiddenBar' )
    const redirectUrl  = getUrlParameter( 'redirectUrl' )
     if( hiddenBar ){
      sessionStorage.setItem( 'hiddenBar', hiddenBar )
     }else{
      sessionStorage.removeItem( 'hiddenBar' )
     }
    super( props );
    this.state = {
      superToken,
      redirectUrl
    }
  }

  componentDidMount() {
    const { superToken, redirectUrl } = this.state
    if ( superToken ) {
      this.getSsoLogin( superToken )
    } else {
      const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
      if ( TOKEN ) {
        // alert( redirectUrl )
        router.replace( redirectUrl ? decodeURIComponent( redirectUrl ) : '/home' );
      }
    }
  }

  // 单点登录
  getSsoLogin = ( superToken ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'login/getSsoLogin',
      payload: {
        token:superToken,
      },
    } );
  }


  handleSubmit = ( err, values ) => {
    if ( !err ) {
      const obj = {
        password: values.password,
        username: values.userName,
      }
      const { dispatch } = this.props;
      dispatch( {
        type: 'login/login',
        payload: {
          ...obj,
        },
      } );
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, superToken } = this.state;
    if ( superToken ) return (
      <div className={styles.loading_box}>
        <Spin />
      </div>
    )
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage( formatMessage( { id: 'app.login.message-invalid-credentials' } ) )}
          <UserName
            name="userName"
            placeholder={`${formatMessage( { id: 'validation.userName.required' } )}`}
            rules={[
              {
                required: true,
                message: formatMessage( { id: 'validation.userName.required' } ),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage( { id: 'validation.password.required' } )}`}
            rules={[
              {
                required: true,
                message: formatMessage( { id: 'validation.password.required' } ),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields( this.handleSubmit );
            }}
          />
          <div>
            {/* <span className={styles.register}>
              <FormattedMessage id="app.login.signup" />
            </span>
            <span style={{ float: 'right' }}>
              <FormattedMessage id="app.login.forgot-password" />
            </span> */}
            {/* <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a> */}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
