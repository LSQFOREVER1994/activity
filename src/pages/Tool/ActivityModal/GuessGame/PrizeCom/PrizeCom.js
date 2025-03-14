import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';

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

  onPreview = () => {
    this.props.onPreview()
  }


  getValues = () => {
    const { form } = this.props;
    const data = form.getFieldsValue()

    // if (isLottery && isRelate) {
    //   data = form.getFieldsValue()
    // }
    // if (isLottery && !isRelate) {
    //   const prizeObj = this.prizeRef.getValues();
    //   data = Object.assign(prizeObj, { isLottery }, { isRelate })
    // }
    return data
  }

  getData = () => {
    const isError = true
    const prizeObj = this.prizeRef.getData();
    const data = Object.assign( prizeObj )
    return isError && data;
  }


  render() {
    const { data, onPreview } = this.props;
    return (
      <GridContent>
        <PrizeTable
          prizes={data.prizes}
          onPreview={onPreview}
          onRef={( ref ) => { this.prizeRef = ref }}
        />
      </GridContent>
    );
  }
}

export default PrizeCom;
