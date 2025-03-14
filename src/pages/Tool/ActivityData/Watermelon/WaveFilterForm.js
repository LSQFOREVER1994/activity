/* eslint-disable prefer-destructuring */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, WeekPicker } = DatePicker;
@connect( ( { watermelon } ) => ( {
  loading: watermelon.loading,
} ) )
@Form.create()
class WaveFilterForm extends PureComponent {

  state = {
    rankTypeObj: [{
      value: 'DAY',
      name: '日榜',
      groupIndex: 0
    }, {
      value: 'WEEK',
      name: '周榜',
      groupIndex: 1
    }, {
      value: 'MONTH',
      name: '月榜',
      groupIndex: 2
    }, {
      value: 'ALL',
      name: '总榜',
      groupIndex: 3
    }],
    startTime: null,
    endTime: null
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { rankTypeObj } = this.state;
    this.getActivityMassage();
    dispatch( {
      type: 'watermelon/setWatermelonRankObj',
      payload: {
        rankTypeObj: {
          rankType: rankTypeObj[0].value,
          rankName: rankTypeObj[0].name,
          groupIndex: rankTypeObj[0].groupIndex,
        }
      }
    } );
  }

  getValues = () => {
    const { form } = this.props;
    const { startTime, endTime } = this.state;
    return {
      ...form.getFieldsValue(),
      startTime,
      endTime
    };
  }

  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 榜单切换事件处理
  handleRankChange = () => {
    const { rankTypeObj } = this.state;
    const { dispatch, form: { getFieldValue } } = this.props;
    const rankType = getFieldValue( 'rankType' );
    let rankName;
    let groupIndex;
    rankTypeObj.forEach( ( item ) => {
      if ( item.value === rankType ) {
        rankName = item.name;
        groupIndex = item.groupIndex;
      }
    } );
    dispatch( {
      type: 'watermelon/setWatermelonRankObj',
      payload: {
        rankTypeObj: {
          rankType,
          rankName,
          groupIndex,
        }
      }
    } );
    this.onDateChange();
  }

  // 获取活动信息

  getActivityMassage = () => {
    const { dispatch, activityId }=this.props;
    dispatch( {
      type: 'activity/getActivityData',
      payload: {
        id: activityId,
      },
      callFunc: ( result ) => {
        const activeData = Object.assign( {
          deleteIds: [0],
          type: 'WATERMELON',
          nextState: false
        }, result );
        this.setState( {
          activeData
        }, () => {
          this.onDateChange()
        } );
      }
    } )
  }

  // 获取活动榜单列表
  getTableList = () => {
    const { activityId, dispatch, form: { getFieldValue, setFieldsValue }, pageNum, pageSize } = this.props;
    const { startTime, endTime } = this.state;
    const rankType = getFieldValue( 'rankType' );
    dispatch( {
      type: 'watermelon/getWatermelonRank',
      payload: {
        startTime,
        endTime,
        id: activityId,
        pageNum,
        pageSize,
        rankTimeEnum: rankType,
      },
      callFunc: ( res ) => {
        setFieldsValue( {
          end: res && res.length && res[0]
        } )
        setTimeout( () => {
          this.props.filterSubmit()
        }, 500 );
      }
    } );
  }

  // 日期发生改变

  onDateChange = ( value, rType ) => {
    let startTime = null; let endTime = null;
    let weekOfday;
    let date = value; let rankType = rType; let dayTime = '00:00:00';
    const { form:  { getFieldValue } } = this.props;
    const { activeData } = this.state;
    if ( !value && !rankType ) {
      date = getFieldValue( 'end' );
      rankType = getFieldValue( 'rankType' )
    }

    if ( activeData ) {
      dayTime = `${activeData.dailyRankSendTime}:00`;
    }

    // 设置各类别榜单时间区间
    if ( date !== null ) {
      switch ( rankType ) {
        case 'DAY':
          startTime = `${moment( date ).subtract( 1, 'days' ).format( 'YYYY-MM-DD' )  } ${dayTime}`;
          endTime = `${moment( date ).format( 'YYYY-MM-DD' )  } ${dayTime}`;
          break;
        case 'WEEK':
          weekOfday = moment( date ).format( 'E' );
          startTime = `${moment( date ).subtract( weekOfday-1, 'days' ).format( 'YYYY-MM-DD' )  } 00:00:00`;
          endTime = `${moment( date ).add( 7-weekOfday, 'days' ).format( 'YYYY-MM-DD' )} 23:59:59`;
          break;
        case 'MONTH':
          startTime = `${moment( date ).startOf( 'month' ).format( "YYYY-MM-DD" ) } 00:00:00`;
          endTime = `${moment( date ).endOf( 'month' ).format( "YYYY-MM-DD" ) } 23:59:59`;
          break;
        default:
          break;
      }
    } else {
      startTime = null;
      endTime = null
    }

    this.setState( {
      startTime,
      endTime
    }, () => {
      this.getTableList();
    } );
  }

  rendDate = ( getFieldValue ) => {
    const rankType = getFieldValue( 'rankType' );
    switch ( rankType ) {
      case 'DAY':
        return <DatePicker onChange={( value ) => this.onDateChange( value, rankType )} />
      case 'WEEK':
        return <WeekPicker onChange={( value ) => this.onDateChange( value, rankType )} />
      case 'MONTH':
        return <MonthPicker onChange={( value ) => this.onDateChange( value, rankType )} />
      default:
        break;
    }
    return null
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, filterSubmit, platFormName, exportLodaing } = this.props;
    const { rankTypeObj } = this.state;
    return (
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label='活动名称' {...this.formLayout}>
              {getFieldDecorator( 'platFormName', {
                initialValue: platFormName || ''
              } )(
                <Input
                  disabled={!!platFormName}
                  placeholder="请输入批次ID"
                /> )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label='榜单' {...this.formLayout}>
              {getFieldDecorator( 'rankType', {
                initialValue: rankTypeObj[0].value
              } )(
                <Select onSelect={() => { this.handleRankChange() }} style={{ width: 120 }}>
                  {
                    rankTypeObj.map( ( item ) => {
                      return <Option value={item.value} key={item.name}>{item.name}</Option>
                    } )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            {
              getFieldValue( 'rankType' ) !== 'ALL' &&
              <FormItem label='期数' {...this.formLayout}>
                {getFieldDecorator( 'end', {
                  initialValue: moment()
                } )(
                  this.rendDate( getFieldValue )
                )}
              </FormItem>
            }
          </Col>
          <Col span={6} style={{ position: 'relative', top: 4 }}>
            <Button
              // disabled={!list.length}
              type="primary"
              loading={exportLodaing}
              style={{ marginRight: 20 }}
              onClick={() => { this.props.onExportXlsx() }}
            >
              导出
            </Button>
            <Button
              // disabled={!list.length}
              type="primary"
              onClick={() => { this.props.switchPrizeVisibal( true ) }}
            >
              批量发奖
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

}

export default WaveFilterForm;