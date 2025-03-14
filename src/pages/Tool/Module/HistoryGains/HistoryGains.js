import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal, Avatar } from 'antd';
import moment from 'moment'
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../Lists.less';
import ModalForm from './HistoryGains.Form';
import HistoryDataList from './HistoryDataList'

const { confirm } = Modal;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  historyGainsData: tool.historyGainsData,
} ) )
@Form.create()
class HistoryGains extends PureComponent {
  state = {
    visible:false,
    info:{},
    modalType:'',
  };

  componentDidMount() {
    this.fetchList();
  }
  

  //  获取列表
  fetchList = ( params = {} ) => {
    const { dispatch } = this.props;
    // const { statusType, orderId } = this.state;
    dispatch( {
      type: 'tool/getHistoryGainsData',
      payload: {
        pageNum: 1,
        pageSize: 10,
        // orderBy: 'create_time desc',
        ...params
      },
    } );
  }

  handleOk = () => {
    this.fetchList()
  }

  // 删除数据
  deleteItem = ( data ) => {
    const { dispatch } = this.props;
    const { id, name } = data;
    const that = this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'tool/deleteHistoryGains',
          payload: { id },
          callFunc: () => {
            that.fetchList();
          },
        } );
      },

    } );
  }

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
  }


  valueChange = ( value ) => {
    const { pageNum, pageSize, orderId } = this.state;
    this.setState( { orderId: value } )
    if ( value === '' && value !== orderId ) {
      this.fetchList( { pageNum, pageSize, orderId: value } );
    }
  }

  // 显示模板
  showEditModal = ( options ) =>{
    const { data, type, infoId } = options;
    const { dispatch } = this.props;
    dispatch( {
      type:'tool/getHistoryCategoryDetail',
      payload:{ 
        id:data.id || infoId, 
        pageSize:100 
      },
      callFunc: ( info ) => {
        this.setState( { info, modalType:type, visible:true } )
      }
    } )
  }

   // 取消模板
  changeModal= () =>{
    const { visible } = this.state;
    this.setState( { visible:!visible, info:{} } )
  }

  render() {
    const {
      loading, historyGainsData: { list, total, pageNum }
    } = this.props;
    const { info, visible, modalType } = this.state;

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      // ...page,
      total,
      current: pageNum || 1,
    };

    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: formatMessage( { id: 'strategyMall.category.name' } ),
        dataIndex: 'name',
      },
      {
        title: 'Banner图片',
        dataIndex: 'banner',
        render: banner => <Avatar shape="square" size={50} src={banner} icon='user' />,
      },
      {
        title: '最新战绩开始时间',
        render: ( data ) => data.periods && data.periods.length > 0 ? <span>{moment( data.periods[0].start ).format( 'M/D' )}-{moment( data.periods[0].end ).format( 'M/D' )}</span> : '--'
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render: ( data ) => (
          <div>
            <span
              style={{ marginRight:15, cursor:'pointer', marginBottom:5, color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( { data, type:'historyGains' } )}
            >编辑
            </span>

            <span
              style={{ marginRight:15, cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( data )}
            >删除
            </span>
            
            <span
              style={{ cursor:'pointer', marginBottom:5, color:'rgb(27, 181, 87)' }}
              type="link"
              // onClick={() => this.showEditModal( data, 'historyDataList' )}
              onClick={()=>this.showEditModal( { data, type:'historyDataList' } )}
            >数据
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          title="历史战绩列表"
          bodyStyle={{ padding:'20px 30px' }}
        >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={() => { this.setState( { visible:true, info:{}, modalType:'historyGains' } )}}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button>
          <Table
            size="large"
            rowKey='id'
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
          {
            modalType === 'historyGains' ? 
            (
            ( visible && <ModalForm info={info} handleOk={this.handleOk} visible={visible} changeModal={this.changeModal}  /> ) 
            ):(
                ( visible && <HistoryDataList info={info} handleOk={this.handleOk} modelVisible={visible} changeModal={this.changeModal} showEditModal={this.showEditModal} /> )
            )
          }
        
        </Card>
      </GridContent>
    );
  }
}

export default HistoryGains;
