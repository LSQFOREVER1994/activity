import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Icon, Tooltip } from 'antd';
import { ChartCard } from '@/components/Charts';
// import numeral from 'numeral';


@connect(({ dashboard }) => ({
  goodsList: dashboard.goodsList,
}))

class SalesTotal extends PureComponent {
  state = {
    total: '',
  };

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/getSalesTotal',
      payload: {
        
        callFunc:(data) =>{
          this.setState({ total: data })
        }
      }
    })
  }

  render() {
    const { total } = this.state;
    return (
      <div>
        <ChartCard
          title="总销售额"
          action={
            <Tooltip title="所有商品历史销售总金额">
              <Icon type="info-circle-o" />
            </Tooltip>
        }
          total={() => (
            // <span style={{fontSize: '22px'}} dangerouslySetInnerHTML={{ __html: yuan(total) }} />
            <span style={{fontSize: '22px'}} dangerouslySetInnerHTML={{ __html: total }} />
        )}
          contentHeight={46}
        >
          <span />
        </ChartCard>
      </div>
          
      
    );
  }
}

export default SalesTotal;
