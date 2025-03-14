import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, InputNumber, Table, Button, Modal, message, Popconfirm } from 'antd';
import { SketchPicker } from 'react-color';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './tabElement.less';

const FormItem = Form.Item;

@connect()
class TabElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      activeColorVisible: false,
      tabItemModalVisible: false,
      eidtTabItem: {},
      isEdit: false,
      saveLoading: false,
    }
  }

  componentWillMount(){
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: 'Tab组件',
      fontSize: 32,
      activeColor: '#BF832E',
      paddingLeft:30,
      paddingRight:30,
      tabItems:[
        {
        title: "标题1",
        sort: 1,
        content: "<p>这里是内容</p>",
       },
       {
        title: "标题2",
        sort: 2,
        content: "<p>这里是内容</p>",
       },
       {
        title: "标题3",
        sort: 3,
        content: "<p>这里是内容</p>",
       },
      ]
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
    const val = e && e.target ? e.target.value : e;
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
    this.setState( { time: new Date() } )
  }

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

  // 展示文字拾色板
  showActiveColor = ( e ) => {
    e.stopPropagation()
    const { activeColorVisible } = this.state;
    this.setState( {
      activeColorVisible: !activeColorVisible
    } )
  }

  hiddenColorModal = () => {
    this.setState( {
      activeColorVisible: false
    } )
  }

  // 添加tab
  onAddTabItem = () => {
    const { eleObj = {} } = this.props
    const { tabItems } = eleObj
    if ( tabItems && tabItems.length >= 3 ) {
      message.error( '最多只能添加三个tab' )
      return
    }
    this.setState( {
      tabItemModalVisible: true
    } )
  }

  // 编辑tab
  onEditTabItem = ( e, item, index ) => {
    this.setState( {
      tabItemModalVisible: true,
      eidtTabItem: { ...item, index },
      isEdit: true
    } )
  }

  // 删除tab
  onDeleteTabItem = ( index ) => {
    const { domData, changeDomData, eleObj } = this.props
    const { tabItems = [] } = eleObj
    const newTabItems = [...tabItems]
    newTabItems.splice( index, 1 )
    newTabItems.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { tabItems: [...newTabItems] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
    // 关闭弹框
    setTimeout( () => {
      this.onTabItemModalCancel()
    }, 200 );
  }

  removeTag = ( str ) => {
    if ( str ) {
      return str.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/ig, '' ).replace( /\s/g, '' )
    }
    return ''

  }

  // Tab表格
  renderTabTable = () => {
    const { eleObj = {} } = this.props
    const { tabItems } = eleObj
    const columns = [
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        key: 'sort',
        render: sort => <span>{sort}</span>,
      },
      {
        title: <span>Tab标题</span>,
        dataIndex: 'title',
        key: 'title',
        render: title => <span>{title}</span>,
      },
      {
        title: <span>Tab内容</span>,
        dataIndex: 'content',
        key: 'content',
        render: content => <div className={styles.content}>{this.removeTag( content )}</div>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        width: 120,
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditTabItem( e, item, index )}
            > 编辑
            </span>
            <Popconfirm placement="top" title="是否确认删除该条内容" onConfirm={() => this.onDeleteTabItem( index )} okText="是" cancelText="否">
              <span
                style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
              >
                删除
              </span>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 500 }}>
          <span className={styles.labelText}><span>*</span>Tab列表</span>
        </div>
        <Table
          key='row'
          dataSource={tabItems || []}
          columns={columns}
          pagination={false}
          size='small'
        />
        <div>
          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10 }}
            icon="plus"
            onClick={() => this.onAddTabItem()}
          >
            添加Tab
          </Button>
        </div>
      </div>
    )
  }

  // 弹框确定
  onTabItemModalConfirm = () => {
    const { eidtTabItem, saveLoading } = this.state
    const { title, content, sort, index } = eidtTabItem
    if ( saveLoading ) return
    this.setState( {
      saveLoading: true
    } )
      if ( !title ) {
        message.error( '请输入TAB标题' )
          this.setState( {
            saveLoading: false
          } )
        return
      }
      if ( !content || content === '<p></p>' ) {
        message.error( '请输入TAB内容' )
          this.setState( {
            saveLoading: false
          } )
        return
      }
      if ( !sort ) {
        message.error( '请输入TAB排序' )
          this.setState( {
            saveLoading: false
          } )
        return
      }
      const { domData, changeDomData, eleObj } = this.props
      const { tabItems = [] } = eleObj
      let newTabItems = tabItems
      if ( index || index === 0 ) {
        // 编辑
        newTabItems.splice( index, 1, eidtTabItem )
      } else {
        // 新增
        newTabItems = [...tabItems, eidtTabItem]
      }
      newTabItems.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
      const elementsList = domData.elements ? domData.elements : []
      const newEleObj = Object.assign( eleObj, { tabItems: [...newTabItems] } );
      // 替换对应项
      const newElementsList = elementsList.map( item => {
        return item.virtualId === newEleObj.virtualId ? newEleObj : item;
      } );
      // 刷新总数据
      const newDomData = Object.assign( domData, { elements: newElementsList } );
      changeDomData( newDomData );
      this.setState( { time: new Date() } )
      // 关闭弹框
      setTimeout( () => {
        this.onTabItemModalCancel()
      }, 100 );
      setTimeout( () => {
        this.setState( {
          saveLoading: false  
        } )
      }, 200 );
  }
  
  // 弹框取消
  onTabItemModalCancel = () => {
    this.setState( {
      tabItemModalVisible: false,
      eidtTabItem: {},
      isEdit: false,
    } )
  }

  // 更新弹框数据
  changeEditInput = ( e, type ) => {
    const { eidtTabItem } = this.state
    let val
    if ( type === 'title' ) {
      val = e.target.value
    } else if ( type === 'sort' ) {
      if ( e && e >= 0 ) val = e
    } else {
      val = e
    }

    let obj = eidtTabItem
    if ( e ) obj = { ...eidtTabItem, [type]: val }
    this.setState( {
      eidtTabItem: { ...obj },
    } )
  }

  // Tab弹框
  renderTabItemModal = () => {
    const { tabItemModalVisible, eidtTabItem, isEdit } = this.state
    const modalFooter = {
      okText: '保存',
      onOk: this.onTabItemModalConfirm,
      onCancel: this.onTabItemModalCancel,
    };

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
        <FormItem
          label={<span className={styles.labelText}><span>*</span>TAB标题</span>}
          {...this.formLayout}
        >
          <Input
            value={eidtTabItem.title}
            placeholder="请输入TAB标题"
            onChange={( e ) => this.changeEditInput( e, 'title' )}
            maxLength={20}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>TAB内容</span>}
          {...this.formLayout}
        >
          <BraftEditor
            record={eidtTabItem.content}
            onChange={( e ) => this.changeEditInput( e, 'content' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>TAB排序</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={eidtTabItem.sort}
            placeholder="请输入排序"
            min={0}
            precision={0}
            onChange={( e ) => this.changeEditInput( e, 'sort' )}
            style={{ width: '50%' }}
          />
        </FormItem>
      </Modal>
    )
  }

  render() {
    const { activeColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
        <div
          onClick={this.hiddenColorModal}
          className={styles.cover}
          hidden={!activeColorVisible}
          style={{ top: 100 }}
        />
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
          label="标题文字大小"
          {...this.formLayout}
        >
          <InputNumber
            value={eleObj.fontSize}
            placeholder="请输入"
            min={0}
            precision={0}
            onChange={( e ) => this.changeInput( e, 'fontSize' )}
            style={{ width: '85%' }}
          />
          <span style={{ paddingLeft: '10px' }}>px</span>
        </FormItem>
        <FormItem
          label="标题激活颜色"
          {...this.formLayout}
        >
          <span
            style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
            onClick={( e ) => { this.showActiveColor( e ) }}
          >
            <span style={{ display: 'inline-block', background: eleObj.activeColor, width: 116, height: '22px' }} />
          </span>

          {activeColorVisible &&
            <div style={{ position: 'absolute', bottom: -200, left: 150, zIndex: 999 }}>
              <SketchPicker
                width="230px"
                disableAlpha
                color={eleObj.activeColor}
                onChange={( e ) => { this.changeColor( e, 'activeColor' ) }}
              />
            </div>
          }
        </FormItem>
        {this.renderTabTable()}
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        {/* 弹框 */}
        {this.renderTabItemModal()}
      </div>

    );
  }
}

export default TabElement;
