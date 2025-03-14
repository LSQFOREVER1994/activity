import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Button, DatePicker } from 'antd';
import moment from "moment";
import styles from './GuessWave.less';

const FormItem = Form.Item;
const { RangePicker }=DatePicker

@connect( ( { guessWave } ) => ( {
  loading: guessWave.loading,
  creditDetailsData: guessWave.creditDetailsData,
} ) )
@Form.create()
class GuessDetail extends PureComponent {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  constructor( props ){
    const secrchData = props.secrchVal || {};
    const { end, rankType } = secrchData;
    const { startTime, endTime } = props.date( end, rankType )
    super( props );
    this.state={
      pageSize: 10,
      pageNum: 1,
      startTime,
      endTime,
      sortedInfo: {
        columnKey: 'operation_time',
        field: 'operationTime',
        order: 'descend',
      },
    }
  }

  componentDidMount(){
    this.fetchList();
  }

  fetchList=()=>{
    const { pageNum, pageSize, startTime, endTime, sortedInfo }=this.state;
    const { dispatch, info }=this.props;
    const { accountId } = info;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'guessWave/getCreditDetails',
      payload: {
        pageNum,
        pageSize,
        accountId,
        startTime,
        endTime,
        orderBy:sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'operation_time desc',
      },
    } );
  }

  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };

  render() {
    const{ pageSize, pageNum, sortedInfo, startTime, endTime }=this.state;
    const { loading, info={}, form:{ getFieldDecorator }, creditDetailsData:{ list, total }, go }=this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title: <span>事件</span>,
        dataIndex: 'source',
        render: source => <span>{source || ''}</span>,
      },
      {
        title: <span>积分变动</span>,
        dataIndex: 'value',
        render: ( contact, record ) => {
          return <span>{record.action === "INPUT" ? "+" : "-"}{record.value}</span>
        },
      },
      {
        title: <span>总积分</span>,
        dataIndex: 'current',
        render: ( contact, record ) => {
          let currentValue = record.current;
          if ( record.action === "INPUT" ) {
            currentValue += record.value;
          } else {
            currentValue -= record.value;
          }
          return <span>{currentValue}</span>
        },
      },
      {
        title: <span>时间</span>,
        dataIndex: 'operationTime',
        key:'operation_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'operation_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: operationTime => <span>{operationTime || '--'}</span>,
      }
    ]
    
    return (
      <div className={styles.guess_wave}>
        <div className={styles.form_content}>
          <Form layout="inline" name='selectForm'>
            <div className={styles.form_go} onClick={go}>{`<`}&nbsp;返回&nbsp;</div>
            <span className={styles.form_title}>ID：</span>
            <FormItem>
              {getFieldDecorator( 'accountId', {
                initialValue: info.accountId,
              } )(
                <Input disabled />
              )}
            </FormItem>
            <span className={styles.form_title}>昵称：</span>
            <FormItem>
              {getFieldDecorator( 'accountId', {
                initialValue: info.nick,
              } )(
                <Input disabled />
              )}
            </FormItem>
            <span className={styles.form_title}>时间：</span>
            <FormItem>
              {getFieldDecorator( 'rangeTime', {
                initialValue:[moment( startTime ), moment( endTime )],
              } )(
                <RangePicker
                  style={{ width:280 }}
                  disabled
                  showTime
                  format="YYYY/MM/DD"
                />
              )}
            </FormItem>
            <Button
              disabled={!list.length}
              type="primary"
              style={{ position: 'relative', top: 2, marginLeft:20 }}
              onClick={() => { this.props.onExportXlsx() }}
            >导出
            </Button>
          </Form>
        </div>
        <Table
          size="large"
          rowKey='waterId'
          columns={columns}
          loading={loading}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}

export default GuessDetail;