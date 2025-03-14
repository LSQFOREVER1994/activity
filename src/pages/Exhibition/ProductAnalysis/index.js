import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Table } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';
import NoAccess from '../noAccess'

const { RangePicker } = DatePicker;


const orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name: '总公司' },
  BRANCH_FIRST: { key: 'branchFirst', name: '一级分公司' },
  BRANCH_SECOND: { key: 'branchSecond', name: '二级分公司' },
  DEPARTMENT: { key: 'department', name: '营业部' },
}
const tabList = [
  { name: '资讯点评', key: 'news' },
  { name: '热点资讯', key: 'information' },
  // { name: '投顾观点', key: 'view' },
  { name: '决策商城', key: 'mall' },
]

const columnObj = {
  news: ['title', 'name', 'views', 'shares', 'favorites'],
  information: ['title', 'views', 'shares', 'favorites'],
  // view: ['title', 'views', 'shares', 'favorites'],
  mall: ['title', 'views', 'shares', ],
}
// const sortObj = { 
//   ascend:'asc',
//   descend:'desc'
// }
@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  myOrgs: exhibition.myOrgs,
  productAnalysisData: exhibition.productAnalysisData,
} ) )
@Form.create()
class UserAnalysis extends PureComponent {

  compayForm

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };


  constructor( props ) {
    super( props );
    this.state = {
      myOrgs: props.myOrgs,
      activeTab: 'news',
      rangeTime: [],
      // orderBy:'',
      sortedInfo:{
        columnKey:'views',
        field: 'views',
        order: 'descend',
      },
    }
  }

  componentDidMount() {
    const { myOrgs } = this.state;
    if ( myOrgs ) {
      this.getFetchBefor( myOrgs )
    }
  }


  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.myOrgs !== prevState.myOrgs ) {
      return {
        myOrgs: nextProps.myOrgs
      }
    }
    return null
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( prevState.myOrgs !== this.state.myOrgs ) {
      this.getFetchBefor( this.state.myOrgs )
    }
    }

  getFetchBefor = ( myOrgs ) => {
    const params = {};
    Object.keys( myOrgs ).forEach( item => {
      params[orgNameObj[item].key] = myOrgs[item].id
    } )
    this.fetchList( params )
  }

  // 获取列表
  fetchList = ( params ) => {
    const { activeTab, rangeTime, sortedInfo={} } = this.state;
    const { dispatch, productAnalysisData: { pageNum } } = this.props;
    const values = this.compayForm.getValues();
    const sortValue = sortedInfo.order === 'descend' ? 'desc' : 'asc';
    const orderBy = sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '';
    let from = '';
    let to = '';
    if( rangeTime.length > 0 ){
      from = moment( rangeTime[0] ).format( 'YYYY-MM-DD' )
      to = moment( rangeTime[1] ).format( 'YYYY-MM-DD' )
    }
    dispatch( {
      type: 'exhibition/getProductAnalysisData',
      payload: {
        pageNum: pageNum || 1,
        pageSize: 10,
        type: activeTab,
        from,
        to,
        orderBy,
        ...values,
        ...params,
      },
    } );
  }

  sorter = ( sort ) => {
    console.log( 'sort: ', sort );

  }

  onChange = ( dates ) => {
    this.setState( { rangeTime: dates } )
  }
  
  changeTab = ( tab ) => {
    this.setState( { 
      activeTab: tab.key,
      sortedInfo:{
        columnKey:'views',
        field: 'views',
        order: 'descend',
      },
     }, ()=>{
      this.fetchList( { pageNum:1 } )
    } )
  }
   
  searchReset = () => {
    this.setState( { rangeTime: [] }, () => {
      this.compayForm.formReset();
      this.fetchList( { pageNum: 1 } );
    } )
  }

  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }

    this.setState( { sortedInfo:sotrObj }, () => {
      this.fetchList( { pageNum: current, pageSize } );
    } )
    // const orderBy = sorter.order ? `${sorter.field} ${sortObj[sorter.order]}` : ''
    // this.setState( { orderBy }, () => {
    //   this.fetchList( { pageNum: current, pageSize } );
    // } )

  }

  render() {
    const { activeTab, rangeTime, sortedInfo } = this.state;
    const { productAnalysisData: { list, pageSize, total, pageNum = 1 }, loading } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width:500,
        render:title=><span>{title || '--'}</span>
      },
      {
        title: '员工',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '浏览',
        dataIndex: 'views',
        key: 'views',
        align: 'center',
        sorter: true,
         // sortOrder:'descend',
        sortOrder: sortedInfo.columnKey === 'views' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:views=><span>{views}</span>
      },
      {
        title: '转发',
        dataIndex: 'shares',
        key: 'shares',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'shares' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:shares=><span>{shares}</span>
      },
      {
        title: '收藏',
        dataIndex: 'favorites',
        key: 'favorites',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'favorites' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:favorites=><span>{favorites}</span>
      },
    ];
    return (
      <GridContent>
        {/* <div style={{ fontSize:16, padding:'16px 24px', color:'rgba(0,0,0,.85)', backgroundColor: '#fff', fontWeight:'bold' }}>用户分析</div> */}
        <div style={{ backgroundColor: '#fff', marginBottom: 20, padding: 20 }}>
          <CompanyForm onRef={div => { this.compayForm = div }} />
          <div style={{ marginTop: 20, }}>
            <div style={{ display: 'inline-block' }}>
              <span style={{ color: 'rgba(0,0,0,.85)', width: 78, display: 'inline-block', textAlign: 'right' }}>时间：</span>
              <RangePicker onChange={this.onChange} value={rangeTime} />

            </div>
            <div style={{ float: 'right', paddingRight: 50 }}>
              <Button
                type="primary"
                style={{ marginLeft: 15, marginRight: 15, marginTop: 4 }}
                onClick={() => { this.fetchList() }}
              >搜索
              </Button>
              <Button
                type="primary"
                style={{ marginTop: 4 }}
                onClick={this.searchReset}
              >清空
              </Button>
            </div>
          </div>
        </div>
        <Tabs activeTab={activeTab} changeTab={this.changeTab} />
        <div style={{ backgroundColor:'#fff', padding:20, marginBottom:20 }}>
          <Table
            loading={loading}
            rowKey="id"
            columns={columns.filter( item => columnObj[activeTab].includes( item.key ) )}
            dataSource={list}
            pagination={paginationProps}
            onChange={this.tableChange}
          />
        </div>
      </GridContent>
    );
  }
}

export default UserAnalysis;

const Tabs = ( { activeTab, changeTab } ) => {
  return (
    <div className={styles.user_tabs_box}>
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
