import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Steps, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';
import WxShare from './WxShare'
import styles from '../ActivityModal.less';

const { Step } = Steps;


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
      currentStep:0,
      // purchasesRecorList:[]
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
        name
      },
      callFunc:()=>{
        this.props.onPreview();
        // this.setState( { purchasesRecorList:res } )
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
    const shareData =this.shareRef.getData();
    const{ form:{ validateFields } }=this.props;
    if( peizeList ){
      validateFields( ( err, val )=>{
        if ( err ) return;
        param = Object.assign( { ...peizeList }, { ...val }, { ...shareData } )
      } )
      return param
    }
    return false
  }

  //  获取表单数据
  getValues = () => {
    const { form } = this.props;
    const peizeList = this.prizeRef.getValues();
    const shareData =this.shareRef.getData();
    const data = form.getFieldsValue();
    const param = Object.assign( { ...data }, { ...peizeList }, { ...shareData } )
    return param;
  }

  render() {
    const { currentStep, canChangeStep } = this.state;
    const { onPreview, data } = this.props;
    const stepList = [
      { 
        name: <p><span style={{ color:'red' }}>*</span>活动奖品</p>, 
        content: data && 
        <PrizeTable
          data={data}
          onRef={( prize ) => {this.prizeRef = prize}}
          onPreview={onPreview}
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
