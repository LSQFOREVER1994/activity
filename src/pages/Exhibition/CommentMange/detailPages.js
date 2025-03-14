import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Icon, Button, message } from 'antd';
import styles from '../exhibition.less';


// const  orgNameObj = {
//   HEAD_COMPANY: { key: 'headCompany', name:'总公司' },
//   BRANCH_FIRST: { key: 'headCompany', name:'一级分公司' },
//   BRANCH_SECOND: { key: 'headCompany', name:'二级分公司' },
//   DEPARTMENT: { key: 'headCompany', name:'营业部' },
// }

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  // commentData:exhibition.commentData
} ) )
@Form.create()
class DetailPages extends PureComponent {

  formLayout = {

  };

  constructor( props ){
    super( props )
    const currentId = props.location.query.id || sessionStorage.getItem( 'id' ) ||  '';
    const username = props.location.query.username || sessionStorage.getItem( 'username' ) || '';
    this.state={
      currentId,
      username,
      isPublishState:null,
    }
  }

  componentDidMount() {
    this.getDetaillData()
    
  }

  // 获取点评详细信息
  getDetaillData =()=>{
    const{ currentId }= this.state;
    const { dispatch }=this.props;
    let isErr = true
    if( !currentId ){
      message.error( '数据出错' )
      isErr = false
    }
    if( isErr ){
      const detaillPagesList = [];
      dispatch( {
        type:'exhibition/getDetaillData',
        payload: {
          id:currentId,
        },
        callFunc:( result )=>{
          detaillPagesList.push( result )
          this.setState( {
            detaillPagesList,
            isPublishState:result.isPublish
          } )
        }
      } )
    }
  }

  //  更新文章状态
  upDataState=( e, item )=>{
    e.stopPropagation();
    // const{ isPublish }=item;
    const{ isPublishState }=this.state
    const { dispatch }=this.props;
    // const obj = type === 'isPublish' && { isPublish:!isPublish }
    dispatch( {
      type:'exhibition/upDataComment',
      payload:{
        params:{
          ...item,
          isPublish:!isPublishState
        },
        callFunc:()=>{
          this.setState( { isPublishState:!isPublishState } )
          // this.getDetaillData()
        }
      }
    } )
  }

  
  //  跳转用户详情列表
  getUserList=( e, item )=>{
    e.stopPropagation();
    const { username }=this.state;
    sessionStorage.setItem( 'userId', item.userId )
    sessionStorage.setItem( 'username', username )
    this.props.history.push( `/routine/exhibition/userPages?userId=${item.userId}&username=${username}` )
  }


  render() {
    const{ detaillPagesList=[], username, isPublishState } = this.state;
    const{ loading } = this.props;

    const IconText = ( { type, text } ) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
   
    return (
      <div style={{ width:'100%', background:'#fff', boxSizing:'border-box', overflow:'hidden' }}>
        <List
          loading={loading}
          className={styles.commentList}
          style={{ margin: '30px auto 0 auto' }}
          itemLayout="vertical"
          size="large"
          split
          dataSource={detaillPagesList}
          renderItem={( item, index ) => (
            <List.Item
              key={index}
              actions={[
                <IconText type="eye" text={item.viewTotal} key="list-vertical-eye" />,
                <IconText type="star-o" text={item.favoriteTotal} key="list-vertical-star-o" />,
                <IconText type="share-alt" text={item.shareTotal} key="list-vertical-share-alt" />
                ]}
            >
              <List.Item.Meta
                title={
                  <span className={styles.list_title}>{!item.isPublish && <Icon type="stop" style={{ color:'red', fontSize:'16px', fontWeight:'600', marginRight:'15px' }} />}{item.originTitle}</span>
                  // <div className={styles.list_title}>
                  //   {!item.isStick && <Icon type="stop" style={{ color:'red', fontSize:'16px', fontWeight:'600', marginRight:'15px' }} />}
                  //   {
                  //     <span className={styles.list_title}>
                  //       {item.review}
                  //       <span style={{ fontSize:'12px', marginLeft:'20px', cursor:'pointer' }} onClick={( e )=>this.upDataState( e, item, 'isPublish' )}>{item.isPublish && '已下线'}</span>
                  //     </span>
                  //   }
                  // </div>
              }
              />
              <div style={{ marginTop:'-15px' }}>
                <span style={{ color:'#1880FF', cursor:"pointer" }} onClick={( e )=>this.getUserList( e, item )}>{username}</span>
                <span style={{ margin:' 0 20px 0 30px' }}>{item.createTime}</span>
                {item.isStick && <span style={{ color:'#f6ac17' }}>置顶</span>}
                <Button style={{ float:'right' }} onClick={( e )=>this.upDataState( e, item )}>{isPublishState ? '强制下线':'恢复上线'}</Button>
              </div>
            </List.Item>
          )}
        />
        {
          detaillPagesList.map( ( item, index )=>{
            return(
              <div style={{ width:'93%', margin:'20px auto', overflow:'hidden', boxSizing:'border-box' }} key={index}>
                <div
                  key={item.index}
                  style={{ background:'#eee' }}
                  dangerouslySetInnerHTML={{
                    __html:`${item.review}`
                  }}
                />
                <div
                  style={{ maxWidth:'90%', margin:'30px auto' }}
                  key={item.index}
                  dangerouslySetInnerHTML={{
                    __html:`${item.newsContent}`
                  }}
                />
              </div>
            )
          } )
        }
      </div>
    );
  }
}

export default DetailPages;
