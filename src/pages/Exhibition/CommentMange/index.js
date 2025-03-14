import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, List, Avatar, Icon, Button, DatePicker, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// const  orgNameObj = {
//   HEAD_COMPANY: { key: 'headCompany', name:'总公司' },
//   BRANCH_FIRST: { key: 'headCompany', name:'一级分公司' },
//   BRANCH_SECOND: { key: 'headCompany', name:'二级分公司' },
//   DEPARTMENT: { key: 'headCompany', name:'营业部' },
// }

const IconText = ( { type, text } ) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  commentData:exhibition.commentData
  // resourceData: exhibition.resourceData,
} ) )
@Form.create()
class Resource extends PureComponent {
  timer = null;

  taskForm = {}

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };

  state = {
    pageNum: 1,
    pageSize: 10,
    searchState:false,
    keyWordStyle:''
  };

  componentDidMount() {
    this.getMyOrys();
  }

  getMyOrys = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getMyOrgs',
      callFunc: ( res ) => {
        this.setState( {
          headAuthority:res.HEAD_COMPANY ? res.HEAD_COMPANY.id : '',
          branchFirstAuthority:res.BRANCH_FIRST ? res.BRANCH_FIRST.id : '',
          branchSecondtAuthority:res.BRANCH_SECOND ? res.BRANCH_SECOND.id : '',
          departmentAuthority:res.DEPARTMENT ? res.DEPARTMENT.id : '',
        }, ()=>this.fetchList( {} ) )
      }
    } )
  }


  //  获取列表
  fetchList = ( data ) => {
    const{ pageNum, pageSize, headAuthority, branchFirstAuthority, branchSecondtAuthority, departmentAuthority, searchState }=this.state;
    const values = searchState ? this.compayForm.getValues() : '';
    const { dispatch } = this.props;
    const params = data;
    const { rangeTime } = params;
    params.start = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD' ):'';
    params.end = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD' ):'';
    delete params.rangeTime
    dispatch( {
      type: 'exhibition/getCommentList',
      payload: {
        pageNum,
        pageSize,
        orderBy: 'create_time desc',
        headCompany:headAuthority,
        branchFirst:branchFirstAuthority,
        branchSecond:branchSecondtAuthority,
        department:departmentAuthority,
        ...values,
        ...params
      },
      callFunc:()=>{
        this.getKeyWord()
      }
    } );
  }

  //  表单筛选提交
  filterSubmit=()=>{
    const{ form }=this.props;
    form.validateFields( ( err, vaule )=>{
      const { searchKeyWord }=vaule;
      this.setState( {
        keyWordStyle:searchKeyWord
      }, ()=>{
        this.fetchList( vaule )
      } )
    } )
  }

  //  表单清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.compayForm && this.compayForm.formReset();
    clearTimeout( this.timer );
    // this.timer=setTimeout( () => {
    this.setState( { keyWordStyle:'' }, ()=>this.fetchList( {} ) )
    // }, 500 );
  }

  // 收缩筛选框
  showSearch=()=>{
    const { searchState } = this.state;
    this.setState( {
      searchState:!searchState
    } )
  }

  // 跳转文章详情
  articleLink=( e, item )=>{
    e.stopPropagation();
    sessionStorage.setItem( 'id', item.id )
    sessionStorage.setItem( 'username', item.investmentAdvisorName )
    this.props.history.push( `/routine/exhibition/detailPages?id=${item.id}&username=${item.investmentAdvisorName}` )
  }

  //  跳转用户详情列表
  getUserList=( e, item )=>{
    e.stopPropagation();
    sessionStorage.setItem( 'userId', item.userId )
    sessionStorage.setItem( 'username', item.investmentAdvisorName )
    this.props.history.push( `/routine/exhibition/userPages?userId=${item.userId}&username=${item.investmentAdvisorName}` )
  }

  //  更新文章状态
  upDataState=( e, item, type )=>{
    e.stopPropagation();
    const{ isPublish }=item;
    const { dispatch }=this.props;
    // const obj = type==='isPublish'?{ isPublish:!isPublish }:{ isStick:!isStick }
    dispatch( {
      type:'exhibition/upDataComment',
      payload:{
        params:{
          ...item,
          // ...obj,
          isPublish:!isPublish
        },
        callFunc:()=>{
          this.fetchList( {} )
        }
      }
    } )
  }

  // 关键字正则匹配方法
  getTag = ( str ) =>{
    const{ keyWordStyle }=this.state;
    if( str ){
      return str.replace( eval( `/${keyWordStyle}/g` ), `<span style="color:#c00">${keyWordStyle}</span>` )
    }
    return ''
  }

  // 搜索页面匹配关键字
  getKeyWord=()=>{
    const{ commentData, commentData:{ list }, dispatch }=this.props;
    const resultList = list.map( item=>( {
      ...item,
      review: this.getTag( item.review ),
      originTitle: this.getTag( item.originTitle ),
      originSummary: this.getTag( item.originSummary )
    } ) )
    dispatch( {
      type:'exhibition/SetState',
      payload:{
        commentData:{
          ...commentData,
          list: [...resultList]
        },
      }
    } )
  }

  //  上下架更新提示
  cancel = ( e, item, type ) => {
    const { isPublish }=item
    Modal.confirm( {
      content:isPublish ? '强制下架此文' : '是否恢复此文',
      okText: '确认',
      icon:<Icon type="question-circle" style={{ color:'#ecb277' }} theme='filled' />,
      cancelText: '取消',
      onOk:() =>{
        this.upDataState( e, item, type )
      },
      onCancel:()=>{
        
      }
    } );
  }


  render() {
    const { pageNum, searchState, pageSize } = this.state;
    const{ loading, commentData:{ list, total }, form: { getFieldDecorator } }= this.props

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      onChange:( page )=>{
        this.setState( {
          pageNum:page
        }, ()=>this.fetchList( {} ) )
      },
      onShowSizeChange:( current, size )=>{
        this.setState( {
          pageSize:size,
          pageNum:current
        }, ()=>this.fetchList( {} ) )
      }
    };

    return (
      <GridContent>
        <div style={{ width:'100%', background:'#fff', padding:'10px 20px 40px 20px' }}>
          <h3 style={{ fontSize:'18px', fontWeight:'bold' }}>点评管理</h3>
          <Form layout="inline" style={{ marginBottom:'20px' }}>
            <FormItem label='关键词' {...this.formLayout}>
              {getFieldDecorator( 'searchKeyWord', {
            } )(
              <Input
                placeholder="请输入关键词"
                style={{ width: 170 }}
              />
            )}
            </FormItem>

            <FormItem label='发布者' {...this.formLayout}>
              {getFieldDecorator( 'publishUsername', {
            } )(
              <Input
                placeholder="请输入发布者"
                style={{ width: 170 }}
              />
            )}
            </FormItem>

            <FormItem label='发布时间' {...this.formLayout}>
              {getFieldDecorator( 'rangeTime', {
            } )( <RangePicker showTime format="YYYY-MM-DD" style={{ width:270 }} /> )}
            </FormItem>

            <div style={{ float:'right', paddingRight:50 }}>
              <Button
                type="primary"
                style={{ marginLeft: 15, marginRight: 20, marginTop: 4 }}
                onClick={() => { this.filterSubmit()}}
              >搜索
              </Button>
              <Button
                style={{ marginTop: 4, marginRight:20 }}
                onClick={this.formReset}
              >清空
              </Button>
              <span style={{ color:'#1880FF', cursor:'pointer', userSelect:'none' }} onClick={this.showSearch}>
                {
                  searchState ?  <span>收起<Icon type="down" /></span> : <span>展开<Icon type="up" /></span>
                }
              </span>
            </div>
        
          </Form>
          {
            searchState && <CompanyForm onRef={div => { this.compayForm = div }} />
          }
        </div>
        <div style={{ width:'100%', background:'#fff', marginTop:'30px', paddingBottom:'20px', overflow:'auto', boxSizing:'border-box' }}>
          <List
            loading={loading}
            className={styles.commentList}
            style={{ margin: '30px auto 0 auto' }}
            itemLayout="vertical"
            size="large"
            split
            dataSource={list}
            pagination={paginationProps}
            renderItem={( item, index ) => (
              <List.Item
                key={index}
                actions={[
                  <IconText type="eye" text={item.viewTotal} key="list-vertical-eye" />,
                  <IconText type="star-o" text={item.favoriteTotal} key="list-vertical-star-o" />,
                  <IconText type="share-alt" text={item.shareTotal} key="list-vertical-share-alt" />,
                  <div>
                    {/* <span style={{ color:'#111', marginRight:'20px' }} onClick={( e )=>this.upDataState( e, item, 'isPublish' )}>{item.isPublish ? '(已下线)':'(已上线)'}</span> */}
                    <span style={{ color:item.isPublish ? 'red' : '#1880FF' }} onClick={( e )=>this.cancel( e, item, 'isPublish' )}>{item.isPublish ? '强制下线':'恢复上线'}</span>
                  </div>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className={styles.list_title}>
                      {!item.isPublish && <Icon type="stop" style={{ color:'red', fontSize:'16px', fontWeight:'600', marginRight:'15px' }} />}
                      <div
                        dangerouslySetInnerHTML={{
                        __html: item.originTitle
                        }}
                      />
                    </div>
                  }
                  description={
                    <div
                      className={styles.list_description}
                      onClick={( e )=>this.articleLink( e, item )}
                      dangerouslySetInnerHTML={{
                        __html: item.review
                        }}
                    />
                  }
                />
                {
                  item.originSummary  && 
                  <div
                    className={styles.list_content}
                    dangerouslySetInnerHTML={{
                    __html: item.originSummary 
                    }}
                  />
                }
                <div>
                  <span style={{ color:'#1880FF', cursor:'pointer' }} onClick={( e )=>this.getUserList( e, item )}>{item.investmentAdvisorName}</span>
                  <span style={{ margin:' 0 20px 0 30px' }}>{item.createTime}</span>
                  {
                    item.isStick && <span style={{ color:'#f6ac17' }}>置顶</span>
                  }
                </div>
              </List.Item>
            )}
          />
        </div>
      </GridContent>

    );
  }
}

export default Resource;
