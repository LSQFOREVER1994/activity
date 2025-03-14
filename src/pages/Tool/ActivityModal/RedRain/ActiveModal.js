import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Steps, Alert, Select, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';
import TaskModal from '../../TaskModal/TaskModal';
import WxShare from './WxShare';
import styles from '../ActivityModal.less';

const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;


@connect( ( { activity } ) => ( {
  loading: activity.loading,
  purchasesRecordData: activity.purchasesRecordData,
} ) )
@Form.create()
class ActiveModal extends PureComponent {
  timer = null;

  formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      taskData:props.data && props.data.taskGroup,
      currentStep:0,
      purchasesRecorList:[]
    }
  }

  componentDidMount() {
    this.fetchList( {} )
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }

  //  获取仿真记录列表
  fetchList = ( { name='' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getPurchasesRecordData',
      payload: {
        pageNum: 1,
        pageSize: 20,
        orderBy: 'create_time desc',
        name
      },
      callFunc:( res )=>{
        this.props.onPreview();
        this.setState( { purchasesRecorList:res } )
      }
    } );
  }

  // getValues = () => {
  //   const subjectData = this.getSubjectValues();
  //   // const ruesltData = this.RuesltRef.getValues();
  //   const prizeData = this.prizeRef.getValues();
  //   return {
  //     ...subjectData,
  //     // ...ruesltData,
  //     ...prizeData,
  //   }
  // }

  // getHandleValues = () =>{
  //   const subjectData = this.getSubjectValuesObj();
  //   // const ruesltData = this.RuesltRef.getHandleValues();
  //   const prizeData = this.prizeRef.getHandleValues();
  //   if( subjectData && prizeData ){
  //     return {
  //       subjectData,
  //       // ruesltData,
  //       prizeData,
  //     }
  //   }
  //   return false
  // }

  //  仿真中奖动态搜索
  onSearch = ( name ) =>{
    this.fetchList( { name } )
  }

  //  提交表单数据
  handleSubmit=()=>{
    let param ={}
    const  peizeList= this.prizeRef.getData();
    const taskGroup = this.taskRef.getValues();
    const shareData =this.shareRef.getData();
    const{ form:{ validateFields } }=this.props;
    if( peizeList ){
      validateFields( ( err, val )=>{
        if ( err ) return;
        param = Object.assign( { ...peizeList }, { ...val }, { taskGroup }, { ...shareData } )
      } )
      return param
    }
    return false
  }

  //  获取表单数据
  getValues = () => {
    const { form } = this.props;
    const peizeList = this.prizeRef.getValues();
    const taskGroup = this.taskRef.getValues();
    const shareData =this.shareRef.getData();
    const data = form.getFieldsValue();
    const param = Object.assign( { ...data }, { ...peizeList }, { taskGroup }, { ...shareData } )
    return param;
  }



  Modal = ()=>{
    const { form: { getFieldDecorator }, data } = this.props;
    const { purchasesRecorList }=this.state;
    return (
      <GridContent>
        <div className={styles.red_share_title}>（选填）仿真记录</div>
        <div className={styles.red_rain_prize}>
          <Alert
            style={{ marginBottom: 15 }}
            className={styles.edit_alert}
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>添加仿真记录前需预先配置 ，若已配置请忽略 </span>
                <span onClick={() => { window.open( `${window.location.origin}/oldActivity/tool/purchasesRecord` )}} style={{ color: '#1890FF', cursor:'pointer' }}>仿真购买/中奖</span>
              </div> )}
            banner
          />
          <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
            <FormItem label='仿真记录' {...this.formLayout}>
              {getFieldDecorator( 'recordTemplateId', {
                rules: [{ required: false, message: `请选择记录名称` }],
                initialValue: data.recordTemplateId,
              } )(
                <Select
                  onSearch={this.onSearch}
                  showSearch
                  filterOption={false}
                  onChange={()=>this.fetchList( {} )}
                  style={{ width:'80%' }}
                  placeholder='请选择记录名称'
                >
                  <Option value="" key="">不设置</Option>
                  {
                    purchasesRecorList.length > 0 &&  purchasesRecorList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
                  }
                </Select>
              )}
            </FormItem>
          </Form>
        </div>
      </GridContent>
    )
  }


  render() {
    const { currentStep, canChangeStep, taskData } = this.state;
    const { onPreview, data } = this.props;
    const stepList = [
      {
        name: <p><span style={{ color:'red' }}>*</span>奖品配置</p>,
        content: data &&
        <PrizeTable
          data={data}
          onRef={( prize ) => {this.prizeRef = prize}}
          onPreview={onPreview}
        />
      },
      {
        name:'仿真记录',
        content: data && this.Modal()
      },
      {
        name: '任务设置',
        content: data &&
        <TaskModal
          taskData={taskData}
          onPreview={onPreview}
          onRef={( ref )=>{this.taskRef = ref}}
        />
      },
      {
        name: '微信分享',
        content: data &&
        <WxShare
          data={data}
          onRef={( prize ) => {this.shareRef = prize}}
          onPreview={onPreview}
        />
      },
    ]
    return (
      <GridContent style={{ paddingLeft:30 }}>
        <div style={{ width:'100%', backgroundColor:'#fff' }}>
          <Steps
            size="small"
            current={currentStep}
            progressDot
            onChange={( value ) => { this.setState( { currentStep: value } ) }}
            className={styles.edit_acitve_steps}
            // style={{ width:'50%' }}
          >
            {
              stepList.map( step => (
                <Step
                  title={step.name}
                  key={step.name}
                  style={{ cursor: canChangeStep ? 'pointer' :'default' }}
                />
              ) )
            }
          </Steps>
        </div>

        {
          stepList.map( ( step, index ) => (
            <div
              key={step.name}
              className={styles.collect_edit_active_content}
              style={{ display: currentStep === index? 'block' :'none' }}
            >
              {step.content}
            </div>
          ) )
        }

      </GridContent>
    );

  }
}

export default ActiveModal;
