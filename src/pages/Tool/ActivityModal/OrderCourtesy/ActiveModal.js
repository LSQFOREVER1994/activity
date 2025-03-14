import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Steps, Alert, Select, Radio, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';
import TaskModal from '../../TaskModal/TaskModal'
import styles from '../ActivityModal.less';

const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  purchasesRecordData: activity.purchasesRecordData,
  productsList: activity.productsList,
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
      currentStep: 0,
      taskData:props.data && props.data.taskGroup, 
    }
  }

  componentDidMount() {
    this.fetchList( {} )
    this.feachCategories();
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  }

  //  获取仿真记录列表
  fetchList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getPurchasesRecordData',
      payload: {
        pageNum: 1,
        pageSize: 20,
        name
      },
      callFunc: () => {
        this.props.onPreview();
      }
    } );
  }

  // 活动商品列表
  feachCategories = ( value ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getProducts',
      payload: {
        pageNum: 1,
        pageSize: 30,
        name:value
      },
    } );
  }

  //  仿真中奖动态搜索
  onSearch = ( value ) => {
    this.feachCategories( { value } );
  }

  //  提交表单数据
  handleSubmit = () => {
    let param = {};
    let isErr = true;
    const peizeData = this.prizeRef.getData();
    // if( peizeData.prizeList.length === 0 ){
    //   message.error( '请配置奖品' )
    //   isErr = false
    //   // return
    // }
    const { form: { validateFields } } = this.props;
    validateFields( ( err, val ) => {
      if ( err ){
        isErr = false;
        // return;
      }
      param = Object.assign( { ...peizeData }, { ...val } )
    } )
    return isErr && param
  }

  //  获取表单数据
  getValues = () => {
    const { form } = this.props;
    const peizeList = this.prizeRef.getValues();
    const taskGroup = this.taskRef.getValues()
    const data = form.getFieldsValue();
    const param = Object.assign( { ...data }, { ...peizeList }, { taskGroup } )
    return param;
  }

  Modal = () => {
    const { form: { getFieldDecorator, getFieldsValue }, data, productsList = [] } = this.props;
    const formData = getFieldsValue( ["isAll"] );
    return (
      <GridContent>
        <div className={styles.red_rain_prize}>
          <div className={styles.order_prizeOrder_title}>对参与活动商品进行设置，用户购买指定商品即可参与下单有礼活动</div>
          <Alert
            style={{ marginBottom: 15 }}
            className={styles.edit_alert}
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>添加参与活动商品需先配置上架商品，若已配置请忽略</span>
                <span onClick={() => { window.open( `${window.location.origin}/strategyMall/productList` ) }} style={{ color: '#1890FF', cursor: 'pointer' }}>商品管理</span>
              </div> )}
            banner
          />
          <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
            <FormItem label='参与活动商品' {...this.formLayout}>
              {getFieldDecorator( 'isAll', {
                rules: [{ required: true, message: `请选择是否上架所有商品` }],
                initialValue: data.isAll || true,
              } )(
                <Radio.Group>
                  <Radio value={false}>部分上架商品</Radio>
                  <Radio value>所有上架商品</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {!formData.isAll &&
              <FormItem label='' {...this.formLayout}>
                {getFieldDecorator( 'specIdList', {
                  rules: [{ required: true, message: `请选择商品` }],
                  initialValue: data.specIdList||[],
                } )(
                  <Select
                    mode="multiple"
                    onSearch={( value )=>{this.feachCategories( value );}}
                    showSearch
                    filterOption={false}
                  >
                    {
                      productsList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                    }
                  </Select>
                )}
              </FormItem>
            }
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
        name: <p><span style={{ color: 'red' }}>*</span>商品配置</p>,
        content: data && this.Modal()
      },
      {
        name: <p><span style={{ color: 'red' }}>*</span>奖品配置</p>,
        content: data &&
          <PrizeTable
            data={data}
            onRef={( prize ) => { this.prizeRef = prize }}
            onPreview={onPreview}
          />
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
    ]
    return (
      <GridContent style={{ paddingLeft: 30 }}>
        <div style={{ width: '100%', backgroundColor: '#fff' }}>
          <Steps
            size="small"
            current={currentStep}
            progressDot
            onChange={( value ) => { this.setState( { currentStep: value } ) }}
            className={styles.edit_acitve_steps}
          >
            {
              stepList.map( ( step, index ) => (
                <Step
                  title={step.name}
                  key={index}
                  style={{ cursor: canChangeStep ? 'pointer' : 'default' }}
                />
              ) )
            }
          </Steps>
        </div>
        {
          stepList.map( ( step, index ) => (
            <div
              key={index}
              className={styles.collect_edit_active_content}
              style={{ display: currentStep === index ? 'block' : 'none' }}
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
