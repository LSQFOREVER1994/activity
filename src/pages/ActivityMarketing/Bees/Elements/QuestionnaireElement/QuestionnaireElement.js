import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, DatePicker, Radio, InputNumber, Collapse, Icon, Empty } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SketchPicker } from 'react-color';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import QuestionItem from './QuestionItem'
import PrizeTable from './PrizeTable';
import styles from './questionnaireElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;


const getListStyle = isDraggingOver => ( {
  background: isDraggingOver ? "rgba(216,178,105,0.1)" : "#fff",
} );

const getItemStyle = ( isDragging, draggableStyle ) => ( {
  userSelect: "none",
  background: isDragging ? "rgba(216,178,105,0.3)" : "#fff",
  ...draggableStyle,
} );

const reorderList = ( list, startIndex, endIndex ) => {
  const result = Array.from( list );
  const [removed] = result.splice( startIndex, 1 );
  result.splice( endIndex, 0, removed );

  return result;
};

@connect()
class QuestionnaireElement extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      pageBackgroundColorVisible: false, // 展示拾色板
      buttonColorVisible: false
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '问卷组件',
      withPrize: false,
      buttonWidth: 450,
      buttonHeight: 95,
      paddingLeft: 30,
      paddingRight: 30,
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    let val = e
    if ( e && e.target ){
      val = e.target.value
    }
    // 改变题目时更新排序值
    if ( type === 'question' && e && e.length > 0 ) {
      val = e.map( ( item, index ) => {
        return {
          ...item,
          sort: index + 1
        }
      } )
    }
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // 范围日期选择
  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 拾色板
  showBgColor = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Visible`
    this.setState( {
      [visibleType]: !this.state[visibleType]
    } )
  }

  // 色值
  changeColor = ( e, type ) => {
    const color = e.hex;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  hiddenColorModal = () => {
    this.setState( {
      pageBackgroundColorVisible: false,
      buttonColorVisible: false,
    } )
  }

  // 添加题目
  addTopic = () => {
    const { eleObj } = this.props;
    const { question = [] } = eleObj;
    const newList = question.concat( {
      isOpen: true,
      answer: true,
      virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
    } );
    this.changeInput( newList, 'question' )
    this.setState( { time: new Date() } )
  }

  // 删除题目
  delTopic = ( num ) => {
    const { eleObj } = this.props;
    const { question = [] } = eleObj;
    const newList = question.filter( ( item, index ) => {
      return index !== num
    } )
    this.changeInput( newList, 'question' )
    this.setState( { time: new Date() } )
  }


  // 复制题目
  copyTopic = ( num ) => {
    const { eleObj } = this.props;
    const { question = [] } = eleObj;
    const item = question[num]
    const newList = question.concat( {
      ...item,
      virtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
      isOpen: true,
      id: null,
    } );
    this.changeInput( newList, 'question' )
    this.setState( { time: new Date() } )
  }

  // 题目拖拽排序
  onDragEnd = ( result ) => {
    const { eleObj = {} } = this.props;
    if ( !result.destination ) {
      return;
    }
    const { question = [] } = eleObj;
    const newQuestion = reorderList( question, result.source.index, result.destination.index );
    this.changeInput( newQuestion, 'question' )
    this.setState( { time: new Date() } )
  }

  // 题目列表
  renderQuestionList = () => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const { question } = eleObj
    let listBox = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目，请添加题目" />
    if ( question && question.length > 0 ) {
      listBox = (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {( provided, snapshot ) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle( snapshot.isDraggingOver )}
              >
                {question.map( ( item, index ) => (
                  <Draggable key={item.id ? `${item.id}` : item.virtualId} draggableId={item.id ? `${item.id}` : item.virtualId} index={index}>
                    {( provided1, snapshot1 ) => (
                      <div
                        className={styles.quertionItem}
                        key={item.id ? `${item.id}` : item.virtualId}
                        ref={provided1.innerRef}
                        {...provided1.draggableProps}
                        {...provided1.dragHandleProps}
                        style={getItemStyle(
                          snapshot1.isDragging,
                          provided1.draggableProps.style
                        )}
                      >
                        <QuestionItem
                          domData={domData}
                          changeDomData={changeDomData}
                          eleObj={eleObj}
                          questionItem={item}
                          itemIndex={index}
                          delTopic={this.delTopic}
                          copyTopic={this.copyTopic}
                        />
                      </div>
                    )}
                  </Draggable>
                ) )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    }
    return (
      <div>
        <Collapse defaultActiveKey='cardOption'>
          <Panel header="问卷题目配置" key="cardOption">
            <div>
              {listBox}
            </div>
            <div
              className={styles.edit_active_add}
              onClick={() => this.addTopic()}
            >
              <Icon
                type="plus-circle"
                style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
              />添加题目
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }


  render() {
    const { pageBackgroundColorVisible, buttonColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
        <div onClick={this.hiddenColorModal} className={styles.cover} hidden={!( pageBackgroundColorVisible || buttonColorVisible )} />
        <FormItem
          label={<span className={styles.labelText}><span>*</span>组件名称</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.name}
            placeholder="请输入组件名称"
            onChange={( e ) => this.changeInput( e, 'name' )}
            maxLength={20}
          />
        </FormItem>

        <FormItem
          label='组件有效时间'
          {...this.formLayout}
        >
          <RangePicker
            style={{ width: '100%' }}
            showTime
            value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={( e ) => this.changeDate( e )}
          />
        </FormItem>
        <FormItem label={<span className={styles.labelText}><span>*</span>是否发奖</span>} {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'withPrize' )}
            value={eleObj.withPrize}
          >
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>填写问卷按钮</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.buttonImage} onChange={( e ) => this.changeInput( e, 'buttonImage' )} />
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
              <div>图片尺寸建议450px * 95px </div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem label='按钮图片宽' {...this.formLayout}>
          <InputNumber
            value={eleObj.buttonWidth}
            placeholder="请输入按钮宽度"
            min={0}
            onChange={( e ) => this.changeInput( e, 'buttonWidth' )}
            style={{ width: '50%' }}
          />
          <span style={{ paddingLeft: '10px' }}>px</span>
        </FormItem>
        <FormItem label='按钮图片高' {...this.formLayout}>
          <InputNumber
            value={eleObj.buttonHeight}
            placeholder="请输入按钮高度"
            min={0}
            onChange={( e ) => this.changeInput( e, 'buttonHeight' )}
            style={{ width: '50%' }}
          />
          <span style={{ paddingLeft: '10px' }}>px</span>
        </FormItem>
        <FormItem
          label="问卷标题"
          {...this.formLayout}
        >
          <Input
            value={eleObj.title}
            placeholder="请输入问卷标题"
            onChange={( e ) => this.changeInput( e, 'title' )}
            maxLength={15}
            suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( eleObj && eleObj.title && eleObj.title.length ) || 0}/15</span>}
          />
        </FormItem>

        <FormItem
          label='问卷描述'
          {...this.formLayout}
        >
          <Input
            value={eleObj.description}
            placeholder="请输入问卷描述"
            onChange={( e ) => this.changeInput( e, 'description' )}
            maxLength={50}
            suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( eleObj && eleObj.description && eleObj.description.length ) || 0}/50</span>}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>问卷页/结果页banner</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.banner} onChange={( e ) => this.changeInput( e, 'banner' )} />
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
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>

        <FormItem
          label="问卷页/结果页背景色"
          {...this.formLayout}
        >
          <span
            style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
            onClick={( e ) => { this.showBgColor( e, 'pageBackgroundColor' ) }}
          >
            <span style={{ display: 'inline-block', background: eleObj.pageBackgroundColor, width: 116, height: '22px' }} />
          </span>

          {pageBackgroundColorVisible &&
            <div style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}>
              <SketchPicker
                width="230px"
                disableAlpha
                color={eleObj.pageBackgroundColor}
                onChange={( e ) => this.changeColor( e, 'pageBackgroundColor' )}
              />
            </div>
          }
        </FormItem>
        <FormItem
          label="问卷页/结果页按钮色"
          {...this.formLayout}
        >
          <span
            style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
            onClick={( e ) => { this.showBgColor( e, 'buttonColor' ) }}
          >
            <span style={{ display: 'inline-block', background: eleObj.buttonColor, width: 116, height: '22px' }} />
          </span>

          {buttonColorVisible &&
            <div style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}>
              <SketchPicker
                width="230px"
                disableAlpha
                color={eleObj.buttonColor}
                onChange={( e ) => this.changeColor( e, 'buttonColor' )}
              />
            </div>
          }
        </FormItem>
        {this.renderQuestionList()}
        {eleObj.withPrize &&
          <div style={{ marginTop: '20px' }}>
            <PrizeTable
              domData={domData}
              changeDomData={changeDomData}
              eleObj={eleObj}
            />
          </div>
        }
        <div style={{ marginTop: '20px' }}>
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

export default QuestionnaireElement;
