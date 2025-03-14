import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Row, Col, Popconfirm, Select, Radio, Icon } from 'antd';
import { topicTypeList, getKey, getValue } from '@/utils/enums';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
let Timer;

const initState = ( props ) => ( {
  detail: props.detail,
  isOpen: !!props.detail.isOpen,
  optionsList:props.detail.optionsList?new Array( ...props.detail.optionsList ):[],
  topicType: getKey( topicTypeList, props.detail.topic )||'SINGLE_CHOICE',
} )

@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
} ) )
@Form.create()
class Topic extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };


  constructor( props ) {
    super( props );
    this.state = initState( props );
  }


  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.detail !== prevState.detail ) {
      return initState( nextProps )
    }
    return null;
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }



    // 拿去表单中数据
    getValues = () => {
      const { form, detail } = this.props;
      const data = form.getFieldsValue();
      const newObj =  Object.assign( detail, data,  {
        optionsList:this.state.optionsList,
        topic:this.state.topicType
      } );
      if( newObj.options ){
        delete newObj.options
      }
      return newObj;
    }

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false
    let data = {};
    form.validateFields( ( err, values ) => {
      if ( err ) {
        haveError = err;
      }
      data = Object.assign( detail, values, {
        optionsList:this.state.optionsList,
        topic:this.state.topicType
      } );
    } );
    if ( haveError ) return 'error';
    return data;
  };

  onChange = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }

  onScoreChange=( e )=>{
    this.setState( {
      optionsList:new Array( e.target.value )
    }, ()=>{
      clearTimeout( Timer );
      Timer = setTimeout( () => {
        this.onPreview()
      }, 500 );
    } )
  }

  onTypeChange=( val )=>{
   const value= getKey( topicTypeList, val )
   let list=[]
   if( value==='SCORE' ){
       list =['5']
   }
    this.setState( {
     topicType:value,
     optionsList:list
    }, ()=>{
      clearTimeout( Timer );
      Timer = setTimeout( () => {
        this.onPreview()
      }, 500 );
    } )
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { detail: null } )
  }


  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        this.setState( { isOpen:true } )
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {
    this.props.deleteTopic();
  }

  onCopyTopic = () => {
    this.props.copyTopic();
  }

  // 添加选项
  addOptionsItem=()=>{
    const { optionsList } = this.state;
    const newList = optionsList.concat( '' );
    this.setState( { optionsList: newList }, ()=>{
      this.onPreview()
    } )
  }

// 添加其他项目
addOtherOptionsItem=()=>{
  const { optionsList } = this.state;
  if( optionsList.includes( '其他' ) ){
    alert( '只能添加一个其他项' )
    return
  }
  const newList = optionsList.concat( '其他' );
  this.setState( { optionsList: newList }, ()=>{
    this.onPreview()
  } )
}

  // 删除选项
  deleteOptionsItem=( val, num )=>{
    const { optionsList=[], topicType }=this.state
    if( topicType==='SINGLE_CHOICE'||topicType==='MULTIPLE_CHOICE' ){
      if( optionsList.length===1 ){
        alert( '至少要有一个选项' )
         return
      }
    }
    const newOptionsList=optionsList.filter( ( item, index )=>{
      return  index !== num
    } )
    this.setState( { optionsList: newOptionsList }, ()=>{
      this.onPreview()
    } )
  }

   // 修改选项
