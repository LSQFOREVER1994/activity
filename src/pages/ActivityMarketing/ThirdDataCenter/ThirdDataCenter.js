import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Empty, Spin, Icon, Button, Drawer, Progress, Row, Col, Modal, Upload, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import RewardRecord from '../RewardRecord/RewardRecord';
import { exportXlsx, getUrlParameter } from '@/utils/utils';
import ParticipationRecord from '../ParticipationRecord/ParticipationRecord.jsx';
import Invite from '../Invite/Invite'
import TaskRecord from '../TaskRecord/TaskRecord';
import ParticipationTimes from '../ParticipationTimes/ParticipationTimes.jsx';
import TopicPKList from '../TopicPKList/TopicPKList';
import CommentReview from '../CommentReview/CommentReview';
import IntergralRecord from '../IntergralRecord/IntergralRecord.jsx';
import IntegralRank from '../IntegralRank/IntegralRank'
import GuessRank from '../GuessRank/GuessRank'
// import Questionnaire from '../QuestionnaireData/QuestionnaireData';
import PageBrowseData from './ComponentPages/PageBrowseData/PageBrowseData';
import AllRankData from './ComponentPages/AllRankData/AllRankData';
import GuessData from './ComponentPages/GuessData/GuessData';
import EnrollRecord from '../EnrollRecord/EnrollRecord';
import RewardReissue from '../RewardReissue/RewardReissue';
import CombineGameData from './ComponentPages/CombineGameData/CombineGameData.jsx';
import ReceiveGoldData from './ComponentPages/ReceiveGoldData/ReceiveGoldData.jsx';
import DollMachineData from './ComponentPages/DollMachineData/DollMachineData.jsx';
import LikeData from '../LikeData/LikeData.jsx';
import LotteryRecord from './ComponentPages/LotteryRecord/LotteryRecord.jsx';
import QuestionnaireData from './ComponentPages/QuestionnaireData/QuestionnaireData.jsx';
// import PushSetting from './ActivityManagement/PushSetting/PushSetting';
import ChannelLink from '../ChannelLink/ChannelLink';
import CustomerLink from '../CustomerLink/CustomerLink';
import VotingData from './ComponentPages/VotingData/VotingData';
import wave from './assets/image/wave.png'
import enable from './assets/image/enable.png'
import disabled from './assets/image/disabled.png'
import pause from './assets/image/pause.png'
import activityAttend from './assets/image/activityAttend.png';
import activityIntegral from './assets/image/activityIntegral.png';
import checkList from './assets/image/checkList.png';
import finishTask from './assets/image/finishTask.png';
import inviteData from './assets/image/inviteData.png';
import userAttend from './assets/image/userAttend.png';
import topicPk from './assets/image/topicPK.png';
import settleIcon from './assets/image/settle.png';
import rankIcon from './assets/image/rank.png';
import questionnaireIcon from './assets/image/question.png';
import combineGameIcon from './assets/image/combineGame.png';
import likeRecordIcon from './assets/image/likeRecordIcon.png';
import lotteryIcon from './assets/image/lottery.png';
import coverPictureV2 from '@/assets/coverPicture.png';
import blackList from './assets/image/blackList.png';
import reissue from './assets/image/reissue.png';
import customer from './assets/image/customer.png'
import channel from './assets/image/channel.png'
import dollMachineIcon from './assets/image/dollMachine.png';
import votingIcon from './assets/image/voting.png';
import styles from './thirdDataCenter.less'



