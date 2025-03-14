import React, { Component } from 'react';
import { connect } from 'dva';
import cookies from 'js-cookie';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, message } from 'antd';
import Login from '@/components/Login';
import styles from './ModalLogin.less';


const { UserName, Password, Submit } = Login;

@connect( ( { login } ) => ( {
  login,
} ) )
class ModalLogin extends Component {
  constructor(){
    super()
    this.state={
      loading:false,
    }
  }

  componentDidMount () {
    const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
    if ( TOKEN ) {
        message.success( "登陆成功" )
        this.onCloseLoginModal()
    }
  }

  onCloseLoginModal = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/LoginModalSwitch',
      payload: {
        loginModalVisible: false,
      }
    } )
  }

  getMenuData = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'menu/fetchMenuData',
      payload: { 
        callBackFun :()=>{},
      },
    } );
  }

  handleSubmit = ( err, values ) => {
    if ( !err ) {
      const obj = {
        password: values.password,
        username: values.userName,
      }
      const { getBees } = this.props;
      const { dispatch } = this.props;
      this.setState( {
        loading: true,
      } )
      dispatch( {
        type: 'login/modalLogin',
        payload: {
            query: {
                ...obj
            },
            callBackFun: () => {
                this.onCloseLoginModal();
                this.getMenuData();
                getBees()
                this.setState( {
                  loading: false,
                } )
            }
        },
      } );
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login } = this.props;
    const { type, loading } = this.state;
    return (
      <div>
        <div className={styles.header}>
          {/* <img alt="logo" className={styles.ModalLogo} src={logo} /> */}
          <span className={styles.title}>登录</span>
        </div>
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
              !loading &&
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
            <Submit loading={loading}>
              <FormattedMessage id="app.login.login" />
            </Submit>
          </Login>
        </div>
      </div>
    );
  }
}

export default ModalLogin;
