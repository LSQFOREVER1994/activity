/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { PureComponent } from 'react';
import cookies from 'js-cookie';
import { Modal, Icon, message, Spin, Empty, Pagination, Input, Button, Tabs } from 'antd';
import reqwest from 'reqwest';
import serviceObj from '@/services/serviceObj';
import UploadImgBtn from '../UploadImgBtn'
import UploadFile from '../UploadFile'
import styles from './uploadModal.less';

const { TabPane } = Tabs;
//  图片上传
//  onChange  ->  上传图片改变
//  value  ->  值
class UploadModal extends PureComponent {
  constructor( props ) {
    let chooseImg = {}
    let showImg = false
    if ( props.value ) {
      showImg = true
      chooseImg = { url: props.value }
    }
    super( props );
    this.state = {
      categoryId: '',
      loading: false, // 图片转圈
      classList: [], // 素材分类
      materialMap: {
        list: [],
        total: 0
      },
      uploadMoadlVisible: false, // 上传弹框
      pageSize: 15, // 素材页条数
      pageNum: 1, // 素材页页吗
      chooseImg, // 选中的图片
      showImg, // 是否展示图片
      previewVisible: false, // 预览

      previewImg: '', //
      previewModalVisible: false,
      currentTab: 'private',
    };
  }


  componentWillMount() { }



  componentWillReceiveProps( nextProps ) {
    if ( this.props.value !== nextProps.value ) {
      let chooseImg = {}
      let showImg = false
      if ( nextProps.value ) {
        chooseImg = { url: nextProps.value }
        showImg = true
      }
      this.setState( {
        chooseImg,
        showImg
      } )
    }
  }

  // 获取图片素材所有类型
  getClassList = () => {
    const { mediaType = 'IMAGE' } = this.props
    const { currentTab } = this.state;
    const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
    const tokenObj = token ? { 'baggage_context.x-auth-token': token } : {};
    let reqwestUrl = `${serviceObj.libraryService}/material/category/mine`
    if( currentTab === 'public' ){
        reqwestUrl = `${serviceObj.libraryService}/material/category`
    }
    reqwest( {
      url: reqwestUrl,
      method: 'POST',
      processData: false,
      headers: Object.assign( {
        Accept: 'application/json',
        ...tokenObj,
        // 'x-gateway-host': '7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com',
        'Content-Type': 'application/json',
      }, tokenObj ),
      data:JSON.stringify( { mediaType } ),
      success: ( res ) => {
        const arr = res.result || []
        const allType = {
          id: '',
          mediaType,
          name: "全部",
          noEdit: true
        }
        const defaultType = {
          id: 'default',
          mediaType,
          name: "未分组",
          noEdit: true
        }
        const newArr = [allType, ...arr, defaultType]
        this.setState( {
          classList: newArr
        } )
      },
      error: () => {
        message.error( "获取素材分类失败" );
      },
    } );
  }

  // 获取获取图片素材列表
  getMaterialList = () => {
    const { mediaType = 'IMAGE' } = this.props
    this.setState( {
      loading: true,
      pageSize: mediaType !== 'IMAGE' ? 10 : 15
    }, () => {
      const { categoryId, pageNum, pageSize, searchValue, currentTab } = this.state;
      const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
      const tokenObj = token ? { 'baggage_context.x-auth-token': token } : {};
      let reqwestUrl = `${serviceObj.libraryService}/material/mine`
      if ( currentTab === 'public' ) reqwestUrl = `${serviceObj.libraryService}/material`
      const query = { mediaType, page:{} }
      if ( pageNum ) query.page.pageNum = pageNum
      if ( pageSize ) query.page.pageSize = pageSize
      if ( categoryId ) query.categoryId = categoryId
      if ( searchValue ) query.name = searchValue

      reqwest( {
        url: reqwestUrl,
        method: 'POST',
        headers: Object.assign( {
          Accept: 'application/json',
          ...tokenObj,
          // 'x-gateway-host': '7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com',
          'Content-Type': 'application/json',
        }, tokenObj ),
        data:JSON.stringify( query ),
        success: ( res ) => {
          if ( res && res.success ) {
            this.setState( {
              materialMap: res.result
            } )
          }
          this.setState( {
            loading: false
          } )
        },
        error: () => {
          this.setState( {
            loading: false
          } )
          message.error( "获取素材列表失败" );
        },
      } );
    } )
  }

  // 切换选项卡
  changeTabs = ( e ) => {
    this.setState( {
      categoryId:'',
      currentTab: e,
      pageNum: 1
    }, () => {
      if ( e === 'link' ) return
      this.getClassList()
      this.getMaterialList()
    } )
  }

