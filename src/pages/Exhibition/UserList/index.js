import React, { PureComponent, memo } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';
import UserForm from './UserForm.com';
import InfoForm from './InfoFrom.com';

// const { confirm } = Modal;
const FormItem = Form.Item;
const  orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name:'总公司' },
  BRANCH_FIRST: { key: 'branchFirst', name:'一级分公司' },
  BRANCH_SECOND: { key: 'branchSecond', name:'二级分公司' },
  DEPARTMENT: { key: 'department', name:'营业部' },
}
@connect( ( { exhibition } ) => ( {
  myOrgs: exhibition.myOrgs,
  loading: exhibition.loading,
  userData: exhibition.userData,
  userTotalData: exhibition.userTotalData,
} ) )
@Form.create()
class Resource extends PureComponent {
  compayForm

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };

  constructor( props ){
    super( props );
    this.state = {
      visible: false,
      infoVisible: false,
      info: {},
      myOrgs: props.myOrgs
    }
  }

  componentDidMount() {
    const { myOrgs } = this.state;
    if( myOrgs ){
      this.getFetchBefor( myOrgs )
    }
    this.getUserTotal();
  }


  static getDerivedStateFromProps( nextProps, prevState ){
    if( nextProps.myOrgs !== prevState.myOrgs ){
      return {
        myOrgs: nextProps.myOrgs
      }
    }
    return null
  }

  componentDidUpdate( prevProps, prevState ){
    if ( prevState.myOrgs !== this.state.myOrgs ){
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

  getUserTotal = () =>{
    const { dispatch } = this.props;
    dispatch( {
      type:'exhibition/getUserTotal'
    } )
  }

  getMyOrys = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getMyOrgs',
      callFunc: ( res ) => {
        const params = {};
        Object.keys( res ).forEach( item => {
          params[orgNameObj[item].key] = res[item].id
        } )
        this.fetchList( params )
      }
    } )
  }


  //  获取列表
  fetchList = ( params = {} ) => {
    const { dispatch, userData: { pageNum }, form } = this.props;
    const values = this.compayForm.getValues()
    const searchValues = form.getFieldsValue()
    dispatch( {
      type: 'exhibition/getUserData',
      payload: {
        pageNum: pageNum || 1,
        pageSize: 10,
        ...values,
        ...searchValues,
        ...params,
      },
    } );
  }

  searchReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.compayForm.formReset();
    this.fetchList( { pageNum:1 } );
  }


  // deleteItem = ( data ) => {
  //   const { dispatch } = this.props;
  //   const { id, name } = data;
  //   const that = this;
  //   confirm( {
  //     cancelText: '取消',
  //     okText: '确定',
  //     title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
  //     onOk() {
  //       dispatch( {
  //         type: 'exhibition/deleteUser',
  //         payload: { id },
  //         callFunc: () => {
  //           that.fetchList();
  //           that.getUserTotal();
  //         },
  //       } );
  //     },
  //   } );
  // }

  changeItem =( data )=>{
    const { dispatch } = this.props;
    const { isAdvisor }=data;
    dispatch( {
      type:'exhibition/updateUser',
      payload:{
        ...data,
        isAdvisor:isAdvisor ? !isAdvisor : true
      },
      callFunc: () => {
        // message.success( '修改状态成功' )
        this.getUserTotal();
        this.fetchList();
      },
    } )
  }

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
  }


  formReset = () => {
    const { form } = this.props;
    this.compayForm.formReset()
    form.resetFields()
  }

  saveBack = () => {
    this.setState( { visible:false } )
    this.fetchList();
  }

  saveBackInfo = () => {
    this.setState( { infoVisible:false } )
    this.fetchList();
  }

  showEditModal = ( info ) => {
    this.setState( { visible: true, info  } )
  }

  showInfoEditModal = ( info ) => {
    this.setState( { infoVisible: true, info  } )
  }


  render() {
    const {
      loading, form: { getFieldDecorator }, userData: { list = [], total = 0, pageNum = 1, pageSize }, userTotalData
    } = this.props;
    const { info, visible, infoVisible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current: pageNum,
      pageSize,
    };

    const columns = [
      {
        title: '员工',
        dataIndex: 'name',
      },
      {
        title: '微信授权手机号',
        dataIndex: 'telephone',
        width:150
      },
      {
        title: '总公司',
        dataIndex: 'headCompany',
        align: 'center',
        render: ( value, record ) => record.companyInfoMap.HEAD_COMPANY ? record.companyInfoMap.HEAD_COMPANY.name : '--'
      },
      {
        title: '一级分公司',
        dataIndex: 'branchFirst',
        align: 'center',
        render: ( value, record ) => record.companyInfoMap.BRANCH_FIRST ? record.companyInfoMap.BRANCH_FIRST.name : '--'
      },
      {
        title: '二级分公司',
        dataIndex: 'branchSecond',
        align: 'center',
        render: ( value, record ) => record.companyInfoMap.BRANCH_SECOND ? record.companyInfoMap.BRANCH_SECOND.name : '--'
      },
      {
        title: '营业部',
        dataIndex: 'department',
        align:'center',
        render: ( value, record ) => record.companyInfoMap.DEPARTMENT ? record.companyInfoMap.DEPARTMENT.name : '--'
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        align: 'center',
        render: ( data ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={() => this.showInfoEditModal( data )}
            >详情
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( data )}
            >编辑
            </span>
            <span
              style={{ cursor: 'pointer', color:data.isAdvisor ? '#f5222d' : '#52c41a' }}
              type="link"
              onClick={() => this.changeItem( data )}
            >
              {data.isAdvisor ? '禁用'  :'启用'}
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Total data={userTotalData} />
        <div style={{ backgroundColor: '#fff', marginBottom: 20, padding: 20 }}>
          <CompanyForm onRef={div => { this.compayForm = div }} />
          <Form onSubmit={this.filterSubmit} layout="inline">
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
            <div style={{ float:'right', paddingRight:50 }}>
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
        </div>
        <Card
          className={styles.listCard}
          bordered={false}
          title="员工列表"
          extra={
            <Button
              type="primary"
              style={{ marginTop: 4 }}
              onClick={() => { this.showEditModal( {} )}}
            >新增
            </Button>
              }
        >
          <Table
            size="large"
            rowKey='id'
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
          <UserForm 
            visible={visible} 
            saveBack={this.saveBack} 
            onCancel={()=>{this.setState( { visible:false } )}}
            info={info}
          />
          <InfoForm 
            visible={infoVisible} 
            info={info}
            saveBack={this.saveBackInfo}
            onCancel={() => { this.setState( { infoVisible: false } ) }}
          />
        </Card>
      </GridContent>
    );
  }
}

export default Resource;


const Total = memo( ( { data } ) => {  
  return (
    <div style={{ backgroundColor:'#fff', marginBottom:20, padding:20, display:'flex' }}>
      <div className={styles.user_total_item}>
        <div>总计人数</div>
        <div className={styles.user_total_item_num}>{data && data.totalCount}人</div>
      </div>
      {data && data.branchTotalList && data.branchTotalList.length > 0 && 
        data.branchTotalList.map( item => (
          <div className={styles.user_total_item} key={item.companyType}>
            <div>{orgNameObj[item.companyType].name}</div>
            <div className={styles.user_total_item_num}>{item.total}人</div>
          </div>
        ) )
      }
    </div>
  )

} )