import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, DatePicker, Select } from 'antd';
import moment from 'moment';
// eslint-disable-next-line import/extensions
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import serviceObj from '@/services/serviceObj';
import styles from './guessElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect()
class GuessElement extends PureComponent {

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
      name: '猜涨跌组件',
      indexCode: 'SHANGHAI_INDEX',
      riseImage: `${serviceObj.defaultImagePath}CZD_KZ.png`,
      fallImage: `${serviceObj.defaultImagePath}CZD_KD.png`,
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

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeValue = ( e, type ) => {
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
    this.setState( { time: new Date() } )
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
            onChange={( e ) => this.changeValue( e, 'name' )}
            maxLength={20}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>组件有效时间</span>}
          {...this.formLayout}
        >
          <RangePicker
            style={{ width: '100%' }}
            value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD' ), moment( eleObj.endTime, 'YYYY-MM-DD' )] : []}
            format="YYYY-MM-DD"
            onChange={( e ) => this.changeDate( e )}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>竞猜标的</span>}
          {...this.formLayout}
        >
          <Select
            style={{ width: '100%' }}
            onChange={( e ) => this.changeValue( e, 'indexCode' )}
            defaultValue={eleObj.indexCode}
            disabled={eleObj.id}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value='SHENZHEN_INDEX'>深证成指</Option>
            <Option value='SHANGHAI_INDEX'>上证指数</Option>
            <Option value='GEM_INDEX'>创业板指数</Option>
          </Select>
          <div style={{
              marginLeft: '-65px',
              color: '#999',
              marginBottom: '-20px',
            }}
          >
            *保存后，竞猜标的将无法更改
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>看涨按钮图</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.riseImage} onChange={( e ) => this.changeValue( e, 'riseImage' )} />
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
              <div>建议比例：</div>
              <div>图片大小建议不大于1M</div>
              <div>图片尺寸比例建议1:1</div>
            </div>
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>看跌按钮图</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.fallImage} onChange={( e ) => this.changeValue( e, 'fallImage' )} />
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
              <div>建议比例：</div>
              <div>图片大小建议不大于1M</div>
              <div>图片尺寸比例建议1:1</div>
            </div>
          </div>
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

export default GuessElement;
