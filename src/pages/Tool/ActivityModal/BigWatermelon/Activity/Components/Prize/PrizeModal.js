// 表格弹出框
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Select, Icon, Tooltip, Spin, InputNumber } from 'antd';
import UploadImg from '@/components/UploadImg';
import styles from '../../../../ActivityModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
} ) )
@Form.create()



class PrizeModal extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      prizeCurrent: this.props.prizeCurrent || {},
      allPrizeList: this.props.allPrizeList || [],
      useInventory: this.props.useInventory,
      fragmentsList: this.props.fragmentsList, // 分段列表
      fragments: this.props.fragments, // 当前编辑项的分段
      prizeSendMode: this.props.prizeSendMode, // 奖品发放类别
    }
  }

  // 获取选择奖品列表
  getPrizeList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        pageNum: 1,
        pageSize: 30,
        name,
      },
      callFunc: ( res ) => {
        this.setState( { allPrizeList: [...res] } )
      }
    } );
  }


  //  奖品输入名称筛选
  onSearch = ( value ) => {
    clearTimeout( this.timer );
    this.timer = setTimeout( () => {
      this.getPrizeList( { name: value } );
    }, 500 );
  }

  //  库存切换
  onChange = ( id, num ) => {
    const { form: { setFieldsValue } } = this.props;
    const { allPrizeList } = this.state;
    const getInventory = ( allPrizeList.length && id ) ? allPrizeList.find( item => item.id === id ) : {};
    const useInventory =getInventory ? getInventory.activeCount : '';
    if ( !num ) {
      if ( id === 'onWinPrize' || id === undefined || id === '' ) {
        setFieldsValue( {
          popupText: '谢谢参与',
          name: '未中奖',
        } )
      } else {
        const preizName = getInventory.name || '';
        setFieldsValue( {
          popupText: `恭喜你，获得${preizName}`,
          name: preizName,
        } );
      }
    }
    this.setState( {
      useInventory
    } );
    this.props.setUseInventory( useInventory )
  }


  render() {
    const { prizeCurrent = {}, allPrizeList = [], useInventory, fragmentsList, prizeSendMode, fragments } = this.state;
    const { loading, form: { getFieldDecorator, getFieldValue } } = this.props;

    return (
      <Spin spinning={loading}>
        <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
          <FormItem label='奖品' {...this.formLayout}>
            {getFieldDecorator( 'prizeId', {
              rules: [{ required: true, message: `奖品不能为空!` }],
              initialValue: prizeCurrent.prizeId,
            } )(
              <Select
                onSearch={this.onSearch}
                showSearch
                filterOption={false}
                onChange={( e ) => this.onChange( e )}
              >
                <Option value="onWinPrize" key="未中奖">未中奖</Option>
                {
                  allPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='奖品名称' {...this.formLayout}>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: `奖品名称不能为空!` }],
              initialValue: prizeCurrent.name,
            } )(
              <Input placeholder='请输入奖品名称' />
            )}
          </FormItem>
          <FormItem label='弹窗文案' {...this.formLayout}>
            {getFieldDecorator( 'popupText', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
              initialValue: prizeCurrent.popupText || '',
            } )( <TextArea
              rows={2}
              placeholder="请输入奖品结果弹窗文案"
              maxLength={20}
            /> )}
            <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{getFieldValue( 'popupText' ).length}/20</span>
          </FormItem>

          {
            prizeSendMode === 'PROBABILITY' &&
            <div style={{ display: 'flex', padding: '0px 0px 20px 120px', alignItems: 'center' }}>
              <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 10, color: '#333' }} className={styles.edit_acitve_tab}>
                  奖品图标:
                </div>
                <FormItem style={{ marginBottom: 0, paddingLeft: 80 }}>
                  {getFieldDecorator( 'image', {
                    rules: [{ required: true, message: '请上传奖品图片' }],
                    initialValue: prizeCurrent.image
                  } )( <UploadImg onChange={this.imgChang} /> )}
                </FormItem>
                <div style={{ fontSize: 13, color: '#999', position: 'absolute', top: '20px', right: '100px' }}>
                  格式：jpg/jpeg/png
                  <br />
                  建议尺寸：180px*180px
                  <br />
                  建议大小：不超过1M
                </div>
              </div>
            </div>
          }

          {/* 名次 */}
          {
            prizeSendMode === 'RANKING' ?
              <div style={{ display: "flex", marginLeft: "130px" }}>
                <div style={{ lineHeight: ' 35px', color: "rgba(0, 0, 0, 0.85)" }}>
                  <span className={styles.edit_acitve_tab} />
                  名次
                  <Tooltip title="相同榜单内不同奖品的名次不能重叠">
                    <Icon type="question-circle-o" />
                  </Tooltip>：
                </div>
                <FormItem style={{ marginRight: "20px" }} {...this.formLayout}>
                  {getFieldDecorator( 'rankFrom', {
                    rules: [{ required: true, message: `首位名次不能为空！` }],
                    initialValue: prizeCurrent.rankFrom,
                  } )(
                    <InputNumber
                      placeholder='首位名次'
                      precision={0}
                      min={0}
                    />
                  )}
                </FormItem>
                <FormItem {...this.formLayout}>
                  {getFieldDecorator( 'rankTo', {
                    rules: [{ required: true, message: `末位名次不能为空！` }],
                    initialValue: prizeCurrent.rankTo,
                  } )(
                    <InputNumber
                      placeholder='末位名次'
                      precision={0}
                      min={0}
                    />
                  )}
                </FormItem>
              </div> :
              <div>
                <FormItem
                  label='中奖概率'
                  {...this.formLayout}
                  extra={<span style={{ color: '#D1261B', fontSize: 12 }}>*所有奖品情况概率之和需为100%</span>}
                >
                  {getFieldDecorator( 'probability', {
                    rules: [
                      { required: true, message: `${formatMessage( { id: 'form.input' } )}概率,并且只能输入数字` },
                      { pattern: new RegExp( /^(\d|[1-9]\d|100)(\.\d{1,2})?$/ ), message: '请输入0-100的数字,且最多有两位小数' }
                    ],
                    initialValue: prizeCurrent.probability,
                  } )( <Input
                    placeholder='请输入该奖项出现的概率'
                    precision={0}
                    min={0}
                    addonAfter='%'
                  />
                  )}
                </FormItem>
                <FormItem
                  label='中奖分段'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'fragments', {
                    rules: [
                      { required: true, message: '请选择中奖分段' }
                    ],
                    initialValue: prizeCurrent.prizeId ? fragments : null,
                  } )(
                    <Select>
                      {
                        fragmentsList.length > 0 &&
                        fragmentsList.map( ( item, index ) => <Option key={item.rankFrom} value={index}>{`${item.rankFrom}~${item.rankTo}`}</Option> )
                      }
                    </Select>
                  )}
                </FormItem>
              </div>

          }

          {
            getFieldValue( 'prizeId' ) !== 'onWinPrize' &&
            <FormItem
              label='活动库存'
              {...this.formLayout}
              extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>当前可用库存：({useInventory}个)</span> : null}
            >
              {getFieldDecorator( 'inventory', {
              rules: [{ required: true, message: `活动库存不能为空!` }, { pattern: new RegExp( /^\+?(0|[1-9][0-9]*)$/ ), message: '请输入正整数' }],
              initialValue: prizeCurrent.inventory,
            } )( <Input
              placeholder='请输入该奖品库存数量'
              precision={0}
              min={0}
              addonAfter='个'
            />
            )}
            </FormItem>
          }

        </Form>
      </Spin>
    )
  }
}

export default PrizeModal;