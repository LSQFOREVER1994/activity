import React, { useEffect, useState } from 'react';
import { Button, Modal, Popconfirm, Table, Form, InputNumber, message } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
}

const randomKey = () => Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 );

const IntegralList = props => {
    const { componentsData, changeValue, form } = props;
    const { getFieldDecorator, validateFields } = form;
    const { bettingOptions = [] } = componentsData || {};
    const [ visible, setVisible ] = useState( false );
    const [ integralListItem, setIntegralListItem ] = useState( {} );
    const [ integralList, setIntegralList ] = useState( [] );

    const getList = ()=>{
      let arr = [];
      if( bettingOptions && bettingOptions.length ){
          arr = JSON.parse( bettingOptions ).sort( ( i1, i2 )=>i1-i2 ).map( ( i )=>(
              {
                key:randomKey(),
                integral:i,
              }
          ) )
      }
      setIntegralList( arr )
    }

    useEffect( ()=>{
      getList()
    }, [bettingOptions] )


    const onEditGuessItem = ( item ) => {
      setVisible( true );
      setIntegralListItem( item );
    };

    const addGuess = () =>{
      if( integralList.length === 4 ){
        message.warning( '最多只能添加4条押注积分' );
        return
      }
      setIntegralListItem( {} )
      setVisible( true )
    }

    const onCancel = ()=>{
      setIntegralListItem( {} );
      setVisible( false );
    }
  

    const onDeleteGuessItem = ( item )=>{
      const { key } = item;
      let arr = [];
      const newList = integralList.filter( info => {
          return info.key !== key;
      } );
      arr = newList.map( ( i )=>i.integral )
      changeValue( JSON.stringify( arr ), 'bettingOptions' );
    }

    const handleSubmit = ()=>{
      validateFields( ( err, fieldsValue  )=>{
        if( err )return;
        const { key } = integralListItem;
        const { integral } = fieldsValue;
        let newList = [...integralList];
        if( key ){
          newList  = integralList.map( ( i )=> i.key === key ? { ...i, ...fieldsValue } : i )
        }else{
          newList.push( { integral, key:randomKey() } )
        }
        const arr = newList.map( ( i )=>i.integral );
        changeValue( JSON.stringify( arr ), 'bettingOptions' );
        onCancel()
      } )
    }

    const columns = [
      {
        title: '押注积分',
        dataIndex: 'integral',
        key: 'integral'
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: ( id, record ) => (
          <>
            <span
              style={{ marginRight: 10, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => onEditGuessItem( record )}
            >
              编辑
            </span>

            <span style={{ cursor: 'pointer', color: '#f5222d' }}>
              <Popconfirm
                placement="top"
                title='是否确认删除'
                onConfirm={() => onDeleteGuessItem( record )}
                okText="是"
                cancelText="否"
              >
                删除
              </Popconfirm>
            </span>
          </>
          )
      },
    ];
    
    return (
      <div className={styles.guess_option}>
        <div className={styles.option_box}>
          <div className={styles.option_box_tit}>
            <span style={{ color:'#f5222d' }}>*</span>
            押注积分设置：
          </div>
          <Button type="primary" onClick={addGuess}>
            添加押注积分
          </Button>
        </div>
        <Table
          size="small"
          key="key"
          rowKey="key"
          bordered={null}
          columns={columns}
          dataSource={integralList}
          pagination={false}
        />
        <Modal
          title={`${integralListItem.key ? '编辑' : '添加'}押注积分`}
          width={540}
          maskClosable={false}
          visible={visible}
          onOk={handleSubmit}
          onCancel={onCancel}
          destroyOnClose
        >
          <Form>
            <FormItem label='押注积分设置' {...formLayout}>
              {getFieldDecorator( 'integral', {
                rules: [
                  { required: true, message: '请输入押注积分' },
                  { pattern: /^\d+$/, message: '只能输入非负整数' }
                ],
                initialValue: integralListItem.integral
                } )(
                  <InputNumber
                    style={{ width:150 }}
                    min={0}
                    placeholder='请输入押注积分'
                  />
                )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
};

export default Form.create()( IntegralList );