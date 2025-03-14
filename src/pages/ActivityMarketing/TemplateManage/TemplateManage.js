import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Input, Modal, message, Empty, Form, Spin, Upload, Button } from 'antd';
import EditTag from './EditTag';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportFunc } from '@/utils/utils';
import styles from './templateManage.less';
import Reviewed from './Reviewed';
import TemplateItem from './TemplateItem';
import SearchBar from '@/components/SearchBar';

const { TabPane } = Tabs;
const FormItem = Form.Item;

// 根据视窗判断展示的个数
const getColSpan = winSize => {
  let colSpan = 6
  if ( winSize > 1920 ) colSpan = 7
  if ( winSize > 1600 && winSize <= 1920 ) colSpan = 6
  if ( winSize > 1280 && winSize <= 1600 ) colSpan = 5
  if ( winSize > 1024 && winSize <= 1280 ) colSpan = 4
  if ( winSize > 800 && winSize <= 1024 ) colSpan = 3
  if ( winSize <= 800 ) colSpan = 2
  return colSpan
}

@connect( ( { template } ) => {
  return {
    loading: template.loading,
    templateMap: template.templateMap,
  };
} )
class MaterialLibraryCopy extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  };

  constructor( props ) {
    const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
    const ownerAutor = authorityList.includes( 'TEMPLATE_AUDIT' );
    super( props );
    this.state = {
      pageSize: 12,
      pageNum: 1,
      editVisible: false,
      editItem: {},
      currentTabKey: 'mine',
      authority: ownerAutor,
      isExPLoading: false,
      uploading: false,
      colSpan: 0,
      templateList: [],
      itemWidth: 0,
      noMore: false,
    };
    this.searchBar = React.createRef()
    const dom = document.body.querySelectorAll( '.ant-layout' )[1]
    this.scrollDom = dom
    this.searchEleList = [
      {
        key: 'name',
        label: '模板名称',
        type: 'Input'
      },
    ]
  }

  componentDidMount() {
    this.listenResize()
    window.addEventListener( 'resize', this.listenResize.bind( this ) );
    this.scrollDom.addEventListener( "scroll", this.onScroll, false );
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.templateMap.pageNum === 1 ) {
      this.setState( {
        noMore: false,
        templateList: nextProps.templateMap.list
      } )
    }
    if ( this.props.templateMap.pageNum < nextProps.templateMap.pageNum ) {
      if ( nextProps.templateMap.list.length === 0 ) {
        message.info( '没有更多了' )
        this.setState( {
          noMore: true
        } )
      }
      const { templateList } = this.state;
      this.setState( {
        templateList: [...templateList, ...nextProps.templateMap.list]
      } )
    } else {
      this.setState( {
        pageNum: nextProps.templateMap.pageNum,
      } )
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.listenResize.bind( this ) );
    this.scrollDom.removeEventListener( "scroll", this.onScroll, false );
  }


  onScroll = () => {
    const { loading } = this.props;
    const { noMore, currentTabKey } = this.state;
    if ( currentTabKey === 'audit' ) return
    if ( loading || noMore ) return
    const { scrollTop, scrollHeight, clientHeight } = this.scrollDom
    if ( scrollHeight - scrollTop - clientHeight <= 30 ) {
      const { pageNum } = this.state;
      this.setState( { pageNum: pageNum + 1 }, () => { this.getTemplateList( this.searchBar.current.data ) } )
    }
  }

  // 监听浏览器窗口改变
  listenResize = () => {
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth; // 获取浏览器宽度
    const colSpan = getColSpan( winSize );
    const cardBox = document.getElementById( 'cardBox' )
    if ( cardBox && cardBox.offsetWidth ) {
      this.setState( {
        itemWidth: cardBox.offsetWidth / colSpan,
        colSpan,
        pageSize: colSpan * 2
      }, ()=> this.getTemplateList() )
    }
  };

  // 导出活动配置
  onExportActivity = ( e, item ) => {
    e.stopPropagation();
    if ( !item || ( item && !item.id ) ) return;
    const { id, name } = item;
    const { isExPLoading } = this.state;
    const ajaxUrl = `activity/template/export/${id}`;
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

  // 转为公共模板
  intoCommonTemplate = ( param ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/intoCommonTemplate',
      payload: {
        query: {
          id: param.id,
        },
        callFunc: () => {
          message.success( '提交成功' );
          this.getTemplateList();
          this.reviewed.getAuditList();
        },
      },
    } );
  }

  // 获取模版列表
  getTemplateList = ( data ) => {
    const { pageNum, pageSize, currentTabKey } = this.state;
    if ( currentTabKey === 'audit' ) return
    const { dispatch } = this.props;
    const currentQueryType = currentTabKey === 'mine' ? 'template/getMineTemplate' : 'template/getActivityTemplate'
    dispatch( {
      type: currentQueryType,
      payload: {
        ...data,
        page:{
          pageNum,
          pageSize,
          orderBy: 'create_time desc',
        },
      },
      callFunc: () => { }
    } );
  };

  // 唤起修改模版弹窗
  handleEditTemplate = item => {
    this.setState( {
      editItem: item,
      editVisible: true,
    } );
  };

  // 编辑模版
  editTemplate = () => {
    const { editItem } = this.state;
    const { name } = editItem;
    if ( !name ) {
      message.error( '请输入模版名称' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/editTemplate',
      payload: {
        ...editItem,
      },
      callFunc: () => {
        message.success( '修改成功！' );
        this.getTemplateList();
        this.onCloseEditModal();
      },
    } );
  };

  delTemplate = param => {
    // 删除模版
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/delTemplate',
      payload: {
        id: param.id,
      },
      callFunc: () => {
        message.success( '删除成功！' );
        this.getTemplateList();
      },
    } );
  };

  // 使用模版跳转
  userTemp = ( item ) => {
    const { id } = item || {};
    const { history } = this.props;
    if ( id ) sessionStorage.setItem( 'tempId', id );
    history.push( `/activityTemplate/bees` );
  };

  // 新增或编辑模版
  editTemp = item => {
    const { id } = item || {};
    const { history } = this.props;
    if ( id ) sessionStorage.setItem( 'editTempId', id );
    sessionStorage.setItem( 'isEditTemp', true );
    history.push( `/activityTemplate/bees` );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
    }, () => this.getTemplateList( data ) )
  };

  // 编辑名称
  editTemplateName = e => {
    const { editItem } = this.state;
    const newEditItem = { ...editItem, name: e.target.value };
    this.setState( {
      editItem: newEditItem,
    } );
  };

  // 编辑标签
  editTemplateTags = newTags => {
    const { editItem } = this.state;
    const newEditItem = { ...editItem, labels: newTags };
    this.setState( {
      editItem: newEditItem,
    } );
  };

  // 关闭编辑弹框
  onCloseEditModal = () => {
    this.setState( {
      editItem: {},
      editVisible: false,
    } );
  };

  addActivityTemp = () => {
    const { history } = this.props;
    sessionStorage.setItem( 'isEditTemp', true );
    history.push( `/activityTemplate/bees` );
  };

  // 切换tab
  onChangeTab = ( e ) => {
    this.setState( { currentTabKey: e, pageNum: 1 }, () => {
      if ( e !== 'audit' ) {
        this.searchBar.current.handleReset()
      }
    } )
  }

  beforeUpload = file => {
    if ( !file ) return;
    const { currentTabKey } = this.state;
    const isCommon = currentTabKey === 'common'
    const { lastModified, name } = file;
    this.setState( { uploading: true } );
    const formData = new FormData();
    if ( lastModified ) {
      formData.append( 'file', file ); // 文件对象
    } else {
      formData.append( 'file', file, name );
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/importTemplate',
      payload: {
        query: {
          file: formData,
          isCommon,
        },
        successFun: res => {
          if ( res ) {
            this.searchBar.current.handleReset()
            message.success( '导入模板成功' );
          }
          this.setState( { uploading: false } );
        },
      },
    } );
  };

  // 编辑模版弹框
  renderEditModal = () => {
    const { editVisible, editItem } = this.state;
    const { name, labels = [] } = editItem;
    return (
      <Modal
        key="show_img_modal_preview"
        title="模版编辑"
        visible={editVisible}
        onCancel={this.onCloseEditModal}
        onOk={() => this.editTemplate()}
      >
        <div>
          <FormItem required style={{ display: 'flex' }} label="模版名称" {...this.formLayout}>
            <Input
              type='text'
              placeholder="请输入名称"
              onChange={this.editTemplateName}
              value={name}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            style={{ display: 'flex', alignItems: 'center' }}
            label="模板标签"
            {...this.formLayout}
          >
            <EditTag tags={labels} changeTags={this.editTemplateTags} />
          </FormItem>
        </div>
      </Modal>
    );
  };

  renderTemplate = () => {
    const { loading } = this.props;
    const { authority, currentTabKey, templateList, itemWidth, colSpan } = this.state;
    const itemSetting = {
      itemWidth,
      authority,
      currentTabKey,
      editTemp: this.editTemp,
      userTemp: this.userTemp,
      delTemplate: this.delTemplate,
      addActivityTemp: this.addActivityTemp,
      onExportActivity: this.onExportActivity,
      handleEditTemplate: this.handleEditTemplate,
      intoCommonTemplate: this.intoCommonTemplate,
    }
    const cardList = [{ isAddCard: true }, ...templateList]
    const cardItem = cardList.map( ( item, index ) => {
      let isLast = index % colSpan === 0
      if ( currentTabKey === "mine" ) { isLast = ( index + 1 ) % colSpan === 0 }
      return <TemplateItem item={item} isLast={isLast} {...itemSetting} key={item.id || 'default'} />
    } )
    return (
      <>
        <div className={styles.templateBox} id='cardBox'>
          {cardItem}
          {
            cardList.length <= 1 &&
            <div className={styles.nullTemplate} style={{ width: currentTabKey === "common" ? "100%" : '' }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            </div>
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: 30 }}><Spin spinning={loading} /></div>
      </>
    )
  }

  renderContent = () => {
    const { currentTabKey, authority, uploading } = this.state;
    const { history } = this.props
    let contentView = (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
          />
          {
            ( currentTabKey !== 'common' || authority ) && (
              <Upload
                fileList={[]}
                beforeUpload={this.beforeUpload}
                disabled={uploading}
                accept=".txt"
                style={{ width: 'auto', height: 'auto', background: 'none', border: 'none' }}
              >
                <Button type="primary" loading={uploading} style={{ marginTop: 30 }}>
                  导入模板
                </Button>
              </Upload>
            )
          }
        </div>
        {this.renderTemplate()}
      </>
    )
    if ( currentTabKey === 'audit' ) {
      contentView = <Reviewed
        wrappedComponentRef={( ref ) => { this.reviewed = ref }}
        history={history}
      />
    }
    return contentView
  }

  render() {
    const { authority } = this.state;
    const { loading } = this.props;
    return (
      <GridContent>
        <Card bordered={false} title="模版管理" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
          <Tabs
            loading={loading}
            onChange={( e ) => this.onChangeTab( e )}
          >
            <TabPane tab="我的模版" key="mine" />
            <TabPane tab="公共模板" key="common" />
            {authority && <TabPane tab="待审核" key="audit" />}
          </Tabs>
          {this.renderContent()}
        </Card>
        {this.renderEditModal()}
      </GridContent>
    );
  }
}

export default MaterialLibraryCopy;
