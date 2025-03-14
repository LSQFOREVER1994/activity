import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { Form, Table, Modal, Icon } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import WaveFilterForm from './WaveFilterForm';
import WatermelonDetail from './WatermelonDetail';
import styles from './Watermelon.less';


@connect( ( { watermelon } ) => ( {
  loading: watermelon.loading,
  rankDateList: watermelon.rankDateList,
  prizesList: watermelon.prizesList,
  watermelonRankData: watermelon.watermelonRankData,
  rankTypeObj: watermelon.rankTypeObj,
} ) )
@Form.create()
class Watermelon extends PureComponent {
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
    this.getWatermelonPrizes();
  }

  // 获取奖品
  getWatermelonPrizes = () => {
    const { dispatch, activityId }=this.props;
    dispatch( {
      type: 'watermelon/getWatermelonPrizes',
      payload: {
        id:activityId
      },
    } );
  }


  // 列表导出
  onExportXlsx = () => {
    this.setState( { exportLodaing:true } )
    const { activityId, platFormName, rankTypeObj } = this.props;
    const { isDetail, info, secrchVal } = this.state;
    const { startTime, endTime } = this.filterForm ? this.filterForm.getValues() : secrchVal;
    const guessWaveDataType = rankTypeObj.rankName;
    const exportId = !isDetail ? activityId : info.accountId;
    const exportTimeName = rankTypeObj.rankType !== "ALL" ? `${startTime}~${endTime}` : '';
    const exportName = `${platFormName} ${guessWaveDataType} ${exportTimeName}期结果导出列表.xlsx`;
    let uriPath = '';
    if ( startTime && endTime ) {
      uriPath = !isDetail ?`watermelon/export?activityId=${activityId}&start=${startTime}&end=${endTime}&rankTimeEnum=${rankTypeObj.rankType}`
      : `waters/${exportId}/export?accountId=${exportId}&startTime=${startTime}&endTime=${endTime}&userId=${info.userId}&userName=${info.userName}`;
    } else {
      uriPath = !isDetail ?
      `watermelon/export?activityId=${activityId}&rankTimeEnum=${rankTypeObj.rankType}`
      : `waters/${exportId}/export?accountId=${exportId}&userId=${info.userId}&userName=${info.userName}`;
    }

    const typePath = !isDetail ? 'watermelonService' : "accountService";

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

  // 批量发奖
  batchOfPrizes = () => {
    this.getAllGameRanking();
  }

  //  获取批量发奖所有列表,并发放奖品
  getAllGameRanking = () => {
    const { dispatch, watermelonRankData: { total }, activityId, rankTypeObj } = this.props;
    const $this = this;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { startTime, endTime } = formValue;
    dispatch( {
      type: 'watermelon/getWatermelonALLRank',
      payload: {
        startTime,
        endTime,
        id: activityId,
        pageNum: 1,
        pageSize: total,
        rankTimeEnum: rankTypeObj.rankType,
      },
      callFunc: ( result ) => {
        $this.setPrizeAward( result, formValue );
      }
    } );
  }

  // 发放奖品
  setPrizeAward = ( result, formValue ) => {
    const { dispatch, activityId, rankTypeObj } = this.props;
    // 过滤分数为0的。
    const gameRankList = result && result.list ? result.list.filter( item => item.score >0 ) : [];
    const userIdList = gameRankList.map( item => {
      return item.userId;
    } )
    const $this = this;
    dispatch( {
      type: 'watermelon/sentPrizeAward',
      payload: {
        activityId,
        groupIndex: rankTypeObj.groupIndex,
        periods: '1',
        userIds: userIdList,
      },
      callFunc: () => {
        $this.sentPrizeMsg( userIdList, formValue );
        this.setState( { isPrizeModal: false } );
      }
    } );
  }

  // 发奖通知
  sentPrizeMsg = ( userIds, formValue ) => {
    const { dispatch, prizesList, activityId, rankTypeObj } = this.props;
    const { startTime, endTime } = formValue;
    const { groupIndex, rankType } = rankTypeObj;
    const filterPrizesList = _.filter( prizesList, ["groupIndex", groupIndex] );
    const basePrizes = filterPrizesList.map( item => {
      return {
        name: item.name,
        prizeId: item.prizeId,
        rankFrom: item.rankFrom,
        rankTo: item.rankTo,
        popupText: item.popupText
      }
    } );
    dispatch( {
      type: 'watermelon/sendPrizeMsg',
      payload: {
        basePrizes,
        title: "中奖了",
        rankTimeEnum: rankType,
        activityId,
        start: startTime,
        end: endTime,
        userIds,
      },
    } );
  }

  // 去详情
  getWatermelonDetail=( info )=>{
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
    }, ()=>this.getTableList() )
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.getTableList() );
  };

  // 调用form组件，查询表格rank表格数据
  getTableList= () => {
    this.filterForm.getTableList();
  }

  go= () =>{
    this.setState( { isDetail:false } )
  }


  render() {
    const { pageSize, isDetail, pageNum, isPrizeModal, info, secrchVal, exportLodaing } = this.state;
    const { loading, watermelonRankData: { list, total }, 
      prizesList, platFormName, activityId, rankTypeObj
    } = this.props;
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
        dataIndex: 'rank',

        render: ( rank ) => {
          return <span>{rank || 0}</span>
        },
      },
      {
        title: <span>奖品名称</span>,
        dataIndex: 'count',
        render: ( contact, record ) => {
          const { rank }= record;
          let count = '--';
          prizesList.forEach( item => {
            if ( rank >= item.rankFrom && rank <= item.rankTo && item.groupIndex === rankTypeObj.groupIndex ) {
              count = item.name;
            }
          } );
          return count;
        },
      },
      {
        title: <span>用户ID</span>,
        // fixed: 'left',
        // width:100,
        dataIndex: 'userId',
        render: id => <span>{id || '--'}</span>,
      },
      {
        title: <span>用户昵称</span>,
        dataIndex: 'userName',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{rankTypeObj.rankName}分数</span>,
        dataIndex: 'score',
        render: score => <span>{score || score === 0 ? score : '--'}</span>,
      },
      {
        title: <span>操作</span>,
        dataIndex: 'option',
        render: ( createTime, record ) =>
          <span className={styles.from_option_detail} onClick={() => { this.getWatermelonDetail( record ) }}>
            详情
          </span>
      },
    ];

    
    return (
      <GridContent>
        <div className={styles.guess_wave}>
          {
            !isDetail ? 
              <div>
                <WaveFilterForm
                  activityId={activityId}
                  platFormName={platFormName}
                  exportLodaing={exportLodaing}
                  filterSubmit={this.filterSubmit}
                  onExportXlsx={this.onExportXlsx}
                  switchPrizeVisibal={this.switchPrizeVisibal}
                  wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                  pageNum={pageNum}
                  pageSize={pageSize}
                />
                <Table
                  size="large"
                  rowKey="userId"
                  columns={columns}
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  onChange={this.tableChange}
                />
              </div>
            :
              <WatermelonDetail
                info={info}
                activityId={activityId}
                secrchVal={secrchVal}
                onExportXlsx={this.onExportXlsx}
                go={this.go}
              />
          }
          {/* </Card> */}
        </div>
        <Modal
          title={<div style={{ textAlign: "center" }}><Icon style={{ color: "#1F3883", padding: "0 5px" }} type="info-circle" />确认发送奖品？</div>}
          visible={isPrizeModal}
          onOk={() => { this.batchOfPrizes() }}
          onCancel={() => { this.switchPrizeVisibal( false ) }}
          width={360}
          centered
          closable={false}
        >
          <div>
            <div>活动名称：{ platFormName || ""}</div>
            <div>榜单：{rankTypeObj.rankName}</div>
            {/* <div>期数：{end}</div> */}
          </div>
        </Modal>
      </GridContent>
    );
  }
}

export default Watermelon;