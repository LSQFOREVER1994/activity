import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './customElement.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect()
@Form.create()
class CustomElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      customContent: '', // 用于回显及绑定自定义组件数据内容
    }
  }
  
  componentDidMount() {
    const { eleObj } = this.props;
    // 编辑时，回显数据转成json格式
    let customContent = '';
    if( 'json' in eleObj ) {
      // 若创建的活动内有未通过校验的组件，则此数据不会经过处理，因此需处理后回显
      if ( typeof eleObj.json === 'string' ) {
        customContent = JSON.stringify( JSON.parse( eleObj.json ) );
      } else {
        customContent = eleObj.json && JSON.stringify( eleObj.json );
      }
    }
    this.setState( { customContent } )
  }

  changeInput = ( e, type ) => {
    let val
    if ( type === 'text' || !e.target ) {
        val = e
    } else {
        val = e.target.value
    }
    // 编辑后实时更新数据内容
    if ( type === 'json' ) this.setState( { customContent: val } );
    this.updateDomData( type, val )
  }

  updateDomData = ( type, val ) => {
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
    // eslint-disable-next-line react/no-unused-state
    this.setState( { time: new Date() } );
  }

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
    const { customContent } = this.state;
    return (
      <div>
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
            label={<span className={styles.labelText}><span>*</span>自定义KEY</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.key}
              placeholder="自定义key"
              onChange={( e ) => this.changeInput( e, 'key' )}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>数据内容</span>}
            {...this.formLayout}
          >
            <TextArea
              rows={6}
              value={customContent || ''}
              placeholder="请输入弹框文案"
              onChange={( e ) => this.changeInput( e, 'json' )}
            />
          </FormItem>
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

export default CustomElement;
