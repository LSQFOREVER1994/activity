import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Input, Button, Modal } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import DetailsList from './OwnerModal.Form'
import styles from '../Lists.less';
import { exportXlsx } from '@/utils/utils';

const { Search } = Input;
@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  productsRightsBelongs: strategyMall.productsRightsBelongs,
} ) )
@Form.create()
class Owner extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    searchValue: '',
    toolValue:'',
    batchFilterObj:{},
    visible:false,
    exportLoading:false
  };

  componentDidMount() {
    this.fetchList();
  }

  //  获取列表
  fetchList = () => {
    const { pageNum, pageSize, searchValue, toolValue } =this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getProductsRightsBelongs',
      payload: {
        pageNum,
        pageSize,
        username: searchValue,
        permissionName:toolValue
      },
    } );
  }

  // //  pageSize  变化的回调
  // onShowSizeChange = (current, pageSize) => {
  //   this.setState({ pageSize });
  //   this.fetchList(1, pageSize);
  // }

  // //  页码变化回调
  // changePageNum = (pageNumber) => {
  //   const { pageSize } = this.state;
  //   this.fetchList(pageNumber, pageSize);
  // }

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }

  onSearch = ( value, type ) =>{
    this.setState( { 
      pageNum: 1,
      pageSize: 10,
      [type]: value 
    }, ()=>this.fetchList() )
  }

  valueChange = ( value, type ) =>{
    const { searchValue, toolValue } = this.state;
    if( value === '' && value !== searchValue || value !== toolValue ){
      this.setState( {
        [type]: value,
        pageNum: 1,
        pageSize: 10,
      }, ()=>this.fetchList() )
    }
  }

  //  取消
  handleCancel = () => {
    this.setState( {
      batchFilterObj:{},
      visible: false,
    } );
  };

   clickExport = () => {
    const { searchValue, toolValue } = this.state;
    const uri = searchValue || toolValue ? `permissions/export?username=${searchValue}&permissionName=${toolValue}`  : 'permissions/export'
    this.setState( { exportLoading:true } )
    exportXlsx( {
        type:'strategyMallService',
        uri,
        xlsxName: '用户权益.xlsx',
        callBack:() => {
           this.setState( { exportLoading:false } )
        }
      } )
   }


  render() {
    const {
      loading, productsRightsBelongs: { total, list },
    } = this.props;

    const { pageSize, pageNum, exportLoading, batchFilterObj, visible } = this.state;

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      // onChange: this.changePageNum,
      // onShowSizeChange: this.onShowSizeChange,
    };

    const columns = [
      // {
      //   title: <span>{formatMessage({ id: 'strategyMall.productsRights.profilePhoto' })}</span>,
      //   dataIndex: 'profilePhoto',
      //   render: profilePhoto => <Avatar className={styles.imgBorder} src={profilePhoto} shape="square" size="large" />,
      // },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.nick' } )}</span>,
        dataIndex: 'user',
        render: user => <span>{user && user.username ? user.username : '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.tit' } )}</span>,
        dataIndex: 'permission',
        render: permission => <span>{permission && permission.name || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.expTime' } )}</span>,
        dataIndex: 'expTime',
        render: expTime => <span className={moment( expTime ).isAfter( new Date() ) ? '' : styles.errText}>{expTime}</span>,
      },
    ];
    const extraContent = (
      <div>
        <span>用户名：</span>
        <Search
          allowClear
          size="default"
          placeholder="请输入用户名"
          // value={searchValue}
          onChange={( e )=>this.valueChange( e.target.value, 'searchValue' )}
          onSearch={value => this.onSearch( value, 'searchValue' )}
          style={{ width: 200, marginRight:15 }}
        />

        <span>工具：</span>
        <Search
          allowClear
          size="default"
          placeholder="请输入工具名"
          // value={toolValue}
          onChange={( e )=>this.valueChange( e.target.value, 'toolValue' )}
          onSearch={value => this.onSearch( value, 'toolValue' )}
          style={{ width: 200, marginRight:15 }}
        />

        <Button 
          type="primary"
          onClick={this.clickExport}
          loading={exportLoading}
        >导出用户
        </Button>
      </div>
    )
    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          extra={extraContent}
          title={formatMessage( { id: 'menu.strategyMall.users' } )}
        > 
          <div className={styles.tableList}>
            <Table
              size="large"
              // scroll={{ y: 500 }}
              rowKey={item => `${item.permissionId}-${item.userId}`}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
              onRow={( record )=> {
                return {
                  // 点击行
                  onClick: event => {
                    event.stopPropagation()
                    this.setState( {
                      batchFilterObj:record,
                      visible:true
                    } )
                  },
                };
              }}
            />
          </div>
          
        </Card>

        <Modal
          maskClosable={false}
          title="用户权益详情"
          className={styles.standardListForm}
          width={1250}
          bodyStyle={{ padding: '28px' }}
          destroyOnClose
          visible={visible}
          onCancel={this.handleCancel}
          footer={false}
        >
          {visible&& <DetailsList batchFilterObj={batchFilterObj} />}
        </Modal>
      </GridContent>
    );
  }
}

export default Owner;