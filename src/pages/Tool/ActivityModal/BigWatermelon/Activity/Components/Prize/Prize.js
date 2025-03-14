import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import _ from "lodash";
import { Input, Modal, Form, Table, Alert, Icon, message, Radio, TimePicker } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../../../ActivityModal.less';

import Interval from '../Interval/Interval';
import PrizeModal from './PrizeModal';


// 奖品设置
const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();

@connect( ( { activity } ) => ( {
  loading: activity.loading,
} ) )
@Form.create()
class PrizeTable extends PureComponent {

  timer = null;

  formItemStyle = {
    display: 'flex',
    marginLeft: '3%'
  }


  constructor( props ) {
    super( props );
    const { data } = props;
    this.state = {
      prizesList: this.setInitialList(),
      useInventory: '',
      deleteIds: [0],
      popupValue: '',
      visible: false,
      groupIndex: null,
      allPrizeList: [],
      lotteryRelative: true, // 是否关联其他抽奖活动1是0否
      prizeSendMode: data.prizeSendMode || 'PROBABILITY', // 奖品发放规则设置
      fragmentsList: this.setFragmentsList(), // 中奖分段
      fragments: 0, // modal打开的中奖分段
      dailyRankSendTime: data.dailyRankSendTime || '00:00'
    };
  }


  componentDidMount() {
    this.getPrizeList( {} );
  }

  // 初始化List
  setInitialList = () => {
    const { data } = this.props;
    let prizesList = [];
    if ( data.prizes && data.prizes.length ) {
      prizesList =  data.prizes.map( ( item ) => {
        const newItem = item;
        newItem.rowKey = item.id;
        if ( !item.prizeId ) {
          newItem.prizeId =  "onWinPrize";
        }
        return newItem;
      } )
    }

    return prizesList;
  }

  // 设置初始值的分段，并去重。
  setFragmentsList = () => {
    const { data } = this.props;
    let fragmentsList = [];
    const arr = [];
    if ( data.prizes && data.prizes.length && data.prizeSendMode === 'PROBABILITY' ) {
      fragmentsList = data.prizes.map( ( item ) => { return { rankFrom: item.rankFrom, rankTo: item.rankTo, disabled: true }} )
    }

    fragmentsList.forEach( item => {
      const check = arr.every( ( arrItem ) => arrItem.rankFrom !== item.rankFrom );
      if ( check ) {
        arr.push( item );
      }
    } );

    return arr;
  }

  onPreview = () => {
    setTimeout( () => {
      this.props.onPreview();
    } )
  }

