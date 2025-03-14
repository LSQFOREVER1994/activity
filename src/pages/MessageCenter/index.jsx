/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 18:02:02
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-08 09:54:30
 * @FilePath: /data_product_cms_ant-pro/src/pages/MessageCenter/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, Card, Table, Popconfirm, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

const { TabPane } = Tabs;

@connect( ( { messageCenter } ) => {
  return {
    loading: messageCenter.loading,
    messageMap: messageCenter.messageMap,
    unreadCount: messageCenter.unreadCount,
  };
} )

class MessageCenter extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      pageSize: 10,
      pageNum: 1,
      currentTabKey: 'ACTIVITY',
      currentMessageType:'',
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
    }
  }

  componentDidMount(){
    this.getMessageList();
    this.getUnreadCount();
  }

  componentDidUpdate( prevProps, prevState ) {
    // 检测状态变化
    if (
      prevState.currentTabKey !== this.state.currentTabKey ||
      prevState.currentMessageType !== this.state.currentMessageType
    ) {
      this.getMessageList();
      this.getUnreadCount();
    }
  }

  // 切换tab
  onChangeTab = ( e ) => {
    this.setState( { 
      currentTabKey: e, 
      pageNum: 1,
      currentMessageType:'' 
    } )
  }

  onChangeMessageType = ( e ) => {
    this.setState( { currentMessageType: e } )
  }

  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getMessageList() );
  };

  getMessageList = ()=> {
    const { dispatch } = this.props;
    const { pageSize, pageNum, currentTabKey, currentMessageType, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( { 
      type: 'messageCenter/getMessageList', 
      payload: { 
        query:{
          page:{
            pageSize, 
            pageNum, 
            orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          },
          type:currentTabKey,
          status:currentMessageType,
        }
      } 
    } )
  }

  getAllRead = () => {
      const { dispatch,  } = this.props;
      const { currentTabKey } = this.state
      dispatch( { 
        type: 'messageCenter/getAllRead',
        payload: {
          query:{ type:currentTabKey },
          callFunc:() => {
            this.getMessageList()
            this.getUnreadCount();
            dispatch( {  type: 'global/getGlobalUnreadCount', payload: { } } )
          }
        }
      } )
  }

  getView = ( record ) => {
    const { history } = this.props;
    const { source, type } = record
    if( type === "ACTIVITY" && source ){
      sessionStorage.setItem( 'viewNowId', source )
      history.push( `activityTemplate/activityAudit` )
    }
    if( type === "RIGHT" && source ){
      sessionStorage.setItem( 'productName', source )
      history.push( `equitySupermarket/equityGoods/goodsList` )
    }
  }

  getUnreadCount = () => {
      const { dispatch } = this.props;
      const { currentTabKey } = this.state;
      dispatch( { 
        type: 'messageCenter/getUnreadCount',
        payload: {
          query:{
            type:currentTabKey
          },
          callFunc:() => {
          }
        }
      } )
  }

  getMessageRead = ( item ) => {
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( { 
      type: 'messageCenter/getMessageRead',
      payload: {
        query:{ id },
        callFunc:() => {
          this.getMessageList();
          this.getUnreadCount();
          dispatch( {  type: 'global/getGlobalUnreadCount', payload: {} } )
        }
      }
    } )
  }
  
  renderToolBar = () => {
      const { unreadCount } = this.props;
      const { currentMessageType } = this.state;
      return (
        <div className={styles.toolbar}>
          <span
            className={currentMessageType === '' ? styles.current : null}
            onClick={()=>{this.onChangeMessageType( '' )}}
          >
              全部消息
          </span>
          <span
            className={currentMessageType === false ? styles.current : null}
            onClick={()=>{this.onChangeMessageType( false )}}
          >
              仅显示未读（{unreadCount}）
          </span>
          <span
            className={currentMessageType === true ? styles.current : null}
            onClick={()=>{this.onChangeMessageType( true )}}
          >
              仅显示已读
          </span>
          <Popconfirm
            title={<span style={{ whiteSpace:'nowrap' }}>确定全部标记为已读？</span>}
            placement="topRight"
            onConfirm={() => {this.getAllRead()}}
          >
            <span>全部标记为已读</span>
          </Popconfirm>
        </div>
      )
  }

  renderContent = () => {
      const { loading, messageMap: { total, list } } = this.props;
      const { sortedInfo, pageSize, pageNum } = this.state;
      const columns = [
        {
          title: <span>通知内容</span>,
          dataIndex: 'content',
          key: 'content',
          render: content => {
            return <span>{content}</span>
          }
        },
        {
          title: <span>通知时间</span>,
          dataIndex: 'createTime',
          key: 'create_time',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
          sortDirections: ['descend', 'ascend'],
          render: createTime => {
            let showTime = '--'
            if ( createTime ) {
              showTime = moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
            }
            return (
              <span>{showTime}</span>
            )
          }
        },
        {
          title: <span>通知状态</span>,
          dataIndex: 'status',
          key: 'status',
          width: 100,
          render: status => <span style={{ color:status ? '#7f7f7f': '#448ef7' }}>{status ? '已读' : '未读'}</span>,
        },
        {
          title: <span style={{ textAlign: 'center', }}>操作</span>,
          fixed: 'right',
          render: ( choice, item ) => (
            <div>
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                onClick={() => this.getView( item )}
              >立即查看
              </span>
              {!item.status && (
                <span
                  style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#1890ff' }}
                >
                  <Popconfirm
                    title={<span style={{ whiteSpace:'nowrap' }}>通知状态为未读，确定标记为已读</span>}
                    placement="topRight"
                    onConfirm={() => this.getMessageRead( item )}
                  >
                    <span>标记已读</span>
                  </Popconfirm>
                </span>
              )}
            </div>
          ),
        },
      ];

      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize,
        total,
        current: pageNum,
        showTotal: () => {
          return `共 ${total} 条`;
        }
      };

      return (
        <Table
          size="middle"
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.tableChange}
        />
      )
  }

  render() {
    const { loading } = this.props;
    return ( 
      <GridContent>
        <Card bordered={false} title="消息列表" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
          <Tabs
            loading={loading}
            onChange={( e ) => this.onChangeTab( e )}
          >
            <TabPane tab="活动通知" key="ACTIVITY" />
            <TabPane tab="权益通知" key="RIGHT" />
          </Tabs>
          {this.renderToolBar()}
          {this.renderContent()}
        </Card>
      </GridContent>
    );
  }
}
 
export default MessageCenter;