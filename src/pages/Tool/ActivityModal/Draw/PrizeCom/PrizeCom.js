import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Radio } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';

const FormItem = Form.Item;

@connect()
@Form.create()
class PrizeCom extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };


  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }


  getValues = () =>{
    const { form } = this.props;
    let params={};
    let prizeObj = {};
    const { isLottery } = form.getFieldsValue();
    if( isLottery && this.prizeRef ){
      prizeObj = this.prizeRef.getValues();
    }
    params = Object.assign( {}, { isLottery }, prizeObj );
    return params
  }
  

  render() {
    const { form: { getFieldDecorator, getFieldValue }, data, onPreview } = this.props;

    return (
      <GridContent>
        <Form>
          <FormItem label='是否抽奖' {...this.formLayout}>
            {getFieldDecorator( 'isLottery', {
                rules: [{ required: true } ],
                initialValue: data.isLottery === undefined ? true : data.isLottery
              } )(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              )}
          </FormItem>
        </Form>
        {
          getFieldValue( 'isLottery' ) &&
          <PrizeTable
            prizes={data.prizes}
            onPreview={onPreview}
            onRef={( ref ) => { this.prizeRef = ref }}
          />
        }
      
      </GridContent>
    );
  }
}

export default PrizeCom;
