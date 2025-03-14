import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Tooltip, Form, Modal, Input, message, Select, List, InputNumber, Alert } from 'antd';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../education.less';
/* eslint-disable react/no-array-index-key  */

const FormItem = Form.Item;
const ListItem = List.Item;
const { confirm } = Modal;
const { Option } = Select;
const SelectOption = Select.Option;


@connect( ( { course } ) => ( {
  loading: course.loading,
  tagsListResult: course.tagsListResult,
  testPaperListResult: course.testPaperListResult,
  allSubjectsResult: course.allSubjectsResult
} ) )
@Form.create()

class TestPaperList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    listType: 'FIXED',
    choices: Array( 4 ),
    subjectList: [],
    bgImg: '',
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getTagsList',
      payload: {
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
        callFunc: () => {
          const { tagsListResult: { list } } = this.props;
          const { pageSize, pageNum, listType } = this.state;
          if ( list.length > 0 ) {
            this.fetchList( { pageSize, pageNum, listType } );

          }
        }
      }
    } )
    this.getAllSubjects( { pageSize:1000 } );
  };

  fetchList = ( { pageSize, pageNum, listType } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getTestPaperList',
      payload: {
        pageSize,
        pageNum,
        orderBy: 'id desc',
        type: listType
      }
    } );
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    const { listType } = this.state;
    this.fetchList( { pageNum: current, pageSize, listType } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  获取所有题目
  getAllSubjects = ( params ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getAllSubjects',
      payload: { ...params }
    } );
  }

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {
    const { dispatch } = this.props;
    const { listType, subjectList } = this.state;
    const $this = this;
    dispatch( {
      type: 'course/getTestPaperDetail',
      payload: {
        id,
        callFunc: ( result ) => {
          if ( listType === 'FIXED' ) {
            result.questions.map( item => {
              return subjectList.push( {
                questionId: item.id,
                sortOrder: item.sortOrder,
                questionPackageId: result.id,
                content: item.content
              } )
            } )
          }
          $this.setState( {
            visible: true,
            current: result,
            subjectList,
            bgImg: result.bgImg,
          } );
        },
      }
    } )
  };

  //  取消
  handleCancel = () => {
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      current: undefined,
      subjectList: []
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, listType, subjectList, bgImg
    } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, fieldsValue, { update: true }, { id } ) : { ...fieldsValue };
      if ( listType === 'FIXED' ) {
        if ( subjectList.length === 0 ) {
          message.error( '请选择题目' );
          return;
        }
        params.questionPackageItems = subjectList;
      }
      params.type = listType;
      const isUpdate = !!id;
      if ( params.bgColor ) {
        params.bgColor = `#${  params.bgColor}`;
      }
      if ( params.themeColor ) {
        params.themeColor = `#${  params.themeColor}`;
      }
      params.bgImg = bgImg;
      console.log( params );
      dispatch( {
        type: 'course/submitTestPaper',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, listType } );
            $this.setState( {
              visible: false,
              current: undefined,
              subjectList: []
            } );
          },
        },
      } );
    } );
  };

  // 删除文章
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum } = this.state;
    const { listType } = this.state;
    const { dispatch } = this.props;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: '确定删除该试卷',
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delTestPaper',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum, listType } );
              $this.setState( { pageSize, pageNum, listType } )
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  // 改变产品状态
  changeListType = ( value ) => {
    const listType = value;
    const { pageNum, pageSize } = this.state;
    this.fetchList( { pageNum, pageSize, listType } );
    this.setState( { listType } )
  }

  //  获取课程名称
  getCourseName = ( tagsId ) => {
    const { tagsListResult: { list } } = this.props;
    return list.find( item => item.id === parseInt( tagsId, 10 ) ) ? list.find( item => item.id === parseInt( tagsId, 10 ) ).name : ''
  }

  //  选项更改
  choiceChange = ( e, index ) => {
    const { value } = e.target;
    const { choices } = this.state;
    choices.fill( value, index, index + 1 );
    this.setState( { choices } )
  }

  //  选择题目
  onSubjectSelect = ( value ) => {
    let { subjectList } = this.state;
    const { allSubjectsResult: { list } } = this.props;
    list.forEach( o => {
      if ( o.id === value ) {
        subjectList.push( {
          questionId: value,
          sortOrder: 1,
          content: o.content
        } );
      }
    } );
    subjectList = _.uniqBy( subjectList, 'questionId' )
    this.setState( { subjectList } );
  }

  //  选择题目
  onSubjectSearch = ( value ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getAllSubjects',
      payload: {
        pageSize: 10000,
        pageNum: 1,
        content: value
      }
    } );
  }

  //  更改序值
  onSortChange = ( value, id ) => {
    const { subjectList } = this.state;
    const subjct = subjectList.find( o => o.questionId === id );
    subjct.sortOrder = value;
    subjectList.push( subjct )
    this.setState( { subjectList: _.uniqBy( subjectList, 'questionId' ) } );
  }

  //  移除题目
  deleteSubject = ( id ) => {
    let { subjectList } = this.state;
    subjectList = _.filter( subjectList, ( o ) => { return o.questionId !== id} );
    this.setState( { subjectList } );
  }

  render() {
    const { loading, testPaperListResult: { total, list }, form: { getFieldDecorator }, tagsListResult, allSubjectsResult } = this.props;
    const { pageSize, pageNum, visible, current = {}, listType, subjectList, bgImg } = this.state;
    const tagsList = tagsListResult.list || [];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: "保存",
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <span>类型：</span>
        <Select onChange={this.changeListType} defaultValue={listType}>
          <Option value="FIXED">固定</Option>
          <Option value="DYNAMIC">动态</Option>
        </Select>
      </div>
    );

    const tagColumns = listType === 'FIXED' ? [] :
      [
        {
          title: <span>标签名称</span>,
          dataIndex: 'tagId',
          render: tagId => <span>{this.getCourseName( tagId )}</span>,
        },
      ];

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>类型</span>,
        dataIndex: 'type',
        render: type => <span>{type === 'DYNAMIC' ? '动态' : '固定'}</span>,
      },
      ...tagColumns,
      {
        title: <span>创建时间</span>,
        dataIndex: 'createAt',
        render: createAt => <span>{createAt}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: id => (
          <div>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={() => this.showEditModal( id )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
            >删除
            </span>
            <span
              style={{ cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => window.open( `${serviceObj.answerUrl}${id}`, '_blank', 'width=375,height=667,top=0,right=0,scrollbars=no' )}
            >
              链接
            </span>
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="试卷列表"
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable={false}
          title={Object.keys( current ).length > 0 ? '编辑试卷' : '添加试卷'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            { listType === 'FIXED' ? (
              <div>
                <FormItem label='名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: '请输入名称' }],
                  initialValue: current.name,
                } )(
                  <Input placeholder='请输入名称' />
                )}
                </FormItem>
                <FormItem label="选择题目" {...this.formLayout}>
                  {getFieldDecorator( 'questionIds', {
                  initialValue: current.questionIds,
                } )(
                  <Select
                    showSearch
                    autoClearSearchValue
                    placeholder="请选择题目"
                    optionFilterProp="children"
                    onSelect={this.onSubjectSelect}
                    // onSearch={this.onSubjectSearch}
                    filterOption={( input, option ) =>
                      option.props.children.indexOf( input ) >= 0
                    }
                  >
                    {allSubjectsResult.list && allSubjectsResult.list.map( item =>
                      <Option key={item.id} value={item.id}>{item.content}</Option>
                    )}
                  </Select>
                )}
                </FormItem>
                <FormItem label="题目" {...this.formLayout}>
                  {getFieldDecorator( 'questionPackageItems', {
                  initialValue: current.questions,
                } )(
                  <List
                    itemLayout="horizontal"
                    dataSource={_.sortBy( subjectList, ['sortOrder'] )}
                    renderItem={item => (
                      <ListItem
                        actions={[
                          <Tooltip title='排序'>
                            <InputNumber min={1} style={{ width: 70 }} precision={0} value={item.sortOrder} onChange={( value ) => {this.onSortChange( value, item.questionId )}} />
                          </Tooltip>,
                          <Tooltip title='删除'>
                            <Button
                              style={{ display: 'block', marginTop: '10px' }}
                              type="danger"
                              shape="circle"
                              icon="delete"
                              onClick={() => this.deleteSubject( item.questionId )}
                            />
                          </Tooltip>
                        ]}
                      >
                        <span style={{ width: 450 }}>{item.content}</span>
                      </ListItem>
                    )}
                  />
                )}
                </FormItem>
              </div>
            ) : (
              <div>
                <FormItem label="名称" {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: "请输入名称" }],
                  initialValue: current.name,
                } )(
                  <Input placeholder="请输入名称" />
                )}
                </FormItem>

                <FormItem label='标签' {...this.formLayout}>
                  {getFieldDecorator( 'tagId', {
                  rules: [{ required: true, message: '请选择标签' }],
                  initialValue: current.tagId ? current.tagId.toString() : '',
                } )(
                  <Select
                    placeholder='请选择标签名'
                  >
                    {tagsList.map( course =>
                      <SelectOption key={course.id}>{course.name}</SelectOption>
                    )}
                  </Select>
                )}
                </FormItem>
                <FormItem label='题目数量' {...this.formLayout}>
                  {getFieldDecorator( 'randomNum', {
                    rules: [{ required: false }],
                    initialValue: current.randomNum || 10,
                  } )(
                    <InputNumber style={{ width: '100%' }} min={1} placeholder='请输入题目数量' />
                  )}
                </FormItem>
              </div>
            )
          }
            <FormItem label="顶部图" {...this.formLayout}>
              {getFieldDecorator( 'banner', {
                rules: [{ required: false }],
                initialValue: current.banner,
              } )(
                <UploadImg />
              )}
            </FormItem>
            {/* <FormItem label="背景图" {...this.formLayout} style={{ display: 'none' }}>
              {getFieldDecorator( 'bgImg', {
                rules: [{ required: false }],
              } )(
                <UploadImg />
              )}
            </FormItem> */}
            <FormItem label='背景填充色' {...this.formLayout}>
              {getFieldDecorator( 'bgColor', {
                rules: [{ required: false }],
                initialValue: current.bgColor,
              } )(
                <Input maxLength={6} addonBefore="#" placeholder='请输入背景填充色' />
              )}
            </FormItem>
            <FormItem label='主题色' {...this.formLayout}>
              {getFieldDecorator( 'themeColor', {
                rules: [{ required: false }],
                initialValue: current.themeColor,
              } )(
                <Input maxLength={6} addonBefore="#" placeholder='请输入主题色' />
              )}
            </FormItem>
            <FormItem label='结果页按钮文字' {...this.formLayout}>
              {getFieldDecorator( 'resultBtn', {
                rules: [{ required: false }],
                initialValue: current.resultBtn,
              } )(
                <Input maxLength={20} placeholder='请输入结果页按钮文字' />
              )}
            </FormItem>
            <FormItem label='结果页按钮跳转链接' {...this.formLayout}>
              {getFieldDecorator( 'resultBtnLink', {
                rules: [{ required: false }],
                initialValue: current.resultBtnLink,
              } )(
                <Input maxLength={255} placeholder='请输入结果页按钮跳转链接' />
              )}
            </FormItem>
            <FormItem label='结果页提示文案' {...this.formLayout}>
              {getFieldDecorator( 'resultTip', {
                rules: [{ required: false }],
                initialValue: current.resultTip,
              } )(
                <Input maxLength={255} placeholder='请输入结果页提示文案' />
              )}
            </FormItem>
            <FormItem
              style={{ paddingTop: 20 }}
              extra={( <div>*埋点统计用于记录用户参与活动、查看我的奖品、查看活动规则、完成任务等数据</div> )}
              label='埋点统计'
              {...this.formLayout}
            > <Alert
              style={{ position:'absolute', top: -40, width:'100%' }}
              className={styles.edit_alert}
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <span>埋点统计需要先添加关联活动并创建appid</span>
                  <u style={{ color: '#1890FF', cursor:'pointer' }} onClick={() => { window.open( `${window.location.origin}/statistics/app` )}}>数据运营-埋点统计</u>
                </div> )}
            />
              {getFieldDecorator( 'statAppId', {
                initialValue: current.statAppId,
              } )( <Input placeholder='请输入活动对应的appid，用于统计活动参与人数' /> )}
            </FormItem>
          </Form>
        </Modal>
      </GridContent>
    );
  };
}

export default TestPaperList;
