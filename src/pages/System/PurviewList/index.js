/*
 * @Author: RidingWind
 * @Date: 2018-07-11 14:52:21
 * @Last Modified by: 绩牛金融 - RidingWind
 * @Last Modified time: 2018-07-12 10:31:16
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Spin, Modal, Input, Radio, Button, Select } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};


@connect( ( { system } ) => ( {
  loading: system.loading,
  datas: system.datas,
  updating: system.updating,
} ) )

@Form.create()
class PurviewList extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      portfolio: {},
      pageNum: 1,
      pageSize: 10,
      visible: false,
      nameValue:'',
      enableValue:''
    };
  }

  componentDidMount() {
    this.fetchList();
  }


  fetchList = () => {
    const { pageSize, pageNum, nameValue, enableValue } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getPurviewList',
      payload: {
        pageNum,
        pageSize,
        name:nameValue,
        enable:enableValue
      },
    } );
  }

  onChangePage = ( page ) => {
    this.setState( {
      pageNum: page.current,
    }, this.fetchList );
  }

  empty=()=>{
    this.setState( {
      nameValue:'',
      enableValue:''
    }, this.fetchList )
  }

  goSearch=()=>{
    this.setState( {
      pageNum: 1,
    }, this.fetchList );
  }

  // 编辑list
  onEditList = ( data ) => {
    this.setState( {
      portfolio: data,
      visible: true,
    } )
  }

  closeModal=()=>{
    this.setState( {
      visible:false,
      portfolio: {},
    } )
  }

  handleSubmit=()=>{
    const { form:{ validateFields }, dispatch } = this.props;
    const { portfolio } = this.state;
    validateFields( ( err, fieldsValue )=>{
      if( err ) return;
      const params = Object.assign( {}, portfolio, fieldsValue );
      dispatch( {
        type: 'system/submitPurview',
        payload: {
          ...params,
        },
        successFunc: ()=>{
          this.setState( {
            pageNum:1,
            visible: false,
            portfolio: {},
          }, this.fetchList )
        }
      } )
    } )
  }

  onChange = ( val, type ) => {
    this.setState( {
      [type]: val,
    } );
  }


  render() {
    const {
      loading, updating, form: { getFieldDecorator },
      datas: { list, total, pageNum },
    } = this.props;
    const {
      pageSize, visible, portfolio, nameValue, enableValue
    } = this.state;

    /* table columns */
    const columns = [
      {
        title: <span>权限名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>代码</span>,
        dataIndex: 'code',
        render: code => <span>{code}</span>,
      },
      {
        title: <span>描述</span>,
        dataIndex: 'description',
        render: description => <span>{description || '--'}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'enable',
        render: enable => <span htmlFor="n">{enable ? '启用' : '禁用'}</span>,
      },
      {
        title: <span>操作</span>,
        render: ( text, record ) => (
          <div className={styles.btns}>
            <span
              className={styles.btnsBtn} 
              style={{ cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.onEditList( record )}
            >
              编辑
            </span>
          </div>
        ),
      },
    ];

    /* pagination */
    const pagination = {
      total,
      current: pageNum,
      defaultPageSize: pageSize,
      showQuickJumper: true,
      showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <span className={styles.btn}>权限名称:</span>
        <Input
          value={nameValue}
          placeholder="输入权限名称"
          onChange={( e ) => this.onChange( e.target.value, 'nameValue' )}
          style={{ width: 150, marginLeft: '10px' }}
        />
        <span className={styles.btn}>状态:</span>
        <Select
          autoClearSearchValue
          value={enableValue}
          style={{ width: 150, marginLeft: 10 }}
          onSelect={( val )=>this.onChange( val, 'enableValue' )}
        >
          <Option value=''>全部</Option>
          <Option value='true'>启用</Option>
          <Option value='false'>禁用</Option>
        </Select>
        <Button type="primary" style={{ margin:'0 20px' }} onClick={this.goSearch}>搜索</Button>
        <Button onClick={this.empty}>清空</Button>
      </div>
    );


    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          extra={extraContent}
          title='权限列表'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Table
            rowKey="code"
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={pagination}
            onChange={this.onChangePage}
          />
          <Modal
            maskClosable={false}
            title='编辑用户'
            visible={visible}
            width="60%"
            onCancel={this.closeModal}
            onOk={this.handleSubmit}
          >
            <Spin spinning={updating} tip="updating">
              <Form>
                <FormItem label="权限名称" {...formItemLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: '请输入权限名称' }],
                    initialValue: portfolio.name
                  } )(
                    <Input placeholder="输入权限名称" />
                  )}
                </FormItem>
                <FormItem label="action" {...formItemLayout}>
                  {getFieldDecorator( 'action', {
                    rules: [{ required: true, message: 'action不能为空' }],
                    initialValue: portfolio.action
                  } )(
                    <Input placeholder="输入action"  />
                  )}
                </FormItem>
                <FormItem label="代码" {...formItemLayout}>
                  {getFieldDecorator( 'code', {
                    rules: [{ required: true, message: '代码不能为空' }],
                    initialValue: portfolio.code
                  } )(
                    <Input placeholder="请输入代码" disabled />
                  )}
                </FormItem>

                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator( 'enable', {
                    rules: [{ required: true, message: '状态不能为空' }],
                    initialValue: portfolio.enable !== undefined ? portfolio.enable : true
                  } )(
                    <RadioGroup>
                      <Radio value>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                  {getFieldDecorator( 'description', {
                    rules: [{ required: true, message: '描述不能为空' }],
                    initialValue: portfolio.description
                  } )(
                    <TextArea rows={10} placeholder="请输入描述" />
                  )}
                </FormItem>
              </Form>
            </Spin>
          </Modal>
        </Card>
      </GridContent>
    );
  }
}



export default PurviewList;
