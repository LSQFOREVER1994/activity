import React, { useCallback, useContext, useRef, useState, useEffect } from 'react';
import { Button, Icon, Divider, Popconfirm, message, Popover, Form, Modal, Input } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import styles from './index.less';
import xdTitle from '@/assets/xdTitle.png'
import { title } from '@/defaultSettings';
import ActivitySettings from './ActivitySettings';
import LotterySettings from './LotterySettings';
import SharingSettings from './SharingSettings';
import ExamineSettings from './ExamineSettings';
import { CommonOperationFun, DomDataContext } from '../provider';
import { isContained } from '../../DataVerification'
import EditTags from '../../../TemplateManage/EditTag';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const modalTitleEnum = {
  1: '活动设置',
  2: '活动页面参与次数基本配置',
  3: '分享设置',
  4: '发布审批设置'
};

const baseClass = 'headerContent';
function HeaderContent( { closeModal, history, editTempStr, dispatch, domData, saveLoading, canSave } ) {
  const [, , isEditTemp] = useContext( DomDataContext )
  const { saveActivity, generateSnapshot } = useContext( CommonOperationFun );
  const [clickType, setClickType] = useState( 0 );
  const isLoading = useRef( false );
  const [preViewUrl, setPreVIewUrl] = useState( '' );
  const [editVisible, setEditVisible] = useState( false );
  const [addTempActivity, setAddTempActivity] = useState( '' );
  const [editTempItem, setEditTempItem] = useState( {} );
  const handleClickBtn = type => {
    setClickType( type );
  };

  const setIsLoading = ( res ) =>{
    isLoading.current = res;
  }

  const handleClickSignOut = () => {
    closeModal();
    if ( isEditTemp ) {
      sessionStorage.removeItem( 'editTempStr' );
      history.push( `/activityTemplate/template` );
    }
  };
  const handleVisibleChange = flag => {
    if ( flag ) return;
    setPreVIewUrl( '' );
  };

  // 关闭编辑弹框
  const onCloseEditModal = () => {
    setEditVisible( false );
    setAddTempActivity( '' );
    setEditTempItem( {} );
    setIsLoading( false );
  };
  // 添加模版
  const addToTemplate = () => {
    const { name } = editTempItem;
    if ( !name ) {
      message.error( '请输入模版名称' );
      return;
    }
    dispatch( {
      type: 'bees/addToTemplate',
      payload: {
        query: {
          ...editTempItem,
          activityConfig: addTempActivity,
        },
        successFun: () => {
          onCloseEditModal();
          // this.quit( true )
          sessionStorage.removeItem( 'editTempStr' );
          message.success( '添加成功' );
          history.push( `/activityTemplate/template` );
        },
      },
    } );
  };

  // 编辑模版
  const editTemplate = async editItem => {
    const editTempInfo = JSON.parse( editTempStr );
    await generateSnapshot();
    const DomDataConfig = { ...editItem, coverPicture: domData.pages[0]?.cover || '' };
    const newTempInfo = { ...editTempInfo, activityConfig: JSON.stringify( DomDataConfig ) };

    dispatch( {
      type: 'bees/editTemplate',
      payload: {
        ...newTempInfo,
      },
      callFunc: () => {
        message.success( '修改成功！' );
        onCloseEditModal();
        // this.quit( true )
        sessionStorage.removeItem( 'editTempStr' );
        setIsLoading( false );
        history.push( `/activityTemplate/template` );
      },
    } );
  };

  // 获取直播列表
  const getLiveList = () => {
    dispatch( {
      type: 'bees/getLiveList',
      payload: {
      },
    } );
  };

  // 新增模板
  const addTemplate = async editItem => {
    await generateSnapshot();
    const domDataConfig = { ...editItem, coverPicture: domData.pages[0]?.cover || '' };
    setAddTempActivity( JSON.stringify( { ...domDataConfig, version: 'V3' } ) );
    setEditVisible( true );
  };

  const handleClickSave = async type => {
    const flag = isContained( domData, [], ()=>{}, type !=='publish' );
    if( !flag ) return
    if ( preViewUrl ) return;
    let previewUrl;
    setIsLoading( true );
    if ( isEditTemp ) {
      // 模板编辑
      if ( editTempStr ) {
        editTemplate( domData );
      } else {
        addTemplate( domData );
      }
    } else {
      previewUrl = await saveActivity( type );
    }

    setIsLoading( false );
    if ( !previewUrl ) return;
    if ( type === 'preView' ) {
      setPreVIewUrl( previewUrl );
      return;
    }
    if ( type === 'close' || type === 'publish' ) {
      handleClickSignOut();
    }
  };
  const copyLink = ( e, publishLink ) => {
    e.stopPropagation();
    const tag = copy( publishLink );
    if ( tag ) {
      message.success( '复制链接成功' );
    } else {
      message.error( '复制失败，重新点击或手动复制' );
    }
  };

  // 编辑名称
  const editTemplateName = e => {
    const newEditItem = { ...editTempItem, name: e.target.value };
    setEditTempItem( newEditItem );
  };

  // 编辑模板标签
  const editTemplateTags = tags => {
    const newEditItem = { ...editTempItem, labels: tags };
    setEditTempItem( newEditItem );
  };

  const renderPreViewModal = useCallback( () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{ cursor: 'pointer', marginBottom: '0px', color: '#1890FF' }}
          onClick={e => {
            copyLink( e, preViewUrl );
          }}
        >
          <span style={{ marginRight: '10px' }}>点击一键复制活动地址</span>
          <Icon type="copy" style={{ color: '#1890FF' }} />
        </div>
        or
        <div style={{ marginBottom: '10px' }}>扫码打开</div>
        <div>
          <QRCode
            value={preViewUrl} // value参数为生成二维码的链接
            size={200} // 二维码的宽高尺寸
            fgColor="#000000"
          />
        </div>
      </div>
    );
  }, [preViewUrl] );


  useEffect( ()=>{
    getLiveList()
  }, [] )
  // 编辑模版弹框
  const renderEditModal = () => {
    const { name, labels = [] } = editTempItem;
    return (
      <Modal
        title="添加至模版"
        visible={editVisible}
        onCancel={onCloseEditModal}
        onOk={() => addToTemplate()}
      >
        <div>
          <FormItem required style={{ display: 'flex' }} label="模版名称" {...formLayout}>
            <Input type='text' placeholder="请输入名称" onChange={editTemplateName} value={name} maxLength={20} />
          </FormItem>
          <FormItem style={{ display: 'flex' }} label="模板标签" {...formLayout}>
            <EditTags tags={labels} changeTags={editTemplateTags} />
          </FormItem>
        </div>
      </Modal>
    );
  };
  return (
    <>
      <div className={styles[`${baseClass}LogoWrap`]}>
        <img src={xdTitle} alt="logo" style={{ width:'160px', height:'60px' }} />
      </div>
      <div className={styles[`${baseClass}CenterWrap`]}>
        <Button
          className={styles.btnGolden}
          onClick={() => {
            handleClickBtn( 1 );
          }}
        >
          活动设置
        </Button>
        <Button
          className={styles.btnGolden}
          onClick={() => {
            handleClickBtn( 2 );
          }}
        >
          活动抽奖逻辑设置
        </Button>
        <Button
          className={styles.btnGolden}
          onClick={() => {
            handleClickBtn( 3 );
          }}
        >
          分享设置
        </Button>
        <Button
          className={styles.btnGolden}
          onClick={() => {
            handleClickBtn( 4 );
          }}
        >
          发布审批设置
        </Button>
      </div>
      <div className={styles[`${baseClass}RightWrap`]}>
        {/* {!isEditTemp && (
          <Popover
            content={renderPreViewModal()}
            trigger="click"
            visible={!!preViewUrl}
            onVisibleChange={handleVisibleChange}
          >
            <Button
              className={styles.btnGrey}
              loading={saveLoading}
              onClick={() => {
                handleClickSave( 'preView' );
              }}
            >
              临时预览
            </Button>
          </Popover>
        )} */}

        {canSave ? (
          <Button
            className={styles.btnGolden}
            loading={saveLoading}
            onClick={() => {
            handleClickSave();
          }}
          >
          保存
          </Button>
        ) : null}

        {
         ( canSave && !isEditTemp )  ? 
          (
            <Popconfirm
              title='确定发布活动'
              onConfirm={() => {
              handleClickSave( 'publish' );
            }}
              okText="是"
              cancelText="否"
            >
              <Button
                className={styles.btnGolden}
                loading={saveLoading}
              >
            发布
              </Button>
            </Popconfirm>
          
        ) : null
        }
        {/* {!isEditTemp && (
          <Button
            className={styles.btnGrey}
            loading={isLoading.current}
            onClick={() => {
              handleClickSave( 'close' );
            }}
          >
            保存并退出
          </Button>
        )} */}
        <Popconfirm
          title={`确定退出编辑（未${
            isEditTemp ? '保存模板信息' : '保存活动'
          }，请勿退出，否则之前编辑的数据将会丢失）`}
          onConfirm={handleClickSignOut}
          okText="是"
          cancelText="否"
        >
          <Button className={styles.btnBlack}>退出</Button>
        </Popconfirm>
      </div>
      {isEditTemp && renderEditModal()}
      {!!clickType && (
        <div className={styles[`${baseClass}SettingsModal`]}>
          <div className={styles[`${baseClass}SettingsModalContainer`]}>
            <div className={styles[`${baseClass}SettingsModalTitle`]}>
              <span>{modalTitleEnum[clickType]}</span>
              <Icon
                type="close"
                style={{ fontSize: 20 }}
                onClick={() => {
                  handleClickBtn( 0 );
                }}
              />
            </div>
            <Divider />
            <div className={styles[`${baseClass}SettingsModalContent`]}>
              {/* 活动设置 */}
              {clickType === 1 && <ActivitySettings />}
              {/* 抽奖设置 */}
              {clickType === 2 && <LotterySettings />}
              {/* 分享设置 */}
              {clickType === 3 && <SharingSettings />}
              {/* 发布审批设置 */}
              {clickType === 4 && <ExamineSettings />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default connect( ( state ) => ( { 
  saveLoading: state.beesVersionThree.saveLoading 
} ) )( HeaderContent );
