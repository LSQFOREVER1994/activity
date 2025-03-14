import React, { useContext, useMemo, useState, useRef } from 'react';
import { Form, Row, Col, InputNumber, Slider, Dropdown, Menu, Tooltip, Select, message, Switch } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import { CurrentPages } from '../../../provider';
import ColorPickerModal from '@/components/ColorPickerModal/ColorPickerModal';
import styles from './index.less'
import { mathematicalCalculation }  from '@/utils/utils'
import PageTurningDrawer from '../PageTurningDrawer';
import animateList from '../pageTurningType';

const { multiply } = mathematicalCalculation
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 13 },
};
const { Option } = Select;

const findAnimateLabel = ( value ) => {
  const currentAnimate = animateList.find( ( item )=>( item.value === value ) )
  return currentAnimate?.label || '';
}

const PAGE_TURNING_METHOD  = {
  UP_AND_DOWN: '上下翻页',
  LEFT_AND_RIGHT:'左右翻页'
}

function PageSetup() {
  const [visibleBgColor, setVisibleBgColor] = useState( false );
  const [visibleDrawer, setVisibleDrawer] = useState( false )
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { backgroundImage, backgroundColor, opacity, height, width, layout, backgroundLayout } = currentPages?.style || {};
  const { componentData, enablePageTurning, pageTurningMethod, pageTurningType, autoPageTurning, autoPageTime } = currentPages
  const colorPickerRef = useRef( null );
  const changeValue = ( e, type ) => {
    const val = e?.target ? e.target.value : e;
    currentPages.style  = { ...currentPages?.style, [type]: val }
    changeCurrentPages( currentPages );
  };

  const changePageTurningValue = ( e, type ) => {
    const val = e?.target ? e?.target?.value : e;
    currentPages[type] = val;
    changeCurrentPages( currentPages )
  }

  const changeLayout = ( e ) =>{
    const haveGroup = componentData?.length && componentData.findIndex( item =>( item.type === 'GROUP' ) )
    if( e === 'GRID' && haveGroup > 0 ){
      message.warning( '网格布局中不能存在组合' )
      return;
    }
    changeValue( e, 'layout' )
  }
  const heightMenu = useMemo( () => {
    return (
      <Menu onClick={( e )=>{changeValue( e.key, 'height' )}}>
        <Menu.Item key={718}>
          全面屏 1624
        </Menu.Item>
      </Menu>
    )
  }, [] )
  return (
    <Form labelCol={{ span: 4 }} layout="horizontal">
      <Form.Item label="页面背景图" {...formLayout}>
        <div style={{ width: '100%' }}>
          <UploadModal
            value={backgroundImage}
            onChange={e => changeValue( e, 'backgroundImage' )}
          />
          <div
            style={{
              fontSize: 13,
              color: '#999',
              marginTop: 10,
              lineHeight: 1.3,
              width: '100%',
            }}
          >
            <div>格式：jpg/jpeg/png </div>
            <div>图片大小建议不大于1M</div>
          </div>
        </div>
      </Form.Item>
      <Form.Item />

      <Form.Item
        label='背景图展示'
        extra={<div style={{ fontSize: 12 }}>*当选择非默认样式时，背景色失效 </div>}
        {...formLayout}
      >
        <Select
          value={backgroundLayout || 'ORIGINAL'}
          onChange={e => changeValue( e, 'backgroundLayout' )}
        >
          <Option value='ORIGINAL'>原图展示</Option>
          <Option value='STRETCH'>拉伸展示</Option>
          <Option value='TILE'>平铺展示</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="页面背景色"
        {...formLayout}
        extra={<div style={{ fontSize: 12 }}>*填充页面除图片外的区域</div>}
      >
        <span
          style={{
            display: 'inline-block',
            width: 136,
            padding: '10px',
            height: '42px',
            lineHeight: 0,
            border: '1px solid #f5f5f5',
            cursor: 'pointer',
          }}
          ref={colorPickerRef}
          onClick={() => {
            setVisibleBgColor( true );
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: backgroundColor,
              width: 116,
              height: '22px',
            }}
          />
        </span>
      </Form.Item>
      {visibleBgColor && (
        <ColorPickerModal
          defaultColor={backgroundColor}
          changeColor={result => changeValue( result, 'backgroundColor' )}
          componentMountRef={colorPickerRef}
          onClose={()=>{setVisibleBgColor( false )}}
          mountOffset={{ left:-90 }}
        />
      )}
      {/* <Form.Item label="布局模式" {...formLayout}>
        <Select
          value={layout || 'FREEDOM'}
          onChange={e => changeLayout( e )}
        >
          <Option value='FREEDOM'>自由布局</Option>
          <Option value='GRID'>网格布局</Option>
        </Select>
      </Form.Item> */}
      <Form.Item label="透明度" labelCol={{ span: 6 }} wrapperCol={{ span: 13 }}>
        <div className={styles.sliderBox}>
          <Row>
            <Col span={14}>
              <Slider
                min={0}
                max={100} // TODO: 精度丢失问题
                onChange={e => changeValue( e / 100, 'opacity' )}
                step={1}
                value={multiply( opacity, 100, 2 )}
              />
            </Col>
            <Col span={2}>
              <InputNumber
                min={0}
                max={100}
                style={{ margin: '0 16px' }}
                value={multiply( opacity, 100, 2 )}
                onChange={e => changeValue( e / 100, 'opacity' )}
              />
            </Col>
          </Row>
        </div>

      </Form.Item>
      <Form.Item label="页面尺寸" {...formLayout}>
        <div>
          <span> W:&ensp;</span>
          <Tooltip title="H5固定宽度">
            <span>{width}</span>
          </Tooltip>
          <span>&ensp;PX</span>
        </div>
        <div>
          <Dropdown overlay={heightMenu} placement="topCenter">
            <>
              <span>H:&ensp;</span>
              <InputNumber min={718} value={height || 718} onChange={e => changeValue( e, 'height' )} />
              <span>&ensp;PX</span>
            </>
          </Dropdown>
        </div>
      </Form.Item>
      {/* <Form.Item>
        <div className={styles.label}>
          <span>启用翻页</span>
          <Switch
            checked={enablePageTurning}
            onChange={e => changePageTurningValue( e, 'enablePageTurning' )}
          />
        </div>
      </Form.Item> */}
      {
        enablePageTurning && (
          <>
            <section className={styles.page_turning_box}>
              <div className={styles.page_turning} onClick={()=>{setVisibleDrawer( true )}}>
                {pageTurningMethod ? (
                  <div>{`${PAGE_TURNING_METHOD[pageTurningMethod]}-${findAnimateLabel( pageTurningType )}`}</div>
                ):(
                  <div>请选择</div>
                )}

                <div>&gt;</div>
              </div>
            </section>
            <Form.Item>
              <div className={styles.label}>
                <span>自动翻页</span>
                <Switch
                  checked={autoPageTurning}
                  onChange={e => changePageTurningValue( e, 'autoPageTurning' )}
                />
              </div>
            </Form.Item>
            {autoPageTurning&&(
            <Form.Item>
              <div className={styles.requireLabel}>
                <span><span style={{ color:'red' }}>*</span>自动翻页时间</span>
                <span>
                  <InputNumber
                    value={autoPageTime}
                    min={0}
                    onChange={e => changePageTurningValue( e, 'autoPageTime' )}
                  /><span style={{ paddingLeft:'5px' }}>秒</span>
                </span>
              </div>
            </Form.Item>
      )}
            <PageTurningDrawer
              visible={visibleDrawer}
              onClose={()=>{setVisibleDrawer( false )}}
            />
          </>
        )
      }

    </Form>
  );
}
export default PageSetup;
