/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from '@/services/serviceObj';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import { BTN_IMAGE, SKETCHPICKER } from './constant';
import styles from './barrageElement.less';

const FormItem = Form.Item;


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

@connect( ( { bees } ) => {
  return {
    searchTagListMap: bees.searchTagListMap,
  }
} )
@Form.create()
class AnswerElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  // 拾色板元素布局
  colorLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      bulletBackgroundShow: false,
      borderColorShow: false,
      bulletFontShow: false,
    }
  }

  componentWillMount() {
    this.initElmentData()
    this.searchTagList()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '弹幕组件',
      showLeftCount:true,
      startButton:`${serviceObj.defaultImagePath}DT_KS.png`,
      bulletCount: 100,
      limit: 20,
      transparency: 80,
      icon:`${serviceObj.defaultImagePath}barrage_btn.png`,
      bulletBackground:'#E8B779',
      borderColor:'#FFFFFF',
      bulletFont:'#FFFFFF',
    }
    const newEleObj = Object.assign( eleObj, defaultObj  );
    this.updateDomData( newEleObj );
  }

  // 获取标签
  searchTagList = ( searchContent ) => {
    const { dispatch } = this.props;
    if ( this.timer ) clearTimeout( this.timer )
    this.timer = setTimeout( () => {
      dispatch( {
        type: 'bees/SearchTagList',
        payload: {
          query: {
            pageNum: 1,
            pageSize: 10,
            name: searchContent,
            enable: true
          },
        },
      } );
    }, searchContent ? 500 : 0 );
  }

  changeInput = ( e, type ) => {
    const val = e && e.target ? e.target.value : e;
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    this.updateDomData( newEleObj );
  }

  changeValue = ( e, type, citem ) => {
    const { eleObj, searchTagListMap } = this.props;
    let obj = {};
    if ( citem ) {
      obj = { [type]: e, tag: { name: citem.props.children, id: citem.props.value }, count: null }
      this.setState( {
        selectTag: searchTagListMap.find( item => item.id === e )
      } )
    } else {
      obj = { [type]: e && e.hex ? e.hex : e }
    }
    const newEleObj = Object.assign( eleObj, obj );
    this.updateDomData( newEleObj );
  }

  // 拾色板
  showSketchPicker = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Show`
    this.setState( {
      [visibleType]: !this.state[visibleType]
    } )
  }

  hiddenColorModal = () => {
    this.setState( {
      bulletBackgroundShow: false,
      borderColorShow: false,
      bulletFontShow: false,
    } )
  }

  // 更新总数据
  updateDomData = ( newEleObj ) => {
    const { domData, changeDomData } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  }

  /**
   * 渲染拾色器
   * @param {object} sketchpicker 拾色板元素信息，包括表单标签及字段
   * @param {boolean} visible 是否显示拾色板
   * @param {object} eleObj 回显数据
   * @returns
   */
  renderSketchPicker = ( sketchpicker, visible, eleObj ) => {
    const { label, type } = sketchpicker;
    return (
      <FormItem label={label} {...this.colorLayout}>
        <div
          className={styles.pickerBox}
          onClick={( e ) => { this.showSketchPicker( e, type ) }}
        >
          <div className={styles.pickerColorBox} style={{ background: eleObj[type] }} />
        </div>
        {visible &&
          <div className={styles.sketchPickerBox}>
            <SketchPicker
              width={230}
              disableAlpha
              color={eleObj[type]}
              onChange={( e ) => { this.changeValue( e, type ) }}
            />
          </div>
        }
      </FormItem>
    );
  }

  // 渲染按钮图元素
  renderBtnImage = ( eleObj, item ) => {
    return (
      <FormItem
        key={item.key}
        label={item.label}
        {...this.formLayout}
      >
        <div style={{ display: 'flex' }}>
          <UploadModal value={eleObj[item.key]} onChange={( e ) => this.changeValue( e, item.key )} />
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
            <div>{item.tip}</div>
            <div>图片大小建议不大于1M</div>
          </div>
        </div>
      </FormItem>
    )
  }

  render() {
    const { bulletBackgroundShow, borderColorShow, bulletFontShow } = this.state
    const { domData = {}, changeDomData, eleObj = {}, searchTagListMap } = this.props;
    const newSearchMap = Object.assign( [], searchTagListMap )
    const isHidden = !( bulletBackgroundShow || borderColorShow ||  bulletFontShow );
    if ( eleObj.tag && !searchTagListMap.find( item => ( item.id === eleObj.tag.id ) ) ) {
      newSearchMap.push( eleObj.tag )
    }
    return (
      <div>
        <div>
          <div onClick={this.hiddenColorModal} className={styles.cover} hidden={isHidden} />
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>

          <FormItem label='弹幕条数' {...this.formLayout}>
            <InputNumber
              value={eleObj.bulletCount}
              placeholder="请输弹幕条数"
              min={1}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'bulletCount' )}
              style={{ width: '85%' }}
            />
          </FormItem>

          <FormItem label='发送弹幕字数限制' {...this.formLayout}>
            <InputNumber
              value={eleObj.limit}
              placeholder="请输入发送弹幕字数限制"
              min={1}
              max={20}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'limit' )}
              style={{ width: '85%' }}
            />
          </FormItem>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderSketchPicker( SKETCHPICKER.bulletBackground, bulletBackgroundShow, eleObj )}
            </Col>
            <Col span={8}>
              {this.renderSketchPicker( SKETCHPICKER.borderColor, borderColorShow, eleObj )}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderSketchPicker( SKETCHPICKER.bulletFont, bulletFontShow, eleObj )}
            </Col>
          </Row>
          <FormItem label='弹幕透明度（%）' {...this.formLayout}>
            <InputNumber
              value={eleObj.transparency}
              placeholder="请输入弹幕透明度"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'transparency' )}
              style={{ width: '85%' }}
            />
          </FormItem>
          {
            BTN_IMAGE.map( item => {
              return this.renderBtnImage( eleObj, item )
            } )
          }
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    )
  }

}

export default AnswerElement;
