import React, { PureComponent } from 'react'

class Iframe extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {}
  }

  componentDidMount() {
    window.addEventListener( 'message', this.listenIframe, false )
  }

  componentWillUnmount() {
    window.removeEventListener( 'message', this.listenIframe, false )
  }

  listenIframe = ( e ) => {
    const { getEQXiuOpus } = this.props;
    console.log( e.data );
    if ( e.data && e.origin !== 'https://open.eqxiu.cn' ) return;
    if ( e.data.eventType === 'save' || e.data.eventType === 'publish' || e.data.eventType === 'quit' ) {
      getEQXiuOpus( e.data.creationId );
    }
  }

  render() {
    const { iframeUrl } = this.props;
    return (
      <iframe
        title='编辑页面'
        src={iframeUrl}
        style={{ width: '100%', height: '90vh', border: 'none' }}
      />
    )
  }
}

export default Iframe;
