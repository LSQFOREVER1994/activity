
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form } from 'antd';
import styles from '../../Lists.less'

const auditStateObj={ 
  'PENDING':'待审核',
  'PASSED':'已通过',
  'REJECTED':'已拒绝'
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  recordList: tool.recordList
} ) )
@Form.create()

class RecordList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
  }

  componentDidMount() {
    this.fetchList();
  };

  // 初始化 页面获取列表
  fetchList = () => {
    const { dispatch, newsId } = this.props;
    if( newsId ){
      const  { pageSize, pageNum } = this.state;
      dispatch( {
        type: 'tool/getRecordList',
        payload: {
          page:{
            pageSize,
            pageNum,
          },
          newsId
        }
      } )
    }
  };

  render() {
    const { loading, recordList } = this.props;

    const columns = [
      {
        title: <span>文章标题</span>,
        dataIndex: 'title',
        width:300,
        render: title => <div className={styles.titleBox}>{title || '--'}</div>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime	|| '--'}</span>,
      },
      {
        title: <span>审核状态</span>,
        dataIndex: 'auditState',
        render: auditState => <span>{auditStateObj[auditState] || '--'}</span>,
      },
      {
        title: <span>审核时间</span>,
        dataIndex: 'auditTime',
        render: auditTime => <span>{auditTime || '--'}</span>,
      },
    ]
    return (
      <Table
        size="large"
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={recordList}
      />
    );
  };
}

export default RecordList;