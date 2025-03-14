import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Rate, Table, Empty } from 'antd';
import styles from './questionnaire.less';
import ItemChart from './ItemChart'


@connect( ( { questionnaireData } ) => ( {
  loading: questionnaireData.loading,
} ) )

class QuestionnaireStatistics extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      data: props.statisticsData || [],
    };
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.statisticsData !== nextProps.statisticsData ) {
      this.setState( {
        data: nextProps.statisticsData,
      } );
    }
  }




  // 单选、多选
  renderChart = ( itemData, index ) => {
    const columns = [
      {
        title: <span>选项</span>,
        dataIndex: 'key',
        render: key => <span>{key || '--'}</span>,
      },
      {
        title: <span>计数</span>,
        dataIndex: 'value',
        key: 'value',
        render: value => <span>{value || '--'}</span>,
      },
      {
        title: <span>比例</span>,
        dataIndex: 'scale',
        key: 'scale',
        render: scale => <span>{`${( scale * 100 ).toFixed( 2 )}% ` || '--'}</span>,
      },
    ]
    return (
      <div className={styles.item_box} key={index}>
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>收集数据：{itemData.count}</div>
        <div className={styles.item_data_box}>
          <ItemChart statisticsResult={itemData.statisticsResult} />
          <div className={styles.item_data_box_line} />
          <div className={styles.item_data}>
            <Table
              size='small'
              rowKey="id"
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
  renderScore = ( itemData, index ) => {
    const startCount = itemData.statisticsResult[0].key
    const num = itemData.statisticsResult[0].value
    return (
      <div className={styles.item_box} key={index}>
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>收集数据：{itemData.count}</div>
        <div className={styles.item_rate}>
          <span>
            <Rate value={Number( num )} disabled count={Number( startCount )} />
            <span style={{ marginLeft: "10px" }}>平均分：{Number( num ).toFixed( 2 )}</span>
          </span>
        </div>
      </div>
    );
  }

  // 简答
  renderAnswer = ( itemData, index ) => {
    return (
      <div className={styles.item_box} key={index}>
        <div>{index + 1}、{itemData.title}</div>
        <div className={styles.item_total}>收集数据：{itemData.count}</div>
      </div>
    );
  }

  render() {
    const { data } = this.state
    let statisticsView = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
    if ( data && data.length > 0 ) {
      statisticsView = data.map( ( info, index ) => {
        let itemView = null
        if ( info.topic === 'SINGLE_CHOICE' || info.topic === 'MULTIPLE_CHOICE' ) {
          // 单选或者多选展示图表
          itemView = this.renderChart( info, index )
        } else if ( info.topic === 'ESSAY_QUESTION' ) {
          // 简答
          itemView = this.renderAnswer( info, index )
        } else if ( info.topic === 'SCORE' ) {
          // 评分展示星星
          itemView = this.renderScore( info, index )
        }
        return itemView
      } )
    }

    return statisticsView
  }
}

export default QuestionnaireStatistics;
