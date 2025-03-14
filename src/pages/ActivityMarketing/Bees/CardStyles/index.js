/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Empty, Spin, message } from 'antd';
import CardItem from './CardItem';
import styles from './index.less';

const getColSpan = winSize => {
  let colSpan = 6
  if ( winSize > 1920 ) colSpan = 8
  if ( winSize > 1680 && winSize <= 1920 ) colSpan = 7
  if ( winSize > 1600 && winSize <= 1680 ) colSpan = 6
  if ( winSize > 1280 && winSize <= 1600 ) colSpan = 5
  if ( winSize > 1024 && winSize <= 1280 ) colSpan = 4
  if ( winSize > 800 && winSize <= 1024 ) colSpan = 3
  if ( winSize <= 800 ) colSpan = 2
  return colSpan
}
@connect( ( { bees } ) => ( {
  loading: bees.loading,
  bees: bees.bees,
} ) )

class CardList extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 20,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      itemWidth: 0,
      beesList: [],
      noMore: false,
      colSpan: 0,
    }
    const dom = document.body.querySelectorAll( '.ant-layout' )[1]
    this.scrollDom = dom
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.listenResize.bind( this ) );
    this.scrollDom.addEventListener( "scroll", this.onScroll, false );
    this.listenResize()
    this.getList()
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.bees.pageNum === 1 ) {
      this.setState( {
        noMore: false,
        beesList: nextProps.bees.list
      } )
    }
    if ( this.props.bees.pageNum < nextProps.bees.pageNum ) {
      if ( nextProps.bees.list.length === 0 ) {
        message.info( '没有更多了' )
        this.setState( {
          noMore: true
        } )
      }
      const { beesList } = this.state;
      this.setState( {
        beesList: [...beesList, ...nextProps.bees.list]
      } )
    } else {
      this.setState( {
        pageNum: nextProps.bees.pageNum,
      } )
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.listenResize.bind( this ) );
    this.scrollDom.removeEventListener( "scroll", this.onScroll, false );
  }

  onScroll = () => {
    const { loading } = this.props;
    const { noMore } = this.state;
    if ( loading || noMore ) return
    const { scrollTop, scrollHeight, clientHeight } = this.scrollDom
    if ( scrollHeight - scrollTop - clientHeight <= 30 ) {
      const { pageNum } = this.state;
      this.setState( { pageNum: pageNum + 1 }, () => { this.getList() } )
    }
  }

  // 监听浏览器窗口改变
  listenResize = () => {
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth;  // 获取浏览器宽度
    const colSpan = getColSpan( winSize )
    const cardBox = document.getElementById( 'cardBox' )
    if ( cardBox && cardBox.offsetWidth ) {
      this.setState( {
        itemWidth: cardBox.offsetWidth / colSpan,
        colSpan
      } )
    }
  }

  // 获取列表数据
  getList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const { modalFilform } = this.props
    modalFilform( { pageNum, pageSize, sortedInfo } )
  }

  // 翻页
  paginationChange = ( pageNum ) => {
    const { pageSize, sortedInfo } = this.state;
    const { modalFilform } = this.props
    this.setState( {
      pageNum,
    }, modalFilform( { pageNum, pageSize, sortedInfo } ) );
  }

  render() {
    const { itemWidth, beesList, colSpan } = this.state
    const { loading } = this.props;
    const cardList = [{ isAddCard: true }, ...beesList]
    const cardItem = cardList.map( ( item, index ) => {
      const isLast = ( index + 1 ) % colSpan === 0
      if( cardList?.length === 1 ){
        return (
          <React.Fragment key={item.id || 'default'}>
            <CardItem item={item} isLast={isLast} {...this.props} itemWidth={itemWidth} />
            <Empty className={styles.activity_empty} /> 
          </React.Fragment>
        )
      }
      return <CardItem item={item} isLast={isLast} key={item.id || 'default'} {...this.props} itemWidth={itemWidth} />
    } )
    return (
      <>
        <div className={styles.blockActivityBox} id='cardBox' style={{ paddingBottom: 20 }}>
          {cardItem}
        </div>
        <Spin spinning={loading} style={{ paddingBottom: 20 }} />
      </>
    )
  }
}

export default CardList;
