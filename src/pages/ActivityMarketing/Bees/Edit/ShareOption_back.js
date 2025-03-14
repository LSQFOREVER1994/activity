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
    if ( type === 'shareType' ) {
      if ( val === 'DEFAULT' ) {
        if ( obj.shareActivityId ) delete obj.shareActivityId
        if ( obj.shareLink ) delete obj.shareLink
      } else if ( val === 'ACTIVITY' ) {
        if ( obj.shareLink ) delete obj.shareLink
        if ( obj.shareImage ) delete obj.shareImage
        if ( obj.sharePreview ) delete obj.sharePreview
      } else if ( val === 'URI' ) {
        if ( obj.shareActivityId ) delete obj.shareActivityId
        if ( obj.shareImage ) delete obj.shareImage
        if ( obj.sharePreview ) delete obj.sharePreview
      }
      if ( obj && obj.sharePagePreview ) delete obj.sharePagePreview
    }

    if ( type === 'inviteShareBackground' ) {
      if ( !val ) {
        if ( obj.sharePagePreview ) delete obj.sharePagePreview
      }
    }
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
          <div style={{ marginBottom: '20px' }}>
            <Alert
              type="warning"
              showIcon
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
                  <span>设置页面右上角分享的链接与信息。需配置标题和描述，才可显示右上角分享按钮。</span>
                </div> )}
            />
          </div>
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

          <FormItem label='分享类型' {...this.formLayout}>
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'shareType' )}
              value={domData.shareType}
            >
              <Radio value="DEFAULT">默认</Radio>
              <Radio value="ACTIVITY">其他活动</Radio>
              <Radio value="URI">自定义链接</Radio>
            </Radio.Group>
          </FormItem>
          {( domData.shareType && domData.shareType === 'DEFAULT' ) &&
            <FormItem
              label='活动分享图片'
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
                <div style={{ marginLeft: '20%', display: 'flex', flexDirection: 'column' }}>
                  <Button type="primary" onClick={() => this.onOpenDesignVisibleModal( 'share' )}>设计规范</Button>
                  {!domData.sharePreview &&
                    <Button
                      type="primary"
                      style={{ marginTop: '10px' }}
                      onClick={() => this.onChangePreview( 'sharePreview', true )}
                      disabled={!domData.shareImage}
                    >
                      页面预览
                    </Button>
                  }
                  {domData.sharePreview &&
                    <Button type="primary" style={{ marginTop: '10px' }} onClick={() => this.onChangePreview( 'sharePreview', false )}>
                      取消预览
                    </Button>
                  }
                </div>
              </div>
            </FormItem>
          }

          {( domData.shareType && domData.shareType === 'ACTIVITY' ) &&
            <FormItem label="其他活动" {...this.formLayout}>
              <Select
                style={{ width: '50%' }}
                showSearch
                showArrow={false}
                filterOption={false}
                defaultActiveFirstOption={false}
                value={domData.shareActivityId}
                placeholder="输入关键字搜索活动"
                onSearch={this.handleSearch}
                onChange={( e ) => this.changeInput( e, 'shareActivityId' )}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {beesList.map( info => {
                  return (
                    <Option key={info.id}>{info.name}</Option>
                  )
                } )}
              </Select>
            </FormItem>
          }
          {( domData.shareType && domData.shareType === 'URI' ) &&
            <FormItem
              style={{ display: 'flex' }}
              label='分享链接'
              {...this.formLayout}
            >
              <Input
                value={domData.shareLink}
                placeholder="请输入分享链接，不填默认本活动链接"
                onChange={( e ) => this.changeInput( e, 'shareLink' )}
              />
            </FormItem>
          }
        </Card>
        <Card title="邀请分享" bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Alert
              type="warning"
              showIcon
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
                  <span>邀请任务配合实现邀请绑定，页面固定展示邀请人信息和手机号绑定模块</span>
                </div> )}
            />
          </div>
          <FormItem
            label='邀请页面背景图片'
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={domData.inviteShareBackground} onChange={( e ) => this.changeInput( e, 'inviteShareBackground' )} />
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
              <div style={{ marginLeft: '20%', display: 'flex', flexDirection: 'column' }}>
                <Button type="primary" onClick={() => this.onOpenDesignVisibleModal( 'invite' )}>设计规范</Button>
                {!domData.sharePagePreview &&
                  <Button
                    type="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => this.onChangePreview( 'sharePagePreview', true )}
                    disabled={!domData.inviteShareBackground}
                  >
                    页面预览
                  </Button>
                }
                {domData.sharePagePreview &&
                  <Button type="primary" style={{ marginTop: '10px' }} onClick={() => this.onChangePreview( 'sharePagePreview', false )}>
                    取消预览
                  </Button>
                }
              </div>
            </div>
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='邀请分享标题'
            {...this.formLayout}
          >
            <Input
              value={domData.inviteShareTitle}
              placeholder="请输入邀请分享标题。配置标题后，才可正常分享。"
              onChange={( e ) => this.changeInput( e, 'inviteShareTitle' )}
              maxLength={20}
              suffix={
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  {domData.inviteShareTitle ? domData.inviteShareTitle.length : 0}/20
                </span>
              }
            />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='邀请分享描述'
            {...this.formLayout}
          >
            <Input
              value={domData.inviteShareDescription}
              placeholder="请输入邀请分享描述"
              onChange={( e ) => this.changeInput( e, 'inviteShareDescription' )}
              maxLength={30}
              suffix={
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  {domData.inviteShareDescription ? domData.inviteShareDescription.length : 0}/30
                </span>
              }
            />
          </FormItem>
          {/* <FormItem
            style={{ display: 'flex' }}
            label='邀请分享链接'
            {...this.formLayout}
          >
            <Input
              value={domData.inviteShareLink}
              placeholder="请输入邀请分享链接"
              onChange={( e ) => this.changeInput( e, 'inviteShareLink' )}
            />
          </FormItem> */}
          {/*
          <div style={{display: 'flex'}}>
          <FormItem
            label='邀请分享图片'
            {...this.formLayout}
          >
            <UploadModal value={domData.inviteShareImage} onChange={( e )=>this.changeInput( e, 'inviteShareImage' )} />
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
              <div>建议尺寸：200px*200px</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem>
          </div>
          */}
        </Card>
        {this.renderDesignModal()}
      </div>

    );
  }
}

export default ShareOption;
