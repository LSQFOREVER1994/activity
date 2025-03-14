/* eslint-disable no-param-reassign */
/* eslint-disable space-in-parens */
import React, {  useEffect, useState } from 'react'
import { Collapse, Icon, Button, Empty, Popconfirm  } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'dva';
import QuestionModal from './QuestionModal'
import styles from './index.less'

const { Panel } = Collapse

const topicType = {
  SINGLE_CHOICE:'单选题',
  MULTIPLE_CHOICE:'多选题',
  SCORE:'评分题',
  SINGLE_TEXT:'单行文本',
  MULTIPLE_TEXT:'多行文本',
  DROP_DOWN:'下拉选择'
}


function QuestionNaireConfig({ componentsData, changeValue }) {
  const { question = [],  } = componentsData
  const [questionModalVisible, setQuestionModalVisible] = useState(false)
  const [virtualId, setVirtualId] = useState()

  const handleQuestionModalVisible = (vid) => {
    setQuestionModalVisible(!questionModalVisible)
    setVirtualId(() => vid)
  }

  const generateQuestion = (newList) => {
    if(!question?.length) return
    const datas = newList?.length ? newList : question
    const newQuestionList = datas?.length && datas.map((item, idx) =>{
      return {
        ...item,
        virtualId: Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36),
        sort:idx
      }
    })
    changeValue(newQuestionList, 'question')
  }

  useEffect(() => {
    generateQuestion()
  }, [question?.length])

  // 添加题目
  const handleAddQuestion = () => {
    const copyQuestion = question?.length ? question : []
    const newQuestionList = copyQuestion.concat({
      isOpen: true,
      answer: true,
      virtualId: Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36),
      title: `题目${(question?.length || 0) + 1}`,
      topic: 'SINGLE_CHOICE',
      optionList:['选项1'],
      description:'这是题目描述'
    });
    changeValue(newQuestionList, 'question')
  }

  // 删除题目
  const handleDeleteQuesiton = (deleteId) => {
    const newListAfterDelete = question.filter(item => item.virtualId !== deleteId) || []
    changeValue(newListAfterDelete, 'question')
  }

  // 重新排序拖拽列表
  const reorderList = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // 拖拽结束计算位置重置题目数组
  const onDragEnd = result => {
    if (!result.destination || !result.draggableId) {
      return;
    }
    const newList = reorderList(
      question || [],
      result.source.index,
      result.destination.index
    );
    generateQuestion(newList)

  };

  const limitWords = ( txt ) => {
    if ( txt.length > 14 ) {
      return `${txt.slice( 0, 12 )}...`
    }
    return txt
  }


  return (
    <Collapse defaultActiveKey="qnConfig" expandIconPosition="left" bordered style={{ marginBottom: 20 }}>
      <Panel header="问卷配置" key="qnConfig">
        <div className={styles.drag_container}>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className={styles.question_container}>
                      {
                      question?.length ? question.map((item, idx) => {
                        return (
                          <Draggable
                            key={item.virtualId}
                            draggableId={`${item.virtualId}`}
                            index={idx}
                          >
                            {(provided1) => (
                              <div
                                className={styles.single_question}
                                key={item.virtualId}
                                ref={provided1.innerRef}
                                {...provided1.draggableProps}
                                {...provided1.dragHandleProps}
                              >
                                <div className={styles.question_title}>
                                  {`【${topicType[item.topic]}】${limitWords(item.title)}`}
                                </div>
                                <div className={styles.question_options}>
                                  <Icon
                                    type="edit"
                                    style={{ fontSize: 16, margin: '0 5px' }}
                                    onClick={() => handleQuestionModalVisible(item.virtualId)}
                                  />
                                  <Popconfirm
                                    title="是否删除题目"
                                    okText='是'
                                    cancelText='否'
                                    onConfirm={() =>handleDeleteQuesiton(item.virtualId)}
                                  >
                                    <Icon
                                      type="delete"
                                      style={{ fontSize: 16, margin: '0 5px' }}
                                    />
                                  </Popconfirm>

                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目，请添加题目" />
                    }
                    </div>
                    {provided.placeholder}
                  </div>
              )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className={styles.add_button}>
            <Button
              type="dashed"
              onClick={() => handleAddQuestion()}
              icon="plus"
              style={{ width: 280 }}
            >
              <span>添加题目</span>
            </Button>
          </div>
        </div>
        <QuestionModal
          handleQuestionModalVisible={handleQuestionModalVisible}
          questionModalVisible={questionModalVisible}
          componentsData={componentsData}
          changeValue={changeValue}
          virtualId={virtualId}
        />
      </Panel>
    </Collapse>
  )
}

export const HIDE_TEXT_COLOR = true;
export default connect()(QuestionNaireConfig)
