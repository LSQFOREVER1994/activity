import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Form, Modal, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../education.less';

const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { course } ) => ( {
  loading: course.loading,
  tagsListResult: course.tagsListResult
} ) )
@Form.create()

class TagsList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    nameValue:''
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    this.fetchList( { pageNum, pageSize } );
  };

  fetchList = ( { pageSize, pageNum } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getTagsList',
      payload: {
        params: {
          pageSize,
          pageNum,
        },
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      nameValue:''
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {
    const { tagsListResult: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.setState( {
      visible: true,
      current: obj,
      nameValue:obj.name
    } );
  };

  nameChange=( e )=>{
    this.setState( { nameValue:e.target.value } )
  }

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
      nameValue:''
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum
    } = this.state;
    const id = current ? current.id : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const newObj = current ? JSON.parse( JSON.stringify( current ) ) : {};
      const params = id ? Object.assign( newObj, fieldsValue, { id } ) : { ...fieldsValue };
      const isUpdate = !!id;
      dispatch( {
        type: 'course/submitTags',
        payload: {
          params,
          isUpdate
        },
        callFunc: () => {
          $this.fetchList( { pageNum, pageSize } );
          $this.setState( {
            visible: false,
            current: undefined,
            nameValue:''
          } );
        },
      } );
    } );
  };

  // 删除课程
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum } = this.state;
    const { tagsListResult: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delTags',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum } );
              $this.setState( { pageSize, pageNum } )
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

  render() {
    const { loading, tagsListResult: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {}, nameValue } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.tags.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: id => (
          <div>
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( id )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, id )}
              ref={component => {
                /* eslint-disable */
                this[`delProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              删除
            </span>
            
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          {/* <Card 
            className={styles.listCard}
            bordered={false}
            title="标签列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          > */}
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8, marginTop:20 }}
            icon="plus"
            onClick={() => this.showAddModal()}
            ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
          >
            {formatMessage( { id: 'form.add' } )}
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
          {/* </Card> */}
        </div>
        {
          visible ? 
            <Modal
              maskClosable={false}
              title={Object.keys( current ).length > 0 ? '编辑标签' : '添加标签'}
              className={styles.standardListForm}
              width={1000}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem label={formatMessage( { id: 'strategyMall.tags.name' } )} {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tags.name' } )}` }],
                    initialValue: current.name,
                  } )( 
                    <Input 
                      placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tags.name' } )}`}
                      maxLength={10}
                      onChange={this.nameChange}
                    />
                  )}
                  <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/10</span>
                </FormItem>
              </Form>
            </Modal>
          : null
        }
     
      </GridContent>
    );
  };
}

export default TagsList;