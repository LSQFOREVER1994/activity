import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Popconfirm, Select } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import { featureTypes } from '../../../BeesEnumes';
import { DomDataContext, CurrentPages } from "../../provider";
import TableList from '@/components/TableMove';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const needRelevanceComponent = ['SEND_BULLET', 'SEND_COMMENT', 'SEND_OPPSSITE_COMMENT'];

const TabList = ( {
  changeValue, componentsData, form, dispatch, allActivityList, activityIdPageList
} ) => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
  const [tabItemModalVisible, setTabItemModalVisible] = useState( false );
  const [eidtTabItem, setEidtTabItem] = useState( {} );
  const [isEdit, setIsEdit] = useState( false );
  const { tabItems, mode } = componentsData;

  const [domData] = useContext( DomDataContext );
  const [currentPagesData] = useContext( CurrentPages );


  // 获取所有活动列表
  const getAllActivityList = () => {
    if ( allActivityList.length ) return
    dispatch( {
      type: 'beesVersionThree/getAllActivityList',
      payload: {},
    } )
  }

  useEffect( () => {
    getAllActivityList()
  }, [] )

  const setEditTabItemModal = ( item, index ) => {
    setEidtTabItem( { ...item, index } );
    setIsEdit( true );
    setTabItemModalVisible( true );
  }

  // 查询指定活动页面列表
  const getActivityIdPageList = ( activityId, callback ) => {
    setFieldsValue( { pageName:'' } )
    dispatch( {
      type: 'beesVersionThree/getActivityIdPageList',
      payload: {
        id: activityId
      },
      successFun: () => {
        if ( callback ) callback()
      }
    } )
  }

  // 弹框取消
  const onTabItemModalCancel = () => {
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        activityIdPageList: []
      }
    } )
    setTabItemModalVisible( false );
    setEidtTabItem( {} );
    setIsEdit( false );
  };


  // 编辑tab
  const onEditTabItem = ( e, item, index ) => {
    const { type, activityId } = item || {};
    if ( type === 'ACTIVITY' && activityId ) {
      getActivityIdPageList( activityId, setEditTabItemModal( item, index ) );
    } else {
      setEditTabItemModal( item, index )
    }
  };

  // 删除tab
  const onDeleteTabItem = index => {
    const newTabItems = [...tabItems];
    newTabItems.splice( index, 1 );
    changeValue( [...newTabItems], 'tabItems' );
    // 关闭弹框
    setTimeout( () => {
      onTabItemModalCancel();
    }, 200 );
  };

  // 弹框确定
  const onTabItemModalConfirm = () => {
    validateFields( ( err, values ) => {
      if ( err ) return;
      const { index } = eidtTabItem;
      const { type, action, elementId } = values;
      const Data = { ...values };
      if ( type === 'EVENT' && action ) {
        Data.event = {
          action: "action",
          params: { action, elementId }
        };
        delete Data.action
      }
      let newTabItems = tabItems;
      if ( index || index === 0 ) {
        // 编辑
        newTabItems.splice( index, 1, Data );
      } else {
        // 新增
        newTabItems = [...tabItems, Data];
      }
      changeValue( [...newTabItems], 'tabItems' );
      // 关闭弹框
      setTimeout( () => {
        onTabItemModalCancel();
      }, 100 );
    } )
  };

  const getCurrentPageBarrage = ( action ) => {
    const componentType = {
      SEND_BULLET: 'BARRAGE',
      SEND_COMMENT: 'NORMAL_COMMENT',
      SEND_OPPSSITE_COMMENT: 'OPPOSING_COMMENT'
    }
    const { componentData } = currentPagesData;
    return componentData?.length && componentData.filter( ( item ) => item.type === componentType[action] ) || [];
  }

  const clearPageInput = () => {
    setFieldsValue( {
      pageName:'',
      activityId:''
    } )
    setEidtTabItem( { ...eidtTabItem, pageName:'' } )
  }

  // Tab弹框
  const renderTabItemModal = () => {
    const modalFooter = {
      okText: '保存',
      onOk: onTabItemModalConfirm,
      onCancel: onTabItemModalCancel,
    };

    let events = ( eidtTabItem.event && eidtTabItem.event.params ) ? JSON.parse( JSON.stringify( eidtTabItem.event.params ) ) : {};
    if ( typeof events === 'string' ) {
      events = JSON.parse( events )
    }
    const { id } = currentPagesData
    const showPageEnum = ['CURRENT', 'ACTIVITY'];
    console.log( eidtTabItem, 'eidtTabItem' );
    
    return (
      <Modal
        maskClosable={false}
        title={`${isEdit ? '编辑' : '新增'}Tab`}
        width={840}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={tabItemModalVisible}
        {...modalFooter}
      >
        <Form>
          <FormItem label='标题' {...formLayout}>
            {getFieldDecorator( 'title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: eidtTabItem.title
            } )(
              <Input placeholder='请输入标题' />
            )}
          </FormItem>

          <FormItem label='选中状态图' {...formLayout}>
            {getFieldDecorator( 'selectedIcon', {
              rules: [{ required: true, message: '请上传选中状态图' }],
              initialValue: eidtTabItem.selectedIcon
            } )( <UploadModal /> )}
            <div
              style={{
                position: 'absolute',
                top: 0, left: '125px',
                width: '180px',
                fontSize: 13,
                color: '#999',
                lineHeight: 2,
                marginTop: '10px'
              }}
            >
              <div>格式：jpg/jpeg/png </div>
              <div>建议尺寸：100px*100px </div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem>

          {/* <FormItem label='未选中状态图' {...formLayout}>
            {getFieldDecorator( 'unSelectedIcon', {
              rules: [{ required: true, message: '请上传未选中状态图' }],
              initialValue: eidtTabItem.unSelectedIcon
            } )( <UploadModal /> )}
            <div
              style={{
                position: 'absolute',
                top: 0, left: '125px',
                width: '180px',
                fontSize: 13,
                color: '#999',
                lineHeight: 2,
                marginTop: '10px'
              }}
            >
              <div>格式：jpg/jpeg/png </div>
              <div>建议尺寸：100px*100px </div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem> */}

          <FormItem label='展示内容' {...formLayout}>
            {getFieldDecorator( 'type', {
              rules: [{ required: true, message: '请选择展示内容' }],
              initialValue: eidtTabItem.type
            } )(
              <Select placeholder='请选择展示内容' onChange={() => clearPageInput()}>
                <Option value='CURRENT'>当前活动</Option>
                {/* <Option value='ACTIVITY'>其他活动</Option> */}
                <Option value='LINK'>自定义链接</Option>
                <Option value='NONE'>无</Option>
                {/* <Option value='EVENT'>功能</Option> */}
              </Select>
            )}
          </FormItem>

          {
            getFieldValue( 'type' ) === 'CURRENT' &&
            <FormItem label='页面选择' {...formLayout}>
              {getFieldDecorator( 'pageName', {
                rules: [{ required: true, message: '请选择页面' }],
                initialValue: eidtTabItem.pageName !== undefined ? eidtTabItem.pageName : ''
              } )(
                <Select
                  showSearch
                  autoClearSearchValue
                  placeholder={`${( !domData.pages || !domData.pages.filter( i => i.id === id ).length )
                    ? '请先到页面管理配置或添加页面' : '请选择页面'}`}
                  optionFilterProp="children"
                  filterOption={( input, option ) =>
                    JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                >
                  {domData && domData.pages && domData.pages.length > 0 && domData.pages.map( ( item )=>{
                    const shouldRender = id !== item.id;
                    return shouldRender ? (
                      <Option value={item.id} key={item.id}>
                        {item.label || '页面'}
                        ({item.id})
                      </Option>
                    ) : null;
                  } )}
                </Select>
              )}
            </FormItem>
          }

          {
            getFieldValue( 'type' ) === 'ACTIVITY' &&
            <>
              <FormItem label='活动ID' {...formLayout}>
                {getFieldDecorator( 'activityId', {
                  rules: [{ required: true, message: '请选择活动ID' }],
                  initialValue: eidtTabItem.activityId
                } )(
                  <Select
                    showSearch
                    autoClearSearchValue
                    placeholder="请选择请选择活动ID"
                    onChange={( val ) => getActivityIdPageList( val )}
                    optionFilterProp="children"
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                  >
                    {
                      allActivityList && allActivityList.length > 0 && allActivityList.map( ( item ) => (
                        <Option key={item.id} value={item.id}>{item.name}（{item.id}）</Option>
                      ) )
                    }
                  </Select>
                )}
              </FormItem>

              {
               showPageEnum.includes( getFieldValue( 'type' ) )  && (
               <FormItem label='页面' {...formLayout}>
                 {getFieldDecorator( 'pageName', {
                  rules: [{ required: false, message: '请选择页面' }],
                  initialValue: eidtTabItem.pageName !== undefined ? eidtTabItem.pageName : ''
                } )(
                  <Select
                    showSearch
                    autoClearSearchValue
                    placeholder='请选择页面'
                    optionFilterProp="children"
                    filterOption={( input, option ) =>
                      JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                  >
                    {activityIdPageList && activityIdPageList.length > 0 && activityIdPageList.map(
                      item =>
                        id !== item.id && (
                          <Option value={item.id} key={item.id}>
                            {item.label || `页面`}
                            {`(${item.id})`}
                          </Option>
                        )
                    )}
                  </Select>
                )}
               </FormItem>
               )
             } 
            </>
          }

          {
            getFieldValue( 'type' ) === 'LINK' &&
            <FormItem label='自定义链接' {...formLayout}>
              {getFieldDecorator( 'content', {
                rules: [{ required: true, message: '请输入自定义链接' }],
                initialValue: eidtTabItem.content
              } )(
                <Input placeholder='请输入自定义链接' />
              )}
            </FormItem>
          }
          {
            getFieldValue( 'type' ) === 'EVENT' &&
            <FormItem label='选择功能' {...formLayout}>
              {getFieldDecorator( 'action', {
                rules: [{ required: true, message: '请选择功能' }],
                initialValue: events.action
              } )(
                <Select placeholder='请选择功能' onChange={() => setFieldsValue( { elementId: null } )}>
                  {
                    featureTypes.map( info => (
                      <Option value={info.key} key={info.key}>{info.value}</Option>
                    ) )
                  }
                </Select>
              )}
            </FormItem>
          }
          {
           getFieldValue( 'type' ) === 'EVENT' && needRelevanceComponent.includes( getFieldValue( 'action' ) || "" ) && (
           <Form.Item label="关联组件" {...formLayout}>
             {getFieldDecorator( 'elementId', {
                  rules: [{ required: true, message: '请选择关联组件' }],
                  initialValue: events.elementId
                } )(
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    showSearch
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                  >
                    {getCurrentPageBarrage( getFieldValue( 'action' ) ).map( item => (
                      <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                        {`${item.label}(${item.id})`}
                      </Option>
                    ) )}
                  </Select>
                )}
           </Form.Item>
            )
          }

        </Form>
      </Modal>
    );
  };

  const columns = [
    {
      title: <span>标题</span>,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: <span style={{ textAlign: 'center' }}>操作</span>,
      dataIndex: 'id',
      width: 100,
      render: ( id, item, index ) => (
        <div>
          <span
            style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
            onClick={e => onEditTabItem( e, item, index )}
          >
            编辑
          </span>
          <Popconfirm
            placement="top"
            title="是否确认删除该条内容"
            onConfirm={() => onDeleteTabItem( index )}
            okText="是"
            cancelText="否"
          >
            <span style={{ cursor: 'pointer', color: '#f5222d' }}>删除</span>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const tableStting = {
    size: "small",
    key: "row",
    bordered: null,
    columns,
    pagination: false,
  }

  return (
    <>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
          <span className={styles.labelText}>
            <span>*</span>Tab列表
          </span>
        </div>
        <TableList
          listTypeStr="tabItems"
          dataSource={tabItems}
          tableStting={tableStting}
          changeValue={changeValue}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10 }}
          icon="plus"
          onClick={() => setTabItemModalVisible( true )}
        >
          添加Tab
        </Button>
      </div>
      {renderTabItemModal()}
    </>
  );
};

const tabProps = ( { beesVersionThree } ) => ( {
  allActivityList: beesVersionThree.allActivityList,
  activityIdPageList: beesVersionThree.activityIdPageList,
} );

export default Form.create( { name: 'beesVersionThree' } )( connect( tabProps )( TabList ) );
