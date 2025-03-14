/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, message, Popconfirm, Form, Modal, Input, Select, DatePicker, Radio, Empty, Col, Row, Typography } from 'antd';
import moment from 'moment';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getUrlParameter, exportFunc } from '@/utils/utils';
import FilterForm from './FilterForm';
import ModalLogin from '@/components/ModalLogin/ModalLogin';
import EditBeesV3 from '../BeesV3/AddOrEditBees';
import ThirdDataCenter from '../ThirdDataCenter/ThirdDataCenter';
import ListStyles from './ListStyles';
import CardStyle from './CardStyles';
import EditTags from '../TemplateManage/EditTag'
import { clearCopyContent } from '../BeesV3/AddOrEditBees/BodyContent/DragEdit/DragComponentsList/ShortcutKeys/index'
import styles from './bees.less';


const pass = require( '@/assets/PASS.png' )
const unSubmit = require( '@/assets/UNSUBMIT.png' )
const pending = require( '@/assets/pendingIcon.png' )
const noPass = require( '@/assets/NOPASS.png' )
const disable = require( '@/assets/DISABLED.png' )


const activityStatusList = [
  {
    key:'PASS',
    name:'通过',
    val:'pass',
    img: pass,
  },
  {
    key:'UNSUBMIT',
    name:'草稿',
    val:'unSubmit',
    img: unSubmit,
  },
  {
    key:'PENDING',
    name:'审核中',
    val:'pending',
    img: pending,
  },
  {
    key:'NOPASS',
    name:'审核驳回',
    val:'noPass',
    img: noPass
  },
  {
    key:'DISABLED',
    name:'禁用',
    val:'disable',
    img: disable
  },
];

const activityStatusMap = {
  PASS: '通过',
  UNSUBMIT: '草稿',
  PENDING: '审核中',
  NOPASS: '审核驳回',
  DISABLED: '禁用',
}


const FormItem = Form.Item;
const { Option } = Select
const { Paragraph } = Typography;

@connect( ( { bees } ) => ( {
  activeStatisticsData: bees.activeStatisticsData,
  roleGroupList: bees.roleGroupList,
  collaboratorList: bees.collaboratorList,
  loginModalVisible: bees.loginModalVisible,
  loading: bees.loading
} ) )


class Bees extends PureComponent {
  // 初始化数据
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  featureFormLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  state = {
    editBeesV3: false,
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    editItem: null,
    editVisible: false,
    editTempItem: {},
    qrCodeVisible: false,
    chooseActive: {},
    reatureVisible: false, // 设置未来版本弹框
    cooperateVisible: false, // 协作管理弹窗控制
    addCooperaterVisible: false, // 添加协作人弹窗控制
    autoUpdateTime: '',
    updatePeriods: false,
    hasFeature: false, // 有无未来版本
    editActivityId: '', // 未来版本编辑时的活动id
    editCooperateId: '', // 编辑协作管理的活动id
    isEditTemplate: '',
    editTempStr: '',
    isExPLoading: false,
    listStyles: 'card',
    activityStatesType: 'PASS',
    dataCenterVisible: false,
    dataCenterId: null,
    selectUsers: [], // 选取的协作人数组
    selectRole: 'MANAGER', // 协作人权限,
    isClick: false, // 防抖标识
    roles: [],
    canSave: false, // 是否可保存
    isPass:false,
    isHasDraft:false,
    passDraftInfo:{},
    formProps:{}
  };


