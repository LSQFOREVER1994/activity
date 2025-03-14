import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Switch } from 'antd';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import styles from './opposingCommentElement.less';

const FormItem = Form.Item;
@connect()
class OpposingCommentElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '正反方评论组件',
      positiveTitle: '正方观点',
      negativeTitle: '反方观点',
      positiveButton: '发布至正方',
      negativeButton: '发布至反方',
      enableLike: true,
      paddingLeft: 30,
      paddingRight: 30,
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    let val = '';
    if( e.target ) {
      val = e.target.value;
    } else {
      val = e;
    }
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
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
          label={<span>正方标题</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.positiveTitle}
            placeholder="请输入正方观点"
            onChange={( e ) => this.changeInput( e, 'positiveTitle' )}
            maxLength={5}
          />
        </FormItem>
        <FormItem
          label={<span>反方标题</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.negativeTitle}
            placeholder="请输入反方观点"
            onChange={( e ) => this.changeInput( e, 'negativeTitle' )}
            maxLength={5}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>发布至正方按钮文字</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.positiveButton}
            placeholder="请输入正方按钮文字"
            onChange={( e ) => this.changeInput( e, 'positiveButton' )}
            maxLength={20}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>发布至反方按钮文字</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.negativeButton}
            placeholder="请输入反方按钮文字"
            onChange={( e ) => this.changeInput( e, 'negativeButton' )}
            maxLength={20}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>是否开启点赞功能</span>}
          labelCol={{ span: 4 }}
        >
          <Switch
            defaultChecked={eleObj.enableLike}
            onChange={( e ) => this.changeInput( e, 'enableLike' )}
          />
        </FormItem>
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

export default OpposingCommentElement;