editOptionsItem = ( e, index ) => {
    const { optionsList } = this.state;
    const newList=optionsList
    newList[index] = e.target.value;
    this.setState( { optionsList:newList }, ()=>{  setTimeout( () => {
      this.onPreview()
    }, 500 );} );
  }

  // 上移选项
  upOptionsItem = ( e, index ) => {
    const { optionsList } = this.state;
    const newList=optionsList
    if( index===0 ){
      return
    }
    newList.splice( index - 1, 0, ( newList[index] ) )
    newList.splice( index + 1, 1 )
    this.setState( { optionsList:new Array( ...newList ) }, ()=>{  setTimeout( () => {
      this.onPreview()
    }, 500 );} );
  }

  // 下移选项
  downOptionsItem = ( e, index ) => {
    const { optionsList } = this.state;

    const newList=optionsList
    if( index=== ( newList.length-1 ) ){
      return
    }
    newList.splice( index + 2, 0, ( newList[index] ) )
    newList.splice( index, 1 )
    this.setState( { optionsList:new Array( ...newList ) }, ()=>{  setTimeout( () => {
      this.onPreview()
    }, 500 );} );
  }


  render() {
    const { form: { getFieldDecorator }, cardIndex } = this.props;
    const {
      isOpen, detail, topicType, optionsList
    } = this.state;
    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } );
    getFieldDecorator( 'isOpen', { initialValue: isOpen } );

    return (
      <div className={styles.edit_acitve_card} style={{ height:isOpen ? 'unset':64, overflow:'hidden' }}>
        <Row style={{ padding: '20px 0' }}>
          <Col span={4} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 10, fontSize: 16 }}>题目{cardIndex}</Col>
          <Col span={20} style={{ textAlign: 'right', paddingRight: 30, color: '#1890FF' }}>
            <span style={{ marginRight: 20, cursor: 'pointer' }} onClick={() => { this.setState( { isOpen: !isOpen } ) }}>{isOpen ? '收起' : '展开'}</span>
            <Popconfirm
              title="是否复制该题目?"
              onConfirm={this.onCopyTopic}
              placement='left'
              okText="确定"
              cancelText="取消"
            >
              <span style={{ marginRight: 20, cursor: 'pointer' }}>复制</span>
            </Popconfirm>
            <Popconfirm
              title="确认删除题目?"
              onConfirm={this.onDelete}
              placement='left'
              okText="确定"
              cancelText="取消"
            >
              <span style={{ cursor: 'pointer' }}>删除</span>
            </Popconfirm>
          </Col>
        </Row>

        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label='题目类型'
            {...this.formLayout}
          >
            {getFieldDecorator( 'topic', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}题目类型` }],
              initialValue: getValue( topicTypeList, detail.topic )||getValue( topicTypeList, topicType )
              } )(
                <Select
                  onSelect={this.onTypeChange}
                  allowClear
                  placeholder={`${formatMessage( { id: 'form.select' } )}题目类型`}
                >
                  {
                    topicTypeList.map( item =>
                      <SelectOption key={item.key} value={item.value}>{item.value}</SelectOption>
                      )
                    }
                </Select>
              )}
          </FormItem>
          <FormItem label='此题必填' {...this.formLayout} style={{ textAlign:'left' }}>
            {getFieldDecorator( 'answer', {
              rules: [{ required: true, message:'' } ],
              initialValue: detail.answer || false
            } )(
              <Radio.Group onChange={this.onChange}>
                <Radio value>必填</Radio>
                <Radio value={false}>非必填</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            label='题目名称'
            {...this.formLayout}
          >
            {getFieldDecorator( 'title', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}题目` }],
              initialValue: detail.title||'',
            } )( <Input
              onChange={this.onChange}
              placeholder='请输入题目'
            /> )}
          </FormItem>
          {( optionsList&&optionsList.length>0&& ( topicType ==='SINGLE_CHOICE'||topicType ==='MULTIPLE_CHOICE' ) )&&
          <FormItem
            label='选项'
            {...this.formLayout}
          >
            {getFieldDecorator( 'options', {
                        rules: [{ required: true, message: "请输完善选项信息" }],
                        initialValue:optionsList,
                      } )(
                        <div>
                          { optionsList.map( ( item, index ) => {
                           // let disabel=false
                            // if( item==='其他' ){
                             // disabel=true
                           // }
                            return (
                              <Input.Group compact key={index+1} style={{ display:'flex' }}>
                                <Input
                                  style={{ width: '75%', marginTop:'6px', textAlign:'left' }}
                                  value={item}
                                  onChange={e => this.editOptionsItem( e, index )}
                                  placeholder={`请输入选项${index+1}`}
                                 // disabled={disabel}
                                />
                                <div
                                  style={{
                                    width: '25%',
                                    display:'flex',
                                    marginTop:'6px',
                                    alignItems:'center'
                                      }}
                                >
                                  <Icon type="up-circle" theme="twoTone" style={{ fontSize:'24px', marginLeft:'20px', marginRight:'25px'  }} onClick={()=>this.upOptionsItem( item, index )} />
                                  <Icon type="down-circle" theme="twoTone" style={{ fontSize:'24px', marginRight:'25px'  }} onClick={()=>this.downOptionsItem( item, index )} />
                                  <Icon type="delete" theme="twoTone" style={{ fontSize:'24px', marginRight:'25px' }} onClick={()=>this.deleteOptionsItem( item, index )} />
                                </div>
                              </Input.Group>
                            )
                          } )}
                        </div>
                      )}
          </FormItem>
          }
          { ( topicType ==='SINGLE_CHOICE'||topicType ==='MULTIPLE_CHOICE' )&&
          <Row style={{ padding: '20px 0' }}>
            <Col span={4} style={{  textAlign: 'right', paddingRight: 10, fontSize: 14, color:'#2290ff' }}>
              <span onClick={this.addOptionsItem}>添加选项</span>
            </Col>
            <Col span={6} style={{ textAlign: 'right', paddingRight: 30, color: '#2290ff' }}>
              <span onClick={this.addOtherOptionsItem}>添加其他项</span>
            </Col>
          </Row>
          }

          { topicType ==='SCORE' &&
          <FormItem label='选择分制' {...this.formLayout} style={{ textAlign:'left' }}>
            {getFieldDecorator( 'score', {
              rules: [{ required: true, message:'' } ],
              initialValue: ( detail.optionsList&&detail.optionsList.length>0 )?detail.optionsList[0] :'5'
            } )(
              <Radio.Group onChange={this.onScoreChange}>
                <Radio value="5">五分制</Radio>
                <Radio value="10">十分制</Radio>
              </Radio.Group>
            )}
          </FormItem>
          }
        </Form>
      </div>

    );
  }
}

export default Topic;

