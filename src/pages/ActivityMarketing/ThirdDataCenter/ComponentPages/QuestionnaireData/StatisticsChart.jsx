import React, { useEffect } from 'react'
import { connect } from 'dva';
import { Empty, Table, Spin, Tag } from 'antd';
import Chart from './Chart';
import styles from './questionnaireData.less';
import BarChart from './Chart/Bar';

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

// 问卷统计 ->  题目图表分析
function StatisticsChart( props ) {
  const { id, chartData, dispatch, elementId, loading } = props;
  
  // 获取数据统计
  const getStatisticsData = () => {
    dispatch( {
      type: 'questionnaireData/getQuestionnaireStatistics',
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
        dataIndex: 'key',
        key: 'key',
        width: "70%",
        render: key => <span>{key || '--'}</span>,
      },
      {
        title: <span>总计</span>,
        dataIndex: 'value',
        key: 'value',
        width: "15%",
        render: value => <span>{value || '--'}</span>,
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
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>
          <Tag>{topicTypeList[itemData.topic]}</Tag>
          收集数据：{itemData.count}
        </div>
        <div className={styles.item_data_box}>
          <Chart data={itemData} />
          <div className={styles.item_data}>
            <Table
              style={{ width: '100%' }}
              size='small'
              rowKey="key"
              columns={columns}
              pagination
              dataSource={itemData.statisticsResult}
              bordered
            />
          </div>
        </div>
      </div>
    );
  }
  // 评分
  const renderScore = ( itemData, index ) => {
    itemData.statisticsResult.sort( ( a, b ) => {
      return a.key - b.key
    } )
    const columns = [
      {
        title: <span>选项</span>,
        dataIndex: 'key',
        key: 'key',
        width: "70%",
        render: key => <span>{`${key}分` || '--'}</span>,
      },
      {
        title: <span>总计</span>,
        dataIndex: 'value',
        key: 'value',
        width: "15%",
        render: value => <span>{value || '--'}</span>,
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
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>
          <Tag>{topicTypeList[itemData.topic]}</Tag>
          收集数据：{itemData.count}
        </div>
        {/* <div className={styles.item_rate}>
          <span>
            <Rate value={Number( num )} count={Number( startCount )} disabled allowHalf />
            <span style={{ marginLeft: "10px" }}>平均分：{Number( num ).toFixed( 2 )}</span>
          </span>
        </div> */}
        <div className={styles.item_data_box}>
          <BarChart {...itemData} />
          <div className={styles.item_data}>
            <Table
              style={{ width: '100%' }}
              size='small'
              rowKey="key"
              columns={columns}
              pagination
              dataSource={itemData.statisticsResult}
              bordered
            />
          </div>
        </div>
      </div>
    );
  }
  // 简答
  const renderAnswer = ( itemData, index ) => {
    return (
      <div className={styles.item_box} key={index}>
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>
          <Tag>{topicTypeList[itemData.topic]}</Tag>
          收集数据：{itemData.count}
        </div>
      </div>
    );
  }

  // 文本
  const renderText = ( itemData, index ) => {
    const columns = [
      {
        title: <span>编号</span>,
        dataIndex: 'key',
        key: 'key',
        width: 100,
        render: key => <span>{key || '--'}</span>,
      },
      {
        title: <span>文本信息</span>,
        dataIndex: 'value',
        key: 'value',
        render: value => <span>{value || '--'}</span>,
      },
    ]
    return (
      <div className={styles.item_box} key={index}>
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}><Tag>{topicTypeList[itemData.topic]}</Tag>
          收集数据：{itemData.count}
        </div>
        <Table
          style={{ width: '100%', padding: 20 }}
          size='small'
          rowKey="key"
          columns={columns}
          pagination
          dataSource={itemData.statisticsResult}
          bordered
        />
      </div>
    )
  }
  let statisticsView = <Empty image={loading ? <Spin /> : Empty.PRESENTED_IMAGE_SIMPLE} description={loading ? "加载中..." : "暂无数据"} />
  if ( chartData && chartData.length > 0 ) {
    statisticsView = chartData.map( ( info, index ) => {
      let itemView = null
      if ( info.topic === 'SINGLE_CHOICE' || info.topic === 'MULTIPLE_CHOICE' || info.topic === 'DROP_DOWN' ) {
        // 单选、多选、下拉选择展示图表
        itemView = renderChart( info, index )
      } else if ( info.topic === 'ESSAY_QUESTION' ) {
        // 简答
        itemView = renderAnswer( info, index )
      } else if ( info.topic === 'SCORE' ) {
        // 评分展示条形图
        itemView = renderScore( info, index )
      } else if ( info.topic === 'SINGLE_TEXT' || info.topic === 'MULTIPLE_TEXT' ) {
        // 图片上传
        itemView = renderText( info, index )
      }
      return itemView
    } )
  }

  return statisticsView
}

export default connect( ( { questionnaireData } ) => ( {
  ...questionnaireData
} ) )( StatisticsChart );
