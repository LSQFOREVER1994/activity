/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Modal, Button, Input, Empty, Form, Message } from 'antd';
import { connect } from 'dva';


const FormItem = Form.Item;

@connect( ( { library } ) => {
  return {
    classList: library.classList,
  }
} )
class ClassManage extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      editClassList: []
    }
  }


  componentWillReceiveProps( nextProps ) {
    if ( this.state.editClassList !== nextProps.editClassList ) {
      this.setState( {
        editClassList: nextProps.editClassList
      } );
    }
  }

  handleOk = () => {
    const { editClassList } = this.state
    const { dispatch, handleCancel, getClassList, mediaType, libraryType } = this.props;
    const emtry = editClassList.find( item => !item.name );
    if ( emtry ) {
      Message.error( '请输入分类名' );
      return;
    }
    dispatch( {
      type: 'library/editCategoryAll',
      payload: {
        libraryType,
        categoryList: editClassList,
        type: mediaType
      },
      callFunc: () => {
        handleCancel()
        getClassList()
        this.setState( {
          editClassList: []
        } )
      }
    } );
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel()
    this.setState( {
      editClassList: []
    } )
  }



  // 删除
  onDelete = ( indexNum ) => {
    const { editClassList } = this.state
    Modal.confirm( {
      content: '是否删除该分类（删除后分类下素材自动移入未分组）',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        let newEditClassList = editClassList
        if ( !editClassList.length || editClassList.length === 1 ) {
          newEditClassList = []
        } else if ( editClassList.length > 1 ) {
          newEditClassList = editClassList.filter( ( i, index ) => {
            return index !== indexNum
          } )
        }
        this.setState( {
          editClassList: [...newEditClassList]
        } )
      },
      onCancel:() => {
        console.log( 'Cancel' );
      },
    } )
  }

  // 编辑
  changeInput = ( e, indexNumber ) => {
    const val = e.target.value
    const { editClassList } = this.state
    const newEditClassList = editClassList.map( ( info, index ) => {
      return index === indexNumber ? { ...info, name: val } : info
    } )
    this.setState( {
      editClassList: [...newEditClassList]
    } )
  }


  // 添加 TODO: mediaType 后续需判断增加那个类型的分类
  addtem = () => {
    const { editClassList } = this.state
    const { mediaType } = this.props;
    const newEditClassList = [...editClassList, { name: '', mediaType }]
    this.setState( {
      editClassList: [...newEditClassList]
    } )
  }


  // 分类
  renderTypes = () => {
    const { editClassList } = this.state
    let view = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无分类，请去添加" />
    if ( editClassList && editClassList.length > 0 ) {
      view = editClassList.map( ( info, index ) => {
        return (
          <div style={{ flex: 1 }}>
            <FormItem
              label={`分类${index + 1}`}
              {...this.formLayout}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              <Input
                value={info.name}
                placeholder="请输入分类名称"
                onChange={( e ) => this.changeInput( e, index )}
                maxLength={10}
                style={{ width: '85%' }}
              />
              <span onClick={() => this.onDelete( index )} style={{ color: '#f5222d', cursor: 'pointer', marginLeft: '20px' }}>删除</span>
            </FormItem>
          </div>
        )
      } )
    }
    return view
  }


  render() {
    const { manageVisible } = this.props

    return (
      <Modal
        title={
          <div style={{ position: 'relative' }}>
            <div>分类管理</div>
            <Button type='primary' style={{ position: 'absolute', right: 30, top: 0 }} onClick={this.addtem}>新建分类</Button>
            <span style={{ fontSize: 12, color: '#cdcdcd' }}>点击保存后将会按照名称自动排序</span>
          </div>
        }
        width={600}
        visible={manageVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          {this.renderTypes()}
        </div>
      </Modal>
    )
  }

}

export default ClassManage;
