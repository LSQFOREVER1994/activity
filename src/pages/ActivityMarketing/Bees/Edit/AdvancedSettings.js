/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import {  Form, Radio, Collapse, Row, Col, InputNumber } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './edit.less';

const FormItem = Form.Item;
const { Panel } = Collapse;

const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};

// 组件的高级设置
@connect()
// @Form.create()
class AdvancedSettings extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    let bgColorType = 'SOLID' // 默认为纯色
    if ( props.eleObj && props.eleObj.virtualId ) {
      bgColorType = props.eleObj.backgroundColor ? 'SOLID' : 'TRANSPARENT'
    }
    super( props );
    this.state = {
      visibleBgColor: false, // 展示拾色板
      bgColorType,
      textColorVisible:false,
    }
  }

  componentDidMount() { }

  changeInput = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  changeColor = ( e, type ) => {
    const color = e.hex;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 拾色板
  showBgColor = ( e ) => {
    e.stopPropagation()
    const { visibleBgColor } = this.state;
    this.setState( {
      visibleBgColor: !visibleBgColor
    } )
  }

  // 展示文字拾色板
  showTextColor = ( e ) => {
    e.stopPropagation()
    const { textColorVisible } = this.state;
    this.setState( {
      textColorVisible: !textColorVisible
    } )
  }

  // 背景颜色类型
  changeBgColorType = ( e ) => {
    if ( e && e.target.value === this.state.bgColorType ) return
    this.setState( {
      bgColorType: e.target.value
    }, () => {
      // 类型为透明色时，去除背景色属性值
      if ( e && e.target.value === 'TRANSPARENT' ) {
        const { domData, changeDomData, eleObj } = this.props;
        const elementsList = domData.elements ? domData.elements : []
        const newEleObj = Object.assign( eleObj, { backgroundColor: '' } );
        // 替换对应项
        const newElementsList = elementsList.map( item => {
          return item.virtualId === newEleObj.virtualId ? newEleObj : item;
        } );
        // 刷新总数据
        const newDomData = Object.assign( domData, { elements: newElementsList } );
        changeDomData( newDomData );
        this.setState( { time: new Date() } )
      }
    } )
  }


  hiddenColorModal = ()=>{
    this.setState( {
      textColorVisible:false,
      visibleBgColor:false,
    } )
  }

  // 高级配置Item
  renderSettings() {
    const { visibleBgColor, bgColorType, textColorVisible } = this.state
    const { eleObj = {} } = this.props
    return (
      <div>
        <div
          onClick={this.hiddenColorModal}
          className={styles.cover}
          hidden={!( visibleBgColor||textColorVisible )}
          style={{ top:100 }}
        />
        <Row span={24}>
          <Col span={12}>
            <FormItem label='组件宽度' {...this.formLayout}>
              <InputNumber
                value={eleObj.width}
                placeholder="请输入"
                min={0}
                max={750}
                onChange={( e ) => this.changeInput( e, 'width' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='组件高度' {...this.formLayout}>
              <InputNumber
                value={eleObj.height}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'height' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={12}>
            <FormItem label='外边距离（上）' {...this.formLayout}>
              <InputNumber
                value={eleObj.marginTop}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'marginTop' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='外边距离（下）' {...this.formLayout}>
              <InputNumber
                value={eleObj.marginBottom}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'marginBottom' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={12}>
            <FormItem label='外边距离（左）' {...this.formLayout}>
              <InputNumber
                value={eleObj.marginLeft}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'marginLeft' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='外边距离（右）' {...this.formLayout}>
              <InputNumber
                value={eleObj.marginRight}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'marginRight' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
        </Row>

        <Row span={24}>
          <Col span={12}>
            <FormItem label='内边距离（上）' {...this.formLayout}>
              <InputNumber
                value={eleObj.paddingTop}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'paddingTop' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='内边距离（下）' {...this.formLayout}>
              <InputNumber
                value={eleObj.paddingBottom}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'paddingBottom' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={12}>
            <FormItem label='内边距离（左）' {...this.formLayout}>
              <InputNumber
                value={eleObj.paddingLeft}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'paddingLeft' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='内边距离（右）' {...this.formLayout}>
              <InputNumber
                value={eleObj.paddingRight}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeInput( e, 'paddingRight' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>px</span>
            </FormItem>
          </Col>
        </Row>

        <Row span={24}>
          <Col span={12}>
            <FormItem
              label='组件背景图'
              {...this.formLayout}
            >
              <UploadModal value={eleObj.backgroundImage} onChange={( e ) => this.changeInput( e, 'backgroundImage' )} />
            </FormItem>
          </Col>
        </Row>

        <Row span={24}>
          <Col span={12}>

            <FormItem label="组件背景色" {...this.formLayout}>
              <Radio.Group
                onChange={( e ) => this.changeBgColorType( e )}
                value={bgColorType}
              >
                <Radio value="SOLID">纯色值</Radio>
                <Radio value="TRANSPARENT">透明背景</Radio>
              </Radio.Group>
            </FormItem>
            {bgColorType === 'SOLID' &&
              <FormItem
                label="色值"
                {...this.formLayout}
              >
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                  onClick={( e ) => { this.showBgColor( e ) }}
                >
                  <span style={{ display: 'inline-block', background: eleObj.backgroundColor, width: 116, height: '22px' }} />
                </span>

                {visibleBgColor &&
                  <div style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}>
                    <SketchPicker
                      width="230px"
                      disableAlpha
                      color={eleObj.backgroundColor}
                      onChange={( e )=>this.changeColor( e, 'backgroundColor' )}
                    />
                  </div>
                }
              </FormItem>
            }

            {bgColorType === 'TRANSPARENT' &&
              <FormItem
                label="色值"
                {...this.formLayout}
              >
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(-9deg, transparent 48.5%, #ff0000 49.5%, #ff0000 36.5%, transparent 51.5%)',
                      width: 116,
                      height: '22px',
                      border: '1px solid #333'
                    }}
                  />
                </span>
              </FormItem>
            }
          </Col>
        </Row>
        <Row span={24}>
          <Col span={12}>
            <FormItem label="组件透明度" {...this.formLayout}>
              <InputNumber
                value={eleObj.opacity || 100}
                placeholder="请输入"
                min={0}
                max={100}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.changeInput( e, 'opacity' )}
                style={{ width:'85%' }}
              />
              <span style={{ paddingLeft:'10px' }}>%</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="文字颜色"
              {...this.formLayout}
            >
              <span
                style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                onClick={( e ) => { this.showTextColor(  e ) }}
              >
                <span style={{ display: 'inline-block', background: eleObj.textColor, width: 116, height: '22px' }} />
              </span>

              {textColorVisible &&
              <div style={{ position: 'absolute', bottom: 50, left: 0, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.textColor}
                  onChange={( e ) => { this.changeColor( e, 'textColor' )}}
                />
              </div>
                }
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Collapse>
          <Panel header="组件高级设置" key="1">
            {this.renderSettings()}
          </Panel>
        </Collapse>
      </div>
    )
  }

}

export default AdvancedSettings;
