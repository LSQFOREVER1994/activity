import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, Icon } from 'antd';
import PrizeTable from './PrizeTable';

import styles from './index.less';

/**
 * 奖品配置组件参数
 * @param dataKey 更新的参数名，不传默认prizes
 * @param changeValue 更新组件数据FUNC
 * @param componentsData 组件数据
 * @param maxPrizeNum 最大奖品限制，默认不限制
 * @param tableWithPosition 是否带奖项，默认false
 * @param tableTitle 奖品配置标题，默认‘奖品配置’
 * @param descriptionText 表格提示信息描述，默认空
 * @param noProbability 不需要概率 默认false
 * @param disabledThanks 禁用谢谢参与 默认false
 * @param iconType 图标样式的奖品弹窗
 */

const PrizeOption = props => {
  const { tableTitle = '奖品配置', componentsData, iconType } = props;
  const [modalVisible, setModalVisible] = useState( false );

  // 奖品表格弹窗
  const prizeModal = useMemo( () => {
    if( !modalVisible ) return null
    return (
      <Modal
        title={tableTitle}
        width={840}
        bodyStyle={{ padding: '20px' }}
        maskClosable={false}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible( false );
        }}
        footer={null}
      >
        <PrizeTable {...props} />
      </Modal>
    );
  }, [modalVisible, componentsData] );

  return (
    <div>
      {
        iconType ? (
          <div>
            <Icon
              type="gift"
              style={{ fontSize: 16, margin: '0 5px' }}
              onClick={() => setModalVisible( !modalVisible )}
            />
            {prizeModal}
          </div>

        ) : (
          <div className={styles.option_box}>
            <div className={styles.option_box_tit}>{tableTitle}</div>
            <Button type="primary" onClick={() => setModalVisible( !modalVisible )}>
              配置奖品
            </Button>
            {prizeModal}
          </div>
        )
      }
    </div>

  );
};

export const PrizeTableModal = ( props ) => {
  const { tableTitle = '奖品配置', modalVisible, setModalVisible } = props;

  return (
    <Modal
      title={tableTitle}
      width={840}
      bodyStyle={{ padding: '20px' }}
      maskClosable={false}
      visible={modalVisible}
      onCancel={() => {
        setModalVisible( false );
      }}
      footer={null}
    >
      <PrizeTable {...props} />
    </Modal>
  );
}

/**
 * 奖品配置v2使用
 * @param dataKey 更新的参数名，不传默认prizes
 * @param changeDomData 更新组件数据FUNC
 * @param domData 全部数据
 * @param eleObj 编辑组件数据
 * @param maxPrizeNum 最大奖品限制，默认不限制
 * @param tableWithPosition 是否带奖项，默认false
 * @param descriptionText 表格提示信息描述，默认空
 * @param noProbability 不需要概率 默认false
 * @param disabledThanks 禁用谢谢参与 默认false
 */
export const PrizeOptionSecondEdition = props => {
  const {
    dataKey,
    maxPrizeNum,
    tableWithPosition,
    descriptionText,
    eleObj,
    domData,
    changeDomData,
    noProbability,
    disabledThanks
  } = props;
  const changeValue = useCallback(
    ( list, updateKey ) => {
      const { elements } = domData;
      const elementsList = elements;
      const newEleObj = { ...eleObj, [updateKey]: [...list] }
      // 替换对应项
      const updateIdx = elementsList.findIndex( item => ( item.virtualId === newEleObj.virtualId || item.id === newEleObj.id ) )
      domData.elements[updateIdx] = newEleObj
      // 刷新总数据
      changeDomData( domData );

    },
    [domData]
  );
  return (
    <PrizeTable
      dataKey={dataKey}
      maxPrizeNum={maxPrizeNum}
      tableWithPosition={tableWithPosition}
      descriptionText={descriptionText}
      componentsData={eleObj}
      noProbability={noProbability}
      disabledThanks={disabledThanks}
      changeValue={changeValue}
    />
  );
};

export default PrizeOption;
