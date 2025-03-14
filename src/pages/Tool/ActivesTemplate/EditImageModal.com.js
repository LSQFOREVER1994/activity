import React, { PureComponent } from 'react';
import { Form, Row, Input, Modal, Checkbox   } from 'antd';
import { connect } from 'dva';
import UploadImg from '@/components/UploadImg';
import styles from '../Lists.less';


@connect()
@Form.create()
class EditImageModal extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      info: props.info,
      visible: true,
      coverSrc: '',
      imgages: '',
      previewVisible: false,
      previewImage: '',
      fileList:  [],
      linkValue:'',
      buryValue:'',
      noSupportWxValue:false,
      openByAppValue:false
    };
  }

  // componentDidMount() {
  //   window.onerror = function( message, source, lineno, colno, error ) { console.log(error) }
  // }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if( nextProps.info !== prevState.info ) {
      const { info } = nextProps;
      return {
        info,
        linkValue: info ? info.link : '',
        buryValue: info ? info.buryPointId : '',
        noSupportWxValue:info ? info.noSupportWx : false,
        openByAppValue:info ? info.openByApp : false,
        fileList: info ? [{ url: info.img, uid: new Date().getTime() }] : []
      }
    }
    return null;
  }

  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
  }

  changInput = ( e )=> {
    this.setState( { linkValue:e.target.value } )
  }

  changBury = ( e ) => {
    this.setState( { buryValue: e.target.value } )
  }

  changeWx = ( e ) => {
    this.setState( { noSupportWxValue:e.target.checked } )
  }

  changeApp = ( e ) => {
    this.setState( { openByAppValue:e.target.checked } )
  }


  handleOk = () => {
    const { fileList, linkValue, buryValue, noSupportWxValue, openByAppValue, info } = this.state;
    if( fileList.length > 0 ){
      this.props.handleOk( { img: fileList[0].url, link: linkValue, buryPointId: buryValue, noSupportWx:noSupportWxValue, openByApp:openByAppValue, key: info ? info.key:null  } )
    this.setState( {
      visible: true,
      coverSrc: '',
      imgages: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      linkValue: '',
      buryValue:'',
      noSupportWxValue:false,
      openByAppValue:false
    } )
    }
  }

  handleCancel =() => {
    this.props.handleCancel( false )
  }

  render() {
    const { visible } = this.props;
    const { previewVisible, previewImage, fileList, linkValue, buryValue, noSupportWxValue, openByAppValue, info } = this.state;
    console.log( info );
    return (
      <Modal
        title={`${info && info.id ? '编辑' : '添加'}图片、链接`}
        centered
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row style={{ display:'flex' }}>
          <span className={styles.form_title} style={{ marginRight: 10 }}>图片</span>
          <div style={{ height: 110 }}>
            <UploadImg
              previewVisible={previewVisible}
              previewImage={previewImage}
              fileList={fileList}
              CancelFunc={() => { this.CancelFunc( '' ) }}
              PreviewFunc={( e ) => { this.PreviewFunc2( e, '' ) }}
              ChangeFunc={( e ) => this.uploadImg( e, '' )}
              RemoveFunc={() => this.RemoveFunc( '' )}
            />
          </div>
        </Row>
        <Row style={{ display: 'flex', marginBottom: 15, marginTop:15 }}>
          <span className={styles.form_title} style={{ flexShrink:0, marginRight:10 }}>链接</span>
          <Input value={linkValue} onChange={this.changInput} />
        </Row>
        <Row style={{ display: 'flex', marginBottom: 15, marginTop:15, marginLeft:45 }}>
          <Checkbox onChange={this.changeWx} checked={noSupportWxValue}>不支持微信打开</Checkbox>
          <Checkbox onChange={this.changeApp} checked={openByAppValue}>需原生APP打开</Checkbox>
        </Row>
        <Row style={{ display: 'flex' }}>
          <span className={styles.form_title} style={{ flexShrink: 0, marginRight:10 }}>埋点</span>
          <Input value={buryValue} onChange={this.changBury} />
        </Row>
      </Modal>
    );
  }
}

export default EditImageModal;
