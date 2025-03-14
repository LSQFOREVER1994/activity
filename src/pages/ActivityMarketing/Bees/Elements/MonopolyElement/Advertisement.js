import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Collapse } from 'antd';
import Item from './Item';
import serviceObj from '@/services/serviceObj';

const { Panel } = Collapse;


const advertisement1 = `${serviceObj.defaultImagePath}licaijie/advertisement1.png`;
const advertisement2 = `${serviceObj.defaultImagePath}licaijie/advertisement2.png`;
const advertisement3 = `${serviceObj.defaultImagePath}licaijie/advertisement3.png`;

@connect()
@Form.create()
class Advertisement extends PureComponent {

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj, eleObj:{ imageElements=[] } } = this.props;
    // 编辑和新增状态的编辑都不走此流程
    if ( imageElements.length ) return;
    // 塞入默认值
    const defaultObj = {
      imageElements: [
        {
          name: "广告位1号",
          enable:true,
          url:advertisement1,
          clickEvent:{
            clickType:'NONE'
          },
        },
        {
          name: "广告位2号",
          enable:true,
          url: advertisement2,
          clickEvent:{
            clickType:'NONE'
          },
        },
        {
          name: "广告位3号",
          enable:true,
          url: advertisement3,
          clickEvent:{
            clickType:'NONE'
          },
        },
      ],
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

  // 更新列表数据
  updatePrizeListData = () => {
    const { list }=this.state;
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { luckyGrids: [...list] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }



  render() {
    const { eleObj, eleObj:{ imageElements }, changeDomData, domData={} }= this.props;

    return (
      <div style={{ margin:'20px 0' }}>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="广告位配置" key="1">
            <div style={{ color: '#f73232', fontSize: 12 }}>
              配置需要的广告位，若选择不启用则不显示该广告位，默认启用。
              广告位从下往上依次为1-3号
            </div>
            {
              imageElements && imageElements.length &&
              <div style={{ marginTop:20 }}>
                {
                  imageElements.map( ( info, index )=>(
                    <Item
                      domData={domData}
                      changeDomData={changeDomData}
                      eleObj={eleObj}
                      info={info}
                      itemIndex={index}
                      key={info.name}
                    />
                  ) )
                }
              </div>
            }

          </Panel>
        </Collapse>
      </div>
    )
  }

}

export default Advertisement;
