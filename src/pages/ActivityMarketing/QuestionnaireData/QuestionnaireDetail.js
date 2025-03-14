import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';



@connect( ( { questionnaireData } ) => ( {
  loading: questionnaireData.loading
} ) )
class QuestionnaireDetail extends PureComponent {
  state = {
    pageSize:10,
    pageNum:1,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  }

  componentWillMount() {
  }



getTime=( time )=>{
  if( !time ){
    return '--'
  }
  if( time&&time>60 ){
    const minutes = Math.floor( ( ( time % 86400 ) % 3600 ) / 60 );
    const seconds = Math.floor( ( ( time % 86400 ) % 3600 ) % 60 );
    const duration = `${  minutes  }分${  seconds  }秒`;
    return duration
  }
   return `${time}秒`

}



tableChange = ( pagination, filters, sorter ) =>{
  const sotrObj = { order:'descend', ...sorter, }
  const { current, pageSize } = pagination;
  const { getQuestionnaireDetail }=this.props;
  const sortValue = ( sorter.order === 'descend' ) ? 'desc' : 'asc'
  const  orderBy= sorter.columnKey ? `${ sorter.columnKey || '' } ${ sortValue }`: 'create_time desc';
  this.setState( {
    pageNum: current,
    pageSize,
    sortedInfo: sotrObj
  }, ()=>getQuestionnaireDetail(  current, pageSize, orderBy  ) );
};


// 数组去重
unique =( arr )=> {
  return Array.from( new Set( arr ) )
}

  render() {
    const {
      loading, detailData:{ list=[], total }
    } = this.props;
    const {
      pageSize, pageNum, sortedInfo
    } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };
    let secondColumns=[]
    const newData=[]

     if( list &&list.length>0&&list[0].userReply ){
       // 拼接表头索引
       secondColumns=list[0].userReply.map( ( info, index )=>{
        return  {
          title: <span>题目{index+1}</span>,
          dataIndex: `question${index+1}`,
          key: `question${index+1}`,
          width:200,
          render: ( id, item, index ) => {
        return <span> {id} </span>
          }
        }
      } )
      // 拼接表格数据
      const questionList=list[0].userReply
      questionList.forEach( ( item, index )=>{
       list.forEach( info=>{
         const val=info.userReply[index]
         let itemVal=''
         if( val&&val.options ){
          itemVal=val.options.join()
         }
         const infoItem=info;
         infoItem[`question${index+1}`]= itemVal
         newData.push( infoItem )
      } )
      } )
     }
     const newList=this.unique( newData )
    const columns = [
      {
        title: <span>用户</span>,
        dataIndex: 'user',
        key: 'username',
        width: 100,
        render: user => <span>{( user && user.username ) || '--'}</span>,
      },
      {
        title: <span>提交时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        width: 120,
        render : ( createTime ) => <span>{createTime}</span>
      },
      {
        title: <span>填写时长</span>,
        dataIndex: 'spendTime',
        key: 'spend_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'spend_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        width: 80,
        render: spendTime =><span>{this.getTime( spendTime )}</span>,
      },
      ...secondColumns
    ];
    return (
      <Table
        size="large"
        rowKey="id"
        columns={columns}
        loading={loading}
        pagination={paginationProps}
        dataSource={newList}
        onChange={this.tableChange}
        scroll={{ x: 1300 }}
      />
    );
  }
}

export default QuestionnaireDetail;
