import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Icon } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';
import LineChartTop from './LineChartTop.com';
import LineChartBottom from './LineChartBottom';
import NoAccess from '../noAccess'

const { RangePicker } = DatePicker;


const orgNameObj = {
  HEAD_COMPANY: { key: 'headCompany', name: '总公司' },
  BRANCH_FIRST: { key: 'branchFirst', name: '一级分公司' },
  BRANCH_SECOND: { key: 'branchSecond', name: '二级分公司' },
  DEPARTMENT: { key: 'department', name: '营业部' },
}
const typeObj = {
  view:'浏览量',
  favorite:'收藏量',
  share:'转发量',

}

const tabList = [
  { name: '浏览', key: 'view' },
  { name: '收藏', key: 'favorite' },
  { name: '转发', key: 'share' },
]
@connect( ( { exhibition } ) => ( {
  myOrgs: exhibition.myOrgs,
  amountData: exhibition.amountData,
  rankData: exhibition.rankData,
  panelData: exhibition.panelData,
} ) )
@Form.create()
class ProductAnalysis extends PureComponent {


  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { width: '20%' }
  };


  constructor( props ) {
    super( props );
    this.state = {
      myOrgs: props.myOrgs,
      type:'view',
      from:'',
      to:''
    }
  }

  componentDidMount() {
    const { myOrgs } = this.state;
    if ( myOrgs ) {
      this.getFetchBefor( myOrgs )
    }
  }


  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.myOrgs !== prevState.myOrgs ) {
      return {
        myOrgs: nextProps.myOrgs
      }
    }
    return null
  }


  componentDidUpdate( prevProps, prevState ) {
    if ( prevState.myOrgs !== this.state.myOrgs ) {
      this.getFetchBefor( this.state.myOrgs )
    }

  }


  getPanelData = ( params ) => {
    const { dispatch } = this.props;
    const { type } = this.state;
    const values = this.compayForm.getValues()
    dispatch( {
      type: 'exhibition/getPanelData',
      payload: {
        date: moment( new Date() ).format( 'YYYY-MM-DD' ),
        type,
        ...values,
        ...params,
      },
    } );
  }



  getChartData = ( params ) => {
    const { dispatch, } = this.props;
    const { from, to } = this.state;
    const values = this.compayChartForm.getValues()
    dispatch( {
      type: 'exhibition/getAmountData',
      payload: {
        orderBy: 'date desc',
        from,
        to,
        ...values,
        ...params,
      },
    } );
    dispatch( {
      type: 'exhibition/getRankData',
      payload: {
        orderBy: 'date desc',
        from,
        to,
        ...values,
        ...params,
      },
    } );
  }

  changeTab = ( tab ) => {
    this.setState( { type: tab.key }, ()=>this.getPanelData( {} ) )
  }
  
  getFetchBefor = ( myOrgs ) => {
    const params = {};
    Object.keys( myOrgs ).forEach( item => {
      params[orgNameObj[item].key] = myOrgs[item].id
    } )
    this.getChartData( params )
    this.getPanelData( params )
  }

  searchPanelReset = () => {
    this.compayForm.formReset();
    this.getPanelData();
  }

  searchChartReset = () => {
    this.compayChartForm.formReset();
    this.setState( { from:'', to:'' }, ()=>{
        this.getChartData()
    } )
  }

  onChange = ( time ) => {
    const from = moment( time[0] ).format( 'YYYY-MM-DD' );
    const to = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { from, to } )
  }

  render() {
    const { amountData: { list: amountList }, rankData: { list: rankList }, panelData } = this.props;
    const { from, to } = this.state;
    const { type } = this.state;
    return (
      <GridContent style={{ padding: 0 }}>
        <Tabs activeTab={type} changeTab={this.changeTab} />

        <div style={{ backgroundColor: '#fff', marginBottom: 20, padding: '20px 20px 0', overflow: "hidden"  }}>
          <CompanyForm onRef={div => { this.compayForm = div }}>
            <div style={{ float: 'right' }}>
              <Button
                type="primary"
                style={{ marginLeft: 15, marginRight: 15, marginTop: 4 }}
                onClick={() => { this.getPanelData() }}
              >搜索
              </Button>
              <Button
                type="primary"
                style={{ marginTop: 4 }}
                onClick={this.searchPanelReset}
              >清空
              </Button>
            </div>
          </CompanyForm>
          <StatisticalCom data={panelData[type]} type={type} /> 
        </div>
        <div style={{ backgroundColor: '#fff', padding: 20, overflow: "hidden" }}>
          <CompanyForm onRef={div => { this.compayChartForm = div }} />
          <div style={{ marginTop: 20, }}>
            <div style={{ display: 'inline-block' }}>
              <span style={{ color: 'rgba(0,0,0,.85)', width: 78, display: 'inline-block', textAlign: 'right' }}>时间：</span>
              <RangePicker
                value={from ? [moment( from ), moment( to )] : []}
                onChange={this.onChange}
              />
            </div>
            <div style={{ float: 'right', }}>
              <Button
                type="primary"
                style={{ marginLeft: 15, marginRight: 15, marginTop: 4 }}
                onClick={() => { this.getChartData() }}
              >搜索
              </Button>
              <Button
                type="primary"
                style={{ marginTop: 4 }}
                onClick={this.searchChartReset}
              >清空
              </Button>
            </div>
          </div>

        </div>
        <div style={{ backgroundColor:'#fff' }}>
          <LineChartTop
            title={`${typeObj[type]}趋势`}
            list={amountList}
            type={type}
            options={{
                xAxis: 'date',
                yAxis: [
                    { key: `${type}s`, name: typeObj[type], color: '#47A1F7' },
                  ]
                }}
          />
          <LineChartBottom
            title="排名趋势"
            list={rankList}
            type={type}
            options={{
              xAxis: 'date',
              yAxis: [
                  { key: `${type}RankOfAll`, name: '总排名', color: '#47A1F7' },
                  { key: `${type}RankOfDay`, name: '单日排名', color: '#42b40a' },
                ]
              }}
          />
        </div>
      </GridContent>
    );
  }
}

