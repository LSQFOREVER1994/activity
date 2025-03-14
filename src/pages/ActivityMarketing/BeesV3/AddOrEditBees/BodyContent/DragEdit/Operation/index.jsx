import React, { useContext, useMemo, useState } from 'react'
import { Tooltip, Popover, Switch, Icon, Divider } from 'antd'
import styles from './index.less'
import revokeImg from '../../../../assets/img/revoke.png'
import revokeActiveImg from '../../../../assets/img/revokeActive.png'
import recoveryImg from '../../../../assets/img/recovery.png'
import recoveryActiveImg from '../../../../assets/img/recoveryActive.png'
import keyboardImg from '../../../../assets/img/keyboard.png'
import gridManagementImg from '../../../../assets/img/gridManagement.png'
import { CommonOperationFun } from '../../../provider'

const keyboardDetailList = [
  {
    left: '保存',
    right: 'Ctrl + S'
  },
  {
    left: '全选',
    right: 'Ctrl + A'
  },
  {
    left: '复制',
    right: 'Ctrl + C'
  },
  {
    left: '剪切',
    right: 'Ctrl + X'
  },
  {
    left: '粘贴',
    right: 'Ctrl + V'
  },
  {
    left: '删除',
    right: 'Delete'
  },
  {
    type: 'line',
    id: 7
  },
  {
    left: '恢复',
    right: 'Ctrl + Y'
  },
  {
    left: '撤销',
    right: 'Ctrl + Z'
  },
  {
    type: 'line',
    id: 10
  },
  // {
  //   left: '上移',
  //   right: 'Ctrl + L'
  // },
  // {
  //   left: '下移',
  //   right: 'Ctrl + K'
  // },
  {
    left: '放大画布',
    right: 'Ctrl + ➕/滚轮上滑'
  },
  {
    left: '缩小画布',
    right: 'Ctrl + ➖/滚轮下滑'
  },
]
function Operation( { changeRulerGrid, changeScaling, scaling } ) {
  const {
    editAreaUndo,
    editAreaRecovery,
    firstRecord,
    lastRecord,
    generateSnapshot
  } = useContext( CommonOperationFun )
  const [keyboardVisible, setKeyboardVisible] = useState( false )
  // 快捷键气泡显示
  const handleClickKeyboard = ( visible ) => {
    setKeyboardVisible( visible )
  }
  const renderGridManagementDetail = useMemo( () => {
    return (
      <>
        <div className={styles.gridManagementDetailItem}>
          <h4>标尺</h4>
          <Switch
            size="small"
            defaultChecked
            onChange={( flag ) => changeRulerGrid( { ruler: flag } )}
          />
        </div>
        <div className={styles.gridManagementDetailItem}>
          <h4>网格</h4>
          <Switch
            size="small"
            defaultChecked
            onChange={( flag ) => changeRulerGrid( { grid: flag } )}
          />
        </div>
      </>
    )
  }, [changeRulerGrid] )
  const renderKeyboardDetail = useMemo( () => {
    return (
      <>
        <ul className={styles.renderKeyboardDetailList}>
          {
            keyboardDetailList.map( ( item ) => (
              item.type === 'line' ?
                ( <Divider style={{ margin: 0 }} key={item.id} /> ) : (
                  <li
                    className={styles.renderKeyboardDetailItem}
                    key={item.left}
                  >
                    <span>{item.left}</span>
                    <span>{item.right}</span>
                  </li>
                )
            ) )
          }

        </ul>
      </>
    )
  }, [] )
  return (
    <div className={styles.operationWrap}>
      <ul className={styles.operationList}>
        <li className={styles.operationItem} onClick={editAreaUndo} style={{ cursor: firstRecord ? 'no-drop' : 'pointer' }}>
          <Tooltip title='撤销' placement="right">
            <img src={firstRecord ? revokeImg : revokeActiveImg} alt="" />
          </Tooltip>
        </li>
        <li className={styles.operationItem} onClick={editAreaRecovery} style={{ cursor: lastRecord ? 'no-drop' : 'pointer' }}>
          <Tooltip title='恢复' placement="right">
            <img src={lastRecord ? recoveryImg : recoveryActiveImg} alt="" />
          </Tooltip>
        </li>
        <li className={styles.operationItem}>
          <Popover
            content={renderKeyboardDetail}
            trigger="click"
            placement="left"
            title={
              <>
                <span>快捷键</span>
                <Icon type="close" onClick={() => handleClickKeyboard( false )} />
              </>
            }
            overlayClassName={styles.keyboardPopover}
            visible={keyboardVisible}
            onVisibleChange={handleClickKeyboard}
          >
            <Tooltip title='快捷键' placement="right">
              <img src={keyboardImg} alt="" />
            </Tooltip>
          </Popover>

        </li>
        <li className={styles.operationItem}>
          <Popover
            content={renderGridManagementDetail}
            trigger="click"
            placement="left"
          >
            <Tooltip title='标尺网格开关' placement="right">
              <img src={gridManagementImg} alt="" />
            </Tooltip>
          </Popover>

        </li>
        {/* <li className={styles.operationItem} onClick={generateSnapshot.bind( null, true )}>
          <Tooltip title='更新预览图' placement="right">
            <Icon type="camera" style={{ fontSize: 24 }} />
          </Tooltip>
        </li> */}
      </ul>
      <div className={styles.operationScale}>
        <Icon type="plus" onClick={() => changeScaling( '+' )} />
        <p>{scaling}%</p>
        <Icon type="minus" onClick={() => changeScaling( '-' )} />
      </div>
    </div>
  )
}
export default Operation
