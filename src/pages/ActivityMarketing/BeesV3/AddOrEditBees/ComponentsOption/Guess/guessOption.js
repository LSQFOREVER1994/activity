import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Modal, Popconfirm, Table, Pagination, Form, Radio, DatePicker, Select, message } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;


// const initData =  [
//   {
//       "prodCode": "123130.SZ",
//       "prodName": "设研转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "设研转债"
//   },
//   {
//       "prodCode": "123131.SZ",
//       "prodName": "奥飞转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "奥飞转债"
//   },
//   {
//       "prodCode": "123132.SZ",
//       "prodName": "回盛转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "回盛转债"
//   },
//   {
//       "prodCode": "123133.SZ",
//       "prodName": "佩蒂转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "佩蒂转债"
//   },
//   {
//       "prodCode": "123135.SZ",
//       "prodName": "泰林转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "泰林转债"
//   },
//   {
//       "prodCode": "123138.SZ",
//       "prodName": "丝路转债",
//       "hqTypeCode": "XSHE.D.CCF",
//       "specialMarker": "70369281048576",
//       "prodNameExt": "丝路转债"
//   }
// ]
const randomKey = () =>
  Number(
    Math.random()
      .toString()
      .substr( 3, 12 ) + Date.now()
  ).toString( 36 );

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
}

const pageSize = 5;

