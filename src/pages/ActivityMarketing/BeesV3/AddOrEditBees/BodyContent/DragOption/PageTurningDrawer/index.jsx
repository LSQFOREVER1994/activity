/* eslint-disable react/no-array-index-key */
import React, { useState, useContext } from 'react';
import { Button, Drawer, Form, Radio, message } from 'antd'
import classNames from 'classnames';
import { CurrentPages, DomDataContext } from '../../../provider';
import animateList from '../pageTurningType';
import styles from './index.less'



// const { Option } = Select;

const baseClass = 'pageTurningDrawer';
const PageTurningDrawer = ( { visible, onClose, } ) => {
  const [currentPageData, changeCurrentPage] = useContext( CurrentPages );
  const [domData, changeDomData] = useContext( DomDataContext );
  const { pages } = domData;
  const { pageTurningMethod, pageTurningType } = currentPageData
  // const [activePage, setActivePage] = useState( currentPage )
  const [currentTurningMethod, setCurrentTurningMethod] = useState( pageTurningMethod )
  const [currentAnimate, setCurrentAnimate] = useState( pageTurningType )

  const changeTurningMethod = ( e ) => {
    const val = e?.target ? e.target.value : e;
    setCurrentTurningMethod( val )
  }

  // const changeActivePage = ( e ) => {
  //   const val = e?.target ? e.target.value : e;
  //   setActivePage( val )
  // }

  const applyAllPages = () => {
    if ( !currentTurningMethod || !currentAnimate ) {
      message.warning( '请选择页面翻页效果' )
      return
    }
    const newPages = pages.map( item => {
      return {
        ...item,
        enablePageTurning: true,
        pageTurningMethod: currentTurningMethod,
        pageTurningType: currentAnimate,
      }
    } )
    changeDomData( { ...domData, pages: newPages } )
    message.success( '应用成功' );
    onClose()
  }

  const changePageTurningValue = ( val, type ) => {
    currentPageData[type] = val;
    changeCurrentPage( currentPageData )
  }

  const onSave = () => {

    if ( !currentAnimate ) {
      message.warning( '请选择页面切换动画' )
      return;
    }
    changePageTurningValue( currentTurningMethod, 'pageTurningMethod' )
    changePageTurningValue( currentAnimate, 'pageTurningType' )
    onClose()
  }
  const { id } = currentPageData // 当前页面id

  return (
    <Drawer
      title='翻页动画设置'
      onClose={onClose}
      visible={visible}
      width="497px"
      className={styles[`${baseClass}Wrap`]}
      mask={false}
    >
      <div className={styles[`${baseClass}Box`]}>
        <div className={styles[`${baseClass}animateBox`]}>
          <div className={styles[`${baseClass}animate_settingBox`]}>
            <span>当前正在设置页面id:
              {/* <Select
                  value={activePage}
                  style={{ width:'70px', margin:'0 5px' }}
                  onChange={changeActivePage}
                >
                  {
                    pages.length && pages.map( ( item, index )=>(
                      <Option value={index} key={`${item}_${index}`}>{index+1}</Option>
                    ) )
                  }
                </Select> */}
              <span style={{ padding: '0 4px', color: '#000', fontSize: '20px' }}>{id}</span>
              的翻页动画
            </span>
            <Button
              className={styles[`${baseClass}BtnGolden`]}
              onClick={applyAllPages}
            >应用到全部页面
            </Button>
          </div>
          <div className={styles[`${baseClass}ListBox`]}>
            <div className={styles[`${baseClass}animateTitle`]}><h3>常规翻页</h3></div>
            <div className={styles[`${baseClass}pageTurningMethod`]}>
              <Form.Item>
                <Radio.Group
                  value={currentTurningMethod}
                  onChange={changeTurningMethod}
                >
                  <Radio value='UP_AND_DOWN'>上下翻页</Radio>
                  <Radio value='LEFT_AND_RIGHT'>左右翻页</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className={styles[`${baseClass}List`]}>
              {animateList.map( item => (
                <div
                  key={item.value}
                  className={classNames(
                    styles[`${baseClass}Item`],
                    currentAnimate === item.value ? styles[`${baseClass}Current_item`] : ''
                  )}
                  onClick={() => { setCurrentAnimate( item.value ) }}
                >{item.label}
                </div>
              ) )}
            </div>
          </div>
          <div className={styles[`${baseClass}SaveBox`]}>
            <div>
              <div>
                <Button
                  className={styles[`${baseClass}BtnGolden`]}
                  onClick={onSave}
                >保存
                </Button>
                <Button
                  className={styles[`${baseClass}BtnGrey`]}
                  onClick={onClose}
                >取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default PageTurningDrawer;
