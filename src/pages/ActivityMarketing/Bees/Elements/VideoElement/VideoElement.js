import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, InputNumber, Radio } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import styles from './videoElement.less';

const FormItem = Form.Item;
@connect()
class VideoElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.initElmentData();
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props;
    // 编辑和新增状态的编辑都不走此流程
    if ((eleObj && eleObj.id) || (eleObj && eleObj.name)) return;
    // 塞入默认值
    const defaultObj = {
      name: '视频组件',
      enable: true,
      isShowView: true,
      isShowLike: true,
    };
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign(eleObj, defaultObj);
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() });
  };

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
    this.setState({ time: new Date() });
  };

  changeImg = (e, type) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign(eleObj, { [type]: e });
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() });
  };

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
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
              <span>*</span>视频
            </span>
          }
          {...this.formLayout}
        >
          <UploadModal
            value={eleObj.url}
            onChange={e => this.changeImg(e, 'url')}
            mediaType="VIDEO"
          />
        </FormItem>
        <FormItem label="封面图" {...this.formLayout}>
          <UploadModal value={eleObj.cover} onChange={e => this.changeImg(e, 'cover')} />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>是否开启弹幕功能
            </span>
          }
          {...this.formLayout}
        >
          <Radio.Group value={eleObj.enable} onChange={e => this.changeInput(e, 'enable')}>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>是否展示播放量：
            </span>
          }
          {...this.formLayout}
        >
          <Radio.Group
            value={eleObj.isShowView}
            onChange={e => this.changeInput(e, 'isShowView')}
          >
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>
        {eleObj.isShowView && (
          <FormItem
            label={<span className={styles.labelText}>虚拟播放量</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.virtualView}
              placeholder="请输入虚拟播放量"
              min={0}
              precision={0}
              style={{ width: 150 }}
              onChange={e => this.changeInput(e, 'virtualView')}
            />
          </FormItem>
        )}
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>是否展示点赞量：
            </span>
          }
          {...this.formLayout}
        >
          <Radio.Group
            value={eleObj.isShowLike}
            onChange={e => this.changeInput(e, 'isShowLike')}
          >
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>
        {eleObj.isShowLike && (
          <FormItem
            label={<span className={styles.labelText}>虚拟点赞量</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.virtualLike}
              placeholder="请输入虚拟点赞量"
              min={0}
              precision={0}
              style={{ width: 150 }}
              onChange={e => this.changeInput(e, 'virtualLike')}
            />
          </FormItem>
        )}

        <div>
          <AdvancedSettings domData={domData} changeDomData={changeDomData} eleObj={eleObj} />
        </div>
      </div>
    );
  }
}

export default VideoElement;
