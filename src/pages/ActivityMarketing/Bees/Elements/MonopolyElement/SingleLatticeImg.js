import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from'@/services/serviceObj';

const { Panel } = Collapse;
// const time = () => new Date().getTime();

const num = ()=> Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 );

const Arr = ()=> {
  const arr=[]
  for ( let i = 1; i<18; i+=1 ){
    arr.push( `${serviceObj.defaultImagePath}licaijie/${i}.png` )
  }
  // 初始化默认新增一个上传
  // arr.push( '' );
  return arr
}

@connect()
class SingleLatticeImg extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  // constructor( props ) {
  //   super( props );
  //   this.state = {
  //     imgList: props.eleObj.images ? props.eleObj.images : ,
  //   }
  // }

  componentWillMount() {
    this.initImgList()
  }

  // 初始化表格配置和表格数据
  initImgList = () => {
    // const { imgList } = this.state;
    const { domData, changeDomData, eleObj, eleObj:{ images=[] } } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( images.length ) return;
    // 塞入默认值
    const defaultObj = {
      images:Arr(),
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // // 更新列表数据
  // updatePrizeListData = () => {
  //   const { imgList }=this.state;
  //   const { domData = {}, changeDomData, eleObj = {} } = this.props;
  //   const elementsList = domData.elements ? domData.elements : []
  //   const newEleObj = Object.assign( eleObj, { images: [...imgList] } );
  //   // 替换对应项
  //   const newElementsList = elementsList.map( item => {
  //     return item.virtualId === newEleObj.virtualId ? newEleObj : item;
  //   } );
  //   // 刷新总数据
  //   const newDomData = Object.assign( domData, { elements: newElementsList } );
  //   changeDomData( newDomData );
  // }


  changeImage=( e, key )=>{
    const { domData = {}, changeDomData, eleObj = {}, eleObj:{ images } } = this.props;
    const list = images
    if( e ){
      list.splice( key, 1, e )
      //  判断是索引是数组的长度，则是新增
      if( key === images.length ) {
        list.splice( key, 0, e )
      }
    }else{
      list.splice( key, 1, '' )
    }

    const newList = []
    list.forEach( info => {
      if( info )newList.push( info )
    } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { images: [...newList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }


  render() {
    const { eleObj:{ images } } = this.props;

    return (
      <div style={{ margin:'20px 0' }}>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="单格图标配置" key="1">
            <div style={{ color: '#f73232', fontSize: '12px' }}>
              *最少格数17个，需全部上传图片，依次为1-17格
            </div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {
                images && images.map( ( url, index )=>(
                  <div style={{ margin:'20px' }} key={`${url} + ${num()}`}>
                    <UploadModal
                      value={url}
                      onChange={( e ) => this.changeImage( e, index )}
                    />
                  </div>
                ) )
              }
              {/* 额外新增上传 */}
              <div style={{ margin:'20px' }}>
                <UploadModal
                  key={images.length}
                  onChange={( e ) => this.changeImage( e, images.length )}
                />
              </div>
              <div
                style={{
                display:'flex',
                justifyContent:'center',
                flexDirection:'column',
                width: '180px',
                fontSize: 13,
                color: '#999',
              }}
              >
                <div>格式：jpg/jpeg/png</div>
                <div>建议尺寸：</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>

          </Panel>
        </Collapse>
      </div>
    )
  }

}

export default SingleLatticeImg;
