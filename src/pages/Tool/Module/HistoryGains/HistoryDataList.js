import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal } from 'antd';
import moment from 'moment'
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';
import HistoryPeriod from './HistoryPeriodDataList'

const { confirm } = Modal;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  historyGainsPeriod:tool.historyGainsPeriod
} ) )
@Form.create()
class HistoryDataList extends PureComponent {
  state={
    pageNum:1,
    pageSize:10,
    visible:false,
    periodCurrent:{},
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  }

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  }

  // detailsForm = {}

  // constructor( props ){
  //   super( props );
  // }

  componentDidMount() {
    const { info } = this.props;
    const {  pageNum, pageSize, sortedInfo } = this.state;
    this.fetchPeriodList( { pageNum, pageSize, sortedInfo } )
    this.setState( { periodCurrent:info.periods } )
  }


  // 获取战绩详情列表
  fetchPeriodList= ( {  pageNum, pageSize, sortedInfo={} } ) => {
    const{ dispatch, info } = this.props;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'
    dispatch( {
      type: 'tool/getHistoryGainsPeriod',
      payload: {
        pageNum,
        pageSize,
        categoryId:info.id,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
      }
    } )
  }

  // 拿取子组件
  onRef = ( ref ) => {
    this.child = ref;
  }


  // 翻页;排序
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.fetchPeriodList( { pageNum: current, pageSize, sortedInfo: sotrObj  } );
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sorter,
    } );
  };


  //  取消子组件模板
  childchangeModal = () =>{
    const { visible } = this.state;
    this.setState( { visible:!visible } )
  }

  // 取消自身模板
  handleCancel = () => {
    this.props.changeModal()
  };

  // // 提交
  // handleSubmit = ( e ) => {
  //   e.preventDefault();
  //   this.child.handleSubmit( e )
  //   this.childchangeModal()
  //   // const {  form, dispatch } = this.props;
  //   // const { info } = this.state;
   
  //   // form.validateFields( ['id', 'name', 'banner', 'background'], ( err, values ) => {
  //   //   if( err ) return;
  //   //   this.setState( { loading:true } )
  //   //   dispatch( {
  //   //     type:'tool/submitHistoryCategory',
  //   //     payload:values,
  //   //     isUpdate: !!info.id,
  //   //     callFunc: ( data ) => {
  //   //       this.setState( { info: data, loading:false } )
  //   //       this.props.handleOk();
  //   //     }
  //   //   } )
  //   // } )
  // }




  // 显示编辑模板
  showEditModal = ( item ) =>{
    this.setState( {
      visible:true,
      periodCurrent:item,
    } )
  }


  detailPeriod = ( e, item ) => {
    e.stopPropagation();
    const { dispatch, showEditModal, info } = this.props;
    const { id, start, end } = item;
    const that = this;

    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：起止时间${moment( start ).format( 'MM/DD' )}--截止时间${moment( end ).format( 'MM/DD' )}`,
      onOk() {
        dispatch( {
          type: 'tool/deleteHistoryGainPeriod',
          payload: { id },
          callFunc: () => {
            that.props.handleOk();
            that.fetchPeriodList( {} )
            showEditModal( { data:info, type:'historyDataList', id } )
          },
        } );
      },
    } );
  }


  render() {
    const { loading,  modelVisible, info, handleOk, showEditModal, historyGainsPeriod:{ list, total } } = this.props;
    const { visible, periodCurrent, sortedInfo, pageSize, pageNum } = this.state

    const infoId =info ?  info.id : '';
    const infoName =info ?  info.name : '';

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };


    // const modalFooter = {
    //   okText: formatMessage( { id: 'form.save' } ),
    //   // onOk: this.handleSubmit,
    //   onCancel: this.handleCancel
    // };

    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render:createTime =><span>{createTime || '--'}</span>
      },
      {
        title: '开始时间',
        dataIndex: 'start',
        render:start =><span>{start || '--'}</span>
      },
      {
        title: '截止时间',
        dataIndex: 'end',
        render:end =><span>{end || '--'}</span>
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: state => (
          <span>{state === 'ENABLE' ? '上架' : '下架'}</span>
          )
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render: ( index, item ) => (
          <div>
          
            <span
              style={{ marginRight:15, cursor:'pointer', marginBottom:5, color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( item )}
              key={item.id || `${index}-gain`}
            >编辑
            </span>
            <span 
              style={{ marginRight:15, cursor:'pointer', marginBottom:5, color:'red' }}
              type="link" 
              onClick={( e )=>{
                this.detailPeriod( e, item )
              }}
            >删除
            </span>

          </div>
        
        ),
      },
    ];


    return (
      <Modal
        title='战绩数据列表'
        visible={modelVisible}
        width={1200}
        bodyStyle={{ padding:'12px 24px', maxHeight:'82vh', overflow: "auto", top:'-40px' }}
        // {...modalFooter}
        onCancel={this.handleCancel} 
        footer={false}
      >
        <GridContent>
          <Card
            className={styles.listCard}
            bordered={false}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => { this.setState( { visible:true, periodCurrent:{} } )}}
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
              ( 
                visible && 
                <HistoryPeriod
                  // info={info}
                  info={periodCurrent.start ? info : {}}
                  infoId={infoId}
                  infoName={infoName}
                  periodCurrent={periodCurrent}
                  onRef={this.onRef}
                  handleOk={handleOk} 
                  periodVisible={visible} 
                  childchangeModal={this.childchangeModal}
                  showEditModal={showEditModal}
                  fetchPeriodList={this.fetchPeriodList}
                />
              ) 
            }
          </Card>
        </GridContent>
      </Modal>
    );
  }
}

export default HistoryDataList;