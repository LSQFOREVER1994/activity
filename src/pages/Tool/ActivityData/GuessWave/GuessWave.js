import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { Form, Table, Modal, Icon } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import moment from "moment";
import WaveFilterForm from './WaveFilterForm';
import GuessDetail from './GuessDetail';
import styles from './GuessWave.less';


const date = ( end, rankType )=>{
  let startTime;
  let endTime;
  if ( rankType === "WEEK" ) {
    startTime = `${moment( end ).subtract( 6, 'day' ).format( 'YYYY-MM-DD 00:00:00' )}`;
    endTime =  `${moment( end ).format( 'YYYY-MM-DD 23:59:59' )}`;
  }else{
    startTime = `${moment( end ).startOf( 'month' ).format( 'YYYY-MM-DD 00:00:00' )}`;
    endTime= `${moment( end ).endOf( 'month' ).format( "YYYY-MM-DD 23:59:59" )}`;
  }
  return { startTime, endTime }
}

@connect( ( { guessWave } ) => ( {
  loading: guessWave.loading,
  guessgameRankData: guessWave.guessgameRankData,
  rankDateList: guessWave.rankDateList,
  prizesList: guessWave.prizesList,
} ) )
@Form.create()
class GuessWave extends PureComponent {
  state = {
    pageSize: 10,
    pageNum: 1,
    isDetail: false,
    isPrizeModal: false,
    exportLodaing:false,
    secrchVal:{}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch, activityId }=this.props;
    dispatch( {
      type: 'guessWave/getGuessPrizes',
      payload: {
        id:activityId
      },
    } );
  }

  //  获取列表
  fetchList = () => {
    const { pageNum, pageSize }=this.state;
    const { activityId, dispatch, rankDateList } = this.props;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { end, rankType } = formValue;
    const type = ( end && rankType === "WEEK" && end === moment( rankDateList[0] ).format( "YYYY-MM-DD" ) ) ? 'WEEK_RANK' : 'MONTH_RANK';
    dispatch( {
      type: 'guessWave/getGuessgameCurrentRank',
      payload: {
        pageNum,
        pageSize,
        limit: 100,
        order: type,
        rankType,
        platFormName:activityId,
        end
      },
    } );
  }

  // 期数切换搜索查询
  getGuessWave = () =>{
    const { pageNum, pageSize }=this.state;
    const { dispatch, activityId }=this.props;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { end, rankType } = formValue;
    dispatch( {
      type: 'guessWave/getGuessgameRank',
      payload: {
        pageNum,
        pageSize,
        order: rankType === "WEEK" ? 'WEEK_RANK' : 'MONTH_RANK',
        platFormName:activityId,
        end,
        rankType,
      },
    } );
  }

  // 猜涨跌列表导出
  onExportXlsx = () => {
    this.setState( { exportLodaing:true } )
    const { guessgameRankData, activityId, platFormName } = this.props;
    const { isDetail, info, secrchVal } = this.state;
    const { end = '', rankType } = this.filterForm ? this.filterForm.getValues() : secrchVal;
    const { startTime, endTime } = date( end, rankType )
    const guessWaveDataType = rankType === "WEEK" ? "周榜" : "月榜";
    const exportId = !isDetail ? activityId : info.accountId;
    const limitLen = guessgameRankData.total;
    let exportName;
    if ( info && info.nick ) {
      exportName = `${info.nick} ${startTime}~${endTime}积分明细列表.xlsx`;
    } else {
      const exportTimeName = rankType === "WEEK" ? `${startTime}~${endTime}` : `${endTime}`;
      exportName = `${platFormName} ${guessWaveDataType} ${exportTimeName}期结果导出列表.xlsx`;
    }

    const uriPath = !isDetail ?
      `guessgame/export?platFormName=${activityId}&start=${startTime}&end=${endTime}&rankType=${rankType}&limit=${limitLen}`
      : `waters/${exportId}/export?accountId=${exportId}&startTime=${startTime}&endTime=${endTime}&userId=${info.userId}&userName=${info.nick}`;
    const typePath = !isDetail ? 'customGameService' : "accountService";

    exportXlsx( {
      type: typePath,
      uri: uriPath,
      xlsxName: exportName,
      callBack: () => {this.setState( { exportLodaing:false } )}
    } );
    this.setState( { exportLodaing:false } )
  }

  // 批量模板显示
  switchPrizeVisibal = ( isPrizeModal ) => {
    this.setState( { isPrizeModal } );
  }

  //  批量发奖
  getAllGameRanking = () => {
    const { dispatch, guessgameRankData: { total }, activityId } = this.props;
    const $this = this;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { end, rankType } = formValue;
    dispatch( {
      type: 'guessWave/getGuessgameAllRank',
      payload: {
        pageNum: 1,
        pageSize: total,
        rankType,
        order: rankType === "WEEK" ? 'WEEK_RANK' : 'MONTH_RANK',
        platFormName: activityId,
        end: rankType === "WEEK" ? end : moment( end ).endOf( 'month' ).format( "YYYY-MM-DD" ),
      },
      callFunc: ( result ) => {
        $this.setPrizeAward( result, formValue );
      }
    } );
  }

  setPrizeAward = ( result, formValue ) => {
    const { dispatch, activityId } = this.props;
    const gameRankList = result && result.list ? result.list : []
    const userIdList = gameRankList.map( item => {
      return item.userId;
    } )
    const $this = this;
    const { end, rankType } = formValue;
    dispatch( {
      type: 'guessWave/sentPrizeAward',
      payload: {
        activityId,
        groupIndex: rankType === "WEEK" ? 0 : 1,
        periods: end,
        userIds: userIdList,
      },
      callFunc: () => {
        $this.sentPrizeMsg( userIdList.length, formValue );
        this.setState( { isPrizeModal: false } );
      }
    } );
  }

  sentPrizeMsg = ( limitLen, formValue ) => {
    const { dispatch, prizesList, activityId } = this.props;
    const { end, rankType } = formValue;
    const { startTime, endTime } = date( end, rankType )
    const groupIndex = rankType === "WEEK" ? 0 : 1;
    const filterPrizesList = _.filter( prizesList, ["groupIndex", groupIndex] );
    const basePrizes = filterPrizesList.map( item => {
      return {
        popupText: item.popupText,
        prizeId: item.prizeId,
        rankFrom: item.rankFrom,
        rankTo: item.rankTo,
      }
    } );
    dispatch( {
      type: 'guessWave/sendGuessMsg',
      payload: {
        basePrizes,
        title: "中奖了",
        type: "GUESS_GIFT",
        rankType,
        platFormName: activityId,
        start: startTime,
        end: endTime,
        limit: limitLen,
      },
    } );
  }

  // 去详情
  getGuessDetail=( info )=>{
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    setTimeout( () => {
      this.setState( {
        info,
        secrchVal:formValue,
        isDetail:true
      } )
    }, 700 );
  }

  // 明细返回
  gobock=()=>{
    this.setState( {
      info:{},
      isDetail:false
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    this.setState( {
      pageNum:1
    }, ()=>this.goList() )
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.goList() );
  };

  // 区分调用接口列表
  goList=()=>{
    const { rankDateList }=this.props;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { end } = formValue;
    const num = rankDateList && rankDateList.length && rankDateList.findIndex( o=> o === end );
    if( num === 0 ){ this.fetchList() }else{ this.getGuessWave() }
  }

  go=()=>{
    this.setState( { isDetail:false } )
  }


  render() {
    const { pageSize, isDetail, pageNum, isPrizeModal, info, secrchVal, exportLodaing } = this.state;
    const { loading, guessgameRankData: { list, total }, 
      prizesList, platFormName, activityId
    } = this.props;

    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { end, rankType } = formValue;
    const groupIndex = rankType && rankType === "WEEK" ? 0 : 1;
    const filterPrizesList = _.filter( prizesList, ["groupIndex", groupIndex] );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      pageSize,
      total,
    };

    const columns = [
      {
        title: <span>排名</span>,
        dataIndex: 'scoreRanking',
        fixed: 'left',
        width:70,
        render: ( contact, record, index ) => {
          const currentIndex = ( pageNum - 1 ) * 10 + index + 1;
          return <span>{currentIndex || 0}</span>
        },
      },
      {
        title: <span>奖品名称</span>,
        dataIndex: 'count',
        fixed: 'left',
        width:150,
        render: ( contact, record, index ) => {
          const currentIndex = ( pageNum - 1 ) * 10 + index + 1;
          const prizeId = _.find( filterPrizesList, ( item ) => {
            return item.rankFrom <= currentIndex && currentIndex <= item.rankTo
          } )
          return prizeId && prizeId.name ? prizeId.name : '--';
        },
      },
      {
        title: <span>用户ID</span>,
        fixed: 'left',
        width:100,
        dataIndex: 'userId',
        render: id => <span>{id || '--'}</span>,
      },
      {
        title: <span>用户昵称</span>,
        dataIndex: 'nick',
        render: nick => <span>{nick}</span>,
      },
      {
        title: <span>月榜积分</span>,
        dataIndex: 'monthScore',
        render: monthScore => <span>{monthScore || monthScore === 0 ? monthScore : '--'}</span>,
      },
      {
        title: <span>周榜积分</span>,
        dataIndex: 'weekScore',
        render: weekScore => <span>{weekScore || weekScore === 0 ? weekScore : '--'}</span>,
      },
      {
        title: <span>胜率</span>,
        dataIndex: 'winRate',
        render: winRate => <span>{winRate !== undefined ? `${( winRate*100 ).toFixed( 2 )}%` : '--'}</span>,
      },
      {
        title: <span>连胜次数</span>,
        dataIndex: 'winLink',
        render: winLink => <span>{winLink || winLink === 0 ? winLink : '--'}</span>,
      },
      {
        title: <span>正确次数</span>,
        dataIndex: 'winNum',
        render: winNum => <span>{winNum || winNum === 0 ? winNum : '--'}</span>,
      },
      {
        title: <span>错误次数</span>,
        dataIndex: 'lostNum',
        render: lostNum => <span>{lostNum || lostNum === 0 ? lostNum : '--'}</span>,
      },
      {
        title: <span>操作</span>,
        dataIndex: 'option',
        render: ( createTime, record ) =>
          <span className={styles.from_option_detail} onClick={() => { this.getGuessDetail( record ) }}>
            详情
          </span>
      },
    ];
    
    return (
      <GridContent>
        <div className={styles.guess_wave}>
          {/* <Card
            className={styles.listCard}
            bordered={false}
            title={isDetail ? <div><Icon type="double-left" onClick={this.gobock} className={styles.gobock} />用户积分明细</div> : "猜涨跌数据列表"}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          > */}
          {
            !isDetail ? 
              <div>
                <WaveFilterForm
                  activityId={activityId}
                  platFormName={platFormName}
                  exportLodaing={exportLodaing}
                  goList={this.goList}
                  fetchList={this.fetchList}
                  filterSubmit={this.filterSubmit}
                  onExportXlsx={this.onExportXlsx}
                  switchPrizeVisibal={this.switchPrizeVisibal}
                  wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                />
                <Table
                  size="large"
                  scroll={{ x: 1350 }}
                  rowKey="userId"
                  columns={columns}
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  onChange={this.tableChange}
                />
              </div>
            :
              <GuessDetail
                info={info}
                secrchVal={secrchVal}
                date={date}
                onExportXlsx={this.onExportXlsx}
                go={this.go}
              />
          }
          {/* </Card> */}
        </div>
        <Modal
          title={<div style={{ textAlign: "center" }}><Icon style={{ color: "#1F3883", padding: "0 5px" }} type="info-circle" />确认发送奖品？</div>}
          visible={isPrizeModal}
          onOk={() => { this.getAllGameRanking() }}
          onCancel={() => { this.switchPrizeVisibal( false ) }}
          width={360}
          centered
          closable={false}
        >
          <div>
            <div>活动名称：{ platFormName || ""}</div>
            <div>榜单：{rankType === "WEEK" ? "周榜" : "月榜"}</div>
            <div>期数：{end}</div>
          </div>
        </Modal>
      </GridContent>
    );
  }
}