class ThirdDataCenter extends PureComponent {
  constructor( props ) {
    super( props )
    const { activityId } = props;
    this.state = {
      userActionPage: null,
      showTabList: null,
      blackListVisible: false,
      blackListFile: null,
      isExPLoading: false,
    };

    this.dataSetting = {
      closeUserActionPage: this.closeUserActionPage,
      key: activityId,
      activityId,
    }
    this.eleList = [
      {
        key: 'PARTICIPATION_RECORD',
        title: '用户参与记录',
        icon: userAttend,
        ele: <ParticipationRecord {...this.dataSetting} />
      },
      {
        key: 'INVITE',
        title: '邀请数据',
        icon: inviteData,
        ele: <Invite {...this.dataSetting} />
      },
      {
        key: 'TASK',
        title: '任务完成表',
        icon: finishTask,
        ele: <TaskRecord {...this.dataSetting} />
      },
      {
        key: 'PARTICIPATION_TIMES',
        title: '活动次数记录',
        icon: activityAttend,
        ele: <ParticipationTimes {...this.dataSetting} />
      },
      {
        key: 'PK_TOPIC',
        title: '话题PK列表',
        icon: topicPk,
        ele: <TopicPKList {...this.dataSetting} />
      },
      {
        key: 'AUDIT',
        title: '审核列表',
        icon: checkList,
        ele: <CommentReview {...this.dataSetting} />
      },
      {
        key: 'INTEGRAL_RECORD',
        title: '活动积分明细',
        icon: activityIntegral,
        ele: <IntergralRecord {...this.dataSetting} />
      },
      // {
      //   key: 'RANK',
      //   title: '排行榜数据',
      //   icon: rankIcon,
      //   ele: <AllRankData {...this.dataSetting} />
      // },
      {
        key: 'GUESS_PERIODS',
        title: '竞猜结算表',
        icon: settleIcon,
        ele: <GuessData {...this.dataSetting} />
      },
      {
        key: 'INTEGRAL_RANK',
        title: '积分排行榜',
        icon: activityIntegral,
        ele: <IntegralRank {...this.dataSetting} id={activityId} />
      },
      {
        key: 'GUESS_RANK',
        title: '猜涨跌排行榜',
        icon: activityIntegral,
        ele: <GuessRank {...this.dataSetting} id={activityId} />
      },
      // {
      //   key: 'QUESTIONNAIRE',
      //   title: '问卷统计',
      //   icon: questionnaireIcon,
      //   ele: <Questionnaire {...this.dataSetting} id={activityId} />,
      // },
      {
        key: 'REWARD_RECORD',
        title: '奖品数据',
        ele: <RewardRecord {...this.dataSetting} />
      },
      {
        key: 'BROWSE',
        title: '埋点数据',
        ele: <PageBrowseData {...this.dataSetting} />
      },
      {
        key: 'ENROLL_RECORD',
        title: '报名记录',
        icon: topicPk,
        ele: <EnrollRecord {...this.dataSetting} />
      },
      {
        key: 'REISSUE_RECORD',
        title: '奖励补发',
        ele: <RewardReissue {...this.dataSetting} />
      },
      {
        key: 'COMPOSITE_GAME_STATS',
        title: '合成游戏数据',
        icon: combineGameIcon,
        ele: <CombineGameData {...this.dataSetting} />
      },
      {
        key: 'RECEIVE_GOLD_STATS',
        title: '接元宝游戏数据',
        icon: combineGameIcon,
        ele: <ReceiveGoldData {...this.dataSetting} />
      },
      {
        key: 'LIKE_RECORD',
        title: '点赞数据',
        icon: likeRecordIcon,
        ele: <LikeData {...this.dataSetting} />
      },
      {
        key: 'LOTTERY_RECORD',
        title: '抽奖数据',
        icon: lotteryIcon,
        ele: <LotteryRecord {...this.dataSetting} />
      },
      {
        key: 'QUESTIONNAIRE',
        title: '问卷统计', // 新
        icon: questionnaireIcon,
        ele: <QuestionnaireData {...this.dataSetting} />,
      },
      {
        key: 'DOLL_MACHINE_STATS',
        title: '抓娃娃游戏数据',
        icon: dollMachineIcon,
        ele: <DollMachineData {...this.dataSetting} />,
      },
      {
        key: 'Channel_Link',
        title: '渠道链接',
        ele: <ChannelLink {...this.dataSetting} />,
      },
      {
        key: 'Customer_Link',
        title: '客户经理链接',
        ele: <CustomerLink {...this.dataSetting} />,
      },
      {
        key: 'VOTING_RECORD',
        icon: votingIcon,
        title: '投票统计',
        ele: <VotingData {...this.dataSetting} />,
      }
    ]
  }

