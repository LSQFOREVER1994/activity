import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import router from 'umi/router';
import {
  Card, Table, Button, Modal, Input, Form, Icon, Tooltip, message, Divider
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getUrlParameter } from '@/utils/utils';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import FilterForm from './FilterForm'
import styles from './index.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;

@connect( ( { statistics } ) => ( {
  loading: statistics.loading,
  appData: statistics.appData,
} ) )
@Form.create()
class Product extends PureComponent {
  state = {
    visible: false,
    current: undefined,
    pageNum: 1,
    pageSize: 10,
    
  };

  // fetchInit = {
  //   pageNum: 1,
  //   pageSize: 10,
  // }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const str = window.location.href;
    const clickName = getUrlParameter( 'name', str )
    if( clickName ){
      this.setState( { clickName }, ()=>{
        this.fetchList();
      } )
    }else{
      this.fetchList();
    }
  }

  fetchList = () => {
    const { clickName, pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { appId, name } = formValue;
    let newName;
    if( clickName )newName = decodeURIComponent( clickName )
    if( name )newName = name
    dispatch( {
      type: 'statistics/getAppData',
      payload: {
        pageNum,
        pageSize,
        appId,
        name:newName || '',
        deleted: '0',
        orderBy: 'create_time desc',
      },
    } );
  }

  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  // 取消
  handleCancel = () => {
    const { current } = this.state;
    const appId = current ? current.appId : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${appId}`] ) { this[`editProBtn${appId}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  // 提交：产品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const appId = current ? current.appId : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${appId}`] ) { this[`editProBtn${appId}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = appId ? Object.assign( current, { ...fieldsValue } ) : { ...fieldsValue, add: true };
      dispatch( {
        type: 'statistics/submitAppData',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              current: undefined,
            } );
            $this.fetchList();
          },
        },
      } );
    } );
  };

  showEditModal = ( e, appId ) => {
    e.stopPropagation();
    const { appData: { list } } = this.props;
    const obj = list.find( o => o.appId === appId );

    this.setState( {
      visible: true,
      current: obj,
    } );
  };

  deleteItem = ( e, appId ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch } = this.props;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${appId}`] ) { $this[`delProBtn${appId}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'statistics/delAppData',
          payload: {
            appId,
            callFunc: () => {
              $this.fetchList();
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${appId}`] ) { $this[`delProBtn${appId}`].blur(); }
        }, 0 )
      },
    } );
  }

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
  }

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }

  render() {
    const {
      pageSize, pageNum, visible, current = {},
    } = this.state;

    const {
      loading, appData: { total, list },
      form: { getFieldDecorator }
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
    };

    const columns = [
      // {
      //   title: <span>图片</span>,
      //   dataIndex: 'img',
      //   render: img => (
      //     <div className={styles.listImgBox}>
      //       {
      //         img ? ( <img className={styles.img} alt="logo" src={img} /> ) : null
      //       }
      //     </div>
      //   ),
      // },
      // {
      //   title: <span>appid</span>,
      //   dataIndex: 'appId',
      //   render: appId => <span>{appId || '--'}</span>,
      // },
      {
        title: <span>名称</span>,
        dataIndex: 'name',
        render: ( name, record ) => (
          <div>
            <span
              onClick={() => router.push( `/statistics/app/detail?appid=${record.appId}` )}
              style={{ color:'#1890ff' }}
              type="link"
            >
              {name || '--'}
            </span>
            <Tooltip title={`点击复制ID:(${record.appId})`}>
              <Icon 
                type="copy"
                onClick={() => {
                  if ( copy( record.appId ) ) {
                    message.success( '已复制到剪切板' )
                  }
                }}
              />
            </Tooltip>
          </div>
        ),
      },
      {
        title: <span>今日新增用户</span>,
        dataIndex: 'newUv',
        align:'center',
        render: newUv => <span>{newUv !== undefined ? newUv : '--'}</span>,
      },
      {
        title: <span>昨日新增用户</span>,
        dataIndex: 'preNewUv',
        align:'center',
        render: preNewUv => <span>{preNewUv !== undefined ? preNewUv : '--'}</span>,
      },
      {
        title: <span>今日活跃用户</span>,
        dataIndex: 'uv',
        align:'center',
        render: uv => <span>{uv !== undefined ? uv : '--'}</span>,
      },
      {
        title: <span>昨日活跃用户</span>,
        dataIndex: 'preUv',
        align:'center',
        render: preUv => <span>{preUv !== undefined ? preUv : '--'}</span>,
      },
      {
        title: <span>今日启动次数</span>,
        dataIndex: 'pv',
        align:'center',
        render: pv => <span>{pv !== undefined ? pv : '--'}</span>,
      },
      {
        title: <span>昨日启动次数</span>,
        dataIndex: 'prePv',
        align:'center',
        render: prePv => <span>{prePv !== undefined ? prePv : '--'}</span>,
      },
      {
        title: <span>累计用户</span>,
        dataIndex: 'preTotalUv',
        align:'center',
        render: ( preTotalUv, record ) => <span>{preTotalUv !== undefined ? preTotalUv +  record.newUv: '--'}</span>,
      },
      // {
      //   title: <span>今日独立IP数</span>,
      //   dataIndex: 'ips',
      //   align:'center',
      //   render: ips => <span>{ips !== undefined ? ips : '--'}</span>,
      // },
      // {
      //   title: <span>昨日独立IP数</span>,
      //   dataIndex: 'preIps',
      //   align:'center',
      //   render: preIps => <span>{preIps !== undefined ? preIps : '--'}</span>,
      // },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        render: createTime => <Tooltip title={createTime}><span>{moment( createTime ).format( 'MM-DD' ) || '--'}</span></Tooltip>,
      },
      {
        title: '操作',
        width:110,
        render: ( text, record ) => (
          <div>
            <span
              style={{ cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, record.appId )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${record.appId}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              编辑
            </span>
            <Divider type="vertical" />
            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, record.appId )}
              ref={component => {
                /* eslint-disable */
                this[`delProBtn${record.appId}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              删除
            </span>
          </div>
        ),
      },
    ];


    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="埋点产品列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
            extra={
              <FilterForm
                filterSubmit={this.filterSubmit}
                wrappedComponentRef={( ref ) => { this.filterForm = ref}}
              />
            }
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showModal()}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              新增埋点产品
            </Button>
            <Table
              rowKey="appId"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>

        {
          visible ? (
            <Modal
              maskClosable={false}
              title={`${current.appId ? `${formatMessage( { id: 'form.exit' } )}:${current.appId}` : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form onSubmit={this.handleSubmit}>
                {/* <FormItem label="图片" {...this.formLayout}>
                  {getFieldDecorator( 'img', {
                    initialValue: current.img,
                  } )( <UploadImg /> )}
                </FormItem> */}
                {
                  !current.appId ? (
                    <FormItem {...this.formLayout} label="appId">
                      {getFieldDecorator( 'appId', {
                         rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}appId(英文)` }],
                          initialValue: current.appId,
                        } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}appId(英文)`} /> )}
                    </FormItem>
                  ) : null
                }
                <FormItem {...this.formLayout} label={formatMessage( { id: 'statistics.product.name' } )}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'statistics.product.name' } )}(中文)` }],
                      initialValue: current.name,
                    } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'statistics.product.name' } )}(中文)`} /> )}
                </FormItem>
                <FormItem {...this.formLayout} label={formatMessage( { id: 'statistics.product.description' } )}>
                  {getFieldDecorator( 'description', {
                    initialValue: current.description,
                  } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'statistics.product.description' } )}`} /> )}
                </FormItem>
              </Form>
            </Modal>
          ) : null
        }
      </GridContent>
    );
  }
}

export default Product;
