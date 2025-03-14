/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Collapse, Icon, InputNumber } from 'antd';
import { connect } from 'dva';
import EligibilityModal from './EligibilityModal';
import PasswordTable from './PasswordList';
import styles from './sloganElement.less';

const FormItem = Form.Item;
const { Panel } = Collapse;
const { TextArea } = Input;

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
class PasswordSetting extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  state = {
    eligibilityModalVisible: false,
  }


  changeValue = ( val, type ) => {
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
    this.setState( { time: new Date() } )
  }


  // 打开资格编辑弹框
  onChangeEligibilityModal= ()=>{
    this.setState( {
      eligibilityModalVisible:true
    } )
  }

  // 资格选择确定
  eligibilityModalConfirm = ( data )=>{
    const { taskEventType, taskEventId, name }=data;
    this.changeValue( taskEventType, 'sloganEventType' )
    this.changeValue( taskEventId, 'sloganEventId' )
    this.changeValue( name, 'sloganEventName' )
    this.setState( {
      eligibilityModalVisible:false
    } )
  }

  // 资格选择弹框关闭
  eligibilityModalCancel = ()=>{
    this.setState( {
      eligibilityModalVisible:false
    } )
  }

  render() {
    const{ eligibilityModalVisible }=this.state;
    const { eleObj={}, domData, changeDomData }=this.props;
    return(
      <Collapse style={{ marginBottom:20 }} defaultActiveKey={['1']}>
        <Panel header="口令设置" key="1">
          <FormItem label={<span className={styles.labelText}>口令确认资格</span>} {...this.formLayout}>
            <div style={{ display:'flex', alignItems:'center' }}>
              <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
                {( eleObj && eleObj.sloganEventId )? eleObj.sloganEventName:'--'}
              </div>
              <Icon
                type="edit"
                style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }}
                onClick={this.onChangeEligibilityModal}
              />
            </div>
            <div style={{ color: "#f5222d" }}>
              当用户不符合口令填写资格时，该用户的口令确认无效并弹出不符合资格提示toast
            </div>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}>不符合资格提示</span>}
            {...this.formLayout}
          >
            <TextArea
              onChange={( e ) => this.changeValue( e.target.value, 'unqualifiedTip' )}
              placeholder="请输入不符合邀请资格提示"
              value={eleObj && eleObj.unqualifiedTip}
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </FormItem>

          <FormItem label='确认次数上限' {...this.formLayout}>
            <InputNumber
              value={eleObj.confirmLimit}
              placeholder="请输入活动内所有口令可兑换次数，不填默认不限制"
              onChange={( val ) => this.changeValue( val, 'confirmLimit' )}
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              style={{ width: '60%' }}
            />
          </FormItem>

          <FormItem label='口令填写字号' {...this.formLayout}>
            <InputNumber
              value={eleObj.sloganFillSize}
              placeholder="请输入口令填写字号"
              onChange={( val ) => this.changeValue( val, 'sloganFillSize' )}
              min={0}
              style={{ width: '60%' }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
            <span style={{ paddingLeft:'10px' }}>px</span>
          </FormItem>

          <PasswordTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />

          {eligibilityModalVisible &&
            <EligibilityModal
              eleObj={eleObj}
              modalVisible={eligibilityModalVisible}
              eligibilityModalConfirm={this.eligibilityModalConfirm}
              eligibilityModalCancel={this.eligibilityModalCancel}
            />
          }
        </Panel>
      </Collapse>
    )
  }

}

export default PasswordSetting;