  // 打开列表弹窗
  openUploadModal = () => {
    this.getClassList()
    this.getMaterialList()
    this.setState( {
      uploadMoadlVisible: true
    } )
  }

  // 关闭列表弹窗
  closeUploadModal = () => {
    this.setState( {
      pageNum: 1,
      uploadMoadlVisible: false
    } )
  }

  // 关闭弹框
  handleOk = ( item ) => {
    if ( item ) {
      this.setState( {
        chooseImg: item
      }, () => {
        this.onDataProcessing()
      } )
    } else {
      this.onDataProcessing()
    }
  }

  // 数据处理
  onDataProcessing = () => {
    const { onChange, mediaType } = this.props
    const { chooseImg } = this.state;
    const { url } = chooseImg;
    if ( mediaType === 'AUDIO' && url.substring( url.length - 3 ) !== 'mp3' ) {
      message.warning( '请输入mp3格式的链接' );
      return
    }
    // if ( mediaType === 'VIDEO' && url.substring( url.length - 3 ) !== 'mp4' ) {
    //   message.warning( '请输入mp4格式的链接' );
    //   return
    // }
    if ( mediaType === 'AUDIO' ) { // 当关闭弹窗时初始化音频
      const audioList = document.getElementsByTagName( 'audio' );
      for ( let i = 0; i < audioList.length; i++ ) {
        audioList[i].pause()
        audioList[i].load()
      }
    }

    if ( chooseImg && chooseImg.url ) {
      this.setState( {
        pageNum: 1,
        showImg: true,
        uploadMoadlVisible: false
      }, () => {
        onChange( chooseImg.url )
      } )
    } else {
      this.setState( {
        pageNum: 1,
        showImg: false,
        uploadMoadlVisible: false,
      }, () => {
        onChange( '' )
      } )
    }
  }

  // 上传回调
  uploadImg = ( e ) => {
    const chooseImg = { url: e }
    this.handleOk( chooseImg )
  }

  // 翻页
  paginationChange = ( page ) => {
    this.setState( {
      pageNum: page,
    }, () => {
      this.getMaterialList();
    } )
  }

  // 选择图片
  onChooseImg = ( item ) => {
    let chooseImg = item
    if ( item.id === this.state.chooseImg.id ) {
      chooseImg = {}
    }
    this.setState( {
      chooseImg
    } )
  }

  // 选择分类
  handleClassItem = ( id ) => {
    if ( id === this.state.categoryId ) return
    this.setState( {
      categoryId: id,
      pageNum: 1,
    }, () => {
      // 刷新列表
      this.getMaterialList()
    } )
  }

  // 图片预览
  onpreview = ( url ) => {
    this.setState( {
      previewImg: url,
      previewModalVisible: true
    } )
  }

  // 关闭预览
  closePreview = () => {
    this.setState( {
      previewImg: '',
      previewModalVisible: false
    } )
  }


  //  素材分类
  renderTypes = () => {
    const { classList, categoryId } = this.state
    let classView
    if ( classList && classList.length > 0 ) {
      classView = classList.map( info => {
        return (
          <div
            onClick={() => { this.handleClassItem( info.id ) }}
            key={info.id}
            className={styles[`${categoryId === info.id ? 'classBox_item_active' : 'classBox_item'}`]}
          >
            {info.name}
          </div>
        )
      } )
    }
    return classView
  }

