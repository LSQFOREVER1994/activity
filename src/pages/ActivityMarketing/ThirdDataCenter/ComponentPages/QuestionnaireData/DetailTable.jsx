import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import AnswerDetailModal from './AnswerDetailModal';
import SearchBar from '@/components/SearchBar';

// DetailTable 问卷统计 -> 数据详情
function DetailTable( props ) {
  const { id, elementId, detailData, questions, loading, dispatch } = props;
  const { total = 0, list = [] } = detailData;
  const searchBar = useRef( null )
  const [currentRecord, setCurrentRecord] = useState( {} )
  const [isShwoModal, setIsShwoModal] = useState( false )
  const [newList, setNewList] = useState( list || [] )
  const [pageInfo, setPageInfo] = useState( {
    pageNum: 1,
    pageSize: 10,
  } )
  
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'start_time',
    field: 'startTime',
    order: 'descend',
  } )
  // 获取列表
  const getList = ( data ) => {
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'questionnaireData/getQuestionnaireDetail',
      payload: {
        id,
        elementId,
        page: {
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          ...pageInfo,
        },
        ...data
      },
    } );
  }
  const getQuestion = () => {
    dispatch( {
      type: 'questionnaireData/getQuestion',
      payload: {
        activityId:id,
        elementId,
      },
    } );
  }

  useEffect( () => {
    getList()
    getQuestion()
  }, [id, elementId] )

  useEffect( () => {
    getList( searchBar.current?.data );
  }, [pageInfo, sortedInfo] )

  const filterSubmit = () => {
    setPageInfo( {
      ...pageInfo,
      pageNum: 1,
    } )
  }
  const calcSpendTime = ( record ) => {
    const { startTime, endTime } = record
    if ( startTime && endTime ) {
      const val = ( moment( endTime ) - moment( startTime ) ) / 1000
      if ( val > 60 ) {
        return `${Math.floor( val / 60 )}分钟${val % 60}秒`
      }
      return `${val % 60}秒`
    }
    return '--'
  }

  // 整合函数
