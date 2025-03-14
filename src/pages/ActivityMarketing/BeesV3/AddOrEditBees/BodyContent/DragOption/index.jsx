import React, { useState } from "react";
import { Tabs } from 'antd'
import styles from './index.less'
import foldImg from '../../../assets/img/fold.png'
import unfoldImg from '../../../assets/img/unfold.png'
import PageSetup from "./PageSetup";
import LayerManagement from './LayerManagement'
import PageManagement from './PageManagement'

const { TabPane } = Tabs;
const baseClass = 'dragOption'
const FOLD_WIDTH = 288
function DragOption() {
  const [fold, setFold] = useState( true )
  const [activeTabsKey, setActiveTabsKey] = useState( '1' )
  const handleClickFold = () => {
    setFold( !fold )
  }
  const changeTabs = ( key ) => {
    setActiveTabsKey( key )
  }
    return (
      <div className={styles[`${baseClass}Wrap`]}>
        <div
          className={styles[`${baseClass}Telescoping`]}
          onClick={handleClickFold}
        >
          <img src={fold ? foldImg : unfoldImg} alt="" />
        </div>
        <div
          style={{ width:fold ? FOLD_WIDTH : 0 }}
          className={styles[`${baseClass}TabsWrap`]}
        >
          <Tabs
            defaultActiveKey="1"
            tabBarGutter={10}
            activeKey={activeTabsKey}
            onChange={changeTabs}
          >
            <TabPane tab="页面设置" key="1">
              <PageSetup />
            </TabPane>
            <TabPane tab="图层管理" key="2">
              <LayerManagement />
            </TabPane>
            <TabPane tab="页面管理" key="3">
              <PageManagement changeTabs={changeTabs} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
}
export default DragOption
