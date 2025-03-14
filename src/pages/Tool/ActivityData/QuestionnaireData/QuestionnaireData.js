import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';

import styles from './questionnaire.less';
import QuestionnaireStatistics from './QuestionnaireStatistics';
import QuestionnaireDetail from './QuestionnaireDetail'

const { TabPane } = Tabs;

@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
  questionnaireMap: questionnaire.questionnaireMap,
} ) )

class QuestionnaireData extends PureComponent {

  constructor( props ){
    super( props );
    const { id } = props;
    this.state = {
      key:'statistics',
      id,
      statisticsData:[],
      detailData:{}
    }
  }

  componentDidMount() {
    const { id } = this.state;
    this.getQuestionnaireStatistics( id )
    // if( id ){
    //   this.setState( {
    //     id
    //   }, ()=>{
    //     this.getQuestionnaireStatistics( id )
    //   } )
    // }
  }


// 切换tab
  onChangeTab=( key )=>{
    const { id }=this.state
    this.setState( {
      key
    }, ()=>{
    if( key==='statistics' ){
      this.getQuestionnaireStatistics( id )
    }else {
      this.getQuestionnaireDetail()
    }
    } )
  }

  // 获取数据统计
  getQuestionnaireStatistics = ( id ) => {
      const { dispatch } = this.props;
      dispatch( {
        type: 'questionnaire/getQuestionnaireStatistics',
        payload: {
          id,
        },
        callFunc:( result )=>{
          this.setState( {
            statisticsData:result
          } )
        }
      } );
    }

  // 获取详细数据
  getQuestionnaireDetail = ( pageNum=1, pageSize=10, orderBy='create_time desc' ) => {
    const { id }=this.state
    const { dispatch } = this.props;
    dispatch( {
      type: 'questionnaire/getQuestionnaireDetail',
      payload: {
        id,
        pageNum,
        pageSize,
        orderBy,
      },
      callFunc:( result )=>{
        this.setState( {
          detailData:result
        } )
      }
    } );
  }


  // 导出数据
  getQuestionnaireExport = ( ) => {
    const { id }=this.state
    if( !id ){
       return
    }
    exportXlsx( {
      type:'cropService',
      uri:`questionnaire/new/data/export/?id=${id}`,
      xlsxName:'详细数据.xlsx',
      callBack: () => { }
    } )
  }

  render() {
    const { key, statisticsData, detailData }=this.state
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Tabs defaultActiveKey={key} onChange={this.onChangeTab}>
            <TabPane tab="数据统计" key="statistics">
              <QuestionnaireStatistics statisticsData={statisticsData} />
            </TabPane>
            <TabPane tab="详细数据" key="detail">
              <QuestionnaireDetail detailData={detailData} getQuestionnaireDetail={this.getQuestionnaireDetail} />
            </TabPane>
          </Tabs>
          <Button
            type="primary"
            style={{ position:'absolute', top:'60px', right:'40px' }}
            onClick={this.getQuestionnaireExport}
          >
            导出
          </Button>
        </div>

      </GridContent>
    );
  }
}

export default QuestionnaireData;
