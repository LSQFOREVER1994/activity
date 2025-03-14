import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Table, Input } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name: '总公司' },
  BRANCH_FIRST: { key: 'branchFirst', name: '一级分公司' },
  BRANCH_SECOND: { key: 'branchSecond', name: '二级分公司' },
  DEPARTMENT: { key: 'department', name: '营业部' },
}
const tabList = [
  { name: '排名', key: 'ranking' },
  { name: '活跃度', key: 'liveness' },
]

const columnObj = {
  ranking: [ 'name', 'telephone', 'views', 'shares', 'favorites'],
  liveness: [ 'name', 'telephone', 'logins', 'reviews', 'shares'],
}
// const sortObj = { 
//   ascend:'asc',
//   descend:'desc'
// }
@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  myOrgs: exhibition.myOrgs,
  typeUserData: exhibition.typeUserData,
} ) )
@Form.create()
class UserData extends PureComponent {
  timer = null;

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
      activeTab: 'ranking',
      // rangeTime: [],
      // name:'',
      // usreOrge:{},
      // userNameLest:[],
      sortedInfo:{
        columnKey:'views',
        field: 'views',
        order: 'descend',
      },
      sortedInfo1:{
        columnKey:'logins',
        field: 'logins',
        order: 'descend',
      }
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
    // this.setState( { usreOrge:params } )
    this.fetchList( params )
    // this.getUserList( params )
  }

  // 获取列表
  fetchList = ( params ) => {
    const { activeTab, sortedInfo={}, sortedInfo1={} } = this.state;
    const { dispatch, typeUserData: { pageNum }, form } = this.props;
    const values = this.compayForm.getValues()
    const searchValues = form.getFieldsValue();
    const formValueObj = searchValues
    const { rangeTime }= formValueObj;
    // eslint-disable-next-line no-nested-ternary
    const sortValue = activeTab === 'ranking' ? ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc' : ( sortedInfo1.order === 'descend' ) ? 'desc' : 'asc';
    // eslint-disable-next-line no-nested-ternary
    const orderBy = activeTab === 'ranking' ? ( sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '' ) : ( sortedInfo1.columnKey ? `${ sortedInfo1.columnKey || '' } ${ sortValue }`: '' )
    // let from = '';
    // let to = '';
    if( rangeTime && rangeTime.length > 0 ){
      formValueObj.from = moment( rangeTime[0] ).format( 'YYYY-MM-DD' )
      formValueObj.to = moment( rangeTime[1] ).format( 'YYYY-MM-DD' )
    }
    delete formValueObj.rangeTime
    dispatch( {
      type: 'exhibition/getTypeUserData',
      payload: {
        pageNum: pageNum || 1,
        pageSize: 10,
        type: activeTab,
        // name,
        // from,
        // to,
        orderBy,
        // orderBy:sortedInfo,
        ...values,
        ...formValueObj,
        ...params,
      },
    } );
  }

  // //  获取员工名字列表
  // getUserList =( params )=>{
  //   // console.log( 'name', name )
  //   const{ name }=this.state;
  //   const { dispatch } = this.props;
  //   const $this = this
  //   dispatch( {
  //     type: 'exhibition/getUserNameList',
  //     payload: {
  //       keyword:name,
  //       ...params
  //     },
  //     callFunc:( result )=>{
  //       // console.log( 'result', result )
  //       $this.setState( { userNameLest:result } )
  //     }
  //   } );

  // }

  sorter = ( sort ) => {
    console.log( 'sort: ', sort );

  }

  // onChange = ( dates ) => {
  //   this.setState( { rangeTime: dates } )
  // }
  
  //  Tab求换
  changeTab = ( tab ) => {
    this.setState( { activeTab: tab.key }, ()=>{
      this.searchReset()
      // this.fetchList( { pageNum:1 } )
    } )
  }
   
  //  清空
  searchReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.compayForm.formReset();
    this.fetchList( { pageNum:1 } )
  }

  //  页码切换，排序切换
  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order:'descend', ...sorter, }
    const { activeTab } = this.state;
    const { current, pageSize } = pagination;
    // const orderBy = sorter.order ? `${sorter.field} ${sortObj[sorter.order]}` : ''
    if( activeTab === 'ranking' ){
      this.setState( { sortedInfo:sotrObj }, () => {
        this.fetchList( { pageNum: current, pageSize } );
      } )
    }else{
      this.setState( { sortedInfo1:sorter }, () => {
        this.fetchList( { pageNum: current, pageSize } );
      } )
    }

  }


  render() {
    const { activeTab, sortedInfo, sortedInfo1 } = this.state;
    const { typeUserData: { list, pageSize, total, pageNum = 1 }, loading, form: { getFieldDecorator } } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };
    const columns = [
      {
        title: '员工',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '微信授权手机号',
        dataIndex: 'telephone',
        key: 'telephone',
        align: 'center'
      },
      {
        title: '浏览量/排名',
        dataIndex: 'views',
        key: 'views',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'views' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:( views, item )=><span>{item.views}/{item.viewRank}</span>
      },
      {
        title: '登录次数',
        dataIndex: 'logins',
        key: 'logins',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo1.columnKey === 'logins' && sortedInfo1.order,
        sortDirections: ['descend', 'ascend'],
        render:logins=><span>{logins}</span>
      },
      {
        title: activeTab === 'ranking' ? '转发量/排名' : '转发次数',
        dataIndex: 'shares',
        key: 'shares',
        align: 'center',
        sorter: true,
        sortOrder: activeTab === 'ranking' ? sortedInfo.columnKey === 'shares' && sortedInfo.order :sortedInfo1.columnKey === 'shares' && sortedInfo1.order,
        sortDirections: ['descend', 'ascend'],
        // render:( shares, item )=><span>{item.shares}/{item.shareRank}</span>
        render:( shares, item )=>{
          if( activeTab === 'ranking' ){
            return ( <span>{item.shares}/{item.shareRank}</span> )
          }
            return ( <span>{item.shares}</span> )
        }
      },
      {
        title: '收藏量/排名',
        dataIndex: 'favorites',
        key: 'favorites',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'favorites' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:( favorites, item )=><span>{item.favorites}/{item.favoriteRank}</span>
      },
      {
        title: '发布点评',
        dataIndex: 'reviews',
        key: 'reviews',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo1.columnKey === 'reviews' && sortedInfo1.order,
        sortDirections: ['descend', 'ascend'],
        render:reviews=><span>{reviews}</span>
      },
      // {
      //   title: '转发次数',
      //   dataIndex: 'shares',
      //   key: 'shares',
      //   align: 'center',
      //   sorter: true,
      //   sortOrder: sortedInfo1.columnKey === 'shares' && sortedInfo1.order,
      //   sortDirections: ['descend', 'ascend'],
      //   render:shares=><span>{shares}</span>
      // },
    ];
    return (
      <GridContent>
        <div style={{ backgroundColor: '#fff', marginBottom: 20, padding:'20px 20px 0 20px' }}>
          <CompanyForm onRef={div => { this.compayForm = div }} />
          <Form onSubmit={this.filterSubmit} layout="inline" style={{ marginTop:'15px' }}>
            <FormItem label='员工' {...this.formLayout}>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="输入员工"
                  style={{ width: 150 }}
                />
              )}
            </FormItem>

            <FormItem label='手机号' {...this.formLayout}>
              {getFieldDecorator( 'telephone', {
              } )(
                <Input
                  placeholder="输入微信授权手机号"
                  style={{ width: 150 }}
                />
              )}
            </FormItem>

            <FormItem label='时间' {...this.formLayout}>
              {getFieldDecorator( 'rangeTime', {
              } )( <RangePicker style={{ width:250 }} /> )}
            </FormItem>
            <div style={{ float:'right' }}>
              <Button
                type="primary"
                style={{ marginLeft: 15, marginRight: 15, marginTop: 4 }}
                onClick={() => { this.fetchList( { pageNum:1 } )}}
              >搜索
              </Button>
              <Button
                type="primary"
                style={{ marginTop: 4 }}
                onClick={this.searchReset}
              >清空
              </Button>
            </div>
          </Form>
          <Tabs activeTab={activeTab} changeTab={this.changeTab} />
        </div>

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

export default UserData;

const Tabs = ( { activeTab, changeTab } ) => {
  return (
    <div className={styles.user_data_tabs_box}>
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