  // 获取选择奖品列表
  getPrizeList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        pageNum: 1,
        pageSize: 30,
        name,
      },
      callFunc: ( res ) => {
        this.setState( { allPrizeList: [...res] } )
      }
    } );
  }

  getValues = () => {
    const { prizesList: prizes, deleteIds, dailyRankSendTime } = this.state;
    const { form: { getFieldsValue } } = this.props;
    const value = getFieldsValue();
    return { prizes, deleteIds, ...value, dailyRankSendTime }
  }

  // 显示新建遮罩层
  showModal = ( groupIndex ) => {
    this.getPrizeList( {} );
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
      groupIndex,
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, prize ) => {
    const { fragmentsList } = this.state;
    let fragments = 0;
    fragmentsList.forEach( ( item, fIndex ) => {
      if ( item.rankFrom === prize.rankFrom ) {
        fragments = fIndex;
      };
    } );
    this.setState( {
      groupIndex: prize.groupIndex,
      fragments
    } );
    e.stopPropagation();
    this.getPrizeList( {} );
    const $this = this;
    this.setState( {
      visible: true,
      prizeCurrent: { ...prize, prizeId: !prize.prizeId ? 'onWinPrize' : prize.prizeId },
      popupValue: prize.popupText || '',
    }, () => {
      $this.onChange( prize.prizeId, 'first' )
    } );
  };

  popuChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
      groupIndex: null
    } );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { prizesList, deleteIds } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk: () => {
        const newPrizesList = prizesList.filter( item => item.rowKey !== obj.rowKey );
        let newDeleteIds = deleteIds;

        if ( obj.id ) {
          newDeleteIds = deleteIds.concat( [obj.id] )
        }
        this.setState( { prizesList: newPrizesList, deleteIds: newDeleteIds }, () => {
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const { form } = this.formRef.props;
    const { prizeCurrent, prizesList, useInventory, groupIndex, fragmentsList, prizeSendMode } = this.state;
    let prizeType = 'ALL';
    switch ( groupIndex ) {
      case 0:
        prizeType = 'DAY';
        break;
      case 1:
        prizeType = 'WEEK';
        break;
      case 2:
        prizeType = 'MONTH';
        break;
      case 3:
        prizeType = 'ALL';
        break;
      default:
        break;
    }
    let newPrizesList = prizesList;
    const $this = this;


    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { inventory, rankFrom, rankTo, fragments } = fieldsValue;
      if ( useInventory < inventory ) {
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if ( rankFrom > rankTo ) {
        message.error( '首位名次不能大于末尾名次' )
        return
      }

      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newPrizesList = prizesList.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ) : item )
        message.success( '编辑成功' )
      } else {
        if ( prizeSendMode === 'PROBABILITY' ) {
          const { rankFrom: from, rankTo: to } = fragmentsList[fragments];
          newPrizesList = newPrizesList.concat( [{ ...fieldsValue, rankTo: to, rankFrom: from, groupIndex: +from, prizeType, rowKey: time(), prizeSendMode }] );
        } else {
          newPrizesList = newPrizesList.concat( [{ ...fieldsValue, groupIndex, prizeType, rowKey: time(), prizeSendMode }] );
        }
        message.success( '添加成功' )
      }
      // 表格数据排序
      newPrizesList.sort( ( a, b )=> {
        return +a.rankFrom - +b.rankTo
      } );
      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        prizesList: newPrizesList,
        groupIndex: null,
      }, () => {
        $this.onPreview();
      } );
    } );
  };

  //  奖品输入名称筛选
  onSearch = ( value ) => {
    clearTimeout( this.timer );
    this.timer = setTimeout( () => {
      this.getPrizeList( { name: value } );
    }, 500 );
  }

  //  库存切换
  onChange = ( id, num ) => {
    const { form: { setFieldsValue } } = this.props;
    const { allPrizeList } = this.state;
    const getInventory = ( allPrizeList.length && id ) ? allPrizeList.find( item => item.id === id ) : {}
    if ( !num ) {
      if ( id === 'onWinPrize' || id === undefined || id === '' ) {
        setFieldsValue( {
          popupText: '谢谢参与',
          name: '未中奖',
        } )
      } else {
        const preizName = getInventory.name || '';
        setFieldsValue( {
          popupText: `恭喜你，获得${preizName}`,
          name: preizName,
        } )
      }
    }
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
    } );
  }

  // 奖品发放规则设置
  changePrizeSendMode = ( e ) => {
    this.setState( {
      prizeSendMode: e.target.value,
      prizesList: []
    } );
  }

  // 设置useInventory当前选中奖品库存
  setUseInventory = ( useInventory ) => {
    this.setState( {
      useInventory
    } )
  }

  handleSubmit = () => {
    const { form } = this.props;
    let data = {};
    let isError = true;
    form.validateFields( ( err ) => {
      data = this.getValues();

      const { prizes: prizesList, prizeSendMode, lotteryRelative } = data;
      if ( err || !lotteryRelative && !prizesList.length ) {
        isError = false;
        message.error( '请在奖品列表里面输入必填项' );
      }
      if ( prizesList.length && prizeSendMode === 'PROBABILITY' ) {
        // 对奖品列表按分段分类
        const prizesListClass = prizesList.reduce( ( pre, cur ) => {
          const newPre = pre;
          if ( cur.rankFrom in pre ) {
            newPre[cur.rankFrom].push( cur )
          } else {
            newPre[cur.rankFrom] = [cur];
          }
          return newPre;
        }, {} );

        // 各分段下必须要有备选奖品 且 中奖分段总和为100%
        isError = Object.keys( prizesListClass ).every( ( item ) => {
          let isHundred = 0;
          let hasAlternative = true;
          // 计算分段中奖概率
          prizesListClass[item].forEach( prizes => {
            isHundred += ( +prizes.probability );
          } );
          // 是否含有备选奖品
          hasAlternative = prizesListClass[item].some( prize => {
            return +prize.probability  === 0;
          } );
          if ( isHundred !== 100 ) {
            message.error( '请确保各分段奖品概率之和为100%' );
          } else if ( !hasAlternative ) {
            message.error( '请确保各分段都有设置备选奖品(中奖概率为0)' );
          }
          return isHundred === 100 && hasAlternative
        } );

      }
    } );
    if ( data && data.prizes ) {
      data.prizes.forEach( ( item, index ) => {
        if ( item.prizeId === 'onWinPrize' ) {
          delete data.prizes[index].prizeId
        }
      } );
    }
    return  isError && data;
  }

  // 渲染表格的添加奖品弹窗
  renderPrizeModal = () => {
    const { visible, prizeCurrent = {}, allPrizeList = [], useInventory, popupValue, groupIndex, fragmentsList, prizeSendMode, fragments } = this.state;
    const { loading } = this.props;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };
    let name = '';
    switch ( groupIndex ) {
      case 0:
        name = '日榜';
        break;
      case 1:
        name = '周榜';
        break;
      case 2:
        name = '月榜';
        break;
      case 3:
        name = '总榜';
        break;
      default:
        name = '奖品'
    }

    return (
      <Modal
        maskClosable={false}
        title={`${prizeCurrent.prizeId ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${name}`}
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={visible}
        {...modalFooter}
      >
        <PrizeModal
          allPrizeList={allPrizeList}
          prizeCurrent={prizeCurrent}
          useInventory={useInventory}
          popupValue={popupValue}
          fragmentsList={fragmentsList}
          loading={loading}
          prizeSendMode={prizeSendMode}
          fragments={fragments}
          wrappedComponentRef={( form ) => { this.formRef = form }}
          setUseInventory={this.setUseInventory}
        />
      </Modal>
    )
  }

  // 渲染排行榜的表格
  renderPrizeTable = ( groupIndex ) => {
    const { prizesList } = this.state;
    const sortList = _.filter( prizesList, { 'groupIndex': groupIndex } );
    const columns = [
      {
        title: <span>奖项</span>,
        dataIndex: 'name',
        render: name => <span>{name || '未中奖'}</span>
      },
      {
        title: <span>名次</span>,
        dataIndex: 'rank',
        render: ( rank, record ) => {
          if ( record.rankFrom === record.rankTo ) {
            return <span>{record.rankFrom}</span>

          }
          return <span>{record.rankFrom}- {record.rankTo}</span>
        }
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText || '--'}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory || '--'}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || '--'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>
          </div>
        ),
      },
    ];

    return <Table
      size="small"
      rowKey="rowKey"
      columns={columns}
      pagination={false}
      dataSource={sortList}
      footer={() => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1890FF',
              cursor: 'pointer'
            }}
            onClick={() => this.showModal( groupIndex )}
          >
            <Icon
              type="plus-circle"
              style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
            />
            添加奖品（{sortList.length}）
          </div>
        )
      }}
    />
  }

  // 是否关联其他抽奖点击事件
  changeLotteryRelative = ( e ) => {
    if ( e.target.value === false ) {
      const { form: { setFieldsValue } } = this.props;
      setFieldsValue( {
        link: ''
      } )
    }
    this.setState( { lotteryRelative: e.target.value } )
  }

  // 分段设置change事件
  intervalChange = () => {
    const { form: { getFieldValue } } = this.props;
    setTimeout( () => {
      this.setState( {
        fragmentsList: getFieldValue( 'fragmentsList' )
      } );
    } )

  }

  // 日榜发榜时间
  changeTiem = ( value ) => {
    this.setState( {
      dailyRankSendTime: moment( value ).format( 'HH:mm' )
    } );
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const {
      lotteryRelative, prizeSendMode, prizesList, fragmentsList,
    } = this.state;

    const columns = [
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory !== undefined ? inventory : 0}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount !== undefined ? sendCount : 0}</span>,
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability !== undefined ? `${probability}%` : '--'}</span>
      },
      {
        title: <span>中奖分段</span>,
        dataIndex: 'fragments',
        key: 'fragments',
        render: ( fragments, item ) => <span>{fragments !== undefined ? `${fragmentsList[fragments].rankFrom}~${fragmentsList[fragments].rankTo}` : `${item.rankFrom}~${item.rankTo}`}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
          <FormItem label='是否关联其他抽奖活动' style={this.formItemStyle}>
            {getFieldDecorator( 'lotteryRelative', {
              rules: [{ required: true, message: '请选择其他是否关联' }, ],
              initialValue: data.lotteryRelative !== undefined ? data.lotteryRelative : lotteryRelative,
            } )(
              <Radio.Group onChange={this.changeLotteryRelative}>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>

          {
            getFieldValue( 'lotteryRelative' ) ?
              <FormItem label='抽奖跳转链接' style={this.formItemStyle}>
                {getFieldDecorator( 'link', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}抽奖跳转链接` }],
                  initialValue: data.link
                } )(
                  <Input onChange={this.onPreview} placeholder="可输入其他抽奖活动链接，满足抽奖条件后跳转该链接进行抽奖" />
                )}
              </FormItem> :
              <div>
                <FormItem label='奖品发放规则设置' style={this.formItemStyle}>
                  {getFieldDecorator( 'prizeSendMode', {
                    rules: [{ required: true, message: '请选择奖品发放规则类别' }, ],
                    initialValue: data.prizeSendMode || prizeSendMode,
                  } )(
                    <Radio.Group onChange={this.changePrizeSendMode}>
                      {
                        data.rankOptions && <Radio value='RANKING'>排行榜</Radio>
                      }
                      <Radio value='PROBABILITY'>分数</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <div style={{ marginBottom: '10px' }}>
                  <div style={this.formItemStyle}>
                    <div>提示：</div>
                    <div>
                      未配置奖品，将无抽奖流程<br />
                      增加数量时，直接点击数量右侧按钮进行增加<br />
                      减少数量时，需先将概率调整为0，或者将活动更改为非进行中
                    </div>
                  </div>
                </div>

                {
                  getFieldValue( 'prizeSendMode' ) === 'PROBABILITY' &&
                  <FormItem
                    label={
                      <span>游戏分段设置:  <span style={{ fontSize: '12px', color: 'red' }}>*最高分不可低于最低分，如果不限制抽奖分数，填写0至99999即可，未填写的分段无抽奖机会</span></span>
                    }
                  >
                    {getFieldDecorator( 'fragmentsList', {
                      rules: [{ required: true, message: '请输入分段' }, ],
                      initialValue: fragmentsList,
                    } )(
                      <Interval fragmentsList={fragmentsList} tableList={prizesList} onChange={this.intervalChange} />
                    )}
                  </FormItem>
                }

                <Alert
                  style={{ marginBottom: 15 }}
                  message={(
                    <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
                      <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` ) }} style={{ color: '#1890FF', cursor: 'pointer' }}>奖品管理</span>
                    </div> )}
                  banner
                />
                {
                  getFieldValue( 'prizeSendMode' ) === 'RANKING' ? data.rankOptions && data.rankOptions.map( ( item ) => {
                    let name = ''; let index = 0;
                    switch ( item ) {
                      case 'DAY':
                        name = '日榜';
                        index = 0;
                        break;
                      case 'WEEK':
                        name = '周榜';
                        index = 1;
                        break;
                      case 'MONTH':
                        name = '月榜';
                        index = 2;
                        break;
                      case 'ALL':
                        name = '总榜';
                        index = 3;
                        break;
                      default:
                        name = '总榜'
                        index = 3;
                    }
                    return (
                      <div key={`${item}`}>
                        <div style={{ margin: "10px 0" }}>
                          <span className={styles.edit_acitve_tab} />  {name}奖品设置:
                          {item === 'DAY' &&
                            <span style={{ marginLeft: '12px' }}>
                              发榜时间：
                              {getFieldDecorator( 'dailyRankSendTime', {
                                  rules: [{ required: true, message: '发奖时间' }, ],
                                  initialValue: data.dailyRankSendTime && moment( data.dailyRankSendTime, 'HH:mm' ) || moment( '00:00', 'HH:mm' ),
                                } )(
                                  <TimePicker
                                    minuteStep={60}
                                    onChange={this.changeTiem}
                                    format='HH:mm'
                                  />
                                )
                              }
                            </span>
                          }
                        </div>
                        {this.renderPrizeTable( index )}
                      </div>
                    )

                  } ) :
                  <Table
                    size="small"
                    rowKey="rowKey"
                    columns={columns}
                    pagination={false}
                    dataSource={prizesList}
                    footer={() => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1890FF',
                            cursor: 'pointer'
                          }}
                          onClick={() => this.showModal( 5 )}
                        >
                          <Icon
                            type="plus-circle"
                            style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                          />
                          添加奖品
                        </div>
                      )
                    }}
                  />
                }

              </div>
          }
        </Form>
        {/* 弹框 */}
        {/* <PrizeModal
          data={this.props.data}
          onPreview={this.onPreview}
          onRef={( ref )=>{this.taskSetRef = ref}}
        /> */}
        {this.renderPrizeModal()}

      </GridContent>
    );
  }
}

export default PrizeTable;

