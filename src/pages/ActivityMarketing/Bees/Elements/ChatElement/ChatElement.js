import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import ChatTable from './ChatTable'
import serviceObj from '@/services/serviceObj';
import styles from './chatElement.less';

const FormItem = Form.Item;
@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList
} ) )
@Form.create()
class ChatElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  fundItemFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    super( props );
    this.state = {

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
      name: '对话框组件',
      chatItemList:[
        {
          background: "#FEFEFF",
          content: "<p><span style=\"color:#1a1a1a\">哈喽，早上好！</span></p>",
          profile: `${serviceObj.defaultImagePath}DHK_M.png`,
          position: 0,
          sort: 1,
        },
        {
          background: "#A9E97A",
          content: "<p><span style=\"color:#1a1a1a\">你好呀！</span></p>",
          profile: `${serviceObj.defaultImagePath}DHK_N.png`,
          position: 1,
          sort: 2,
        }
      ],
      paddingLeft: 30,
      paddingRight: 30,
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj  );
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
    const val = e.target.value
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
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <ChatTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
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

export default ChatElement;
