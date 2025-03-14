import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Table, Input, Icon, Pagination, Modal, Select, Radio, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import UploadImg from '@/components/UploadImg';
import { formatMessage } from 'umi/locale';
import { log } from 'lodash-decorators/utils';
import router from 'umi/router';
import NoAccess from '../noAccess'
import PosterForm from './PosterForm.com';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

// TODO:多余部分
const orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name: '总公司' },
  BRANCH_FIRST: { key: 'branchFirst', name: '一级分公司' },
}

// TODO:后端类型暂未确认
const tabList = [
  { name: '海报', key: 'ranking' },
  { name: '分类', key: 'liveness' },
]

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  myOrgs: exhibition.myOrgs,
  posterData: exhibition.posterData,
  posterTypeData:exhibition.posterTypeData,
  posterTypeAllList:exhibition.posterTypeAllList,
} ) )
@Form.create()
class PosterMange extends PureComponent {
  posterForm

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };

  constructor( props ) {
    super( props );
    this.state = {
      myOrgs: props.myOrgs,
      pageNum: 1,
      pageSize: 10,
      sortedInfo: null,
      
      // 新增部分
      activeTab: 'ranking',
      isOpenContent:false,
      posterStatueList:[
        { label: "上架", value: "true" },
        { label: "下架", value: "false" }
      ],
      visible:false,
      isNewPosterType:true,
      editPosterType:{},
      checkTypeId:"",
      previewVisible: false,
      previewImage: '',
      isPosterVisible:false,
      fileLists: new Array( 7 ).fill( null ),
    }
  }

  componentDidMount() {
    this.fetchList();
    this.fetchPosterList();
    this.fetchPosterAlltype();
  }

  // -------方法
  onSwitchOpenStatus = ( e ) =>{
    const { isOpenContent } = this.state;
    e.stopPropagation();
    this.setState( { isOpenContent: !isOpenContent } )
  }

  // 分类添加
  onShowAddModal = ( isNewPosterType ) =>{
    const { form: { resetFields } } = this.props;
    resetFields();
    if( isNewPosterType ){
      this.setState( { editPosterType:{} } );
    }
    this.setState( { visible:true, isNewPosterType } );
  }

  // 海报添加
  onShowAddPosterModal = () =>{
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState( { isPosterVisible:true, fileLists:[] } );
  }



  onCancelModal= () => {
    this.setState( { visible:false, isPosterVisible:false } );
  }

  onOkModal = () => {
    const { form } = this.props;
    const { isNewPosterType } = this.state;
    form.validateFields( ['name', 'sequence', 'isSale'], ( err, fieldsValue ) => {
      if ( err ){
        return;
      }
      const searchValues = form.getFieldsValue( ['name', 'sequence', 'isSale'] );
      isNewPosterType ? this.onAddPosterType( searchValues ) : this.onEditPosterType( searchValues );
      this.onCancelModal();
    } );
  }

  onPosterOkModal = () =>{
    const { form, dispatch } = this.props;
    const { fileLists } = this.state;
    form.validateFields( ['url', 'typeId', 'title'], ( err, fieldsValue ) => {
      if ( err ){
        return;
      }
        const newPosterInfo = form.getFieldsValue( ['title', 'url', 'typeId'] );
        newPosterInfo.isSale = true;
        newPosterInfo.url = fileLists && fileLists[0] && fileLists[0].url ? fileLists[0].url :""
        dispatch( {
          type: 'exhibition/addPoster',
          payload: {
            ...newPosterInfo,
          },
          callFunc:()=>{
            this.fetchPosterList();
            message.success( '创建成功！' );
          }
        } );
        this.onCancelModal()
    } );

  }

  onAddPosterType = ( searchValues ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/addPosterType',
      payload: {
        ...searchValues,
      },
      callFunc:()=>{
        this.fetchList();
        this.fetchPosterAlltype();
      }
    } );
  }

  onEditPosterType = ( searchValues ) => {
    const { dispatch } = this.props;
    const { editPosterType = {} } = this.state;
    const { id, manager } = editPosterType;
    dispatch( {
      type: 'exhibition/editPosterType',
      payload: {
        id, 
        manager,
        ...searchValues,
      },
      callFunc:()=>{
        this.fetchList();
        this.fetchPosterAlltype();
      }
    } );
  }

  // 获取分类列表
  fetchList = ( params ) => {
    const { pageSize, pageNum, sortedInfo } = this.state;
    const { dispatch, form } = this.props;
    const values = this.posterForm.getValues();
    let sortOrderBy = "create_time desc";
    const defaultOrderBy = "sequence desc";
    if( sortedInfo ){
      let sortValue;

      if( sortedInfo.order ){
        sortValue = sortedInfo.order === 'descend' ? 'desc' : 'asc';
      }else{
        sortValue = 'desc'
      }

      let { columnKey } = sortedInfo
      if( sortedInfo.columnKey === "createTime" ){
        columnKey = 'create_time'
      }
      sortOrderBy = columnKey ? `${ columnKey || '' } ${ sortValue }`: '';
    }
    dispatch( {
      type: 'exhibition/getPosterTypeList',
      payload: {
        pageNum,
        pageSize,
        orderBy:`${defaultOrderBy},${sortOrderBy}`,
        ...values,
        ...params,
      },
    } );
  }


  // 获取所有分类类表
  fetchPosterAlltype = () =>{
    const { pageSize, pageNum } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getPosterTypeAllList',
      payload: {
        orderBy: "sequence desc",
        includeAll:true,
      },
    } );

  }

 // 获取海报列表
 fetchPosterList = ( params ) => {
  const { pageSize, pageNum, checkTypeId } = this.state;
  const { dispatch, form } = this.props;
  const values = this.posterForm.getValues();
      dispatch( {
        type: 'exhibition/getPosterList',
        payload: {
          pageNum,
          pageSize,
          orderBy: "create_time desc",
          typeId:checkTypeId,
          ...values,
          ...params,
        },
    } )
  }

  onEditPoste = ( e, editPosterType ) =>{
    e.stopPropagation();
    this.setState( { editPosterType } )
    this.onShowAddModal( false );
  }

  // 删除海报分类
  onDelPoste = ( e, item ) =>{
    const { dispatch } = this.props;
    const $this = this;
    e.stopPropagation();
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `确定删除：${item.name}`,
      onOk() {
       dispatch( {
          type: 'exhibition/delPosterType',
          payload: {
            id:item.id,
          },
          callFunc:()=>{
            $this.fetchList();
            $this.fetchPosterAlltype();
          }
        } );
      },
      onCancel() {
       console.log( "onDelPoste" );
      },
    } );
  }

  // 删除海报
  onDelPosterType = ( e, item ) =>{
    const { dispatch } = this.props;
    const $this = this;
    e.stopPropagation();
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `确定删除：${item.title}`,
      onOk() {
       dispatch( {
        type: 'exhibition/delPoster',
        payload: {
          id:item.id,
        },
        callFunc:()=>{
          $this.fetchPosterList();
        }
      } );
      },
      onCancel() {
       console.log( "onDelPosterType" );
      },
    } );
  }

   // 编辑海报
   editPoster = ( e, item ) =>{
    const { dispatch } = this.props;
    e.stopPropagation();
    const $this = this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `是否${item.isSale ? "下架":"上架"}海报`,
      onOk() {
        dispatch( {
          type: 'exhibition/editPoster',
          payload: {
            id:item.id,
            isSale:!item.isSale,
            url:item.url,
            title:item.title,
            typeId:item.typeId,
          },
          callFunc:()=>{
            $this.fetchPosterList();
          }
        } );
        
      },
      onCancel() {
       console.log( "onDelPosterType" );
      },
    } );
    
   
  }

  // Tab求换
  changeTab = ( tab ) => {
    this.setState( { activeTab: tab.key }, () => {
      this.searchReset();
    } )
  }

  // 
  handleSubmit = ( e ) =>{
    e.stopPropagation();
  }



  // 清空
  searchReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.posterForm.formReset();
    this.onSearchFormContent();
  }

  // 页码切换，排序切换
  tableChange = ( pagination, filters, sorter ) => {
    const { activeTab } = this.state;
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }

    this.setState( { sortedInfo: sotrObj }, () => {
      this.fetchList( { pageNum: current, pageSize } );
    } );
  }

  //  海报翻页
  tablePorseChange = ( pagination, filters ) => {
    this.fetchPosterList( { pageNum: pagination, pageSize:filters } );
  }

  onShowSizeChange = ( current, size ) =>{
    this.setState( { pageSize:size, pageNum:current } );
    this.fetchPosterList( { pageSize:size, pageNum:current } );
  }

  // 切换海报标签
  onCheckTab = ( typeId ) =>{
    this.setState( { checkTypeId: typeId }, () => {
      this.fetchPosterList( { typeId } );
    } );
  }

  // 添加海报
  onAddPoster = () =>{
    router.push( "/routine/exhibition/posterUpload" );
  }

  // 页面搜索
  onSearchFormContent = () =>{
    const { activeTab } = this.state;
    activeTab === "ranking" ? this.fetchPosterList() : this.fetchList();
  }

     // 打开图片预览
     PreviewFunc = ( file ) => {
      this.setState( {
        previewImage: file.url,
        previewVisible: true,
      } );
    }
  
    // 关闭图片预览
    CancelFunc = () => this.setState( { previewVisible: false } );
  
    // 上传图片
    ChangeFunc = ( res, key ) => {
      const { fileLists, imagesSrc } = this.state;
      fileLists[key] = res;
      this.setState( { fileLists: new Array( ...fileLists ) } );
      if ( key === 0 ) {
        this.setState( { coverSrc: res.url } );
      } else {
        const imagesArr = imagesSrc.split( ',' );
        imagesArr[key-1] = res.url;
        
        this.setState( { imagesSrc: imagesArr.join( ',' ) } );
      }
    }
  
    // 删除上传的图片
    RemoveFunc = ( res, key ) => {
      const { fileLists, imagesSrc } = this.state;
      fileLists[key] = null;
      this.setState( { fileLists: new Array( ...fileLists ) } );
      if ( key === 0 ) {
        this.setState( { coverSrc: '' } );
      } else {
        let imagesArr = imagesSrc.split( ',' );
        imagesArr[key - 1] = '';
        imagesArr = imagesArr.filter( item => { return item } )
        this.setState( { imagesSrc: imagesArr.join( ',' ) } );
      }
    }

  // -------页面
  renderFormContent = () => {
    const { activeTab } = this.state;
  
    return <div className={styles.poster_form_content}>
      <div className={styles.poster_form_flex}>
        <PosterForm tabName={activeTab} onRef={div => { this.posterForm = div }} />
        <Form onSubmit={this.filterSubmit} layout="inline" style={{ marginLeft: '30px' }}>
          <div>
            <Button
              type="primary"
              style={{ marginLeft: 15, marginRight: 15, marginTop: 4 }}
              onClick={() => { this.onSearchFormContent() }}
            >
              搜索
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 4 }}
              onClick={this.searchReset}
            >
              清空
            </Button>
          </div>
        </Form>
      </div>
      <Tabs activeTab={activeTab} changeTab={this.changeTab} />
    </div>
  }

  // 分类列表
  renderTable = () =>{
    const { activeTab } = this.state;
    const { posterTypeData: { list, pageSize, total, pageNum = 1 }, loading, form: { getFieldDecorator }, posterTypeAllList } = this.props;
    const sortedInfo = this.state.sortedInfo || {}
    
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };
    if( activeTab === "ranking" ){
      return;
    } 
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '排序',
        dataIndex: 'sequence',
        key: 'sequence',
        align: 'center',
        // sorter: (a, b) => a.sequence - b.sequence,
        // sortOrder: sortedInfo.columnKey === 'sequence' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: ( views, item ) => <span>{item.sequence}</span>
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        sorter: ( a, b ) => moment( a.createTime ) - moment( b.createTime ),
        sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: logins => <span>{logins}</span>
      },
      {
        title: '发布人',
        dataIndex: 'manager',
        key: 'manager',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'isSale',
        key: 'isSale',
        align: 'center',
        render: isSale =><span>{isSale ? "上架":"下架"}</span>
      },
      {
        title: '操作',
        dataIndex: 'favorites',
        key: 'favorites',
        align: 'center',
        render: ( record, item ) => {
          return <div>
            <span className={styles.poster_edit_btn} onClick={( e ) => this.onEditPoste( e, item )}>
              编辑
            </span>
            <span className={styles.poster_del_btn} onClick={( e ) => this.onDelPoste( e, item )}>
              删除
            </span>
          </div>
        }
      },
    ];
    
    return <div className={styles.poster_table}>
      <Button
        type="dashed"
        style={{ width: '100%', marginBottom: 8, color:"#bfbfbf" }}
        icon="plus"
        onClick={() => this.onShowAddModal( true )}
      >
        {formatMessage( { id: 'form.add' } )}
      </Button>
      <Table
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={paginationProps}
        onChange={this.tableChange}
      />

    </div>
  }

  // 海报列表
  renderPosterTable = () =>{
    const { activeTab, isOpenContent, checkTypeId } = this.state;
    const { posterData: { list = [], pageSize, total, pageNum = 1 }, loading, posterTypeAllList=[] } = this.props;
    if( activeTab === "liveness" ){
      return;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total:posterTypeAllList.length,
      current: pageNum,
      onChange:this.tableChange
    };
    const checkAllItem = checkTypeId=== "" ? styles.poster_item_content_check : styles.poster_item_content
    
    return <div>
      {/* 海报标签 */}
      <div className={isOpenContent? styles.poster_mange_show : styles.poster_mange_hidden}>
        <div className={checkAllItem} onClick={()=>{this.onCheckTab( "" )}}>全部</div>
        <div className={styles.poster_item}>
          {( posterTypeAllList || [] ).map( ( item, index )=>{
            const checkItem =  checkTypeId === item.id ? styles.poster_item_content_check : styles.poster_item_content
            return <div onClick={()=>{this.onCheckTab( item.id )}} className={checkItem} key={item.id}>{item.name}</div>
          } )}
        </div>
        {/* 当长度超过九个时候，则现在展开收起按钮 */}
        {posterTypeAllList.length > 9 && 
        <div className={styles.poster_title} onClick={( e )=>{this.onSwitchOpenStatus( e )}}>
          {isOpenContent ? "收起":"查看"}<Icon style={{ color:"#78a8dc" }} type="down" />
        </div>}
      </div>
      {/* 海报展示 */}
      <div className={styles.poster_show}>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8, color:"#bfbfbf" }}
          icon="plus"
          onClick={() => this.onShowAddPosterModal()}
        >
          {formatMessage( { id: 'form.add' } )}
        </Button>
        <div className={styles.poster_exhibition}>
          {/* <div className={styles.poster_exhibition_addItem} onClick={()=>{this.onAddPoster()}}>
              <Icon style={{fontSize:"50px",color:"#c0c0c0",cursor:"pointer"}} type="plus-square" />
          </div> */}
          {list.map( item=>{
            const opaValue = item.isSale ? 1 : 0.5;
            const bColorConfig = !item.isSale ? null :"rgba(125, 117, 116, 0.2)";
            return  <div style={{ width:"20%" }}>
              <div className={styles.poster_exhibition_showImg} key={item.id}>
                <div className={styles.maskingBox} style={{ opacity:opaValue, backgroundColor:bColorConfig }}>
                  <div className={styles.buttomBox} style={{}}>
                    <div onClick={( e )=>{this.editPoster( e, item )}}>{item.isSale ? "下架":"上架"}</div>
                    <div onClick={( e )=>{this.onDelPosterType( e, item )}}>删除</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                  <img src={item.url} alt="" />
                </div>
              </div>
              <div style={{ textAlign:"center" }}>{item.title}</div>
            </div>
          } )}
        </div>
        
        {/* 翻页部分 */}
        <div className={styles.poster_pagination}>
          <Pagination  
            showSizeChanger
            showQuickJumper
            pageSize={this.state.pageSize}
            total={total}
            current={pageNum}
            onChange={this.tablePorseChange}
            onShowSizeChange={this.onShowSizeChange}
          />
        </div>
      </div>
    </div>
  }

  // 分类添加弹出框
  renderAddModal = () =>{
    const { visible, posterStatueList, isNewPosterType, editPosterType } = this.state
    const { loading, form: { getFieldDecorator, resetFields } } = this.props;
    return <Modal
      maskClosable={false}
      title={isNewPosterType ? "添加" : "编辑"}
      className={styles.standardListForm}
      width={500}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      onCancel={this.onCancelModal}
      onOk={this.onOkModal}
    >
      <Form>
        <FormItem label='名称' {...this.formLayout}>
          {getFieldDecorator( 'name', {
            rules: [{ required: true, message: "请输入名称" }],
            initialValue: editPosterType.name || '',
          } )( <Input placeholder="请输入名称" /> )}
        </FormItem>
        <FormItem label='排序值' {...this.formLayout}>
          {getFieldDecorator( 'sequence', {
            rules: [{ required: true, message: "请输入排序值" }],
            initialValue: editPosterType.sequence || '',
          } )( <Input placeholder="请输入排序值" /> )}
        </FormItem>
        <FormItem label='状态' {...this.formLayout}>
          {getFieldDecorator( 'isSale', {
            rules: [{ required: true, message: "请选择状态" }],
            initialValue: editPosterType.isSale === undefined ? 'true' : editPosterType.isSale.toString()
          } )(
            <Radio.Group placeholder="状态">
              { 
                posterStatueList && posterStatueList.map( item => 
                  <Radio key={item.label} value={item.value}>{item.label}</Radio>
                )
              }
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    </Modal>
  }

  // 海报添加弹出框
  renderAddPosterModal = ()=>{
    const { isPosterVisible, previewVisible, previewImage, fileLists } = this.state
    const { loading, form: { getFieldDecorator, resetFields, getFieldValue }, posterTypeAllList } = this.props;
    const titleLength = ( getFieldValue( 'title' ) || "" ).split( "" ).length;
    return <Modal
      maskClosable={false}
      title="添加海报"
      className={styles.standardListForm}
      width={500}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={isPosterVisible}
      onCancel={this.onCancelModal}
      onOk={this.onPosterOkModal}
    >
      <Form onSubmit={this.onAddPosterSubmit}>
        <FormItem label="添加图片" {...this.formLayout}>
          {getFieldDecorator( 'url', {
                initialValue: "",
                rules: [{ required:true, message:"图片不能为空" }],
               } )(
                 <div className={styles.UploadLogoBox}>
                   <UploadImg
                     className={styles.UploadLogo}
                     previewVisible={previewVisible}
                     previewImage={previewImage}
                     fileList={fileLists[0] ? [{ ...fileLists[0] }] : []}
                     CancelFunc={this.CancelFunc}
                     PreviewFunc={this.PreviewFunc}
                     ChangeFunc={e => this.ChangeFunc( e, 0 )}
                     RemoveFunc={e => this.RemoveFunc( e, 0 )}
                   />
                 </div>
              )}
        </FormItem>
        <FormItem label="标题" {...this.formLayout}>
          {getFieldDecorator( 'title', {
            initialValue:"",
            rules: [{ required:true, max:10, message:"标题不能为空且最大长度为10" }],
          } )(
            <Input style={{ width:300 }} suffix={<span>{titleLength}/10</span>} />
          )}
        </FormItem>
        <FormItem label='分类' {...this.formLayout}>
          {getFieldDecorator( 'typeId', {
            initialValue: "",
            rules: [{ required:true, message:"分类不能为空" }],
          } )(
            <Select style={{ width:300 }} placeholder="选择分类">
              {
                posterTypeAllList.map( item=>{
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                } )
              }
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  }
 
    

  render() {
    return (
      <div>
        <GridContent>
          {/* 顶部form部分 */}
          {this.renderFormContent()}
          {/* tab部分 海报 */}
          {this.renderPosterTable()}
          {/* tab部分 分类 */}
          {this.renderTable()}
          {/* 添加弹出框 */}
          {this.renderAddModal()}
          {/* 海报添加弹出 */}
          {this.renderAddPosterModal()}
        </GridContent>
      </div>
    );
  }
}

export default PosterMange;

const Tabs = ( { activeTab, changeTab } ) => {
  return (
    <div className={styles.user_data_tabs_box}>
      {
        tabList.map( item =>
          <div
            onClick={() => { changeTab( item ) }}
            className={`${styles.user_tabs_item} ${activeTab === item.key ? styles.user_tabs_item_active : ''}`}
            key={item.key}
          >{item.name}
          </div>
        )
      }
    </div>
  )
}
