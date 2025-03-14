import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Card, Radio, Select, Button, Alert, Modal } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from '@/services/serviceObj';
// import styles from './edit.less';

const FormItem = Form.Item;
const { Option } = Select;

const designImgs = {
  invite:`${serviceObj.defaultImagePath}SJGF2.png`,
  share: `${serviceObj.defaultImagePath}SJGF1.png`,
}

@connect( ( { bees } ) => ( {
  bees: bees.bees,
} ) )

class ShareOption extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      beesList: [],
      designVisible: false,
      designType: ''
    }
  }

  componentDidMount() {
    const { domData:{ shareActivityId } } = this.props;
    if( shareActivityId ){
      this.handleSearch( shareActivityId, 'id' )
    }
   }


  // 搜索过滤活动列表
  handleSearch = ( value, type ) => {
    if ( value ) {
      let obj ={
        pageNum: 1,
        pageSize: 30,
        name: value,
      }
      if( type ){
        obj ={
          pageNum: 1,
          pageSize: 30,
          id: value,
        }
      }
      // 获取活动列表信息
      const { dispatch } = this.props;
      dispatch( {
        type: 'bees/getBees',
        payload: obj,
        successFun: ( res ) => {
          if ( res && res.list && res.list.length ) {
            this.setState( {
              beesList: res.list
            } )
          }
        }
      } );
    } else {
      this.setState( {
        beesList: []
      } )
    }
  }

  changeInput = ( e, type ) => {
    let val = e
    if ( e && e.target ){
      val = e.target.value
    }
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { [type]: val } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 页面预览
  onChangePreview = ( type, val ) => {
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { [type]: val } );
    if ( type === 'sharePreview' ) {
      if ( obj && obj.sharePagePreview ) delete obj.sharePagePreview

    } else if ( type === 'sharePagePreview' ) {
      if ( obj && obj.sharePreview ) delete obj.sharePreview
    }
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 关闭设计规范
  onCloseDesignVisibleModal = () => {
    this.setState( {
      designVisible: false,
      designType: ''
    } )
  }

  // 打开设计规范
  onOpenDesignVisibleModal = ( type ) => {
    this.setState( {
      designVisible: true,
      designType: type
    } )
  }

  // 设计规范
  renderDesignModal = () => {
    const { designVisible, designType } = this.state
    return (
      <Modal
        title={`${designType === 'invite' ? '邀请' : '分享'}设计规范`}
        visible={designVisible}
        footer={null}
        onCancel={this.onCloseDesignVisibleModal}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img style={{ maxWidth: '400px' }} src={designImgs[designType]} alt="" />
        </div>
      </Modal>
    )
  }

  render() {
    const { beesList } = this.state
    const { domData = {} } = this.props;
    return (
      <div>
        <Card title="页面分享" bordered={false}>
          <FormItem
            style={{ display: 'flex' }}
            label='分享标题'
            {...this.formLayout}
          >
            <Input
              value={domData.shareTitle}
              placeholder="请输入分享标题"
              onChange={( e ) => this.changeInput( e, 'shareTitle' )}
              suffix={
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  {domData.shareTitle ? `${domData.shareTitle.length}` : ''}
                </span>
              }
            />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='分享描述'
            {...this.formLayout}
          >
            <Input
              value={domData.shareDescription}
              placeholder="请输入分享描述"
              onChange={( e ) => this.changeInput( e, 'shareDescription' )}
              suffix={
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  {domData.shareDescription ? `${domData.shareDescription.length}` : ''}
                </span>
              }
            />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='分享链接'
            {...this.formLayout}
          >
            <Input
              value={domData.shareLink}
              placeholder="请输入分享链接"
              onChange={( e ) => this.changeInput( e, 'shareLink' )}
              suffix={
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  {domData.shareLink ? `${domData.shareDescription.length}` : ''}
                </span>
              }
            />
          </FormItem>
          <FormItem
            label='分享图标'
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={domData.shareImage} onChange={e => this.changeInput( e, 'shareImage' )} />
              <div
                style={
                    {
                      width: '180px',
                      fontSize: 13,
                      color: '#999',
                      lineHeight: 2,
                      marginTop: 10,
                      marginLeft: 10,
                    }
                  }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
        </Card>
        {this.renderDesignModal()}
      </div>

    );
  }
}

export default ShareOption;
