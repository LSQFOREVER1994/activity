import React, { useEffect } from 'react'
import { connect } from 'dva';
import { Empty, Table, Spin, Tag } from 'antd';
import Chart from './Chart';
import styles from './votingData.less';

// const topicTypeList = {
//   SINGLE_CHOICE: '单选题',
//   MULTIPLE_CHOICE: '多选题',
//   SCORE: '评分题',
//   SINGLE_TEXT: '单行文本',
//   MULTIPLE_TEXT: '多行文本',
//   DROP_DOWN: '下拉选择',
//   ESSAY_QUESTION: '问答题',
//   //  IMAGE_UPLOAD': '图片上传',
// }

// 问卷统计 ->  题目图表分析
function StatisticsChart( props ) {
  const { id, chartData, dispatch, elementId, loading, domData } = props;
    
  // 获取数据统计
  const getStatisticsData = () => {
    dispatch( {
      type: 'votingData/getVotingStatistics',
      payload: {
        activityId: id,
        elementId
      },
    } );
  }

  useEffect( () => {
    
    if ( id && elementId ) {
      getStatisticsData()
    }
  }, [id, elementId] )

  // 单选、多选
  const renderChart = ( itemData, index ) => {
    const columns = [
      {
        title: <span>选项</span>,
        dataIndex: 'itemValue',
        key: 'itemValue',
        width: "70%",
        render: itemValue => <span>{itemValue || '--'}</span>,
      },
      {
        title: <span>总计</span>,
        dataIndex: 'votes',
        key: 'votes',
        width: "15%",
        render: votes => <span>{votes || '--'}</span>,
      },
      {
        title: <span>占比</span>,
        dataIndex: 'scale',
        key: 'scale',
        width: "15%",
        render: scale => <span>{`${( scale * 100 ).toFixed( 2 )}% ` || '--'}</span>,
      },
    ]
    return (
      <div className={styles.item_box} key={index}>
        <div className={styles.item_title}>{domData.title}</div>
        <div className={styles.item_des}>{domData.description}</div>
        <div className={styles.item_total}>
          <Tag>{domData.questionType === "SINGLE_CHOICE" ? '单选题' : '多选题'}</Tag>
        </div>
        <div className={styles.item_data_box}>
          <Chart data={{ ...itemData, statisticsResult:chartData }} />
          <div className={styles.item_data}>
            <Table
              style={{ width: '100%' }}
              size='small'
              rowKey="key"
              columns={columns}
              pagination
              dataSource={chartData}
              bordered
            />
          </div>
        </div>
      </div>
    );
  }

  let statisticsView = <Empty image={loading ? <Spin /> : Empty.PRESENTED_IMAGE_SIMPLE} description={loading ? "加载中..." : "暂无数据"} />
  if ( chartData && chartData.length > 0 ) {
    statisticsView = renderChart( chartData[0], 0 )
  }

  return statisticsView
}

export default connect( ( { votingData } ) => ( {
  ...votingData
} ) )( StatisticsChart );
