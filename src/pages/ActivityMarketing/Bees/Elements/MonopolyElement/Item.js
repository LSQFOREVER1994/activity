import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, Radio, Select } from 'antd';
import { connect } from 'dva';
import UploadModal from '@/components/UploadModal/UploadModal';
import { featureTypes } from '../../BeesEnumes'
import styles from './monopolyElement.less'

const FormItem = Form.Item;
const { Option } = Select;
const options = [
  { label: '不支持微信打开', value: 'noSupportWx' },
  { label: '需原生APP打开', value: 'openByApp' },
];


@connect()
@Form.create()
class Item extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      isShow: false
    }
  }


  componentWillMount() {
    const { info }=this.props
    this.setState( {
      isShow:info.isShow,
    } )
  }

  // 展开、收起
  onChangeShow = () => {
    this.setState( {
      isShow: !this.state.isShow
    } )
  }

  changeInput = ( e, type ) => {
    let val
    if ( e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, changeDomData, eleObj, info, itemIndex } = this.props;
    const { imageElements = [] } = eleObj
    const newCardItem = { ...info, [type]: val, isShow:true }
    const newCardList = imageElements.map( ( o, index ) => {
      return index === itemIndex ? newCardItem : o
    } )
    const newEleObj = Object.assign( eleObj, { imageElements: [...newCardList] } );

    // 替换对应项
    const elementsList = domData.elements ? domData.elements : []
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  onChangeItemValue = ( e, type ) => {
    let val;
    if ( e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, eleObj, changeDomData, info, itemIndex } = this.props;
    const oldClickEvent = info.clickEvent ? info.clickEvent : {};
    const { imageElements = [] } = eleObj;
    const newCardItem = Object.assign( info, { isShow: true }, { clickEvent: { ...oldClickEvent, [type]: val } } );
    const newCardList = imageElements.map( ( o, index ) => {
      return index === itemIndex ? newCardItem : o
    } )
    const newEleObj = Object.assign( eleObj, { imageElements: [...newCardList] } );
    const elementsList = domData.elements ? domData.elements : [];
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // 多选框
  onChangeCheckbox = ( e ) => {
    let noSupportWx = false
    let openByApp = false
    if ( e.indexOf( "noSupportWx" ) > -1 ) {
      noSupportWx = true
    }
    if ( e.indexOf( "openByApp" ) > -1 ) {
      openByApp = true
    }
    const { domData, changeDomData, info, eleObj, itemIndex } = this.props;
    const oldClickEvent = info.clickEvent ? info.clickEvent : {};
    const { imageElements = [] } = eleObj;
    const newCardItem = Object.assign( info, { isShow: true }, { clickEvent: { ...oldClickEvent, noSupportWx, openByApp } } );
    const newCardList = imageElements.map( ( o, index ) => {
      return index === itemIndex ? newCardItem : o
    } )
    const newEleObj = Object.assign( eleObj, { imageElements: [...newCardList] } );
    const elementsList = domData.elements ? domData.elements : [];
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  render() {
    const { isShow } = this.state;
    const { info = {}, itemIndex } = this.props;

    const checkboxVal = []
    if ( info.clickEvent && info.clickEvent.noSupportWx ) {
      checkboxVal.push( 'noSupportWx' )
    }
    if ( info.clickEvent && info.clickEvent.openByApp ) {
      checkboxVal.push( 'openByApp' )
    }

    return (
      <div style={{ border: '1px solid #d9d9d9', padding: 20, marginTop: 20, paddingBottom: isShow ? 0 : 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
            {info.name || `卡片${itemIndex+1}`}
          </div>
          <div style={{ fontSize: '14px', color: '#1890ff' }} onClick={this.onChangeShow}>
            {isShow ? '收起' : '展开'}
          </div>
        </div>
        <div
          hidden={!isShow}
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #d9d9d9'
          }}
        >
          <Form>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>是否启用</span>}
              {...this.formLayout}
            >
              <Radio.Group
                onChange={( e ) => this.changeInput( e, 'enable' )}
                value={info.enable}
              >
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </FormItem>
            {
            info.enable &&
            <div>
              <FormItem
                label={<span className={styles.labelText}><span>*</span>图片</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={info.url} onChange={( e ) => this.changeInput( e, 'url' )}  />
                  <div
                    style={{
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                }}
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>图片尺寸建议450px * 95px </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>


              <FormItem
                label={<span className={styles.labelText}><span>*</span>设置跳转</span>}
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={( e ) => this.onChangeItemValue( e, 'clickType' )}
                  value={info.clickEvent ? info.clickEvent.clickType : 'NONE'}
                >
                  <Radio value="NONE">无</Radio>
                  <Radio value="FEATURE">功能</Radio>
                  <Radio value="CUSTOM_LINK">自定义链接</Radio>
                </Radio.Group>
              </FormItem>
              {
                info.clickEvent && info.clickEvent.clickType === 'FEATURE' &&
                  <FormItem label='选择功能' {...this.formLayout}>
                    <Select
                      style={{ width: '100%' }}
                      onChange={( e ) => this.onChangeItemValue( e, 'key' )}
                      value={info.clickEvent ? info.clickEvent.key : ''}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {featureTypes.map( i => <Option key={i.key} value={i.key}>{i.value}</Option> )}
                    </Select>
                  </FormItem>
              }

              {
                info.clickEvent && info.clickEvent.clickType === 'CUSTOM_LINK' &&
                  <div>
                    <FormItem
                      style={{ display: 'flex' }}
                      label='端内链接'
                      {...this.formLayout}
                    >
                      <Input
                        value={info.clickEvent.link}
                        placeholder="请输入端内链接"
                        onInput={( e ) => this.onChangeItemValue( e, 'link' )}
                        maxLength={2000}
                      />
                    </FormItem>

                    <FormItem
                      style={{ display: 'flex' }}
                      label='端外链接'
                      {...this.formLayout}
                    >
                      <Input
                        value={info.clickEvent.outLink}
                        placeholder="请输入端外链接"
                        onChange={( e ) => this.onChangeItemValue( e, 'outLink' )}
                        maxLength={2000}
                      />
                    </FormItem>

                    <FormItem
                      style={{ display: 'flex' }}
                      label='链接限制'
                      {...this.formLayout}
                    >
                      <Checkbox.Group
                        options={options}
                        value={checkboxVal}
                        onChange={this.onChangeCheckbox}
                      />
                    </FormItem>
                  </div>
              }
            </div>
          }
          </Form>
        </div>
      </div>
    )
  }

}

export default Item;
