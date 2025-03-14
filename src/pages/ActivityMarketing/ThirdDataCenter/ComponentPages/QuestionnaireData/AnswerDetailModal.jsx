import React from 'react'
import { Modal, Descriptions, Tag, Divider, Rate } from 'antd';
import styles from './questionnaireData.less';

const { Item } = Descriptions;

const topicTypeList = {
  SINGLE_CHOICE: '单选题',
  MULTIPLE_CHOICE: '多选题',
  SCORE: '评分题',
  SINGLE_TEXT: '单行文本',
  MULTIPLE_TEXT: '多行文本',
  DROP_DOWN: '下拉选择',
  ESSAY_QUESTION: '问答题',
  //  IMAGE_UPLOAD': '图片上传',
}

function AnswerDetailModal( props ) {
  const { isShwoModal, setIsShwoModal, currentRecord } = props;
  const { id, mobile, account, userNo, startTime, endTime, spendTime, userReply } = currentRecord
  
  return (
    <Modal
      visible={isShwoModal}
      title="答卷详情"
      width="50%"
      footer={null}
      onCancel={() => { setIsShwoModal( false ) }}
    >
      <Descriptions title="基本信息">
        <Item label="编号">{id}</Item>
        <Item label="手机号">{mobile}</Item>
        <Item label="资金账号">{account}</Item>
        <Item label="客户号">{userNo}</Item>
        <Item label="开始时间">{startTime}</Item>
        <Item label="结束时间">{endTime}</Item>
        <Item label="答题时长">{spendTime}</Item>
      </Descriptions>
      <Descriptions title="答卷信息" />
      {userReply?.map( ( item, index ) => {
        return (
          <div>
            <div>{`${index + 1}、`}<Tag>{topicTypeList[item.topic]}</Tag>{item.title}</div>
            <div className={styles.answers}>
              {
                item.topic !== 'SCORE' && item?.options?.map( ( option ) => {
                  return <span key={option}>{option}</span>
                } )
              }
              {
                item.topic === 'SCORE' && <Rate count={Number( item.extended.score )} value={Number( item.options[0] )} disabled allowHalf />
              }
            </div>
            <Divider />
          </div>
        )
      } )}
    </Modal>
  )
}

export default AnswerDetailModal
