import React from 'react';
import { Drawer, Tabs } from 'antd';
import { animationClassData } from './animationClassData';
import styles from './index.less';

const { TabPane } = Tabs;
const baseClass = 'animationDrawer';
function AnimationDrawer( { visible, onClose, previewSingleAnimation, addOrEditAnimation } ) {
  return (
    <Drawer
      onClose={onClose} 
      visible={visible}
      width="490px"
      className={styles[`${baseClass}Wrap`]}
      mask={false}
    >
      <Tabs defaultActiveKey="1">
        {animationClassData.map( tabsItem => (
          <TabPane tab={tabsItem.label} key={tabsItem.type}>
            <div className={styles[`${baseClass}List`]}>
              {tabsItem.children.map( item => (
                <div
                  key={item.value}
                  className={styles[`${baseClass}Item`]}
                  onClick={addOrEditAnimation.bind( null, { ...item, type:tabsItem.type } )}
                  onMouseEnter={previewSingleAnimation.bind( null, item.value )}
                >{item.label}
                </div>
              ) )}
            </div>
          </TabPane>
        ) )}
      </Tabs>
    </Drawer>
  );
}

export default AnimationDrawer;
