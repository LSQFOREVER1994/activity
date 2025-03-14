import React from "react";
import { connect } from 'dva';
import moment from 'moment';
import NowActivity from './nowActivity';

@connect( ( { marketing } ) => ( {
  loading: marketing.loading,
  activeCountData: marketing.activeCountData,
} ) )
class ActivityCom extends React.PureComponent {
  constructor( props ){
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 100,
      from: moment().subtract( 9, 'days' ).format( 'YYYY-MM-DD' ),
      to: moment().format( 'YYYY-MM-DD' ),

    }
  }

  componentDidMount(){
    this.fetchNowActivityList()
  }

  fetchNowActivityList = () => {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getNowActivityList',
      payload: {
        pageNum,
        pageSize,
        isSale: true,
        activityState: 'GOING',
        orderBy: 'start_time desc',
      },
      callFunc: ( res ) => {
        // this.tableClick( res.list[0] )
      }
    } );
  }

  tableClick = ( record ) => {
    this.setState( { activeRow:record } )
    if ( record.buryPointId ) {
      this.getActiveCountData( record.buryPointId, record.startTime, record.endTime )
    }else {
      this.props.dispatch( {
        type:'marketing/setState',
        payload: { activeCountData: [] }
      } )
    }
  }

  getActiveCountData = ( appid, fromTime, toTime ) =>{
    const { dispatch } = this.props;
    const { from, to } = this.state;
    dispatch( {
      type: 'marketing/getActiveCountData',
      payload: {
        appid,
        from: fromTime ? fromTime.substring( 0, 10 ) : from,
        to: toTime ? toTime.substring( 0, 10 ) : to
      },
      callFunc: ( res ) => {
      }
    } )
  }



  render() {
    const { activeCountData, history, noData, winSizeState } = this.props;
    
    const { activeRow } = this.state;
    return (
      <div>
        <NowActivity
          activeRow={activeRow}
          winSizeState={winSizeState}
          onClick={this.tableClick} 
          history={history} 
          activeCountData={activeCountData} 
          noData={noData}
        />
      </div>
    )
  }
}

export default ActivityCom