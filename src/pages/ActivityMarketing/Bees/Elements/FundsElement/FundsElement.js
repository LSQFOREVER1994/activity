import React, { PureComponent } from 'react';
import { Form, Input, Radio, Empty, Button, Select, Popconfirm } from 'antd';
import { connect } from 'dva';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import { fundsShowTypes } from '../../BeesEnumes'
import styles from './fundsElement.less';

const FormItem = Form.Item;
const { Option } = Select
@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList,
  initFundsList: bees.initFundsList,
} ) )
@Form.create()
class FundsElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  fundItemFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    super( props );
    this.state = {

    }
    this.timer = null
  }


  componentWillMount() {
    this.initData()
    this.initElmentData()
    setTimeout( () => {
      this.onSearchFund()
      this.getInitFunds()
    }, 200 );
  }


  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '基金卡片',
      title:'卡片标题',
      subTitle:'看热点，更要洞察热点背后的趋势',
      funds:[
        {
          comment: "非常好 ",
          fundId: "108797",
          // productCode: "110007",
          showType: "growthRate1y",
          fundVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ),
        },
        {
          comment: "非常好 ",
          fundId: "110307",
          // productCode: "003161",
          showType: "growthRate1y",
          fundVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        },
      ],
      paddingLeft: 30,
      paddingRight: 30
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  getInitFunds = () => {
    const { dispatch, eleObj = {} } = this.props;
    let fundsId = '';
    if( eleObj.funds && eleObj.funds.length > 0 ) {
      fundsId = ( eleObj.funds.map( item => item.fundId ) ).join( ',' )
    }
    if( !fundsId ) return
    dispatch( {
      type: 'bees/getInitFunds',
      payload: {
        codes: fundsId,
      },
    } );
  }

  // 模糊搜索基金
  onSearchFund = ( code = '' ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getFundList',
      payload: {
        searchKey: code,
        pageSize:500
      }
    } );
  }

  clearInitFunds = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/clearInitFunds',
    } );
  }

  // 搜索基金
  onFundsSearch = ( e ) => {
    clearTimeout( this.timer )
    this.timer = setTimeout( () => {
      this.onSearchFund( e )
    }, 500 );
  }

  // 初始化编辑数据
  initData = () => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const funds = eleObj.funds ? eleObj.funds : []
    let newFunds = funds
    if ( funds && funds.length > 0 ) {
      newFunds = funds.map( info => {
        return {
          ...info,
          fundVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { funds: [...newFunds] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 新增基金
  onAddFund = () => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const fundList = eleObj.funds ? eleObj.funds : []
    const fundVirtualId = Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
    const newFundList = [...fundList, { fundVirtualId }]

    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { funds: [...newFundList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 删除基金
  onDelete = ( info ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const fundList = eleObj.funds ? eleObj.funds : []
    const newFundList = fundList.filter( item => {
      return item.fundVirtualId !== info.fundVirtualId
    } )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { funds: [...newFundList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: [...newElementsList] } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 编辑基金Item
  changeFundInput = ( e, type, info ) => {
    let val = e
    if ( type === 'comment' ) {
      val = e.target.value
    }
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const { fundsList, initFundsList } = this.props;
    const obj = {}
    const newFundsLists = fundsList.concat( initFundsList ).reduce( ( cur, next ) => {
      // eslint-disable-next-line no-unused-expressions
      obj[next.productCode] ? "" : obj[next.productCode] = true && cur.push( next );
      return cur;
    }, [] );
    const selectItem = newFundsLists.find( item => item.fundId === e )
    const fundList = eleObj.funds ? eleObj.funds : []

    const fundItem = fundList.find( item => item.fundVirtualId === info.fundVirtualId )
    const newFundItem = {
      ...fundItem,
      [type]: val
    }
    const newFundList = fundList.map( item => {
      return item.fundVirtualId === info.fundVirtualId ? { ...newFundItem, ...selectItem } : item
    } )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { funds: [...newFundList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeItemValue = ( e, type, data ) => {
    const { editList } = this.state
    const prizeItem = editList.find( info => {
      return info.prizeVirtualId === data.prizeVirtualId
    } )
    const newPrizeItem = { ...prizeItem, [type]: e }
    const newEditList = editList.map( info => {
      return info.prizeVirtualId === data.prizeVirtualId ? newPrizeItem : info
    } )

    this.setState( {
      editList: [...newEditList]
    } )
  }

  // 卡片配置项
  renderFundItem = () => {
    const { eleObj, fundsList, initFundsList } = this.props;
    const fundList = eleObj.funds ? eleObj.funds : []
    let fundSelectOptions = null
    const obj = {}
    const newFundsList = [...fundsList, ...initFundsList].reduce( ( cur, next ) => {
      // eslint-disable-next-line no-unused-expressions
      obj[next.productCode] ? "" : obj[next.productCode] = true && cur.push( next );
      return cur;
    }, [] );
    if ( newFundsList && newFundsList.length > 0 ) {
      fundSelectOptions = newFundsList.map( info => {
        return (
          <Option value={info.fundId} key={info.productCode}>{info.shortName}({info.productCode})</Option>
        )
      } )
    }
    let view = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无基金配置，请去添加基金" />
    if ( fundList && fundList.length > 0 ) {
      view = fundList.map( ( info, index ) => {
        return (
          <FormItem label={`基金代码${index + 1}`} {...this.fundItemFormLayout} key={info.fundVirtualId}>
            <div style={{
              display: 'flex',
              border: '1px solid #eee',
              padding: '20px',
              borderRadius: '5px',
              background: '#f9f9f9',
              marginRight: '30px'
            }}
            >
              <div
                style={{
                  flex: '1'
                }}
              >
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>选择基金</span>}
                  {...this.formLayout}
                >
                  <Select
                    style={{ width: '100%' }}
                    value={info.fundId}
                    placeholder="请选择基金"
                    onChange={( e ) => this.changeFundInput( e, 'fundId', info )}
                    showSearch
                    filterOption={this.filterOption}
                    onSearch={( e ) => this.onFundsSearch( e )}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {fundSelectOptions}
                  </Select>
                </FormItem>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>展示类型</span>}
                  {...this.formLayout}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择展示类型"
                    value={info.showType}
                    onChange={( e ) => this.changeFundInput( e, 'showType', info )}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {fundsShowTypes.map( item => {
                      return (
                        <Option value={item.key}>{item.value}</Option>
                      )
                    } )}
                  </Select>
                </FormItem>
                <FormItem
                  label='基金评价'
                  {...this.formLayout}
                >
                  <Input
                    value={info.comment}
                    placeholder="请输入基金评价"
                    onChange={( e ) => this.changeFundInput( e, 'comment', info )}
                    maxLength={20}
                  />
                </FormItem>
              </div>
              <Popconfirm
                title="确定删除该基金吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.onDelete( info )}
              >
                <div style={{ color: '#f5222d', cursor: 'pointer' }}>删除</div>
              </Popconfirm>
            </div>
          </FormItem>

        )
      } )
    }

    return view

  }

  filterOption = ( inputValue, option ) =>  {
    const { fundsList } = this.props;
    let res = false
    fundsList.forEach( item => {
      if( item.fundId.indexOf( inputValue ) > -1 || item.fullName.indexOf( inputValue ) > -1 || item.shortName.indexOf( inputValue ) > -1 || item.productCode.indexOf( inputValue ) > -1 ) {
        if( option.key === item.productCode ) {
          res = true
        }
      }
    } )
    return res
  }


  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          {/* <FormItem label="组件样式" {...this.formLayout}>
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'style' )}
              value={eleObj.style ? eleObj.style : '1'}
            >
              <Radio value='1'>样式一</Radio>
              <Radio value='2'>样式二</Radio>
            </Radio.Group>
          </FormItem> */}
          <FormItem
            label='卡片标题'
            {...this.formLayout}
          >
            <Input
              value={eleObj.title}
              placeholder="请输入卡片标题"
              onChange={( e ) => this.changeInput( e, 'title' )}
              maxLength={20}
            />
          </FormItem>

          <FormItem
            label='卡片摘要'
            {...this.formLayout}
          >
            <Input
              value={eleObj.subTitle}
              placeholder="请输入卡片摘要"
              onChange={( e ) => this.changeInput( e, 'subTitle' )}
              maxLength={20}
            />
          </FormItem>
          {this.renderFundItem()}
          <FormItem label="" {...this.formLayout}>
            <Button
              type="dashed"
              style={{ width: '100%', marginTop: 10, marginLeft: '25%' }}
              icon="plus"
              onClick={() => this.onAddFund()}
            >
              添加基金
            </Button>
          </FormItem>
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    )
  }

}

export default FundsElement;
