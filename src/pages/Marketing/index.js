import React, { PureComponent } from 'react';
import { Row, Col, Icon } from "antd";
import { formatMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import Exception from '@/components/Exception';
import { isUrl } from '@/utils/utils';
import styles from './index.less';

import Basic from './Basic'; // 销售top3图
import HotBasic from './hotBasic'; // 热销图
import StartActivity from './startActivity';  // 活动待开始
// import NoAccess from './noAccess';
import CommomCom from './Common.com' // 常用模块
import ActivityCom from './Activity.com'; // 活动概况
import OrderCom from './Order.com'; // 订单概况
// import TodoList from './TodoList.com'
// import TodayComplete from './TodayComplete.com'
import Title from './Title.com';

const getIcon = icon => {
  if ( typeof icon === 'string' ) {
    if ( isUrl( icon ) ) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if ( icon.startsWith( 'icon-' ) ) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
}

class HomePage extends PureComponent {
  constructor( props ){
    const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth;  // 获取浏览器宽度
    super( props );
    this.state  = {
      winSizeState:!( ( winSize && winSize >=1806 ) ),
      authorityList
    }
  }

  componentWillMount () {
    window.addEventListener( 'resize', this.handleResize.bind( this ) ) 
  }

  componentWillUnmount() { 
    window.removeEventListener( 'resize', this.handleResize.bind( this ) )
  }

  // 浏览器窗口大小改变事件
  handleResize=( e )=>{
    if( e.target.innerWidth>=1806 ){
      this.setState( {
        winSizeState:false
      } )
    }
    if( e.target.innerWidth<=1552 ){
      this.setState( {
        winSizeState:true
      } )
    }
  }


  render() {
    const { winSizeState, authorityList } = this.state;
    const { history } = this.props;
    if( !authorityList.includes( 'MARKETING_OVERVIEW_GET' ) ){
      return(
        <Exception
          type="403"
          backText={formatMessage( { id: 'app.exception.back' } )}
          desc={formatMessage( { id: 'app.exception.description.403' } )}
        />
      )
    }
    return (
      <section style={{ width:'100%', userSelect:'none' }}>
        <div className={styles.left_topBox}>
          <div className={styles.box_basic}>
            <OrderCom
              winSizeState={winSizeState}
              noData={<NoData />}
            />
          </div>
        </div>
        <div style={{ width:'63%', float:'left' }}>
          <Row className={styles.row_right}>

            <Col span={winSizeState ? 12 : 14} style={{ height:winSizeState ? 300 : 372 }}>
              <div className={styles.box_basic} style={{ height: '100%' }}>
                <ActivityCom history={history} winSizeState={winSizeState} noData={<NoData />} />
              </div>
            </Col>

            <Col type='today' span={winSizeState ? 12 :10} style={{ height:winSizeState ? 300 : 372 }}>
              <div className={styles.box_basic} style={{ height:'100%' }}>
                <StartActivity winSizeState={winSizeState} />
              </div>
            </Col>

            <Col className={styles.box_basic} span={24} style={{ height:320, margin:'10px 0' }}>
              <Title name='近3日榜单' />
              <Col xl={12} lg={12} md={12} sm={12}>
                <Basic />
              </Col>
              <Col xl={12} lg={12} md={12} sm={12}>
                <HotBasic />
              </Col>
            </Col>

          </Row>
        </div>
        <div className={styles.bottomBox}>
          <div className={styles.commonData}>
            <div className={styles.box_basic} style={{ width:'100%', height:155 }}>
              <Title name='常用功能' />
              <CommomCom  />
            </div>
          </div>
          <div className={styles.backlogData} style={{ paddingRight:'10px' }}>
            <div className={styles.box_basic} style={{ width:'100%', height:155 }}>
              <Title name='待办事项' />
              <NoData />
            </div>
          </div>
          <div className={styles.backlogData}>
            <div className={styles.box_basic} style={{ width:'100%', height:155 }}>
              <Title name='今日完成' />
              <NoData />
            </div>
          </div>
        </div>
      </section>
    )      
    
  }
}

export default HomePage;



const NoData = () => (
  <div style={{ 
      width:'100%', 
      //  height:'100%', 
      display:'flex', 
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column',
      color: '#ccc',
    }}
  >
    <div style={{ fontSize: '50px', marginBottom: '0px' }}>{getIcon( 'icon-zanwushuju1' )}</div>
    <p style={{ margin:0 }}>暂无数据</p>
  </div> 
)