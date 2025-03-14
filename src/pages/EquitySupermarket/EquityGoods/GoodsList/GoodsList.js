/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Menu, Empty, Spin, Form, message, Button } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import SingleGoods from './SingleGoods/SingleGoods';
import SingleGoodsEditOrAdd from './SingleGoods/SingGoodsEditOrAdd/SingGoodsEditOrAdd';
import SyncModal from "./SyncModal";
import styles from './GoodsList.less';
import syncIcon from '@/assets/sync.svg';
import addIcon from '@/assets/addIcon.png';

// 根据视窗判断展示的个数
const getColSpan = winSize => {
  let colSpan = 5
  if ( winSize > 1920 ) colSpan = 6
  if ( winSize > 1680 && winSize <= 1920 ) colSpan = 5
  if ( winSize > 1440 && winSize <= 1680 ) colSpan = 4
  if ( winSize > 1160 && winSize <= 1440 ) colSpan = 3
  if ( winSize > 800 && winSize <= 1160 ) colSpan = 2
  if ( winSize <= 800 ) colSpan = 1
  return colSpan
}
@connect( ( { equityGoods } ) => {
  return {
    ...equityGoods
  }
} )
@Form.create()
class GoodsList extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      editOrAddVisible: false,
      isAdd: false,
      goodsInfo: {}, // 单个商品信息
      merchantList: [], // 初始化商户列表
      classifyList: [], // 初始化商品分类列表
      cid: '', // 侧边栏商品分类的搜索id
      defaultOpenKeys: [], // 默认展开的菜单项
      defaultSelectKeys: ['0'],
      menuStyle: {},
      syncGoodsSource: [],
      syncModalVisible: false,
      colSpan: 0,
      itemWidth: 0,
      noMore: false,
      goodsListResult: [],
      preSearchData:{},
    };
    const dom = document.body.querySelectorAll( '.ant-layout' )[1]
    this.scrollDom = dom
    this.searchBar = React.createRef()
    this.throttledFilterSubmit = this.throttle( this.filterSubmit, 500 )
  }

  componentDidMount() {
    this.listenResize()
    this.scrollDom.addEventListener( "scroll", this.onScroll, false );
    window.addEventListener( 'resize', this.listenResize.bind( this ) );
    window.addEventListener( 'resize', this.generateMenuStyle.bind( this ) )
    this.generateMenuStyle()
    this.getAllMerchant()
    this.getGoodsClassifyList()
    this.getSyncGoodsSource()
  };

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.goodsListResult.pageNum === 1 ) {
      this.setState( {
        noMore: false,
        goodsListResult: nextProps.goodsListResult.list
      } )
    }
    if ( this.props.goodsListResult.pageNum < nextProps.goodsListResult.pageNum ) {
      if ( nextProps.goodsListResult.list.length === 0 ) {
        message.info( '没有更多了' )
        this.setState( {
          noMore: true
        } )
      }
      const { goodsListResult } = this.state;
      this.setState( {
        goodsListResult: [...goodsListResult, ...nextProps.goodsListResult.list]
      } )
    } else {
      this.setState( {
        pageNum: nextProps.goodsListResult.pageNum,
      } )
    }
  }

  componentWillUnmount() {
    this.scrollDom.removeEventListener( "scroll", this.onScroll, false );
    window.removeEventListener( 'resize', this.listenResize.bind( this ) );
    window.removeEventListener( 'resize', this.generateMenuStyle.bind( this ) )
  }

  getPreProps = () => {
    const propductName = sessionStorage.getItem( 'productName' )
    if( !propductName ) return;
    this.setState( {
      preSearchData: {
        name: propductName
      }
    }, ()=>{
      sessionStorage.removeItem( 'productName' )
      this.filterSubmit( { name: propductName } )
    } )
  }

  // 监听浏览器窗口改变
  listenResize = () => {
    // 获取浏览器宽度
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth;
    const colSpan = getColSpan( winSize );
    const cardBox = document.getElementById( 'cardBox' )
    if ( cardBox && cardBox.offsetWidth ) {
      this.setState( {
        itemWidth: ( cardBox.offsetWidth - 230 ) / colSpan,
        colSpan,
        pageSize: colSpan * 3
      }, this.throttledFilterSubmit )
    }
  };

  

    // 节流函数
   throttle = ( func, limit ) => {
      let lastFunc;
      let lastRan;
    
      return function returnFunc ( ...args ) {
        const context = this;
    
        if ( !lastRan ) {
          func.apply( context, args );
          lastRan = Date.now();
        } else {
          clearTimeout( lastFunc );
          lastFunc = setTimeout( ( )=> {
            if ( ( Date.now() - lastRan ) >= limit ) {
              func.apply( context, args );
              lastRan = Date.now();
            }
          }, limit - ( Date.now() - lastRan ) );
        }
      }
    }
    

  onScroll = () => {
    const { loading } = this.props;
    const { noMore } = this.state;
    if ( loading || noMore ) return
    const { scrollTop, scrollHeight, clientHeight } = this.scrollDom
    if ( scrollHeight - scrollTop - clientHeight <= 30 ) {
      const { pageNum } = this.state;
      this.setState( { pageNum: pageNum + 1 }, () => { this.getGoodsList( this.searchBar.current.data ) } )
    }
  }

  // 适应屏幕生成菜单高度
  generateMenuStyle = () => {
    const dom1 = document.querySelector( '#filter_form' )
    const dom2 = document.querySelector( '#cardBox' )
    let height = ( dom1?.offsetHeight || 0 ) + ( dom2?.offsetHeight || 0 )
    if ( height < 500 ) height = 500
    this.setState( {
      menuStyle: {
        height,
        overflow: 'auto'
      }
    } )
  }

  // 字数限制
  limitWords = txt => {
    let newStr
    const len = txt.length
    if ( len > 8 ) {
      newStr = `${txt.slice( 0, 7 )}...`
      return newStr
    }
    return txt
  }

  // 查询外部商品来源
  getSyncGoodsSource = () => {
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoods/getSyncGoodsSource',
      callBackFunc: ( res ) => {
        this.setState( {
          syncGoodsSource: res.result
        } )
      }
    } )
  }

  // 获取商品列表
  getGoodsList = ( data, page ) => {
    const {
      pageNum,
      pageSize,
    } = this.state
    const { dispatch } = this.props;
    const { cid } = this.state
    const query={ cid, ...data }
    const propductName = sessionStorage.getItem( 'productName' )
    if( propductName ) {
      this.getPreProps()
      return
    }
    dispatch( {
      type: 'equityGoods/getGoodsList',
      payload: {
        page:{
          pageNum: page || pageNum,
          pageSize,
        },
        ...query
      },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          this.generateMenuStyle()
        }
      }
    } )
  };

  // 获取单个商品详情
  fetchSingleGoodsInfo = ( id, callFunc ) => {
    const { dispatch, isAdd } = this.props
    if ( isAdd ) return;
    dispatch( {
      type: 'equityGoods/getSingleGoodsDetail',
      payload: { id },
      callBackFunc: ( res ) => {
        if ( res && res.success ) {
          this.setState( {
            goodsInfo: res.result,
          }, ()=>{
            if( callFunc ) callFunc()
          } )
        }
      }
    } )

  }

  // 获取商户列表
  getAllMerchant = () => {
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoods/getMerchantNameList',
      payload: {
        name: ''
      },
      callBackFunc: ( res ) => {
        this.setState( {
          merchantList: res.result
        } )
      }
    } )
  }

  // 获取商品分类列表
  getGoodsClassifyList = () => {
    const { pageNum } = this.state
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoods/getGoodsClassifyList',
      payload: {
        page:{
          pageNum,
          pageSize: 500,
        }
      },
      callBackFunc: ( res ) => {
        const { list } = res.result
        const defaultOpenKeys = []
        if ( Array.isArray( list ) && list.length ) {
          list.forEach( ( item ) => {
            if ( item.categoryChildren.length > 0 ) {
              defaultOpenKeys.push( String( item.id ) )
            }
          } )
        }
        this.setState( {
          classifyList: res.result,
          defaultOpenKeys
        } )
      }
    } )
  }

  // 查询条件表单筛选
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
    }, () => {
      this.getGoodsList( data );
    } )
  }

  // 单个商品信息设置回传
  handleSetGoodsInfo = ( Info, callFunc ) => {
    const { id } = Info
    this.fetchSingleGoodsInfo( id, callFunc )
  }

  // 编辑 / 新增 模块控制
  handleEditOrAddModalVisible = ( isAdd ) => {
    this.setState( {
      editOrAddVisible: !this.state.editOrAddVisible,
      isAdd,
    } )
  }

  handleSyncModalVisible = () => {
    this.setState( {
      syncModalVisible: !this.state.syncModalVisible,
    } )
  }

  // 侧边菜单栏搜索条件
  handleSearchClassify = ( { key } ) => {
    if ( key === '0' ) {
      this.setState( {
        cid: '',
        defaultSelectKeys: ['0']
      }, () => {
        this.filterSubmit( this.searchBar.current.data ) // 处理页码变化后进行分类查询的接口错误问题
      } )
    } else {
      this.setState( {
        cid: key,
        defaultSelectKeys: [key]
      }, () => {
        this.filterSubmit( this.searchBar.current.data )
      } )
    }
  }

  // 左侧菜单生成
  renderMultiMenu = ( keys, skeys ) => {
    const { classifyList } = this.state
    const { list = [] } = classifyList
    if ( !list.length ) return null
    const renderMyMenu = list && list.map( ( item ) => {
      if ( item.categoryChildren.length === 0 && item.status ) {
        return (
          <Menu.Item key={`${item.id}`} title={item.name}>
            <div className={styles.menu_title} style={item.img ? { marginRight: 32 } : {}}>
              {item.img && <img src={item.img} alt="" />}
              <span>{this.limitWords( item.name )}</span>
            </div>
          </Menu.Item>
        )
      }
      if ( item.categoryChildren.length > 0 && item.status ) {
        return (
          <Menu.SubMenu
            key={String( item.id )}
            title={
              <div onClick={( e ) => {
                e.stopPropagation();
                this.handleSearchClassify( { key: item.id } )
              }}
              >
                <div className={styles.menu_title} style={item.img ? { marginRight: 32 } : {}}>
                  {item.img && <img src={item.img} alt="" />}
                  <span>{this.limitWords( item.name )}</span>
                </div>
              </div>
            }
          >
            {
              Array.isArray( item.categoryChildren ) && item.categoryChildren.map( ( v ) => {
                if ( v.status ) {
                  return (
                    <Menu.Item style={{ paddingRight: 32 }} key={`${v.id}`} title={v.name}>
                      <div className={styles.menu_title} style={v.img ? { marginRight: 32 } : {}}>
                        {v.img && <img src={v.img} alt="" />}
                        <span>{this.limitWords( v.name )}</span>
                      </div>
                    </Menu.Item>
                  )
                }
              } )
            }
          </Menu.SubMenu>
        )
      }
    } )
    return (
      <Menu
        className={styles.global_styles}
        mode="inline"
        inlineCollapsed={false}
        openKeys={keys}
        selectedKeys={skeys}
        onSelect={( menu ) => {
          this.setState( { defaultSelectKeys: [menu.key] } )
        }}
        onOpenChange={( openKeys ) => { this.setState( { defaultOpenKeys: openKeys } ) }}
        onClick={this.handleSearchClassify}
        style={{ borderRight: '1px solid #f0edf1', paddingRight: '5px' }}
      >
        <Menu.Item key='0' title='全部'>全部</Menu.Item>
        {renderMyMenu}
      </Menu>
    )
  }

  renderCard = () => {
    const { loading } = this.props;
    const { itemWidth, colSpan, goodsListResult, merchantList, classifyList } = this.state;
    const itemSetting = {
      itemWidth,
      merchantList,
      classifyList: classifyList.list,
      getGoodsList: ( page ) => this.getGoodsList( this.searchBar.current.data, page ),
      handleSetGoodsInfo: this.handleSetGoodsInfo,
      fetchSingleGoodsInfo: this.fetchSingleGoodsInfo,
      handleEditOrAddModalVisible: this.handleEditOrAddModalVisible,
    }
    const cardItem = goodsListResult && goodsListResult.map( ( item, index ) => {
      const isLast = ( index + 1 ) % colSpan === 0
      return <SingleGoods goodsInfo={item} isLast={isLast} {...itemSetting} key={item.id} />
    } )
    return (
      <>
        <div className={styles.goodsItem_container} id='cardBox'>
          {cardItem}
          {goodsListResult.length <= 0 && <Empty style={{ width: '100%', marginTop: 150 }} />}
        </div>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Spin spinning={loading} />
        </div>
      </>
    )
  }

  render() {
    const { classifyLoading, loading } = this.props
    const {
      pageSize,
      pageNum,
      merchantList,
      isAdd,
      classifyList,
      goodsInfo,
      defaultOpenKeys,
      defaultSelectKeys,
      menuStyle,
      preSearchData
    } = this.state;

    const searchEleList = [
      {
        key: 'name',
        label: '商品名称',
        type: 'Input',
      },
      {
        key: 'type',
        label: '商品类型',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          // {
          //   value: 'RED',
          //   label: '红包',
          // },
          {
            value: 'COUPON',
            label: '虚拟卡券',
          },
          {
            value: 'GOODS',
            label: '实物',
          },
          {
            value:'TG_COUPON',
            label:'投顾卡券'
          },
          {
            value:'JN_RED',
            label:'绩牛红包'
          },
          {
            value:'JN_RIGHT',
            label:'绩牛权益'
          },
          
          // {
          //   value: 'PHONE',
          //   label: '直充',
          // },
          // {
          //   value: 'WX_COUPON',
          //   label: '微信立减金',
          // },
          // {
          //   value: 'WX_VOUCHER',
          //   label: '微信代金券',
          // },
          // {
          //   value: 'RIGHT_PACKAGE',
          //   label: '权益包',
          // },
          {
            value: 'CUSTOM',
            label: '自定义商品',
          },
        ]
      },
      // {
      //   key: 'preSalDivStock',
      //   label: '库存范围',
      //   type: 'Select',
      //   optionList: [
      //     {
      //       value: '',
      //       label: '全部',
      //     },
      //     {
      //       value: 100,
      //       label: '预售/库存(余额) > 100%',
      //     },
      //     {
      //       value: 200,
      //       label: '预售/库存(余额) > 200%',
      //     },
      //     {
      //       value: 500,
      //       label: '预售/库存(余额) > 500%',
      //     },
      //   ]
      // },
      {
        key: 'status',
        label: '权益状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 1,
            label: '上架',
          },
          {
            value: 0,
            label: '下架',
          },
        ]
      },
    ]

    return (
      <GridContent>
        <Card
          bordered={false}
          title={
            <div className={styles.grid_title}>
              <span>商品列表</span>
              {/* <Tooltip title='新增商品'>
                <img className={styles.title_icon} onClick={() => this.handleEditOrAddModalVisible( true )} src={addIcon} alt='' />
              </Tooltip> */}
              {/* <Tooltip title='同步商品'>
                <img className={styles.title_icon} onClick={() => this.handleSyncModalVisible()} src={syncIcon} alt='' />
              </Tooltip> */}
            </div>
          }
          extra={<Button type='primary' icon='plus-circle' onClick={() => this.handleEditOrAddModalVisible( true )}>新增商品</Button>}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.equity_card}>
            <div className={styles.classify_container}>
              <div className={styles.menu_container} style={menuStyle}>
                <h2 style={{ color:'#000000A6' }}>商品分类</h2>
                <Spin spinning={classifyLoading} delay={500}>
                  {this.renderMultiMenu( defaultOpenKeys, defaultSelectKeys )}
                </Spin>
              </div>
            </div>
            <div id='main_data' className={styles.main_data}>
              <div id='filter_form' className={styles.global_styles}>
                <SearchBar
                  ref={this.searchBar}
                  preSearchData={preSearchData}
                  searchEleList={searchEleList}
                  searchFun={this.filterSubmit}
                  loading={loading}
                />
              </div>
              <SingleGoodsEditOrAdd
                isAdd={isAdd}
                cid={this.state.cid}
                pageNum={pageNum}
                pageSize={pageSize}
                classifyList={classifyList.list}
                getGoodsList={( page ) => this.getGoodsList( this.searchBar.current.data, page )}
                editOrAddVisible={this.state.editOrAddVisible}
                handleEditOrAddModalVisible={this.handleEditOrAddModalVisible}
                goodsInfo={goodsInfo}
                merchantList={merchantList}
              />
              {/* <SyncModal
                classifyList={classifyList.list}
                visible={this.state.syncModalVisible}
                handleSyncModalVisible={this.handleSyncModalVisible}
                syncGoodsSource={this.state.syncGoodsSource}
              /> */}
              {this.renderCard()}
            </div>
          </div>
        </Card>
      </GridContent>
    );
  };
}

export default GoodsList;
