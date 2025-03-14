
import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Table, Modal, Form, Input, Radio, Button, Popconfirm, InputNumber, message } from 'antd';
import { SketchPicker } from 'react-color';
import UploadModal from '@/components/UploadModal/UploadModal';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import styles from './chatElement.less';

// @connect( ( { component } ) => {
//   return {
//     loading: component.loading,
//     componentList: component.componentList,
//   }
// } )

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

@Form.create()

class ComponentList extends PureComponent {
  state = {
    chatItem: {},
    selectIndex: -1,
    chatItemVisible: false
  };

  componentDidMount() {
    this.initData();
  };

  initData = () => { // 对对话框进行排序
    const { eleObj } = this.props;
    if( eleObj.chatItemList && eleObj.chatItemList.length ) {
      const list = eleObj.chatItemList.sort( ( item1, item2 ) => item1.sort - item2.sort )
      this.changeDom( list )
    }
  }

  onChatModalConfirm = () => {
    const { chatItem, selectIndex } = this.state;
    const { eleObj: { chatItemList = [] } } = this.props;
    const list = [...chatItemList]
    this.props.form.validateFields( ( err, values ) => {
      let hasErr = err
       if( !values.content||values.content==='<p></p>' ){
         message.error( '请输入对话内容' )
        hasErr=true
       }
      if ( !hasErr ) {
        const param = { ...chatItem, ...values }
        this.setState( {
          chatItem: param
        } )
        if( selectIndex > -1 ) {
          // 编辑
          list.splice( selectIndex, 1, param )
        } else {
          // 新增
          list.push( param )
        }
        list.sort( ( item1, item2 )=>( item1.sort - item2.sort ) )
        this.changeDom( list )
      }
    } );
  }

  changeDom = ( list ) => {
    // 更新总数据
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { chatItemList: list } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( {
      chatItemVisible: false,
      selectIndex: -1,
      time: new Date().getTime()
    } )
  }

  changeItem = ( e, name ) => {
    const { chatItem } = this.state;
    const val = e.hex || e;
    chatItem[name] = val;
    this.setState( {
      chatItem: Object.assign( {}, chatItem )
    } )
  }

  // 拾色板
  showBgColor = ( e, type ) => {
    e.stopPropagation()
    if( type ) {
      const visibleType = `${type}Visible`
      this.setState( {
        [visibleType]: !this.state[visibleType]
      } )
    } else {
      this.setState( {
        textColorVisible: false,
        backgroundVisible: false,
      } )
    }
  }

  onChatModalCancel = () => {
    this.setState( {
      chatItemVisible: false
    } )
  }

  handleShowModal = () => {
    this.setState( {
      chatItemVisible: true,
      selectIndex: -1,
      chatItem: { },
    } )
  }

  onEditItem = ( item, index ) => { // 编辑
    this.setState( {
      chatItemVisible: true,
      chatItem: { ...item },
      selectIndex: index
    } )
  }

  onDeleteItemChat = ( index ) => {
    const { eleObj: { chatItemList = [] } } = this.props;
    const list = [...chatItemList]
    list.splice( index, 1 )
    list.sort( ( item1, item2 )=>( item1.sort - item2.sort ) )
    this.changeDom( list )
  }

  render() {
    const { textColorVisible, backgroundVisible, chatItem, chatItemVisible } = this.state;
    const { loading, eleObj, form: { getFieldDecorator } } = this.props;


    const columns = [
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        key: 'sort',
        render: sort => <span>{sort}</span>,
      },
      {
        title: <span>内容</span>,
        dataIndex: 'content',
        key: 'content',
        width: 500,
        render: content => <div className={styles.content} dangerouslySetInnerHTML={{ __html: content || '' }} />,
      },
      {
        title: <span>头像位置</span>,
        dataIndex: 'position',
        key: 'position',
        render: position => <span>{Number( position ) ? '靠右' : '靠左'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'name',
        fixed: 'right',
        // width: 210,
        render: ( name, item, index ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.onEditItem( item, index )}
            >编辑
            </span>
            <Popconfirm placement="top" title="是否确认删除该条内容" onConfirm={() => this.onDeleteItemChat( index )} okText="是" cancelText="否">
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

    const modalFooter = {
      okText: '保存',
      onOk: this.onChatModalConfirm,
      onCancel: this.onChatModalCancel,
    };

    return (
      <div>
        <Table
          size="middle"
          rowKey="type"
          columns={columns}
          loading={loading}
          dataSource={eleObj.chatItemList}
          pagination={false}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
          icon="plus"
          onClick={() => this.handleShowModal()}
        >
          新增
        </Button>
        <Modal
          title="新增"
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={chatItemVisible}
          {...modalFooter}
        >
          <div onClick={this.showBgColor} className={styles.cover} hidden={!( textColorVisible || backgroundVisible )} />
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="头像位置">
              {getFieldDecorator( 'position', {
                rules: [
                  {
                    required: true,
                    message: '请选择头像位置',
                  },
                ],
                initialValue: chatItem.position
              } )(
                <Radio.Group>
                  <Radio value={0}>靠左</Radio>
                  <Radio value={1}>靠右</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label="头像">
              {getFieldDecorator( 'profile', {
                rules: [
                  {
                    required: true,
                    message: '请选择头像',
                  },
                ],
                initialValue: chatItem.profile
              } )(
                <UploadModal onChange={( e ) => {this.changeItem( e, 'profile' )}} />
              )}
            </Form.Item>

            <Form.Item label="对话内容">
              {getFieldDecorator( 'content', {
                rules: [
                  {
                    required: true,
                    message: '请输入对话内容',
                  },
                ],
                initialValue: chatItem.content
              } )(

                <BraftEditor
                  record={chatItem.content}
                  onChange={( e ) => this.changeItem( e, 'content' )}
                  field="content"
                  contentStyle={{ height: '250px' }}
                />
                // <Input.TextArea />
              )}
            </Form.Item>

            <Form.Item label="对话框底色">
              <div>
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                  onClick={( e ) => { this.showBgColor( e, 'background' ) }}
                >
                  <span style={{ display: 'inline-block', background: chatItem.background, width: 116, height: '22px' }} />
                </span>

                {
                    backgroundVisible &&
                    <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                      <SketchPicker
                        width="230px"
                        disableAlpha
                        color={chatItem.background}
                        onChange={( e ) => { this.changeItem( e, 'background' ) }}
                      />
                    </div>
                  }
              </div>
            </Form.Item>
            {/* <Form.Item label="文字颜色">
              <div>
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                  onClick={( e ) => { this.showBgColor( e, 'textColor' ) }}
                >
                  <span style={{ display: 'inline-block', background: chatItem.textColor, width: 116, height: '22px' }} />
                </span>

                {
                    textColorVisible &&
                    <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                      <SketchPicker
                        width="230px"
                        disableAlpha
                        color={chatItem.textColor}
                        onChange={( e ) => { this.changeItem( e, 'textColor' ) }}
                      />
                    </div>
                  }
              </div>
            </Form.Item> */}
            <Form.Item label="排序">
              {getFieldDecorator( 'sort', {
                rules: [
                  {
                    required: true,
                    message: '请输入排序',
                  },
                ],
                initialValue: chatItem.sort
              } )(
                <InputNumber min={1} precision={0} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
}

export default ComponentList;
