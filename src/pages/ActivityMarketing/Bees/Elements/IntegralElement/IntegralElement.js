/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Radio, InputNumber } from 'antd';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './integralElement.less';

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
class IntegralElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  componentWillMount(){
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '积分组件',
      typeDisplay:'CUMULATIVE',
      fontSize:24
    }
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
          label={<span className={styles.labelText}><span>*</span>类型展示</span>}
          {...this.formLayout}
        >
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'typeDisplay' )}
            value={eleObj.typeDisplay}
          >
            <Radio value="CUMULATIVE">累计消耗积分</Radio>
            <Radio value="TOTAL">总积分</Radio>
            <Radio value="MY">我的积分</Radio>
          </Radio.Group>
        </FormItem>

        <FormItem
          label={<span className={styles.labelText}><span>*</span>字体大小</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={eleObj.fontSize}
            min={1}
            placeholder="请输入字体大小"
            onChange={( e ) => this.changeValue( e, 'fontSize' )}
            formatter={limitDecimals}
            parser={limitDecimals}
            style={{ width:'50%' }}
          />
          <span style={{ paddingLeft:'10px' }}>px</span>
        </FormItem>


        <AdvancedSettings
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      </div>

    );
  }
}

export default IntegralElement;
