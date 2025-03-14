import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Steps, Alert, Select, Radio, List, InputNumber, Tooltip, Button, Input, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import _ from 'lodash';
import styles from '../ActivityModal.less';
// import SubjectTable from './ActiveCom/SubjectTable';
import ResultTable from './ActiveCom/ResultTable';
import PrizeTable from './ActiveCom/PrizeTable';
import TaskModal from '../../TaskModal/TaskModal';
import WxShare from './ActiveCom/WxShare';

const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
const SelectOption = Select.Option;
const ListItem = List.Item;
const RadioGroup = Radio.Group;
const re = /<[^>]+>/gi;


@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allSubjectsResult: activity.allSubjectsResult
} ) )
@Form.create()
class ActiveModal extends PureComponent {
  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      taskData:props.data && props.data.taskGroup,
      currentStep:0,
      packageId:props.data.packageId || '',
      subjectType:'FIXED',
      subjectList: [],
      tagsList:[],
      questionCount:0,
      current:{},
      oldQuestionsList:[],
      pageList: {
        pageNum: 1,
        pageSize: 1000,
      }
      // subjectNum:0,
    }
  }

  componentDidMount() {
    const { packageId }=this.state;
    if( packageId ){
      this.getQuestions( packageId )
    }
    this.getAllSubjects( { pageNum: 1, pageSize:1000 } );
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }

 // 查找题目信息
 getQuestions=( packageId )=>{
  const { dispatch }=this.props;
  const { subjectList } = this.state;
  const $this = this;
  dispatch( {
    type:'activity/getQuestionsObj',
    payload:{
      packageId
    },
    callFunc:( result )=>{
      if ( result.type === 'FIXED' ) {
        result.questions.map( item => {
          return subjectList.push( {
            id: item.id,
            sortOrder: item.sortOrder,
            questionPackageId: result.id,
            content: item.content.replace( re, '' ),
            choiceList:item.choiceList,
            resolve:item.resolve
          } )
        } )
      }else{
        $this.getTagsList( result.tagId );
      }
      $this.setState( { current:result, oldQuestionsList:result.questions, subjectType:result.type, subjctNum:result.randomNum || result.questions.length } )
    }
  } )
}

  //  获取所有题目
  getAllSubjects = ( params ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllSubjects',
      payload: { ...params }
    } );
  }


  // 搜索框中获取更多的题目
  getMoreSubject = ( e ) => {
    e.persist();
    const { target } = e;
    const { list } =  this.props.allSubjectsResult
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {
      const pageNum = this.state.pageList.pageNum + 1
      this.setState( {
        pageList: { ...this.state.pageList, pageNum }
      }, () => {
        this.getAllSubjects( { ...this.state.pageList, list } )

      } )
    }
  }

  //  获取标签列表
  getTagsList =( id )=>{
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getTagsList',
      payload: {
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
        callFunc: ( result ) => {
          if( id ){
            this.setState( { tagsList:result.list || [] }, ()=>this.onChange( id ) )
          }else{
            this.setState( { tagsList:result.list || [] } )
          }
        }
      }
    } )
  }

  // 添加或者编辑数据处理
  getSubjectValuesObj = () => {
    const { form } = this.props;
    const { current, subjectList, subjectType, questionCount, oldQuestionsList } = this.state;
    let isError = true;
    let newData = {}
    form.validateFields( ( err, fieldsValue )=>{
      if ( err ) {
        isError = false;
        message.error( '请在题目配置里面输入必填项' )
        return
      }
      if( subjectType === 'FIXED' ){
        newData = Object.assign( current, fieldsValue, { questions:subjectList } )
      }else{
        const { randomNum } = fieldsValue;
        if( questionCount !== 0 && +randomNum > +questionCount ){
          message.error( '题目数量不可大于标签下的题目数量' )
          isError=false
          return
        }
        const newList = randomNum ? oldQuestionsList.slice( 0, randomNum ) : oldQuestionsList
        newData = Object.assign( current, fieldsValue, { questions:newList } )
      }
    } )
    return isError && newData
  }

  // 类型切换
  typeState=( e )=>{
    this.setState( { current:{} }, ()=>this.onPreview() )
    if( e.target.value === 'FIXED' ){
      this.setState( { subjectType:e.target.value, tagsList:[] } )
    }else{
      this.setState( { subjectType:e.target.value, subjectList:[] }, ()=>this.getTagsList() )
    }
  }

  //  选择题目
  onSubjectSelect = ( value ) => {
    let { subjectList } = this.state;
    const { subjectType } = this.state;
    const { allSubjectsResult: { list } } = this.props;
    list.forEach( o => {
      if ( o.id === value ) {
        subjectList.push( {
          id: value,
          sortOrder: 1,
          content: o.content,
          type:subjectType,
          choiceList:JSON.parse( o.choice ),
          resolve:o.resolve
        } );
      }
    } );
    subjectList = _.uniqBy( subjectList, 'id' )
    this.setState( { subjectList, subjctNum:subjectList.length }, ()=>this.onPreview() );
  }

  //  更改序值
  onSortChange = ( value, id ) => {
    // 当值是空的话不进行后续操作
    if( value === '' ) {
      return
    }
    const { subjectList } = this.state;
    const subjct = subjectList.find( o => o.id === id );
    subjct.sortOrder = value;
    subjectList.push( subjct )
    this.setState( { subjectList: _.uniqBy( subjectList, 'id' ) }, ()=>this.onPreview() );
  }

  //  移除题目
  deleteSubject = ( id ) => {
    let { subjectList } = this.state;
    subjectList = _.filter( subjectList, ( o ) => { return o.id !== id} );
    this.setState( { subjectList, subjctNum:subjectList.length }, ()=>this.onPreview() );
  }

  // 随机标签题目切换
  onChange =( id, num )=>{
    const { tagsList, currentId, current } = this.state;
    const { dispatch, form: { setFieldsValue } } = this.props;
    const obj = ( tagsList.length && id ) ? tagsList.find( item => item.id === +id ) : {}
    if( num ){
      setFieldsValue( {
        randomNum:''
      } )
    }
    if( currentId ){
      this.setState( { questionCount:obj.questionCount }, ()=>this.onPreview() )
    }else{
      dispatch( {
        type:'activity/getTagsSubjectList',
        payload:{
          params:{
            'tag.id':obj.id,
            pageSize:50
          },
          callFunc:( result )=>{
            const { list, total } = result;
            list.forEach( ( item=>{
              item.choiceList = JSON.parse( item.choice )
              delete item.choice
            } ) )
            const newCurrent = Object.assign( current, { questions:list } )
            this.setState( { current:newCurrent, oldQuestionsList:newCurrent.questions, questionCount:total }, ()=>this.onPreview() )
          }
        }
      } )
    }
  }

  randomNumChange =( e )=>{
    this.setState( { subjctNum:e.target.value }, ()=>this.onPreview() )
  }

  // getSubjectValues = () => {
  //   const { form } = this.props;
  //   const data = form.getFieldsValue();
  //   return data;
  // }

  // 预览数据传输
  getValues = () => {
    const { current, subjectList, subjectType, oldQuestionsList }=this.state;
    const { form } = this.props;
    const data = form.getFieldsValue();
    let newData;
    if( subjectType === 'FIXED' ){
      newData = Object.assign( current, data, { questions:subjectList } )
    }else{
      const { randomNum } = data;
      const newList = randomNum ? oldQuestionsList.slice( 0, parseInt( randomNum, 0 ) ) : oldQuestionsList
      newData = Object.assign( current, data, { questions:newList } )
    }

    const ruesltData = this.RuesltRef.getValues();
    const prizeData = this.prizeRef.getValues();
    const taskGroup = this.taskRef.getValues();
    const wxShareData = this.wxShareRef.getValues();
    return {
      ...newData,
      ...ruesltData,
      ...prizeData,
      taskGroup,
      ...wxShareData,
    }
  }

  getHandleValues = () =>{
    const subjectData = this.getSubjectValuesObj();
    const ruesltData = this.RuesltRef.getHandleValues();
    const prizeData = this.prizeRef.getHandleValues();
    const taskGroup = this.taskRef.getValues();
    const wxShareData = this.wxShareRef.getHandleValues();
    console.log( 'aaa', prizeData );
    if( subjectData && ruesltData && prizeData ){
      return {
        subjectData,
        ruesltData,
        prizeData,
        taskGroup,
        wxShareData,
      }
    }
    return false
  }

  subjectModal = ()=>{
    const { form: { getFieldDecorator }, allSubjectsResult={}, currentId } = this.props;
    const { current, subjectType, subjectList, tagsList, questionCount } = this.state;
    return (
      <GridContent>
        <Alert
          style={{ marginBottom: 15 }}
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加题目前需先配置题库 ，若已配置请忽略 </span>
              <span onClick={() => { window.open( `${window.location.origin}/oldActivity/tool/questionBank` )}} style={{ color: '#1890FF', cursor:'pointer' }}>题库管理</span>
            </div> )}
          banner
        />
        <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
          <FormItem label='题目类型' {...this.formLayout1}>
            {getFieldDecorator( 'type', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}题目类型` }],
              initialValue: current.type===undefined ? 'FIXED' : current.type.toString()
            } )(
              <RadioGroup onChange={this.typeState} disabled={!!currentId}>
                <Radio value="FIXED">固定</Radio>
                <Radio value="DYNAMIC">随机</Radio>
              </RadioGroup>
          )}
          </FormItem>
          {
          subjectType === 'FIXED' ?
            <div>
              <FormItem label="选择题目" {...this.formLayout1}>
                {getFieldDecorator( 'questionIds', {
                  // rules: [{ required: true, message:'请选择选择题目' }],
                  initialValue: current.questionIds,
              } )(
                <Select
                  showSearch
                  autoClearSearchValue
                  placeholder="请选择题目"
                  optionFilterProp="children"
                  onSelect={this.onSubjectSelect}
                  filterOption={( input, option ) =>
                    option.props.children.indexOf( input ) >= 0
                  }
                  onPopupScroll={this.getMoreSubject}
                >
                  {allSubjectsResult.list && allSubjectsResult.list.map( item =>
                    <Option key={item.id} value={item.id}>{item.id}、{item.content.replace( re, '' )}</Option>
                  )}
                </Select>
              )}
              </FormItem>
              <FormItem label="题目" {...this.formLayout1}>
                {getFieldDecorator( 'questions', {
                  rules: [{ required: true, message: '请添加题目类型' }],
                  initialValue: current.questions,
              } )(
                <List
                  itemLayout="horizontal"
                  dataSource={_.sortBy( subjectList, ['sortOrder'] )}
                  renderItem={item => (
                    <ListItem
                      actions={[
                        <Tooltip title='排序'>
                          <InputNumber min={1} style={{ width: 70 }} precision={0} value={item.sortOrder} onChange={( value ) => {this.onSortChange( value, item.id )}} />
                        </Tooltip>,
                        <Tooltip title='删除'>
                          <Button
                            style={{ display: 'block', marginTop: '10px' }}
                            type="danger"
                            shape="circle"
                            icon="delete"
                            onClick={() => this.deleteSubject( item.id )}
                          />
                        </Tooltip>
                      ]}
                    >
                      <span style={{ width: 450 }}>{item.id}、{item.content}</span>
                    </ListItem>
                  )}
                />
              )}
              </FormItem>
            </div>
          :
            <div>
              <FormItem label="标签名称" {...this.formLayout1}>
                {getFieldDecorator( 'tagId', {
                rules: [{ required: true, message: "请输入标签名称" }],
                initialValue: current.tagId ? current.tagId.toString() : '',
              } )(
                <Select onChange={( id )=>this.onChange( id, 'chang' )}>
                  {tagsList.map( item =>
                    <SelectOption key={item.id}>{item.name}</SelectOption>
                  )}
                </Select>
              )}
              </FormItem>
              <FormItem label="题目数量" {...this.formLayout1}>
                {getFieldDecorator( 'randomNum', {
                rules: [{ required: true, message: "请输入题目数量" }],
                initialValue: current.randomNum || '',
              } )(
                <Input placeholder="请输入题目数量" onChange={this.randomNumChange} />
              )}<p>（标签下的题目数量是：{questionCount}）</p>
              </FormItem>
            </div>
        }
        </Form>

      </GridContent>
    )
  }


  render() {
    const { currentStep, canChangeStep, subjctNum, taskData } = this.state;
    const { onPreview, data, getBasicRule } = this.props;
    const stepList = [
      {
        name:`题目配置(${subjctNum || 0}题)`,
        content: data && this.subjectModal()
      },
      {
        name: '答题结果',
        content: data &&
        <ResultTable
          data={data}
          subjctNum={subjctNum}
          getBasicRule={getBasicRule}
          onRef={( Rueslt ) => { this.RuesltRef = Rueslt }}
          onPreview={onPreview}
        />
      },
      {
        name: '奖品配置',
        content: data &&
        <PrizeTable
          data={data}
          onRef={( prize ) => {this.prizeRef = prize}}
          onPreview={onPreview}
        />
      },
      {
        name: '任务设置（选填）',
        content: data &&
        <TaskModal
          taskData={taskData}
          onRef={( task ) => {this.taskRef = task}}
          onPreview={onPreview}
        />
      },
      {
        name: '微信分享（选填）',
        content: data &&
        <WxShare
          data={data}
          onRef={( wxShare ) => {this.wxShareRef = wxShare}}
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
