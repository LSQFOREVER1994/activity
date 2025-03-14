/* eslint-disable no-param-reassign */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Radio, Input, Button, Checkbox, Select, Empty, Tabs, Popconfirm, Tag, Upload, message } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadModal from '@/components/UploadModal/UploadModal';
import SearchBar from '@/components/SearchBar';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import QuestionTagList from './QuestionTagList';
import styles from './questionBank.less'

const { Option } = Select;
const { TabPane } = Tabs;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
@connect( ( { answer } ) => {
  return {
    loading: answer.loading,
    answerMap: answer.answerMap,
    searchTagListMap: answer.searchTagListMap,
  }
} )
@Form.create()

class Questions extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    operationVisible: false,
    operationItem: {}, // 选中的项
    answerList: [],
    fileObj: null, // 文件上传存放
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    tagOption: [],
  }

  searchBar = React.createRef()

  componentDidMount() {
    this.getAnswerList();
    this.SearchTagList()
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getAnswerList( data );
    } )
  }

  convertEmptyStringsToNull = ( obj = {} ) => {
    Object.keys( obj ).forEach( key => {
      if ( obj[key] === '' ) {
        obj[key] = null;
      }
    } );
    return obj;
  }

  // 获取题目列表
  getAnswerList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'answer/getAnswerList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        ...this.convertEmptyStringsToNull( data )
      },
    } );
  }

  // 获取活动列表
  SearchTagList = ( searchContent ) => {
    const { dispatch } = this.props;
    if ( this.timer ) clearTimeout( this.timer )
    this.timer = setTimeout( () => {
      dispatch( {
        type: 'answer/SearchTagList',
        payload: {
          query: {
            page:{
              pageNum: 1,
              pageSize: 100,
            },
            name: searchContent,
          },
          callFunc: ( res ) => {
            const tagOption = [{ label: '全部', value: '' }]
            res.forEach( item => {
              const obj = { label: item.name, value: item.id }
              tagOption.push( obj )
            } )
            this.setState( {
              tagOption
            } )
          }
        },
      } );
    }, 500 );
  }

  delAnswer = ( e, item ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'answer/delAnswer',
      payload: {
        query: {
          id: item.id,
        },
        callFunc: () => {
          this.getAnswerList( this.searchBar.current.data );
        }
      }
    } )
  }

  // 初始化选项数据选择
  initAnswerValue = () => {
    const { answerList } = this.state;
    const arr = []
    answerList.forEach( ( item, index ) => {
      if ( item.result ) {
        arr.push( index )
      }
    } )
    return arr
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getAnswerList( this.searchBar.current.data ) );
  };

  showModal = () => { // 弹窗展示
    this.SearchTagList();
    this.setState( {
      operationVisible: true,
      answerList: [],
    } )
  }

  onEditItem = ( e, item ) => { // 点击操作
    this.SearchTagList();
    this.setState( {
      answerList: JSON.parse( item.choice ),
      operationItem: item,
      operationVisible: true
    } )
  }

  addAnswerItem = () => { // 添加题目项
    const { answerList } = this.state;

    const param = {
      answer: '',
      result: false,
    }
    answerList.push( param )
    this.setState( {
      answerList: Object.assign( [], answerList ),
    } )
  }


  onChatModalConfirm = () => {
    const { answerList, selectTagObj, operationItem, fileObj,  } = this.state;
    const { dispatch, form: { validateFields }, loading } = this.props
    validateFields( ( err, value ) => {
      if ( !err ) {
        if ( loading ) return
        const choiceList = []
        answerList.forEach( ( item, index ) => {
          // 选项数组包含 当前题目则表示选中 则为true 否则为false
          if ( value.choice.includes( index ) ) {
            choiceList.push( {
              result: true,
              answer: item.answer
            } )
          } else {
            choiceList.push( {
              result: false,
              answer: item.answer
            } )
          }
        } )
        const params = { choiceList, ...value }
        params.tagList = selectTagObj
        const isUpdate = !!operationItem.id
        if ( isUpdate ) params.id = operationItem.id
        if ( isUpdate && !params.tagList ) {
          params.tagList = operationItem.tagList
        }
        delete params.choice
        if ( value.setting === 'IMPORT' && fileObj ) {
          const ids = params.tagList.map( item => item.id )
          this.fileUpload( ids, value.enable )
        } else if ( value.setting === 'IMPORT' && !fileObj ) {
          message.error( '请上传模版' )
        }
        if ( value.setting === 'INPUT' ) {
          dispatch( {
            type: 'answer/saveAnswer',
            payload: {
              query: params,
              callFunc: () => {
                this.getAnswerList( this.searchBar.current.data );
                this.setState( {
                  operationVisible: false,
                  operationItem: {},
                } )
              },
              isUpdate,
            }
          } );
        }
      }
    } )
  }

  fileUpload = ( ids, enable ) => {
    const { fileObj } = this.state;
    const { dispatch, loading } = this.props
    if ( loading ) return
    const formData = new FormData();
    formData.append( 'ids', ids );
    formData.append( 'enable', enable );
    if ( fileObj ) formData.append( 'file', fileObj );
    dispatch( {
      type: 'answer/saveAnswerModel',
      payload: {
        query: formData,
        callFunc: ( res ) => {
          if ( res ) {
            this.searchBar.current.handleReset()
            this.setState( {
              operationVisible: false,
              operationItem: {},
            } )
          } else {
            message.error( "文件上传失败！" );
          }
        }
      }
    } );
  }

  onChatModalCancel = () => {
    this.setState( {
      operationItem: {},
      operationVisible: false,
      fileObj: null
    } )
  }

  enterAnswerText = ( e, index ) => {
    // 选项输入
    e.persist()
    const { answerList } = this.state;
    const newList = Object.assign( [], answerList );
    newList[index].answer = e.target.value;
    this.setState( {
      answerList: newList
    } )
  }

  changeTabs = ( e ) => { // 切换tab
    if ( e === '1' ) {
      this.searchBar.current.handleReset()
    } else {
      setTimeout( () => {
        this.tagListRef.searchBar.current.handleReset()
      }, 200 );
    }
  }

  delAnswerItem = ( index ) => {
    const { answerList } = this.state;
    const newList = Object.assign( [], answerList );
    newList.splice( index, 1 )
    this.setState( {
      answerList: newList
    } )
  }

  selectChange = ( e, item ) => { // 选择标签时重新定义taglist，后端需要完整tag数据
    const selectTagObj = item.map( i => ( { name: i.props.children, id: i.key } ) )
    this.setState( {
      selectTagObj
    } )
  }

  handleDownModal = () => { // 答题模版下载
    window.open( 'https://xdtx-new-oss-cdn.cindasc.com/xlgj/excel/答题导入模板.xlsx' )
  }

  imgBeforeUpload = ( file ) => { // 文件上传后回调
    if ( file ) {
      message.success( '上传成功' )
      this.setState( {
        fileObj: file
      } )
    }
    return false // 方法中返回false，存储文件后手动上传
  }

  getItemTagList = ( item ) => {
    if ( !item || !item.tagList ) return []
    const { tagList } = item
    const tags = []
    if ( tagList.length ) {
      tagList.forEach( tag => {
        if ( tag.id ) {
          tags.push( `${tag.id}` )
        }
      } )
      return tags
    }
    return []
  }

  renderModal = () => {
    const { operationVisible, operationItem, answerList, fileObj } = this.state;
    const { form: { getFieldDecorator, getFieldValue }, searchTagListMap } = this.props;
    let newSearchList = [];
    if ( operationItem.id ) { // 编辑时展示标签
      const obj = {}
      const list = operationItem.tagList.concat( searchTagListMap );
      newSearchList = list.reduceRight( ( item, next ) => {
        // eslint-disable-next-line no-unused-expressions
        obj[next.name] ? '' : obj[next.name] = true && item.push( next )
        return item
      }, [] )
    } else {
      newSearchList = Object.assign( [], searchTagListMap )
    }
    const modalFooter = {
      okText: '保存',
      onOk: this.onChatModalConfirm,
      onCancel: this.onChatModalCancel,
    };
    return (
      <Modal
        title={`${operationItem.id ? '更新' : '新增'}题目`}
        width={840}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={operationVisible}
        {...modalFooter}
      >
        <div onClick={this.showBgColor} />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="设置方式" {...formLayout}>
            {getFieldDecorator( 'setting', {
              rules: [
                {
                  required: true,
                  message: '请选择设置方式',
                },
              ],
              initialValue: operationItem.setting || 'INPUT'
            } )(
              <Radio.Group disabled={operationItem.id}>
                <Radio value='INPUT'>录入</Radio>
                <Radio value='IMPORT'>导入</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {getFieldValue( 'setting' ) === 'INPUT' &&
            <div>
              <Form.Item label="题目" {...formLayout}>
                {getFieldDecorator( 'content', {
                  rules: [
                    {
                      required: true,
                      message: '请输入题目',
                    },
                  ],
                  initialValue: operationItem.content
                } )(

                  <BraftEditor
                    record={operationItem.content}
                    // onChange={( e ) => this.changeItem( e, 'content' )}
                    field="content"
                    contentStyle={{ height: '250px' }}
                  />
                )}
              </Form.Item>
              <Form.Item label="选项" {...formLayout}>
                {getFieldDecorator( 'choice', {
                  rules: [
                    {
                      required: true,
                      message: '请至少选择一项作为答案',
                    },
                  ],
                  initialValue: this.initAnswerValue()
                } )(
                  <Checkbox.Group style={{ width: '100%' }}>
                    {
                      answerList.length > 0 ?
                        answerList.map( ( item, index ) => (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4, width: '100%'
                            }}
                          >
                            <Checkbox value={index} />
                            <Input type="text" value={item.answer} className={styles.answerInput} onChange={( e ) => { this.enterAnswerText( e, index ) }} />
                            <Button type='danger' className={styles.answerDelBtn} onClick={() => { this.delAnswerItem( index ) }}>删除</Button>
                          </div>
                        ) ) : <Empty />
                    }
                    <Button
                      type="dashed"
                      style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
                      icon="plus"
                      onClick={this.addAnswerItem}
                    >
                      添加新选项
                    </Button>
                  </Checkbox.Group>
                )}
              </Form.Item>
              <Form.Item label="解析" {...formLayout}>
                {getFieldDecorator( 'resolve', {
                  initialValue: operationItem.resolve
                } )(
                  <Input.TextArea placeholder='请输入解析' maxLength={80} />
                )}
              </Form.Item>
              <Content
                imgBoxStyle={{ width: '100%', marginRight: 20 }}
                style={{ padding: '20px 0 10px 0' }}
              >
                <Form.Item label="答案提示图片" {...formLayout}>
                  {getFieldDecorator( 'resolveImage', {
                    initialValue: operationItem.resolveImage,
                  } )( <UploadModal /> )}
                </Form.Item>
              </Content>
            </div>
          }
          {getFieldValue( 'setting' ) === 'IMPORT' &&
            <div>
              <Form.Item label="模式选择" {...formLayout}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Upload 
                    beforeUpload={this.imgBeforeUpload} 
                    fileList={fileObj ? [fileObj] : []} 
                    accept='.xls,.xlsx'
                    onRemove={() => this.setState( { fileObj: null } )}
                  >
                    <Button icon='upload'>上传</Button>
                  </Upload>
                  <Button style={{ marginLeft: 20, marginTop: fileObj ? -29 : 0 }} onClick={this.handleDownModal} type='primary'>模版下载</Button>
                </div>
              </Form.Item>
            </div>
          }
          <Form.Item label="标签" {...formLayout}>
            {getFieldDecorator( 'tagList', {
              rules: [
                {
                  required: true,
                  message: '请选择标签',
                },
              ],
              initialValue: this.getItemTagList( operationItem )
            } )(
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择标签"
                onSearch={( e ) => { this.SearchTagList( e.trim() ) }}
                onBlur={() => { this.SearchTagList() }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                filterOption={false}
                onChange={this.selectChange}
              >
                {
                  newSearchList.map( item => {
                    if ( item.enable && item.id ) { return ( <Option key={item.id}>{item.name}</Option> ) }
                    return null
                  } )
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="是否启用" {...formLayout}>
            {getFieldDecorator( 'enable', {
              rules: [
                {
                  required: true,
                  message: '请选择是否启用',
                },
              ],
              initialValue: operationItem.enable ?? true
            } )(
              <Radio.Group>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { loading, answerMap: { total, list } } = this.props;
    const { pageSize, pageNum, sortedInfo, tagOption } = this.state;
    const searchEleList = [
      // {
      //   key: 'id',
      //   label: 'ID',
      //   type: 'InputNumber',
      //   maxLength: 100,
      //   max: 1000000,
      //   min: 0,
      //   precision: 0,
      // },
      {
        key: 'content',
        label: '题目',
        type: 'Input'
      },
      {
        key: 'enable',
        label: '状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '启用', value: 'true' },
          { label: '禁用', value: 'false' },
        ]
      },
      {
        key: 'tagId',
        label: '标签内容',
        type: 'Select',
        optionList: tagOption
      },
      {
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
      }
    ]

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };

    const columns = [
      // {
      //   title: <span>ID</span>,
      //   dataIndex: 'id',
      //   key: 'id',
      //   render: id => <span>{id}</span>,
      // },
      {
        title: <span>题目</span>,
        dataIndex: 'content',
        key: 'content',
        render: content => {
          return <span dangerouslySetInnerHTML={{ __html: content }} />
        },
        width:500
      },
      {
        title: <span>标签内容</span>,
        dataIndex: 'tagList',
        key: 'tagList',
        render: tagList => <span>{tagList.map( item => item.id && <Tag key={item.id} color='#1F3883'>{item.name}</Tag> )}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => {
          let showTime = '--'
          if ( createTime ) {
            showTime = moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        }
      },
      {
        title: <span>状态</span>,
        dataIndex: 'enable',
        key: 'enable',
        width: 100,
        render: enable => <span>{enable ? '启用' : '禁用'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'choice',
        fixed: 'right',
        // width: 210,
        render: ( choice, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditItem( e, item )}
            >修改
            </span>
            <span
              style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#f5222d' }}
            >
              <Popconfirm placement="top" title="是否确认删除该项" onConfirm={( e ) => this.delAnswer( e, item )} okText="是" cancelText="否">
                <span>删除</span>
              </Popconfirm>
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title=''
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
            <TabPane tab="题目列表" key="1">
              <SearchBar
                ref={this.searchBar}
                searchEleList={searchEleList}
                searchFun={this.filterSubmit}
                loading={loading}
              />
              <Button
                type="dashed"
                style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
                icon="plus"
                onClick={this.showModal}
              >
                添加新题目
              </Button>

              <Table
                size="middle"
                rowKey="id"
                columns={columns}
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                onChange={this.tableChange}
              />

            </TabPane>
            <TabPane tab="题目标签" key="2">
              <QuestionTagList refs={( ref ) => { this.tagListRef = ref }} />
            </TabPane>
          </Tabs>
        </Card>
        {this.renderModal()}
      </GridContent>
    );
  };
}

export default Questions;


const Content = ( props ) => {
  const { style = {} } = props;
  return (
    <div style={{ display: "flex", padding: '10px 0 0 0', ...style }}>
      <div
        style={{
          display: "flex",
          justifyContent: 'center',
          paddingLeft: '15%',
          fontSize: 13,
          color: '#999',
          alignItems: 'center'
        }}
      >
        <div style={{ width: '400px' }}>
          {props.children}
        </div>
        <div style={{ position: 'relative', top: -20, left: -150 }}>
          格式：jpg/jpeg/png
          <br />
          图片大小建议不大于1M
        </div>
      </div>
    </div>
  )
}
