import React, { PureComponent } from 'react';
import { Card, Button, Icon, message, Pagination } from 'antd';
import serviceObj from '@/services/serviceObj';
import { activityObj } from '../../../utils/utils'
import styles from './ActivesLibrary.less'

const { activityTemplateObj } = serviceObj
const activityTemplateList =  [];
Object.keys( activityObj ).forEach( ( item )=>{
  activityTemplateList.push( activityObj[item] )
} );

class ActivesLibrary extends PureComponent {

  constructor( props ){
    let pageSize
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth;  // 获取浏览器宽度
    if( winSize >=1920 )pageSize=10
    if( winSize >= 1536 && winSize < 1920 )pageSize=8
    if( winSize >= 980 && winSize < 1536 )pageSize=6
    if( winSize < 980 )pageSize=4
    super( props );
    this. state = {
      page: 1,
      pageSize,
      newList: [],
    };
  }

  componentWillMount () {
    this.fetchList()
    window.addEventListener( 'resize', this.handleResize.bind( this ) )
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.handleResize.bind( this ) )
  }


  // 浏览器窗口大小改变事件
  handleResize=( e )=>{
    if( e.target.innerWidth>=1920 ){
      this.setState( {
        pageSize:10
      }, ()=>this.fetchList() )
    }
    if( e.target.innerWidth >= 1536 && e.target.innerWidth < 1920 ){
      this.setState( {
        pageSize:8
      }, ()=>this.fetchList() )
    }
    if( e.target.innerWidth >= 980 && e.target.innerWidth < 1536 ){
      this.setState( {
        pageSize:6
      }, ()=>this.fetchList() )
    }
    if( e.target.innerWidth<=980 ){
      this.setState( {
        pageSize:4
      }, ()=>this.fetchList() )
    }
  }

  fetchList = () => {
    const { page, pageSize } = this.state;
    const newList = activityTemplateList.slice( ( page - 1 ) * pageSize, page * pageSize )
    this.setState( {
      newList,
    } )
  }

  // 创建活动
  createActivities = ( e, item ) => {
    e.stopPropagation();
    const { addUrl } = item
    if ( addUrl ) {
      this.props.history.push( `/oldActivity/activityModal/${addUrl}` )
    } else {
      message.error( '暂无配置' )
    }
  }

  // 模板下载
  templateDownload = ( e, item ) => {
    e.stopPropagation();
    e.preventDefault();
    if ( item.namespace ) {
      window.location = `${activityTemplateObj + item.namespace}/res.zip`
    } else {
      message.error( '暂无配置' )
    }
  }


  showTotal = () => {
    const total = activityTemplateList.length
    return `共 ${total} 条`;
  }

  onChange = ( page ) => {
    this.setState( {
      page,
      // pageSize
    }, () => {
      this.fetchList()
    } )
  }



  render () {
    const { newList } = this.state;

    return (
      <div style={{ position: 'relative', paddingBottom: '20px' }}>
        <Card
          className={styles.listCard}
          bordered={false}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.activityName}>
            <div className={styles.headerTitle}>
              <div className={styles.titleLeft} />
              <h3>全部活动模板</h3>
            </div>

            <h4>抽奖类</h4>
            <ul>
              <li>大转盘</li>
              <li>刮刮卡</li>
              <li>砸金蛋</li>
              <li>抓娃娃</li>
              <li>抽奖码</li>
              {/* <li>老虎机</li> */}
            </ul>
            <h4>拉新促活类</h4>
            <ul>
              <li>口令活动</li>
              <li>抽签</li>
              <li>集福卡</li>
              <li>红包雨</li>
              <li>翻卡拼手气</li>
              {/* <li>挖矿</li>
              <li>大富翁</li>
              <li>地图寻宝</li>
              <li>摇钱树</li>
              <li>开箱有礼</li>
              <li>推荐有奖</li>
              <li>种树</li>
              <li>任务盖楼</li> */}
            </ul>
            <h4>营销类</h4>
            <ul>
              <li>秒杀</li>
              <li>抢券</li>
              <li>下单有礼</li>
              {/* <li>定金膨胀</li> */}
            </ul>
            {/* <h4>开户专用类</h4>
            <ul>
              <li>新客礼包</li>
              <li>邀请有礼</li>
              <li>邀请码</li>
              <li>知识竞答</li>
            </ul> */}
            {/* <h4>裂变类</h4>
            <ul>
              <li>砍价</li>
              <li>拼团</li>
              <li>老带新</li>
              <li>发红包 </li>
              <li>头脑王者</li>
            </ul> */}
            <h4>主题类</h4>
            <ul>
              {/* <li>许愿</li>
              <li>主题测试</li> */}
              <li>弹幕</li>
              {/* <li>猜灯谜</li> */}
            </ul>
            <h4>常规活动</h4>
            <ul>
              <li>问卷调查</li>
              <li>满意度调查</li>
              <li>投教小课堂</li>
              <li>历史战绩</li>
            </ul>
            {/* <h4>投票专题</h4>
            <ul>
              <li>投票评选</li>
              <li>投票有奖</li>
            </ul> */}
          </div>
          <div className={styles.activityTemplate}>
            {/* <List
              dataSource={newList}
              split={false}
              pagination={paginationProps}
              renderItem={item => (
                <div className={styles.activityBox} key={item.namespace}>
                  <div className={styles.maskingBox}>
                    <div className={styles.buttomBox}>
                      <Button type="primary" onClick={( e ) => { this.createActivities( e, item ) }} style={{ marginBottom: 8 }}>
                        <Icon type="plus-square" />创建活动
                      </Button>
                      <Button type="primary" onClick={( e ) => this.templateDownload( e, item )}>
                        <Icon type="download" />模板下载
                      </Button>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '374px', overflow: 'hidden' }}>
                    <img src={`${activityTemplateObj + item.namespace}/preview.jpg`} alt="" />
                  </div>
                  <div className={styles.name}>{item.name}</div>
                </div>
              )}
            /> */}
            {
              newList.map( ( item ) => {
                return (
                  <div className={styles.activityBox} key={item.key}>
                    <div className={styles.maskingBox}>
                      {/* <div className={styles.wxImage}>
                        {
                          item.WXImg ? <img src={WXImg} alt="" /> : null
                        }
                      </div> */}
                      <div className={styles.buttomBox}>
                        <Button type="primary" onClick={( e ) => { this.createActivities( e, item ) }} style={{ marginBottom: 8 }}>
                          <Icon type="plus-square" />创建活动
                        </Button>
                        <Button type="primary" onClick={( e ) => this.templateDownload( e, item )}>
                          <Icon type="download" />模板下载
                        </Button>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '374px', overflow: 'hidden' }}>
                      <img src={`${activityTemplateObj + item.namespace}/preview.jpg`} alt="" />
                    </div>
                    <div className={styles.name}>{item.name}</div>
                  </div>
                )
              } )
            }
            <div style={{ clear: 'both' }} />
            <Pagination
              size="small"
              showSizeChanger
              pageSize={this.state.pageSize}
              total={activityTemplateList.length}
              showTotal={this.showTotal}
              style={{ textAlign: 'right' }}
              onChange={this.onChange}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default ActivesLibrary;
