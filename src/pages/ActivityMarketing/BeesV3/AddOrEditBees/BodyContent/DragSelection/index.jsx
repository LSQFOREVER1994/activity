import React from 'react';
import { Tabs, Icon } from 'antd';
import ComponentsSvg from '../../../assets/svg/ComponentsSvg';
import ImageSvg from '../../../assets/svg/ImageSvg';
import styles from './index.less';
import ComponentList from './ComponentList';
import ImageList from './ImageList';

const bassClass = 'dragSelection';
const { TabPane } = Tabs;
function DragSelection() {
  const evalDragStart = ( data, e ) => {
    e.dataTransfer.setData( 'activityAddOrEditDrag', JSON.stringify( data ) )
  }
  // 拖拽结束删除存储数据
  const evalDragEnd = ( e ) => {
    e.dataTransfer.clearData( 'activityAddOrEditDrag' )
  }
  return (
    <div className={styles[`${bassClass}Wrap`]}>
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane
          tab={
            <div className={styles[`${bassClass}TabsTitle`]}>
              <Icon style={{ fontSize: 26 }} component={ComponentsSvg} />
              <p className={styles[`${bassClass}TabsTitleText`]}>组件</p>
            </div>
          }
          key="1"
        >
          <ComponentList
            evalDragStart={evalDragStart}
            evalDragEnd={evalDragEnd}
          />
        </TabPane>
        <TabPane
          tab={
            <div className={styles[`${bassClass}TabsTitle`]}>
              <Icon style={{ fontSize: 26 }} component={ImageSvg} />
              <p className={styles[`${bassClass}TabsTitleText`]}>图片</p>
            </div>
          }
          key="2"
        >
          <ImageList
            evalDragStart={evalDragStart}
            evalDragEnd={evalDragEnd}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
export default DragSelection;
