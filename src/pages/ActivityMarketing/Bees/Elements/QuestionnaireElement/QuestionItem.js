import React, { PureComponent } from 'react';
import { Form, Input, Select, Radio, Icon, Row, Col, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import { topicTypeList } from '@/utils/enums';
import styles from './questionItem.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
@connect( () => ( {} ) )
@Form.create()
class QuestionItem extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      isOpen: false
    }
  }


  componentWillMount() {
    const { questionItem } = this.props
    this.setState( {
      isOpen: questionItem.isOpen,
    } )
  }

  // 展开、收起
  onChangeShow = () => {
    this.setState( {
      isOpen: !this.state.isOpen
    } )
  }

  // 更新值
  onChangeItemValue = ( e, type ) => {
    let val
    if ( e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, changeDomData, eleObj, questionItem, itemIndex } = this.props;
    const { question = [] } = eleObj
    // 备份原数据
    const questionItemStr = JSON.stringify( questionItem )
    const newQuestionItem = { ...JSON.parse( questionItemStr ), [type]: val }
    if ( type === 'topic' ) {
      // 修改类型为题目类型时，需要清除题目下的选项
      delete newQuestionItem.optionsList
      if( val==='SCORE' ){
        // 选择类型为评分时候，先初始化一个值
        newQuestionItem.optionsList = ['5']
      }
    }
    const newQuestion = question.map( ( info, index ) => {
      return index === itemIndex ? newQuestionItem : info
    } )
    const newEleObj = Object.assign( eleObj, { question: [...newQuestion] } );
    // 替换对应项
    const elementsList = domData.elements ? domData.elements : []
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  // 添加选项
  addOptionsItem = () => {
    const { questionItem = {} } = this.props;
    const { optionsList = [] } = questionItem
    const newList = optionsList.concat( '' );
    this.onChangeItemValue( newList, 'optionsList' )
  }

  // 添加其他项
  addOtherOptionsItem = () => {
    const { questionItem = {} } = this.props;
    const { optionsList = [] } = questionItem
    if ( optionsList.length > 0 && optionsList.includes( '其他' ) ) {
      message.error( '只能添加一个其他项' )
      return
    }
    const newList = optionsList.concat( '其他' );
    this.onChangeItemValue( newList, 'optionsList' )
  }


  // 上移选项
  upOptionsItem = ( e, index ) => {
    const { questionItem = {} } = this.props;
    const { optionsList } = questionItem
    const optionsStr = JSON.stringify( optionsList )
    const newList = JSON.parse( optionsStr )
    if ( index === 0 ) return
    newList.splice( index - 1, 0, ( newList[index] ) )
    newList.splice( index + 1, 1 )
    this.onChangeItemValue( newList, 'optionsList' )
  }

  // 下移选项
  downOptionsItem = ( e, index ) => {
    const { questionItem = {} } = this.props;
    const { optionsList } = questionItem
    const optionsStr = JSON.stringify( optionsList )
    const newList = JSON.parse( optionsStr )
    if ( index === ( newList.length - 1 ) ) return
    newList.splice( index + 2, 0, ( newList[index] ) )
    newList.splice( index, 1 )
    this.onChangeItemValue( newList, 'optionsList' )
  }

  // 删除选项
  deleteOptionsItem = ( val, num ) => {
    const { questionItem = {} } = this.props;
    const { optionsList, topic } = questionItem
    if ( ( topic === 'SINGLE_CHOICE' || topic === 'MULTIPLE_CHOICE' ) && optionsList.length === 1 ) {
      message.error( '至少要有一个选项' )
      return
    }
    const newList = optionsList.filter( ( item, index ) => {
      return index !== num
    } )
    this.onChangeItemValue( newList, 'optionsList' )
  }

  // 修改选项
  editOptionsItem = ( e, index ) => {
    const { questionItem = {} } = this.props;
    const { optionsList } = questionItem
    const optionsStr = JSON.stringify( optionsList )
    const newList = JSON.parse( optionsStr )
    newList[index] = e.target.value;
    this.onChangeItemValue( newList, 'optionsList' )
  }


  // 积分
  onScoreChange = ( e ) => {
    const newList = new Array( e.target.value )
    this.onChangeItemValue( newList, 'optionsList' )
  }

  // 选项列表
  renderOptionsList = () => {
    const { questionItem = {} } = this.props;
    const { topic, optionsList } = questionItem
    let optionsListBox
    if ( optionsList && optionsList.length > 0 && ( topic === 'SINGLE_CHOICE' || topic === 'MULTIPLE_CHOICE' ) ) {
      const optionsListItem = optionsList.map( ( info, index ) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Input.Group compact key={index + 1} style={{ display: 'flex' }}>
            <Input
              style={{ width: '75%', marginTop: '6px', textAlign: 'left' }}
              value={info}
              onChange={e => this.editOptionsItem( e, index )}
              placeholder={`请输入选项${index + 1}`}
            />
            <div
              style={{
                width: '25%',
                display: 'flex',
                marginTop: '6px',
                alignItems: 'center'
              }}
            >
              <Icon type="up-circle" theme="twoTone" style={{ fontSize: '24px', marginLeft: '20px', marginRight: '25px' }} onClick={() => this.upOptionsItem( info, index )} />
              <Icon type="down-circle" theme="twoTone" style={{ fontSize: '24px', marginRight: '25px' }} onClick={() => this.downOptionsItem( info, index )} />
              <Icon type="delete" theme="twoTone" style={{ fontSize: '24px', marginRight: '25px' }} onClick={() => this.deleteOptionsItem( info, index )} />
            </div>
          </Input.Group>
        )
      } )

      optionsListBox = (
        <FormItem
          label='选项'
          {...this.formLayout}
        >
          {optionsListItem}
        </FormItem>
      )
    }

    return optionsListBox
  }


  render() {
    const { isOpen } = this.state
    const { questionItem = {}, itemIndex, delTopic, copyTopic } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
            题目{itemIndex + 1}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#1890ff', }}>
            <div style={{ marginRight: '20px', cursor: 'pointer' }} onClick={this.onChangeShow}>
              {isOpen ? '收起' : '展开'}
            </div>
            <Popconfirm
              title="是否复制该题目?"
              onConfirm={() => copyTopic( itemIndex )}
              placement='left'
              okText="确定"
              cancelText="取消"
            >
              <span style={{ marginRight: 20, cursor: 'pointer' }}>复制</span>
            </Popconfirm>
            <div>
              <Popconfirm
                title="确认删除题目?"
                onConfirm={() => delTopic( itemIndex )}
                placement='left'
                okText="确定"
                cancelText="取消"
              >
                <span style={{ cursor: 'pointer', color: '#f5222d' }}>删除</span>
              </Popconfirm>
            </div>
          </div>
        </div>
        <div
          hidden={!isOpen}
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #d9d9d9'

          }}
        >
          <FormItem
            label={<span className={styles.labelText}><span>*</span>题目类型</span>}
            {...this.formLayout}
          >
            <Select
              style={{ width: 220 }}
              onSelect={( e ) => this.onChangeItemValue( e, 'topic' )}
              value={questionItem.topic}
              placeholder='请选择题目类型'
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {
                topicTypeList.map( item =>
                  <SelectOption key={item.key}>{item.value}</SelectOption>
                )
              }
            </Select>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>此题必填</span>} {...this.formLayout}>
            <Radio.Group
              onChange={( e ) => this.onChangeItemValue( e, 'answer' )}
              value={questionItem.answer}
            >
              <Radio value>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>题目名称</span>}
            {...this.formLayout}
          >
            <Input
              value={questionItem.title}
              placeholder="请输入题目"
              onChange={( e ) => this.onChangeItemValue( e, 'title' )}
            />
          </FormItem>
          {this.renderOptionsList()}
          {( questionItem.topic === 'SINGLE_CHOICE' || questionItem.topic === 'MULTIPLE_CHOICE' ) &&
            <Row style={{ padding: '20px 0' }}>
              <Col span={4} style={{ textAlign: 'right', paddingRight: 10, fontSize: 14, color: '#2290ff' }}>
                <span onClick={this.addOptionsItem}>添加选项</span>
              </Col>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 30, color: '#2290ff', fontSize: 14, }}>
                <span onClick={this.addOtherOptionsItem}>添加其他项</span>
              </Col>
            </Row>
          }

          {questionItem.topic === 'SCORE' &&
            <FormItem label='选择分制' {...this.formLayout}>
              <Radio.Group
                onChange={( e ) => this.onScoreChange( e )}
                value={( questionItem.optionsList && questionItem.optionsList.length > 0 ) ? questionItem.optionsList[0] : '5'}
              >
                <Radio value="5">五分制</Radio>
                <Radio value="10">十分制</Radio>
              </Radio.Group>
            </FormItem>
          }
        </div>
      </div>
    )
  }
}

export default QuestionItem;

