import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Button, DatePicker } from 'antd';
import moment from "moment";
import styles from './Watermelon.less';

const FormItem = Form.Item;
const { RangePicker }=DatePicker

@connect( ( { watermelon } ) => ( {
  loading: watermelon.loading,
  userDetailsData: watermelon.userDetailsData,
  rankTypeObj: watermelon.rankTypeObj,
} ) )
@Form.create()
class GuessDetail extends PureComponent {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  constructor( props ){
    const secrchData = props.secrchVal || {};
    const { startTime, endTime } = secrchData;
    super( props );
    this.state={
      pageSize: 10,
      pageNum: 1,
      startTime,
      endTime,
      // sortedInfo: {
      //   columnKey: 'operation_time',
      //   field: 'operationTime',
      //   order: 'descend',
      // },
    }
  }

  componentDidMount(){
    this.fetchList();
  }

  fetchList=()=>{
    const { pageNum, pageSize, startTime, endTime }=this.state;
    const { dispatch, info, activityId, rankTypeObj }=this.props;
    dispatch( {
      type: 'watermelon/getUserDetails',
      payload: {
        activityId,
        pageNum,
        pageSize,
        userId: info.userId,
        startTime,
        endTime,
        rankTimeEnum: rankTypeObj.rankType,
      },
    } );
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  };

  render() {
    const{ pageSize, pageNum, startTime, endTime }=this.state;
    const { loading, info={}, form:{ getFieldDecorator }, userDetailsData:{ list, total }, go }=this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title: <span>游戏分数</span>,
        dataIndex: 'score',
        render: score => <span>{score || '0'}</span>,
      },
      {
        title: <span>时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime || '--'}</span>,
      }
    ]
    
    return (
      <div className={styles.guess_wave}>
        <div className={styles.form_content}>
          <Form layout="inline" name='selectForm'>
            <div className={styles.form_go} onClick={go}>{`<`}&nbsp;返回&nbsp;</div>
            <span className={styles.form_title}>ID：</span>
            <FormItem>
              {getFieldDecorator( 'userId', {
                initialValue: info.userId,
              } )(
                <Input disabled />
              )}
            </FormItem>
            <span className={styles.form_title}>昵称：</span>
            <FormItem>
              {getFieldDecorator( 'userName', {
                initialValue: info.userName,
              } )(
                <Input disabled />
              )}
            </FormItem>
            {
              endTime && (
                <div style={{ display: 'inline-block' }}>
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
                </div>
              )
            }
            <Button
              disabled
              // disabled={!list.length}
              type="primary"
              style={{ position: 'relative', top: 2, marginLeft:20 }}
              onClick={() => { this.props.onExportXlsx() }}
            >导出
            </Button>
          </Form>
        </div>
        <Table
          size="large"
          rowKey='createTime'
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