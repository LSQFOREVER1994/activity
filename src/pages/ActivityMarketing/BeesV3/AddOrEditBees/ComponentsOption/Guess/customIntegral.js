import React, { useState } from 'react';
import{ Form, Button, Modal, InputNumber, Radio, message } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
}

const limitDecimals = ( value ) => {
    const reg = /^(\-)*(\d+).(\d\d\d).*$/;
    if ( typeof value === 'string' ) {
      // eslint-disable-next-line no-restricted-globals
      return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : ''
    } if ( typeof value === 'number' ) {
      // eslint-disable-next-line no-restricted-globals
      return !isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : ''
    }
    return ''
};

const isInteger = ( num )=>Math.floor( num ) === num;

const CustomIntegral = props => {
    const { componentsData={}, changeValue, form } = props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const [ visible, setVisible ] = useState( false );

    const handleSubmit = ()=>{
        validateFields( ( err, fieldsValue )=>{
            if( err )return;
            const { customScoreEnable, bettingUpperLimit, bettingLowerLimit, bettingUnit } = fieldsValue;
            if( customScoreEnable ){
                if( bettingUpperLimit <= bettingLowerLimit ){
                    message.error( '自定义押注上限不可小于等于自定义押注下限' )
                    return
                }
                if( bettingLowerLimit >= bettingUpperLimit ){
                    message.error( '自定义押注下限不可大于等于自定义押注上限' )
                    return
                }
                if( !isInteger( bettingUpperLimit / bettingUnit ) ){
                    message.error( '自定义押注上线限除以押注单位不等于整数' )
                    return
                }
                if( !isInteger( bettingLowerLimit / bettingUnit ) ){
                    message.error( '自定义押注下线限除以押注单位不等于整数' )
                    return
                }
                changeValue( bettingUpperLimit, 'bettingUpperLimit' );
                changeValue( bettingLowerLimit, 'bettingLowerLimit' );
                changeValue( bettingUnit, 'bettingUnit' );
            }else{
                changeValue( '', 'bettingUpperLimit' );
                changeValue( '', 'bettingLowerLimit' );
                changeValue( '', 'bettingUnit' );
            }
            changeValue( customScoreEnable, 'customScoreEnable' );
            setVisible( !visible )
        } )
    }
    
    return(
      <div className={styles.guess_option}>
        <div className={styles.option_box}>
          <div className={styles.option_box_tit}>
            <span style={{ color:'#f5222d' }}>*</span> 
            自定义押注积分设置：
          </div>
          <Button type="primary" onClick={()=>setVisible( !visible )}>
            添加自定义积分
          </Button>
        </div>
        <Modal
          title='设置自定义押注积分'
          width={660}
          maskClosable={false}
          visible={visible}
          onOk={handleSubmit}
          onCancel={()=>setVisible( !visible )}
          destroyOnClose
        >
          <Form>
            <FormItem label='自定义是否开启' {...formLayout}>
              {getFieldDecorator( 'customScoreEnable', {
                rules: [{ required: true }],
                initialValue: componentsData.customScoreEnable
              } )(
                <RadioGroup>
                  <Radio value={false}>关闭</Radio>
                  <Radio value>开启</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {
                getFieldValue( 'customScoreEnable' ) ? 
                  <>
                    <FormItem label='自定义押注上限' {...formLayout}>
                      {getFieldDecorator( 'bettingUpperLimit', {
                        rules: [{ required: true, message:"请输入自定义押注上限" }],
                        initialValue: componentsData.bettingUpperLimit
                        } )(
                          <InputNumber
                            style={{ width:350 }}
                            min={1}
                            formatter={limitDecimals}
                            parser={limitDecimals}
                            placeholder='不为零的正整数，不可小于等于自定义押注下限'
                          />
                        )}
                    </FormItem>
                    <FormItem label='自定义押注下限' {...formLayout}>
                      {getFieldDecorator( 'bettingLowerLimit', {
                        rules: [{ required: true, message:"请输入自定义押注下限" }],
                        initialValue: componentsData.bettingLowerLimit
                        } )(
                          <InputNumber
                            style={{ width:350 }}
                            min={1}
                            formatter={limitDecimals}
                            parser={limitDecimals}
                            placeholder='不为零的正整数，不可大于等于自定义押注上限'
                          />
                        )}
                    </FormItem>
                    <FormItem label='自定义押注单位' {...formLayout}>
                      {getFieldDecorator( 'bettingUnit', {
                        rules: [{ required: true, message:"请输入自定义押注单位" }],
                        initialValue: componentsData.bettingUnit || 1
                        } )(
                          <InputNumber
                            style={{ width:350 }}
                            min={1}
                            formatter={limitDecimals}
                            parser={limitDecimals}
                            placeholder='请输入上限和下限的倍数'
                          />
                        )}
                    </FormItem>
                  </>
                :''
            }
          </Form>
        </Modal>
      </div>
    )
}

export default Form.create()( CustomIntegral );