  componentDidMount() {
    const tempId = sessionStorage.getItem( 'tempId' )  // 模版id
    const isEditTemp = sessionStorage.getItem( 'isEditTemp' ) // 是否新增或编辑模版
    const auditId =sessionStorage.getItem( 'auditId' ) // 审核查看活动配置活动Id
    // 链接参数监听
    const fromPage = getUrlParameter( 'fromPage' ) // 链接获取的跳转模块
    const pageActivityId = getUrlParameter( 'id' ) // 链接跳转的活动id
    const validateArr = ['buryPoint', 'prizeReward']
    if ( pageActivityId && fromPage && validateArr.includes( fromPage ) ) {
      this.jumpDataCenter( '', { id: pageActivityId } )
    }

    this.getActiveStatistics();
    if ( tempId ) {
      this.setState( {
        isEditTemplate: false,
      }, () => {
        this.userTemplate( tempId )
      } )
    } else if ( isEditTemp ) {
      this.setState( {
        isEditTemplate: isEditTemp
      }, () => {
        this.editTemplate()
        sessionStorage.removeItem( 'isEditTemp' )
      } )
    }
    if( auditId ){
      this.getCurrentCollaborsInfo( auditId, 'edit', () => this.onEditBees( { id: auditId } ) )
    }
    window.onShowLoginModal = this.onShowLoginModal;

  }
  ;
  componentWillUnmount() {
    delete window.onShowLoginModal;
  }




  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    console.log( 'data', data )
    this.setState( {
      pageNum: 1
    }, () => {
      this.getBees();
    } )
  }

  // 获取活动状态
  getActiveStatistics = () => {
    const { roles } = this.state
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getActiveStatistics',
      payload: { list: roles }
    } )
  }

  // 获取活动列表
  getBees = () => {
    const { pageNum, pageSize, sortedInfo = {}, roles, activityStatesType } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { name, id, } = formValue;
    if ( name && ( name.length > 60 ) ) {
      message.error( '最多允许输入60个字符' );
      return;
    }
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getBees',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        name,
        id,
        state:activityStatesType,
        roles,
      },
    } );
  }

  // 获取当前活动协作者信息
  getCurrentCollaborsInfo = ( id, type, cb ) => {
    const { dispatch } = this.props;
    // 用户权限对应操作键值对
    const userOption = {
      // CREATOR，MANAGER拥有活动的所有操作权限,这边不限制
      EDITOR: ['delete', 'cooperate'], // 不可删除活动，不可打开协作管理面板
      VIEWER: ['delete', 'edit', 'cooperate'] // 不可删除活动，不可打开协作管理面板,不可编辑
    }
    // 判断是否是协作管理员
    const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
    let roleTag = false
    if ( authorityList.includes( 'COLLABORATOR_ADMIN' ) ) {
      roleTag = true
    }
    if ( !id ) return
    dispatch( {
      type: 'bees/getCurrentCollaborsInfo',
      payload: {
        activityId: id
      },
      successFun: ( res ) => {
        if ( roleTag && cb ) cb()
        else if ( res && res.role ) {
          const { role } = res
          if ( userOption[role] && userOption[role].includes( type ) ) {
            message.error( '您没有权限，请向创建者申请' )
          }
          if ( !userOption[role] || !userOption[role].includes( type ) ) {
            if ( cb ) cb()
          }
        }
      }
    } );
  }

  // 获取对应权限的角色列表
  getRoleGroupList = ( id, type, cb ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getRoleGroupList',
      payload: {
        roleCode: 'ACTIVITY_LIST_GET'
      },
      callBackFunc: ( res ) => {
        if ( res ) {
          this.getCurrentCollaborsInfo( id, type, cb )
        }
      }
    } );
  }

  // 获取活动协作者列表
  getCollaborators = () => {
    const { dispatch } = this.props;
    const { editCooperateId } = this.state
    if ( !editCooperateId ) return
    dispatch( {
      type: 'bees/getCollaborators',
      payload: {
        activityId: editCooperateId
      },
      successFun: () => { }
    } );
  }

  // 获取单个活动模版的信息
  onGetBeesInfo = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getBees',
      payload: {
        query: {
          id
        },
        successFun: () => {
          this.getBees();
        }
      }
    } );
  }

  clickBtn = () => {
    message.error( '该功能未完善！' );
  }

  closeModal = ( type ) => {
    clearCopyContent()
    this.setState( {
      [type]: false, editItem: null
    }, () => {
      this.getActiveStatistics();
      this.getBees()
    } )
  }

  // 编辑
  onEditBees = ( { id, item } ) => {
    const activityId = id || item.id
    const { activityStatesType, isPass } = this.state
    const { dispatch } = this.props;
    const auditId = sessionStorage.getItem( 'auditId' )
    let dispatchType = 'beesVersionThree/getBeesInfo';
    if( isPass ) dispatchType = 'beesVersionThree/getPassBeesInfo'
    dispatch( {
      type: dispatchType,
      payload: {
        query: {
          id: activityId
        },
        successFun: ( res ) => {
          if ( res ) {
            // 延迟唤起弹窗
            const editItem = this.serV3ActiveData( res );
            const showKey = 'editBeesV3';
            let canSave = activityStatesType  !== 'PENDING';
            if( auditId ) canSave = false
            this.setState( {
              editItem
            },
              () => {
                this.setState( { [showKey]: true, canSave, isPass:false } )
                sessionStorage.removeItem( 'auditId' )
              } )
          }
        }
      }
    } );
  }

  // 处理V3数据
  serV3ActiveData = ( res ) => {
    const { pages } = res;
    const filterPages = pages.map( item => {
      const { componentData, style } = item
      if ( typeof style === 'string' ) {
        item.style = JSON.parse( style );
      }
      componentData.forEach( comItem => {
        if ( typeof comItem.animations === 'string' ) {
          comItem.animations = JSON.parse( comItem.animations );
        }
        if ( typeof comItem.style === 'string' ) {
          comItem.style = JSON.parse( comItem.style );
        }
        if ( comItem?.events?.length ) {
          comItem.events.forEach( eventItem => {
            if ( typeof eventItem.params === 'string' ) {
              eventItem.params = JSON.parse( eventItem.params );
            }
          } );
        }
        // 处理组合数据
        if ( comItem.type === 'GROUP' ) {
          const { componentIds } = comItem.propValue
          comItem.propValue.componentData = componentData.filter( groupItem => {
            if ( componentIds.includes( groupItem.id ) ) {
              groupItem.inCombination = true
              return true
            }
            return false
          } )
        }
      } );
      return item;
    } );
    const resultEditData = { ...res, pages: filterPages };
    return resultEditData
  }

  // 使用模版
  userTemplate = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/userTemplate',
      payload: {
        query: {
          id
        },
        successFun: ( res ) => {
          if ( res ) {
            // 延迟唤起弹窗
            sessionStorage.removeItem( 'tempId' )
            this.setState( {
              editItem: this.serV3ActiveData( res )
            }, () => {
              this.setState( {
                editBeesV3: true,
                canSave:true
              } )
            } )
          }
        }
      }
    } );
  }

  // 新增或编辑模版
  editTemplate = () => {
    const editTempId = sessionStorage.getItem( 'editTempId' ) // 编辑模版ID
    if ( editTempId ) {
      this.getTemplate( editTempId )
    } else  {
      this.setState( { editItem: {}, editBeesV3: true, canSave:true } )
    }
  }

  // 获取模版信息
  getTemplate = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getTemplate',
      payload: {
        query: {
          id
        },
        successFun: ( res ) => {
          if ( res && res.activityConfig ) {
            // 延迟唤起弹窗
            sessionStorage.removeItem( 'editTempId' )
            const activityInfo = JSON.parse( res.activityConfig )
            delete activityInfo.id
            this.setState( {
              editItem: this.serV3ActiveData( activityInfo ),
              editTempStr: JSON.stringify( res )
            }, () => {
              this.setState( {
                editBeesV3: true,
                canSave:true
              } )
            } )
          }
        }
      }
    } );
  }


  // 打开二维码弹框
  openQRCodeModal = ( e, item ) => {
    this.setState( {
      chooseActive: item,
      qrCodeVisible: true,
    } )
  }

  // 关闭二维码弹框
  onCloseQRCodeModal = () => {
    this.setState( {
      qrCodeVisible: false,
      chooseActive: {}
    } )
  }

  onCloseHasDraftModal = () => {
    this.setState( {
      isHasDraft: false,
    } )
  }

  onOpenHasDraftModal = ( params ) => {
    if( params.draftState === 'PENDING' ){
      message.warning( '已存在审核中状态，请先进行审批' )
      return;
    }
    this.setState( {
      isHasDraft: true,
      passDraftInfo:params
    } )
  }

  // 复制链接
  copyLink = ( e, publishLink ) => {
    e.stopPropagation();
    const tag = copy( publishLink )
    if ( tag ) {
      message.success( '复制链接成功' )
    } else {
      message.error( '复制失败，重新点击或手动复制' )
    }
  }

  viewActivityNow = () => {
    const { passDraftInfo } = this.state
    this.setState( {
      isHasDraft:false,
      formProps:passDraftInfo,
      activityStatesType: passDraftInfo.draftState,
    } )

  }

  // 预览二维码
  renderQRCodeModal = () => {
    const { qrCodeVisible, chooseActive, activityStatesType } = this.state
    const { publishLink, name, coverPicture, id, appPublishLink, appQrCodePublishLink, state } = chooseActive
    const ishowTips = !( activityStatesType === 'PASS' || activityStatesType === 'DISABLED' )
    const isShowButton = activityStatesType === 'PASS' || activityStatesType === 'DISABLED'
    return (
      <Modal
        title={`${name}-(${activityStatusMap[state]})` || '活动预览'}
        visible={qrCodeVisible}
        footer={null}
        onCancel={this.onCloseQRCodeModal}
        width='800px'
        centered
      >
        {ishowTips && <div className={styles.modalTips}><span>活动审批还未通过，预览仅限于查看编辑效果，请勿面客</span></div>}
        <Row className={styles.previewModal}>
          <Col span={10}>
            <div className={styles.coverPictureBox}>
              <img className={styles.coverPicture} src={coverPicture} alt="" />
            </div>
          </Col>
          <Col span={14} style={{ padding:'0 10px' }}>
            {isShowButton && (
              <div style={{ textAlign:'right', paddingRight:'5px' }}>
                <Button 
                  type='primary'
                  onClick={() => this.getCurrentCollaborsInfo( id, 'edit', () => {this.setState( { qrCodeVisible:false, isPass:true, canSave:false }, ()=>{this.onEditBees( { id } )} )} )}
                >
                  查看配置内容
                </Button>
              </div>
            )}
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>活动二维码:</Col>
              <Col span={16}>
                <QRCode
                  value={publishLink}  
                  size={130}
                  fgColor="#000000"
                />
              </Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>活动链接:</Col>
              <Col span={16}> <Paragraph copyable>{publishLink}</Paragraph></Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>APP内活动二维码:</Col>
              <Col span={16}> 
                <QRCode
                  value={appQrCodePublishLink}  
                  size={130}
                  fgColor="#000000"
                />
              </Col>
            </Row>
            <Row style={{ marginTop:'20px' }}>
              <Col span={8} className={styles.label}>APP内活动链接:</Col>
              <Col span={16}> <Paragraph copyable>{appPublishLink}</Paragraph></Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    )
  }

  renderHasDraftModal = () => {
    const { isHasDraft, passDraftInfo } = this.state;
    return (
      <Modal
        title='编辑活动'                           
        visible={isHasDraft}      
        footer={[
          <Button type="primary" onClick={this.onCloseHasDraftModal}>
            取消
          </Button>,
          <Button
            type="primary" 
            onClick={this.viewActivityNow}
          >
            立即查看
          </Button>
        ]}
        onCancel={this.onCloseHasDraftModal}
        centered      
      >
        <div>
          {`已存在${activityStatusMap[passDraftInfo.draftState]}状态，请从${activityStatusMap[passDraftInfo.draftState]}中编辑活动或删除${activityStatusMap[passDraftInfo.draftState]}中对应活动后，回到审核通过进行活动编辑`}
        </div>
      </Modal>
    )
  }

  // 给编辑的数据组件部分新增ID
  onV2AddEleId = ( item ) => {
    let newItem = item
    const eleList = ( item.elements && item.elements.length > 0 ) ? item.elements : []
    if ( eleList && eleList.length > 0 ) {
      const newEleList = eleList.map( info => {
        return {
          ...info,
          virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
      newItem = Object.assign( item, { elements: newEleList } )
    }
    return newItem
  }

  // 删除
  onDeleteBees = ( e, id ) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { activityStatesType } = this.state
    dispatch( {
      type: 'bees/deleteBees',
      payload: {
        query: {
          id,
          state:activityStatesType
        },
        successFun: () => {
          this.getBees();
          this.getActiveStatistics()
        }
      },
    } );
  }

  // 复制
  onCopyBees = ( e, id ) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { activityStatesType } = this.state
    dispatch( {
      type: 'bees/copyActivity',
      payload: {
        query: {
          id,
          state:activityStatesType
        },
        successFun: () => {
          message.success( '复制成功' )
          this.getBees()
          this.getActiveStatistics()
        }
      }
    } );
  }

  handleAddTemplate = ( e, item ) => { // 添加至模版
    e.stopPropagation();
    this.setState( {
      chooseActive: item,
      editVisible: true,
    } )
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
  editTemplateTags = ( newTags ) => {
    const { editTempItem } = this.state;
    const newEditItem = { ...editTempItem, labels: [...newTags] };
    this.setState( {
      editTempItem: newEditItem
    } )
  }

  // 关闭编辑弹框
  onCloseEditModal = () => {
    this.setState( {
      editTempItem: {},
      chooseActive: {},
      editVisible: false
    } )
  }

  // 编辑模版弹框
  renderEditModal = () => {
    const { loading } = this.props
    const { editVisible, editTempItem } = this.state
    const { name, labels = [] } = editTempItem
    return (
      <Modal
        title="添加至模版"
        visible={editVisible}
        onCancel={this.onCloseEditModal}
        onOk={() => this.addToTemplate()}
        footer={[
          <Button key="back" onClick={this.onCloseEditModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.addToTemplate()}>
            确定
          </Button>,
        ]}
      >
        <div>
          <FormItem
            style={{ display: 'flex' }}
            label={<span className={styles.labelText}><span>*</span>模版名称</span>}
            {...this.formLayout}
          >
            <Input placeholder='请输入名称' onChange={this.editTemplateName} maxLength={20} value={name} />
          </FormItem>
          <FormItem
            style={{ display: 'flex' }}
            label={<span className={styles.labelText}>模板标签</span>}
            {...this.formLayout}
          >
            <EditTags tags={labels} changeTags={this.editTemplateTags} />
          </FormItem>
        </div>
      </Modal>
    )
  }

  addToTemplate = () => {
    const { chooseActive, editTempItem, activityStatesType } = this.state;
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
          activityId: chooseActive.id,
          state:activityStatesType
        },
        successFun: () => {
          this.onCloseEditModal();
          message.success( '添加成功' )
        }
      }
    } )
  }


  // 限制不能选今天之前的日期
  disabledDate = ( current ) => {
    return current && current < moment().subtract( 1, 'day' ).endOf( 'day' );
  }

  // 开启未来版本弹框
  onOpenFeatureModal = ( e, item ) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getActivityDraft',
      payload: {
        query: {
          activityId: item.id
        },
        successFun: ( res ) => {
          if ( res && !res.result ) {
            // 没有未来版本
            this.setState( {
              hasFeature: false,
              reatureVisible: true,
              editActivityId: item.id
            } )
          } else if ( res && res.result ) {
            const { autoUpdateTime, updatePeriods } = res.result
            // 有未来版本
            this.setState( {
              hasFeature: true,
              reatureVisible: true,
              editActivityId: item.id,
              autoUpdateTime,
              updatePeriods
            } )
          }
        }
      }
    } )
  }

  // 关闭未来版本弹框
  onCloseFeatureModal = () => {
    this.setState( {
      reatureVisible: false,
      autoUpdateTime: '',
      updatePeriods: false,
      hasFeature: false,
      editActivityId: ''
    } )
  }

  // 编辑未来版本
  onEditFeature = () => {
    const { editActivityId } = this.state
    if ( !editActivityId ) {
      message.error( '缺少活动ID' )
      return
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getBeesInfo',
      payload: {
        query: {
          id: editActivityId,
          isDraft: true
        },
        successFun: ( res ) => {
          if ( res ) {
            // 延迟唤起弹窗
            this.setState( {
              editItem: this.onV2AddEleId( res )
            }, () => {
              this.onCloseFeatureModal()
            } )
          }
        }
      }
    } );
  }

  // 新增未来版本
  onAddFeature = () => {
    const { editActivityId, autoUpdateTime, updatePeriods, } = this.state
    if ( !editActivityId ) {
      message.error( '缺少活动ID' )
      return
    }
    if ( !autoUpdateTime ) {
      message.error( '请选择自动更新时间' )
      return
    }
    if ( autoUpdateTime && moment( autoUpdateTime ).valueOf() < moment().add( 10, 'm' ).valueOf() ) {
      this.setState( {
        autoUpdateTime: ''
      }, () => {
        message.error( '选择的时间须大于当前时间至少十分钟' )
      } )
      return
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/addActivityDraft',
      payload: {
        query: {
          activityId: editActivityId,
          autoUpdateTime,
          updatePeriods
        },
        successFun: () => {
          this.onEditFeature()
        }
      }
    } )
  }

  // 删除未来版本
  onDeleteFeature = () => {
    const { editActivityId } = this.state
    if ( !editActivityId ) {
      message.error( '缺少活动ID' )
      return
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/deleteActivityDraft',
      payload: {
        query: {
          activityId: editActivityId,
        },
        successFun: () => {
          message.success( '删除未来版本成功' )
          this.onCloseFeatureModal()
        }
      }
    } );
  }

  // 编辑未来版本时间/是否更新期数
  editActivityDraft = () => {
    const { editActivityId, autoUpdateTime, updatePeriods } = this.state
    if ( !editActivityId ) {
      message.error( '缺少活动ID' )
      return
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/editActivityDraft',
      payload: {
        query: {
          activityId: editActivityId,
          autoUpdateTime,
          updatePeriods
        },
        successFun: () => { }
      }
    } );
  }

  changeFeatureItem = ( e, type ) => {
    const { hasFeature } = this.state
    let val
    if ( type === 'updatePeriods' ) val = e.target.value
    if ( type === 'autoUpdateTime' ) val = e && e.format( 'YYYY-MM-DD HH:mm' )
    this.setState( {
      [type]: val
    }, () => {
      if ( hasFeature && type === 'updatePeriods' ) {
        this.editActivityDraft()
      }
    } )
  }

  closeDateModal = ( e ) => {
    const { autoUpdateTime, hasFeature } = this.state
    // 判断弹框关闭后触发更新时间
    if ( !e && hasFeature ) {
      if ( moment( autoUpdateTime ).valueOf() < moment().add( 10, 'm' ).valueOf() ) {
        this.setState( {
          autoUpdateTime: ''
        }, () => {
          message.error( '选择的时间须大于当前时间至少十分钟' )
        } )
      } else {
        this.editActivityDraft()
      }
    }
  }

  // 数据中心
  jumpDataCenter = ( e, item ) => {
    this.setState( {
      dataCenterVisible: true,
      dataCenterId: item.id
    } )
  }

  // 关闭数据中心弹窗
  closeDataCenter = () => {
    this.setState( {
      dataCenterVisible: false,
      dataCenterId: null
    } )
  }

  // 控制协作人的增删改
  controlCollaborators = ( type, dataItem = {} ) => {
    const { editCooperateId, selectRole, selectUsers = [], isClick } = this.state
    const { dispatch, roleGroupList } = this.props;
    const typeToControl = {
      add: 'bees/addCollaborators',
      delete: 'bees/deleteCollaborators',
      update: 'bees/updateCollaborators'
    }
    if ( isClick ) return
    if ( type === 'add' ) {
      if ( !selectUsers.length ) {
        message.error( '请选择协作人！' )
        return
      }
      // 处理添加协作者的数组
      const collaborators = new Array( selectUsers.length ).fill( {} ).map( ( item, index ) => {
        const findUserItem = roleGroupList && roleGroupList.find( uitem => String( uitem.id ) === selectUsers[index] )
        const { nick, username } = findUserItem
        return {
          activityId: editCooperateId,
          role: selectRole,
          userId: selectUsers[index],
          nick,
          username,
        }
      } )
      this.setState( {
        isClick: true
      }, () => {
        dispatch( {
          type: typeToControl[type],
          payload: { list:collaborators },
          successFun: ( res ) => {
            if ( res ) {
              this.setState( {
                selectUsers: [],
                isClick: false
              }, () => {
                message.success( '添加协作人成功！' )
                this.handleAddCooperaterVisible()
                this.getCollaborators()
              } )
            }
          }
        } );
      } )
    } else {
      const newDataItem = dataItem
      newDataItem.userId = String( newDataItem.userId )
      this.setState( {
        isClick: true
      }, () => {
        dispatch( {
          type: typeToControl[type],
          payload: {
            activityId: editCooperateId,
            ...newDataItem
          },
          successFun: ( res ) => {
            if ( res ) {
              this.setState( {
                isClick: false
              }, () => {
                if ( type === 'delete' ) message.success( '删除协作人成功！' )
                if ( type === 'update' ) message.success( '修改协作人成功！' )
                this.getCollaborators()
              } )
            }
          }
        } );
      } )
    }
  }

  // 控制协作管理弹窗
  onCooperateManager = ( e, item, open ) => {
    this.setState( {
      cooperateVisible: !this.state.cooperateVisible,
      editCooperateId: item?.id,
    }, () => {
      if ( open ) {
        this.getCollaborators()
      }
    } )
  }

  // 控制添加协作人弹窗
  handleAddCooperaterVisible = () => {
    this.setState( {
      addCooperaterVisible: !this.state.addCooperaterVisible,
      selectUsers: []
    } )
  }

  // 选择协作人变更 / 协作人身份变更
  handleCooperaterChange = ( selectArrOrRole, type, dataItem = {} ) => {
    if ( type === 'currentRole' ) {
      if ( selectArrOrRole === 'DELETE' ) {
        this.controlCollaborators( 'delete', dataItem )
      } else {
        const newDataItem = Object.assign( dataItem, { role: selectArrOrRole } )
        this.controlCollaborators( 'update', newDataItem )
      }
    }
    if ( type === 'cooperate' ) {
      const newSelectArrOrRole = selectArrOrRole && selectArrOrRole.map( item => String( item ) )
      this.setState( {
        selectUsers: newSelectArrOrRole
      } )
    }
    if ( type === 'role' ) {
      this.setState( {
        selectRole: selectArrOrRole
      } )
    }
  }

  // 设置未来版本弹框
  renderFeatureModal = () => {
    const { reatureVisible, autoUpdateTime, updatePeriods, hasFeature } = this.state
    return (
      <Modal
        title='设置未来版本'
        visible={reatureVisible}
        onCancel={this.onCloseFeatureModal}
        onOk={() => this.onEditFeatureModal}
        footer={null}
      >
        <div>
          <FormItem
            style={{ display: 'flex' }}
            label={<span className={styles.labelText}><span>*</span>自动更新时间</span>}
            {...this.featureFormLayout}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              showToday={false}
              allowClear={false}
              value={autoUpdateTime ? moment( autoUpdateTime, 'YYYY-MM-DD HH:mm' ) : null}
              placeholder="请选择未来版本自动更新时间"
              onChange={( e ) => this.changeFeatureItem( e, 'autoUpdateTime' )}
              format="YYYY-MM-DD HH:mm"
              disabledDate={this.disabledDate}
              onOpenChange={( e ) => this.closeDateModal( e )}
              style={{ width: 240 }}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否更新期数</span>}
            {...this.featureFormLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeFeatureItem( e, 'updatePeriods' )}
              value={updatePeriods}
            >
              <Radio value>更新期数</Radio>
              <Radio value={false}>不更新期数</Radio>
            </Radio.Group>
          </FormItem>
          <div>
            若设置更新期数，到达更新时间后，活动期数将增加1且
            <span style={{ color: 'red' }}>无法回退期数</span>，用户数据等将
            <span style={{ color: 'red' }}>重置</span>。
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              borderTop: '1px solid #f5f5f5',
              paddingTop: '10px'
            }}
          >
            <div>
              {hasFeature &&
                <Popconfirm placement="top" title="是否确认删除未来版本" onConfirm={() => this.onDeleteFeature()} okText="是" cancelText="否">
                  <Button type="danger">删除未来版本</Button>
                </Popconfirm>
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {!hasFeature && <Button type="primary" onClick={this.onAddFeature}>添加未来版本</Button>}
              {hasFeature && <Button type="primary" onClick={this.onEditFeature}>编辑未来版本</Button>}
              <Button style={{ marginLeft: '10px' }} onClick={this.onCloseFeatureModal}>取消</Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  // 添加协作人弹窗
  renderAddCooperaterModal = () => {
    const { addCooperaterVisible, selectUsers, selectRole } = this.state
    const { roleGroupList = [], collaboratorList = [] } = this.props
    let fliterArr = roleGroupList
    // 实现 数组a - 数组b
    if ( roleGroupList.length && collaboratorList.length ) {
      fliterArr = roleGroupList.filter( ( item ) => collaboratorList.every( v => v.userId !== item.id ) )
    }

    const userView = fliterArr && fliterArr.map( ( roleItem ) => {
      const { id, username, nick } = roleItem
      return (
        <Option value={String( id )} key={String( id )}>
          {`${username}(${nick})`}
        </Option>
      )
    } )
    return (
      <Modal
        title='添加协作人'
        visible={addCooperaterVisible}
        onCancel={this.handleAddCooperaterVisible}
        maskClosable={false}
        footer={null}
      >
        <div>
          <div className={styles.add_container}>
            <Select
              mode="multiple"
              style={{ width: '80%' }}
              placeholder="请输入用户昵称或用户名添加指定用户"
              value={selectUsers}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              onChange={( val ) => this.handleCooperaterChange( val, 'cooperate' )}
              getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}

            >
              {userView}
            </Select>
            <div>
              <Select
                style={{ width: 80 }}
                value={selectRole}
                onChange={( val ) => this.handleCooperaterChange( val, 'role' )}
                getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
              >
                <Option value='MANAGER'>
                  <span className={styles.role_label}>管理者</span>
                </Option>
                <Option value='EDITOR'>
                  <span className={styles.role_label}>编辑者</span>
                </Option>
                <Option value='VIEWER'>
                  <span className={styles.role_label}>查看者</span>
                </Option>
              </Select>
            </div>
          </div>
          <div className={styles.btn_group}>
            <Button onClick={() => this.handleAddCooperaterVisible()} className={styles.cancel}>取消</Button>
            <Button onClick={() => this.controlCollaborators( 'add' )} className={styles.confirm}>添加</Button>
          </div>
        </div>
      </Modal>
    )
  }

  // 协作管理弹窗
  renderCooperateManagerModal = () => {
    const { cooperateVisible } = this.state
    const { collaboratorList } = this.props
    const cooperaterListView = collaboratorList.length ? collaboratorList.map( ( citem ) => {
      const { nick, username, role } = citem
      return (
        <div className={styles.collabor_list}>
          <div className={styles.collabor_info}>
            <span>{nick}</span>
            <span>{username}</span>
          </div>
          <Select
            style={{ width: 80 }}
            value={role}
            onChange={( val ) => this.handleCooperaterChange( val, 'currentRole', citem )}
            getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
            disabled={role === 'CREATOR'}
          >
            {role === 'CREATOR' && <Option value='CREATOR'>创建者</Option>}
            <Option value='MANAGER'>
              <span className={styles.role_label}>管理者</span>
            </Option>
            <Option value='EDITOR'>
              <span className={styles.role_label}>编辑者</span>
            </Option>
            <Option value='VIEWER'>
              <span className={styles.role_label}>查看者</span>
            </Option>
            <Option value='DELETE'>
              <span className={styles.role_label}>移除</span>
            </Option>
          </Select>
        </div>
      )
    } ) : <Empty description='暂无协作人数据' />
    return (
      <Modal
        title='协作管理'
        visible={cooperateVisible}
        onCancel={this.onCooperateManager}
        maskClosable={false}
        footer={null}
      >
        <div>
          <Button
            style={{ width: '100%', margin: '20px 0', background: '#1F3883', color: '#fff' }}
            icon="plus"
            onClick={() => this.handleAddCooperaterVisible()}
          >
            添加协作人
          </Button>
          <div className={styles.user_info} style={collaboratorList.length === 0 ? { justifyContent: 'center' } : {}}>
            {cooperaterListView}
          </div>
        </div>
      </Modal>
    )
  }

  // 导出活动配置
  onExportActivity = ( e, item ) => {
    e.stopPropagation();
    if ( !item || ( item && !item.id ) ) return
    const { id, name } = item
    const { isExPLoading, activityStatesType } = this.state
    const ajaxUrl = `activity/info/export/${id}?state=${activityStatesType}`;
    if ( isExPLoading ) return;
    this.setState(
      {
        isExPLoading: true,
      },
      () => {
        exportFunc( {
          type: 'activityUploadService',
          uri: ajaxUrl,
          xlsxName: `${name}.txt`,
          callBack: () => {
            this.setState( {
              isExPLoading: false,
            } );
          },
        } );
      }
    );
  };

  // 创建活动
  addActivity = () => {
    this.setState( {
      editItem: {},
      editBeesV3: true
    } )
  }


  // 活动状态筛选点击
  seachActivityStatus = ( type ) => {
    const { activityStatesType } = this.state;
    if( activityStatesType === type ) return;
    this.filterForm.formReset();
    this.setState( {
      pageNum: 1,
      activityStatesType: type,
      formProps:{}
    }, ()=>{
      this.getBees();
    } )
  }

  // 列表样式转换
  seachListStyles = ( type ) => {
    const { listStyles } = this.state;
    if ( listStyles === type ) return;
    this.setState( {
      listStyles: type,
    } )
  }

  //
  modalFilform = ( { pageNum, pageSize, sortedInfo } ) => {
    this.setState( {
      pageNum,
      pageSize,
      sortedInfo
    }, this.getBees )
  }

  showAddActivityModal = () => {
    this.setState( {
      editItem: {},
      editBeesV3: true,
      canSave:true
    } )
  }

  onCloseLoginModal = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/LoginModalSwitch',
      payload: {
        loginModalVisible: false,
      }
    } )
  }

  onShowLoginModal = () => {
    const { loginModalVisible } = this.props;
    const { dispatch } = this.props;
    if ( loginModalVisible ) return;
    dispatch( {
      type: 'bees/LoginModalSwitch',
      payload: {
        loginModalVisible: true,
      }
    } )
  }

  renderLoginModal = () => {
    const { loginModalVisible } = this.props;
    return (
      <Modal
        visible={loginModalVisible}
        footer={null}
        onCancel={this.onCloseLoginModal}
        wrapClassName={styles.loginModal}
        zIndex={2000}
      >
        <ModalLogin getBees={() => {
          this.getBees();
          this.getActiveStatistics()
        }
        }
        />
      </Modal>
    )
  }


  // 数据统计
  renderStatistics = () => {
    const { activityStatesType } = this.state
    const { activeStatisticsData } = this.props;
    const statisticsItem = activityStatusList.map( ( item ) => {
      const { key, name, val, img } = item
      return (
        <div
          key={key}
          onClick={() => this.seachActivityStatus( key )}
          className={`${styles.activityStatesBox} ${activityStatesType === key ? styles.activityStatesActive : ''}`}
        >
          <img style={{ width:'42px' }} alt='' src={img} />
          <div>
            <div className={styles.activityStatesNum}>{activeStatisticsData[val] || 0}</div>
            <div>{name}</div>
          </div>
        </div>
      )
    } )

    return (
      <div className={styles.activityStatusList}>
        {statisticsItem}
      </div>
    )
  }


  // 列表展示
  renderAcyivityList = () => {
    const { listStyles, activityStatesType } = this.state;
    const { history } = this.props;
    const activityListSetting = {
      activityStatesType,
      history,
      modalFilform: this.modalFilform,
      onEditBees: this.onEditBees,
      showAddActivityModal: this.showAddActivityModal,
      openQRCodeModal: this.openQRCodeModal,
      onCopyBees: this.onCopyBees,
      jumpDataCenter: this.jumpDataCenter,
      handleAddTemplate: this.handleAddTemplate,
      onOpenFeatureModal: this.onOpenFeatureModal,
      onExportActivity: this.onExportActivity,
      onCooperateManager: this.onCooperateManager,
      onDeleteBees: this.onDeleteBees,
      getRoleGroupList: this.getRoleGroupList,
      getCurrentCollaborsInfo: this.getCurrentCollaborsInfo,
      onOpenHasDraftModal:this.onOpenHasDraftModal
    }

    let listView
    if ( listStyles === 'list' ) {
      listView = (
        <div className={styles.bottomBox}>
          <Button
            type="dashed"
            style={{ width: '100%', margin: '20px 0' }}
            icon="plus"
            onClick={this.showAddActivityModal}
          >
            创建新活动
          </Button>
          <ListStyles {...activityListSetting} />
        </div>
      )
    } else if ( listStyles === 'card' ) {
      listView = <CardStyle {...activityListSetting} />
    }

    return listView
  }

  // 数据中心
  renderDataCenterMask = () => {
    const { dataCenterVisible, dataCenterId } = this.state
    if ( !dataCenterVisible ) return null
    return (
      <ThirdDataCenter
        closeDataCenter={this.closeDataCenter}
        activityId={dataCenterId}
        dataCenterVisible={dataCenterVisible}
        {...this.props}
      />
    )
  }

  // 编辑活动弹窗
  renderEditActivityMask = () => {
    const { history } = this.props;
    const { editItem, isEditTemplate, editTempStr, editBeesV3, canSave, } = this.state;
    return editBeesV3 ? <EditBeesV3
      visible={editBeesV3}
      closeModal={() => this.closeModal( 'editBeesV3' )}
      editObj={editItem}
      isEditTemp={isEditTemplate}
      history={history}
      getEditData={this.onEditBees}
      editTempStr={editTempStr}
      canSave={canSave}
    /> : null
  }


  render() {
    const { listStyles, formProps } = this.state;
    return (
      <div className={styles.beesBox} id='beesContentKey'>
        <GridContent>
          <div className={styles.bees}>
            <div className={styles.topBox}>
              {this.renderStatistics()}
              <FilterForm
                filterSubmit={()=>{
                  this.filterSubmit()
                  this.getActiveStatistics()
                }}
                seachListStyles={this.seachListStyles}
                listStyles={listStyles}
                wrappedComponentRef={( ref ) => { this.filterForm = ref }}
                formProps={formProps}
              />
            </div>
            {this.renderAcyivityList()}
          </div>
        </GridContent>
        {this.renderEditActivityMask()}
        {this.renderDataCenterMask()}
        {this.renderEditModal()}
        {this.renderQRCodeModal()}
        {this.renderFeatureModal()}
        {this.renderCooperateManagerModal()}
        {this.renderAddCooperaterModal()}
        {this.renderLoginModal()}
        {this.renderHasDraftModal()}
      </div>
    );
  };
}

export default Bees;
