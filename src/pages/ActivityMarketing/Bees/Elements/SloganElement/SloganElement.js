/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import serviceObj from '@/services/serviceObj';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import PasswordSetting from './PasswordSetting';
import PrizeTable from './PrizeTable';
import styles from './sloganElement.less';

const FormItem = Form.Item;

@connect()
@Form.create()
class SloganElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '口令组件',
      sloganShowType: 'DIRECT',
      textColor:'#C50808',
      popUpBackground:`${serviceObj.defaultImagePath}KL_BG.png`,
      confirmButton:`${serviceObj.defaultImagePath}KL_BTN.png`,
      rewardButton:`${serviceObj.defaultImagePath}KL_REWARD_BTN.png`,
      isRemovePrize:false
    };
    this.upData( defaultObj )
  }

  changeValue = ( val, type ) => {
    let defaultObj = {
      [type]: val,
    };
    if( type === 'sloganShowType' ){
      if( val === 'POPUP' ){
        defaultObj = {
          width:190,
          marginTop:70,
          marginLeft:555,
          ...defaultObj
        };
      }else{
        defaultObj = {
          width:'',
          marginTop:'',
          marginLeft:'',
          ...defaultObj
        };
      }
    }
    this.upData( defaultObj )
  }

  upData=( data )=>{
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, data );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>组件名称</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.name}
            placeholder="请输入组件名称"
            onChange={( e ) => this.changeValue( e.target.value, 'name' )}
            maxLength={20}
          />
        </FormItem>

        <FormItem
          label={<span className={styles.labelText}><span>*</span>展示样式</span>}
          {...this.formLayout}
        >
          <Radio.Group
            onChange={( e ) => this.changeValue( e.target.value, 'sloganShowType' )}
            value={eleObj.sloganShowType}
          >
            <Radio value="DIRECT">直接展示 </Radio>
            <Radio value="POPUP">弹窗展示</Radio>
          </Radio.Group>
          {
            eleObj.sloganShowType === 'POPUP' && ( <div style={{ color: '#f5222d' }}>若和其他任务放在一起，建议使用相同的去/已领取按钮</div> )
          }
        </FormItem>

        {
          eleObj.sloganShowType === 'POPUP' &&
          <>
            <FormItem label={<span className={styles.labelText}><span>*</span>去领取按钮</span>} {...this.formLayout}>
              <div className={styles.uploadText}>
                <UploadModal value={eleObj.rewardButton} onChange={( e ) => this.changeValue( e, 'rewardButton' )} />
                <div className={styles.textStyle}>
                  <div>格式：jpg/jpeg/png</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
            </FormItem>
            <FormItem label="已领取按钮" {...this.formLayout}>
              <div className={styles.uploadText}>
                <UploadModal value={eleObj.isRewardButton} onChange={( e ) => this.changeValue( e, 'isRewardButton' )} />
                <div className={styles.textStyle}>
                  <div>格式：jpg/jpeg/png</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
              <div style={{ color: '#f5222d' }}>确认次数若达到上限，该处未上传则展示去领取按钮，上传则展示已领取按钮且不可点击</div>
            </FormItem>
          </>
        }

        <FormItem label={<span className={styles.labelText}><span>*</span>{eleObj.sloganShowType === 'POPUP' ? '弹窗' : '口令'}背景图</span>} {...this.formLayout}>
          <div className={styles.uploadText}>
            <UploadModal value={eleObj.popUpBackground} onChange={( e ) => this.changeValue( e, 'popUpBackground' )} />
            <div className={styles.textStyle}>
              <div>格式：jpg/jpeg/png</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
          <div style={{ color: '#f5222d' }}>背景图需严格参考范例图在同样位置留出输入口令框、兑换按钮位置</div>
        </FormItem>

        <FormItem label={<span className={styles.labelText}><span>*</span>兑换按钮</span>} {...this.formLayout}>
          <div className={styles.uploadText}>
            <UploadModal value={eleObj.confirmButton} onChange={( e ) => this.changeValue( e, 'confirmButton' )} />
            <div className={styles.textStyle}>
              <div>格式：jpg/jpeg/png</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="已兑换按钮" {...this.formLayout}>
          <div className={styles.uploadText}>
            <UploadModal value={eleObj.isConfirmButton} onChange={( e ) => this.changeValue( e, 'isConfirmButton' )} />
            <div className={styles.textStyle}>
              <div>格式：jpg/jpeg/png</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
          <div style={{ color: '#f5222d' }}>确认次数若达到上限，该处未上传则展示兑换按钮，上传则展示已兑换按钮且不可点击</div>
        </FormItem>

        <FormItem label='口令未填写展示' {...this.formLayout}>
          <Input
            value={eleObj.unWriteTip}
            placeholder="展示口令框未填写时的文案，不填默认空白"
            onChange={( e ) => this.changeValue( e.target.value, 'unWriteTip' )}
            style={{ width: '60%' }}
          />
        </FormItem>

        <PasswordSetting
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
        <PrizeTable
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
        <AdvancedSettings
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      </div>
    )
  }

}

export default SloganElement;
