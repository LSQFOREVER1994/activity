/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  Collapse,
  Row,
  Col,
  InputNumber,
  Slider,
  DatePicker,
  TimePicker,
  Switch,
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { SketchPicker } from 'react-color';
import styles from './index.less';
import ComponentsOption from '../../../../ComponentsOption';
import { DomDataContext, ComponentsDataContext, CurrentPages } from '../../../../provider';
import NoSuspend from '@/assets/noSuspend.png'
import TopSuspend from '@/assets/topSuspend.png'
import BottomSuspend from '@/assets/BottomSuspend.png'


const { Option } = Select;
const { Panel } = Collapse;
const diyOptions = [
  { label: '不支持微信打开', value: 'noSupportWx' },
  { label: '需原生APP打开', value: 'openByApp' },
];
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const needRelevanceComponent = ['SEND_BULLET', 'SEND_COMMENT', 'SEND_OPPSSITE_COMMENT']
// const formLayout2 = {
//   labelCol: { span: 4 },
// };
const formLayout3 = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const splitString = ( str, current ) => {
  if ( !str ) return undefined
  const arr = str.split( ' ' );
  if ( current === 3 ) {
    return arr[current];
  }
  return parseInt( arr[current], 10 )
}


const arrayToString = ( arr ) => {
  return arr.reduce( ( prev, cur ) => {
    return `${prev} ${cur}`;
  } )
}

