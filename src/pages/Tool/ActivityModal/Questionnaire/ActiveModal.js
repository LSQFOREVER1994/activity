import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Icon, Tabs, message, Radio, Input } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';
import PrizeCom from './PrizeCom';
import TopicCom from './Topic.com';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const time = () => new Date().getTime();

@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
} ) )
@Form.create()
class ActiveModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  allTopicForm = {}

  constructor( props ) {
    super( props );
    this.state = {
      errorFormList:[], // 表单错误项
      currTab:1,
      topicList:props.data.questions||[],
      deleteQuestionIds:[],
    }
  }



  componentDidMount() {
    this.props.onRef( this )
  }



  getHaveError = () => {
    let errorFormList = [];
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
        errorFormList = Object.keys( err )

      }
    } );
    this.setState( { errorFormList } )
    return haveError;
  };


  // 拿去表单中数据
  getValues = () => {
    const { form } = this.props;
    const { topicList, deleteQuestionIds } = this.state;
    const  oldQuestions=[]
    const keysList=topicList.map( info=>{
      let delId=info.key
      if( !info.key ){
        delId=info.id
      }
      return delId
    } )
    keysList.forEach( ( key ) => {
      const formData = this.allTopicForm[key].handleSubmit();
      oldQuestions.push( formData );
    } )
    const questions=oldQuestions.map( ( info, index )=>{
      return {
        answer:info.answer,
        id:info.id||null,
        optionsList:info.optionsList,
        title:info.title,
        topic:info.topic,
        sort:index+1
      }
    } )
    // let taskGroup;
    // if( this.taskRef )taskGroup = this.taskRef.getValues()
    let newData = Object.assign( { questions }, { deleteQuestionIds } );
    const data = form.getFieldsValue();
    if( data ){
      newData = Object.assign( data, { questions }, { deleteQuestionIds } );
      const { isPrizeEmpty } = data;
      if( isPrizeEmpty ){
        let prizeListObj
        if( this.prizeCom )prizeListObj = this.prizeCom.getValues();
        newData = Object.assign( data, prizeListObj, { questions }, { deleteQuestionIds } )
      }
    }
    return newData
  }

  // 提交
  activeHandleSubmit = () => {
    const { topicList, deleteQuestionIds } = this.state;
    const { form } = this.props;
    const  oldQuestions=[]
    const keysList=topicList.map( info=>{
      let delId=info.key
      if( !info.key ){
        delId=info.id
      }
      return delId
    } )
    keysList.forEach( ( key ) => {
      const formData = this.allTopicForm[key].handleSubmit();
      oldQuestions.push( formData );
    } )
    if( oldQuestions.indexOf( false ) > -1 ){
      message.error( '请在题目设置里面输入必填项' );
      return
    }
    const questions=oldQuestions.map( ( info, index )=>{
      return {
        answer:info.answer,
        id:info.id||null,
        optionsList:info.optionsList,
        title:info.title,
        topic:info.topic,
        sort:index+1
      }
    } )
    let Data={}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在活动设置里面输入必填项' )
        return;
      }
      const{ isPrizeEmpty, lotteryRelative }= fieldsValue;
      if( !isPrizeEmpty && !lotteryRelative && this.prizeCom ){
        const prizeListObj = this.prizeCom.getValues();
        if( prizeListObj.prizes.length === 0 ){
          message.error( '配置奖品不可为空' )
          isError = false
        }else{
          Data = Object.assign( fieldsValue, prizeListObj, { questions }, { deleteQuestionIds } )
        }
      }else{
        Data = Object.assign( fieldsValue, { questions }, { deleteQuestionIds } )
      }
    } );
    if( Data.options ){ delete Data.options};
    // eslint-disable-next-line consistent-return
    if( isError ) return  Data;
    // eslint-disable-next-line consistent-return
    return isError
  };

  onPreview = () => {
    this.props.onPreview()
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  // 渲染
  onPreviewChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

// 设置样式
 getItemStyle = ( isDragging, draggableStyle ) => ( {
  userSelect: "none",
  // 拖拽的时候背景变化
  background: isDragging ? "#e6f7ff" : "#ffffff",
  // styles we need to apply on draggables
  ...draggableStyle,
} );

 getListStyle = () => ( {
} );

// 重新记录数组顺序
reorder = ( list, startIndex, endIndex ) => {
  const result = Array.from( list );
  const [removed] = result.splice( startIndex, 1 );
  result.splice( endIndex, 0, removed );
  return result;
};

// 更新排序后的数组
onDragEnd=( result )=> {
  if ( !result.destination ) {
    return;
  }
  const items = this.reorder(
    this.state.topicList,
    result.source.index,
    result.destination.index
  );
  this.setState( {
    topicList:items
  }, ()=>{
    this.props.onPreview()
  } )
}

 // 删除题目
 deleteTopic =(  detail, index, ) => {
  const { deleteQuestionIds, topicList }=this.state
  let  newDeleteIds
  if ( detail.id ) newDeleteIds = deleteQuestionIds.concat( [detail.id] )
  const lists = [];
  const { allTopicForm }=this
  const keysList=topicList.map( info=>{
    let delId=info.key
    if( !info.key ){
      delId=info.id
    }
    return delId
  } )
  keysList.forEach( ( key ) => {
    const formData = allTopicForm[key].getValues();
    allTopicForm[key].formReset();
    lists.push( formData );
  } )
  const newList = lists.filter( ( item ) => item && ( item.key||item.id ) !== index )
  delete allTopicForm[index];
  this.setState( {
    topicList:newList,
    deleteQuestionIds:newDeleteIds,
  }, ()=>{
    this.props.onPreview()
  } )
}

  // 添加题目
  addTopic = () => {
    const { topicList } = this.state;
    const newList = topicList.concat( { key: time(), isOpen:true } );
    this.setState( { topicList: newList }, ()=>{
      this.props.onPreview()
    } )
  }

 // 复制题目
 copyTopic = ( index ) => {
  const { topicList } = this.state;
  const item=topicList[index]
  const newList = topicList.concat( { ...item, key: time(), isOpen:true, id:null, options:null } );
  this.setState( { topicList: newList }, ()=>{
    this.props.onPreview()
  } )
}



  // 题目拖拽列表
  renderDragList=()=>{
    const { topicList=[],  }=this.state
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <center>
            <Droppable droppableId="droppable">
              {( provided, snapshot ) => (
                <div
              // provided.droppableProps应用的相同元素.
                  {...provided.droppableProps}
                // 为了使 droppable 能够正常工作必须绑定到最高可能的DOM节点中provided.innerRef.
                  ref={provided.innerRef}
                  style={this.getListStyle( snapshot )}
                >
                  {topicList.map( ( item, index ) => (
                    <Draggable key={item.id} draggableId={( item.key||item.id ).toString()} index={index}>
                      {( provided, snapshot ) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={this.getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        >
                          <TopicCom
                            key={item.key}
                            onRef={( ref ) => { this.allTopicForm[( item.key||item.id ).toString()] = ref }}
                            deleteTopic={()=>this.deleteTopic( item, item.key||item.id )}
                            copyTopic={()=>this.copyTopic( index )}
                            detail={item}
                            cardIndex={index + 1}
                            onPreview={this.props.onPreview}
                          />
                        </div>
                    )}
                    </Draggable>
                ) )}
                  {provided.placeholder}
                </div>
            )}
            </Droppable>
          </center>
        </DragDropContext>
        <div
          className={styles.edit_active_add}
          onClick={()=>this.addTopic()}
        >
          <Icon
            type="plus-circle"
            style={{ color:'#1890FF', fontSize:16, marginRight:10 }}
          />添加题目
        </div>
      </div>
    );
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const { errorFormList, currTab }= this.state;
    return (
      <GridContent>
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='题目设置' errorFormList={errorFormList} requiredList={[]} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='topicText' />
                {this.renderDragList()}
              </TabPane>

              <TabPane tab={<TabName name='奖品设置' errorFormList={errorFormList} requiredList={[ 'sendButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 2} />} key="2">
                <Reminder type='gifs' />
                <FormItem
                  label='是否有抽奖'
                  style={{ paddingTop: 20, display:'flex' }}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'isPrizeEmpty', {
                    rules: [{ required: true } ],
                    initialValue: data.isPrizeEmpty === undefined ? false : data.isPrizeEmpty,
                  } )(
                    <Radio.Group>
                      <Radio value={false}>是</Radio>
                      <Radio value>否</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {
                  !getFieldValue( 'isPrizeEmpty' ) &&
                  <div>
                    <FormItem label='是否关联其他活动' {...this.formLayout}>
                      {getFieldDecorator( 'lotteryRelative', {
                        rules: [{ required: true, } ],
                        initialValue: data.lotteryRelative === undefined ? true: data.lotteryRelative
                      } )(
                        <Radio.Group>
                          <Radio value>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                    {
                      getFieldValue( 'lotteryRelative' ) ?
                        <FormItem label='抽奖跳转链接' {...this.formLayout}>
                          {getFieldDecorator( 'link', {
                          rules: [{ required:true, message: `${formatMessage( { id: 'form.input' } )}抽奖跳转链接` }],
                          initialValue: data.link
                        } )( <Input placeholder="可输入其他抽奖活动链接，满足抽奖条件后跳转该链接进行抽奖"  /> )}
                        </FormItem>
                      :
                        <div>
                          <div style={{ display:'flex', marginLeft:'6%' }}>
                            <div>提示：</div>
                            <div>
                              未配置奖品，将无抽奖流程；有配置奖品，参与用户登录需要选择登录<br />
                              {/* 增加数量时，直接点击数量右侧按钮进行增加<br /> */}
                              减少数量时，需先将概率调整为0，或者将活动更改为非进行中
                            </div>
                          </div>
                          <div style={{ width:'90%', margin:'20px auto' }}>
                            <PrizeCom
                              onRef={( ref ) =>{this.prizeCom = ref}}
                              prizes={data.prizes}
                              onPreview={this.props.onPreview}
                            />
                          </div>
                        </div>
                    }
                  </div>
                }
              </TabPane>

              {/* <TabPane tab='任务设置' key="3">
                <TaskModal
                  data={data}
                  onPreview={this.props.onPreview}
                  onRef={( ref )=>{this.taskRef = ref}}
                />
              </TabPane> */}

              <TabPane tab='微信分享' key="3">
                <Reminder type='wxShare' />
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }}
                  label='分享标题'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareTitle', {
                    initialValue: data.shareTitle,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} /> )}
                </FormItem>
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }}
                  label='分享描述'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareDescription', {
                    initialValue: data.shareDescription,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`} /> )}
                </FormItem>
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }}
                  label='分享链接'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareLink', {
                    initialValue: data.shareLink,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`} /> )}
                </FormItem>
                <FormItem
                  label='分享图标'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareImg', {
                      initialValue: data.shareImg,
                    } )( <UploadImg /> )}
                  <div
                    style={
                     {
                       position: 'absolute',
                       top:0, left:'125px',
                       width:'180px',
                       fontSize: 13,
                       color: '#999',
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：200px*200px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </GridContent>
    );
  }
}

export default ActiveModal;

const Reminder = ( { type, msg = '', style={} } ) =>{

  let text = msg
  switch ( type ) {
    case 'topicText': text = '设置问卷题目'; break;
    case 'gifs': text = '设置奖品'; break;
    case 'wxShare': text = '（ 选填 ）微信分享'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
  let isError = false;
  if ( errorFormList&&errorFormList.length && requiredList&&requiredList.length ){
    requiredList.forEach( item => {
      if ( !isError ){
        isError = errorFormList.includes( item )
      }

    } )
  }
  if ( isActive ) isError=false
  const style = isError? { color:'#f5222d' } : {}
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name}
      {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div>
  )
}
