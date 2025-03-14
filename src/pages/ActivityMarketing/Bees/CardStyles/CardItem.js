/*
 * @Author: YANGJINGRONG
 * @Date: 2023-04-19 16:35:29
 * @Last Modified by: 绩牛信息 - YANGJINGRONG
 * @Last Modified time: 2023-05-16 20:37:30
 */

import React, { useState, useMemo, useRef } from 'react';
import { Button, Icon, Popover, Popconfirm } from 'antd';
import moment from 'moment';
import styles from './index.less';

const finish = require( '@/assets/finish.png' );
const ongoing = require( '@/assets/ongoing.png' );
const coverPictureV2 = require( '@/assets/coverPicture.png' );
const activityTime = require( '@/assets/activityTime.png' );


const scrollSpeed = 120; // 调整滑动速度

function CardItem( props ) {
  const { item = {}, itemWidth, isLast, jumpDataCenter, getRoleGroupList, openQRCodeModal, onCopyBees,
    handleAddTemplate, onOpenFeatureModal, onExportActivity, onDeleteBees, showAddActivityModal,
    onCooperateManager, onEditBees, getCurrentCollaborsInfo, onOpenHasDraftModal, activityStatesType } = props
  const { name, coverPicture, startTime, endTime, id, isAddCard = false, timeType, isPublish } = item
  const statusUrl = ( ( endTime == null || moment( endTime ) > moment() ) || !timeType )? ongoing : finish;
  const [showActivityEditBox, setShowActivityEditBox] = useState( false );
  const imgBoxRef = useRef( null );
  const imgRef = useRef( null );
  // 模版创建
  const addAativityTem = () => {
    const { history } = props;
    history.push( '/activityTemplate/template' )
  }

  const handleMouseEnter = () => {
    if( !imgBoxRef?.current || !imgRef?.current ) return;
    const maxScroll = imgBoxRef?.current?.scrollHeight - imgBoxRef?.current?.clientHeight;
    imgRef.current.style.transition = `all ${maxScroll / scrollSpeed}s linear`;
    imgRef.current.style.transform = `translateY(${-maxScroll}px)`;
  }


  const handleMouseLeave = () => {
    if( !imgRef?.current ) return;
    imgRef.current.style.transition = "transform 2s ease";
    imgRef.current.style.transform = `translateY(0px)`;
  }


  const rendeCardItem = useMemo( () => {
    let cardItem
    if ( isAddCard ) {
      cardItem = (
        <div className={styles.blockActivityCardAdd} style={{ width: itemWidth - 14, height: 1.5 * itemWidth, marginRight: 10 }}>
          <Button className={styles.add} icon="plus-circle" onClick={showAddActivityModal}>空白创建</Button>
          <Button type="primary" icon="plus-circle" onClick={addAativityTem}>模版创建</Button>
        </div>
      )
    } else {
      cardItem = (
        <div className={styles.blockActivityCard} style={{ width: itemWidth - 14, height: 1.5 * itemWidth, marginRight: isLast ? 0 : 10 }}>
          <div
            className={styles.blockActivityCardImg}
            ref={imgBoxRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={( e ) =>{
              if( activityStatesType !== 'PASS' ) return
              jumpDataCenter( e, item )
            }}
          >
            {activityStatesType === 'PENDING' && isPublish ? <div className={styles.pendingTip}>活动已发布，本次修改在审核中</div> : null}
            <img alt='' src={coverPicture || coverPictureV2} ref={imgRef}  />
            {/* <img className={styles.blockActivityCardStatus} alt='' src={statusUrl} /> */}
          </div>
          <div
            className={styles.blockActivityCardBottom}
            onMouseEnter={() => setShowActivityEditBox( true )}
            onMouseLeave={() => setShowActivityEditBox( false )}
          >
            <div className={styles.blockActivityCardBottomName}>{name}</div>
            <div className={styles.blockActivityCardBottomTime}>
              <img alt='' src={activityTime} />
              {( startTime && timeType ) ? `${moment( startTime ).format( 'YYYY.MM.DD' )}-` : ''}
              {( endTime && timeType ) ? moment( endTime ).format( 'YYYY.MM.DD' ) : '--'}
            </div>
            <div
              className={`${styles.activityEdit}
            ${( showActivityEditBox ) ? styles.showEditBox : ''}`}
            >
              <div className={styles.activityEditbox}>
                <div
                  className={styles.activityEditboxItem} 
                  onClick={() => {
                    if( activityStatesType === 'PASS' && item.draftState ){
                      onOpenHasDraftModal( item )
                      return
                    }
                    getCurrentCollaborsInfo( item.id, 'edit', () => onEditBees( { item } ) )
                  }}
                >
                  <Icon type="form" className={styles.editboxIcon} />
                  <div className={styles.activityEditboxText}>编辑</div>
                </div>
                <div className={styles.activityEditboxItem} onClick={( e ) => openQRCodeModal( e, item )}>
                  <Icon type="file-search" className={styles.editboxIcon} />
                  <div className={styles.activityEditboxText}>预览</div>
                </div>
                {
                  activityStatesType !== 'PENDING' ? 
                    <Popover
                      placement="rightTop"
                      content={
                        <div className={styles.activityEditboxMore}>
                          <span
                            style={{ color: '#1890ff' }}
                            onClick={( e ) => onCopyBees( e, item.id )}
                          >复制活动
                          </span>
                          <span
                            style={{ color: '#efb208' }}
                            onClick={( e ) => handleAddTemplate( e, item )}
                          >添加至模版
                          </span>
                          {
                        item.version === 'V2' &&
                        <>
                          <span
                            style={{ color: '#efb208' }}
                            onClick={( e ) => onOpenFeatureModal( e, item )}
                          >未来版本设置
                          </span>
                        </>
                      }
                          <span
                            style={{ color: '#efb208' }}
                            onClick={( e ) => onExportActivity( e, item )}
                          >
                        导出活动配置
                          </span>
                          <span
                            style={{ color: '#efb208' }}
                            onClick={( e ) => getRoleGroupList( id, 'cooperate', () => onCooperateManager( e, item, true ) )}
                          >
                        协作管理
                          </span>
                          <span style={{ color: '#f5222d' }}>
                            <Popconfirm
                              placement="top"
                              title={`是否确认删除:${name}`}
                              onConfirm={( e ) => getCurrentCollaborsInfo( id, 'delete', () => onDeleteBees( e, id ) )}
                              okText="是"
                              cancelText="否"
                            >
                              <span>删除活动</span>
                            </Popconfirm>
                          </span>
                        </div>
                  }
                    >
                      <div className={styles.activityEditboxItem}>
                        <Icon type="ellipsis" className={styles.editboxIcon} />
                        <div className={styles.activityEditboxText}>更多</div>
                      </div>
                    </Popover> : null
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
    return cardItem
  }, [item, showActivityEditBox, itemWidth, isLast] );



  return rendeCardItem
}

export default CardItem;
