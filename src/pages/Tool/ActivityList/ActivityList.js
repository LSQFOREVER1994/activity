/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable consistent-return */
/* eslint-disable no-new */
import React, { PureComponent } from 'react';
// import Masonry from 'masonry-layout';
import Macy from 'macy';
import { RidingWindScrollList, RSTATES } from 'ridingwind-scrolllist';
import imagesLoaded from 'imagesloaded';
import { connect } from 'dva';
import { Radio, Modal, Button } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './activityList.less';

@connect( ( { activity } ) => ( {
  allList: activity.allList,
} ) )
class ActivityList extends PureComponent {
  state = {
    BUSINESSTYPE: [], // 业务提升
    FESTIVALTYPE: [], // 节日
    PLAYINGTYPE: [], // 玩法

    business: '',
    playing: '',
    festival: '',

    hasMore: true,
    currentState: RSTATES.init,
    pageNum: 1,
  };

  componentDidMount() {
    const masonry = new Macy( {
      container: '#pages-hoc', // 图像列表容器
      trueOrder: false,
      waitForImages: false,
      useOwnImageLoader: false,
      debug: true,
      margin: { x: 14, y: 14 },    // 设计列与列的间距
      columns: 5,    // 设置列数
    } )
    this.setState( { masonry } );

    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getActivityResourceType',
      payload: {
        callFunc: ( { BUSINESSTYPE = [], FESTIVALTYPE = [], PLAYINGTYPE = [] } ) => {
          this.setState( { BUSINESSTYPE, FESTIVALTYPE, PLAYINGTYPE } )
          this.getNews( 1, 'init' );
        },
      },
    } );
    // 
  }

  imagesOnload = () => {
    const elLoad = imagesLoaded( '#pages-hoc' ) // 获取最外层的盒子

    elLoad.on( 'always', () => {
      // 图片加载后执行的方法
      // 拿第一次的数据
      this.advanceWidth()
    } )
    // elLoad.on( 'done', () => {
    //     // 图片加载后执行的方法
    //     console.log('图片加载成功')
    // } )
    // elLoad.on( 'fail', option => {
    //     // 图片加载后执行的方法
    //     console.log('图片加载失败', option)
    // } )
  }

  advanceWidth = () => {
    if ( this.state.masonry ) {
      this.state.masonry.reInit()
    }
  }

  // 加载更多数据
  executeFunc = ( currentState ) => {
    if ( currentState === this.state.currentState ) {
      return false;
    }

    if ( currentState === RSTATES.refreshing ) {
      // 刷新
      this.handRefreshing();
    } else if ( currentState === RSTATES.loading ) {
      // 加载更多
      this.handLoadMore();
    } else {
      this.setState( {
        currentState,
      } );
    }
  };

  handRefreshing = () => {
    if ( RSTATES.refreshing === this.state.currentState ) {
      return false;
    }

    this.getNews( 1, 'refreshed' );

    this.setState( {
      currentState: RSTATES.refreshing,
    } );
  };

  handLoadMore = () => {
    if ( RSTATES.loading === this.state.currentState ) {
      return false;
    }
    // 无更多内容则不执行后面逻辑
    if ( !this.state.hasMore ) {
      return;
    }

    this.getNews( this.state.pageNum, 'reset' );

    this.setState( {
      currentState: RSTATES.loading,
    } );
  };

  getNews = ( pageNum, type ) => {
    const { business, playing, festival } = this.state;
    const { dispatch, allList } = this.props;
    let oldList;
    if (
      ( type === 'init' ) ||
      ( type === 'refreshed' )
    ) {
      oldList = [];
    } else {
      oldList = allList.list;
    }
    const that = this;
    dispatch( {
      type: 'activity/getActivityResource',
      payload: {
        pageNum,
        pageSize: 20,
        businessType: business,
        festivalType: festival,
        playingType: playing,
      },
      oldList,
      success: ( pages ) => {
        that.imagesOnload();
   
        that.setState( {
          hasMore: pages > pageNum,
          currentState: RSTATES[type],
          pageNum: pageNum + 1,
        } );
      },
    } );
  }

  changeType = ( e, type ) => {
    const { value } = e.target;
    if ( this.state[type] !== value ) {
      this.setState( {
        [type]: value,
        pageNum: 1,
      }, () => {
        this.getNews( 1, 'refreshed' );
      } )
    }
  }

  addActive = () => {
    Modal.info( {
      title: "提示",
      icon: '',
      cancelText: '知道了',
      content: (
        <div className={styles.modalTexBox}>
          谢谢支持！如果您有需要请联系本公司商务进行详细了解！
        </div>
      ),
      onCancel() {},
    } );
  }

  clickItem = ( item ) => {
    Modal.info( {
      title: "活动详情",
      width: '50%',
      icon: '',
      cancelText: '知道了',
      content: (
        <div>
          <div className={styles.modalTop}>
            <div className={styles.modalImgBox}>
              <img src={item.imgUrl} alt="" />
            </div>

            <div className={styles.modalTexBox}>
              <div className={styles.flex}>
                <div className={styles.modalTexBoxName}>活动名称：</div>
                <div>{item.name}</div>
              </div>
              <div className={styles.flex}>
                <div className={styles.modalTexBoxName}>活动简介：</div>
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
              <Button type="primary" style={{ marginTop: '15px' }} onClick={this.addActive}>创建</Button>
            </div>
          </div>
        </div>
      ),
      onCancel() {},
    } );
  }

  render() {
    const {
      currentState, hasMore, BUSINESSTYPE, FESTIVALTYPE, PLAYINGTYPE,
      // business, playing, festival,
    } = this.state;
    const { allList } = this.props;
    return (
      <GridContent>
        <div className={styles.main}>
          <div>
            <h3>活动资源库（共{allList.total}条）</h3>
            <div className={styles.navs}>
              <div className={styles.navsText}>业务提升：</div>
              <Radio.Group defaultValue="" buttonStyle="solid" onChange={( e ) => this.changeType( e, 'business' )}>
                <Radio.Button value="">全部</Radio.Button>
                {
                  BUSINESSTYPE.map( ( item, index ) => (
                    <Radio.Button value={item.name} key={index}>{item.name}</Radio.Button>
                  ) )
                }
              </Radio.Group>
            </div>
            <div className={styles.navs}>
              <div className={styles.navsText}>玩&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;法：</div>
              <Radio.Group defaultValue="" buttonStyle="solid" onChange={( e ) => this.changeType( e, 'playing' )}>
                <Radio.Button value="">全部</Radio.Button>
                {
                  PLAYINGTYPE.map( ( item, index ) => (
                    <Radio.Button value={item.name} key={index}>{item.name}</Radio.Button>
                  ) )
                }
              </Radio.Group>
            </div>
            <div className={styles.navs}>
              <div className={styles.navsText}>节&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日：</div>
              <Radio.Group defaultValue="" buttonStyle="solid" onChange={( e ) => this.changeType( e, 'festival' )}>
                <Radio.Button value="">全部</Radio.Button>
                {
                  FESTIVALTYPE.map( ( item, index ) => (
                    <Radio.Button value={item.name} key={index}>{item.name}</Radio.Button>
                  ) )
                }
              </Radio.Group>
            </div>
          </div>

          {/* 列表 开始 */}
          <div className={styles.mainList}>
            <RidingWindScrollList
              id="NEWS_ID"
              pullDownSpace={80}
              actionSpaceBottom={400}
              currentState={currentState}
              hasMore={hasMore}
              executeFunc={this.executeFunc}
            >
              <div id="pages-hoc" style={{ width: '100% !important' }}>
                {
                  allList.list.map( ( item, index ) => (
                    <div
                      key={index}
                      className={styles.listItem}
                      onClick={() => this.clickItem( item )}
                    // className={cs( 'd', { d1: key % 2 === 0, d2: key % 2 !== 0 } )} // 添加类名 修改样式
                    >
                      <div className={styles.listText}>{item.name}</div>
                      <img src={item.imgUrl} />
                    </div>
                  ) )
                }
              </div>
            </RidingWindScrollList>
          </div>
          {/* 列表 结束 */}
        </div>
      </GridContent>
    );
  }
}

export default ActivityList;
