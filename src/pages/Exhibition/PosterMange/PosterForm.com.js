import React, { PureComponent, } from 'react';
import { Form, Select, Input } from 'antd';
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
class PosterForm extends PureComponent {
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
      department:info.department || '',

      // TODO:新增部分
      posterStatueList:[
        {label: "上架",value: "true"},
        {label: "下架",value: "false"}
      ],
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
    dispatch({
      type: 'exhibition/getMyOrgs',
      callFunc: (res) => {
        this.setInitForm(res)
      }
    })
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
    const { form: { getFieldDecorator }, myOrgs, tabName } = this.props;
    const { firstCompanyList, secendCompanyList, departmentList, formLayout, layout, info, selectWidth, branchFirst, branchSecond, department, posterStatueList , } = this.state;

    return (
      <Form layout={layout}>
        <FormItem label={tabName === "ranking" ? '标题':'名称'} {...formLayout}>
          {getFieldDecorator( tabName === "ranking" ?'title':'name', {
            initialValue: info.headCompany
          } )(
            <Input 
              style={{ width: selectWidth }} 
              placeholder={tabName === "ranking" ? '海报标题':'分类名称'}
            />
          )}
        </FormItem>
        <FormItem label='状态' {...formLayout}>
          {getFieldDecorator( 'isSale', {
            initialValue: info.headCompany
          } )(
            <Select 
              style={{ width: selectWidth }} 
              placeholder="选择状态"
            >
              {
                posterStatueList.map(item=>{
                  return <Option key={item.value} value={item.value}>{item.label}</Option>
                })
              }
            </Select>
          )}
        </FormItem>
        {this.props.children}
      </Form>
    )
  }
}

export default PosterForm;
