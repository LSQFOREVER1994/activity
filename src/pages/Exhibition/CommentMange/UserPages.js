import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Icon, message } from 'antd';
import styles from '../exhibition.less';


// const  orgNameObj = {
//   HEAD_COMPANY: { key: 'headCompany', name:'总公司' },
//   BRANCH_FIRST: { key: 'headCompany', name:'一级分公司' },
//   BRANCH_SECOND: { key: 'headCompany', name:'二级分公司' },
//   DEPARTMENT: { key: 'headCompany', name:'营业部' },
// }

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  userPagesList:exhibition.userPagesList,
  // commentData:exhibition.commentData
  // resourceData: exhibition.resourceData,
} ) )
@Form.create()
class UserPages extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };

  constructor( props ){
    super( props );
    const userId = props.location.query.userId || sessionStorage.getItem( 'userId' ) ||  '';
    const username = props.location.query.username || sessionStorage.getItem( 'username' ) || '';
    this.state={
      pageNum: 1,
      pageSize: 10,
      userId,
      username
    }
  }

  // state = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   searchState:false
  // };

  componentDidMount() {
    // this.fetchList()
    // this.child.componentDidMount()
    this.getUserPagesList();
    // this.getUserTotal();
    
  }

  //  获取用户详情列表
  getUserPagesList=()=>{
    const{ userId, pageNum, pageSize }=this.state;
    const{ dispatch }=this.props;
    let isErr = true
    if( !userId ){
      message.error( '数据出错' )
      isErr = false
    }
    if( isErr ){
      dispatch( {
        type:'exhibition/getUserPagesList',
        payload:{
          pageNum,
          pageSize,
          userId,
          orderBy:'create_time desc'
        }
      } )
    }
  }


  //  跳转内容详情页
  articleLink=( e, item )=>{
    e.stopPropagation();
    this.props.history.push( `/routine/exhibition/detailPages?id=${item.id}` )
  }

  //  更新文章状态
  upDataState=( e, item )=>{
    e.stopPropagation();
    const{ isPublish }=item;
    const { dispatch }=this.props;
    dispatch( {
      type:'exhibition/upDataComment',
      payload:{
        params:{
          ...item,
          isPublish:!isPublish
        },
        callFunc:()=>{
          this.getUserPagesList( {} )
        }
      }
    } )
  }

  


  render() {
    const { pageNum, username, pageSize } = this.state;
    const{ loading, userPagesList:{ list, total } }= this.props

    const IconText = ( { type, text } ) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      onChange:( page )=>{
        this.setState( {
          pageNum:page
        }, ()=>this.getUserPagesList() )
      },
      onShowSizeChange:( current, size )=>{
        this.setState( {
          pageSize:size,
          pageNum:current
        }, ()=>this.getUserPagesList() )
      }
    };

    return (
      <div>
        <div style={{ width:'100%', background:'#fff', padding:'20px' }}>
          <h3 style={{ fontSize:'18px', fontWeight:600, height:'32px', lineHeight:'32px' }}>点评管理·{username}</h3>
        </div>
        <div style={{ width:'100%', background:'#fff', marginTop:'30px', overflow:'auto', boxSizing:'border-box' }}>
          <List
            loading={loading}
            className={styles.commentList}
            style={{ margin: '20px auto' }}
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
                    <span>{item.createTime}</span>
                    <span style={{ color:item.isPublish ? 'red' : '#1880FF', margin:' 0 30px' }} onClick={( e )=>this.upDataState( e, item )}>{item.isPublish ? '强制下线':'恢复上线'}</span>
                    {item.isStick && <span style={{ color:'#f6ac17' }}>置顶</span>}
                  </div>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className={styles.list_title}>
                      {!item.isPublish && <Icon type="stop" style={{ color:'red', fontSize:'16px', fontWeight:'600', marginRight:'15px' }} />}
                      {item.originTitle}
                    </div>
                  }
                  description={<div className={styles.list_description} onClick={( e )=>this.articleLink( e, item )}>{item.review}</div>}
                />
                {
                  item.originSummary && 
                  <div className={styles.list_content}>
                    {item.originSummary}
                  </div>
                }
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}

export default UserPages;
