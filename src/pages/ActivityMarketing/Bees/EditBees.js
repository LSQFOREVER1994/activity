/* eslint-disable no-restricted-syntax */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Tooltip, message, Modal, Form, Input } from 'antd';
import serviceObj from '@/services/serviceObj';
import { isContained } from './DataVerification';
import { elementTypes } from './BeesEnumes'
import styles from './bees.less';
import Add from './Edit/Add';
import Base from './Edit/Base';
import Edit from './Edit/Edit';
import EditTags from '../TemplateManage/EditTag'

const iphoneImg = require( '@/assets/iphone.png' );
const addImg = require( '@/assets/add.png' );
const baseImg = require( '@/assets/base.png' );
const gridImg = require( '@/assets/grid.png' );

const FormItem = Form.Item;
@connect( ( { bees } ) => ( {
  loading: bees.loading,
} ) )

class EditBees extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    // 初始化数据
    let domData = {
      elements: [],
      id: '', // 活动ID
      name: '', // 活动名称
      activityType: undefined, // 活动类型
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      endTip: '', // 活动结束提示语
      state: '', // 活动状态
      pauseTip: '', // 活动暂停提示语
      rules: '', // 活动规则
      // buryPointId: '', // 埋点统计
      backgroundImage: '', // 页面背景图
      backgroundColor: '', // 页面背景色
      shareTitle: '', // 分享标题
      shareDescription: '', // 分享描述
      shareLink: '', // 分享链接
      shareImage: '', // 分享图片
      initCount: 0, // 初始化次数
      dailyCount: 0, // 每日免费次数
      withoutEmpty: true, // 0库存奖品概率是否移除
      isLoading: false, // 保存后加载
      isBury: false, // 是否开启埋点
    }

    if ( props.editItem ) {
      domData = props.editItem
    }
    super( props );
    this.state = {
      domType: 'base',
      domData,
      editObj: {}, // 编辑或添加的组件数据type、id
      addTempActivity: '', // 模版活动配置信息
      editTempItem: {}, // 活动模版信息（名称、模板标签）
      editVisible: false // 活动模版弹窗
    }
  }

  componentDidMount() {
    if ( !window.listenerBeforeunload ) window.listenerBeforeunload = this.listener;
    window.addEventListener( 'beforeunload', window.listenerBeforeunload );
    this.getPrizeTypeList()
    const IFRAME = this.domIframe;
    const $this = this;
    IFRAME.onload = () => {
      // iframe加载完成后你需要进行的操作
      $this.onPreview();
    };
    this.props.refs( this )
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.editItem && nextProps.editItem.id ) {
      if ( this.state.domData.id !== nextProps.editItem.id ) {
        this.setState( {
          domData: nextProps.editItem
        } )
      }
    }
    if ( nextProps.editItem && this.state.domData !== nextProps.editItem ) {
      this.setState( {
        domData: nextProps.editItem
      } )
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'beforeunload', window.listenerBeforeunload )
  }

  listener = e => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复' // 浏览器有可能不会提示这个信息，会按照固定信息提示
    return false
  }

  // 获取活动奖品类型列表
  getPrizeTypeList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeTypeList',
      payload: {},
    } );
  }

  // 保存活动（新增或编辑）
  onSaveActivity = ( noClose, isEditTemp ) => {
    const { domData } = this.state
    const isTrue = isContained( domData, [], this.changeDom )
    if ( !isTrue ) return
    // domData.inviteShareLink = `${serviceObj.activityBeesPath}#/beInvited`;
    if ( domData.json ) {
      domData.json = JSON.parse( domData.json )
    }
    let newElement = {};

    newElement = ( domData.elements || [] ).map( ( item = {} ) => {
      // 判断是否自定义组件
      try {
        if ( item.type === "CUSTOM" && typeof ( item.json ) === 'string' ) {
          return { ...item, json: JSON.parse( item.json ) }
        }
      } catch {
        message.error( '自定义组件数据内容格式错误' )
      }
      // 判断是否未识别组件
      const recognizedTypes = elementTypes.map( info => {
        return info.key
      } )
      const unrecognized = recognizedTypes.includes( item.type );
      if ( !unrecognized && typeof ( item.json ) === 'string' ) {
        const jsonData = JSON.parse( item.json );
        // eslint-disable-next-line no-param-reassign
        delete item.json
        return Object.assign( item, jsonData )
      }
      return item
    } )
    domData.elements = newElement
    this.setState( {
      isLoading: true
    } )
    const { editTempStr } = this.props
    if ( isEditTemp ) {
      // 模版编辑
      if ( editTempStr ) {
        this.editTemplate( domData )
      } else {
        this.addTemplate( domData )
      }
      return
    }
    const isAdd = !domData.id
    if ( isAdd ) {
      this.onAddBees( domData, noClose )
    } else {
      this.onEditBees( domData, noClose )
    }
  }

  // 新增保存
  onAddBees = ( data, noClose ) => {
    const { dispatch, closeModal = () => { }, getEditData } = this.props;
    dispatch( {
      type: 'bees/addBees',
      payload: {
        query: data,
        successFun: id => {
          if ( !noClose ) {
            closeModal()
          }
          if ( noClose && id ) {
            getEditData( { id } )
            setTimeout( () => {
              this.changeDom( 'grid' )
            }, 200 );
          }
          this.setState( {
            isLoading: false
          } )
          message.success( '添加成功' )
        },
        failFunc: () => {
          this.setState( {
            isLoading: false
          } )
        }
      },
    } );
  }

  // 编辑保存
  onEditBees = ( data, noClose ) => {
    const { dispatch, closeModal = () => { }, getEditData } = this.props;
    dispatch( {
      type: 'bees/editBees',
      payload: {
        query: data,
        successFun: () => {
          if ( !noClose ) {
            closeModal()
          }
          if ( noClose && data.id ) {
            getEditData( { id: data.id } )
            setTimeout( () => {
              this.changeDom( 'grid' )
            }, 200 );
          }
          this.setState( {
            isLoading: false
          } )
          message.success( '修改成功' )
        },
        failFunc: () => {
          this.setState( {
            isLoading: false
          } )
        }
      },
    } );
  }

  // 新增模版
  addTemplate = ( editItem ) => {
    this.setState( {
      addTempActivity: JSON.stringify( editItem ),
      editVisible: true
    } )
  }


  // 编辑模版
  editTemplate = ( editItem ) => {
    const { editTempStr } = this.props
    const editTempInfo = JSON.parse( editTempStr )
    const newTempInfo = { ...editTempInfo, activityConfig: JSON.stringify( editItem ) }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/editTemplate',
      payload: {
        ...newTempInfo
      },
      callFunc: () => {
        message.success( '修改成功！' );
        this.quit( true )
        this.setState( {
          isLoading: false
        } )
      }
    } )
  }

  onPreview = () => {
    const { domData = {} } = this.state;
    if ( this.domIframe && this.domIframe.contentWindow && this.domIframe.contentWindow.postMessage ) {
      this.domIframe.contentWindow.postMessage( { domData }, '*' );
    }
  }

  changeDom = ( type ) => {
    const { domType } = this.state;
    if ( type === domType ) return;
    this.setState( { domType: type } )
  }

  /**
   * 生成一个用不重复的ID
   */
  genNonDuplicateID = ( randomLength ) => {
    return Number( Math.random().toString().substr( 3, randomLength ) + Date.now() ).toString( 36 )
  }

  editDomType = ( item ) => {
    const { domData } = this.state
    if ( !item ) return
    if ( item && item.virtualId ) {
      // 编辑组件
      this.setState( {
        editObj: item,
        domType: 'edit',
      } )
    } else if ( item && !item.virtualId ) {
      // 新增组件
      // 每次点击生成新的组件对象塞入总数据
      const newEleID = this.genNonDuplicateID()
      const newEleObj = { type: item.type, virtualId: newEleID }
      const newEleList = domData.elements || []
      newEleList.push( newEleObj )
      const newObj = Object.assign( domData, { elements: newEleList } )
      this.setState( { domData: Object.assign( {}, newObj ), editObj: newEleObj, domType: 'edit', }, this.onPreview )
    }

  }

  changeDomData = ( obj = {} ) => {
    this.setState( { domData: Object.assign( {}, obj ) }, this.onPreview )
  }

  getDom = ( type ) => {
    let dom = null;
    const { domData, editObj } = this.state;
    if ( type === 'base' ) {
      dom = <Base domData={domData} changeDomData={this.changeDomData} />
    } else if ( type === 'add' ) {
      dom = (
        <Add
          domData={domData}
          changeDomData={this.changeDomData}
          editDomType={this.editDomType}
          type={type}
        />
      );
    } else if ( type === 'grid' ) {
      dom = (
        <Add
          domData={domData}
          changeDomData={this.changeDomData}
          editDomType={this.editDomType}
          type={type}
        />
      );
    } else if ( type === 'edit' ) {
      dom = (
        <Edit
          domData={domData}
          changeDomData={this.changeDomData}
          editObj={editObj}
        />
      );
    }

    return dom;
  }


  // 退出
  quit = ( isEditTemp ) => {
    const { closeModal = () => { }, history } = this.props;
    closeModal()
    if ( isEditTemp ) {
      sessionStorage.removeItem( 'editTempStr' )
      history.push( `/activityTemplate/template` )
    }
  }

  // 编辑名称
  editTemplateName = ( e ) => {
    const { editTempItem } = this.state
    const newEditItem = { ...editTempItem, name: e.target.value }
    this.setState( {
      editTempItem: newEditItem
    } )
  }

  // 编辑模板标签
  editTemplateTags = ( tags ) => {
    const { editTempItem } = this.state
    const newEditItem = { ...editTempItem, labels: tags }
    this.setState( {
      editTempItem: newEditItem
    } )
  }

  // 关闭编辑弹框
  onCloseEditModal = () => {
    this.setState( {
      addTempActivity: '',
      editTempItem: {},
      editVisible: false,
      isLoading: false
    } )
  }

  // 添加模版
  addToTemplate = () => {
    const { editTempItem, addTempActivity } = this.state;
    const { dispatch } = this.props;
    const { name } = editTempItem
    if ( !name ) {
      message.error( '请输入模版名称' )
      return
    }
    dispatch( {
      type: 'bees/addToTemplate',
      payload: {
        query: {
          ...editTempItem,
          activityConfig: addTempActivity
        },
        successFun: () => {
          this.onCloseEditModal();
          this.quit( true )
          message.success( '添加成功' )
        }
      }
    } )
  }

  removeBeforeunload = () => {
    window.removeEventListener( 'beforeunload', window.listenerBeforeunload )
  }

  // 编辑模版弹框
  renderEditModal = () => {
    const { editVisible, editTempItem } = this.state
    const { name, labels=[] } = editTempItem
    return (
      <Modal
        title="添加至模版"
        visible={editVisible}
        onCancel={this.onCloseEditModal}
        onOk={() => this.addToTemplate()}
      >
        <div>
          <FormItem
            style={{ display: 'flex' }}
            label='模版名称'
            {...this.formLayout}
          >
            <Input type='text' placeholder='请输入名称' onChange={this.editTemplateName} value={name} maxLength={20} />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label='模板标签'
            {...this.formLayout}
          >
            <EditTags tags={labels} changeTags={this.editTemplateTags} />
          </FormItem>
        </div>
      </Modal>
    )
  }

  render() {
    const { domType, isLoading } = this.state;
    const { isEditTemp } = this.props;
    // 展示文案区分
    let tipView = (
      <div className={styles.editBeesTit}>
        <div className={styles.editBeesTitText}>创建/编辑活动</div>
        <div className={styles.editBeesTitInfo}>（未保存活动，请勿退出，否则之前编辑的数据将会丢失！）</div>
      </div>
    )
    let closeTip = '确定退出编辑（未保存活动，请勿退出，否则之前编辑的数据将会丢失）'

    if ( isEditTemp ) {
      tipView = (
        <div className={styles.editBeesTit}>
          <div className={styles.editBeesTitText}>创建/编辑模版</div>
        </div>
      )
      closeTip = '确定退出编辑（未保存模版信息，请勿退出，否则之前编辑的数据将会丢失）'
    }
    return (
      <div className={styles.editBeesBox}>
        {/* 编辑/新建活动 开始 */}
        <div className={styles.editBees}>
          {tipView}

          <div className={styles.editBeesBody}>
            {/* 预览 开始 */}
            <div className={styles.editView}>
              <div className={styles.editView_box}>
                <div className={styles.editViewTit}>效果预览</div>
                <div className={styles.editViewBox}>
                  <img className={styles.iphoneImg} src={iphoneImg} alt="" />
                  <div className={styles.reView}>
                    <div className={styles.reViewBox}>
                      <iframe
                        className={styles.collectIframe}
                        scrolling='auto'
                        title='效果预览'
                        frameBorder={0}
                        // src="http://localhost:8080/#/?preview=true"
                        src={`${serviceObj.activityBeesUrl}?preview=true`}
                        ref={( iframe ) => { this.domIframe = iframe }}
                        id='myframe'
                      />
                    </div>
                  </div>
                  <div className={styles.editViewBtns}>
                    <Tooltip placement="right" title="添加组件">
                      <img className={styles.addImg} src={addImg} alt="" onClick={() => this.changeDom( 'add' )} />
                    </Tooltip>
                    <Tooltip placement="right" title="已选组件">
                      <img className={styles.gridImg} src={gridImg} alt="" onClick={() => this.changeDom( 'grid' )} />
                    </Tooltip>
                    <Tooltip placement="right" title="页面设置">
                      <img className={styles.baseImg} src={baseImg} alt="" onClick={() => this.changeDom( 'base' )} />
                    </Tooltip>
                  </div>
                </div>
                <div className={styles.editViewInfo}>750px * 1334px</div>
              </div>
            </div>
            {/* 预览 结束 */}
            <div className={styles.editModal}>
              {this.getDom( domType )}
            </div>
          </div>

          <div className={styles.editBeesBtns}>
            <Popconfirm placement="top" title={closeTip} onConfirm={() => this.quit( isEditTemp )} okText="是" cancelText="否">
              <Button style={{ marginRight: 10 }} type="danger" onClick={this.removeBeforeunload}>退出</Button>
            </Popconfirm>

            {!isEditTemp && <Button type="primary" loading={isLoading} onClick={() => { this.onSaveActivity( false ) }} style={{ marginRight: 10 }}>保存并退出</Button>}
            <Button type="primary" loading={isLoading} onClick={() => { this.onSaveActivity( true, isEditTemp ) }}>保存</Button>
          </div>
        </div>
        {/* 编辑/新建活动 结束 */}
        {/* 活动模版弹窗 */}
        {this.renderEditModal()}
      </div>
    )
  }

}

export default EditBees;
