/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DatePicker, Radio, Button, Form, Modal, Input, message, Select, Upload, InputNumber, Tabs, Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import { mathematicalCalculation } from '@/utils/utils'
import UploadModal from '@/components/UploadModal/UploadModal';
import { selectOptionConfig, reissueTypes } from './rewardReissueEnumes'
import styles from './rewardReissue.less';

const { add } = mathematicalCalculation;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 正则判断
const limitDecimals = ( value, red ) => {
  // eslint-disable-next-line no-useless-escape
  let reg = /^(\-)*(\d+).*$/;
  if ( red === 'red' ) {
    reg = /^(-)*(\d+)\.(\d\d).*$/;
  }
  if ( typeof value === 'string' ) {
    if ( red === 'red' ) return !Number.isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : '';
    return !Number.isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    if ( red === 'red' ) return !Number.isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : '';
    return !Number.isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};

@connect( ( { rewardReissue, bees } ) => ( {
  bees: rewardReissue.bees,
  prizeTypeList: rewardReissue.prizeTypeList,
  prizeList: rewardReissue.prizeList,
  taskList: rewardReissue.taskList,
  merchantList: rewardReissue.merchantList,
  confirmLoading: rewardReissue.loading,
  drawElementList: bees.drawElementList
} ) )

/**
 * 奖励补发的表单抽离
 */
@Form.create()
class RenderReissueForm extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  validTimeLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };


  constructor( props ) {
    super( props )
    this.state = {
      loading: false,
      image: '', // 奖品图片
      awardMode: 'RIGHT', // 发奖模式
      prizeType: '',
      activeTab: '1',
    }
  }


  // 获取活动下拉列表
  getActivityIdNames = _.throttle( ( name ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'rewardReissue/getActivityIdNames',
      payload: {
        page:{
          pageNum: 1,
          pageSize: 30,
          orderBy: `create_time desc`,
        },
        isEnd: 'ALL',
        name,
      },
    } );
  }, 400 )


  // 新增补发接口调用
  addRewardReissue = ( params ) => {
    const { dispatch, handleModalVisible, getReissueList, confirmLoading } = this.props
    if ( confirmLoading ) return
    if ( !Object.keys( params ).length ) return
    dispatch( {
      type: 'rewardReissue/addToReissue',
      payload: {
        query: params,
        callBackFunc: ( isSuccess ) => {
          if ( isSuccess ) {
            handleModalVisible( 'addOrView', true );
            message.success( '添加成功' );
            getReissueList();
          }
          this.setState( {
            loading: false
          } )
        }
      }
    } )
  }

  handleTabChange = key => {
    this.setState( {
      activeTab: key
    } )
  };

  // 补发表单数据收集处理
  handelReissueSubmit = () => {
    const {
      activityId,
      fileObj,
      taskList,
      resetEmpty,
      isReAdd,
      viewItem,
      form: { validateFields },
    } = this.props;
    const { awardMode, prizeType } = this.state;
    const image = isReAdd ? viewItem?.prize?.image : this.state.image;
    validateFields( ( err, values ) => {
      if ( err || ( !image && values.type === 'PRIZE' && !values.isActivity ) ) {
        message.error( '还有未填写的必填项！' )
      } else {
        this.setState( {
          loading: true
        }, () => {
          // 数据处理
          const params = { ...values, activityId }
          const { task, prizeJson } = params
          const taskItem = taskList && taskList.find( item => item.id === task )
          // 对任务详情，奖品信息进行JSON处理
          params.taskJson = taskItem ? JSON.stringify( taskItem ) : ''
          delete params.task
          if ( awardMode === 'OPEN' ) {
            params.prizeJson = { ...prizeJson, image, prizeType, awardMode }
          } else {
            params.prizeJson = { ...prizeJson, image, awardMode, prizeType: prizeJson?.productType }
          }
          if ( params.prizeJson && params.prizeJson.expireTime ) { // 格式化时间
            params.prizeJson.expireTime = moment( params.prizeJson.expireTime ).format( 'YYYY-MM-DD' )
          }
          let newAccountList = params.accountList || []
          if ( typeof newAccountList === 'string' ) {
            newAccountList = newAccountList.trim().split( /[\n\r]/ )
          } else {
            newAccountList = newAccountList.join( ',' )
          }
          params.accountList = newAccountList
          if ( params.prizeJson ) {
            params.prizeJson = JSON.stringify( params.prizeJson )
          }
          if ( params.mode && !fileObj ) {   // 导入新增时，必须先上传文件
            this.setState( {
              loading: false
            } )
            resetEmpty( 'file' )
            return
          }
          if ( params.mode && fileObj ) {
            // 导入新增时，上传的文件格式校验
            if ( !( fileObj.name.endsWith( "xls" ) || fileObj.name.endsWith( "xlsx" ) ) ) {
              message.error( '请选择xls或xlsx文件' );
              return
            }
            params.file = fileObj;
          }
          params.popupSettingJson = JSON.stringify( params.popupSetting );
          delete params.popupSetting;
          // 确认补发接口调用
          Modal.confirm( {
            title: '确认补发后，将直接对用户发送奖励，无法回退',
            okText: '确认补发',
            cancelType: 'primary',
            cancelText: '取消',
            onOk: () => { this.addRewardReissue( params ) },
            onCancel: () => {
              this.setState( {
                loading: false
              } )
            },
          } );
        } )
      }
    } )
  }

  // 发奖模式change
  handleModeChange = ( e ) => {
    const { form: { setFieldsValue }, resetEmpty } = this.props
    this.setState( {
      awardMode: e.target.value,
    }, () => {
      // 需要置空的数组
      const emptyArr = ['relationPrizeType', 'relationPrizeId', 'productType']
      emptyArr.forEach( key => {
        setFieldsValue( { [`prizeJson.${`[${key}]`}`]: '' } )
      } )
      resetEmpty( 'prize' )
    } )
  }

  // 图片上传存储
  handleImgChange = ( e ) => {
    this.setState( {
      image: e
    } )
  }

  handleOption = ( optionId ) => {
    const { awardMode } = this.state
    const { prizeList } = this.props
    if ( awardMode === 'RIGHT' ) return
    const param = prizeList && prizeList.find( ( item ) => item.rightId === optionId )
    this.setState( {
      prizeType: param.prizeType
    } )
  }

  // 旧模式下拉列表特殊文案
  renderOptionText = ( info ) => {
    const { validMode, validDays, validEndDate } = info;
    let text = ''
    switch ( validMode ) {
      case 'FN':
        text = `领取后${validDays}个自然日有效`
        break;
      case 'FT':
        text = `领取后${validDays}个交易日有效`
        break;
      case 'SP':
        text = `${validEndDate}过期`
        break;
      case 'DR':
        text = '需配置过期时间'
        break;
      default:
        break;
    }
    return text
  }

  // 下拉列表渲染统一管理
  renderSelectOption = ( optionList = [], type ) => {
    if ( !type ) return
    if ( !optionList.length ) return
    const { isAdd, form: { getFieldValue } } = this.props
    const { awardMode } = this.state
    const prizes = getFieldValue( 'prizeJson' )
    const { optionId } = selectOptionConfig[type]
    const { optionValue } = selectOptionConfig[type]
    const copyAwardMode = isAdd ? awardMode : prizes?.awardMode
    const optionView = optionList && optionList.map( ( info => {
      let optionTxt = info[optionValue]
      if ( copyAwardMode === 'RIGHT' && !isAdd && type === 'openPrize' ) {
        optionTxt = `${info[optionValue]}(${this.renderOptionText( info )})`
      }
      return (
        <Option
          value={`${info[optionId] || ''}`}
          key={`${info[optionValue]}_${info[optionId]}`}
        >
          {optionTxt}
        </Option>
      )
    } ) )
    return optionView
  }

  // 渲染奖品相关表单数据
  renderPrizeForm = () => {
    const {
      isAdd,
      isReAdd,
      viewItem,
      prizeList,
      merchantList,
      prizeTypeList,
      activityPrizes,
      elementPrizesList,
      merchantVisibleList,
      handlePrizeTypeSelect,
      handleComponentChange,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
    } = this.props;
    const { awardMode, image } = this.state
    const prizes = isAdd ? getFieldValue( 'prizeJson' ) : viewItem?.prize;
    const copyAwardMode = isAdd ? awardMode : prizes?.awardMode

    const wordsToType = {
      COUPON: '虚拟卡券',
      GOODS: '实物',
      TG_COUPON: '投顾卡券',
      JN_RED:'绩牛红包',
      JN_RIGHT:'绩牛权益',
      // RED: '现金红包',
      // PHONE: '直充',
      // WX_COUPON: '微信立减金',
      // WX_VOUCHER: '微信代金券',
      // RIGHT_PACKAGE: '权益包',
      CUSTOM: '自定义商品',
    }
    // 旧模式奖品类型下拉
    const prizeTypeView = this.renderSelectOption( prizeTypeList, 'openPrizeType' )
    // 旧模式奖品下拉
    const openPrizeView = this.renderSelectOption( prizeList, 'openPrize' )
    // 新模式商户列表下拉
    const merchantSelectOption = this.renderSelectOption( merchantList, 'rightMerchant' )
    // 新模式商品列表下拉
    const goodsSelctOption = this.renderSelectOption( merchantVisibleList, 'rightPrize' )
    // 奖品类型下拉列表
    const newProductTypeOption = Object.keys( wordsToType ).map( key => {
      return (
        <Option value={`${key}`}>{wordsToType[key]}</Option>
      )
    } )

    // 新旧模式奖品下拉列表
    const finalPrizeOption = copyAwardMode === 'RIGHT' ? goodsSelctOption : openPrizeView
    // 新旧模式商户/奖品类型下拉列表
    const finalPrizeTypeOption = copyAwardMode === 'RIGHT' ? merchantSelectOption : prizeTypeView

    return (
      <div>
        <FormItem
          label="奖品归属"
          {...this.formLayout}
        >{
            getFieldDecorator( 'isActivity', {
              initialValue: ( isAdd || isReAdd ) ? true : viewItem.isActivity,
              rules: [{ required: true, message: '请选择奖品归属' }],
            } )(
              <Radio.Group
                disabled={!isReAdd && !isAdd}
              >
                <Radio value={true}>活动内奖品</Radio>
                <Radio value={false}>活动外奖品</Radio>
              </Radio.Group>
            )
          }
        </FormItem>
        {
          getFieldValue( "isActivity" ) ?
            <>
              <FormItem
                label="选择组件"
                {...this.formLayout}
              >
                {getFieldDecorator( 'elementId', {
                  initialValue: viewItem.elementId,
                  rules: [{ required: true, message: '请选择组件' }],
                } )(
                  <Select
                    onChange={( e ) => { setFieldsValue( { prizeId: '' } ); handleComponentChange( e ) }}
                    disabled={!isReAdd && !isAdd}
                    showSearch
                    optionFilterProp="children"
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                  >
                    {
                      activityPrizes.map( ele => {
                        return (
                          <Option
                            key={ele.elementId}
                            value={ele.elementId}
                          >
                            {ele.elementName}
                            ({ele.elementId})
                          </Option>
                        )
                      } )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="选择奖品"
                {...this.formLayout}
              >
                {getFieldDecorator( 'prizeId', {
                  initialValue: viewItem.prizeId,
                  rules: [{ required: true, message: '请选择奖品' }],
                } )(
                  <Select
                    disabled={!isReAdd && !isAdd}
                    showSearch
                    optionFilterProp="children"
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                  >
                    {
                      elementPrizesList?.map( p => {
                        return (
                          <Option
                            key={p.id}
                            value={p.id}
                          >
                            {p.name}
                          </Option>
                        )
                      } )
                    }
                  </Select>
                )}
              </FormItem>
            </>
            :
            <>
              <FormItem
                label={<span className={styles.labelText}><span>*</span>奖品图</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal
                    value={isAdd ? image : prizes?.image}
                    disabled={!isReAdd && !isAdd}
                    onChange={( e ) => this.handleImgChange( e )}
                  />
                  <div className={styles.img_tip}>
                    <div>格式：jpg/jpeg/png </div>
                    <div>180px*180px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>发奖模式
                  </span>
                }
                hidden
                {...this.formLayout}
              >
                <Radio.Group disabled={!isReAdd && !isAdd} value={isAdd ? awardMode : copyAwardMode} onChange={( e ) => this.handleModeChange( e )}>
                  <Radio value="RIGHT">新模式</Radio>
                  <Radio value="OPEN">旧模式</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>{copyAwardMode === 'RIGHT' ? '选择商户' : '奖品类型'}</span>}
                {...this.formLayout}
              >{getFieldDecorator( `prizeJson.${`[${'relationPrizeType'}]`}`, {
                rules: [
                  {
                    required: true,
                    message: copyAwardMode === 'RIGHT' ? '请选择商户' : '请选择奖品类型',
                  },
                ],
                initialValue: isAdd ? '' : prizes?.relationPrizeType
              } )(
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  onSelect={( val ) => { handlePrizeTypeSelect( val, prizes?.productType, copyAwardMode ) }}
                  placeholder={copyAwardMode === 'RIGHT' ? '请选择商户' : '请选择奖品类型'}
                  showSearch
                  filterOption={( input, option ) =>
                    option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                  style={{ width: 315 }}
                  disabled={!isReAdd && !isAdd}
                >
                  {finalPrizeTypeOption}
                </Select>
              )}
              </FormItem>
              {
                copyAwardMode === 'RIGHT' &&
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      商品类型
                    </span>
                  }
                  {...this.formLayout}
                >
                  {getFieldDecorator( `prizeJson.${`[${'productType'}]`}`, {
                    rules: [
                      {
                        required: true,
                        message: '请选择奖品',
                      },
                    ],
                    initialValue: isAdd ? '' : prizes?.productType
                  } )(
                    <Select
                      style={{ width: '100%' }}
                      onSelect={( val ) => handlePrizeTypeSelect( prizes?.relationPrizeType, val, copyAwardMode )}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      disabled={!isReAdd && !isAdd}
                    >
                      {newProductTypeOption}
                    </Select>
                  )}
                </FormItem>
              }
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>选择奖品</span>}
                {...this.formLayout}
              >{getFieldDecorator( `prizeJson.${`[${'relationPrizeId'}]`}`, {
                rules: [
                  {
                    required: true,
                    message: '请选择奖品',
                  },
                ],
                initialValue: isAdd ? '' : prizes?.relationPrizeId
              } )(
                <Select
                  disabled={!isReAdd && !isAdd}
                  showSearch
                  triggerNode
                  style={{ width: 315 }}
                  onSelect={( e ) => this.handleOption( e )}
                  placeholder='请选择奖品'
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  filterOption={( input, option ) =>
                    option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                >
                  {finalPrizeOption}
                </Select>
              )}
              </FormItem>
              {
                prizes?.productType === 'WX_COUPON' &&
                <FormItem
                  style={{ display: 'flex' }}
                  label={<span className={styles.labelText}>满减设置</span>}
                  {...this.formLayout}
                >
                  <div className={styles.money_minus}>
                    <span style={{ marginRight: 10 }}>满</span>
                    {getFieldDecorator( `prizeJson.${`[${'minimum'}]`}`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择奖品',
                        },
                      ],
                      initialValue: isAdd ? '' : prizes?.minimum
                    } )(
                      <InputNumber
                        disabled={!isReAdd && !isAdd}
                        placeholder="请输入满减金额"
                        min={getFieldValue( 'prizeJson.[price]' ) ? add( getFieldValue( 'prizeJson.[price]' ), 0.01 ) : 1.01}
                        style={{ width: '30%', marginRight: 16 }}
                        formatter={value => limitDecimals( value, 'red' )}
                        parser={value => limitDecimals( value, 'red' )}
                      />
                    )}
                    <span style={{ marginRight: 10 }}>减</span>
                    {getFieldDecorator( `prizeJson.${`[${'price'}]`}`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入减免金额',
                        },
                      ],
                      initialValue: isAdd ? '' : prizes?.price
                    } )(
                      <InputNumber
                        disabled={!isReAdd && !isAdd}
                        placeholder="请输入减免金额"
                        min={1}
                        max={500}
                        style={{ width: '30%' }}
                        formatter={value => limitDecimals( value, 'red' )}
                        parser={value => limitDecimals( value, 'red' )}
                      />
                    )}
                  </div>
                </FormItem>
              }
              {
                prizes?.productType === 'RED' &&
                <>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}>红包金额</span>}
                    {...this.formLayout}
                  >{getFieldDecorator( `prizeJson.${`[${'price'}]`}`, {
                    rules: [
                      {
                        required: true,
                        message: '请输入红包金额',
                      },
                    ],
                    initialValue: isAdd ? '' : prizes?.price
                  } )(
                    <InputNumber
                      placeholder="请输入红包金额"
                      disabled={!isReAdd && !isAdd}
                      min={0.1}
                      style={{ width: '75%' }}
                      formatter={value => limitDecimals( value, 'red' )}
                      parser={value => limitDecimals( value, 'red' )}
                    />
                  )}
                    <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
                  </FormItem>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}>红包描述</span>}
                    {...this.formLayout}
                  >{getFieldDecorator( `prizeJson.${`[${'description'}]`}`, {
                    rules: [
                      {
                        required: true,
                        message: '请输入红包描述',
                      },
                    ],
                    initialValue: isAdd ? '' : prizes?.description
                  } )(
                    <Input
                      disabled={!isReAdd && !isAdd}
                      style={{ width: '75%' }}
                      placeholder="请输入红包描述"
                    />
                  )}
                  </FormItem>
                </>
              }
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>奖品名称</span>}
                {...this.formLayout}
              >{getFieldDecorator( `prizeJson.${`[${'name'}]`}`, {
                rules: [
                  {
                    required: true,
                    message: '请输入奖品名称',
                  },
                ],
                initialValue: isAdd ? '' : prizes?.name
              } )(
                <Input
                  placeholder="请输入奖品名称"
                  maxLength={50}
                  disabled={!isReAdd && !isAdd}
                />
              )}
              </FormItem>
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>过期类型</span>}
                {...this.formLayout}
              >{getFieldDecorator( `prizeJson.${`[${'expireType'}]`}`, {
                rules: [
                  {
                    required: true,
                    message: '请选择过期类型',
                  },
                ],
                initialValue: isAdd ? 'TIME' : prizes?.expireType

              } )(
                <Radio.Group disabled={!isReAdd && !isAdd}>
                  <Radio value="TIME">失效时间</Radio>
                  <Radio value="DAYS">有效天数</Radio>
                </Radio.Group>
              )}
              </FormItem>
              {getFieldValue( 'prizeJson' ).expireType === 'TIME' &&
                <FormItem
                  style={{ display: 'flex' }}
                  label={<span className={styles.labelText}>失效时间</span>}
                  {...this.formLayout}
                >{getFieldDecorator( `prizeJson.${`[${'expireTime'}]`}`, {
                  rules: [
                    {
                      required: true,
                      message: '请选择失效时间',
                    },
                  ],
                  initialValue: prizes && moment( prizes.expireTime ) || moment()
                } )(
                  <DatePicker
                    disabled={!isReAdd && !isAdd}
                    style={{ width: '100%' }}
                    placeholder='请选择失效时间'
                    format="YYYY-MM-DD"
                  />
                )}
                </FormItem>}
              {getFieldValue( 'prizeJson' ).expireType === 'DAYS' &&
                <div style={{ display: 'flex', marginLeft: 25 }}>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span>有效天数</span>}
                    {...this.validTimeLayout}
                  >{getFieldDecorator( `prizeJson.${`[${'expireDays'}]`}`, {
                    rules: [
                      {
                        required: true,
                        message: '请输入有效天数',
                      },
                    ],
                    initialValue: isAdd ? '' : prizes?.expireDays
                  } )(
                    <InputNumber
                      placeholder="请输入有效天数"
                      min={0}
                      disabled={!isReAdd && !isAdd}
                      style={{ width: '200px' }}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                    />
                  )}
                  </FormItem>
                </div>}
            </>
        }
      </div>
    )
  }

  // 渲染新增补发或者/查看补发弹窗
  renderRewardReissueAddOrView = () => {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      fileObj,
      taskList,
      isAdd,
      isReAdd,
      addOrViewVisible,
      viewItem,
      downLoadReissueRecord,
      beforeUpload,
      handleDownModal,
      handleAddOrView,
      handleModalVisible,
      drawElementList,
      resetEmpty
    } = this.props;
    const { loading, activeTab } = this.state
    // 任务下拉列表
    const taskView = this.renderSelectOption( taskList, 'task' )
    // 补发类型
    const reissueTypeView = reissueTypes.map( item => <Option value={`${item.key}`} key={item.key}>{item.value || ''}</Option> )

    // 上传或者下载文件
    const uploadOrDownLoad = ( isAdd || isReAdd ) ? (
      <>
        <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', position: 'relative' }}>
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileObj ? [fileObj] : []}
            onRemove={() => { resetEmpty( 'file' ) }}
            accept='.xlsx,.xls'
          >
            <Button>+上传</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleDownModal}
            style={{ position: 'absolute', left: '90px', top: '5px' }}
          >
            模板下载
          </Button>
        </div>
        <span style={{ color: 'red', display: fileObj ? 'none' : 'block' }}>请选择上传的文件
        </span>
      </>
    ) : (
      <>
        <div style={{ display: viewItem?.mode ? 'block' : 'none' }}>
          <Button onClick={downLoadReissueRecord}>导出文件</Button>
        </div>
      </>
    )

    // 补发具体类型 Enums:TASK,PRIZE,COUNT,INTEGRAL
    const reissueTypeWord = ( isAdd || isReAdd ) ? getFieldValue( 'type' ) : viewItem?.type

    const validateQuantity = ( rule, value, callback ) => {
      if ( !value ) {
        callback( '请输入补发次数/积分' );
        return;
      }
      if ( !/^\d+$/.test( value ) ) {
        callback( '请输入正整数' );
        return;
      }
      if ( parseInt( value, 10 ) > 999999 ) {
        callback( '补发次数/积分最大值为999999' );
        return;
      }
      callback();
    };


    // 补发类型对应表单
    const reissueTypeToFormView =
      <>
        {reissueTypeWord === 'PRIZE' ? this.renderPrizeForm() :
          reissueTypeWord !== 'TASK' && (
            <>
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>补发次数/积分</span>}
                {...this.formLayout}
              >{getFieldDecorator( 'quantity', {
                  rules: [
                    {
                      required: true,
                      message: '请输入补发次数/积分',
                    },
                    { validator: validateQuantity }

                    // {
                    //   required: true,
                    //   validator: ( rule, value, callback ) => {
                    //     const newReg = new RegExp( /^-?\d+$/, "g" )
                    //     if ( newReg.test( value ) && parseInt( value ) > 999999 ) {
                    //       callback( '补发次数/积分最大值为999999' );
                    //       return;
                    //     }
                    //     callback();
                    //   },
                    //   message: '补发次数/积分最大值为999999',
                    //   trigger: 'change',
                    // },
                  ],
                  initialValue: isAdd ? '' : viewItem?.quantity
                } )(
                  <Input
                    disabled={!isReAdd && !isAdd}
                    placeholder='请输入补发次数/积分'
                    type="number"
                  />
                )}
              </FormItem>
              {
                reissueTypeWord === 'COUNT' && (
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}>关联组件</span>}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'elementId', {
                      initialValue: isAdd ? '' : viewItem?.elementId
                    } )(
                      <Select
                        disabled={!isReAdd && !isAdd}
                        placeholder="发放至组件，不填则为通用次数"
                      >
                        {!loading && drawElementList.map( el => (
                          <Option key={el.id}>{`${el.name || el.label} (${el.id})`}</Option> )
                        )}
                      </Select>
                    )}
                  </FormItem>
                )
              }
            </>
          )
        }
      </>

    const onOkFunc = () => {
      if ( activeTab !== '3' ) {
        this.handleTabChange( String( Number( activeTab ) + 1 ) )
      }
      if ( activeTab === '3' ) {
        if ( isReAdd || isAdd ) {
          this.handelReissueSubmit()
        }
        else if ( !isAdd ) {
          handleModalVisible( 'addOrView' )
        }
      }
    }

    return (
      <Modal
        title={isAdd ? "新增" : isReAdd ? '再次补发' : '查看'}
        visible={addOrViewVisible}
        okText={isAdd ? ( activeTab === '3' ? '补发' : '下一步' ) : ( activeTab === '3' ? '确定' : '下一步' )}
        maskClosable={false}
        onOk={() => onOkFunc()}
        onCancel={() => {
          if ( !isAdd ) handleAddOrView()
          handleModalVisible( 'addOrView', true )
        }}
        confirmLoading={loading}
        centered
        destroyOnClose
      >
        <Form onSubmit={this.handelReissueSubmit}>
          <Tabs
            defaultActiveKey='1'
            activeKey={activeTab}
            onChange={this.handleTabChange}
          >
            <TabPane tab="奖励配置" key="1">
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>补发类型</span>}
                {...this.formLayout}
              >{getFieldDecorator( 'type', {
                rules: [
                  {
                    required: true,
                    message: '请选择补发类型',
                  },
                ],
                initialValue: isAdd ? '' : viewItem?.type
              } )(
                <Select
                  disabled={!isReAdd && !isAdd}
                  onSelect={() => {
                    if ( isAdd ) {
                      setFieldsValue( { 'elementId': null } )
                      this.setState( {
                        image: ''
                      } )
                    }
                  }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择补发类型'
                  style={{ width: 315 }}
                >
                  {reissueTypeView}
                </Select>
              )}
              </FormItem>
              {
                ( reissueTypeWord === 'TASK' ) &&
                <>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}>补发任务</span>}
                    {...this.formLayout}
                  >{getFieldDecorator( 'task', {
                    rules: [
                      {
                        required: getFieldValue( 'type' ) === 'TASK',
                        message: '请选择补发任务'
                      }
                    ],
                    initialValue: isAdd ? '' : viewItem?.task?.id
                  } )(
                    <Select
                      disabled={!isReAdd && !isAdd}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placeholder='请选择补发任务'
                      style={{ width: 315 }}
                    >
                      {taskView}
                    </Select>
                  )}
                  </FormItem>
                </>
              }
              {reissueTypeToFormView}
            </TabPane>
            <TabPane tab="补发名单" key="2">
              <FormItem
                required
                style={{ display: 'flex' }}
                label="用户不存在时创建新用户"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 12 }}
                hidden
              >{getFieldDecorator( 'isCreateUser', {
                initialValue: isAdd ? false : viewItem?.isCreateUser
              } )(
                <Radio.Group
                  disabled={!isReAdd && !isAdd}
                >
                  <Radio value={false}>不创建</Radio>
                  <Radio value={true}>创建</Radio>
                </Radio.Group>
              )}
              </FormItem>
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}><span>*</span>设置方式</span>}
                {...this.formLayout}
              >{getFieldDecorator( 'mode', {
                initialValue: isAdd ? false : viewItem?.mode
              } )(
                <Select
                  disabled={!isReAdd && !isAdd}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择输入方式'
                  onChange={this.editMode}
                  style={{ width: 315 }}
                >
                  <Option value={false}>录入</Option>
                  <Option value={true}>导入</Option>
                </Select>
              )}
              </FormItem>
              {!getFieldValue( 'mode' ) ?
                <div>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}>补发名单</span>}
                    {...this.formLayout}
                  >{getFieldDecorator( 'accountList', {
                    rules: [
                      {
                        required: true,
                        message: '请输入补发名单',
                      },
                    ],
                    initialValue: isAdd ? '' : viewItem?.accountList
                  } )(
                    <TextArea
                      disabled={!isReAdd && !isAdd}
                      placeholder='请输入补发名单'
                      style={{ width: 315, height: 265 }}
                    />
                  )}
                    <span>补发名单可用换行隔开</span>
                  </FormItem>
                </div> :
                <div>
                  <FormItem
                    style={{ display: 'flex' }}
                    label={<span className={styles.labelText}><span>*</span>补发名单</span>}
                    {...this.formLayout}
                  >
                    {uploadOrDownLoad}
                  </FormItem>
                </div>
              }
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>补发原因</span>}
                {...this.formLayout}
              >{getFieldDecorator( 'reason', {
                rules: [
                  {
                    required: true,
                    message: '请输入补发原因',
                  },
                ],
                initialValue: isAdd ? '' : viewItem?.reason
              } )(
                <Input.TextArea
                  maxLength={80}
                  disabled={!isReAdd && !isAdd}
                  placeholder='请输入补发原因'
                  style={{ width: 315, height: 200 }}
                />
              )}
              </FormItem>
            </TabPane>
            <TabPane tab="弹窗配置" key="3">
              <FormItem
                style={{ display: 'flex' }}
                label={<span className={styles.labelText}>补发弹窗</span>}
                {...this.formLayout}
              >{getFieldDecorator( 'popupSetting.enable', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否开启补发弹窗'
                  },
                ],
                valuePropName: 'checked',
                initialValue: isAdd ? false : viewItem?.popupSetting?.enable
              } )(
                <Switch
                  disabled={!isReAdd && !isAdd}
                />
              )}
              </FormItem>
              {
                getFieldValue( 'popupSetting.enable' ) && (
                  <>
                    <FormItem
                      style={{ display: 'flex' }}
                      label={<span className={styles.labelText}>弹窗标题</span>}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'popupSetting.title', {
                        rules: [
                          {
                            required: false,
                          },
                        ],
                        initialValue: isAdd ? '恭喜您!' : viewItem?.popupSetting?.title
                      } )(
                        <Input
                          disabled={!isReAdd && !isAdd}
                          placeholder='请输入补发标题'
                          maxLength={20}
                        />
                      )}
                    </FormItem>
                    <FormItem
                      style={{ display: 'flex' }}
                      label={<span className={styles.labelText}>弹窗摘要</span>}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'popupSetting.message', {
                        rules: [
                          {
                            required: false,
                          },
                        ],
                        initialValue: isAdd ? '获得了奖励' : viewItem?.popupSetting?.message
                      } )(
                        <Input.TextArea
                          disabled={!isReAdd && !isAdd}
                          placeholder='请输入补发摘要'
                          style={{ width: 315, height: 50 }}
                        />
                      )}
                    </FormItem>
                    <FormItem
                      style={{ display: 'flex' }}
                      label={<span className={styles.labelText}>弹窗按钮文案</span>}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'popupSetting.btnText', {
                        rules: [
                          {
                            required: false,
                          },
                        ],
                        initialValue: isAdd ? '确定' : viewItem?.popupSetting?.btnText
                      } )(
                        <Input
                          disabled={!isReAdd && !isAdd}
                          placeholder='请输入弹窗按钮文案'
                          maxLength={20}
                        />
                      )}
                    </FormItem>
                  </>
                )
              }

            </TabPane>
          </Tabs>
        </Form>



      </Modal>
    )
  }

  render() {
    return this.renderRewardReissueAddOrView()
  }
}

export default RenderReissueForm;
