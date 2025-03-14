import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Spin, Empty, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import Inventory from './Inventory/Inventory.js'
import FreezeDetail from './Inventory/FreezeDetail.js';
import styles from './MerchantRights.less';

// 根据视窗判断展示的个数
const getColSpan = winSize => {
  let colSpan = 6
  if (winSize > 1920) colSpan = 7
  if (winSize > 1680 && winSize <= 1920) colSpan = 6
  if (winSize > 1440 && winSize <= 1680) colSpan = 5
  if (winSize > 1160 && winSize <= 1440) colSpan = 4
  if (winSize > 800 && winSize <= 1160) colSpan = 3
  if (winSize <= 800) colSpan = 2
  return colSpan
}
@connect(({ merchantRights }) => {
  return {
    ...merchantRights
  }
})

class MerchantRights extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: 12,
      currentItem: null,
      freezeDetailVisibel: false,
      colSpan: 0,
      itemWidth: 0,
      noMore: false,
      rightList: [],
      merchantOption: [],
      preSearchData: {}
    }
    this.searchBar = React.createRef()
    const dom = document.body.querySelectorAll('.ant-layout')[1]
    this.scrollDom = dom
  }

  componentDidMount() {
    this.listenResize()
    window.addEventListener('resize', this.listenResize.bind(this));
    this.scrollDom.addEventListener("scroll", this.onScroll, false);
    this.clearRightsList()
  };

  clearRightsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantRights/clearRightsList',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rightList.pageNum === 1) {
      this.setState({
        noMore: false,
        rightList: nextProps.rightList.list
      })
    }
    if (this.props.rightList.pageNum < nextProps.rightList.pageNum) {
      if (nextProps.rightList.list.length === 0) {
        message.info('没有更多了')
        this.setState({
          noMore: true
        })
      }
      const { rightList } = this.state;
      this.setState({
        rightList: [...rightList, ...nextProps.rightList.list]
      })
    } else {
      this.setState({
        pageNum: nextProps.rightList.pageNum,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.listenResize.bind(this));
    this.scrollDom.removeEventListener("scroll", this.onScroll, false);
  }

  // 监听浏览器窗口改变
  listenResize = () => {
    const winSize = window.innerWidth ? window.innerWidth : document.body.clientWidth; // 获取浏览器宽度
    const colSpan = getColSpan(winSize);
    const cardBox = document.getElementById('cardBox')
    if (cardBox && cardBox.offsetWidth) {
      this.setState({
        itemWidth: cardBox.offsetWidth / colSpan,
        colSpan,
        pageSize: colSpan * 2
      }, () => this.getAllMerchant())
    }
  };

  onScroll = () => {
    const { loading } = this.props;
    const { noMore } = this.state;
    if (loading || noMore) return
    const { scrollTop, scrollHeight, clientHeight } = this.scrollDom
    if (scrollHeight - scrollTop - clientHeight <= 30) {
      const { pageNum } = this.state;
      this.setState({ pageNum: pageNum + 1 }, () => { this.getMerchantRightsData(this.searchBar.current.data) })
    }
  }

  // 获取商户列表
  getAllMerchant = () => {
    const { dispatch, history: { location: { query } } } = this.props
    dispatch({
      type: 'merchantRights/getMerchantNameList',
      payload: {},
      callBackFunc: (res) => {
        const { result } = res
        const merchantOption = [{ label: '全部', value: '' }]
        result.forEach(item => {
          const obj = { label: item.name, value: item.id }
          merchantOption.push(obj)
        })
        this.setState({
          merchantOption
        }, () => {
          if (query.id) {
            this.handlePreSearch()
          } else {
            this.getMerchantRightsData(this.searchBar.current.data)
          }
        })
      }
    })
  }

  // 接受路由传参
  handlePreSearch = () => {
    const { history: { location: { query } } } = this.props
    const data = { merchantId: Number(query.id) }
    this.setState({
      preSearchData: data
    }, () => this.filterSubmit(data))
  }

  // 冻结明细弹窗
  openFreezeDetailModal = (item) => {
    this.setState({
      currentItem: item,
      freezeDetailVisibel: true
    }, () => this.freezeModal.getFreezeDetail())
  }

  closeFreezeDetailModal = () => {
    this.setState({ freezeDetailVisibel: false })
  }

  // 筛选表单提交 请求数据
  filterSubmit = (data) => {
    this.setState({
      pageNum: 1
    }, () => {
      this.getMerchantRightsData(data);
    })
  }

  // 获取列表数据
  getMerchantRightsData = (data) => {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    const query = {...data}
    if(!query.sellOut) delete query.sellOut
    if(!query.tradeStatus) delete query.tradeStatus
    if(!query.type) delete query.type
    dispatch({
      type: 'merchantRights/getMerchantRights',
      payload: {
        page:{
          pageNum,
          pageSize,
        },
        ...query
      },
      callBackFunc: () => { }
    });
  }

  renderInventory = () => {
    const { loading } = this.props;
    const { itemWidth, colSpan, rightList, } = this.state;
    const itemSetting = {
      itemWidth,
      openFreezeDetailModal: this.openFreezeDetailModal,
      filterSubmit: () => this.filterSubmit(this.searchBar.current.data),
    }
    const cardItem = rightList && rightList.map((item, index) => {
      const isLast = (index + 1) % colSpan === 0
      return <Inventory inventoryInfo={item} isLast={isLast} {...itemSetting} key={item.id} />
    })
    return (
      <>
        <div className={styles.inventory_container} id='cardBox'>
          {cardItem}
          {
            rightList.length <= 0 &&
            <Empty style={{ width: '100%' }} />
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: 30 }}><Spin spinning={loading} /></div>
      </>
    )
  }

  render() {
    const { loading } = this.props;
    const { currentItem, merchantOption } = this.state;
    const searchEleList = [
      {
        key: 'merchantId',
        label: '商户名称',
        type: 'Select',
        optionList: merchantOption
      },
      {
        key: 'productName',
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
          {
            value: 'CUSTOM',
            label: '自定义商品',
          },
        ]
      },
      {
        key: 'sellOut',
        label: '库存状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'false',
            label: '有库存',
          }, {
            value: 'true',
            label: '无库存',
          },

        ]
      },
      {
        key: 'tradeStatus',
        label: '权益状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'NORMAL',
            label: '可用',
          }, {
            value: 'LOCK',
            label: '已冻结',
          },
        ]
      },
    ]
    return (
      <GridContent>
        <Card
          bordered={false}
          title="商户权益"
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              preSearchData={this.state.preSearchData}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
              loading={loading}
            />
          </div>
          {this.renderInventory()}
        </Card>
        {/* 冻结明细 */}
        <FreezeDetail
          visible={this.state.freezeDetailVisibel}
          handleCancel={this.closeFreezeDetailModal}
          inventoryInfo={currentItem}
          wrappedComponentRef={(ref) => { this.freezeModal = ref }}
        />
      </GridContent>
    );
  };
}

export default MerchantRights;
