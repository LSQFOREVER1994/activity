import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Spin } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';
import PieChart from './PieChart.com';
import MapChart from './MapChart.com';

const tabList = [
  { name: '昨日', key: 1 },
  { name: '前7天', key: 7 },
  { name: '前30天', key: 30 },
]
@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  userAnalysisData: exhibition.userAnalysisData,
} ) )
@Form.create()
class UserAnalysis extends PureComponent {

  compayForm

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { minWidth: '20%' }
  };


  constructor( props ) {
    super( props );
    this.state = {
      activeTab: 1,
    }
  }

  componentDidMount() {
    this.fetchList()
  }



  // 获取列表
  fetchList = ( params ) => {
    const { dispatch } = this.props;
    const { activeTab } =this.state;
    dispatch( {
      type: 'exhibition/getUserAnalysisData',
      payload: {
        miniConfigId:2,
        start: moment().subtract( 'days', activeTab ).format( 'YYYY-MM-DD' ),
        end: moment().subtract( 'days', 1 ).format( 'YYYY-MM-DD' ),
        ...params,
      },
    } );
  }

  changeTab = ( tab ) => {
    this.setState( { activeTab: tab.key }, () => {
      this.fetchList( { pageNum: 1 } )
    } )
  }
  
  render() {
    const { userAnalysisData, loading } = this.props;
    const { activeTab } = this.state;
    return (
      <GridContent>
        <Tabs activeTab={activeTab} changeTab={this.changeTab} />

        <Box title='性别分布' loading={loading}>
          <div className={styles.user_analysis_item}>
            {userAnalysisData.genders && <PieChart data={userAnalysisData.genders} />}
          </div>
          <div className={styles.user_analysis_item}>
            <Table list={userAnalysisData.genders} name="性别" />
          </div>
        </Box> 
        <Box title='年龄分布' loading={loading}>
          <div className={styles.user_analysis_item}>
            {userAnalysisData.ages && <PieChart data={userAnalysisData.ages} />}
          </div>
          <div className={styles.user_analysis_item}>
            <Table list={userAnalysisData.ages} name="年龄" />

          </div>
        </Box> 
        <Box title='地区分布' loading={loading}>
          <div className={styles.user_analysis_item}>
            {userAnalysisData.province && <MapChart data={userAnalysisData.province} />}
          </div>
          <div className={styles.user_analysis_item}>
            <Table list={userAnalysisData.province} name="地域" />
          </div>
        </Box> 
        <Box title='终端分布' loading={loading}>
          <div className={styles.user_analysis_item}>
            {userAnalysisData.platforms && <PieChart data={userAnalysisData.platforms} />}
          </div>
          <div className={styles.user_analysis_item}>
            <Table list={userAnalysisData.platforms} name="终端" />

          </div>
        </Box> 
       
      </GridContent>
    );
  }
}

export default UserAnalysis;

const Box = ( props ) => {
  return (
    <div className={styles.user_analysis_box}>
      <Title name={props.title} />
      {props.loading ? <Spin tip="Loading..." style={{ width:'100%', position:'absolute', top:'45%' }} />:props.children}
    </div>
  )
}
const Table = ( { list=[], name='性别' } ) => {
  const total = list.reduce( ( ( totals, curr ) => totals + curr.value ), 0 )
  return (
    <div className={styles.user_analysis_table}>
      <div className={`${styles.user_analysis_table_row} ${styles.user_analysis_table_header} `}>
        <div className={styles.user_analysis_table_name}>{name}</div>
        <div className={styles.user_analysis_table_num}>用户数</div>
        <div className={styles.user_analysis_table_precent}>百分比</div>
      </div>  
      {list && list.map( item => (
        <div className={`${styles.user_analysis_table_row}`}>
          <div className={styles.user_analysis_table_name}>{item.name}</div>
          <div className={styles.user_analysis_table_num}>{item.value}</div>
          <div className={styles.user_analysis_table_precent}>{total ? ( ( item.value / total ) * 100 ).toFixed( 2 ) : 0}%</div>
        </div>  
      ) )}
    </div>
  )
}
const Title = ( { name } ) => (
  <div style={{ position: "absolute", left: '10%', fontSize: 16, fontWeight: 'bold' }}>{name}</div>

)


const Tabs = ( { activeTab, changeTab } ) => {
  return (
    <div className={styles.user_tabs_box}>
      {
        tabList.map( item =>
          <div
            onClick={() => { changeTab( item ) }}
            className={`${styles.user_tabs_item} ${activeTab === item.key ? styles.user_tabs_item_active : ''}`}
            key={item.key}
          >{item.name}
          </div>
        )
      }
    </div>
  )
}