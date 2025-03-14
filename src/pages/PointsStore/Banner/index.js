import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
  Card, Table, Button, Modal, Input,
  Form, Radio, Tooltip, Icon, InputNumber, DatePicker, Popconfirm, Switch, message
} from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadModal from '@/components/UploadModal/UploadModal';
import ConfirmModal from '@/components/ConfirmModal';
import BatchFilterForm from './FilterForm';


import styles from './index.less';

const { RangePicker } = DatePicker;

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { market } ) => ( {
  loading: market.loading,
  bannerTags: market.bannerTags,
  banners: market.banners,
} ) )
@Form.create()
class Banner extends PureComponent {
  state = {
    visible: false,
    current: undefined,
    pageNum: 1,
    pageSize: 10,
    tag: '',
    sortedInfo: {},
    confirmVisible: false,
    confirmLoading: false,
  };

  fetchInit = {
    pageNum: 1,
    pageSize: 10,
    tag: '',
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { pageNum, pageSize, tag } = this.state;
    this.fetchList( { pageNum, pageSize, tag } );
  }

  fetchList = ( { pageNum, pageSize, params } ) => {
    const { dispatch } = this.props;
    const { sortedInfo } = this.state;
    console.log( params, 'params' );
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'market/getBanners',
      payload: {
        pageNum,
        pageSize,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        ...params,
      },
    } );
  }

  // 改变运营位
  changeListType = ( e ) => {
    const tag = e.target.value;
    this.setState( { ...this.fetchInit, tag } )
    this.fetchList( { ...this.fetchInit, tag } );
  }



  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      confirmLoading: false,
    } );
  };

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      confirmLoading: false,
    } );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( value ) => {
    this.fetchList( { pageNum: 1, pageSize: 10, params: value } );
  }

  // 提交：产品(product)、规格(specs)
  handleSubmit = ( e, bool ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, confirmLoading,
    } = this.state;
    const id = current ? current.id : '';
    console.log( 'vdfv', confirmLoading );
    if ( confirmLoading ) return;

    this.setState( {
      confirmLoading: true,
    }, () => {
      const $this = this;
      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) {
          this.setState( {
            confirmLoading: false,
          } )
          return
        }
        if( !current.beginTime ){
          message.error( '活动时间不能为空！' )
          this.setState( {
            confirmLoading: false,
          } )
          return
        }
        if ( !bool ) {
          this.setState( {
            confirmVisible: true,
            confirmLoading: false,
          } )
          return;
        }
        const params = id ? Object.assign( current, {
          ...fieldsValue,
          beginTime: moment( current.beginTime ).format( 'YYYY-MM-DD HH:mm:ss' ), endTime: moment( current.endTime ).format( 'YYYY-MM-DD HH:mm:ss' )
        } ) : {
          ...fieldsValue,
          beginTime: moment( current.beginTime  ).format( 'YYYY-MM-DD HH:mm:ss' ), endTime: moment( current.endTime ).format( 'YYYY-MM-DD HH:mm:ss' ),
          shelf: '1'
        };
        delete params.createTime;
        dispatch( {
          type: 'market/submitBanners',
          payload: {
            params,
            callFunc: () => {
              $this.fetchList( { pageNum, pageSize } );
              $this.setState( {
                visible: false,
                current: undefined,
                selectTarget: null,
                confirmVisible: false,
                confirmLoading: false,
              } );
            },
          },
        } );
      } );
    } )
  };

  updateBanner = ( params )=>{
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state
    const $this = this;

    dispatch( {
      type: 'market/submitBanners',
      payload: {
        params,
        callFunc: () => {
          $this.setState( {
            visible: false,
            current: undefined,
            selectTarget: null,
          }, () => {
            $this.fetchList( { pageNum, pageSize } );
          } );
        },
      },
    } );
  }

  showEditModal = ( e, obj ) => {
    e.stopPropagation();
    this.setState( {
      visible: true,
      current: obj,
      confirmLoading: false,
    } );
  };


  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch } = this.props;
    const { id } = obj;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `banner状态为${obj.shelf === '1' ? '启用' : '关闭'},${formatMessage( { id: 'form.del.tit' } )}?`,
      onOk() {
        dispatch( {
          type: 'market/delBanners',
          payload: {
            id,
            callFunc: () => {
              $this.setState( { ...$this.fetchInit } )
              $this.fetchList( { ...$this.fetchInit } );
            },
          },
        } );
      },
    } );
  }


  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const { tag } = this.state;
    console.log( 'fvf', sorter );
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sorter,
    }, () => {
      this.fetchList( { pageNum: current, pageSize, tag } );
    } );
  }

  changeDate = ( e ) => {
    const { current = {} } = this.state;
    const beginTime = e[0] && e[0].format( 'YYYY-MM-DD HH:MM:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:MM:ss' );
    const obj = Object.assign( current, { beginTime, endTime } );
    this.setState( { current: obj } )
  }

  cancelConfirm = () => {
    this.setState( {
      confirmVisible: false,
    } )
  }


  render() {
    const {
      pageSize, visible, current = {}, pageNum, sortedInfo, confirmVisible, confirmLoading,
    } = this.state;

    const {
      // bannerTags,
      loading, banners: { total, list },
      form: { getFieldDecorator }
    } = this.props;

    //  生成uid
    const resultList = list.map( ( item, index ) => {
      return { ...item, uid: index }
    } )

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
      //   width: 120,
      //   render: img => (
      //     <div className={styles.listImgBox}>
      //       <img className={styles.img} alt="logo" src={img} />
      //     </div>
      //   ),
      // },
      {
        title: <span>排序值</span>,
        dataIndex: 'sort',
        width: 120,
        render: sort => <div>{sort || '--'}</div>
      },
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        render: name => <span>{name || '--'}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'beginTime',
        key:'begin_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'begin_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: beginTime => <span>{beginTime || '--'}</span>,
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key:'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{endTime || '--'}</span>,
      },
      {
        title: <span>活动状态</span>,
        dataIndex: 'shelf',
        render: ( shelf, item ) => (
          <Popconfirm
            placement="top"
            title={shelf === '1' ? '确定关闭该活动？' : '确定启用该活动？'}
            onConfirm={() => {
              // const newObj = Object.assign( item, { shelf: item.shelf === "0" ? "1" : "0" } );
              this.updateBanner( { ...item, shelf: item.shelf === "0" ? "1" : "0" } )
            }}
            okText="是"
            cancelText="否"
          >
            <Switch checked={shelf === '1'} checkedChildren="启用" unCheckedChildren="关闭" />
          </Popconfirm>
        ),
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>创建人</span>,
        dataIndex: 'createBy',
        render: createBy => <span>{createBy || '--'}</span>,
      },
      // {
      //   title: <span>链接</span>,
      //   dataIndex: 'link',
      //   width: 400,
      //   render: link => <div>{link || '--'}</div>
      // },

      {
        title: '操作',
        dataIndex: 'id',
        fixed: 'right',
        width: 70,
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >修改
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>

          </div>
        ),
      },
    ];


    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: ( e ) => this.handleSubmit( e, false ),
      onCancel: this.handleCancel
    };
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="广告位配置"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <BatchFilterForm
              filterSubmit={this.filterSubmit}
              wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            />
            <Button
              type="dashed"
              style={{ width: '100%', margin: '20px 0' }}
              icon="plus"
              onClick={() => this.showModal()}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              scroll={{ x: 1300 }}
              rowKey="uid"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={resultList}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {
          visible ? (
            <Modal
              maskClosable={false}
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}banner${current.tag ? `：${current.tag}` : ''}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form>
                <FormItem
                  label="活动名称"
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'name', {
                    initialValue: current.name,
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动名称` }],
                  } )( <Input autoComplete='off' maxLength={12} /> )}
                </FormItem>


                <FormItem
                  label={<span className={styles.labelText}>活动时间</span>}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'beginTime', {
                    initialValue: current && current.beginTime ? [moment( current.beginTime ), moment( current.endTime )] : [],
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
                  } )(
                    <RangePicker
                      showTime
                      onChange={( e ) => this.changeDate( e )}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  )}

                </FormItem>
                <FormItem
                  label="banner链接"
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'link', {
                    initialValue: current.link,
                  } )( <Input autoComplete='off' placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tool.link' } )}`} /> )}
                </FormItem>
                {/* <FormItem label='状态' {...this.formLayout}>
                  {getFieldDecorator( 'shelf', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: current.shelf
                  } )(
                    <RadioGroup>
                      <Radio value='1'>上架</Radio>
                      <Radio value='0'>下架</Radio>
                    </RadioGroup>
                  )}
                </FormItem> */}
                <FormItem
                  label={(
                    <span>
                      {formatMessage( { id: 'strategyMall.tool.sort' } )}&nbsp;
                      <Tooltip title="数值越大越靠前">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'sort', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tool.sort' } )},最小值为0，最大值为99` }],
                    initialValue: current.sort,
                  } )( <InputNumber step={1} min={0} max={99} /> )}
                </FormItem>
                <FormItem label="图片" {...this.formLayout}>
                  {getFieldDecorator( 'img', {
                    rules: [{ required: true, message: `请上传图片` }],
                    initialValue: current.img,
                  } )(
                    <UploadModal accept="image/png, image/jpeg, image/png" />
                  )}
                  <div style={{ color: '#999', fontSize: '12px' }}>*格式：jpg/jpeg/png,图片大小建议不大于1M</div>
                </FormItem>
              </Form>
              <ConfirmModal loading={confirmLoading} visible={confirmVisible} text={current.id ? '修改' : '添加'} cancel={this.cancelConfirm} confirm={( e ) => {this.handleSubmit( e, true )}} />
            </Modal>
          ) : null
        }
      </GridContent>
    );
  }
}

export default Banner;
