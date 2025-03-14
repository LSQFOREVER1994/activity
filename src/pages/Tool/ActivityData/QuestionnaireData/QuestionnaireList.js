import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getUrlParameter } from '@/utils/utils';
import FilterForm from './FilterForm';
import styles from './questionnaire.less';


const activityStateObj ={
  GOING:"进行中",
  COMING:"即将开始",
  FINISH:"已结束",
  FORBID:"未启用"
}

@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
  questionnaireMap: questionnaire.questionnaireMap,
} ) )
@Form.create()
class QuestionnaireList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  }

  componentWillMount() {
    const str = window.location.href;
    if( getUrlParameter( 'type', str ) ){
      const routeClickName =decodeURIComponent( getUrlParameter( 'name', str ) )
      this.setState( {
        routeClickName
      }, ()=>{
        this.filterSubmit()
      } )
    }else{
      this.fetchList( {} )
    }
  } 



  // 获取列表
  fetchList = ( { pageNum= 1, pageSize= 10 } ) => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const {  rangeTime, activityName } = formValue;
    const { sortedInfo } = this.state
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'
    const startTime = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const { dispatch } = this.props;
    dispatch( {
      type: 'questionnaire/getQuestionnaireList',
      payload: {
        pageNum,
        pageSize,
        startTime,
        endTime,
        name:activityName||'',
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
      }
    } );
  }
  

  
  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    setTimeout( () => {
      this.fetchList( {} )
    }, 100 );
  }


  tableChange = ( pagination, filters, sorter ) =>{
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj
    }, ()=>this.fetchList( { pageNum: current, pageSize } ) );
  };

  // 跳转详情页面
  goDetail=( item )=>{
    this.props.history.push( `/tool/questionnaireData/questionnaireData?id=${item.id}` )
  }

  render() {
    const {
      loading, questionnaireMap:{ list, total }
    } = this.props;
    const {
      pageSize, pageNum, sortedInfo, routeClickType, routeClickName
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };



    const columns = [
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name || '--'}</span>,
      },
      {
        title: <span>累计提交</span>,
        dataIndex: 'plus',
        key: 'plus',
        render: plus =><span>{( plus && plus.accumulate ) || '--'}</span>,
      },
      {
        title: <span>活动状态</span>,
        dataIndex: 'activityState',
        key: 'activityState',
        render: activityState =><span>{activityStateObj[activityState] || '--'}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        key: 'start_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'start_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render : ( startTime ) => <span>{startTime}</span>
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render : ( endTime ) => <span>{endTime}</span>
      },
      {
        title: <span>活动天数</span>,
        dataIndex: 'totalDays',
        key: 'totalDays',
        render : ( totalDays ) => <span>{totalDays}</span>
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render : ( createTime ) => <span>{createTime}</span>
      },
      {
        title:'操作',
        dataIndex: '',
        render: ( id, item, index ) => (
      
          <span
            style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
            type="link"
            onClick={() => this.goDetail( item )}
          >
            详情
          </span>
        ),
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <FilterForm 
            filterSubmit={this.filterSubmit}
            routeClickType={routeClickType}
            routeClickName={routeClickName}
            wrappedComponentRef={( ref ) => { this.filterForm = ref}}
          />
          <Table
            size="large"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </div>
        
      </GridContent>
    );
  }
}

export default QuestionnaireList;