const baseClass = 'componentSettings';
function ComponentSettings( { functionConfig } ) {
  const [domData, _, isEditTemp] = useContext( DomDataContext );
  const [componentsData, changeValue] = useContext( ComponentsDataContext );
  const { label, type, events, style = {}, suspendMode, advancedSetting } = componentsData;
  const [showSketchPicker, setShowSketchPicker] = useState( 0 );
  // const [suspendModeIcon, SetSuspendModeIcon] = useState( suspendMode || "NONE" )
  const [currentPageData] = useContext( CurrentPages );
  const { id } = currentPageData; // 当前页面id
  const CurrentComponentsOption = ComponentsOption[type];
  const {
    default: Element,
    SET_JUMP,
    ADVANCED_SETTING,
    HIDE_TEXT_COLOR = false,
    //  SUSPENSION
  } = CurrentComponentsOption || {};

  const getCurrentPageBarrage = ( action ) => {
    const componentType = {
      SEND_BULLET: 'BARRAGE',
      SEND_COMMENT: 'NORMAL_COMMENT',
      SEND_OPPSSITE_COMMENT: 'OPPOSING_COMMENT'
    }
    const { componentData } = currentPageData;
    return componentData?.length && componentData.filter( ( item ) => item.type === componentType[action] ) || [];
  }


  const changeBoxShadow = ( e, current ) => {
    let val
    if ( current === 3 ) {
      const { r, g, b, a } = e.rgb;
      val = `rgba(${r},${g},${b},${a})`
    } else {
      val = `${e?.target ? e?.target?.value : e}px`
    }
    // const arr = style?.boxShadow?.split( ' ' ) || [];
    const arr = style?.boxShadow?.split( ' ' ) || ['0px', '0px', '0px', 'rgba(0,0,0,1)'];
    arr[current] = val;
    const newArr = Array.from( { length: arr.length }, ( item, index ) => ( arr[index] === undefined ? '' : arr[index] ) );
    const result = arrayToString( newArr );
    changeValue( result, 'style.boxShadow' )
  }

  const getJSONData = () => {
    try {
      return JSON.parse( events[0]?.params?.action || null );
    } catch ( error ) {
      return functionConfig.find( item => item.parameter === events[0]?.params?.action ) || "";
    }
  }

  const renderSetJump = () => {
    const linkRestrictions = [];
    if ( events?.[0]?.params ) {
      const { noSupportWx, openByApp } = events?.[0]?.params;
      if ( noSupportWx ) {
        linkRestrictions.push( 'noSupportWx' );
      }
      if ( openByApp ) {
        linkRestrictions.push( 'openByApp' );
      }
    }
    return (
      <>
        <FormItem required label="设置跳转">
          <Radio.Group
            onChange={e => {
              changeValue( e, 'events[0].action' );
            }}
            value={events?.[0]?.action || 'none'}
          >
            <Radio value="none"> 无 </Radio>
            <Radio value="action"> 功能 </Radio>
            <Radio value="pageTo"> 页面 </Radio>
            <Radio value="href"> 自定义链接 </Radio>
          </Radio.Group>
        </FormItem>
        {events?.[0]?.action === 'action' && (
          <Form.Item label="跳转" layout="vertical">
            <Select
              allowClear
              value={getJSONData()?.parameter}
              style={{ width: '100%' }}
              showSearch
              onChange={e => {
                if ( needRelevanceComponent.includes( e ) ) changeValue( '', 'events[0].params.id' )
                changeValue( JSON.stringify( functionConfig.find( item => item.parameter === e ) ), 'events[0].params.action' )
              }}
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}

            >
              {
                functionConfig.map( item => (
                  <Option key={item.id} value={item.parameter}>{item.name}</Option>
                ) )
              }
            </Select>
          </Form.Item>
        )}
        {
          events?.[0]?.action === 'action' && needRelevanceComponent.includes( getJSONData()?.parameter || "" ) && (
            <Form.Item label="关联组件" layout="vertical">
              <Select
                allowClear
                value={events[0]?.params?.id}
                style={{ width: '100%' }}
                showSearch
                getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                onChange={e => {
                  changeValue( e, 'events[0].params.id' )
                }}
              >
                {getCurrentPageBarrage( getJSONData()?.parameter ).map( item => (
                  <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                    {`${item.label}(${item.id})`}
                  </Option>
                ) )}
              </Select>
            </Form.Item>
          )
        }
        {events?.[0]?.action === 'pageTo' && (
          <Form.Item label="跳转" layout="vertical">
            <Select
              allowClear
              value={events[0]?.params?.pageTo}
              style={{ width: '100%' }}
              onChange={e => changeValue( e, 'events[0].params.pageTo' )}
              getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
              showSearch
              optionFilterProp="children"
              filterOption={( input, option ) =>
                JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
            >
              {domData.pages.map(
                item =>
                  item.id !== id && (
                    <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                      {item.label || `页面`}
                      ({item.id})
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>
        )}
        {events?.[0]?.action === 'href' && (
          <>
            <FormItem label="端内链接">
              <Input
                value={events[0]?.params?.link}
                onChange={e => {
                  changeValue( e, 'events[0].params.link' );
                }}
                maxLength={5000}
              />
            </FormItem>
            <FormItem label="端外链接">
              <Input
                value={events[0]?.params?.outLink}
                onChange={e => {
                  changeValue( e, 'events[0].params.outLink' );
                }}
              />
            </FormItem>
            {/* <Form.Item label="链接限制">
              <Checkbox.Group
                options={diyOptions}
                value={linkRestrictions}
                onChange={e => {
                  diyOptions.forEach( item => {
                    changeValue( e.includes( item.value ), `events[0].params.${item.value}` );
                  } );
                }}
              />
            </Form.Item> */}
          </>
        )}
      </>
    );
  };
  const renderSizeAndLocation = () => {
    return (
      <>
        <Row type="flex" justify="space-between" style={{ marginBottom: 10 }}>
          <Col span={12} className={styles[`${baseClass}SizeAndLocationCol`]}>
            <span>位置X</span>
            <InputNumber
              value={style.left}
              onChange={e => {
                changeValue( e, 'style.left' );
              }}
            />
            <span>px</span>
          </Col>
          <Col span={12} className={styles[`${baseClass}SizeAndLocationCol`]}>
            <span>位置Y</span>
            <InputNumber
              value={style.top}
              onChange={e => {
                changeValue( e, 'style.top' );
              }}
            />
            <span>px</span>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" style={{ marginBottom: 10 }}>
          <Col span={12} className={styles[`${baseClass}SizeAndLocationCol`]}>
            <span>组件宽度</span>
            <InputNumber
              value={style.width}
              onChange={e => {
                changeValue( e, 'style.width' );
              }}
            />
            <span>px</span>
          </Col>
          <Col span={12} className={styles[`${baseClass}SizeAndLocationCol`]}>
            <span>组件高度</span>
            <InputNumber
              value={style.height}
              onChange={e => {
                changeValue( e, 'style.height' );
              }}
            />
            <span>px</span>
          </Col>
        </Row>
        <div className={styles[`${baseClass}SetSuspendMode`]}>
          <span style={{ paddingLeft: '16px' }}>悬浮方式</span>
          <div className={styles[`${baseClass}SuspendModeIcon`]}>
            <div
              className={suspendMode === 'NONE' || !suspendMode ? styles[`${baseClass}SuspendModeCurrendIcon`] : ''}
              onClick={() => { changeValue( 'NONE', 'suspendMode' ) }}
            >
              <img src={NoSuspend} alt="" />
            </div>
            <div
              className={suspendMode === 'TOP' ? styles[`${baseClass}SuspendModeCurrendIcon`] : ''}
              onClick={() => { changeValue( 'TOP', 'suspendMode' ) }}
            >
              <img src={TopSuspend} alt="" />
            </div>
            <div
              className={suspendMode === 'BOTTOM' ? styles[`${baseClass}SuspendModeCurrendIcon`] : ''}
              onClick={() => { changeValue( 'BOTTOM', 'suspendMode' ) }}
            >
              <img src={BottomSuspend} alt="" />
            </div>
          </div>
        </div>
      </>
    );
  };
  const renderGeneralProperties = () => {
    return (
      <>
        <Row style={{ marginBottom: 10 }}>
          <Col className={styles[`${baseClass}BorderRadiusTitle`]} span={5}>圆角值:</Col>
          <Col span={19}>
            <Row className={styles[`${baseClass}BorderRadius`]}>
              <Col span={12}>
                <InputNumber
                  value={style.borderTopLeftRadius || 0}
                  onChange={e => {
                    changeValue( e, 'style.borderTopLeftRadius' );
                  }}
                />
                <span className={styles[`${baseClass}BorderRadiusSuffix`]}>px</span>
              </Col>
              <Col span={12}>
                <InputNumber
                  value={style.borderTopRightRadius || 0}
                  onChange={e => {
                    changeValue( e, 'style.borderTopRightRadius' );
                  }}
                />
                <span className={styles[`${baseClass}BorderRadiusSuffix`]}>px</span>
              </Col>
            </Row>
            <Row className={styles[`${baseClass}BorderRadius`]}>
              <Col span={12}>
                <InputNumber
                  value={style.borderBottomLeftRadius || 0}
                  onChange={e => {
                    changeValue( e, 'style.borderBottomLeftRadius' );
                  }}
                />
                <span className={styles[`${baseClass}BorderRadiusSuffix`]}>px</span>
              </Col>
              <Col span={12}>
                <InputNumber
                  value={style.borderBottomRightRadius || 0}
                  onChange={e => {
                    changeValue( e, 'style.borderBottomRightRadius' );
                  }}
                />
                <span className={styles[`${baseClass}BorderRadiusSuffix`]}>px</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <FormItem label="背景色" {...formLayout}>
          <>
            <div
              className={styles[`${baseClass}PreviewColor`]}
              onClick={() => {
                setShowSketchPicker( 1 );
              }}
            >
              <div style={{ backgroundColor: style.backgroundColor }} />
            </div>
            {showSketchPicker === 1 && (
              <>
                <div
                  onClick={() => {
                    setShowSketchPicker( 0 );
                  }}
                  className={styles.sketchPickerMask}
                />
                <div style={{ position: 'relative', zIndex: 999 }}>
                  <SketchPicker
                    width="230px"
                    color={style?.backgroundColor || undefined}
                    onChange={e => {
                      const { r, g, b, a } = e.rgb;
                      changeValue( `rgba(${r},${g},${b},${a})`, 'style.backgroundColor' )
                    }}
                  />
                </div>
              </>
            )}
          </>
        </FormItem>
        <FormItem label="透明度" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Row>
            <Col span={12}>
              <div className={styles[`${baseClass}OpcityBox`]}>
                <Slider
                  min={0}
                  max={100}
                  value={style.opacity * 100}
                  onChange={e => {
                    changeValue( e / 100, 'style.opacity' );
                  }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <InputNumber
                  min={0}
                  max={100}
                  value={style.opacity * 100}
                  onChange={e => {
                    changeValue( e / 100, 'style.opacity' );
                  }}
                  style={{ width: '100px', marginLeft: '10px' }}
                />
                <span>&ensp;%</span>
              </div>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="旋转" {...formLayout}>
          <InputNumber
            value={style.rotate}
            onChange={e => {
              const val = e >= 360 ? 360 - e : e;
              changeValue( val, 'style.rotate' );
            }}
          />
          <span>&ensp;度</span>
        </FormItem>
        {!HIDE_TEXT_COLOR &&
          <FormItem label="文字颜色" {...formLayout} labelCol={{ span: 6 }}>
            <div
              className={styles[`${baseClass}PreviewColor`]}
              onClick={() => {
                setShowSketchPicker( 2 );
              }}
            >
              <div style={{ backgroundColor: style.textColor || 'transparent' }} />
            </div>
            {showSketchPicker === 2 && (
              <>
                <div
                  onClick={() => {
                    setShowSketchPicker( 0 );
                  }}
                  className={styles.sketchPickerMask}
                />
                <div style={{ position: 'relative', zIndex: 999 }}>
                  <SketchPicker
                    width="230px"
                    disableAlpha
                    color={style?.textColor || undefined}
                    onChange={e => {
                      const { r, g, b, a } = e.rgb;
                      changeValue( `rgba(${r},${g},${b},${a})`, 'style.textColor' )
                    }}
                  />
                </div>
              </>
            )}
          </FormItem>}
        <FormItem label="描边" {...formLayout}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={styles[`${baseClass}PreviewColor`]}
                style={{ marginRight: '20px', padding: '5px', height: '30px', marginTop: '5px' }}
                onClick={() => { setShowSketchPicker( 6 ) }}
              >
                <div style={{ backgroundColor: style.borderColor || 'rgba(0,0,0,1)' }} />
              </div>
              <InputNumber
                style={{ height: '30px', marginTop: '5px' }}
                value={style.borderWidth || 0}
                min={0}
                onChange={( e ) => { changeValue( e, 'style.borderWidth' ); changeValue( 'solid', 'style.borderStyle' ) }}
              />
            </div>
            {showSketchPicker === 6 && (
              <>
                <div
                  onClick={() => {
                    setShowSketchPicker( 0 );
                  }}
                  className={styles.sketchPickerMask}
                />
                <div style={{ position: 'relative', zIndex: 999 }}>
                  <SketchPicker
                    width="230px"
                    color={style?.borderColor || 'rgba(0,0,0,1)'}
                    onChange={e => {
                      const { r, g, b, a } = e.rgb;
                      changeValue( `rgba(${r},${g},${b},${a})`, 'style.borderColor' )
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </FormItem>
        <FormItem>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px', color: '#000000D9' }}>
            <span>阴影</span>
            <Switch
              checked={style.openBoxShadow || false}
              onChange={( e ) => {
                changeValue( e, 'style.openBoxShadow' )
              }}
            />
          </div>
          {
            style.openBoxShadow && (
              <>
                <Row style={{ marginBottom: 10, paddingLeft: 50 }}>
                  <Col span={20}>
                    <Row className={styles[`${baseClass}BoxShadow`]}>
                      <Col span={10}>
                        <span className={styles[`${baseClass}BoxShadowSuffix`]}>位置X</span>
                        <InputNumber
                          style={{ width: '50%' }}
                          value={splitString( style.boxShadow, 0 ) || 0}
                          onChange={e => changeBoxShadow( e, 0 )}
                        />
                      </Col>
                      <Col span={10}>
                        <span className={styles[`${baseClass}BoxShadowSuffix`]}>位置Y</span>
                        <InputNumber
                          style={{ width: '50%' }}
                          value={splitString( style.boxShadow, 1 ) || 0}
                          onChange={e => changeBoxShadow( e, 1 )}
                        />
                      </Col>
                    </Row>
                    <Row className={styles[`${baseClass}BoxShadow`]}>
                      <Col span={10}>
                        <span className={styles[`${baseClass}LastBoxShadowSuffix`]}>模糊</span>
                        <InputNumber
                          style={{ width: '50%' }}
                          value={splitString( style.boxShadow, 2 ) || 0}
                          onChange={e => changeBoxShadow( e, 2 )}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <FormItem label='阴影颜色' {...formLayout3}>
                  <div
                    className={styles[`${baseClass}PreviewColor`]}
                    onClick={() => {
                      setShowSketchPicker( 5 );
                    }}
                  >
                    <div style={{ backgroundColor: splitString( style.boxShadow, 3 ) || 'rgba(0,0,0,1)' }} />
                  </div>
                  {showSketchPicker === 5 && (
                    <>
                      <div
                        onClick={() => {
                          setShowSketchPicker( 0 );
                        }}
                        className={styles.sketchPickerMask}
                      />
                      <div style={{ position: 'relative', zIndex: 999 }}>
                        <SketchPicker
                          width="230px"
                          color={splitString( style.boxShadow, 3 ) || undefined}
                          onChange={e => { changeBoxShadow( e, 3 ) }}
                        />
                      </div>
                    </>
                  )}
                </FormItem>
              </>
            )
          }
        </FormItem>



      </>
    );
  };

  const renderAnvancedSetting = () => {
    const { showTimeType, startDateTime, endDateTime, startTime, endTime, showChannel } = advancedSetting || {};
    return (
      <div style={{ paddingLeft: '16px' }}>
        <FormItem label='展示时间设置'>
          <Radio.Group
            value={showTimeType || 'NONE'}
            onChange={( e ) => {
              const val = e?.target ? e.target.value : e;
              changeValue( val, 'advancedSetting.showTimeType' )
            }}
          >
            <Radio value='NONE'>不限</Radio>
            <Radio value='DATETIME'>固定时间段</Radio>
            <Radio value='LOCALTIME'>每日固定时间</Radio>
          </Radio.Group>
        </FormItem>
        {
          ( showTimeType && showTimeType === 'DATETIME' ) && (
            <>
              <FormItem label='开始日期' style={{ display: 'flex', alignItems: 'center' }}>
                <DatePicker
                  value={startDateTime ? moment( startDateTime, 'YYYY-MM-DD HH:mm:ss' ) : undefined}
                  showTime
                  onChange={( e ) => {
                    const val = e ? e.format( 'YYYY-MM-DD HH:mm:ss' ) : '';
                    changeValue( val, 'advancedSetting.startDateTime' )
                  }}
                  placeholder='请选择开始日期'
                  getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
                />
              </FormItem>
              <FormItem label='结束日期' style={{ display: 'flex', alignItems: 'center' }}>
                <DatePicker
                  value={endDateTime ? moment( endDateTime, 'YYYY-MM-DD HH:mm:ss' ) : undefined}
                  showTime
                  onChange={( e ) => {
                    const val = e ? e.format( 'YYYY-MM-DD HH:mm:ss' ) : '';
                    changeValue( val, 'advancedSetting.endDateTime' )
                  }}
                  placeholder='请选择结束日期'
                  getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
                />
              </FormItem>
            </>
          )
        }
        {
          ( showTimeType && showTimeType === 'LOCALTIME' ) && (
            <>
              <FormItem label='开始时间' style={{ display: 'flex', alignItems: 'center' }}>
                <TimePicker
                  value={startTime ? moment( startTime, 'HH:mm:ss' ) : undefined}
                  onChange={( e ) => {
                    const val = e ? e.format( 'HH:mm:ss' ) : '';
                    changeValue( val, 'advancedSetting.startTime' )
                  }}
                  style={{ width: '100%' }}
                  placeholder='请选择开始时间'
                  getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
                />
              </FormItem>
              <FormItem label='结束时间' style={{ display: 'flex', alignItems: 'center' }}>
                <TimePicker
                  value={endTime ? moment( endTime, 'HH:mm:ss' ) : undefined}
                  onChange={( e ) => {
                    const val = e ? e.format( 'HH:mm:ss' ) : '';
                    changeValue( val, 'advancedSetting.endTime' )
                  }}
                  style={{ width: '100%' }}
                  placeholder='请选择结束时间'
                  getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
                />
              </FormItem>
            </>
          )
        }
        <FormItem label='仅展示渠道'>
          <Radio.Group
            value={showChannel || 'ALL'}
            onChange={( e ) => changeValue( e, 'advancedSetting.showChannel' )}
          >
            <Radio value='ALL'>全部</Radio>
            <Radio value='APP'>端内</Radio>
            <Radio value='WEB'>端外</Radio>
          </Radio.Group>
        </FormItem>
      </div>
    )
  }


  // const renderSuspension = () => {
  //   return (
  //     <>
  //       <FormItem required label="是否悬浮">
  //         <Radio.Group
  //           onChange={e => {
  //             changeValue( e, 'isSuspend' );
  //           }}
  //           value={isSuspend || false}
  //         >
  //           <Radio value={false}> 关闭 </Radio>
  //           <Radio value> 开启 </Radio>
  //         </Radio.Group>
  //       </FormItem>

  //       {isSuspend && (
  //         <FormItem required label="悬浮方式">
  //           <Radio.Group
  //             onChange={e => {
  //               changeValue( e, 'suspendMode' );
  //             }}
  //             value={suspendMode || false}
  //           >
  //             <Radio value="TOP"> 置顶 </Radio>
  //             <Radio value="BOTTOM"> 置底 </Radio>
  //             <Radio value="CUSTOM"> 自定义 </Radio>
  //           </Radio.Group>
  //         </FormItem>
  //       )}
  //       {suspendMode === 'CUSTOM' && (
  //         <FormItem required label="距离" {...formLayout}>
  //           <InputNumber value={distance} onChange={e => changeValue( e, 'distance' )} min={0} />
  //           <span style={{ marginLeft: 10 }}>px</span>
  //         </FormItem>
  //       )}
  //     </>
  //   );
  // };

  return (
    <Form layout="horizontal" className={styles[`${baseClass}Wrap`]}>
      <FormItem required label="组件名称">
        <Input
          value={label}
          onChange={e => {
            changeValue( e, 'label' );
          }}
          maxLength={20}
          style={{ marginLeft: '10px' }}
        />
      </FormItem>
      {SET_JUMP && renderSetJump()}
      {Element && <Element componentsData={componentsData} changeValue={changeValue} isEditTemp={isEditTemp} functionConfig={functionConfig} />}
      {/* {SUSPENSION && renderSuspension()} */}
      <Collapse defaultActiveKey="1" style={{ marginBottom: '20px' }}>
        <Panel header="尺寸与位置" key="1" className={styles[`${baseClass}Panel`]}>
          {renderSizeAndLocation()}
        </Panel>
      </Collapse>
      <Collapse style={{ marginBottom: '20px' }}>
        <Panel header="组件通用属性" key="1" className={styles[`${baseClass}Panel`]}>
          {renderGeneralProperties()}
        </Panel>
      </Collapse>
      {ADVANCED_SETTING && (
        <Collapse style={{ marginBottom: '20px' }}>
          <Panel header="高级设置" key="1" className={styles[`${baseClass}Panel`]}>
            <ADVANCED_SETTING />
          </Panel>
        </Collapse>
      )}
      <Collapse style={{ marginBottom: '20px' }}>
        <Panel header='高级设置' key='1' className={styles[`${baseClass}Panel`]}>
          {renderAnvancedSetting()}
        </Panel>
      </Collapse>
      <></>
    </Form>
  );
}
export default ComponentSettings;
