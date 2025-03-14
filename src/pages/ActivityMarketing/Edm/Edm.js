
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

class Edm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {}
  }

  componentDidMount() {};


  render() {
    return (
      <GridContent>
        <Card
          bordered={false}
          title='微页面'
          bodyStyle={{ padding:'10px' }}
        >
          <div>
            <iframe
              scrolling='auto'
              title='效果预览'
              frameBorder={0}
              src="https://discover-test.jiniutech.com/edmNew/index.html"
              ref={( iframe ) => { this.domIframe = iframe }}
              id='myframe'
              style={{ width: '100%', height: '100vh', }}
            />
          </div>
        </Card>
      </GridContent>
    );
  };
}

export default Edm;
