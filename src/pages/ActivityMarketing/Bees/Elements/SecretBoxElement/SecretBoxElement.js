import React, { PureComponent } from 'react';
import { Form, Input, Radio } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import AdvancedSettings from '../../Edit/AdvancedSettings'
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './secretboxelement.less';

const FormItem = Form.Item;
// const { RangePicker } = DatePicker

@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList
} ) )
@Form.create()
class ChatElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  fundItemFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    super( props );
    this.state = {

    }
  }


  componentWillMount() {
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
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

  changeImg = ( e, type ) => {
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
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
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
  }

  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
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
          {/* <FormItem
            label={<span className={styles.labelText}>活动有效时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
            />
          </FormItem> */}
          <FormItem
            label={<span className={styles.labelText}><span>*</span>盲盒数量</span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'boxNumber' )} value={eleObj.boxNumber}>
              <Radio value={6}>6个</Radio>
              <Radio value={4}>4个</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>盲盒样式图</span>}
            {...this.formLayout}
          >
            <UploadModal value={eleObj.boxBefore} onChange={( e ) => this.changeImg( e, 'boxBefore' )} />
            <span>建议比例：图片大小建议不大于1M</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>盲盒开启图</span>}
            {...this.formLayout}
          >
            <UploadModal value={eleObj.boxAfter} onChange={( e ) => this.changeImg( e, 'boxAfter' )} />
            <span>建议比例：图片大小建议不大于1M</span>
          </FormItem>
        </div>
        <div>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            dataKey='prizeList'
          />
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

export default ChatElement;
