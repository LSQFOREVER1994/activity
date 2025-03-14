import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Input, Button, Modal, Form, Table, InputNumber, Tag, Radio, Icon, Tooltip } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { confirm } = Modal;

const stateObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  "ENABLE": formatMessage( { id: 'strategyMall.product.state.ENABLE' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.product.state.DISABLE' } ),
}
const filterObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  "ENABLE": formatMessage( { id: 'strategyMall.product.state.onlyENABLE' } ),
}

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  categorieList: strategyMall.categorieList,
} ) )
@Form.create()
class CategoryLists extends PureComponent {
  state = {
    visible: false,
    listType: ''
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentWillMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = () => {
    const { listType } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getCategories',
      payload: {
        state: listType,
      }
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, item ) => {
    e.stopPropagation();
    this.setState( {
      visible: true,
      current: item,
    } );
  };

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  // 删除种类
  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id, name }=item;
    const $this = this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'strategyMall/delCategorie',
          payload: {
            id,
          },
          callFunc: () => {
            $this.fetchList();
          }
        } );
      },
    } );
  }

  // 提交：商品种类
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( fieldsValue, { id } ) : fieldsValue;
      dispatch( {
        type:'strategyMall/submitCategorie',
        payload: {
          params,
          callFunc:()=>{
            this.setState( {
              visible: false,
              current: undefined,
            } );
            this.fetchList();
          }
        }
      } )
    } );
  };

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { listType } )
    // this.fetchList({ listType });
  }

  render() {
    const {
      loading, categorieList, form: { getFieldDecorator },
    } = this.props;

    const {
      visible, current = {}, listType,
    } = this.state;
    let filterList = categorieList;
    if( listType ){
      filterList = [];
      categorieList.forEach( item => {
        const products = item.products.filter( elem => elem.state === listType )
        if( ( item.state === listType ) && products.length ){
          filterList.push( {
            ...item,
            products
          } )
        }
      } )
    }

    // categorieList.forEach(item => {
    //   const products = item.products.filter(elem => listType === '' || elem.state === listType)
    //   if((listType === '' || item.state === listType) && products.length){
    //     filterList.push({
    //       ...item,
    //       products
    //     })
    //   }
    // })

    const extraContent = (
      <div className={styles.extraContent}>
        <span>{formatMessage( { id: 'strategyMall.category.state' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={listType}>
          <RadioButton value="">{filterObj['']}</RadioButton>
          <RadioButton value="ENABLE">{filterObj.ENABLE}</RadioButton>
        </RadioGroup>
      </div>
    );

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>{formatMessage( { id: 'strategyMall.category.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.state' } )}</span>,
        dataIndex: 'state',
        key: 'state',
        
        render: state => (
          <span>{state === 'ENABLE' ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.category.products' } )}</span>,
        dataIndex: 'products',
        width: 600,
        // render: products => {
        //   const enableProducts = products.filter(item => listType === '' || item.state === listType);
        //   return(
        //     enableProducts.map(item=>(
        //       <Tag color={item.state==='ENABLE' ? 'green' : 'red'} key={item.id}>
        //         {
        //         item.state==='ENABLE' ? <Icon style={{color: 'green'}} type="check" />:
        //         <Icon style={{ color: 'red'}} type="close" />
        //       }
        //         {item.name}
        //       </Tag>
        //     ))
        //   )
        // },
        render : products => {
            return(
              products.map( item=>(
                <Tag color={item.state==='ENABLE' ? 'green' : 'red'} key={item.id}>
                  {
                item.state==='ENABLE' ? <Icon style={{ color: 'green' }} type="check" />:
                <Icon style={{ color: 'red' }} type="close" />
              }
                  {item.name}
                </Tag>
            ) )
          )
        },
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.category.sort' } )}</span>,
        dataIndex: 'sort',
        render: name => <span>{name}</span>,
      },
  
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        width:90,
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

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title={formatMessage( { id: 'menu.strategyMall.categorylist' } )}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={false}
              dataSource={filterList}
            />
          </Card>
        </div>
        {
          visible?
            <Modal
              maskClosable={false}
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                <FormItem label={formatMessage( { id: 'strategyMall.category.name' } )} {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.category.name' } )}` }],
                    initialValue: current.name,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.category.name' } )}`} /> )}
                </FormItem>
                <FormItem
                  label={(
                    <span>
                      {formatMessage( { id: 'strategyMall.category.sort' } )}&nbsp;
                      <Tooltip title="数值越大越靠前">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                      )}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'sort', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.category.sort' } )}，最小值为0，最大值为99` }],
                    initialValue: current.sort,
                  } )( <InputNumber placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.category.sort' } )}`} min={0} max={99} /> )}
                </FormItem>
                <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                  {getFieldDecorator( 'state', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                    initialValue: current.state || 'ENABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default CategoryLists;
