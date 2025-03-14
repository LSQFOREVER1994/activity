import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Census from './EventInfo'

@connect( ( { statistics } ) => {
  return{
    appointAppData: statistics.appointAppData,
  }
} )
class Trends extends PureComponent {

  constructor( props ){
    super( props )
    const queryAppid = this.props.location.query.appid;
    const queryName = this.props.location.query.name;
    this. state={
      containerWidth: 0,
      queryAppid,
      queryName,
    }
  }

  componentDidMount(){
    window.onresize = () => this.getWindowSize();
    this.setState( {
      containerWidth: this.container.clientWidth,
    } );
  }

  getWindowSize = () =>{
    if( this.container ){
      this.setState( {
        containerWidth: this.container.clientWidth || 0,
      } );
    }
  }

  goProduct=()=>{
    window.history.go( -1 );
  }

  render() {
    const { containerWidth, queryAppid, queryName } = this.state;

    return (
      <div>
        <div style={{ cursor:'pointer', marginBottom:'20px' }} onClick={this.goProduct}>{`<`}&nbsp;返回&nbsp;</div>
        <div ref={( div ) => { this.container = div; }}>
          <Census containerWidth={containerWidth} appId={queryAppid} name={queryName} />
        </div>
      </div>
     
    );
  }
}

export default Trends;
