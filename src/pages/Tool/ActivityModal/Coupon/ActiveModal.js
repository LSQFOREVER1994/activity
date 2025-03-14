import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Alert, Tabs  } from 'antd';

import styles from '../../Lists.less';
import CardCom from './Card.com';
import WxShare from './WxShare';

const { TabPane } = Tabs;
const time = () => new Date().getTime();

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
class ActiveModal extends PureComponent {
  allCardForm = {}

  constructor( props ){
    super( props );
    const List = props.prizeGroup && props.prizeGroup.length ? props.prizeGroup.map( ( card, index ) => ( { ...card, key:time()+index } ) ) : []
    List.sort( ( a, b ) => {
      const value1 = a.startTime;
      const value2 = b.startTime;
      return value1 > value2 ? 1 : -1;
    } );
    this.state = {
      list: List,
      deleteArr:[],
      errorFormList:[], // 表单错误项
      currTab:1,
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }


  addDetail = () => {
    const { list } = this.state;
    const newList = list.concat( { key: time(), isOpen:true } );
    this.setState( { list: newList }, ()=>{
      this.props.onPreview()

    } )
  }

  deleteDetail = ( detail, index ) => {
    // let { deleteArr } = this.state;
    // if ( detail.id ) deleteArr = deleteArr.concat( [detail.id] )
    // console.log( 'deleteArr: ', deleteArr );
    const { allCardForm } = this;
    const lists = [];
    Object.keys( allCardForm ).forEach( ( key ) => {
      const isDel = true;
      const formData = allCardForm[key].getCardValues( isDel );

      allCardForm[key].formReset();
      lists.push( formData );
    } )


    const { deleteArr } = this.state;
    const newList = lists.filter( ( item ) => item && item.key !== index )
    const newArr = [];

    newList.map( item => {
      newArr.push( { prizeList: item.List, startTime: item.List[0] && item.List[0].receiveStartTime, endTime: item.List[0] && item.List[0].receiveEndTime, key: item.key } )
      if( item.deleteIds && item.deleteIds.length > 0 ){
        item.deleteIds.map( i => (
          deleteArr.push( i )
        ) )
      }
     } )

    const deleteCard = lists.find( ( item ) => item && item.key === index )
    deleteCard.List.map( item => (
      deleteArr.push( item.id )
    ) )
    delete this.allCardForm[`cardForm-${index}`];
    this.setState( { list: newArr, deleteArr }, ()=>{
      this.props.onPreview()
    } );
  }

  getValues = () => {
    const { allCardForm } = this;
    const { deleteArr } = this.state;
    const prizes = [];
    Object.keys( allCardForm ).forEach( ( key ) => {
      const formData = allCardForm[key].getCardValues();
      const { List, deleteIds } = formData
      deleteIds.map( item => (
        deleteArr.push( item )
      ) )
      List.map( item => (
        prizes.push( { ...item } )
      ) )
    } )
    let wxShareData={}
    if( this.wxShareRef ){
      wxShareData = this.wxShareRef.getValues()
    }
    return {
      prizes,
      deleteIds: deleteArr.length === 0 ? [0] : deleteArr,
      ...wxShareData
    }
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  render() {
    const { list, errorFormList, currTab }= this.state;
    const { onPreview, data } = this.props;
    return (
      <Tabs defaultActiveKey="1" onChange={this.changeTab}>
        <TabPane tab={( <TabName name='抽奖结果' errorFormList={errorFormList} requiredList={[]} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
          <div>
            <Alert
              style={{ marginBottom: 15 }}
              className={styles.edit_alert}
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
                  <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` )}} style={{ color: '#1890FF', cursor:'pointer' }}>奖品管理</span>
                </div> )}
              banner
            />
            {list.map( ( card, index ) => {
                return <CardCom
                  key={card.key}
                  onRef={( ref ) => { this.allCardForm[`cardForm-${card.key}`] = ref }}
                  deleteDetail={() => { this.deleteDetail( card, card.key ) }}
                  detail={card}
                  cardIndex={index + 1}
                  isSpecial
                  onPreview={onPreview}
                  index={card.key}
                />
              }
            )}
            <div
              className={styles.edit_active_add}
              onClick={()=>{this.addDetail()}}
            >
              <Icon
                type="plus-circle"
                style={{ color:'#1890FF', fontSize:16, marginRight:10 }}
              />添加
            </div>
          </div>
        </TabPane>
        <TabPane tab='微信分享' key="2">
          <WxShare
            data={data}
            onRef={( wxShare ) => {this.wxShareRef = wxShare}}
            onPreview={onPreview}
          />
        </TabPane>
      </Tabs>
    );
  }
}

  export default ActiveModal;
  const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
    let isError = false;
    if ( errorFormList&&errorFormList.length && requiredList&&requiredList.length ){
      requiredList.forEach( item => {
        if ( !isError ){
          isError = errorFormList.includes( item )
        }

      } )
    }
    if ( isActive ) isError=false
    const style = isError? { color:'#f5222d' } : {}
    return (
      <div style={style} className={styles.edit_acitve_tab}>
        {name}
        {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
      </div>
    )
  }
