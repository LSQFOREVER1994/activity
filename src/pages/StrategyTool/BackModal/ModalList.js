import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Table, Card, Form, Modal, message, DatePicker, Radio, Tag, Col, Row, Select } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import Slider from "bizcharts-plugin-slider";
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ConditionModal from './conditionModal';
import styles from './condition.less';

function getComponent( data, modalDetail ) {
  const cols = {
    date: {
      type: "time",
      tickCount: 10,
      mask: "YY/MM/DD"
    },
  };
  const ds = new DataSet( {
    state: {
      start: Object.keys( modalDetail ).length > 0 ? Date.parse( modalDetail.result.yields[0].date ) : Date.parse( '1970/1/1' ),
      end: Object.keys( modalDetail ).length > 0 ? Date.parse( modalDetail.result.yields[modalDetail.result.yields.length - 1].date ) : Date.parse( '2100/1/1' )
    }
  } );

  const dv = ds.createView( "origin" ).source( data );
  dv.transform( {
    type: "filter",
    callback( obj ) {
      const time = Date.parse( `${obj.date} 08:00:00` );
      return time >= ds.state.start && time <= ds.state.end;
    }
  } );

  class SliderChart extends React.Component {
    onChange = ( obj ) => {
      const { startValue, endValue } = obj;
      ds.setState( "start", startValue );
      ds.setState( "end", endValue );
    }

    render() {
      return (
        <div>
          <Chart
            height={400}
            data={dv}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis name="date" />
            <Axis
              name="value"
              label={{
                formatter: val => `${val}%`
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="line"
              position="date*value"
              size={2}
              color="name"
              shape="smooth"
            />
          </Chart>
          <div>
            <Slider
              width="auto"
              height={26}
              start={ds.state.start}
              end={ds.state.end}
              xAxis="date"
              yAxis="flow"
              scales={{
                time: {
                  type: "time",
                  tickCount: 10,
                  mask: "YY/MM/DD"
                }
              }}
              data={dv.rows}
              backgroundChart={{
                type: "line"
              }}
              onChange={( e ) => this.onChange( e )}
            />
          </div>
        </div>
      );
    }
  }
  return SliderChart;
}

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Option } = Select;
const indexMap = { };
@connect( ( { backModal } ) => ( {
  loading: backModal.loading,
  modals: backModal.modals,
  groups: backModal.groups,
  modalDetail: backModal.modalDetail
} ) )

@Form.create()


class ModalList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 1000,
    finish: '',
    visible: false,
    isShow: false,
    isShowModal: false,
    type: '',
    localBuyConditions: [],
    localSellConditions: [],
    startDate: '',
    endDate: '',
    tool:''
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  componentDidMount() {
    const { pageNum, pageSize, finish } = this.state;
    this.fetchList( { pageNum, pageSize, finish } );
    indexMap.INDEX = '指标';
    indexMap.AI_BAND = 'AI波段';
    indexMap.TAIL_PLATE = '尾盘吃鸡';
    indexMap.GOLD_STOCK = '黑盒金股';
  };

  fetchList = ( { pageSize, pageNum } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'backModal/getModalList',
      payload: {
        pageSize,
        pageNum,
      }
    } );
    dispatch( {
      type: 'backModal/getGroups',
      payload: {}
    } );
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
    } );
  };

  //  显示买入条件选择 Modal
  clickBuyCondition = () => {
    this.setState( {
      isShow: true,
      type: '买入条件',
    } );
  };

  //  显示卖出条件选择 Modal
  clickSellCondition = () => {
    this.setState( {
      isShow: true,
      type: '卖出条件',
    } );
  };

  //  取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      localBuyConditions: [],
      localSellConditions: []
    } );
  };

  //  取消条件 Modal
  cancelConditionModal = ( type ) => {
    if ( type === '买入条件' ) {
      this.setState( {
        isShow: false
      } )
    } else {
      this.setState( {
        isShow: false
      } )
    }
  };

  //  提交条件选择
  handleConditionSubmit = ( type, conditions ) => {
    if ( type === '买入条件' ) {
      this.setState( {
        localBuyConditions: conditions,
        isShow: false
      } )
    } else {
      this.setState( {
        localSellConditions: conditions,
        isShow: false
      } )
    }
  };

  //  日期更改
  onDateChange = ( dates, dateStrings ) => {
    this.setState( {
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    } )
  };

  //  取消tag
  closeTag = ( removeTag, type ) => {
    const { localBuyConditions, localSellConditions } = this.state;
    if ( type === '买入条件' ) {
      _.pull( localBuyConditions, removeTag );
      this.setState( {
        localBuyConditions,
      } )
    } else {
      _.pull( localSellConditions, removeTag );
      this.setState( {
        localSellConditions,
      } )
    }
  };

  // 是否完成
  changeListType = ( e ) => {
    const { pageNum, pageSize } = this.state;
    const finish = e.target.value;
    this.setState( { finish } );
    this.fetchList( { pageSize, pageNum } )
  };

  //  查看详情
  check = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'backModal/getModalDetail',
      payload: {
        params: {
          id
        },
        callFunc: () => {
          this.setState( {
            isShowModal: true
          } );
        }
      }
    } );
  };

  //  取消查看详情
  cancelModal = () => {
    this.setState( {
      isShowModal: false
    } )
  };

  //  删除
  del = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageNum, pageSize, finish } = this.state;
    const { dispatch } = this.props;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `确定删除该回测模型？`,
      onOk() {
        dispatch( {
          type: 'backModal/delModal',
          payload: {
            params: {
              id
            },
            callFunc: () => {
              $this.fetchList( { pageNum, pageSize, finish } );
            },
          },
        } );
      }
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const {
      pageSize, pageNum, startDate, endDate, finish, tool
    } = this.state;
    let { localBuyConditions, localSellConditions } = this.state;

    localBuyConditions = localBuyConditions.map( item => item.condition );
    localSellConditions = localSellConditions.map( item => item.condition );

    if ( !localBuyConditions.length && tool ==='INDEX' ) {

        message.error( '请选择买入条件' );
        return;
    }
    if ( !localBuyConditions.length && tool ==='INDEX' ) {
        message.error( '请选择卖出条件' );
        return;
    }
    if ( !startDate || !endDate ) {
      message.error( '请选择时间' );
      return;
    }
    if( tool === '' ){
      message.error( '请选择指标' );
      return;
    }

    localBuyConditions = _.join( localBuyConditions, '&localBuyConditions=' )
    localSellConditions = _.join( localSellConditions, '&localSellConditions=' )
    const $this = this;
    const params = `startDate=${startDate}&endDate=${endDate}&buyConditions=${localBuyConditions}&sellConditions=${localSellConditions}&type=${tool}`
    dispatch( {
      type: 'backModal/submitModal',
      payload: {
        params,
        callFunc: () => {
          $this.fetchList( { pageNum, pageSize, finish } );
          $this.setState( {
            visible: false,
          } );
        },
      },
    } );
  };

  //  更改回测类型
  changeType = value => {
    const showBuy = document.getElementById( 'buy' );
    const showSell = document.getElementById( 'sell' );
    if( value !== 'INDEX' ){
      showBuy.style.visibility = 'hidden';
      showSell.style.visibility = 'hidden';
    }else{
      showBuy.style.visibility = 'visible';
      showSell.style.visibility = 'visible';
    }
    this.state.tool=value;
  };

  render() {
    const { loading, modals, form: { getFieldDecorator }, groups, modalDetail } = this.props;
    const { pageNum, visible, isShow, isShowModal, type, localBuyConditions, localSellConditions, finish } = this.state;


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper:true,
      total: modals.length,
      pageSize:20,
      current: pageNum
    };

    const group = {};
    groups.map( item => {
      return item.stockConditions.map( subItem => {
        return subItem.conditions.map( grdItem => {
          group[`${ grdItem.condition }`] = grdItem.name;
          return group[`${ grdItem.condition }`];
        } )
      } )
    } );

    const extraContent = (
      <div className={styles.extraContent}>
        <span>是否完成：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={finish}>
          <RadioButton value="">全部</RadioButton>
          <RadioButton value="true">已完成</RadioButton>
          <RadioButton value="false">未完成</RadioButton>
        </RadioGroup>
      </div>
    );

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>{formatMessage( { id: 'strategyMall.loopback.toolType' } )}</span>,
        dataIndex: 'type',
        render: toolType => <span>{ indexMap[toolType] }</span>,
      },
      {
        title: '回测组合条件',
        children: [
          {
            title: <span>{formatMessage( { id: 'strategyMall.loopback.buyConditions' } )}</span>,
            dataIndex: 'buyConditions',
            render: buyConditions => {

              // const buyConditionsArr = buyConditions.map(item => group[item]);
              // const str = buyConditionsArr.join('，');
              return(
                <span>{buyConditions}</span>
              )
            },
          },
          {
            title: <span>{formatMessage( { id: 'strategyMall.loopback.sellConditions' } )}</span>,
            dataIndex: 'sellConditions',
            render: sellConditions => {
              // const sellConditionsArr = sellConditions.map(item => group[item]);
              // const str = sellConditionsArr.join('，');
              return(
                <span>{ sellConditions }</span>
              )
            },
          }
        ]
      },
      {
        title: '回测区间',
        children: [
          {
            title: <span>{formatMessage( { id: 'strategyMall.loopback.startDate' } )}</span>,
            dataIndex: 'startDate',
            render: startDate => <span>{startDate}</span>,
          },
          {
            title: <span>{formatMessage( { id: 'strategyMall.loopback.endDate' } )}</span>,
            dataIndex: 'endDate',
            render: endDate => <span>{endDate}</span>,
          }
        ]
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.course.createAt' } )}</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.loopback.finishTime' } )}</span>,
        dataIndex: 'finishTime',
        render: finishTime => <span>{finishTime}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            { item.finishTime ? (
              <span
                style={{ cursor:'pointer', marginRight:'15px', color:'#1890ff' }}
                type="link"
                onClick={() => this.check( id )}
              >
                预览
              </span>
            ) : null }
            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.del( e, id )}
            >删除
            </span>
          </div>
        ),
      }
    ];

    let modalDetailObj = {};
    if ( finish !== 'false' ) {
      modalDetailObj = Object.keys( modalDetail ).length === 0 ? {} : modalDetail.result.yields[modalDetail.result.yields.length - 1];
    }

    const data = [];

    if ( Object.keys( modalDetail ).length > 0 ) {
      modalDetail.result.yields.map( o => {
        return data.push( {
          date: moment( o.date ).format( 'YYYY/MM/DD' ),
          name: '策略收益',
          value: o.yield
        },
        {
          date: moment( o.date ).format( 'YYYY/MM/DD' ),
          name: '沪深300收益',
          value: o.rivalYield
        } );
      } );

    }

    const SliderChart = getComponent( data, modalDetail );

    return (
      <GridContent>
        <div>
          <Card
            bordered={false}
            title="回测模型列表"
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              bordered
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={modals.list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable
          title='添加回测模型'
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <div className={styles.modalDiv}>
                <span style={{ marginLeft: 180, color: 'black', fontWeight: 'normal' }}>
                  回测类型 : &nbsp;
                </span>
                <Select style={{ width: 120 }} defaultValue='全部' onChange={this.changeType}>
                  <Option value='全部'>选择指标</Option>
                  <Option value='INDEX'>{ indexMap.INDEX }</Option>
                  <Option value='AI_BAND'>{ indexMap.AI_BAND }</Option>
                  <Option value='TAIL_PLATE'>{ indexMap.TAIL_PLATE }</Option>
                  <Option value='GOLD_STOCK'>{ indexMap.GOLD_STOCK }</Option>
                </Select>
              </div>

              <div className={styles.modalDiv} id='buy'>

                <span style={{ marginLeft: 180, color: 'black', fontWeight: 'normal' }}>
                      买入条件 : &nbsp;
                </span>
                {
                    localBuyConditions.map( ( item ) => {
                      return(
                        /* eslint-disable react/no-array-index-key */
                        <Tag key={`${item.name}`} closable onClose={() => this.closeTag( item, type )}>{item.name}</Tag>
                      )
                    } )
                  }
                <Button type='primary' onClick={this.clickBuyCondition}>
                  选择买入条件
                </Button>
              </div>

              <div className={styles.modalDiv} id='sell'>
                <span style={{ marginLeft: 180, color: 'black', fontWeight: 'normal' }}>
                  卖出条件 : &nbsp;
                </span>
                {
                  localSellConditions.map( ( item ) => {
                    return(
                      /* eslint-disable react/no-array-index-key */
                      <Tag key={`${item.name}`} closable onClose={() => this.closeTag( item, type )}>{item.name}</Tag>
                    )
                  } )
                }
                <Button type='primary' onClick={this.clickSellCondition}>
                  选择卖出条件
                </Button>
              </div>

              <FormItem label={`${formatMessage( { id: 'strategyMall.loopback.startDate' } )} - ${formatMessage( { id: 'strategyMall.loopback.endDate' } )}`} {...this.formLayout}>
                {getFieldDecorator( 'startDate', {
                  } )( <RangePicker style={{ marginRight: 15 }} onChange={( dates, dateStrings ) => this.onDateChange( dates, dateStrings )} /> )}
              </FormItem>
            </Form>
          }
        </Modal>
        <ConditionModal
          isShow={isShow}
          type={type}
          cancelConditionModal={this.cancelConditionModal}
          handleConditionSubmit={this.handleConditionSubmit}
          localBuyConditions={localBuyConditions}
          localSellConditions={localSellConditions}
        />
        <Modal
          maskClosable
          title='回测模型'
          width={1000}
          bodyStyle={{ padding: '28px 0 28px' }}
          destroyOnClose
          visible={isShowModal}
          onCancel={this.cancelModal}
          footer={null}
        >
          {
            modalDetail ?
            (
              <div>
                <div className={styles.conditionDiv}>
                  <div style={{ marginBottom: 5 }}>
                    <span className={styles.conditionSpan}>买入条件 : &nbsp;&nbsp;</span>
                    <span>
                      {
                        modalDetail.buyConditions ? modalDetail.buyConditions.map( item => `${group[item]}，` ) : null
                      }
                    </span>
                  </div>
                  <div>
                    <span className={styles.conditionSpan}>卖出条件 : &nbsp;&nbsp;</span>
                    <span>
                      {
                        modalDetail.sellConditions ? modalDetail.sellConditions.map( item => `${group[item]}，` ) : null
                      }
                    </span>
                  </div>
                </div>
                <div className={styles.modalCard}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Card title="策略总胜率" bordered={false}>
                        {modalDetailObj.winRate && modalDetailObj.winRate.toFixed( 2 )} %
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="策略累计收益" bordered={false}>
                        {modalDetailObj.yield && modalDetailObj.yield.toFixed( 2 )} %
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="策略最大回撤" bordered={false}>
                        {modalDetailObj.maxDown && modalDetailObj.maxDown.toFixed( 2 )} %
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="策略年化收益" bordered={false}>
                        {modalDetailObj.yearYield && modalDetailObj.yearYield.toFixed( 2 )} %
                      </Card>
                    </Col>
                  </Row>
                </div>

                <div>
                  <SliderChart />
                </div>
              </div>
            )
            : null
          }

        </Modal>
      </GridContent>
    );
  };
}

export default ModalList;
