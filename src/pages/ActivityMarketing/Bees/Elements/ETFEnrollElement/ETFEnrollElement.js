/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio, InputNumber, Checkbox, Select, DatePicker, Collapse, Alert } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import UploadModal from '@/components/UploadModal/UploadModal';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import moment from 'moment';
import { featureTypes } from '../../BeesEnumes'
import styles from './etfEnrollElement.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const limitDecimals = (value) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2') : ''
  } if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2') : ''
  }
  return ''
};

@connect(({ bees }) => ({
  eligibilityList: bees.eligibilityList,
  eligibilityType: bees.eligibilityType
}))
@Form.create()
class ETFEnrollElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    this.initElmentData()
    this.getEligibilityType()
    const { domData = {}, eleObj = {} } = this.props;
    const { task = {} } = eleObj
    const { taskEventType } = task
    if (taskEventType) this.getEligibilityList(taskEventType)
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ((eleObj && eleObj.id) || (eleObj && eleObj.name)) return
    // 塞入默认值
    const defaultObj = {
      name: 'ETF报名组件',
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 30,
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

  // 获取资格类型
  getEligibilityType = (name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent(name) : ''
        },
        successFun: () => { }
      },
    });
  }

  setData = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bees/setState',
      payload,
    });
  }

  // 获取资格列表
  getEligibilityList = (id) => {
    this.setData({ eligibilityList: [] })
    if (!id) return
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
        }
      },
    } );
  }

  changeValue = (e, type) => {
    let val
    if (e) {
      val = e
      if (e.target)val = e.target.value
    }
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign(eleObj, { [type]: val });
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() })
  }



  changeDate = (e) => {
    const startTime = e[0] && e[0].format('YYYY-MM-DD HH:mm:ss');
    const endTime = e[1] && e[1].format('YYYY-MM-DD HH:mm:ss');
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign(eleObj, { startTime, endTime });
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign(eleObj, obj);
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() })
  }


  changeGameDate = (e) => {
    const gameStartTime = e[0] && e[0].format('YYYY-MM-DD HH:mm:ss');
    const gameEndTime = e[1] && e[1].format('YYYY-MM-DD HH:mm:ss');
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign(eleObj, { gameStartTime, gameEndTime });
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign(eleObj, obj);
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() })
  }

  // 选择资格相关
  changeEligibility = (e, type) => {
    const { domData, changeDomData, eleObj } = this.props;
    const { task = {} } = eleObj
    let newTask = Object.assign(task, { [type]: e });
    if (type === 'taskEventType') {
      this.getEligibilityList(e)
      delete newTask.taskEventId
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign(eleObj, { task: newTask });
    // 替换对应项
    const newElementsList = elementsList.map(item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    });
    // 刷新总数据
    const newDomData = Object.assign(domData, { elements: newElementsList });
    changeDomData(newDomData);
    this.setState({ time: new Date() })
  }

  // 登录资格判断
  rednerQualificationsSet = () => {
    const { domData, eligibilityList = [], eligibilityType = [], eleObj = {} } = this.props;
    const { task = {} } = eleObj
    return (
      <div style={{ margin: '20px 0' }}>
        <Collapse defaultActiveKey='1'>
          <Panel header="报名资格判断" key="1">
            <div style={{ marginBottom: '20px' }}>
              <Alert
                type="warning"
                showIcon
                message={(
                  <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
                    <span>若配置了资格，ETF报名时，会判断是否满足资格，满足时则报名成功。不满足时，则报名失败。此组件资格查询模式固定为资金账号模式。</span>
                  </div>)}
              />
            </div>
            <div style={{ marginBottom: '20px', minHeight: 150 }}>
              <Form>
                <FormItem label='关联资格' {...this.formLayout}>
                  <div>
                    <Select
                      style={{ width: '40%' }}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      value={task.taskEventType}
                      placeholder="请选择资格类型"
                      onChange={(e) => this.changeEligibility(e, 'taskEventType')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                    >
                      {eligibilityType.map(item => (
                        <Option key={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ width: '40%', marginLeft: '20px' }}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      value={task.taskEventId}
                      placeholder="请选择资格"
                      onChange={(e) => this.changeEligibility(e, 'taskEventId')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                    >
                      {eligibilityList.map(item => (
                        <Option key={item.taskEventId}>{item.name}</Option>
                      ))}
                    </Select>
                  </div>
                </FormItem>
                <FormItem label='不满足资格提示语' {...this.formLayout}>
                  <Input
                    value={eleObj.unableAttendTip}
                    onChange={(e) => this.changeValue(e, 'unableAttendTip')}
                    maxLength={100}
                    placeholder="请输入不满足资格提示语"
                  />
                </FormItem>
              </Form>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }


  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;

    return (
      <div>
        <div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={(e) => this.changeValue(e, 'name')}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>报名时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.startTime ? [moment(eleObj.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(eleObj.endTime, 'YYYY-MM-DD HH:mm:ss')] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(e) => this.changeDate(e)}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>比赛时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.gameStartTime ? [moment(eleObj.gameStartTime, 'YYYY-MM-DD HH:mm:ss'), moment(eleObj.gameEndTime, 'YYYY-MM-DD HH:mm:ss')] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(e) => this.changeGameDate(e)}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>报名按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.enrollButton}
                onChange={(e) => this.changeValue(e, 'enrollButton')}
              />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议180px * 80px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>已报名按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.hasEnrollButton}
                onChange={(e) => this.changeValue(e, 'hasEnrollButton')}
              />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议180px * 80px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>开户按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.openAccountButton}
                onChange={(e) => this.changeValue(e, 'openAccountButton')}
              />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议180px * 80px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>参赛说明</span>}
            {...this.formLayout}
          >
            <BraftEditor record={eleObj.desc} onChange={(e) => this.changeValue(e, 'desc')} field="content" />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>风险揭示书内容</span>}
            {...this.formLayout}
          >
            <BraftEditor record={eleObj.agreement} onChange={(e) => this.changeValue(e, 'agreement')} field="content" />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>排名说明</span>}
            {...this.formLayout}
          >
            <BraftEditor record={eleObj.rankDesc} onChange={(e) => this.changeValue(e, 'rankDesc')} field="content" />
          </FormItem>
        </div>
        {/* 报名资格资格判断 */}
        {this.rednerQualificationsSet()}
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    )
  }

}

export default ETFEnrollElement;
