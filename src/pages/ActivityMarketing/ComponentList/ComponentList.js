
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FilterForm from './FilterForm';
// import styles from './componentList.less';


const componentType = {
  BASE_ELEMENT: '基础组件',
  REWARD_ELEMENT: '抽奖组件',
  TASK_ELEMENT: '任务组件',
  PRODUCT_ELEMENT: '产品组件',
  INTERACT_ELEMENT: '互动组件',
}

@connect( ( { component } ) => {
  return {
    loading: component.loading,
    componentList: component.componentList,
  }
} )

class ComponentList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'use_count',
      field: 'createTime',
      order: 'descend',
    },
  };

  componentDidMount() {
    this.getComponentList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getComponentList();
    } )
  }

  // 获取组件列表
  getComponentList = ( ) => {
    const { sortedInfo = {} } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const sortValue = ( sortedInfo.order === 'ascend' ) ? 'asc' : 'desc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'component/getComponentList',
      payload: {
        orderBy: `${sortedInfo.column ? sortedInfo.columnKey : `group_type, ${sortedInfo.columnKey}`} ${sortValue}`,
        ...formValue
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getComponentList() );
  };

  goUseComponent = ( e, item ) => {// 使用模版跳转
    const { history } = this.props;
    sessionStorage.setItem( 'compId', item.type )
    history.push( `/activityTemplate/bees` )
  }

  render() {
    const { loading, componentList } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total: componentList && componentList.length,
      current: pageNum,
      showTotal: () => {
        return `共 ${componentList && componentList.length} 条`;
      }
    };

    const columns = [
      {
        title: <span>组件名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>组件分类</span>,
        dataIndex: 'groupType',
        key: 'groupType',
        render: groupType => <span>{componentType[`${groupType}`]}</span>,
      },
      {
        title: <span>组件logo</span>,
        dataIndex: 'logo',
        key: 'logo',
        render: logo => <img src={logo} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} />,
      },
      {
        title: <span>组件描述</span>,
        dataIndex: 'description',
        key: 'description',
        render: description => <span>{description}</span>,
      },
      {
        title: <span>已使用次数</span>,
        dataIndex: 'useCount',
        key: 'use_count',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'use_count' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: useCount => <span>{useCount}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        // width: 210,
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.goUseComponent( e, item )}
            >去使用
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='组件查询'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <FilterForm
            filterSubmit={this.filterSubmit}
            wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            componentType={componentType}
          />
          <Table
            size="middle"
            rowKey="type"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={componentList}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    );
  };
}

export default ComponentList;
