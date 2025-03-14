/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card, Tabs, Button, Icon, Checkbox, Empty, message, Pagination,
  Popover, Divider, Modal, Form, Input, Spin, Drawer, Radio, Select,
} from 'antd';
import debounce from 'lodash/debounce';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImgBtn from '@/components/UploadImgBtn';
import UploadFile from '@/components/UploadFile';
import UploadBatchImg from '@/components/UploadBatchImg'; // 批量上传图片组件
import ClassTypeManage from './ClassTypeManage';
import SizeModal from './SizeModal';
import Iframe from './Iframe';
import styles from './materialLibrary.less';
import isLocal from '@/assets/local.png';
import isOnline from '@/assets/online.png';


const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;

const LIBRARYS = [
  {
    name: '我的素材',
    key: 'private',
  },
  {
    name: '公共素材库',
    key: 'public'
  },
  {
    name: '待审核',
    key: 'audit'
  }
]

const TYPELIST = [
  {
    name: '图片',
    key: 'IMAGE',
  },
  {
    name: '音频',
    key: 'AUDIO'
  },
  {
    name: '视频',
    key: 'VIDEO'
  }
]

// 根据视窗判断展示的个数
const getPageSize = ( winSize, mediaType, libraryType ) => {
  let pageSize = 18

  // 图片素材类型
  if ( mediaType === 'IMAGE' ) {
    if ( winSize >= 1920 ) pageSize = 24
    if ( winSize >= 1575 && winSize < 1920 ) pageSize = 21
    if ( winSize >= 1395 && winSize < 1575 ) pageSize = 18
    if ( winSize >= 1215 && winSize < 1395 ) pageSize = 15
    if ( winSize >= 1035 && winSize < 1215 ) pageSize = 12
    if ( winSize >= 915 && winSize < 1035 ) pageSize = 12
    if ( winSize >= 735 && winSize < 915 ) pageSize = 9
    if ( winSize < 735 ) pageSize = 6
  }
  // 音频素材类型
  if ( mediaType === 'AUDIO' ) {
    if ( winSize >= 1920 ) pageSize = 12
    if ( winSize >= 1425 && winSize < 1920 ) pageSize = 9
    if ( winSize >= 1055 && winSize < 1425 ) pageSize = 6
    if ( winSize >= 935 && winSize < 1055 ) pageSize = 6
    if ( winSize < 935 ) pageSize = 3
  }
  // 视频素材类型
  if ( mediaType === 'VIDEO' ) {
    if ( winSize >= 1920 ) pageSize = 12
    if ( winSize >= 1425 && winSize < 1920 ) pageSize = 9
    if ( winSize >= 1055 && winSize < 1425 ) pageSize = 6
    if ( winSize >= 935 && winSize < 1055 ) pageSize = 6
    if ( winSize < 935 ) pageSize = 3
  }
  if ( mediaType === 'IMAGE' && libraryType !== 'public' && libraryType !== 'audit' ) { return pageSize - 1 }
  return pageSize
}

@connect( ( { library } ) => {
  return {
    loading: library.loading,
    categoryMap: library.categoryMap,
    classList: library.classList,
    authCode: library.authCode,
  }
} )