  componentDidMount() {
    // 链接参数监听
    const fromPage = getUrlParameter( 'fromPage' ) // 链接获取的跳转模块
    const pageActivityId = getUrlParameter( 'id' ) // 链接跳转的活动id
    const fromPageEnumToTitle = {
      buryPoint: '埋点数据',
      prizeReward: '奖品数据'
    }
    if ( fromPage && pageActivityId ) {
      this.jumpToUserActionPage( fromPageEnumToTitle[fromPage] )
    }

    this.getBeesInfo()
    this.getPrizeInventory()
    this.getElementDataType()
  }

  // 获取用户行为数据类型枚举
  getElementDataType = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/getElementDataType',
      payload: {
        query: {
          id:activityId
        },
        successFun: ( res ) => {
          if ( res ) {
            this.getShowTab( res );
          }
        }
      }
    } );
  }

  // 枚举筛选判断展示哪些底部入口
  getShowTab = ( typeList ) => {
    if ( typeList && typeList.length ) {
      const showTabList = typeList.map( info => {
        const infoEle = this.eleList.find( item => item.key === info );
        return infoEle
      } )
      this.setState( {
        showTabList
      } )
    }
  }

  // 获取活动详情信息
  getBeesInfo = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/getBeesInfo',
      payload: {
        query: {
          id: activityId
        },
        successFun: () => {
          this.getStatisticInfo()
        }
      }
    } );
  }

  // 获取奖品库存统计信息
  getPrizeInventory = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/getPrizeInventory',
      payload: {
        query: {
          id:activityId
        },
      }
    } );
  }

  // 获取活动统计数据
  getStatisticInfo = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/getAppointAppData',
      payload: {
        query: {
          id: activityId
        },
      }
    } );
  }

  // 用户行为数据页面的跳转
  jumpToUserActionPage = ( title ) => {
    this.setState( {
      userActionPage: title,
    } )
  }

  closeUserActionPage = () => {
    this.setState( {
      userActionPage: null
    } )
  }

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => {
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  // 活动基础数据
  renderActivityInfo = () => {
    const { activityDetail, loading, activityId } = this.props
    const { name, createUsername, startTime, endTime, state, coverPicture, timeType } = activityDetail

    const statusObj = {
      DISABLE: '已禁用',
      ENABLE: '进行中',
      PAUSE: '已暂停',
    }

    const statusColor = {
      DISABLE: {
        bgColor: '#fef0f1',
        textColor: '#F24141'
      },
      ENABLE: {
        bgColor: '#EAF0FD',
        textColor: '#317EEA'
      },
      PAUSE: {
        bgColor: '#f5f5f5',
        textColor: '#555'
      },
    }

    const statusIcon = {
      DISABLE: disabled,
      ENABLE: enable,
      PAUSE: pause,
    }

    // 数据渲染对象
    const activityInfoObj = {
      '活动ID：': activityId,
      '活动名称：': name || '-',
      '活动时间：': `${startTime || ''} - ${endTime || ''}`,
      '活动状态：': statusObj[state] || '-',
      '活动创建人：': createUsername || '-',
    }
    if( !timeType ){
      activityInfoObj['活动时间：'] = '-'
    }

    return (
      <Spin spinning={loading}>
        <div className={styles.activity_info}>
          <div className={styles.left_img}>
            {
              coverPicture ?
                <img src={coverPicture} alt="" /> :
                <img src={coverPictureV2} alt="" />
            }
          </div>
          <div className={styles.right_info}>
            {
              Object.keys( activityInfoObj ).map( ( key ) => {
                return (
                  <div className={styles.info_line} key={key}>
                    <span className={styles.line_title}>{key}</span>
                    {key !== '活动状态：' &&
                      <span className={styles.line_data}>{activityInfoObj[key]}</span>
                    }
                    {key === '活动状态：' &&
                      <div className={styles.activity_status} style={{ background: statusColor[state]?.bgColor }}>
                        <img src={statusIcon[state]} alt="" />
                        <span style={{ color: statusColor[state]?.textColor }}>
                          {activityInfoObj[key]}
                        </span>
                      </div>
                    }
                  </div>
                )
              } )
            }
          </div>
        </div>
      </Spin>
    )
  }

  // 页面浏览数据
  renderPageSkimData = () => {
    const { appPointData } = this.props
    if ( !appPointData ) {
      return <Empty />
    }
    const { pv, uv, preTotalUv, newUv } = appPointData
    const list = [
      {
        title: '页面浏览量 (PV)',
        data: pv,
      },
      {
        title: '页面浏览人数 (UV)',
        data: uv,
      },
      {
        title: '累计用户',
        data: preTotalUv + newUv,
      },
    ]
    return (
      <div className={styles.skim_data}>
        {
          list.map( item => {
            return (
              <div
                key={item.title}
                className={styles.page_info_box}
                onClick={() => this.jumpToUserActionPage( '埋点数据' )}
              >
                <span>{item.title}</span>
                <span className={styles.box_num}>{this.numFormat( item.data || 0 )}</span>
                <img src={wave} alt="" />
              </div>
            )
          } )
        }
      </div>
    )
  }

  // 奖品库存数据
  renderPrizeInventory = () => {
    const { prizeInventory = { inventory: 0, total: 0 } } = this.props
    const { inventory = 0, total = 0 } = prizeInventory
    const percentage = inventory / total * 100
    return (
      <div className={styles.inventory_box} onClick={() => this.jumpToUserActionPage( '奖品数据' )}>
        <div className={styles.inventory_box_left}>
          <span className={styles.inventory_title}>当前奖品数</span>
          <span className={styles.inventory_total}>
            {this.numFormat( total )}
          </span>
          <span className={styles.inventory_all}>总库存</span>
        </div>
        <Progress
          type="circle"
          strokeWidth={8}
          width={110}
          style={{ paddingRight: 18 }}
          percent={percentage}
          format={() => {
            return (
              <div style={{ fontSize: 12 }}>
                剩余库存
                <br />
                <span style={{ fontSize: 20, fontWeight: 600 }}>{this.numFormat( inventory )}</span>
              </div>
            )
          }}
        />
      </div>
    )
  }

  // 用户行为数据
  renderUserActionData = () => {
    const { showTabList } = this.state;
    return (
      showTabList?.length > 0 ?
        <div className={styles.user_action}>
          {showTabList.map( ( item ) => {
            if ( !item ) return null
            const { icon, title } = item
            if ( title === '奖品数据' || title === '埋点数据' ) return null
            return (
              <div
                key={title}
                className={styles.user_action_box}
                onClick={() => this.jumpToUserActionPage( title )}
              >
                <img src={icon} alt="" />
                <span>{title}</span>
              </div>
            )
          } )}
        </div>
        : <Empty description='暂无配置' />
    )
  }

  renderDataPage = () => {
    const { userActionPage } = this.state;
    const element = this.eleList.map( i => {
      let eleDom
      if ( i.title === userActionPage ) eleDom = i.ele
      return eleDom
    } )
    return (
      <div key={userActionPage}> {element}</div>
    )
  }

  beforeUpload = ( file ) => {
    const { blackListFile } = this.state;
    if ( blackListFile ) {
      message.error( '只能上传单个文件' )
      return false;
    }
    if ( file ) {
      if ( file.name && file.name.length > 25 ) {
        message.error( '文件名过长' )
        return false;
      }
      this.setState( {
        blackListFile: file
      } )
    }
    return false;
  }

  // 上传黑名单
  onSubmitBlackList = () => {
    const { blackListFile } = this.state;
    const { dispatch, activityId } = this.props;
    if ( !blackListFile ) {
      message.error( '请上传文件' )
      return;
    }
    const formData = new FormData();
    formData.append( "file", blackListFile );
    formData.append( "activityId", activityId );
    dispatch( {
      type: 'thirdDataCenter/importBlackList',
      payload: {
        query: {
          formData
        },
        successFun: ( res ) => {
          if ( res ) {
            message.success( '导入黑名单成功' )
            this.setState( {
              blackListFile: null,
              blackListVisible: false
            } );
            this.isInBlacklist();
          }
        }
      }
    } );
  }
  // 下载黑名单模板

  downloadTemplate = () => {
    window.open( 'https://media.jiniutech.com/模版_活动黑名单.xlsx' )
  }

  // 判断当前活动是否已经上传过黑名单
  isInBlacklist = ( callFunc ) => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/isInBlacklist',
      payload: {
        query: {
          id:activityId
        },
        successFun: () => {
          if ( callFunc ) callFunc();
        }
      }
    } )
  }

  // 下载已上传过的黑名单
  downloadBlackList = () => {
    const { activityId } = this.props;
    const { isExPLoading } = this.state;
    if ( isExPLoading ) return;
    const ajaxUrl = `activity/info/export/blacklist?activityId=${activityId}`
    this.setState( {
      isExPLoading: true,
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        xlsxName: '活动黑名单.xlsx',
        callBack: () => {
          this.setState( {
            isExPLoading: false,
          } );
        },
      } );
    } )
  }

  // 删除已上传过的黑名单
  deleteBlackList = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/deleteBlackList',
      payload: {
        query: {
          id:activityId
        },
        successFun: () => {
          message.success( '删除黑名单成功' )
          this.isInBlacklist();
        }
      }
    } )
  }

  // 内容
  renderContent = () => {
    const { userActionPage } = this.state
    const { closeDataCenter, activityId } = this.props;
    let center = (
      <GridContent>
        <Button
          type='link'
          className={styles.backBtn}
          onClick={() => { closeDataCenter() }}
        >
          <Icon type="left" /><span>返回</span>
        </Button>
        <div className={styles.page_blockList}>
          <Card
            bordered={false}
            title="活动基础信息"
            headStyle={{ fontWeight: 'bold' }}
            style={{ marginRight: 20, width: '65%' }}
          >
            {this.renderActivityInfo()}
          </Card>
          <Card
            bordered={false}
            title="活动管理"
            headStyle={{ fontWeight: 'bold' }}
            style={{ width: '35%' }}
          >
            <div className={styles.activitiesManagement}>
              <Row>
                <Col span={6}>
                  <div
                    className={styles.activitiesManagementItem}
                    onClick={()=>{this.jumpToUserActionPage( '渠道链接' )}}
                  >
                    <img className={styles.activitiesManagementItemImg} src={channel} alt="" />
                    <div className={styles.activitiesManagementItemLabel}>渠道链接</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div
                    className={styles.activitiesManagementItem}
                    onClick={()=>{this.jumpToUserActionPage( '客户经理链接' )}}
                  >
                    <img className={styles.activitiesManagementItemImg} src={customer} alt="" />
                    <div className={styles.activitiesManagementItemLabel}>客户经理链接</div>
                  </div>
                </Col>
                {/* <Col span={6}>
                  <div
                    className={styles.activitiesManagementItem}
                    onClick={() => { this.isInBlacklist( () => { this.setState( { blackListVisible: true, } ) } ) }}
                  >
                    <img className={styles.activitiesManagementItemImg} src={blackList} alt="" />
                    <div className={styles.activitiesManagementItemLabel}>活动黑名单</div>
                  </div>
                </Col> */}
                <Col span={6}>
                  <div
                    className={styles.activitiesManagementItem}
                    onClick={() => {
                      this.jumpToUserActionPage( '奖励补发' );
                    }}
                  >
                    <img className={styles.activitiesManagementItemImg} src={reissue} alt="" />
                    <div className={styles.activitiesManagementItemLabel}>奖励补发</div>
                  </div>
                </Col>
              </Row>
              {/* <Row>
                <Col span={6}>
                  <PushSetting activityId={activityId} />
                </Col>
              </Row> */}
            </div>
          </Card>
        </div>
        <div className={styles.page_and_prize}>
          <Card
            style={{ marginRight: 20, width: '65%' }}
            bordered={false}
            title="页面浏览数据"
            headStyle={{ fontWeight: 'bold' }}
          >
            {this.renderPageSkimData()}
          </Card>
          <Card
            style={{ width: '35%' }}
            bordered={false}
            title="奖品数据"
            headStyle={{ fontWeight: 'bold' }}
          >
            {this.renderPrizeInventory()}
          </Card>
        </div>
        <Card
          style={{ marginBottom: 16 }}
          bordered={false}
          title="用户行为数据"
          headStyle={{ fontWeight: 'bold' }}
        >
          {this.renderUserActionData()}
        </Card>
      </GridContent>
    )
    if ( userActionPage ) center = this.renderDataPage()
    return center
  }

  renderBlackListModal = () => {
    const { blackListVisible, blackListFile } = this.state;
    const { isHasBlackList } = this.props;
    return (
      <Modal
        title="活动黑名单"
        visible={blackListVisible}
        okText="确定"
        onOk={() => { this.onSubmitBlackList() }}
        onCancel={() => { this.setState( { blackListVisible: false, blackListFile: null } ) }}
      >
        <div style={{ marginBottom: '20px' }}>若配置了活动黑名单，黑名单中的用户可以正常参与活动，但是不会获得任何活动奖励，即中奖均为谢谢参与。</div>
        {isHasBlackList ? (
          <div>
            <Button type='primary' style={{ marginRight: '10px' }} onClick={() => { this.downloadBlackList() }}>下载文件</Button>
            <Button onClick={() => { this.deleteBlackList() }}>删除文件</Button>
          </div> ) : (
            <div style={{ display: 'flex' }}>
              <Upload
                beforeUpload={this.beforeUpload}
                fileList={blackListFile ? [blackListFile] : []}
                accept='.xlsx,.xls'
                onRemove={() => { this.setState( { blackListFile: null } ) }
              }
              >
                <Button style={{ marginRight: '10px' }}>+上传</Button>
              </Upload>
              <Button type='primary' onClick={this.downloadTemplate}>模板下载</Button>
            </div> )}
      </Modal>
    )
  }

  render() {
    const { dataCenterVisible } = this.props;
    const pageKey = document.getElementById( 'beesContentKey' )
    if ( !pageKey ) return null
    return (
      <Drawer
        width={pageKey.clientWidth + 62}
        getContainer={pageKey}
        drawerStyle={{ background: '#f0f2f5', height: 'auto' }}
        bodyStyle={{ height: '100%' }}
        placement="right"
        closable={false}
        visible={dataCenterVisible}
        mask={false}
        destroyOnClose
      >
        {this.renderContent()}
        {this.renderBlackListModal()}
      </Drawer>
    );
  }
}

export default connect( ( { thirdDataCenter } ) => ( {
  activityDetail: thirdDataCenter.activityDetail,
  appPointData: thirdDataCenter.appPointData,
  prizeInventory: thirdDataCenter.prizeInventory,
  loading: thirdDataCenter.loading,
  isHasBlackList: thirdDataCenter.isHasBlackList
} ) )( ThirdDataCenter );
