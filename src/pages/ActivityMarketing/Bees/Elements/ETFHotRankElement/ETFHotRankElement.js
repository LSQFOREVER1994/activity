import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';
import serviceObj from '@/services/serviceObj';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './etfHotRankElement.less';

const FormItem = Form.Item;
class ETFHotRankElement extends PureComponent {
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ((eleObj && eleObj.id) || (eleObj && eleObj.name)) return
    // 塞入默认值
    const defaultObj = {
      name: 'ETF热榜组件',
      moreButton: `${serviceObj.defaultImagePath}ETF_CKGD.png`,
      directShowNum: 5
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign(eleObj, defaultObj);
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() })
  }

  // 表单改变通知父组件更新
  changeInput = (e, type) => {
    const val = e && e.target ? e.target.value : e;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign(eleObj, { [type]: val });
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
  };

  render() {
    const { eleObj, domData, changeDomData } = this.props;
    return (
      <>
        <Form>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>组件名称
              </span>
            }
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={e => this.changeInput(e, 'name')}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>查看更多按钮图
              </span>
            }
            {...this.formLayout}
          >
            <Row>
              <Col span={8}>
                <UploadModal
                  value={eleObj.moreButton}
                  onChange={e => this.changeInput(e, 'moreButton')}
                />
              </Col>
              <Col span={16} className={styles.uploadTops}>
                <p>格式：jpg/jpeg/png</p>
                <p>建议尺寸：180px*80px</p>
                <p>图片大小建议不大于1M</p>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>直接展示基金数量
              </span>
            }
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.directShowNum}
              placeholder="请输入展示个数"
              onChange={e => this.changeInput(e, 'directShowNum')}
              min={1}
              max={15}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Form>

        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </>
    );
  }
}
export default ETFHotRankElement;