const handerArr = ( array1, array2 )=> {
  // 将数组2转换为以id为键的对象，以便于查找
  const array2Obj = array2.reduce( ( obj, item ) => {
    if ( item.questionId ) {
      // eslint-disable-next-line no-param-reassign
      obj[item.questionId] = item;
    }
    return obj;
  }, {} );
  
  // 遍历数组1，如果数组2中有相同的id，则合并对象
  return array1.map( item => {
    if ( array2Obj[item.id] ) {
      return { ...item, options: [], ...array2Obj[item.id] };
    }
    return { ...item, options: [] };
  } );
}

  const handleDetail = ( record ) => {
    const recordArr = handerArr( questions, record.userReply )
    // eslint-disable-next-line no-param-reassign
    record.spendTime = calcSpendTime( record )
    // eslint-disable-next-line no-param-reassign
    record.userReply = recordArr;
    setCurrentRecord( record )
    setIsShwoModal( true )
  }

  const tableChange = ( pagination, filters, sorter ) => {
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'startTime' ) {
      sortObj.columnKey = 'start_time'
    }
    if ( sortObj.columnKey === 'endTime' ) {
      sortObj.columnKey = 'end_time'
    }
    setPageInfo( {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    } )
    setSortedInfo( sortObj )
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total,
    pageSize: pageInfo.pageSize,
    current: pageInfo.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
    }
  };
  let secondColumns = []
  // const newData = []

  if ( list && list.length > 0 && list[0].userReply && questions?.length > 0 ) {
    // const questionList = list[0].userReply.filter( value => Object.keys( value ).length !== 0 )
    // 拼接表头索引
    secondColumns = questions.map( ( info, index ) => {
      return {
        title: <span>{index + 1}、{info.title}</span>,
        dataIndex: `question${index + 1}`,
        key: `question${index + 1}`,
        width: 200,
        align: 'center',
        render: item => {
          return <span> {item} </span>
        }
      }
    } )
    
    // 拼接表格数据
    list[0].userReply.forEach( ( _, index ) => {
      list.forEach( ( info ) => {
        
        // const val = info.userReply.filter( value => Object.keys( value ).length !== 0 )[index]
        const val = info?.userReply?.[index]
        const itemVal = val?.options ? val?.options?.join() : '-'
        
        const infoItem = info;
        infoItem[`question${index + 1}`] = itemVal
      } )
    } )

    

  }
  const columns = [
    {
      title: <span>编号</span>,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: itemId => <span>{itemId}</span>,
    },
    {
      title: <span>手机号</span>,
      dataIndex: 'mobile',
      key: 'mobile',
      fixed: 'left',
      align: 'center',
      render: mobile => <span>{mobile}</span>,
    },
    {
      title: <span>资金账号</span>,
      dataIndex: 'account',
      key: 'account',
      fixed: 'left',
      align: 'center',
      render: account => <span>{account}</span>,
    },
    {
      title: <span>客户号</span>,
      dataIndex: 'userNo',
      key: 'userNo',
      fixed: 'left',
      align: 'center',
      render: userNo => <span>{userNo}</span>,
    },
    // {
    //   title: <span>用户名</span>,
    //   dataIndex: 'user',
    //   key: 'username',
    //   render: user => <span>{( user && user.username ) || '--'}</span>,
    // },
    // {
    //   title: <span>昵称</span>,
    //   dataIndex: 'nick',
    //   key: 'nick',
    //   render: ( _, record ) => <span>{( record.user && record.user.nick ) || '--'}</span>,
    // },
    ...secondColumns, // 答题内容
    {
      title: <span>开始答题时间</span>,
      dataIndex: 'startTime',
      key: 'start_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'start_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: startTime => <span>{startTime}</span>
    },
    {
      title: <span>结束答题时间</span>,
      dataIndex: 'endTime',
      key: 'end_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: endTime => <span>{endTime}</span>
    },
    {
      title: <span>答题时长</span>,
      dataIndex: 'spendTime',
      key: 'spend_time',
      render: ( _, record ) => <span>{calcSpendTime( record )}</span>,
    },
    {
      title: <span>操作</span>,
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      render: ( _, record ) => <a onClick={() => handleDetail( record )}>查看</a>,
    },
  ];
  const exportConfig = {
    type: 'activityService',
    ajaxUrl: `questionnaire/data/export`,
    xlsxName: '问卷数据详情.xlsx',
    extraData: {
      id,
      elementId,
      orderBy: `${sortedInfo.columnKey} ${( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'}`,
    },
  }
  const searchEleList = [
    {
      key: 'mobile',
      label: '手机号',
      type: 'Input'
    },
    {
      key: 'account',
      label: '资金账号',
      type: 'Input'
    },
    {
      key: 'userNo',
      label: '客户号',
      type: 'Input'
    },
    {
      key: 'no',
      label: '问卷编号',
      type: 'Number'
    },
    {
      key: 'submitTime',
      label: '答题时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { start: 'YYYY-MM-DD 00:00:00', end: 'YYYY-MM-DD 23:59:59' }
    },
  ]
  return (
    <GridContent>
      <SearchBar
        ref={searchBar}
        searchEleList={searchEleList}
        searchFun={filterSubmit}
        exportConfig={exportConfig}
        loading={loading}
      />
      <Table
        size='middle'
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        onChange={tableChange}
        pagination={paginationProps}
        scroll={{ x: true }}
      />
      <AnswerDetailModal
        isShwoModal={isShwoModal}
        currentRecord={currentRecord}
        setIsShwoModal={setIsShwoModal}
      />
    </GridContent>
  )
}

export default connect( ( { questionnaireData } ) => ( {
  ...questionnaireData
} ) )( DetailTable );