const GuessOption = props => {
  const { componentsData, changeValue, form, dispatch, guessProductsList = [] } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
  const { indexConfigList } = componentsData || {};
  const [ showList, setShowList ] = useState( [] );
  const [ guessList, setGuessList ] = useState( [] );
  const [ visible, setVisible ] = useState( false );
  const [ guessListItem, setGuessListItem ] = useState( {} );
  const [ pageNum, setpageNum ] = useState( 1 );
 
  // 查询猜涨跌产品列表
  const getGuessProductsList = ( type ) => {
    dispatch( {
      type: 'beesVersionThree/getGuessProductsList',
      payload: {
        prodCode:type
      },
    } )
  }

  const getTableList = () => {
    let arr = [];
    let showarr = [];
    if ( indexConfigList && indexConfigList.length ) {
      arr = indexConfigList.filter( ( i )=>  moment( i.endTime ).valueOf() > moment().subtract( 1, "days" ).valueOf() )
      .sort( ( a, b )=> moment( a.endTime ).valueOf() - moment( b.endTime ).valueOf() )
      .map( ( i ) =>( { ...i, rowKey: i.rowKey || randomKey() } ) )
      if ( arr.length > pageSize ) {
        showarr = arr.slice( ( pageNum * pageSize ) - pageSize, ( pageNum * pageSize ) );
      } else {
        showarr = [...arr]
      }
    }
    setShowList( showarr )
    setGuessList( arr )
  }

  useEffect( () => {
    getTableList();
  }, [indexConfigList, pageNum] )

  const onEditGuessItem = ( item ) => {
    const { closeCode } = item;
    getGuessProductsList( closeCode.split( '.' )[0] );
    setGuessListItem( item );
    setVisible( true );
  };

  const onDeleteGuessItem = ( item ) => {
    let newList = [];
    if ( guessList && guessList.length ) {
      newList = guessList.filter( info => {
        return info.rowKey !== item.rowKey;
      } );
    }
    changeValue( newList, 'indexConfigList' );
  }

  const addGuess = () => {
    getGuessProductsList( '1A0001' )
    setGuessListItem( {} )
    setVisible( true )
  }

  const onCancel = () => {
    setVisible( false );
    setGuessListItem( {} )
  }

  const onChange = ( current ) => {
    if ( current === pageNum ) return;
    setpageNum( current );
  }

  const handleSubmit = () => {
    validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      let newList = [...guessList];
      const { rowKey } = guessListItem;
      const { openCode, closeCode, rangeTime, periodType, guessType } = fieldsValue;
      let Data = {};
      const startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD' ) : '';
      const endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD' ) : '';
      const data = {
        startTime,
        endTime,
        periodType,
        guessType
      };
      
      const openGuessProducts = openCode ? guessProductsList.find( ( item ) => item.prodCode === openCode ) : {};
      const closeGuessProducts = closeCode ? guessProductsList.find( ( item ) => item.prodCode === closeCode ) : {};

      const openData = {
        openName: openGuessProducts?.prodName || '',
        openCode,
      }
      const closeData = {
        closeName: closeGuessProducts?.prodName || '',
        closeCode,
      }
      if ( periodType === 'OPEN' ) {
        Data = { ...data, ...openData }
      } else if ( periodType === 'CLOSE' ) {
        Data = { ...data, ...closeData }
      } else {
        Data = { ...data, ...openData, ...closeData }
      }
      if ( rowKey ) {
        newList = guessList.map( ( i ) => i.rowKey === rowKey ? { ...Data } : i )
        message.success( '编辑成功' )
      } else {
        newList.unshift( { ...Data, rowKey: randomKey() } );
        message.success( '添加成功' )
      }
      changeValue( newList, 'indexConfigList' );
      onCancel();
    } )
  }

  const guessTypeChange = ( val ) => {
    getGuessProductsList( val )
    if ( val === 'FUTURES' ) {
      setFieldsValue(
        { periodType: 'CLOSE' }
      )
    }
    setFieldsValue(
      { openCode: '', closeCode: '' }
    )
  }

  // 可选日期筛选
  const disabledDate = ( current ) => {
    // 禁止选用今天之前的日期(包括今天)
    // if ( moment( current ).valueOf() < moment().valueOf() ) return true;

    // 禁止选用今天之前的日期(不包括今天)
    if( moment( current ).valueOf() < moment().subtract( 1, "days" ).valueOf() )return true;
    
    // 已经选中的日期列表
    let isAccord = false
    if ( current && guessList?.length ) {
      let selectDates = guessList
      // 编辑时不计算当前条所选中的时间
      if ( guessListItem && guessListItem.rowKey ) {
        selectDates = guessList.filter( i => i.rowKey !== guessListItem.rowKey )
      }
      selectDates.forEach( i => {
        const curDate = moment( current ).format( 'YYYY-MM-DD 00:00:00' ).valueOf()
        const beginDate = moment( i.startTime ).format( 'YYYY-MM-DD 00:00:00' ).valueOf()
        const endDate = moment( i.endTime ).format( 'YYYY-MM-DD 23:59:59' ).valueOf()
        // 禁止选用已选日期范围内的日期
        if ( curDate >= beginDate && curDate <= endDate ) {
          isAccord = true
        }
      } )
    }
    return isAccord
  }

  const columns = [
    {
      title: '日期',
      dataIndex: 'startTime',
      key: 'startTime',
      render: ( id, item ) => {
        const { startTime, endTime } = item;
        return (
          <span>
            {moment( startTime ).format( 'MM-DD' )}~
            {moment( endTime ).format( 'MM-DD' )}
          </span>
        )
      }
    },
    {
      title: '竞猜标的',
      dataIndex: 'name',
      key: 'name',
      render: ( id, item ) => {
        const { openName, closeName } = item;
        return (
          <span>{openName}{openName && closeName ? '、' : ''}{closeName}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'key',
      key: 'key',
      render: ( id, record ) => (
        <>
          <div
            style={{ marginButtom: 10, cursor: 'pointer', color: '#1890ff' }}
            onClick={() => onEditGuessItem( record )}
          >
            编辑
          </div>

          <div style={{ cursor: 'pointer', color: '#f5222d' }}>
            <Popconfirm
              placement="top"
              title='是否确认删除'
              onConfirm={() => onDeleteGuessItem( record )}
              okText="是"
              cancelText="否"
            >
              删除
            </Popconfirm>
          </div>
        </>
      )
    },
  ];

  const prodNameChange = ( val ) => {
    getGuessProductsList( val )
    
  }

  return (
    <div className={styles.guess_option}>
      <div className={styles.option_box}>
        <div className={styles.option_box_tit}>
          <span style={{ color: '#f5222d' }}>*</span>
          竞猜标的设置：
        </div>
        <Button type="primary" onClick={addGuess}>
          添加竞猜标的
        </Button>
      </div>
      <Table
        size="small"
        key="rowKey"
        rowKey="rowKey"
        bordered={null}
        columns={columns}
        dataSource={showList}
        pagination={false}
      />
      {
        indexConfigList && indexConfigList.length ?
          <Pagination
            size="small"
            total={indexConfigList.length}
            className={styles.guess_list_pagination}
            showTotal={() => `共 ${indexConfigList.length} 条`}
            pageSize={pageSize}
            current={pageNum}
            onChange={onChange}
          /> : ""
      }
      <Modal
        title={`${guessListItem.name ? '编辑' : '添加'}竞猜标的`}
        width={620}
        maskClosable={false}
        visible={visible}
        onOk={handleSubmit}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label='竞猜时间' {...formLayout}>
            {getFieldDecorator( 'rangeTime', {
              rules: [{ required: true, message: '请选择竞猜时间' }],
              initialValue: guessListItem.startTime ? [moment( guessListItem.startTime, 'YYYY-MM-DD' ), moment( guessListItem.endTime, 'YYYY-MM-DD' )] : [],
            } )(
              <RangePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                getCalendarContainer={triggerNode => triggerNode.parentNode}
              /> )}
          </FormItem>

          <FormItem label='竞猜标的类型' {...formLayout} hidden>
            {getFieldDecorator( 'guessType', {
              rules: [{ required: true, message: '请选择开盘竞猜标的类型' }],
              initialValue: guessListItem.guessType || 'STOCK'
            } )(
              <Select onChange={guessTypeChange}>
                <Option value='STOCK'>股票</Option>
                {/* <Option value='FUNDS'>基金</Option> */}
                <Option value='FUTURES'>期货</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label='竞猜时间类型' {...formLayout} hidden>
            {getFieldDecorator( 'periodType', {
              rules: [{ required: true, message: '请选择竞猜时间类型' }],
              initialValue: guessListItem.periodType || 'CLOSE'
            } )(
              <RadioGroup
                disabled={getFieldValue( 'guessType' ) === 'FUTURES'}
              >
                {/* <Radio value="OPEN">开盘</Radio> */}
                <Radio value="CLOSE">收盘</Radio>
                <Radio value="ALL">全部</Radio>
              </RadioGroup>
            )}
          </FormItem>

          {
            getFieldValue( 'periodType' ) === 'ALL' ?
              <FormItem label='开盘竞猜标的' {...formLayout}>
                {getFieldDecorator( 'openCode', {
                  rules: [{ required: true, message: '请选择开盘竞猜标的' }],
                  initialValue: guessListItem.openCode
                } )(
                  <Select
                    showSearch
                    autoClearSearchValue
                    placeholder="请选择开盘竞猜标的"
                    optionFilterProp="children"
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                  >
                    {
                      guessProductsList.map( ( item ) => (
                        <Option key={item.code} value={item.code}>{item.name}（{item.code}）</Option>
                      ) )
                    }
                  </Select>
                )}
              </FormItem>
              : ''
          }
          {
            ( getFieldValue( 'periodType' ) === 'ALL' || getFieldValue( 'periodType' ) === 'CLOSE' ) ?
              <FormItem label='收盘竞猜标的' {...formLayout}>
                {getFieldDecorator( 'closeCode', {
                  rules: [{ required: getFieldValue( 'periodType' ) !== 'ALL', message: '请选择收盘竞猜标的' }],
                  initialValue: guessListItem.closeCode
                } )(
                  <Select
                    showSearch
                    autoClearSearchValue
                    placeholder="请选择收盘竞猜标的"
                    optionFilterProp="children"
                    onSearch={prodNameChange}
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                  >
                    {
                      guessProductsList.map( ( item ) => (
                        <Option key={item.prodCode} value={item.prodCode}>{item.prodName}（{item.prodCode}）</Option>
                      ) )
                    }
                  </Select>
                )}
              </FormItem>
              : ''
          }
        </Form>
      </Modal>
    </div>
  );
};

const guessProps = ( { beesVersionThree } ) => ( {
  guessProductsList: beesVersionThree.guessProductsList
} );

export default Form.create( { name: 'beesVersionThree' } )( connect( guessProps )( GuessOption ) );
