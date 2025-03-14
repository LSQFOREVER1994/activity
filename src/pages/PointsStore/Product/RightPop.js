import React, { PureComponent } from "react";
import { connect } from 'dva';
import { Form, Card, Row, Col, Input, Select, Button, Spin, Pagination } from 'antd';
import styles from '../product.less';
import empty from '@/assets/empty.png'

const FormItem = Form.Item;
const { Option } = Select;

const productObj = {
  'GOODS': '实物',
  'COUPON':'虚拟卡券',
  // 'RED': '红包',
  'PHONE':'话费(手机号直充)',
};


@connect( ( { product } ) => ( {
  rights: product.rights,
  loading: product.loading,
  } ) )

@Form.create()
class RightPop extends PureComponent {
    state = {
      chooseItem: this.props.rightItem || {},
      pageSize: 8,
      pageNum: 1,
      total: 0,
    }

    formLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      };

      componentDidMount () {
        this.fetchList();
      }

      getValues = () => {
        const { form } = this.props;
        return form.getFieldsValue();

      }

      fetchList = () => {
        const { dispatch } = this.props;
        const { pageSize, pageNum } = this.state;
        const  { name, type } = this.getValues();
        dispatch( {
          type: 'product/getRightList',
          payload: {
            name,
            type,
            pageNum,
            pageSize,
          },
          callFunc: ( res ) => {
            if ( res ) {
              this.setState( {
                total: res.total,
              } )
            }

          }
        } )
      }

      formReset = () => {
        this.props.form.resetFields();
      }

      chooseRight = ( data ) => {
        this.setState( {
          chooseItem: data,
        } )
      }

      handleCancel = () => {
        const { cancel } = this.props;
        this.setState( {
          chooseItem: {}
        } )
        cancel();
      }

      handleConfirm = () => {
        const { chooseItem } = this.state;
        const { onChoose } = this.props;
        console.log( 'cd', chooseItem );
        onChoose( chooseItem );
      }

      handleChange = ( page ) => {
        console.log( 'vfdv', page );
        this.setState( {
          pageNum: page
        }, () => {
          this.fetchList();
        } )
      }

    render() {
        const { form: { getFieldDecorator }, rights, loading } = this.props;
        const { chooseItem, pageNum, pageSize, total } = this.state;
        return (
          <Card
            bordered={false}
            title=""
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem label='商品名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                } )(
                  <Input
                    autoComplete='off'
                    placeholder="名称"
                    // style={{ width: 230 }}
                  /> )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='商品类型：' {...this.formLayout}>
                    {getFieldDecorator( 'type', {
              } )(
                <Select
                  // style={{ width: 230 }}
                  placeholder="请选择商品类型"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  <Option value="">全部</Option>
                  {
                    Object.keys( productObj ).map( ( key ) =>(
                      <Option key={key} value={key} name={productObj[key]}>{productObj[key]}</Option>
                    ) )
                  }
                </Select> )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <div>
                      <Button type='primary' style={{ marginRight:15 }} onClick={this.fetchList}>搜索</Button>
                      <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                      {/* <Button type='primary' onClick={() => this.showModal()} disabled={!hasSelected} loading={loadingButton}>导出</Button> */}
                    </div>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading}>
              <div className={styles.cardCon} style={{ maxHeight: '320px', paddingBottom: '10px' }}>
                {rights && rights.list && rights.list.length > 0 && rights.list.map( ( item ) => (
                  item.inventory && item.inventory > 0 || !item.inventory ? <ProCard data={item} chooseItem={chooseItem} chooseRight={this.chooseRight} /> : null
              ) )}
              </div>
              {!rights || !rights.list || rights.list.length === 0 &&
              <div className={styles.cardNo}>
                <img src={empty} alt="" />
                <br />
                暂无数据
              </div>}
              <div className={styles.cardPage}>
                <Pagination current={pageNum} pageSize={pageSize} total={total} onChange={this.handleChange} />
              </div>

            </Spin>
            <div className={styles.rightBtn} style={{ paddingBottom: '0px' }}>
              <Button style={{ marginRight: '20px' }} onClick={this.handleCancel}>取消</Button>
              <Button type="primary" onClick={this.handleConfirm}>确认</Button>
            </div>
          </Card>
        )
    }
}

export default RightPop;

const ProCard = ( { data ={}, chooseItem = {}, chooseRight } ) => (
  <div key={data.id} className={styles.cardItem} style={{ borderColor: chooseItem.id === data.id ? '#1F3883' : '' }} onClick={() => { chooseRight( data ) }}>
    <div className={styles.cardItemTop}>
      <img className={styles.cardItemImg} src={data.imageUrl} alt="" />
      <div className={styles.cardItemName}>{data.name}</div>
    </div>
    {/* <div>
           库存：{data.inventory}
    </div> */}
  </div>
)