export default GuessWave;

  // // 获取日期所在月的最后一天
  // onGetLastDay = ( date ) => {
  //   let time = '';
  //   if ( date ) {
  //     const year = moment( date ).format( 'YYYY' )  // format(date, 'YYYY');
  //     const month = moment( date ).format( 'MM' )  // format(date, 'MM');
  //     const day = new Date( year, month, 0 ).getDate();// 获取当月最后一天日期
  //     time = moment( `${year}-${month}-${day}` ).format( 'YYYY-MM-DD' );
  //   }
  //   return time;
  // }

  // // 获取七天之前的日期（用于周榜日期选择展示）
  // getBeforeDate = ( data, num ) => {
  //   const date = new Date( data );
  //   date.setDate( date.getDate() + num );
  //   const time = moment( date ).format( 'MM-DD' );
  //   return time;
  // }

  // // 获取日期所在周的周一
  // onGetMonday = ( date ) => {
  //   let time = '';
  //   if ( date ) {
  //     const newDate = new Date( date );
  //     const week = newDate.getDay(); // 获取时间的星期数
  //     const minus = week ? 7 - week : 0;
  //     newDate.setDate( newDate.getDate() + minus ); // 获取minus天前的日期
  //     time = format( newDate, 'YYYY-MM-DD' );
  //   }
  //   return time;
  // }
