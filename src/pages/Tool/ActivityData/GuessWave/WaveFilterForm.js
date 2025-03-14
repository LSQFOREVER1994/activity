import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Select  } from 'antd';
import { connect } from 'dva';
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;

@connect( ( { guessWave } ) => ( {
  loading: guessWave.loading,
  rankDateList: guessWave.rankDateList,
} ) )
@Form.create()
class WaveFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  componentDidMount(){
    this.getTimeList()
  }
  
  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  
  // 搜索查询
  getTimeList=()=>{
    const { activityId, dispatch, form: { getFieldValue, setFieldsValue } } = this.props;
    dispatch( {
      type: 'guessWave/getHistoryRankDates',
      payload: {
        limit: 100,
        rankType: getFieldValue( 'rankType' ),
        platFormName: activityId,
      },
      callFunc: ( res ) => {
        setFieldsValue( {
          end:res && res.length && res[0]
        } )
        setTimeout( () => {
          this.props.filterSubmit()
        }, 500 );
      }
    } );
  }

  // goList=( val )=>{
  //   const { rankDateList, fetchList, getGuessWave }=this.props;
  //   const num = rankDateList && rankDateList.length && rankDateList.findIndex( o=> o === val );
  //   if( num === 0 ){ fetchList() }else{ getGuessWave() }
  // }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, filterSubmit, platFormName, exportLodaing, rankDateList, goList } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label='活动名称' {...this.formLayout}>
              {getFieldDecorator( 'platFormName', {
                    initialValue:platFormName || ''
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
                initialValue: 'WEEK'
            } )(
              <Select onSelect={() => { this.getTimeList() }} style={{ width: 120 }}>
                <Option value="WEEK">周榜</Option>
                <Option value="MONTH">月榜</Option>
              </Select>
            )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='期数' {...this.formLayout}>
              {getFieldDecorator( 'end', {
              } )(
                <Select onSelect={() => { filterSubmit() }}>
                  {
                    ( rankDateList || [] ).map( ( item ) => {
                      const newItem = item;
                      const currentDay = `${moment( newItem ).format( getFieldValue( 'rankType' ) === "MONTH" ? 'YYYY-MM' : 'YYYY-MM-DD' )}`
                      const nextDay = `${moment( newItem ).subtract( 6, "days" ).format( 'YYYY-MM-DD' )}~`;
                      return <Option key={item} value={item}>{getFieldValue( 'rankType' ) === "WEEK" && nextDay}{currentDay}</Option>
                    } )
                  }
                </Select>
                )}
            </FormItem>
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
    )}
   
}

export default WaveFilterForm;