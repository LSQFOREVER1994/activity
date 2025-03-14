import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Select, DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from '../../../../ActivityModal.less';
import UploadImg from '@/components/UploadImg';


const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;

@connect()
@Form.create()
class IntegralModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      info: this.props.info, // 任务信息
      noteValue: this.props.noteValue,
      nameValue: this.props.nameValue,
      eventList: this.props.eventList,
      rewardType1: this.props.rewardType1,
      type: this.props.type,
      showTaskType: this.props.showTaskType,
      activityType: this.props.activityType,
    }
  }

  // componentDidMount() {
  //   this.fetchEventList();
  // }

  onChange=( e, type )=>{
    const data = e.target.value;
    this.setState( { [type]:data }, ()=>{
      const { form:{ setFieldsValue } }=this.props;
      if( type === 'rewardCount' ){
        setFieldsValue( { rewardCount:data } )
      }
      if( type === 'attendLimit' ){
        setFieldsValue( { attendLimit:data } )
      }
    } )
  }

  onPreview = () => {
    this.props.onPreview();
  }

  selChange=( val, type )=>{
    this.setState( { [type]:val } );
  }

  getValues = () => {
    const { form } = this.props;
    return { form, state: this.state };
  }

  // 获取事件
  fetchEventList = () => {
    const { pageNum, pageSize, name } = this.state;
    const { dispatch } = this.props;
    // if( name && eventList.length === totalNum )return
    dispatch( {
      type: 'tool/getEventList',
      payload: {
        pageNum,
        pageSize,
        name,
        orderBy: 'create_time desc'
      },
      callFunc: ( res ) => {
        const { list } = res;
        this.setState( { eventList: list } )
      }
    } )
  }

  //  事件滚动条
  companyScroll = e => {
    e.persist();
    const { pageSize } = this.state;
    const { target } = e;
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {
      this.setState( { pageSize: pageSize + 10 }, () => this.fetchEventList() )
    }
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { info, noteValue, nameValue, eventList, rewardType1, type, showTaskType, activityType } = this.state;
    return (
      <Form className={styles.formHeight} onSubmit={this.handleSubmit}>

        <FormItem label='任务名称' {...this.formLayout}>
          {getFieldDecorator( 'name', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务名称` }, ],
            initialValue: info.name,
          } )( <Input placeholder='请输入任务名称' maxLength={10} onChange={( e ) => this.onChange( e, 'nameValue' )} />
          )}
          <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/10</span>
        </FormItem>

        <FormItem label='任务描述' {...this.formLayout}>
          {getFieldDecorator( 'note', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}任务描述` }, ],
            initialValue: info.note,
          } )( <Input placeholder='可输入任务描述，展示在任务名称下方' maxLength={20} onChange={( e ) => this.onChange( e, 'noteValue' )} />
          )}
          <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{noteValue.length}/20</span>
        </FormItem>
        {
          showTaskType === 'BIG_IMAGE' ?
            <div>
              <FormItem label='默认任务图片' {...this.formLayout}>
                {getFieldDecorator( 'icon', {
                  rules: [{ required: false }],
                  initialValue: info.icon
                } )( <UploadImg onChange={this.onPreview} /> )}
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: '125px',
                    width: '200px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: '10px'
                  }}
                >
                  <div>格式：jpg/jpeg/png </div>
                  <div>建议尺寸：宽度750px，高度不限</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </FormItem>

              <FormItem label='完成任务图片' {...this.formLayout}>
                {getFieldDecorator( 'iconFinish', {
                  rules: [{ required: false }],
                  initialValue: info.iconFinish
                } )( <UploadImg onChange={this.onPreview} /> )}
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: '125px',
                    width: '200px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: '10px'
                  }}
                >
                  <div>格式：jpg/jpeg/png </div>
                  <div>建议尺寸：宽度750px，高度不限</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </FormItem>
            </div>
            :
            <FormItem label='任务图标' {...this.formLayout}>
              {getFieldDecorator( 'icon', {
                rules: [{ required: false }],
                initialValue: info.icon
              } )( <UploadImg onChange={this.onPreview} /> )}
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
        }

        <FormItem label='开始时间' {...this.formLayout}>
          {getFieldDecorator( 'startTime', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}开始时间` }],
            initialValue: info.startTime && moment( info.startTime, 'YYYY-MM-DD HH:mm:ss' ),
          } )( <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 300 }} /> )}
        </FormItem>

        <FormItem label='结束时间' {...this.formLayout}>
          {getFieldDecorator( 'endTime', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}结束时间` }],
            initialValue: info.endTime && moment( info.endTime, 'YYYY-MM-DD HH:mm:ss' ),
          } )( <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 300 }} /> )}
        </FormItem>

        <FormItem label='事件' {...this.formLayout}>
          {getFieldDecorator( 'eventId', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}事件` }],
            initialValue: info.eventId,
          } )(
            <Select
              onSearch={this.onSearch}
              allowClear
              showSearch
              filterOption={false}
              onChange={() => this.onSearch}
              onPopupScroll={this.companyScroll}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {
                eventList.length && eventList.map( item => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ) )
              }
            </Select>
          )}
        </FormItem>

        <FormItem label='跳转链接' {...this.formLayout}>
          {getFieldDecorator( 'link', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }, ],
            initialValue: info.link,
          } )( <Input placeholder='可输入跳转链接，不填则点击即可完成' />
          )}
        </FormItem>

        <FormItem label='关联活动' {...this.formLayout}>
          {getFieldDecorator( 'activityId', {
            rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}关联活动ID` }, ],
            initialValue: info.activityId,
          } )( <Input placeholder='请输入关联活动ID' />
          )}
        </FormItem>

        {
          activityType === 'GUESS_GAME' ?
            <FormItem label='任务奖励' {...this.formLayout}>
              {getFieldDecorator( 'rewardCount', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务奖励` },
                { pattern: new RegExp( /^[1-9]\d*$/ ), message: '请输入正整数' }
                ],
              } )(
                <Input
                  placeholder='请输入任务奖励，该值为正整数，最小值为1'
                  min={1}
                  addonAfter='分'
                  type='number'
                />
              )}
            </FormItem>
            :
            <FormItem label='任务奖励' {...this.formLayout}>
              {getFieldDecorator( 'rewardCount', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务奖励` },
                { pattern: new RegExp( /^[1-9]\d*$/ ), message: '请输入正整数' }
                ],
              } )(
                <InputGroup compact>
                  <Input style={{ width: '75%' }} type='number' defaultValue={info.rewardCount} onChange={( e ) => this.onChange( e, 'rewardCount' )} />
                  <Select style={{ width: 100 }} defaultValue={info.rewardType || rewardType1} onChange={( val ) => this.selChange( val, 'rewardType1' )}>
                    <Option value="DAILY_REWARD">分(当日)</Option>
                    <Option value="DURING_REWARD">分</Option>
                  </Select>
                </InputGroup>
              )}
            </FormItem>
        }

        <FormItem label='任务上限' {...this.formLayout}>
          {getFieldDecorator( 'attendLimit', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务上限` },
            { pattern: new RegExp( /^[1-9]\d*$/ ), message: '请输入正整数' }
            ],
          } )(
            <InputGroup compact>
              <Input style={{ width: '75%' }} type='number' defaultValue={info.attendLimit} onChange={( e ) => this.onChange( e, 'attendLimit' )} />
              <Select style={{ width: 100 }} defaultValue={info.type || type} onChange={( val ) => this.selChange( val, 'type' )}>
                <Option value="DAILY">次/每日</Option>
                <Option value="DURING">次</Option>
              </Select>
            </InputGroup>
          )}
        </FormItem>

        <FormItem label='排序值' {...this.formLayout}>
          {getFieldDecorator( 'sort', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序值` }, ],
            initialValue: info.sort,
          } )( <Input placeholder='请输入排序值，数值越小排序越靠前' />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default IntegralModal;