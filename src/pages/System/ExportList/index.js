import React, { useRef, useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';


const statusData = {
    WAITING:{
        label:'等待中',
        color:'orange',
    },
    PROCESSING:{
        label:'处理中',
        color:'blue',
    },
    CANCELED:{
        label:'已取消',
        color:'',
    },
    FINISHED:{
        label:'已完成',
        color:'green',
    },
    FAILED:{
        label:'异常',
        color:'red',
    }
};

const searchEleList = [
    {
      key: 'userName',
      label: '用户名',
      type: 'Input',
    },
    {
      key: 'nick',
      label: '昵称',
      type: 'Input',
    },
    {
      key: 'state',
      label: '状态',
      type: 'Select',
      optionList:[ { value:'', label:'全部' }, ...Object.keys( statusData ).map( ( key )=>{
        return{
            value:key,
            label:statusData[key].label
        }
    } )]
    },
    {
      key: 'submitTime',
      label: '提交时间',
      type: 'RangePicker',
      alias: {
        submitTimeStart: 'YYYY-MM-DD 00:00:00',
        submitTimeEnd: 'YYYY-MM-DD 23:59:59',
      },
    },
    {
      key: 'completeTime',
      label: '完成时间',
      type: 'RangePicker',
      alias: {
        completeTimeStart: 'YYYY-MM-DD 00:00:00',
        completeTimeEnd: 'YYYY-MM-DD 23:59:59',
      },
    },
];


function ExportList( props ) {
  const { loading, dispatch, exportListData } = props;
  const { list, total, pageNum, pageSize } = exportListData || {};
  const searchBarRef = useRef( null );
  const [ pageInfo, setPageInfo ] = useState( { pageNum: 1, pageSize: 10 } );
  const [ sortedInfo, setSortedInfo ] = useState( {
    columnKey: 'submit_time',
    field: 'submitTime',
    order: 'descend',
  } )

  const getExportList = ()=>{
    const sortValue = sortedInfo.order === 'descend' ? 'desc' : 'asc';
    const orderBy = sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '';
    const searchValue = searchBarRef.current.data || {};
    dispatch( {
        type:'system/getExportList',
        payload:{
            page:{ 
              ...pageInfo,
              orderBy 
            },
            ...searchValue
        }
    } )
  }

  // 筛选表单提交 请求数据
  const filterSubmit = () => {
    setPageInfo( { ...pageInfo, pageNum: 1, } );
  };

  const confirm = ( item, type )=>{
    const { id, state, downloadUrl, taskName } = item;
    if( type !=='del' && state === 'FINISHED' ){
        if( downloadUrl ){
            const downloadFile = document.createElement( 'a' );
            downloadFile.href = downloadUrl;
            downloadFile.download = `${taskName}.xlsx`;
            document.body.appendChild( downloadFile );
            downloadFile.click();
            window.URL.revokeObjectURL( downloadUrl );
            document.body.removeChild( downloadFile );
            message.success( '下载成功' );
        }else{
            message.error( '下载地址出错' )
        }
    }else{
        let str;
        if( state === 'CANCELED' )str = 'system/deleteExportListItem';
        if( state === 'WAITING'  ) str = 'system/cancelExportListItem';
        if( state === 'FAILED' ) str = 'system/retryExportListItem';
        if( type ==='del' )str = 'system/deleteExportListItem';
        dispatch( {
            type: str,
            payload:{ id },
            callBack:getExportList
        } )
    }
  }


  useEffect( ()=>{
    getExportList()
  }, [pageInfo, sortedInfo] )

  const columns = [
    { title: '用户名', dataIndex: 'userName', key: 'userName' },
    { title: '昵称', dataIndex: 'nick', key: 'nick' },
    { title: '任务名', dataIndex: 'taskName', key: 'taskName' },
    { title: '来源活动', dataIndex: 'activityName', key: 'activityName' },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: state =>{
        if( state ){
            return(
              <Tag color={statusData[state]?.color}>
                {statusData[state]?.label}
              </Tag>
            )
        }
        return '--'
      }
    },
    {
        title: '提交时间',
        dataIndex: 'submitTime',
        key: 'submit_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'submit_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: submitTime => <span>{submitTime || '--'}</span>,
    },
    {
        title: '完成时间',
        dataIndex: 'completeTime',
        key: 'complete_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'complete_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: completeTime => <span>{completeTime || '--'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: ( id, record ) =>{
        const { state } = record;
        if( state === 'PROCESSING' ) return '--';
        if( state === 'WAITING' ||  state === 'CANCELED' ){
            return(
              <Popconfirm
                title={`确定${state === 'WAITING' ? '取消' :'删除'}当前下载进度？`}
                onConfirm={()=> confirm( record )}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link" style={{ color:'red' }}>{state === 'WAITING' ? '取消' :'删除'}</Button>
              </Popconfirm>
            )
        }
        let text;
        if( state === 'FINISHED' ) text = '下载';
        if( state === 'FAILED' ) text = '重试';
        return(
          <>
            <Button type="link" onClick={()=>confirm( record )}>{text}</Button>
            <Popconfirm
              title="确定删除当前下载进度？"
              onConfirm={()=>confirm( record, 'del' )}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" style={{ color:'red' }}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    },
  ];

  const onChangePage = ( pagination, filters, sorter )=>{
    const { current, pageSize:page } = pagination;
    setPageInfo( { ...pageInfo, pageNum:current, pageSize:page } )
    setSortedInfo( sorter )
  }

  const pagination = {
    total,
    current: pageNum,
    defaultPageSize: pageSize,
    showQuickJumper: true,
    showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
  };

  return (
    <GridContent>
      <Card bordered={false} title="导出列表" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
        <p style={{ color: 'red' }}>已完成的导出记录将于7日后自动删除，请及时下载</p>
        <SearchBar
          ref={searchBarRef}
          searchEleList={searchEleList}
          searchFun={filterSubmit}
          loading={loading}
        />
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={pagination}
          onChange={onChangePage}
          loading={loading}
        />
      </Card>
    </GridContent>
  );
}

const mapStateToProps = ( { system } ) => ( {
  loading: system.loading,
  exportListData:system.exportListData
} );
export default connect( mapStateToProps )( ExportList );
