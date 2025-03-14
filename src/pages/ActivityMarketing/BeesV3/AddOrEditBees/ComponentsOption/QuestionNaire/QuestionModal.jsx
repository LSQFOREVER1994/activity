import React, { useEffect, useState, useMemo } from 'react'
import { Modal, Form, Select, Switch, Input, Icon, Button, message, InputNumber, Radio, Empty } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'dva'
import styles from './index.less'

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const formLayout1 = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

const topicTypeList = [
  { key: 'SINGLE_CHOICE', value: '单选题' },
  { key: 'MULTIPLE_CHOICE', value: '多选题' },
  { key: 'SCORE', value: '评分题' },
  { key: 'SINGLE_TEXT', value: '单行文本' },
  { key: 'MULTIPLE_TEXT', value: '多行文本' },
  { key: 'DROP_DOWN', value: '下拉选择' },
  // { key: 'IMAGE_UPLOAD', value: '图片上传' },
]

function QuestionModal( {
  questionModalVisible,
  handleQuestionModalVisible,
  form: { getFieldDecorator, validateFields, getFieldValue },
  componentsData,
  changeValue,
  virtualId
} ) {
  const [dragOptionList, setDragOptionList] = useState( [() => []] )
  const [hasOtherOption, setHasOtherOption] = useState( false )

  // 确认选项在哪个题目下，下标作为标识
  const filterQuestionIndex = componentsData?.question && componentsData?.question.findIndex( item => item.virtualId === virtualId )
  const currentQuestion = useMemo( () => {
    if ( !componentsData?.question?.length ) return {}
    return componentsData?.question && componentsData?.question.find( item => item.virtualId === virtualId )
  }, [getFieldValue( 'topic' ), JSON.stringify( componentsData?.question ), questionModalVisible, virtualId] )



  useEffect( () => {
    // 处理option支持拖拽
    if ( !componentsData?.question?.length ) return
    const { question = [] } = componentsData
    const filterOptionList = question.find( item => item.virtualId === virtualId )?.optionsList
    const newFilterOptionList = filterOptionList && filterOptionList.map( ( optionName ) => {
      return {
        optionName,
        virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
      }
    } )
    setDragOptionList( newFilterOptionList || [] )
  }, [questionModalVisible, virtualId, JSON.stringify( componentsData?.question )] )

  // 重新排序拖拽列表
  const reorderList = ( list, startIndex, endIndex ) => {
    const result = Array.from( list );
    const [removed] = result.splice( startIndex, 1 );
    result.splice( endIndex, 0, removed );
    return result;
  };

  // 拖拽结束计算位置重置题目数组
  const onDragEnd = result => {
    if ( !result.destination ) {
      return;
    }
    const originOptionList = dragOptionList?.length && dragOptionList.map( ( item ) => item?.optionName )
    const newList = reorderList(
      originOptionList || [],
      result.source.index,
      result.destination.index
    );
    changeValue( newList, `question[${filterQuestionIndex}].optionsList` )
  };

  // 将其他项固定在选项列表最后一项
  const moveOtherItemToLast = ( moveList = [] ) => {
    const otherItemIndex = dragOptionList.findIndex( item => item.optionName === '其他' )
    const isOtherLast = otherItemIndex === dragOptionList?.length
    if ( !isOtherLast ) {
      return reorderList( moveList, otherItemIndex, dragOptionList.length - 1 )
    } return moveList
  }

  // 题目配置提交
  const handleSubmit = () => {
    validateFields( ( err, value ) => {
      
      if ( !err ) {
        if( value?.extended?.min > value?.extended?.max ) {
          message.error( '最少填写字数必须大于等于最多填写字数' )
          return
        }
        const hasOptionList = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes( value.topic )
        if ( hasOptionList && !dragOptionList?.length ) {
          message.error( '还有必填项未填写' )
          return
        }
        const newOptionList = hasOptionList ? moveOtherItemToLast( dragOptionList ) : dragOptionList
        const originOption = newOptionList && newOptionList.map( ( item ) => item?.optionName )
        const params = {
          ...value,
          optionsList: originOption,
          virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
          sort: filterQuestionIndex,
          id: currentQuestion?.id
        }
        changeValue( params, `question[${filterQuestionIndex}]` )
        handleQuestionModalVisible()
      } else {
        message.error( '还有必填项未填写' )
      }
    } )
  }
  // 添加选项
  const handleAddOption = ( other ) => {
    const hasOtherItem = Object.keys( dragOptionList?.find( ( item ) => item.optionName === '其他' ) || {} )?.length
    if ( hasOtherItem ) {
      const newDragList = moveOtherItemToLast( dragOptionList )
      const otherItem = newDragList.pop()
      newDragList.push( {
        optionName: `选项${dragOptionList.length + 1}`,
        virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
      } )
      setDragOptionList( [...newDragList, otherItem] )
    } else {
      setDragOptionList( [...dragOptionList, {
        optionName: other ? '其他' : `选项${dragOptionList.length + 1}`,
        virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
      }] )
    }

  }

  // 删除选项
  const handleDeleteOption = ( vid ) => {
    const newDragOptionAfterDelete = dragOptionList.length && dragOptionList.filter( item => item.virtualId !== vid )
    setDragOptionList( newDragOptionAfterDelete )
  }

  // 题目选项变更
  const handleOptionItemChange = ( e, vid ) => {
    const value = e?.target ? e.target.value : e
    const findOptionIdx = dragOptionList && dragOptionList.findIndex( item => item.virtualId === vid )
    const newDragList = dragOptionList
    const hasValueItem = newDragList?.find( ( item ) => item.optionName === value )
    if ( Object.keys( hasValueItem || {} ).length ) {
      message.warning( '请勿输入相同的选项' )
      return
    }
    newDragList[findOptionIdx].optionName = value
    setDragOptionList( [...newDragList] )
  }

  useEffect( () => {
    if ( dragOptionList?.length ) setHasOtherOption( false )
    setHasOtherOption( () => {
      return (
        dragOptionList?.length && Object.keys( dragOptionList.find( ( item ) => item.optionName === '其他' ) || {} )?.length
      )
    } )
  }, [dragOptionList?.length] )


  // 根据题目类型渲染不同的配置项
  const renderQuestionConfigItem = ( questionType ) => {
    return (
      <>
        {
          ( questionType === 'SINGLE_CHOICE' ||
            questionType === 'MULTIPLE_CHOICE' ||
            questionType === 'DROP_DOWN' ) && (
            <>
              <FormItem label="选项设置" className={styles.option_config} required>
                <div className={styles.config_list_container}>
                  <div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable">
                        {( provided ) => (
                          <div
                            className={styles.option_container}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {
                              dragOptionList?.length ? dragOptionList.map( ( option, idx ) => {
                                return (
                                  <Draggable
                                    key={option.virtualId}
                                    draggableId={`${option.virtualId}`}
                                    isDragDisabled={option.optionName === '其他'}
                                    fixed={option.optionName === '其他'}
                                    index={idx}
                                  >
                                    {( provided1 ) => (
                                      <div
                                        key={option.virtualId}
                                        ref={provided1.innerRef}
                                        {...provided1.draggableProps}
                                        {...provided1.dragHandleProps}
                                      >
                                        <div className={styles.single_option}>
                                          <Input
                                            disabled={option.optionName === '其他'}
                                            value={option.optionName}
                                            onChange={( e ) => handleOptionItemChange( e, option.virtualId )}
                                            placeholder={`请输入选项${idx + 1}`}
                                          />
                                          <Icon type='delete' onClick={() => handleDeleteOption( option.virtualId )} />
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              } ) : <Empty description='暂无选项' style={{ marginLeft: 100 }} />
                            }
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  <div className={styles.btn_group}>
                    <div
                      className={styles.add_button}
                      style={
                        getFieldValue( 'topic' ) === 'DROP_DOWN' ? { marginLeft: 164 } : {}
                      }
                    >
                      <Button
                        type="dashed"
                        onClick={() => handleAddOption()}
                        icon="plus"
                        style={{ width: 200 }}
                      >
                        <span>添加选项</span>
                      </Button>
                    </div>
                    {
                      ( !hasOtherOption && getFieldValue( 'topic' ) !== 'DROP_DOWN' ) && (
                        <div className={styles.add_button}>
                          <Button
                            type="dashed"
                            onClick={() => handleAddOption( 'other' )}
                            icon="plus"
                            style={{ width: 200, marginLeft: -50 }}
                          >
                            <span>添加其他选项</span>
                          </Button>
                        </div>
                      )
                    }
                  </div>
                </div>
              </FormItem>
              {
                questionType === 'MULTIPLE_CHOICE' && (
                  <div className={styles.text_limit}>
                    <FormItem label='最少选择' style={{ marginLeft: 45, maxWidth: 250 }} {...formLayout1}>
                      <div className={styles.input_container}>
                        {getFieldDecorator( 'extended.min', {
                          initialValue: currentQuestion?.extended?.min
                        } )(
                          <InputNumber style={{ width: 210 }} max={getFieldValue( 'extended.max' ) || 99999} min={1} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                        )}
                        <div className={styles.input_suffix}>个</div>
                      </div>
                    </FormItem>
                    <FormItem label='最多选择' {...formLayout1} style={{ maxWidth: 250 }}>
                      <div className={styles.input_container}>
                        {getFieldDecorator( 'extended.max', {
                          initialValue: currentQuestion?.extended?.max
                        } )(
                          <InputNumber style={{ width: 210 }} max={currentQuestion?.optionsList?.length} min={1} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                        )}
                        <div className={styles.input_suffix}>个</div>
                      </div>
                    </FormItem>
                  </div>
                )
              }
            </>
          )
        }
        {
          questionType === 'SCORE' && (
            <FormItem label="选择分制">
              {getFieldDecorator( 'extended.score', {
                initialValue: String( currentQuestion?.extended?.score ) || '5',
                rules: [{ required: true }],
              } )(
                <Radio.Group>
                  <Radio value='5'>五分制</Radio>
                  <Radio value='10'>十分制</Radio>
                </Radio.Group>
              )}
            </FormItem>
          )
        }
        {
          questionType === 'IMAGE_UPLOAD' && (
            <div className={styles.text_limit}>
              <FormItem label='上传数量' style={{ marginLeft: 45, maxWidth: 250 }} {...formLayout1}>
                <div className={styles.input_container}>
                  {getFieldDecorator( 'extended.max', {
                    initialValue: currentQuestion?.extended?.max
                  } )(
                    <InputNumber style={{ width: 310 }} min={0} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                  )}
                  <div className={styles.input_suffix} style={{ opacity: 0 }}>none</div>
                </div>
              </FormItem>
              <FormItem label='上传文件大小限制' style={{ marginLeft: -45, maxWidth: 420 }} {...formLayout1}>
                <div className={styles.input_container}>
                  {getFieldDecorator( 'extended.fileSize', {
                    initialValue: currentQuestion?.extended?.fileSize
                  } )(
                    <InputNumber style={{ width: 310 }} min={0} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                  )}
                  <div className={styles.input_suffix}>M</div>
                </div>
              </FormItem>
            </div>
          )
        }
        {
          ( questionType === 'SINGLE_TEXT' ||
            questionType === 'MULTIPLE_TEXT' ) && (
            <>
              <FormItem label="文本格式">
                {getFieldDecorator( 'extended.textType', {
                  initialValue: currentQuestion?.extended?.textType || 'none',
                  rules: [{ required: true }],
                } )(
                  <Select
                    style={{ width: '75%' }}
                    showSearch
                    filterOption={( input, option ) =>
                      option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                  >
                    <Option key='none'>不限格式</Option>
                    <Option key='TEXT'>文字</Option>
                    <Option key='NUMBER'>数字</Option>
                  </Select>
                )}
              </FormItem>
              {
                getFieldValue( 'extended.textType' ) === 'TEXT' && (
                  <div className={styles.text_limit}>
                    <FormItem label='最少填写' style={{ marginLeft: 45, maxWidth: 300 }} {...formLayout1}>
                      <div className={styles.input_container}>
                        {getFieldDecorator( 'extended.min', {
                          initialValue: currentQuestion?.extended?.min
                        } )(
                          <InputNumber min={1} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                        )}
                        <div className={styles.input_suffix}>字</div>
                      </div>
                    </FormItem>
                    <FormItem label='最多填写' style={{ marginLeft: -45, maxWidth: 300 }} {...formLayout1}>
                      <div className={styles.input_container}>
                        {getFieldDecorator( 'extended.max', {
                          initialValue: currentQuestion?.extended?.max
                        } )(
                          <InputNumber min={1} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                        )}
                        <div className={styles.input_suffix}>字</div>
                      </div>
                    </FormItem>
                  </div>
                )
              }
              {
                getFieldValue( 'extended.textType' ) === 'NUMBER' && (
                  <FormItem label='位数限制' style={{ marginLeft: 45, maxWidth: 250 }} {...formLayout1}>
                    <div className={styles.input_container}>
                      {getFieldDecorator( 'extended.max', {
                        initialValue: currentQuestion?.extended?.max
                      } )(
                        <InputNumber style={{ width: 210 }} min={0} step={1} parser={value => ( value === '' ? null : value )} placeholder='不限' />
                      )}
                      <div className={styles.input_suffix}>位</div>
                    </div>
                  </FormItem>
                )
              }
            </>
          )
        }
      </>
    )
  }


  return (
    <Modal
      title='题目配置'
      maskClosable={false}
      visible={questionModalVisible}
      width={750}
      onCancel={() => handleQuestionModalVisible()}
      keyboard={false}
      onOk={() => handleSubmit()}
      destroyOnClose
      okText='保存题目'
    >
      <Form {...formLayout} onSubmit={handleSubmit}>
        <FormItem label="题目类型" key="topic">
          {getFieldDecorator( 'topic', {
            initialValue: currentQuestion?.topic || 'SINGLE_CHOICE',
            rules: [{ required: true, message: '请选择题目类型' }],
          } )(
            <Select
              style={{ width: '75%' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
            >
              {
                topicTypeList.map( item =>
                  <Option key={item.key}>{item.value}</Option>
                )
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="是否必填">
          {getFieldDecorator( 'answer', {
            valuePropName: 'checked',
            initialValue: !!currentQuestion?.answer,
            rules: [],
          } )( <Switch /> )}
        </FormItem>

        <FormItem label="题目标题">
          {getFieldDecorator( 'title', {
            initialValue: currentQuestion?.title,
            rules: [{ required: true, message: '请输入题目标题' }],
          } )(
            <Input
              placeholder="请输入题目标题"
            />
          )}
        </FormItem>
        <FormItem label="题目描述">
          {getFieldDecorator( 'description', {
            initialValue: currentQuestion?.description
          } )(
            <TextArea
              style={{ height: 120 }}
              maxLength={80}
              placeholder="请输入题目描述"
            />
          )}
        </FormItem>
        {renderQuestionConfigItem( getFieldValue( 'topic' ) )}
      </Form>
    </Modal>
  )
}

export default Form.create()( connect()( QuestionModal ) )
