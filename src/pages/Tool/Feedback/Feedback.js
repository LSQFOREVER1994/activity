import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Card, Form, Table } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const { Option } = Select;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  message: tool.message,
  messageTypes: tool.messageTypes,
} ) )
@Form.create()
class Feedback extends PureComponent {
  state = {
    pageSize: 20,
    selectKey: '',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const $this = this;
    const { dispatch } = this.props;
    const { pageSize } = this.state;
    dispatch( {
      type: 'tool/getMessageTypes',
      payload: {
        successsFunc: () => {
          $this.fetchList( 1, pageSize, '' );
        }
      }
    } );
  }

  //  获取列表
  fetchList = ( pageNum, pageSize, type ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getMessage',
      payload: {
        pageNum,
        pageSize,
        orderBy: "create_time desc",
        type,
      },
    } );
  }

  //  pageSize  变化的回调
  onShowSizeChange = ( current, pageSize ) => {
    const { selectKey } = this.state;
    this.setState( { pageSize } );
    this.fetchList( 1, pageSize, selectKey );
  }

  //  页码变化回调
  changePageNum = ( pageNumber ) => {
    const { pageSize, selectKey } = this.state;
    this.fetchList( pageNumber, pageSize, selectKey );
  }

  changeListType = ( selectKey ) => {
    const { pageSize } = this.state;
    this.setState( { selectKey } );
    this.fetchList( 1, pageSize, selectKey );
  }

  render() {
    const {
      loading, message: { total, list }, messageTypes,
    } = this.props;

    const { pageSize } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <span>产品名称：</span>
        
        <Select style={{ width: 150 }} onChange={this.changeListType} defaultValue="">
          <Option value=''>全部</Option>
          {
                messageTypes.map( ( item ) => (
                  <Option key={item.id} value={item.type}>{item.description}</Option>
                ) )
              }
        </Select>
          
        
        
      </div>
    );

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      onChange: this.changePageNum,
      onShowSizeChange: this.onShowSizeChange,
    };

    const columns = [
      {
        title: <span>联系方式</span>,
        dataIndex: 'contact',
        render: contact => <span>{contact || '匿名'}</span>,
      },
      {
        title: <span>分数</span>,
        dataIndex: 'score',
        render: score => <span>{score}</span>,
      },
      {
        title: <span>内容</span>,
        dataIndex: 'content',
        render: content => <span>{content || '--'}</span>,
      },
      {
        title: <span>时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime || '--'}</span>,
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title="用户反馈"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
            />
          </Card>
        </div>
      </GridContent>
    );
  }
}

export default Feedback;