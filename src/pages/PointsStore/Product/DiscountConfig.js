import React, { PureComponent } from "react";
import { Table, Button, Popconfirm, Modal, Form, InputNumber, message, Select, Icon } from "antd";
import styles from '../product.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class DiscountConfig extends PureComponent {
    state = {
            showPop: false,
            current: null,
            currentIndex: -1,
            list: [],
            isChange: false,
            show: true,
        }


    formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
      };

    componentWillReceiveProps ( nextprops ) {
        const { userLevels } = nextprops;
        const { isChange, showPop } = this.state;
        if ( showPop ) return;
        console.log( 'cc', userLevels );
        this.setState( {
            list: userLevels,
            isChange: !isChange
        } )
    }

    handleAdd = () => {
      this.setState( {
        current: null,
        currentIndex: -1,
      }, () => {
        this.handleClose( true, true );
      } )
    }

    showEditModal = ( e, item, index ) => {
        e.preventDefault();
        this.setState( {
            current:  item,
            currentIndex: index
        }, () => {
          this.handleClose( true );
        } )
    }

    deleteItem = ( e, item, index ) => {
        const { list, isChange } = this.state;
        const { changeConfig } = this.props;
        e.preventDefault();
        list.splice( index, 1 );
        this.setState( {
            list,
            isChange: !isChange,
        } )
        changeConfig( list );

    }

    handleSelect = ( rule, value, callback ) => {
      const { list = [], current, currentIndex } = this.state;
      const levelIndex = list.findIndex( e => e.level === value );
      if ( levelIndex > -1 && currentIndex !== levelIndex ) {
        callback( '已存在此等级会员折扣' );
      } else {
        this.props.form.setFieldsValue( {
          level: value,
        } )
        callback()
      }
    }

    handleClose = ( showPop, bool ) => {
        const { oriPrice, form } = this.props;
        if ( showPop && !oriPrice ) {
            message.warn( '请先输入需要积分数量!' );
            return;
        }
        setTimeout( () => {
          if ( bool ) {
            form.setFieldsValue( {
              level: undefined,
              discountPrice: null,
            } )
          } else {
            form.resetFields();
          }
        }, 200 )


        this.setState( {
            showPop
        } )

    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        const { form, changeConfig, userLevelList } = this.props;
        const { list = [], isChange, current, currentIndex } = this.state;
        form.validateFields( ( err, fieldsValue ) => {
            if ( !err ) {
                const { level } = fieldsValue;
                if ( currentIndex === -1 ) {
                    list.push( {
                      ...fieldsValue,
                      levelName: userLevelList.find( u => u.code === level ).name
                    } );
                } else {
                    list[currentIndex] = {
                      ...current,
                      ...fieldsValue,
                      levelName: userLevelList.find( u => u.code === level ).name
                    };
                }
                this.setState( {
                    list,
                    isChange: !isChange,
                }, () => {
                    this.handleClose();
                } )
                changeConfig( list );
            }
        } );
    }

    render () {
        const { showPop, current, list, show } = this.state;
        const { form: { getFieldDecorator }, oriPrice, userLevelList } = this.props;
        const columns= [
            {
                title: <span>折扣可享对象</span>,
                dataIndex: 'levelName',
                render: levelName => <span>{levelName}</span>,
            },
            {
                title: <span>折扣后积分价</span>,
                dataIndex: 'discountPrice',
                render: discountPrice => <span>{discountPrice}</span>,
            },
            {
                title: <span>操作</span>,
                dataIndex: 'id',
                render: ( id, item, index ) => (
                  <div>
                    <span
                      style={{ cursor: 'pointer', color: '#1890ff', marginRight: '10px' }}
                      type="link"
                      onClick={( e ) => this.showEditModal( e, item, index )}
                    >编辑
                    </span>

                    <Popconfirm placement="top" title="确定删除该折扣配置？" onConfirm={( e ) => this.deleteItem( e, item, index )} okText="是" cancelText="否">
                      <span
                        style={{ cursor: 'pointer', color: '#f5222d' }}
                        type="link"
                      >
                        删除
                      </span>
                    </Popconfirm>


                  </div>
                  ),
            },
        ]
        return (
          <div className={styles.discountConfig}>
            <div className={styles.discountTitle}>
              <Icon style={{ marginLeft: '4px' }} type={show ? 'down' : 'up'} theme="outlined" onClick={() => {this.setState( { show: !show } )}} />
              折扣配置
            </div>
            <div className={styles.dicountTableCon} style={{ display: !show ? 'none' : '' }}>
              <Table
                bordered
                size="small"
                columns={columns}
                rowKey="id"
                pagination={false}
                dataSource={list}
              />
              <Button
                type="dashed"
                style={{ width: '100%' }}
                icon="plus"
                size="small"
                onClick={() => {this.handleAdd()}}
              >
                添加折扣
              </Button>
            </div>
            <Modal
              title={`${current && current.id ? '编辑' : '新增'}折扣`}
              onCancel={() => {this.handleClose( false, true )}}
              onOk={( e ) => {this.handleSubmit( e )}}
              maskClosable={false}
              visible={showPop}
            >
              <Form>
                <FormItem label='折扣可享对象' {...this.formLayout}>
                  {getFieldDecorator( 'level', {
                    rules: [
                      { required: true, message: `请先选择折扣可享对象` },
                      { validator: this.handleSelect }
                  ],
                    initialValue: current ? current.level : undefined,
                  } )(
                    <Select placeholder="选择折扣可享对象">
                      {
                            userLevelList && userLevelList.map( ( item ) => (
                              <Option key={item.code} value={item.code} name={item.name}>{item.name}</Option>
                            ) )
                        }
                    </Select>
                  )}
                </FormItem>
                <FormItem label='折扣后积分价' {...this.formLayout}>
                  {getFieldDecorator( 'discountPrice', {
                    rules: [
                      { required: true, message: `请先输入折扣后积分价` },
                      {
                        validator: ( rule, value, callback ) => {
                          if ( value > oriPrice ) {
                            callback( '折扣后积分价不可大于原价' )
                          } else {
                            callback();
                          }
                        }
                      }
                    ],
                    initialValue: current && current.discountPrice,
                  } )(
                    <InputNumber
                      autoComplete='off'
                      style={{ width: '100%' }}
                      max={oriPrice}
                      min={0}
                      placeholder="输入折扣后积分价"
                    />
                  )}
                </FormItem>
              </Form>
            </Modal>
          </div>
        )
    }
}

export default DiscountConfig;
