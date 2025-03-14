import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
  Card, Table, Button, Modal, Input,
  Form, Radio, Tooltip, Icon, InputNumber
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from './Banner.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  bannerTags: tool.bannerTags,
  banners: tool.banners,
} ) )
@Form.create()
class Banner extends PureComponent {
  state = {
    visible: false,
    current: undefined,
    pageNum: 1,
    pageSize: 10,
    tag: '',
    selectTarget: null,

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

  fetchList = ( { pageNum, pageSize, tag } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getBannerTags',
    } );
    dispatch( {
      type: 'tool/getBanners',
      payload: {
        pageNum,
        pageSize,
        tag,
        orderBy: 'sort desc',
      },
    } );
  }

  // 改变运营位
  changeListType = ( e ) => {
    const tag = e.target.value;
    // const { pageNum, pageSize } = this.state;
    // this.setState({ tag})
    // this.fetchList({ pageNum, pageSize, tag });
    this.setState( { ...this.fetchInit, tag } )
    this.fetchList( { ...this.fetchInit, tag } );
  }

  // //  pageSize  变化的回调
  // onShowSizeChange = (current, pageSize) => {
  //   const { tag } = this.state;
  //   this.setState({ pageSize, pageNum: 1 });
  //   this.fetchList(1, pageSize, tag);
  // }

  //  //  页码变化回调
  //  changePageNum = (pageNum) => {
  //   const { pageSize, tag } = this.state;
  //   this.setState({ pageNum });
  //   this.fetchList(pageNum, pageSize, tag);
  // }

  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      selectTarget: null,
    } );
  };

  // 提交：产品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, tag, pageSize, pageNum,
    } = this.state;
    const id = current ? current.id : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, { ...fieldsValue } ) : { ...fieldsValue };

      dispatch( {
        type: 'tool/submitBanners',
        payload: {
          params,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, tag } );

            $this.setState( {
              visible: false,
              current: undefined,
              selectTarget: null,
            } );
          },
        },
      } );
    } );
  };

  showEditModal = ( e, obj ) => {
    e.stopPropagation();
    const { bannerTags } = this.props;
    const objTag = bannerTags.find( o => o.name === obj.tag );

    this.setState( {
      visible: true,
      current: obj,
      selectTarget: ( +objTag.width ) / ( +objTag.height ),
    } );
  };


  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { tag } = this.state;
    const { dispatch } = this.props;
    const { id }=obj;
    confirm( {
      cancelText:'取消',
      okText:'确定', 
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.tag}`,
      onOk() {
        dispatch( {
          type: 'tool/delBanners',
          payload: {
            id,
            callFunc: () => {
              $this.setState( { ...$this.fetchInit, tag } )
              $this.fetchList( { ...$this.fetchInit, tag } );
            },
          },
        } );
      },
    } );
  }


  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    const { tag } = this.state;
    this.fetchList( { pageNum: current, pageSize, tag } );

    this.setState( {
      pageNum: current,
      pageSize,
    } );
  }

  // 选择运营位
  changeTags = ( e ) => {
    const { bannerTags } = this.props;
    const obj = bannerTags.find( o => o.name === e.target.value );
    this.setState( { selectTarget: ( +obj.width ) / ( +obj.height ) } )
  }

  render() {
    const { tag, pageSize, visible, current = {}, pageNum, selectTarget, } = this.state;

    const {
      bannerTags, loading, banners: { total, list },
      form: { getFieldDecorator }
    } = this.props;

    //  生成uid
    const resultList = list.map( ( item, index )=>{
      return{ ...item, uid:index }
    } )
    
    const extraContent = (
      <div className={styles.extraContent}>
        <span>运营位：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={tag}>
          <RadioButton value="">全部</RadioButton>
          {
            bannerTags.map( item => (
              <RadioButton key={item.name} value={item.name}>{item.name}</RadioButton>
            ) )
          }
        </RadioGroup>
        {/* <Select style={{ width: 200 }} onChange={this.changeListType} defaultValue={tag}>
          <SelectOption value="">全部</SelectOption>
          {
            bannerTags.map(item => (
              <SelectOption key={item} value={item}>{item}</SelectOption>
            ))
          }
        </Select> */}
      </div>
    );

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
      {
        title: <span>图片</span>,
        dataIndex: 'imgUrl',
        render: imgUrl => (
          <div className={styles.listImgBox}>
            <img className={styles.img} alt="logo" src={imgUrl} />
          </div>
        ),
      },
      {
        title: <span>运营位</span>,
        dataIndex: 'tag',
        render: tag => <span>{tag}</span>,
      },
      {
        title: <span>是否上架</span>,
        dataIndex: 'enable',
        render: enable => <span>{enable ? '上架' : '下架'}</span>,
      },
      {
        title: <span>链接</span>,
        dataIndex: 'link',
        width:400,
        render:link => <div>{link || '--'}</div>
      },
      {
        title: <span>备注</span>,
        dataIndex: 'description',
        render: description => <span>{description || '--'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width:70,
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
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
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title="资源位管理"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >

            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
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
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}运营位${current.tag ? `：${current.tag}` : ''}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  label={(
                    <span>
                      {formatMessage( { id: 'strategyMall.tool.tag' } )}&nbsp;
                      <Tooltip title="运营位作为分类，可使用在不同的运营位上">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'tag', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}运营位` }],
                    initialValue: current.tag,
                  } )(
                    <RadioGroup onChange={this.changeTags}>
                      {
                        bannerTags.map( ( item ) => (
                          <Radio key={item.name} value={item.name}>
                            {item.name} <span className={styles.tipWH}>({item.width}*{item.height})</span>
                          </Radio>
                        ) )
                      }
                    </RadioGroup>
                  )}
                </FormItem>

                <FormItem label="图片" {...this.formLayout}>
                  {getFieldDecorator( 'imgUrl', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}图片` }],
                    initialValue: current.imgUrl,
                  } )( <UploadImg />  )}
                  {
                    selectTarget ? null : <div className={styles.noUpload}>请先选择运营位</div>
                  }
                </FormItem>


                <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                  {getFieldDecorator( 'enable', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                    initialValue: current.enable,
                  } )(
                    <RadioGroup>
                      <Radio value>上架</Radio>
                      <Radio value={false}>下架</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
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
                <FormItem
                  label={(
                    <span>
                      {formatMessage( { id: 'strategyMall.tool.link' } )}&nbsp;
                      <Tooltip title="点击该图片可跳转的动作，不填为纯展示。">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  {...this.formLayout}

                >
                  {getFieldDecorator( 'link', {
                    initialValue: current.link,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.tool.link' } )}`} /> )}
                </FormItem>
                <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.product.description' } )}>
                  {getFieldDecorator( 'description', {
                    initialValue: current.description,
                  } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}描述`} /> )}
                </FormItem>
              </Form>
            </Modal>
          ) : null
        }
      </GridContent>
    );
  }
}

export default Banner;
