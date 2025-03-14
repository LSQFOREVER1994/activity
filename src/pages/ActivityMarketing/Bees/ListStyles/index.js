import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popover, Popconfirm } from 'antd';
import moment from 'moment';
import { getValue, activityStates, activityTypes } from '../BeesEnumes';

@connect( ( { bees } ) => ( {
  loading: bees.loading,
  bees: bees.bees,
} ) )

class ListStyles extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    this.props.modalFilform( { pageNum, pageSize, sortedInfo } )
  }


  tableChange = ( pagination, filters, sorter = {} ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, this.getList );
  };


  render() {
    const { pageSize, pageNum, sortedInfo } = this.state;
    const {
      loading, bees: { total, list }, onEditBees, openQRCodeModal, onCopyBees, jumpDataCenter,
      handleAddTemplate, onOpenFeatureModal, onExportActivity, onDeleteBees, onCooperateManager,
       getRoleGroupList, getCurrentCollaborsInfo
    } = this.props;

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

    const columns = [
      {
        title: '活动版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>活动ID</span>,
        dataIndex: 'id',
        key: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>活动类型</span>,
        dataIndex: 'activityType',
        key: 'activityType',
        render: activityType => <span>{getValue( activityTypes, activityType ) || '--'}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        key: 'start_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'start_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: startTime => <span>{startTime ? moment( startTime ).format( 'YYYY-MM-DD' ) : '--'}</span>,
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{endTime ? moment( endTime ).format( 'YYYY-MM-DD' ) : ''}</span>,
      },
      {
        title: <span>活动期数</span>,
        dataIndex: 'periods',
        key: 'periods',
        // width: 120,
        render: periods => <span>{periods || '--'}</span>
      },
      {
        title: <span>状态</span>,
        dataIndex: 'state',
        key: 'state',
        // width: 160,
        render: ( state ) => {
          return <span>{getValue( activityStates, state )}</span>
        }
      },
      {
        title: <span>创建时间</span>,
        width: 200,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>创建人</span>,
        dataIndex: 'createUsername',
        key: 'createUsername',
        // width: 120,
        render: createUsername => <span>{createUsername || '--'}</span>
      },
      {
        title: <span>所属部门</span>,
        dataIndex: 'createUserOrg',
        key: 'createUserOrg',
        // width: 120,
        render: createUserOrg => <span>{createUserOrg || '--'}</span>
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        // dataIndex: 'id',
        fixed: 'right',
        // width: 210,
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => getCurrentCollaborsInfo( item.id, 'edit', () => onEditBees( { item } ) )}
            >编辑
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => openQRCodeModal( e, item )}
            >
              预览
            </span>
            <Popover
              placement="bottomRight"
              content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#1890ff' }}
                    onClick={( e ) => onCopyBees( e, item.id )}
                  >复制活动
                  </span>

                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#1BB557' }}
                    onClick={( e ) => jumpDataCenter( e, item )}
                  >
                    数据中心
                  </span>
                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                    onClick={( e ) => handleAddTemplate( e, item )}
                  >添加至模版
                  </span>
                  {
                    item.version === 'V2' &&
                    <>
                      <span
                        style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                        onClick={( e ) => onOpenFeatureModal( e, item )}
                      >未来版本设置
                      </span>
                    </>
                  }
                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                    onClick={( e ) => onExportActivity( e, item )}
                  >导出活动配置
                  </span>
                  <span
                    style={{ margin: '0 20px 10px', cursor: 'pointer', color: '#efb208' }}
                    onClick={( e ) => getRoleGroupList( item.id, 'cooperate', () => onCooperateManager( e, item, true ) )}
                  >协作管理
                  </span>
                  <span
                    style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#f5222d' }}
                  >
                    <Popconfirm
                      placement="top"
                      title={`是否确认删除:${item.name}`}
                      onConfirm={( e ) => getCurrentCollaborsInfo( item.id, 'delete', () => onDeleteBees( e, item.id ) )}
                      okText="是"
                      cancelText="否"
                    >
                      <span>删除活动</span>
                    </Popconfirm>
                  </span>
                </div>
              }
            >
              <span style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}>更多</span>
            </Popover>
          </div>
        ),
      },
    ];

    return (
      <Table
        scroll={{ x: 1300 }}
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
}

export default ListStyles;
