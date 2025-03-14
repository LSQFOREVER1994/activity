/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  message,
} from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import styles from './linkElement.less';

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

@connect()
@Form.create()
class LinkElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  colorLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      linkColorShow: false,
      tagColorShow: false,
      textFontColorShow: false,
      tagFontColorShow: false,
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: "文字链组件",
      title: "文字链卡片标题",
      linkColor: '#f1f1f1',
      tagColor: '#f1f1f1',
      linkRadius: 5,
      tagRadius: 5,
      textFontColor: '#000',
      tagFontColor: '#000',
      wordLinkList: [{
        tag: '置顶',
        content: '文字链内容',
        uri: '',
      }],
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 30,
    };
    const newEleObj = Object.assign( eleObj, defaultObj );
    this.updateDomData( newEleObj );
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    this.updateDomData( newEleObj );
  }

  changeValue = ( e, type ) => {
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    this.updateDomData( newEleObj );
  }

  // 更换拾色板颜色
  changeColor = ( e, type ) => {
    const color = e.hex;
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    this.updateDomData( newEleObj );
  }

  // 拾色板
  showSketchPicker = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Show`;
    this.setState( {
      [visibleType]: !this.state[visibleType]
    } );
  }

  // 关闭拾色板
  hiddenColorModal = () => {
    this.setState( {
      linkColorShow: false,
      tagColorShow: false,
      textFontColorShow: false,
      tagFontColorShow: false,
    } );
  }

  // 删除文字链
  deleteLink = ( index ) => {
    const { eleObj, eleObj: { wordLinkList } } = this.props;
    if ( wordLinkList.length === 1 ) {
      message.warning( '至少保留一个文字链' );
      return;
    }
    wordLinkList.splice( index, 1 );
    const newEleObj = Object.assign( eleObj, { wordLinkList } );
    this.updateDomData( newEleObj );
  }

  // 添加文字链
  addLink = () => {
    const { eleObj, eleObj: { wordLinkList } } = this.props;
    const wordLink = {
      tag: '',
      content: '',
      uri: '',
    };
    wordLinkList.push( wordLink );
    const newEleObj = Object.assign( eleObj, { wordLinkList } );
    this.updateDomData( newEleObj );
  }

  // 监听文字链数据变化
  changeWordLink = ( e, type, index ) => {
    const val = e.target.value
    const { eleObj, eleObj: { wordLinkList } } = this.props;
    const wordLink = wordLinkList[index];
    wordLink[type] = val;
    const newEleObj = Object.assign( eleObj, { wordLinkList } );
    this.updateDomData( newEleObj );
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
   * 渲染文字链列表
   * @param {object} item 文字链数组对象
   * @param {number} index 文字链数组下标
   * @returns
   */
  renderWordLinkList = ( item, index ) => {
    return (
      <Row gutter={24} key={`row_${index}`}>
        <Col span={4} align="right">文字链{index+1}</Col>
        <Col span={16}>
          <FormItem
            label='标签'
            {...this.formLayout}
          >
            <Input
              value={item.tag}
              placeholder="请输入标签"
              onChange={( e ) => this.changeWordLink( e, 'tag', index )}
              maxLength={30}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>文字内容</span>}
            {...this.formLayout}
          >
            <Input
              value={item.content}
              placeholder="请输入文字内容"
              onChange={( e ) => this.changeWordLink( e, 'content', index )}
              maxLength={30}
            />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='跳转链接'
            {...this.formLayout}
          >
            <Input
              value={item.uri}
              placeholder="请输入跳转链接"
              onChange={( e ) => this.changeWordLink( e, 'uri', index )}
              maxLength={200}
            />
          </FormItem>
        </Col>
        <Col span={4}>
          <Button icon="delete" onClick={() => this.deleteLink( index )} />
        </Col>
      </Row>
    )
  }

  /**
   * 渲染数值输入框
   * @param {string} label 表单标签
   * @param {object} eleObj 回显数据
   * @param {string} type 字段类型
   * @returns
   */
  renderInputRadius = ( label, eleObj, type ) => {
    return (
      <FormItem label={label} {...this.colorLayout}>
        <InputNumber
          value={eleObj[type]}
          placeholder="请输入"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={( e ) => this.changeValue( e, type )}
          style={{ width: 100 }}
        />
        <span style={{ paddingLeft: '10px' }}>px</span>
      </FormItem>
    );
  }

  /**
   * 渲染拾色器
   * @param {string} label 表单标签
   * @param {boolean} visible 是否显示拾色板
   * @param {object} eleObj 回显数据
   * @param {string} type 字段类型
   * @returns
   */
  renderSketchPicker = ( label, visible, eleObj, type ) => {
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
              onChange={( e ) => { this.changeColor( e, type ) }}
            />
          </div>
        }
      </FormItem>
    );
  }

  // 渲染添加文字链按钮
  renderAddLinkBtn = () => {
    return (
      <div>
        <div>*文字内容过长可能会被省略部分内容</div>
        <Button
          type="dashed"
          className={styles.addTextLinkBtn}
          icon="plus"
          onClick={this.addLink}
        >
          增加文字链
        </Button>
      </div>
    );
  }

  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const {
      linkColorShow,
      tagColorShow,
      textFontColorShow,
      tagFontColorShow,
    } = this.state;
    const isHidden = !( linkColorShow || tagColorShow || textFontColorShow || tagFontColorShow );

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
          <FormItem
            label='卡片标题'
            {...this.formLayout}
          >
            <Input
              value={eleObj.title}
              placeholder="请输入卡片标题"
              onChange={( e ) => this.changeInput( e, 'title' )}
              maxLength={20}
            />
          </FormItem>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderSketchPicker( "文字链底色", linkColorShow, eleObj, 'linkColor' )}
            </Col>
            <Col span={12}>
              {this.renderSketchPicker( "标签底色", tagColorShow, eleObj, 'tagColor' )}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderInputRadius( "文字链底色圆角值", eleObj, 'linkRadius' )}
            </Col>
            <Col span={12}>
              {this.renderInputRadius( "标签底色圆角值", eleObj, 'tagRadius' )}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderSketchPicker( "文字颜色", textFontColorShow, eleObj, 'textFontColor' )}
            </Col>
            <Col span={12}>
              {this.renderSketchPicker( "标签文字颜色", tagFontColorShow, eleObj, 'tagFontColor' )}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {this.renderInputRadius( "文字链间距", eleObj, 'gap' )}
            </Col>
          </Row>
          {eleObj && eleObj.wordLinkList && eleObj.wordLinkList.map(
            ( item, index ) => this.renderWordLinkList( item, index )
          )}
          {this.renderAddLinkBtn()}
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    );
  }
}

export default LinkElement;
