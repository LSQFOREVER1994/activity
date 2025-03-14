import React, { PureComponent } from "react";
import { connect } from 'dva';
import moment from "moment";
import { Card, Form, Button, Table, Popconfirm, Switch, message } from 'antd';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BatchFilterForm from './BatchFilterForm';
import AddModal from "./AddModal";
import styles from '../product.less';

// const FormItem = Form.Item;

@connect( ( { product } ) => ( {
  goodsCategory: product.goodsCategory,
  loading: product.loading,
  } ) )
@Form.create()
class ProductClassify extends PureComponent {
    state = {
      pageNum: 1,
      pageSize: 10,
      visible: false,
      current: {},
    };

    componentDidMount () {
      this.fetchList();
    }

    fetchList = () => {
      const { dispatch } = this.props;
      const formValue = this.filterForm ? this.filterForm.getValues() : {};
      const { name, state, createTime } = formValue;
      let start ='';
      let end = '';
      if ( createTime ) {
        start = moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' );
        end = moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' );
      }
      console.log( 'time', createTime );
      const { pageSize, pageNum } = this.state;
      dispatch( {
        type: 'product/getGoodsCategoryList',
        payload: {
          pageSize,
          pageNum,
          name,
          state,
          start,
          end
        }
      } );
    }

    // 筛选表单提交 请求数据
    filterSubmit = () => {
      this.setState( {
        pageNum: 1
      }, () => {
        this.fetchList();
      } )
    }

      //  显示添加 Modal
    showAddModal = () => {
      this.setState( {
        visible: true,
      } );
    };

    cancelModal = ( bool ) => {
      this.setState( {
        visible: false,
        current: {}
      } )
      if ( bool ) {
        this.fetchList();
      }
    }

    showEditModal= ( e, item ) => {
      e.stopPropagation();
      this.setState( {
        current: item,
        visible: true,
      } )
    }

    deleteItem = ( e, item ) => {
      e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/deleteGoodsCategory',
      payload: { id },
      callFunc: () => {
       message.info( '删除商品分类成功' );
        this.setState( {
          pageNum: 1,
        }, () =>{
          this.fetchList();
          } );
      }
    } );
    }

    changeStatus = ( item ) => {
      const { dispatch } = this.props;
      const { id, state, name } = item;
      dispatch( {
        type: 'product/editGoodCategory',
        payload: { id, state: !state },
        callFunc: (  ) => {
          message.info( `${state ? `成功下架` : '成功上架'}${name}!` );
          this.fetchList();
        },
      } );
    }

    render () {
      const { goodsCategory: { total, list }, loading } = this.props;
      const { pageNum, pageSize, visible, current } = this.state;
      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize,
        total,
        current: pageNum
      };
      const columns = [
        {
          title: <span>商品分类</span>,
          dataIndex: 'name',
          render: name => <span>{name}</span>,
        },
        {
          title: <span>创建时间</span>,
          dataIndex: 'createTime',
          key: 'createTime',
          // sorter: true,
          // sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
          // sortDirections: ['descend', 'ascend'],
          render: createTime => <span>{createTime || '-'}</span>,
        },
        {
          title: <span>更新时间</span>,
          dataIndex: 'updateTime',
          render: updateTime => <span>{updateTime || '-'}</span>,
        },
        {
          title: <span>是否上架</span>,
          dataIndex: 'state',
          key: 'state',
          // sorter: true,
          // sortOrder: sortedInfo.columnKey === 'shelf' && sortedInfo.order,
          // sortDirections: ['descend', 'ascend'],
          // render: shelf => <span>{shelfObj[shelf]}</span>,
          render: ( state, item ) => (
            <Popconfirm placement="top" title={state ? '确定下架该商品分类？' : '确定上架该商品分类？'} onConfirm={() => this.changeStatus( item )} okText="是" cancelText="否">
              <Switch checked={state} checkedChildren="上架" unCheckedChildren="下架" />
            </Popconfirm>
          ),
        },
        {
          title: <span>操作</span>,
          dataIndex: 'id',
          fixed: 'right',
          width: 90,
          render: ( id, item ) => (
            <div>
              <span
                style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
                type="link"
                onClick={( e ) => this.showEditModal( e, item )}
              >编辑
              </span>

              <Popconfirm placement="top" title="确定删除该商品分类？" onConfirm={( e ) => this.deleteItem( e, item )} okText="是" cancelText="否">
                <span
                  style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
                  type="link"
                >
                  删除
                </span>
              </Popconfirm>


            </div>
          ),
        },
      ];
        return (
          <GridContent>
            <div>
              <Card
                bordered={false}
                title="商品分类"
                bodyStyle={{ padding: '20px 32px 40px 32px' }}
              >
                <BatchFilterForm
                  filterSubmit={this.filterSubmit}
                  wrappedComponentRef={( ref ) => { this.filterForm = ref }}
                />
                <div className={styles.btns}>
                  <Button
                    type="dashed"
                    style={{ width: '100%', marginBottom: 8, marginRight: 15 }}
                    icon="plus"
                    onClick={() => this.showAddModal()}
                    ref={component => {
                  /* eslint-disable */
                  this.addProBtn = findDOMNode(component);
                  /* eslint-enable */
                }}
                  >
                    新建
                  </Button>
                </div>
                <Table
                  size="large"
                  scroll={{ x: 1300 }}
                  rowKey="id"
                  columns={columns}
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  onChange={this.tableChange}
                />
              </Card>
            </div>
            <AddModal data={current} visible={visible} dispatch={this.props.dispatch} cancel={this.cancelModal} />
          </GridContent>

        )
    }
}

export default ProductClassify;
