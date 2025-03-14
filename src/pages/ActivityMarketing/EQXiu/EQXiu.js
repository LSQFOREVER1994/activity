/* eslint-disable import/extensions */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';


@connect( ( { eqxiu } ) => {
  return {
    code: eqxiu.code,
  }
} )

class EQXiu extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      webPath: ''
    }
  }

  componentDidMount() {
    // this.getEqxiuLoginCode()
    window.addEventListener( 'message', this.listenIframe.bind( this ) )
  };

  componentWillUnmount() {
    window.removeEventListener( 'message', this.listenIframe.bind( this ) )
  }

  listenIframe = ( e ) => {
    if ( e.data && e.origin !== 'https://jiniu.eqxiu.cn' ) return;
    if ( e.data.eventType === 'quit' ) {
          this.setState( {
            webPath: ''
          }, () => this.getEqxiuLoginCode() )
    }
  }

  // 获取易企秀code
  getEqxiuLoginCode = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'eqxiu/getEqxiuLoginCode',
      payload: {},
      successFun: ( code ) => {
        if ( code ) {
          const url = `https://open.eqxiu.cn/embed/creation?secretId=34660X8&Authorization=${code}&type=design`
          this.setState( {
            webPath: url
          } )
        }
      }
    } );
  }


  render() {
    const { webPath } = this.state
    return (
      <GridContent>
        <Card
          bordered={false}
          title='海报管理'
          bodyStyle={{ padding: '10px' }}
        >
          <div>
            {webPath &&
              <iframe
                scrolling='auto'
                title='效果预览'
                frameBorder={0}
                src={webPath}
                ref={( iframe ) => { this.domIframe = iframe }}
                id='myframe'
                style={{ width: '100%', height: '80vh', }}
              />
            }
          </div>
        </Card>
      </GridContent>
    );
  };
}

export default EQXiu;
