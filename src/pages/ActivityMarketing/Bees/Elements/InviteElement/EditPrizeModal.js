/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber, Radio, Modal, Select, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './inviteElement.less'

const FormItem = Form.Item;
const { Option } = Select;
// const { TextArea } = Input;
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

const keyVerification = ['image', 'relationPrizeType', 'relationPrizeId', 'name', 'expireType']

@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  prizeList: bees.prizeList
} ) )
@Form.create()
class EditPrizeModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  formLayoutCheckbox = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      editList: [],
      optionPrizeType: '',
      saveObj: {}, // 数据存放。最后提交保存
    }
  }

  componentWillMount() {
    this.initEditData();
  }


  // 模糊搜索奖品列表
  getPrizeList = ( rightName, relationPrizeType ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType
      },
    } );
  }

  // 初始化编辑数据
  initEditData = () => {
    const { eleObj = {}, editPositionKey, configPrizeKey } = this.props;
    // 编辑数据处理
    const prizeList = eleObj[configPrizeKey] ? eleObj[configPrizeKey] : []
    let editList = []
    if ( prizeList.length > 0 && editPositionKey ) {
      editList = prizeList.filter( info => {
        return info.prizeVirtualId === editPositionKey
      } )
    }
    let optionPrizeType = 'PRIZE'
    const prizeIdList = []
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        if ( info && info.relationPrizeId ) {
          prizeIdList.push( info.relationPrizeId )
        }
      } )
    }
    if ( editPositionKey && prizeIdList && !prizeIdList.length ) {
      optionPrizeType = 'THANKS'
    }
    this.setState( {
      saveObj: editList.length ? editList[0] : {},
      optionPrizeType
    }, () => {
      this.getPrizeList( '', editList.length ? editList[0].relationPrizeType : '' )
    } )
  }

  // 切换配置的奖品类型
  changePrizeType = ( e ) => {
    this.setState( {
      optionPrizeType: e.target.value
    } )
  }

  // 弹框保存操作
  onPrizeModalConfirm = () => {
    const { editPositionKey } = this.props
    if ( editPositionKey ) {
      this.onEdit()
    } else if ( !editPositionKey ) {
      this.onAdd()
    }
  }

  // 新增
  onAdd = () => {
    if ( !this.onPrizeModalVerification() ) return
    const { saveObj } = this.state
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible, configPrizeKey } = this.props;
    const prizeList = eleObj[configPrizeKey] || []
    const editObj = {
      ...saveObj,
      probability: 0,
      prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
    }

    if ( prizeList.findIndex( item => item.probability1 || item.probability1 === 0 ) > -1 ) editObj.probability1 = 0
    if ( prizeList.findIndex( item => item.probability2 || item.probability2 === 0 ) > -1 ) editObj.probability2 = 0
    if ( prizeList.findIndex( item => item.probability3 || item.probability3 === 0 ) > -1 ) editObj.probability3 = 0
    if ( prizeList.findIndex( item => item.probability4 || item.probability4 === 0 ) > -1 ) editObj.probability4 = 0
    if ( prizeList.findIndex( item => item.probabilityL || item.probabilityL === 0 ) > -1 ) editObj.probabilityL = 0
    if ( prizeList.findIndex( item => item.probabilityL1 || item.probabilityL1 === 0 ) > -1 ) editObj.probabilityL1 = 0
    if ( prizeList.findIndex( item => item.probabilityL2 || item.probabilityL2 === 0 ) > -1 ) editObj.probabilityL2 = 0
    if ( prizeList.findIndex( item => item.probabilityL3 || item.probabilityL3 === 0 ) > -1 ) editObj.probabilityL3 = 0
    if ( prizeList.findIndex( item => item.probabilityL4 || item.probabilityL4 === 0 ) > -1 ) editObj.probabilityL4 = 0
    let newPrizeList = [];
    newPrizeList = [...prizeList, editObj]
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [configPrizeKey]: [...newPrizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( {
      saveObj: {},
      time: new Date()
    }, () => {
      onChangeVisible( false )
    } )
  }

  // 编辑
  onEdit = () => {
    if ( !this.onPrizeModalVerification() ) return
    const { saveObj } = this.state
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible, editPositionKey, configPrizeKey } = this.props;
    // 整理数据
    const prizeList = [...eleObj[configPrizeKey]]
    const index = eleObj[configPrizeKey].findIndex( item => item.prizeVirtualId === editPositionKey )
    prizeList.splice( index, 1, saveObj )

    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [configPrizeKey]: [...prizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( {
      saveObj: {},
      time: new Date()
    }, () => {
      onChangeVisible( false )
    } )
  }

  // 校验弹窗必填项
  onPrizeModalVerification = () => {
    let past = true;
    const { saveObj, optionPrizeType } = this.state;
    keyVerification.forEach( item => {
      if ( optionPrizeType === 'PRIZE' ) {
        if ( !saveObj[item] && item !== 'inventory' ) {
          past = false
        }
        // // 过期类型为失效日期时判断
        // if ( item === 'expireType' && saveObj[item] === 'TIME' && !saveObj.expireTime ) {
        //   past = false
        // }
        // // 过期类型为失效天数时限制
        // if ( item === 'expireType' && saveObj[item] === 'DAYS' && ( saveObj.expireDays <= 0 || !saveObj.expireDays ) ) past = false
        // 判断奖品库存
        if ( item === 'inventory' && saveObj[item] === undefined || saveObj[item] === null || saveObj[item] === '' ) past = false
      } else if ( !saveObj[item] && item === 'image' ) {
        past = false
      }
    } )
    if ( !past ) {
      message.error( '还有未填的必填项！' );
    }
    return past;
  }

  // 弹框关闭操作
  onPrizeModalCancel = () => {
    const { onChangeVisible } = this.props
    onChangeVisible( false )
  }

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType ) => {
    if ( !relationPrizeType ) {
      message.error( '请先选择权益类型' )
      return
    }
    if ( e ) {
      setTimeout( () => {
        this.getPrizeList( e, relationPrizeType )
      }, 20 );
    }
  }

  // 选择奖品下拉回调
  onDropdownVisibleChange = ( e, info ) => {
    if ( e ) {
      this.getPrizeList( '', info.relationPrizeType )
    }
  }

  onItemChange = ( e, type ) => { // 塞入奖品项
    const { saveObj } = this.state;
    const { prizeList } = this.props;
    // 对象复制
    const saveObjStr = JSON.stringify( saveObj );
    const newSaveObj = JSON.parse( saveObjStr );
    let param = {};
    let val = e && e.target ? e.target.value : e || '';
    if(type === 'inventory' && !e ) val = 0
    if ( typeof val === 'object' ) {
      val = val.format( 'YYYY-MM-DD' )
    }
    if ( type === 'relationPrizeType' ) {
      this.getPrizeList( '', val );
      delete newSaveObj.relationPrizeId;
      delete newSaveObj.relationPrizeType;
      delete newSaveObj.usrInventory;
    }
    if ( type === 'relationPrizeId' ) {
      if( !newSaveObj.relationPrizeType ){
        message.error( '请选择奖品类型' )
        return
      }
      param = prizeList.find( i=>i.rightId === e ) || {};
    }
    let obj = {};
    if ( param.prizeType ) {
      obj = { ...newSaveObj, [`${type}`]: val, prizeType: param.prizeType || '' }
    } else {
      obj = { ...newSaveObj, [`${type}`]: val }
    }
    this.setState( {
      saveObj: obj,
    } )
  }

  getUnIssuedCnt = () => { // 获取剩余库存
    const { saveObj } = this.state;
    const { prizeList } = this.props;
    const param = prizeList.find( item => item.rightId === saveObj.relationPrizeId );
    return ( param && param.unIssuedCnt ) || 0
  }

  render() {
    const { editList, optionPrizeType, saveObj } = this.state
    const { prizeModalVisible, editPositionKey, prizeTypeList, prizeList } = this.props;
    let SelectOptions = null
    if ( prizeTypeList && prizeTypeList.length > 0 ) {
      SelectOptions = prizeTypeList.map( info => {
        return (
          <Option value={info.rightTypeId}>{info.rightTypeName}</Option>
        )
      } )
    }

    let prizeSelectOptions = null
    if ( prizeList && prizeList.length > 0 ) {
      prizeSelectOptions = prizeList.map( info => {
        return (
          <Option value={info.rightId}>{info.rightName}</Option>
        )
      } )
    }

    // 判断有无奖品id，无奖品id为谢谢参与类型
    const prizeIdList = []
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        prizeIdList.push( info.prizeId )
      } )
    }

    const modalFooter = {
      okText: '保存',
      onOk: this.onPrizeModalConfirm,
      onCancel: this.onPrizeModalCancel,
    };
    return (
      <div>
        <Modal
          maskClosable={false}
          title={`${editPositionKey ? '编辑' : '新增'}奖品`}
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={prizeModalVisible}
          {...modalFooter}
        >
          <div>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>中奖类型</span>}
              {...this.formLayout}
            >
              <Radio.Group
                onChange={( e ) => this.changePrizeType( e )}
                disabled={!!editPositionKey}
                value={optionPrizeType}
              >
                <Radio value='PRIZE'>奖品</Radio>
                <Radio value='THANKS'>谢谢参与</Radio>
              </Radio.Group>
            </FormItem>
            {/* <FormItem
              label={<span className={styles.labelText}><span>*</span>奖项名称</span>}
              {...this.formLayout}
            >
              <Input
                value={saveObj.itemName}
                placeholder="请输入奖项名称"
                onChange={( e ) => this.onItemChange( e, 'itemName' )}
                maxLength={20}
              />
            </FormItem> */}
            {   optionPrizeType === 'THANKS' &&
            <FormItem
              label={<span className={styles.labelText}><span>*</span>奖品名称</span>}
              {...this.formLayout}
            >
              <Input
                value={saveObj.name}
                placeholder="请输入奖品名称"
                onChange={( e ) => this.onItemChange( e, 'name' )}
                maxLength={50}
              />
            </FormItem>
            }
            <FormItem
              label={<span className={styles.labelText}><span>*</span>奖品图</span>}
              {...this.formLayout}
            >
              <div style={{ display: 'flex' }}>
                <UploadModal value={saveObj.image} onChange={( e ) => this.onItemChange( e, 'image' )} />
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
                  <div>格式：jpg/jpeg/png </div>
                  <div>180px*180px</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
            </FormItem>
            {
              optionPrizeType === 'PRIZE' &&
              <div>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>奖品类型</span>}
                  {...this.formLayout}
                >
                  <Select
                    style={{ width: '100%' }}
                    value={saveObj.relationPrizeType}
                    onChange={( e ) => this.onItemChange( e, 'relationPrizeType', true )}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {SelectOptions}
                  </Select>
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>选择奖品</span>}
                  {...this.formLayout}
                >
                  <Select
                    style={{ width: '100%' }}
                    value={saveObj.relationPrizeId}
                    onChange={( e ) => this.onItemChange( e, 'relationPrizeId', )}
                    showSearch
                    onSearch={( e ) => this.onPrizeSearch( e, saveObj.relationPrizeType )}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {prizeSelectOptions}
                  </Select>
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>奖品名称</span>}
                  {...this.formLayout}
                >
                  <Input
                    value={saveObj.name}
                    placeholder="请输入奖品名称"
                    onChange={( e ) => this.onItemChange( e, 'name' )}
                    maxLength={50}
                  />
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>活动库存</span>}
                  {...this.formLayout}
                >
                  <InputNumber
                    value={saveObj.inventory ? saveObj.inventory : 0}
                    placeholder="请输入"
                    min={0}
                    max={this.getUnIssuedCnt()}
                    style={{ width: '50%' }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onChange={( e ) => this.onItemChange( e, 'inventory' )}
                  />
                  <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用库存：{this.getUnIssuedCnt()}</span>
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}>奖品高级配置</span>}
                  {...this.formLayout}
                >
                  <Input
                    value={saveObj.prizeFilter}
                    placeholder="请不要乱输入"
                    onChange={( e ) => this.onItemChange( e, 'prizeFilter' )}
                  />
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>过期类型</span>}
                  {...this.formLayout}
                >
                  <Radio.Group
                    onChange={( e ) => this.onItemChange( e, 'expireType' )}
                    value={saveObj.expireType}
                  >
                    <Radio value='TIME'>失效时间</Radio>
                    <Radio value='DAYS'>有效天数</Radio>
                  </Radio.Group>
                </FormItem>
                {( saveObj.expireType && saveObj.expireType === 'TIME' ) &&
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>失效时间</span>}
                    {...this.formLayout}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder='请选择失效时间'
                      value={saveObj.expireTime ? moment( saveObj.expireTime, 'YYYY-MM-DD' ) : null}
                      onChange={( e ) => this.onItemChange( e, 'expireTime' )}
                      format="YYYY-MM-DD"
                    />
                  </FormItem>
                }
                {saveObj.expireType && saveObj.expireType === 'DAYS' &&
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>有效天数</span>}
                    {...this.formLayout}
                  >
                    <InputNumber
                      value={saveObj.expireDays}
                      placeholder="请输入有效天数"
                      min={0}
                      style={{ width: '100%' }}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                      onChange={( e ) => this.onItemChange( e, 'expireDays' )}
                    />
                  </FormItem>
                }
              </div>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default EditPrizeModal;
