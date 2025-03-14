import React from 'react';
import { Collapse, Row, Col } from 'antd';
import RenderFormItem from '../RenderFormItem';
import styles from './index.less';

const { Panel } = Collapse;

const renderList = [
  {
    renderType: 'Input',
    label: '复制提示',
    field: 'copyTip',
    required: false,
  },
  {
    renderType: 'TextArea',
    label: '填写提示',
    field: 'fillTip',
    required: false
  },
];

export default function BasicsSetting() {
  return (
    <Collapse defaultActiveKey="1" className={styles.rank_box_c}>
      <Panel header="基础设置" key="1">
        <Row type="flex" justify="space-between">
          <Col span={12}>
            <RenderFormItem
              renderList={[
                {
                  renderType: 'SketchPicker',
                  field: 'copyBtnColor',
                  label: '复制按钮颜色',
                },
              ]}
            />
          </Col>
          <Col span={12}>
            <RenderFormItem
              renderList={[
                {
                  renderType: 'SketchPicker',
                  field: 'confirmBtnColor',
                  label: '确认按钮颜色',
                  propsData:{
                    style:{
                      left: -115
                    }
                  }
                },
              ]}
            />
          </Col>
        </Row>
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  );
}
