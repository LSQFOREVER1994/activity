import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts';

class Innerlabel extends React.PureComponent {
  state = {
    minWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  }

  componentDidMount() {
    window.onresize = this.getWidth
  }

  getWidth = () => {
    this.setState( {
      minWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    } )
  }

  render() {
    const { percentList, fetchProductMassage } = this.props;
    const { minWidth } = this.state;
    const data = [
      {
        item: '今日支付成功订单额',
        count: percentList.FINISH ? percentList.FINISH : 0,
        percent: percentList.FINISH ? ( percentList.FINISH ) / 100 : 0,
      },
      {
        item: '今日待支付订单额',
        count: percentList.WAITING_PAY ? percentList.WAITING_PAY : 0,
        percent: percentList.WAITING_PAY ? ( percentList.WAITING_PAY ) / 100 : 0,
      },
      {
        item: '今日退款订单额',
        count: percentList.REFUNDED ? percentList.REFUNDED : 0,
        percent: percentList.REFUNDED ? ( percentList.REFUNDED ) / 100 : 0,
      },
    ];

    const cols = {
      percent: {
        formatter: val => ( val = `${val * 100}%`.toFixed( 2 ) ),
      },
    };
    return (
      <div>
        <Chart
          height={300}
          data={data}
          scale={cols}
          padding={[20, 10, 140, 0]}
          forceFit
          onPlotClick={( ev ) => {
            const item = ev.data ? ev.data._origin.item : "今日支付成功订单额";
            fetchProductMassage( item )
          }}
        >
          <Coord type="theta" radius={0.8} />
          <Axis name="percent" />
          <Legend
            position="bottom"
            textStyle={{
              fontSize: minWidth >= 1400 ? '12' : '11', // 文本大小
            }}
          />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              ( item, percent ) => {
                percent = `${percent * 100}%`;
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          />
        </Chart>
      </div>
    );
  }

}

export default Innerlabel
