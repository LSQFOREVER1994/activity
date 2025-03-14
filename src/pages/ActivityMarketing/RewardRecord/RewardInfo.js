/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-empty-pattern */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Collapse } from 'antd';
import styles from './rewardRecord.less'

const { Panel } = Collapse;

@connect( ( { reward } ) => ( {
  activityDetail: reward.activityDetail,
} ) )
class RewardInfo extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      elementList: [],
      deletedList: [],
      currentElementId: '',
    }
  }

  componentDidMount() {
    this.getInfoPrizeList()
  }

  // 获取活动下的奖品信息
  getInfoPrizeList = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'reward/getInfoPrizeList',
      payload: {
        query: {
          activityId
        },
        successFun: ( res ) => {
          const deletedList = []
          res && res.map(
            item => {
              item.prizeList && item.prizeList.map(
                i => {
                  if ( i.deleted ) { deletedList.push( i ) }
                }
              )
            }
          )
          this.setState( {
            elementList: res,
            deletedList,
            currentElementId: res[0].elementId
          } )
        }
      }
    } );
  }

  changeCurrentElement = ( id ) => {
    this.setState( {
      currentElementId: id
    } )
  }

  renderElementsTab = () => {
    const { elementList, currentElementId } = this.state
    return (
      <div className={styles.element_box}>
        {
          elementList && elementList.map( ( element ) => {
            const { elementName, elementId } = element
            if ( element.prizeList ) {
              return (
                <span
                  className={styles.tab}
                  key={elementName}
                  onClick={() => this.changeCurrentElement( elementId )}
                  style={{
                    background: currentElementId === elementId ? '#1F3883' : '#F5F5F5',
                    color: currentElementId === elementId ? '#F5F5F5' : '#1F3883',
                  }}
                >
                  {elementName}
                </span>
              )
            }
          } )
        }
      </div>
    )
  }

  // 表格页脚
  renderTableFooter = ( res ) => {
    // const { elementList } = this.state
    // if ( elementList || elementList.length <= 0 ) return null;
    let countAllProbility = 0
    let countAllConsume = 0
    let countAllInventory = 0
    res && res.map( ( item ) => {
      const { probability, sendCount, inventory } = item
      countAllProbility += probability || 0
      countAllConsume += sendCount || 0
      countAllInventory += inventory || 0
    } )

    return (
      <div className={styles.count_all}>
        <span>总计</span>
        <span>{`${countAllProbility.toFixed( 3 )} %`}</span>
        <span>{countAllInventory - countAllConsume}</span>
        <span>{countAllConsume}</span>
        <span>{countAllInventory}</span>
      </div>
    )
  }

  // 奖品信息表
  renderPrizeTable = ( type ) => {
    const { currentElementId, elementList, deletedList } = this.state
    const currentElement = elementList && elementList.find( item => item.elementId === currentElementId )
    const currentPrizeList = currentElement && currentElement.prizeList.filter( item => {
      return item.deleted === false
    } )

    const columns = [
      {
        title: <span>奖品名称</span>,
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: name => <span>{name || '谢谢参与'}</span>,
      },
      {
        title: <span>概率</span>,
        dataIndex: 'probability',
        width: '20%',
        key: 'probability',
        render: probability => <span>{`${probability.toFixed( 3 )} %`}</span>,
      },
      {
        title: <span>剩余库存</span>,
        dataIndex: 'leftCount',
        width: '20%',
        key: 'leftCount',
        render: ( _, record ) => <span>{record.inventory - record.sendCount}</span>,
      },
      {
        title: <span>已消耗库存</span>,
        dataIndex: 'sendCount',
        width: '20%',
        key: 'sendCount',
        render: sendCount => <span>{sendCount}</span>,
      },
      {
        title: <span>总库存</span>,
        dataIndex: 'inventory',
        width: '20%',
        key: 'inventory',
        render: inventory => <span>{inventory || 0}</span>,
      },
    ];

    return (
      <Table
        className={styles.reward_info}
        size="middle"
        rowKey="id"
        columns={columns}
        pagination={false}
        dataSource={type === 'all' ? currentPrizeList : deletedList}
        footer={type === 'all' ? ( res ) => this.renderTableFooter( res ) : null}
      />
    )
  }

  renderDeleted = () => {
    const { deletedList } = this.state;
    let tableView = null;
    if ( deletedList.length ) {
      tableView =
        <Collapse bordered={false} style={{ background: '#ffffff', padding: '10px', marginBottom: '20px' }}>
          <Panel
            header={<div style={{ fontWeight: 'bold', fontSize: '16px', }}>已删除奖品信息</div>}
            style={{ marginBottom: '20px' }}
          >
            {this.renderPrizeTable( 'deleted' )}
          </Panel>
        </Collapse>
    }
    return tableView
  }

  render() {
    return (
      <>
        <Card
          bordered={false}
          title='奖品信息'
          headStyle={{ fontWeight: 'bold' }}
          bodyStyle={{ padding: '0 32px 40px 32px', margin: '16px' }}
        >
          {this.renderElementsTab()}
          {this.renderPrizeTable( 'all' )}
        </Card>
        {this.renderDeleted()}
      </>
    );
  }
}

export default RewardInfo;
