import React, { useMemo } from 'react';
import { Icon, Popover, Popconfirm, Button } from 'antd';
import styles from './templateManage.less';
import editTem from '@/assets/editTem.png';
import editTemplate from '@/assets/editTemplate.png';
import temMore from '@/assets/temMore.png';

function TemplateItem( props ) {
  const { item = {}, itemWidth, isLast, currentTabKey, authority, handleEditTemplate, addActivityTemp, userTemp, editTemp,
    intoCommonTemplate, delTemplate, onExportActivity } = props
  const { name, image, labels, useCount, isAddCard = false } = item
  const rendeCardItem = useMemo( () => {
    let cardItem
    if ( isAddCard ) {
      if ( currentTabKey === 'common' ) return null
      cardItem = (
        <div className={styles.templateItemAdd} style={{ width: itemWidth - 14, height: 1.5 * itemWidth, marginRight: 10 }}>
          <Button type="primary" icon='plus-circle' onClick={() => addActivityTemp()}>模板创建</Button>
        </div>
      )
    } else {
      cardItem = (
        <div className={styles.templateItem} style={{ width: itemWidth - 14, height: 1.5 * itemWidth, marginRight: isLast ? 0 : 10 }}>
          <div className={styles.templateItemName}>{name}</div>
          <div
            className={styles.templateImgBox}
            onClick={() => userTemp( item )}
          >
            <img src={image} alt="" />
          </div>
          <div className={styles.templateSetBox}>
            <div className={styles.templateItemTipsBox}>
              {labels &&
                labels.map( ( i ) => {
                  return <div className={styles.templateItemTips} key={i}>{i}</div>
                } )}
            </div>
            <div className={styles.useCount}>使用次数：{useCount}次</div>
            {( currentTabKey !== 'common' || authority ) &&
              <div className={styles.hoverWarp}>
                <div
                  className={styles.editBox}
                  onClick={() => handleEditTemplate( item )}
                >
                  <div className={styles.iconBox}>
                    <img src={editTem} alt="" />
                  </div>
                  <p style={{ fontSize: '12px' }}>编辑信息</p>
                </div>
                <div
                  className={styles.editBox}
                  onClick={() => editTemp( item )}
                >
                  <div className={styles.iconBox}>
                    <img src={editTemplate} alt="" />
                  </div>
                  <p style={{ fontSize: '12px' }}>编辑模板</p>
                </div>
                <div className={styles.editBox}>
                  <Popover
                    placement="rightTop"
                    content={
                      <div className={styles.templateEditboxMore}>
                        {currentTabKey !== 'common' && (
                          <span style={{ color: '#efb208' }} onClick={() => intoCommonTemplate( item )}>
                            添加至公共模板
                          </span>
                        )}
                        <span
                          style={{ color: '#efb208' }}
                          onClick={e => onExportActivity( e, item )}
                        >
                          导出模板配置
                        </span>
                        <span style={{ color: '#f5222d' }}>
                          <Popconfirm
                            title="确定删除该模版？"
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            onConfirm={() => delTemplate( item )}
                          >
                            <span>删除模板</span>
                          </Popconfirm>
                        </span>
                      </div>
                    }
                  >
                    <div className={styles.iconBox}>
                      <img src={temMore} alt="" />
                    </div>
                    <p style={{ fontSize: '12px' }}>更多</p>
                  </Popover>
                </div>
              </div>
            }
          </div>
        </div>
      )
    }
    return cardItem
  }, [item, itemWidth, isLast] );
  return rendeCardItem
}

export default TemplateItem;