export default ProductAnalysis;


const StatisticalCom = ( { data={}, type } ) => {
  const { updateTime, rankOfAll, rankOfAllDiff, rankOfYesterday, rankOfYesterdayDiff } = data
  return (
    <Fragment>
      <div className={styles.statistocal_time}>更新时间：{updateTime || '--'}</div>
      <div className={styles.statistocal_box}>
        <div className={styles.statistocal_item}>
          <ItemTitle title={`总${typeObj[type]}`} />
          <div className={styles.statistocal_item_value}>{data[`${type}Total`] !== undefined ? data[`${type}Total`] : '--'}</div>
        </div>
        <div className={styles.statistocal_item}>
          <ItemTitle title={`今日实时${typeObj[type]}`} />
          <div className={styles.statistocal_item_value}>{data[`${type}Today`] !== undefined  ? data[`${type}Today`] : '--'}</div>
        </div>
        <div className={styles.statistocal_item}>
          <ItemTitle title={`昨日${typeObj[type]}`} />
          <div className={styles.statistocal_item_value}>{data[`${type}Yesterday`] !== undefined  ? data[`${type}Yesterday`] : '--'}
            <Change num={data[`${type}YesterdayDiff`]} />
          </div>
        </div>
        <div className={styles.statistocal_item} style={{ display:'flex', justifyContent:'space-between' }}>
          <div style={{ width: '50%',  }}>
            <ItemTitle title="总排名" />
            <div className={styles.statistocal_item_value}>{rankOfAll || '--'}
              <Change num={rankOfAllDiff} />
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <ItemTitle title="昨日排名" />
            <div className={styles.statistocal_item_value}>{rankOfYesterday || '--'}
              <Change num={rankOfYesterdayDiff} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

const ItemTitle = ( { title } ) => <div className={styles.statistocal_item_title}>{title}</div>

const Change = ( { num } ) => {
  if ( !num ) return ''
  const Style = { fontSize:18, color:num>0 ? 'red':'green' }
  if ( num > 0 ) return <span style={{ fontSize:12, paddingLeft:4 }}><Icon style={Style} type="caret-up" />{num}</span>
  return <span style={{ fontSize:12 }}><Icon type="caret-down" style={Style} />{Math.abs( num )}</span>
}

const Tabs = ( { activeTab, changeTab } ) => {
  return (
    <div className={styles.user_tabs_box} style={{ paddingBottom:0 }}>
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