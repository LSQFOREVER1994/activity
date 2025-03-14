/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, DatePicker, Radio, Select } from 'antd';
import moment from 'moment';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import GuessPrize from './PrizeTable';
import styles from './rankElement.less';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;

@connect( ( { bees } ) => ( {
  eligibilityList: bees.eligibilityList,
  eligibilityType: bees.eligibilityType
} ) )

class RankElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props )
    this.state = {
      taskEventId: '',
    }
  }

  componentWillMount() {
    const { eleObj } = this.props
    this.initElmentData()
    this.getEligibilityType();
    if( eleObj.taskTypeId ) {
      this.getEligibilityList( eleObj.taskTypeId )
    }

  }

  // 获取资格类型
  getEligibilityType = ( name ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : ''
        },
        successFun: () => { }
      },
    } );
  }

  // 获取资格列表
  getEligibilityList = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
        }
      },
    } );
  }

  // 选择资格相关
  changeEligibility = ( e, type ) => {
    const { eleObj, changeDomData, domData } = this.props;
    if ( type === 'taskEventType' ) {
      this.getEligibilityList( e )
      this.setState( {
        taskEventType: e,
        taskEventId: '',
      } )
    } else {
      this.setState( {
        taskEventId: e
      } )
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    // 替换对应项
    const newElementsList = elementsList.map( citem => {
      return citem.virtualId === newEleObj.virtualId ? newEleObj : citem;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '排行榜组件',
      withPrize: false,
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

  changeInput = ( e, type, funcType ) => {
    let val
    if ( funcType === 'date' ) {
      val = e && e.format( 'YYYY-MM-DD HH:mm:ss' )
    } else if ( e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, changeDomData, eleObj } = this.props;
    if ( type === 'rankType' ) {
      eleObj.tip = ''
    }
    if ( type === 'withPrize' ) {
      eleObj.openTime = undefined
    }
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

  renderQualifications = () => {
    const { eleObj, eligibilityList, eligibilityType } = this.props;
    const { taskEventId } = this.state
    let obj = {}
    if ( eligibilityList && eligibilityList.length > 0 && taskEventId ) {
      obj = eligibilityList.find( i => i.taskEventId === taskEventId ) || {}
    }

    // 渲染资格选择
    return (
      <Form>
        <FormItem label='关联资格' {...this.formLayout}>
          <div>
            <Select
              style={{ width: '40%' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              listHeight={50}
              value={eleObj.taskEventType}
              placeholder="请选择资格类型"
              onChange={( e, item ) => this.changeEligibility( e, 'taskEventType', item )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {eligibilityType.map( item => (
                <Option key={item.id}>{item.name}</Option>
              ) )}
            </Select>
            <Select
              style={{ width: '40%', marginLeft: '20px' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              value={eleObj.taskEventId}
              placeholder="请选择资格"
              onChange={( e ) => this.changeEligibility( e, 'taskEventId' )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {eligibilityList.map( item => (
                <Option key={item.taskEventId}>{item.name}</Option>
              ) )}
            </Select>
          </div>
        </FormItem>
        <FormItem label='入排行榜门槛' {...this.formLayout}>
          <Input
            value={eleObj.scoreNeed}
            onChange={( e ) => this.changeInput( e, 'scoreNeed' )}
            maxLength={30}
            placeholder='请输入进入排行榜所需的积分门槛，不填默认不限制'
          />
        </FormItem>
        {eleObj.taskEventId &&
          <FormItem label='资格描述' {...this.formLayout}>
            <div style={{ background: '#f5f5f5', padding: '0 10px', borderRadius: '5px' }}>
              {obj.description || '--'}
            </div>
          </FormItem>
        }
        {eleObj.taskEventId &&
          <FormItem label='规则关系' {...this.formLayout}>
            <div style={{ background: '#f5f5f5', padding: '0 10px', borderRadius: '5px' }}>
              {obj.express || '--'}
            </div>
          </FormItem>
        }
      </Form>

    )
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
        <FormItem label={<span className={styles.labelText}><span>*</span>排行榜类型</span>} {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'rankType' )}
            value={eleObj.rankType}
            disabled={!!eleObj.id}
          >
            <Radio value='GUESS'>猜涨跌排行榜</Radio>
            <Radio value='HISTORY'>积分排行榜</Radio>
          </Radio.Group>
          <span>*保存后排行榜类型将无法修改</span>
        </FormItem>
        {
          eleObj.rankType === 'GUESS' &&
          <FormItem label={<span>文案配置</span>} {...this.formLayout}>
            <Input
              value={eleObj.tip}
              placeholder="请输入文案配置"
              onChange={( e ) => this.changeInput( e, 'tip' )}
              maxLength={30}
              suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( eleObj.tip && eleObj.tip.length ) || 0}/30</span>}
            />
          </FormItem>
        }
        <FormItem label={<span className={styles.labelText}><span>*</span>是否发奖</span>} {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'withPrize' )}
            value={eleObj.withPrize}
          >
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>
        {
          eleObj.withPrize &&
          <FormItem
            label={<span className={styles.labelText}><span>*</span>发奖时间</span>}
            {...this.formLayout}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder='请选择时间'
              showTime
              value={eleObj.openTime ? moment( eleObj.openTime, 'YYYY-MM-DD HH:mm:ss' ) : null}
              onChange={( e ) => this.changeInput( e, 'openTime', 'date' )}
              format="YYYY-MM-DD HH:mm:ss"
            />
            <div style={{ color: 'red', marginLeft: '-75px', marginBottom: '-20px' }}>
              *一期仅可发奖一次，如需发多次请更新期数。
            </div>
          </FormItem>
        }
        {
          this.renderQualifications()
        }
        {
          eleObj.withPrize &&
          <div
            // hidden={!eleObj.isPrize}
            style={{ marginTop: '20px' }}
          >
            <GuessPrize
              domData={domData}
              changeDomData={changeDomData}
              eleObj={eleObj}
            />
          </div>
        }
        <div style={{ marginTop: '20px' }}>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            itemIndex={1}
          />
        </div>
      </div>
    )
  }
}

export default RankElement;