  renderMaterial = () => {
    const { materialMap, loading, chooseImg } = this.state
    const { mediaType = 'IMAGE' } = this.props;
    const { list } = materialMap
    let listView = (
      <div style={{ width: '100%', marginTop: '120px' }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      </div>
    )
    if ( list && list.length > 0 ) {
      if ( mediaType === 'IMAGE' ) {
        listView = list.map( info => {
          return (
            <div key={info.id} style={{ position: 'relative' }}>
              <div className={styles.list_item_box}>
                <div
                  className={styles.list_item}
                  style={{ position: 'relative' }}
                >
                  <div
                    className={`${styles.selectShow} ${info.id === chooseImg.id ? styles.hoverMenu : ''}`}
                    onClick={() => this.onChooseImg( info )}
                    onDoubleClick={() => this.handleOk( info )}
                  />
                  <img
                    src={info.url}
                    alt=""
                    className={styles.list_item_img}
                  />
                </div>
              </div>
              <Icon type="eye" className={styles.list_item_icon} style={{ color: '#d8b209' }} onClick={() => { this.onpreview( info.url ) }} />
              <div className={styles.list_item_name_img}>{info.name}</div>
            </div>
          )
        } )
      } else if ( mediaType === 'AUDIO' ) {
        listView = list.map( info => {
          return (
            <div>
              <div key={info.id} className={styles.list_item_box}>
                <div
                  className={`${styles.list_item} ${styles.audio_list_item}`}
                  style={{ position: 'relative' }}
                >
                  <div
                    className={`${styles.selectShow} ${info.id === chooseImg.id ? styles.hoverMenu : ''}`}
                    onClick={() => this.onChooseImg( info )}
                    onDoubleClick={() => this.handleOk( info )}
                  />
                  <audio
                    controls
                    style={{ display: 'block' }}
                  >
                    <source src={info.url} type="audio/mpeg" />
                    您的浏览器不支持 音频播放 元素。
                  </audio>
                </div>
              </div>
              <div className={styles.list_item_name_audio}>{info.name}</div>
            </div>
          )
        } )
      } else if ( mediaType === 'VIDEO' ) {
        listView = list.map( info => {
          return (
            <div>
              <div key={info.id} className={styles.list_item_box}>
                <div
                  className={`${styles.list_item} ${styles.video_list_item}`}
                  style={{ position: 'relative' }}
                >
                  <div
                    className={`${styles.selectShow} ${info.id === chooseImg.id ? styles.hoverMenu : ''}`}
                    onClick={() => this.onChooseImg( info )}
                    onDoubleClick={() => this.handleOk( info )}
                  />
                  <div
                    className={styles.videoMask}
                    onClick={() => this.onChooseImg( info )}
                    onDoubleClick={() => this.handleOk( info )}
                  />
                  <video
                    controls
                    style={{ display: 'block' }}
                  >
                    <source src={info.url} type="video/mp4" />
                    您的浏览器不支持 音频播放 元素。
                  </video>
                </div>
              </div>
              <div className={styles.list_item_name_video}>{info.name}</div>
            </div>
          )
        } )
      }
    }
    return (
      <Spin spinning={loading}>
        <div className={styles.img_list_box}>
          {listView}
        </div>
      </Spin>
    )
  }


  // 删除选中图片
  onDeleteChooseImg = () => {
    const { onChange } = this.props
    this.setState( {
      showImg: false,
      chooseImg: {}
    }, () => {
      if ( onChange ) onChange( '' )
    } )
  }

  // 预览选中图片
  onPreviewFunc = () => {
    this.setState( {
      previewVisible: true,
    } );
  }

  // 关闭预览
  onCancelFunc = () => {
    this.setState( {
      previewVisible: false,
    } );
  }

  onSearch = () => {
    this.setState( {
      pageNum: 1,
    }, () => {
      this.getMaterialList()
    } )
  }

  inpputChange = ( e ) => { // 输入框输入
    this.setState( {
      searchValue: e.target.value
    } )
  }

  inputLinkChange = ( e ) => {
    const url = e.target.value;
    const chooseImg = { url };
    this.setState( {
      chooseImg
    } )
  }

  showBtnView = () => {
    const { chooseImg } = this.state;
    const { mediaType, disabled } = this.props
    let ele = (
      <div
        className={styles.img_box}
      >
        <div className={styles.box_show}>
          <div className={styles.box_show_block}>
            <div onClick={this.onPreviewFunc}>
              <Icon type="eye" style={{ fontSize: '20px', color: '#fff' }} />
            </div>
            <div onClick={this.openUploadModal} hidden={disabled} style={{ margin: '0 15px' }}>
              <Icon type="edit" style={{ fontSize: '20px', color: '#fff' }} />
            </div>
            <div onClick={this.onDeleteChooseImg} hidden={disabled}>
              <Icon type="delete" style={{ fontSize: '20px', color: '#fff' }} />
            </div>
          </div>
        </div>
        <img src={chooseImg.url} alt="" />
      </div>
    )
    if ( mediaType === 'AUDIO' ) {
      ele = (
        <div
          className={styles.audio_box}
        >
          <div className={styles.audioBox}>
            <audio
              controls
              style={{ display: 'block' }}
            >
              <source src={chooseImg.url} type="audio/mpeg" />
              您的浏览器不支持 音频播放 元素。
            </audio>
          </div>
          <div onClick={this.onDeleteChooseImg}>
            <Icon type="delete" style={{ fontSize: '20px', color: '#000', marginLeft: 20 }} />
          </div>
        </div>
      )
    } else if ( mediaType === 'VIDEO' ) {
      ele = (
        <div
          className={styles.video_box}
        >
          <div className={styles.videoBox}>
            <video
              controls
              style={{ display: 'block' }}
            >
              <source src={chooseImg.url} type="video/mp4" />
              您的浏览器不支持 音频播放 元素。
            </video>
          </div>
          <div onClick={this.onDeleteChooseImg}>
            <Icon type="delete" style={{ fontSize: '20px', color: '#000', marginLeft: 20 }} />
          </div>
        </div>
      )
    }
    return ele
  }

  render() {
    const {
      uploadMoadlVisible,
      materialMap,
      pageSize,
      pageNum,
      showImg,
      chooseImg,
      previewVisible,
      previewImg,
      previewModalVisible,
      currentTab,
      categoryId,
    } = this.state
    const { list, total } = materialMap
    const { style = {}, className, mediaType = 'IMAGE' } = this.props;
    // 按钮状态
    let btnView = (
      <div
        className={styles.img_box}
        style={{ display: 'flex', flexDirection: 'column' }}
        onClick={this.openUploadModal}
      >
        <Icon type="plus" style={{ fontSize: '24px', fontWeight: 500 }} />
        <div className="ant-upload-text">upload</div>
      </div>
    )
    if ( showImg ) btnView = this.showBtnView()
    return (
      <div className={className} style={{ style }}>
        <div className={styles.upload_box}>{btnView}</div>
        {/* 预览弹框 */}
        <Modal
          key="show_img_modal_preview"
          title="预览"
          visible={previewVisible}
          onCancel={this.onCancelFunc}
          footer={null}
        >
          <div className={styles.preview_img}>
            <img alt="example" style={{ objectFit: 'contain', maxWidth: '80%', maxHeight: '80%' }} src={chooseImg.url} />
          </div>

        </Modal>
        {/* 素材预览弹框 */}
        <Modal
          key="show_img_modal_preview2"
          title="预览"
          visible={previewModalVisible}
          onCancel={this.closePreview}
          footer={null}
        >
          <div className={styles.preview_img}>
            <img alt="example" style={{ objectFit: 'contain', maxWidth: '80%', maxHeight: '80%' }} src={previewImg} />
          </div>

        </Modal>
        {/* 素材列表弹框 */}
        <Modal
          key="show_img_modal_list"
          visible={uploadMoadlVisible}
          onOk={() => this.handleOk()}
          onCancel={this.closeUploadModal}
          maskClosable={false}
          width={mediaType === 'IMAGE' ? 840 : 947}
        >
          <Tabs size='small' onChange={this.changeTabs}>
            <TabPane tab='我的素材' key='private' />
            <TabPane tab='公共素材库' key='public' />
            <TabPane tab='外部链接' key='link' />
          </Tabs>
          {
            currentTab === 'link' && (
              <Input
                value={chooseImg.url}
                maxLength={1000}
                placeholder='请输入外部链接'
                onChange={this.inputLinkChange}
                allowClear
              />
            )}
          {
            currentTab !== 'link' && (
              <div className={styles.modal_box}>
                <div className={styles.modal_box_left}>
                  {this.renderTypes()}
                </div>
                <div className={styles.modal_box_right}>
                  <div className={styles.modal_box_right_btn}>
                    <div style={currentTab === 'private' ? {} : { visibility: "hidden" }}>
                      {
                        mediaType === 'IMAGE' ?
                          <UploadImgBtn
                            categoryId={categoryId}
                            onChange={this.uploadImg}
                          /> :
                          <UploadFile
                            onChange={this.uploadImg}
                            accept={mediaType === 'AUDIO' ? "audio/mp3" : "video/mp4"}
                          />
                      }
                    </div>
                    <div className={styles.modal_right_search_box}>
                      <Input
                        placeholder='请输入素材名称'
                        className={styles.modal_right_search_input}
                        maxLength={100}
                        onChange={this.inpputChange}
                        allowClear
                        onPressEnter={this.onSearch}
                        style={{ marginRight: '20px' }}
                      />
                      <Button type='primary' onClick={this.onSearch}>搜索</Button>
                    </div>

                  </div>
                  <div className={styles.modal_box_right_content}>
                    <div className={styles.modal_box_right_content_list}> {this.renderMaterial()}</div>
                    {( list && list.length > 0 ) &&
                      <div style={{ textAlign: 'right', marginTop: '30px' }}>
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
                </div>
              </div>
            )
          }
        </Modal>
      </div>
    );
  }
}

export default UploadModal;
