import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'antd';
import styles from './index.less';
import Title from './Title.com';
import BarChart from './BarChart.Com'

let Timer
@connect( ( { marketing } ) => ( {
  loading: marketing.loading,
  nowActivityList: marketing.nowActivityList,
  // activeCountData: marketing.activeCountData,
} ) )

class NowActivity extends PureComponent {

  state={
    isShow: false,
    X: 0,
    Y: 0,
  }

  onMouseEnter=( event, item )=>{
    const e = event || window.event;
    this.props.onClick( item )
    if( Timer ){clearTimeout( Timer )}
    this.setState( {
      isShow: true,
      X: e.clientX,
      Y: e.clientY,
    } )
  }

  onMouseLeave = ( e )=>{
    e.stopPropagation()
    // if( Timer ){clearTimeout( Timer )}
    // Timer = setTimeout( () => {
      this.setState( { isShow: false } )
    // }, 500 );
  }

  // onMouseOver =( e )=>{
  //   e.stopPropagation();
  //   this.setState( {
  //     isShow:true
  //   } )
  // }

  render() {
    const { nowActivityList: { list }, loading, activeRow, history, activeCountData, noData, winSizeState } = this.props;
    const { isShow, X, Y }=this.state;
    const listNum = winSizeState ? 5 : 7
    const columnsNowActivity = [
      {
        title: <span style={{ paddingLeft:7 }}>活动名称</span>,
        dataIndex: 'name',
        ellipsis: true,
        render: name => <span style={{ color: '#000', paddingLeft: 7, fontSize:13 }}>{name}</span>,
      },
      {
        title: <span>活动进程</span>,
        dataIndex: 'endTime',
        align: 'center',
        width: 70,
        render: ( name, item ) => (
          <div className={styles.activeTime}>
            <div style={{ width: ( item.totalDays - item.lastDays ) / item.totalDays * 60 }} />
          </div>
        )
      },
      {
        title: <span>剩余天数</span>,
        dataIndex: 'lastDays',
        align: 'center',
        className:styles.tableCol,
        render: ( id, item ) => `${item.lastDays}天`
      },
      {
        title: <span>累计点击</span>,
        dataIndex: 'appid',
        align: 'center',
        render: ( appid, item ) =>
          <div onMouseLeave={( e )=>this.onMouseLeave( e )} style={{ color:appid ? '#FC9B00' : '#333', cursor:'pointer' }}>
            <span onMouseOver={( e )=>{this.onMouseEnter( e, item )}}>{appid || '--'}</span>
          </div>
      },
    ]


    return (
      <div className={styles.table_box} style={{ position:'relative' }}>
        <Title name="活动概况" style={{ marginBottom:5 }}>
          <div style={{ color:'#999' }}>
            活动进行中{list && <span style={{ color: '#1890FF', marginLeft:8 }}>{list.length}个</span> }
          </div>
          <div
            style={{ textAlign:'center', color:'#999', cursor:'pointer', position:'absolute', top:'17px', right:'20px' }}
            onClick={() => { history.push( '/oldActivity/activityPanel' )}}
          >查看更多
          </div>
        </Title>
        <Table
          size="small"
          rowKey="id"
          columns={columnsNowActivity}
          // rowClassName={( record )=>{
          //   return activeRow && activeRow.id === record.id ? styles.table_row : ''
          // }}
          // onRow={record => {
          //   return {
          //     onMouseEnter: ( e ) => {this.onMouseEnter( e, record )}, // 鼠标移入行
          //   };
          // }}
          loading={loading}
          dataSource={list && list.length > listNum ? list.slice( 0, listNum ) : list}
          pagination={false}
          bordered={false}
        />
        {/* <div
          hidden={!isShow}
        > */}
        <div
            // onMouseOver={( e )=>{this.onMouseOver( e )}}
          className={styles.activeBox}
          style={{ right:-120, top:`${Y+50}px`, opacity:0.9 }}
          hidden={!isShow}
        >
          <div style={{ color:'#111', padding:'5px 0 5px 10px', fontSize:13 }}>
            <Fragment>{activeRow && activeRow.name} </Fragment>
          </div>
          {activeCountData && activeCountData.length > 0 &&
            <BarChart
              list={activeCountData}
              options={{
                xAxis: 'date',
                yAxis: [
                  { key: 'newusers', name: '新增点击', color: '#47A1F7' },
                  { key: 'total', name: '累计点击', color: '#FC9B00' },
                ]
              }
            }
            />
         }
          {
          activeCountData && activeCountData.length === 0 &&
          <div style={{ paddingTop:50 }}>{noData}</div>
         }
        </div>
        {/* </div> */}

      </div>

    );
  }
}

export default NowActivity;