class MaterialLibraryCopy extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 10 },
  };

  constructor( props ) {
    const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth;  // 获取浏览器宽度
    const pageSize = getPageSize( winSize, 'IMAGE', 'private' )
    super( props );
    this.state = {
      winSize, // 视窗宽
      mediaType: 'IMAGE', // 素材的类型
      chooseItem: '', // 当前的分组
      pageSize, // 素材页条数
      pageNum: 1, // 素材页页吗
      selectImgArr: [], // 选中的图片组
      selectMenu: null, // 控制每个素材右下角菜单展示
      categoryMoveKey: null, // 控制移动分类
      manageVisible: false, // 控制分类管理弹窗
      editClassList: [], // 分类编辑的临时数据
      editItem: null,
      uploadImgModalControl: false, //! 控制批量上传照片开关
      searchValue: '',
      iframeUrl: '',
      iframeVisible: false,
      sizeModalVisible: false,
      materialName: '',
      libraryType: 'private',
      authorityList, // 权限列表
      hasPermission: false,
      auditModalVisible: false,
      auditItem: null,
      auditResult: true,
      targetClass: '',
    }
    this.listenResize = debounce( this.listenResize.bind( this ), 700 );
  }

  componentDidMount() {
    const { authorityList } = this.state;
    this.getClassList();
    this.getMaterialList();
    // this.getEqxiuLoginCode();
    window.addEventListener( 'resize', this.listenResize.bind( this ) )
    if ( authorityList.includes( 'MATERIAL_LIBRARY_AUDIT' ) ) {
      this.setState( {
        hasPermission: true
      } )
    }
  };

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.listenResize.bind( this ) )
  }

  // 去创建新素材
  createNewMaterial = ( name, width, height ) => {
    const { authCode } = this.props;
    if ( !authCode ) { message.error( 'token获取失败' ); return; }
    const iframeUrl = `https://open.eqxiu.cn/design/create/blank?secretId=34660X8&Authorization=${authCode}&width=${width}&height=${height}`
    this.setState( {
      materialName: name
    } );
    this.closeSizeModal();
    this.onOpenIframe( iframeUrl );
  }

  // 去编辑素材
  goEditMaterial = ( item ) => {
    const { authCode } = this.props;
    const { url, name, eqxiuId } = item;
    if ( !url || !authCode ) { message.error( 'token获取失败' ); return; }
    const image = new Image();
    image.src = url;
    let iframeUrl;
    if ( eqxiuId ) {
      iframeUrl = `https://open.eqxiu.cn/design/${eqxiuId}?secretId=34660X8&Authorization=${authCode}`;
    } else {
      iframeUrl = `https://open.eqxiu.cn/design/create/blank?secretId=34660X8&Authorization=${authCode}&filePath=${url}&width=${image.width}&height=${image.height}`;
    }
    this.setState( {
      editItem: item,
      materialName: name
    } );
    this.onOpenIframe( iframeUrl );
  }

  // 编辑素材窗口
  onOpenIframe = ( iframeUrl ) => {
    this.setState( {
      iframeUrl,
      iframeVisible: true
    } )
  }

  onCloseIframe = () => {
    this.setState( {
      iframeUrl: '',
      iframeVisible: false,
      editItem: null,
    } )
  }

  // 获取授权码
  getEqxiuLoginCode = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/getEqxiuLoginCode',
      payload: {},
    } );
  }

  // 获取易企秀作品信息
  getEQXiuOpus = ( creationId ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/getEQXiuOpus',
      payload: { creationId },
      callFunc: ( res ) => {
        if ( res.success ) {
          this.uploadUrlFile( res.result.id, res.result.cover );
        } else {
          message.error( res.message )
        }
      }
    } )
  }

  // 从易企秀上传到素材库
  uploadUrlFile = ( id, url ) => {
    const { dispatch } = this.props;
    const { editItem, materialName, chooseItem } = this.state;
    const newItem = { categoryId: chooseItem, mediaType: "IMAGE", name: materialName };
    const material = editItem || newItem;
    if ( material.name === '' ) { return };
    if ( !material.eqxiuId ) {
      material.id = ''
    }
    material.eqxiuId = id;
    dispatch( {
      type: 'library/uploadUrlFile',
      payload: {
        imageUrl: url,
        item: material
      },
      callFunc: () => {
        // message.success( '保存成功' )
      }
    } );
    this.onCloseIframe();
    this.getMaterialList();
  }

  // 新建图片对话框
  openSizeModal = () => {
    this.setState( {
      sizeModalVisible: true
    } )
  }

  closeSizeModal = () => {
    this.setState( {
      sizeModalVisible: false
    } )
  }

  // 监听浏览器窗口改变
  listenResize = ( e ) => {
    const { mediaType, libraryType } = this.state
    const pageSize = getPageSize( e.target.innerWidth, mediaType, libraryType )
    this.setState( {
      pageSize,
      winSize: e.target.innerWidth,
    }, () => {
      this.getMaterialList()
    } )
  }

  // 切换分类
  changeType = ( e ) => {
    const { winSize, libraryType } = this.state
    this.setState( {
      mediaType: e,
      chooseItem: '',
      pageNum: 1,
      pageSize: getPageSize( winSize, e, libraryType ),
      searchValue: '',
    }, () => {
      this.getClassList();
      this.getMaterialList()
    } )
  }

  // 切换库
  changeLibrary = ( e ) => {
    this.setState( {
      libraryType: e,
      selectImgArr: [],
    }, () => {
      this.changeType( 'IMAGE' )
    } )
  }

  changeSearchValue = ( e ) => {
    this.setState( {
      searchValue: e.target.value
    } )
  }

  // 获取分类列表
  getClassList = () => {
    const { mediaType, libraryType } = this.state
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/getCategoryList',
      payload: {
        mediaType,
        libraryType
      }
    } );
  }

  // 获取素材列表
  getMaterialList = () => {
    const { pageNum, pageSize, chooseItem, mediaType, searchValue, libraryType, } = this.state;
    const { dispatch } = this.props;
    let type = 'library/getMaterialList';
    if ( libraryType === 'audit' ) {
      type = 'library/getAuditList'
    } else if ( libraryType === 'private' ) {
      type = 'library/getMineMaterialList'
    }
    dispatch( {
      type,
      payload: {
        mediaType,
        categoryId: chooseItem,
        name: searchValue,
        page:{
          pageSize,
          pageNum,
        }
      },
    } );
  }

  onSearch = () => {
    this.setState( {
      pageNum: 1,
    }, () => {
      this.getMaterialList()
    } )
  }

  // 批量审核
  batchAuditMaterial = () => {
    const { dispatch } = this.props;
    const { auditItem, selectImgArr, auditResult, targetClass } = this.state;
    if ( !auditItem && !selectImgArr.length ) {
      message.error( '请选择要审核的素材' )
      return
    }
    const ids = auditItem ? [auditItem] : selectImgArr;
    dispatch( {
      type: 'library/batchAuditMaterial',
      payload: {
        auditResult,
        categoryId: targetClass,
        ids,
      },
      callFunc: () => {
        this.setState( {
          selectImgArr: [],
        } )
        this.closeAuditModal()
        this.getMaterialList()
        message.success( '审核成功' )
      }
    } )
  }

  // 移动分类
  batchEditMaterial = ( list, call ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/batchEditMaterial',
      payload: {
        list,
      },
      callFunc: () => {
        this.getMaterialList()
        if ( call ) {
          call()
        }
        message.success( '更新成功' )
      }
    } );
  }

  // 编辑或新增单个素材
  saveMaterial = ( item ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/saveMaterial',
      payload: {
        ...item,
      },
      callFunc: () => {
        this.getMaterialList()
        this.closeEditNameModal()
        message.success( '更新成功' )
      }
    } );
  }

  // 删除素材
  batchDelMaterial = ( ids ) => {
    const { dispatch } = this.props;
    const { selectImgArr } = this.state;
    if ( !ids && !selectImgArr.length ) {
      message.error( '请选择要删除的素材' )
      return
    }
    Modal.confirm( {
      title: '是否删除以下所选项？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      zIndex: 1050,
      onOk: () => {
        dispatch( {
          type: 'library/batchDelMaterial',
          payload: {
            list: ids || selectImgArr,
          },
          callFunc: () => {
            this.setState( {
              pageNum: 1,
              selectImgArr: [],
              selectMenu: null,
              categoryMoveKey: null,
            }, () => {
              this.getMaterialList();
              message.success( '删除成功' )
            } )
          }
        } );
      },
      onCancel() {
      },
    } );
  }

  // 选择分组
  handleClassItem = ( id ) => {
    if ( id === this.state.chooseItem ) return
    this.setState( {
      pageNum: 1,
      chooseItem: id,
      selectImgArr: [],
      selectMenu: null,
      categoryMoveKey: null,
    }, () => {
      // 刷新列表
      this.getMaterialList()
    } )
  }

  // 图片全选
  onCheckAllImg = () => {
    const { selectImgArr, libraryType } = this.state;
    const { categoryMap: { list } } = this.props
    let arr = []
    if ( selectImgArr.length < list.length ) {
      // 全选
      if ( libraryType === 'audit' ) {
        // 审核列表的全选
        const allList = list.map( info => {
          return info.material.id
        } )
        arr = allList
      } else {
        const allList = list.map( info => {
          return info.id
        } )
        arr = allList
      }
    } else if ( selectImgArr.length >= list.length ) {
      // 反选
      arr = []
    }
    this.setState( {
      selectImgArr: arr
    } )
  }

  // 图片移动 (单个或批量)
  onMoveCategroy = ( item ) => {
    if ( item && item.id ) {
      const newArr = [item.id]
      this.setState( {
        visibleMoveCategory: true,
        categoryMoveKey: item.categoryId,
        selectImgArr: [...newArr],
      } )
    } else {
      const { selectImgArr } = this.state
      if ( !selectImgArr || selectImgArr.length <= 0 ) {
        message.error( '至少选择一项' )
      } else {
        this.setState( {
          visibleMoveCategory: true,
          categoryMoveKey: null,
        } )
      }
    }
  }

  // 图片批量删除
  onBatchDelete = ( id ) => {
    if ( id ) {
      this.batchDelMaterial( [id] )
    } else {
      const { selectImgArr } = this.state
      if ( !selectImgArr || selectImgArr.length <= 0 ) {
        message.error( '至少选择一项' )
      } else {
        this.batchDelMaterial()
      }
    }
  }

  // 开启类型编辑弹框
  openEditModal = () => {
    const { classList } = this.props
    let editClassList = []
    if ( classList && classList.length > 0 ) {
      editClassList = classList.filter( info => {
        return info && info.id && info.id !== 'default'
      } )
    }
    this.setState( { manageVisible: true, editClassList } )
  }

  // 关闭类型编辑弹框
  closeEditModal = () => {
    this.setState( { manageVisible: false, editClassList: [] } )
  }

  // 分组展示
  renderClassType = () => {
    const { classList } = this.props
    const { chooseItem, libraryType, hasPermission } = this.state
    if ( libraryType === 'audit' ) return null
    let classView
    if ( classList && classList.length > 0 ) {
      classView = classList.map( info => {
        return (
          <div
            onClick={() => { this.handleClassItem( info.id ) }}
            key={info.id}
            className={styles[`${chooseItem === info.id ? 'classBox_item_active' : 'classBox_item'}`]}
          >
            {info.name}
          </div>
        )
      } )
    }
    return (
      <div className={styles.classBox}>
        <div className={styles.classBox_types}>
          <div className={styles.classBox_tit}>分类：</div>
          <div className={styles.classBox_class_block}>{classView}</div>
        </div>
        <div
          className={styles.classBox_editBox}
          onClick={() => this.openEditModal()}
          style={{ display: ( libraryType === 'private' || hasPermission ) ? '' : 'none' }}
        >
          <Icon type="appstore" style={{ fontSize: 36 }} />
          <div className={styles.classBox_editBox_text}> 分类管理</div>
        </div>
      </div>
    )
  }

  // 选择图片
  handleSelect = ( id ) => {
    const { selectImgArr } = this.state;
    const newSelectImgArr = selectImgArr
    const index = newSelectImgArr.indexOf( id )
    if ( index > -1 ) {
      newSelectImgArr.splice( index, 1 )
    } else {
      newSelectImgArr.push( id )
    }
    this.setState( {
      selectImgArr: [...newSelectImgArr],
    } )
  }

  // 图片预览
  onpreview = ( url ) => {
    Modal.info( {
      icon: null,
      width: '400px',
      content: (
        <div style={{ border: '1px solid #ddd', padding: '20px' }}>
          <img src={url} alt="" style={{ width: '100%' }} />
        </div>
      ),
      okText: '关闭',
      onOk() { },
    } );
  }

  // 点击图片右下角小点
  handleMenuItem = ( key ) => {
    const { selectMenu } = this.state
    this.setState( {
      selectMenu: selectMenu === key ? null : key
    } )
  }

  // 选择要移动的分类
  handleMoveItem = ( key ) => {
    let categoryMoveKey = key
    if ( key === this.state.categoryMoveKey ) {
      categoryMoveKey = null
    }
    this.setState( {
      categoryMoveKey
    } )
  }

  // 分类弹窗确定
  handleMoveCategory = () => {
    const { selectImgArr, categoryMoveKey } = this.state;
    const { categoryMap: { list }, } = this.props
    if ( !categoryMoveKey ) {
      message.error( '请选择分类！' );
      return;
    }
    const postList = [];
    selectImgArr.forEach( item => {
      const param = list.find( citem => citem.id === item );
      if ( param ) {
        param.categoryId = categoryMoveKey;
        postList.push( param )
      }
    } )
    this.batchEditMaterial( postList, () => {
      this.setState( {
        visibleMoveCategory: false,
        selectImgArr: [],
        categoryMoveKey: null
      } )
    } )
  }

  // 打开编辑文件名字弹框
  handleEditName = ( item ) => {
    this.setState( {
      editItem: item,
      editNameVisible: true
    } )
  }

  // 关闭编辑文件名字弹框
  closeEditNameModal = () => {
    this.setState( {
      editItem: null,
      editNameVisible: false
    } )
  }

  // 打开审核素材弹框
  openAuditModal = ( id ) => {
    if ( !id ) {
      const { selectImgArr } = this.state
      if ( !selectImgArr || selectImgArr.length <= 0 ) {
        message.error( '至少选择一项' )
        return
      }
    } else {
      this.setState( {
        auditItem: id
      } )
    }
    this.setState( {
      auditResult: true,
      targetClass: '',
      auditModalVisible: true
    } )
  }

  // 关闭审核素材弹框
  closeAuditModal = () => {
    this.setState( {
      auditItem: null,
      auditModalVisible: false
    } )
  }

  // 保存新素材名
  onSaveName = () => {
    const { editItem } = this.state;
    if ( !editItem || ( editItem && !editItem.name ) ) {
      message.error( '请输入素材名称' );
      return;
    }
    this.saveMaterial( editItem );
  }

  // 编辑名称输入框改变
  changeEditNameInput = ( e ) => {
    const val = e.target.value || ''
    const { editItem } = this.state
    const newEditItem = { ...editItem, name: val }
    this.setState( {
      editItem: { ...newEditItem }
    } )
  }

  // 重命名弹框
  renderEditNameModal = () => {
    const { editItem, editNameVisible } = this.state
    return (
      <Modal
        visible={editNameVisible}
        onOk={this.onSaveName}
        onCancel={() => { this.closeEditNameModal() }}
        title='修改名称'
        zIndex={1040}
      >
        <FormItem
          label="素材名称"
          {...this.formLayout}
        >
          <Input
            value={editItem ? editItem.name : ''}
            placeholder="请输入素材名称"
            onChange={( e ) => this.changeEditNameInput( e )}
            maxLength={20}
            style={{ width: '100%' }}
          />
        </FormItem>
      </Modal>
    )
  }


  // 翻页
  paginationChange = ( page ) => {
    this.setState( {
      pageNum: page,
      selectImgArr: [],
      selectMenu: null,
      categoryMoveKey: null,
    }, () => {
      this.getMaterialList();
    } )
  }


  // 分类移动弹框
  renderMoveTypeModal = () => {
    const { visibleMoveCategory, categoryMoveKey } = this.state
    const { classList } = this.props
    let typeView
    if ( classList && classList.length > 2 ) {
      const newClassList = classList.filter( info => {
        return info.id && info.id !== 'default'
      } )
      typeView = newClassList.map( item => {
        return (
          <div
            onClick={() => { this.handleMoveItem( item.id ) }}
            key={item.id}
            className={styles.categoryItem}
            style={{
              borderColor: categoryMoveKey === item.id ? '#1F3883' : '',
              color: categoryMoveKey === item.id ? '#1F3883' : '',
              cursor: 'pointer'
            }}
          >
            {item.name}
          </div>
        )
      } )
    } else {
      typeView = <div style={{ margin: '0 auto' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无分类，请去添加" /></div>
    }
    return (
      <Modal
        visible={visibleMoveCategory}
        onOk={this.handleMoveCategory}
        onCancel={() => { this.setState( { visibleMoveCategory: false } ) }}
        title='选择移动到分类'
        zIndex={1000}
      >
        <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
          {typeView}
        </div>
      </Modal>
    )
  }

  // 上传图片
  uploadImg = () => {
    this.setState( {
      pageNum: 1,
      selectImgArr: [],
      selectMenu: null,
      categoryMoveKey: null,
    }, () => {
      this.getMaterialList();
    } )
  }

  // 控制批量上传图片渲染组件开关
  onBatchUpload = () => {
    this.setState( { uploadImgModalControl: true } )
  }

  onHandleCancel = () => {
    this.setState( { uploadImgModalControl: false } )
  }

  //! 批量上传图片渲染组件
  batchUploadImg = () => {
    const { uploadImgModalControl, chooseItem, libraryType } = this.state;
    return (
      <UploadBatchImg
        categoryId={chooseItem}
        control={uploadImgModalControl}
        handleCancel={this.onHandleCancel}
        uploadImg={this.uploadImg}
        libraryType={libraryType}
      />
    )
  }

  // 添加至审核列表
  onAddPublicLibrary = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'library/commitMaterial',
      payload: {
        materialId: id,
      },
      callFunc: () => {
        this.getMaterialList()
        message.success( '提交成功' )
      }
    } );
  }

  onChangeAuditStatus = ( e ) => {
    this.setState( {
      auditResult: e.target.value
    } )
  }

  onChangeTargetCalss = ( e ) => {
    this.setState( {
      targetClass: e
    } )
  }

  // 审核弹框
  renderAuditModal = () => {
    const { auditModalVisible, targetClass, auditResult } = this.state
    const { classList } = this.props;
    const newClassList = classList.filter( item => item.id !== 'default' )
    return (
      <Modal
        visible={auditModalVisible}
        onOk={this.batchAuditMaterial}
        onCancel={() => { this.closeAuditModal() }}
        title='审核素材'
        zIndex={1050}
      >
        <Form>
          <FormItem
            label="是否通过"
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.onChangeAuditStatus( e )} value={auditResult}>
              <Radio value>通过</Radio>
              <Radio value={false}>不通过</Radio>
            </Radio.Group>
          </FormItem>
          {
            auditResult &&
            <FormItem
              label="目标分组"
              {...this.formLayout}
            >
              <Select defaultValue="" onChange={( e ) => this.onChangeTargetCalss( e )} value={targetClass}>
                {
                  newClassList.map( item => {
                    return ( <Option key={item.id} value={item.id}>{item.name}</Option> )
                  } )
                }
              </Select>
            </FormItem>
          }
        </Form>
        <span>审核通过的素材将放入公共素材库，审核不通过的素材将直接删除</span>
      </Modal>
    )
  }

  // 图片操作按钮组
  renderIconMenu = ( item ) => {
    const { mediaType, hasPermission, libraryType } = this.state;
    let showIcon;

    if ( libraryType === 'private' ) {
      showIcon = true
    } else if ( libraryType === 'public' ) {
      showIcon = hasPermission
    }

    return (
      <div className={styles.iconBox}>
        {/* <Icon type="edit" className={styles.icon} onClick={() => { this.goEditMaterial( item ) }} hidden={mediaType !== 'IMAGE' || libraryType === 'public' || libraryType === 'audit'} /> */}
        <Icon type="eye" className={styles.icon} onClick={() => { this.onpreview( item.url ) }} hidden={mediaType !== 'IMAGE'} />
        <Popover
          trigger="click"
          content={
            <div className={styles.menuList}>
              <div style={{ display: libraryType === 'public' ? 'none' : '' }}>
                <div onClick={() => { this.onAddPublicLibrary( item.id ) }}>添加至公共素材库</div>
                <Divider style={{ margin: '8px 0' }} />
              </div>
              <div onClick={() => { this.onMoveCategroy( item ) }}>移动分类</div>
              <Divider style={{ margin: '8px 0' }} />
              <div onClick={() => { this.handleEditName( item ) }}>重命名</div>
              <Divider style={{ margin: '8px 0' }} />
              <div onClick={() => { this.onBatchDelete( item.id ) }}>删除</div>
            </div>
          }
        >
          <Icon type="ellipsis" className={styles.icon} hidden={!showIcon} />
        </Popover>
        <Popover
          trigger="click"
          content={
            <div className={styles.menuList}>
              <div onClick={() => { this.openAuditModal( item.id ) }}>审核素材</div>
              <Divider style={{ margin: '8px 0' }} />
              <div onClick={() => { this.handleEditName( item ) }}>重命名</div>
            </div>
          }
        >
          <Icon type="ellipsis" className={styles.icon} hidden={libraryType !== 'audit'} />
        </Popover>
      </div>
    )
  }

  // 图片项
  renderImgItem = ( item = {} ) => {
    const { selectImgArr, selectMenu, mediaType, libraryType } = this.state
    if ( item.material && libraryType === 'audit' ) { item = item.material }
    if ( mediaType !== item?.mediaType ) return null
    return (
      <div key={item.id} className={styles.list_item_box}>
        <div
          className={`${styles.list_item} ${mediaType === 'AUDIO' ? styles.list_item_audio : ''} ${mediaType === 'VIDEO' ? styles.list_item_video : ''}`}
          style={{ position: 'relative' }}
        >
          <div className={`${styles.selectShow} ${item.id === selectMenu || selectImgArr.indexOf( item.id ) > -1 ? styles.hoverMenu : ''} ${mediaType === 'AUDIO' ? styles.audioSelectShow : ''} ${mediaType === 'VIDEO' ? styles.videoSelectShow : ''}`}>
            <div onClick={() => this.handleSelect( item.id )} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <Checkbox style={{ margin: '10px', width: 32, height: 32 }} checked={selectImgArr.indexOf( item.id ) > -1} onClick={() => this.handleSelect( item.id )} />
            {this.renderIconMenu( item )}
          </div>
          {this.renderMediaType( item )}
          {mediaType === 'IMAGE' && libraryType !== 'public' && <div className={styles.img_status}><img src={item.eqxiuId ? isOnline : isLocal} alt={item.name} /><div>{item.eqxiuId ? '在线' : '本地'}</div></div>}
          {/* <img src={item.url} alt="" style={{ width: '80%', maxHeight: '90%',  objectFit: 'contain' }} /> */}
        </div>
        <div className={styles.list_item_name} style={{ width: mediaType === 'IMAGE' ? '' : 340 }}>{item.name}</div>
      </div>
    )
  }

  renderMediaType = ( item ) => { // 根据不同的类型渲染组件
    const { mediaType } = this.state;
    if ( mediaType !== item?.mediaType ) return null
    let element = '';
    switch ( mediaType ) {
      case 'IMAGE':
        element = <img src={item.url} alt="" style={{ width: '80%', maxHeight: '90%', objectFit: 'contain' }} />
        break;
      case 'AUDIO':
        element = (
          <div className={styles.audioBox}>
            <audio
              controls
            >
              <source src={item.url} type="audio/mpeg" />
              您的浏览器不支持 音频播放 元素。
            </audio>
          </div>
        )
        break;
      case 'VIDEO':
        element = (
          <div className={styles.videoBox}>
            <video
              controls
              className={styles.video}
            >
              <source src={item.url} type="video/mp4" />
            </video>
          </div>
        )
        break;
      default:
        break;
    }
    return element
  }

  // 渲染新建图片弹框
  renderCreateMaterial = () => {
    return (
      <div key='createMaterial' className={styles.list_item_box}>
        <div
          className={styles.list_item}
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => { this.openSizeModal() }}
        >
          <Icon type="plus-circle" style={{ fontSize: 80, color: '#1F3883' }} />
        </div>
        <div className={styles.list_item_name}>新建图片</div>
      </div>
    )
  }

  // 图片类型
  renderImgBox = () => {
    const { selectImgArr, pageNum, pageSize, chooseItem, mediaType, searchValue, libraryType, hasPermission } = this.state
    const { categoryMap: { list, total }, loading } = this.props
    let listView = (
      <div style={{ width: '100%' }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      </div>
    )
    let isShow = false
    if ( list && list.length > 0 ) {
      isShow = true
      listView = list.map( item => {
        return ( this.renderImgItem( item ) )
      } )
    }
    return (
      <Spin spinning={loading}>
        <div>
          <div className={styles.list_top_bar}>
            {isShow &&
              <div className={styles.btnGroup} style={{ display: hasPermission || libraryType === 'private' ? '' : 'none' }}>
                <Checkbox
                  onChange={this.onCheckAllImg}
                  checked={list && list.length && selectImgArr.length === list.length}
                >
                  全选
                </Checkbox>
                {
                  libraryType === 'audit' ?
                    <Button type="primary" style={{ marginLeft: 16 }} onClick={() => { this.openAuditModal() }}>批量审核</Button>
                    :
                    <>
                      <Button type="primary" style={{ marginLeft: 16 }} onClick={() => { this.onMoveCategroy() }}>批量移动</Button>
                      <Button type="primary" style={{ marginLeft: 16 }} onClick={() => { this.onBatchDelete() }}>批量删除</Button>
                    </>
                }
              </div>
            }
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Input
                  style={{ width: 150 }}
                  placeholder="请输入素材名称"
                  value={searchValue}
                  allowClear
                  onChange={this.changeSearchValue}
                />
                <Button style={{ margin: '0 20px' }} type="primary" onClick={this.onSearch}>搜索</Button>
              </div>
              {
                ( libraryType === 'private' || ( libraryType === 'public' && hasPermission ) ) &&
                <>
                  <div style={{ marginRight: 20, fontSize: '12px' }}>
                    {mediaType === 'IMAGE' && '支持上传jpg、jpeg、png和gif格式'}
                    {mediaType === 'AUDIO' && '仅支持上传mp3格式'}
                    {mediaType === 'VIDEO' && '仅支持上传mp4格式'}
                  </div>
                  {
                    mediaType === 'IMAGE' ?
                      <UploadImgBtn
                        onChange={this.uploadImg}
                        categoryId={chooseItem}
                        libraryType={libraryType}
                      /> :
                      <UploadFile
                        categoryId={chooseItem}
                        ChangeFunc={this.uploadFile}
                        accept={mediaType === 'AUDIO' ? 'audio/mp3' : 'video/mp4'}
                        libraryType={libraryType}
                      />
                  }
                  {mediaType === 'IMAGE' && <Button type="primary" style={{ marginTop: '-5px' }} onClick={() => { this.onBatchUpload() }}>批量上传</Button>}
                </>
              }
            </div>
          </div>
          <div className={styles.img_list_box}>
            {/* {mediaType === 'IMAGE' && libraryType !== 'public' && libraryType !== 'audit' && this.renderCreateMaterial()} */}
            {listView}
          </div>
          {isShow &&
            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <Pagination
                total={total}
                pageSize={pageSize}
                current={pageNum}
                showTotal={() => {
                  return `共 ${total} 条`;
                }}
                onChange={this.paginationChange}
              />
            </div>
          }
        </div>
      </Spin>
    )
  }

  uploadFile = () => {
    // TODO: 音视频上传回调，暂时
    this.getMaterialList();
  }

  render() {
    const { mediaType, libraryType, manageVisible, editClassList, iframeUrl, iframeVisible, hasPermission } = this.state;
    const { loading } = this.props;
    return (
      <GridContent>
        <Card
          bordered={false}
          title='素材库'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Tabs size='large' onChange={this.changeLibrary}>
            {
              LIBRARYS.map( i => {
                if ( !hasPermission && i.key === 'audit' ) return null
                return ( <TabPane tab={i.name} key={i.key} /> )
              } )
            }
          </Tabs>
          <Tabs activeKey={mediaType} onChange={this.changeType}>
            {
              TYPELIST.map( item => (
                <TabPane tab={item.name} key={item.key}>
                  {this.renderClassType()}
                  {this.renderImgBox()}
                </TabPane>
              ) )
            }
          </Tabs>
        </Card>
        <ClassTypeManage
          manageVisible={manageVisible}
          handleCancel={this.closeEditModal}
          getClassList={this.getClassList}
          editClassList={editClassList}
          mediaType={mediaType}
          libraryType={libraryType}
        />
        <Drawer
          placement="right"
          closable={false}
          maskClosable={false}
          onClose={this.onCloseIframe}
          visible={iframeVisible}
          width="90%"
        >
          <Spin spinning={loading}>
            <div>
              <Iframe
                iframeUrl={iframeUrl}
                getEQXiuOpus={this.getEQXiuOpus}
              />
            </div>
          </Spin>
        </Drawer>
        <SizeModal
          createNewMaterial={( width, height, name ) => this.createNewMaterial( width, height, name )}
          visible={this.state.sizeModalVisible}
          closeSizeModal={this.closeSizeModal}
        />
        {this.renderMoveTypeModal()}
        {this.renderEditNameModal()}
        {this.batchUploadImg()}
        {this.renderAuditModal()}
      </GridContent>
    );
  };
}

export default MaterialLibraryCopy;
