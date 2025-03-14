import React, { PureComponent, } from 'react';
import { Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

const orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name: '总公司', listName:'firstCompanyList' },
  BRANCH_FIRST: { key: 'branchFirst', name: '一级分公司', listName:'secendCompanyList' },
  BRANCH_SECOND: { key: 'branchSecond', name: '二级分公司', listName:'departmentList' },
  DEPARTMENT: { key: 'department', name: '营业部' },
}
@connect( ( { exhibition } ) => ( {
  myOrgs: exhibition.myOrgs,
} ) )
@Form.create()
class CompanyForm extends PureComponent {
 
  constructor( props ) {
    const { info = {} } = props;
    const firstCompanyList = [];
    const secendCompanyList = [];
    const departmentList = [];
    if ( info.id ){
      const { branchFirst, department, branchSecond, companyInfoMap } = info;
      if ( branchFirst ) firstCompanyList.push( companyInfoMap.BRANCH_FIRST )
      if ( branchSecond ) secendCompanyList.push( companyInfoMap.BRANCH_SECOND )
      if ( department ) departmentList.push( companyInfoMap.DEPARTMENT )
    }
    super( props );
    this.state = {
      firstCompanyList,
      secendCompanyList,
      departmentList,
      formLayout: props.formLayout || 
        {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
          style: { minWidth: '20%' }
        },
      layout: props.layout || 'inline',
      info:props.info || {},
      selectWidth:props.selectWidth || 150,
      branchFirst:info.branchFirst || '',
      branchSecond:info.branchSecond || '',
      department:info.department || ''
    };

  }


  componentDidMount() {
    const { myOrgs } = this.props;
    this.props.onRef( this )
    if ( myOrgs ) {
      this.setInitForm( myOrgs )
    }else{
      this.getMyOrys();
    }
  } 


  getMyOrys = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getMyOrgs',
      callFunc: ( res ) => {
        this.setInitForm( res )
      }
    } )
  }

  // 初始化选择器的值
  setInitForm = ( orgsObj ) => {
    const { form } = this.props;
    const params = {};
    
    Object.keys( orgsObj ).forEach( item => {
      params[orgNameObj[item].key] = orgsObj[item].id
    } )
    form.resetFields();
    form.setFieldsValue( params )
    if ( !orgsObj.DEPARTMENT ) this.getSelectList( orgsObj.BRANCH_SECOND || orgsObj.BRANCH_FIRST || orgsObj.HEAD_COMPANY )
  }

  // 修改一级分公司
  firstChange = ( id ) =>{
    this.setState( { branchSecond:'', department:'' } )
    this.getSelectList( { id, type:'BRANCH_FIRST' } )
    this.props.form.resetFields( ['branchSecond', 'department'] );

  }

  // 修改二级分公司
  secendChange = ( id ) =>{
    this.setState( { department:'' } )
    this.getSelectList( { id, type:'BRANCH_SECOND' } )
    this.props.form.resetFields( ['department'] );

  }

  // 获取选项
  getSelectList = ( params ) =>{
    const { dispatch } = this.props;
    const parentId = params && params.id  || "";
    dispatch( {
      type:'exhibition/getBrachList',
      payload:{ parentId },
      callFunc: ( res ) => {
        this.setState( {
          [orgNameObj[params.type].listName]:res
        } )
      }
    } )
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  // 清空
  formReset = () => {
    const {  myOrgs } = this.props;
    this.setInitForm( myOrgs )
  }


  render() {
    const { form: { getFieldDecorator }, myOrgs } = this.props;
    const { firstCompanyList, secendCompanyList, departmentList, formLayout, layout, info, selectWidth, branchFirst, branchSecond, department } = this.state;

    return (
      <Form layout={layout}>
        <FormItem label='总公司' {...formLayout}>
          {getFieldDecorator( 'headCompany', {
            initialValue: info.headCompany
          } )(
            <Select 
              style={{ width: selectWidth }} 
              placeholder="选择一级分公司"
              disabled={!!( myOrgs && myOrgs.HEAD_COMPANY )}
            >
              {
                myOrgs && myOrgs.HEAD_COMPANY &&
                <Option value={myOrgs.HEAD_COMPANY.id}>{myOrgs.HEAD_COMPANY.name}</Option>
             }
            </Select>
          )}
        </FormItem>
        <FormItem label='一级分公司' {...formLayout}>
          {getFieldDecorator( 'branchFirst', {
            initialValue: branchFirst || ''
          } )(
            <Select 
              style={{ width: selectWidth }}
              onChange={this.firstChange}
              placeholder="选择一级分公司"
              disabled={!!( myOrgs && myOrgs.BRANCH_FIRST )}
            >
              <Option value="">全部</Option>
              {
                myOrgs && myOrgs.BRANCH_FIRST &&
                <Option value={myOrgs.BRANCH_FIRST.id}>{myOrgs.BRANCH_FIRST.name}</Option>
              }
              {/* {firstCompanyList.length > 0 && <Option value="">全部</Option>} */}
              {
                firstCompanyList.length > 0 && 
                firstCompanyList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
              }
            </Select>
          )}
        </FormItem>
        <FormItem label='二级分公司' {...formLayout}>
          {getFieldDecorator( 'branchSecond', {
            initialValue: branchSecond || ''
          } )(
            <Select 
              style={{ width: selectWidth }} 
              onChange={this.secendChange}
              placeholder="选择二级分公司"
              disabled={!!( myOrgs && myOrgs.BRANCH_SECOND )}
            >
              <Option value="">全部</Option>
              {
                myOrgs && myOrgs.BRANCH_SECOND &&
                <Option value={myOrgs.BRANCH_SECOND.id}>{myOrgs.BRANCH_SECOND.name}</Option>
              }
              {/* {secendCompanyList.length > 0 && <Option value="">全部</Option>} */}
              {
                secendCompanyList.length > 0 &&
                secendCompanyList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
              }
            </Select>
          )}
        </FormItem>
        <FormItem label='营业部' {...formLayout}>
          {getFieldDecorator( 'department', {
            initialValue: department || ''
          } )(
            <Select 
              style={{ width: selectWidth }}
              placeholder="选择营业部"
              disabled={!!( myOrgs && myOrgs.DEPARTMENT )}
            >
              <Option value="">全部</Option>
              {
                myOrgs && myOrgs.DEPARTMENT &&
                <Option value={myOrgs.DEPARTMENT.id}>{myOrgs.DEPARTMENT.name}</Option>
              }
              {/* {departmentList.length > 0 && <Option value="">全部</Option>} */}
              {
                departmentList.length > 0 &&
                departmentList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
              }
            </Select>
          )}
        </FormItem>
        {this.props.children}

      </Form>

    )
  }

}

export default CompanyForm;
