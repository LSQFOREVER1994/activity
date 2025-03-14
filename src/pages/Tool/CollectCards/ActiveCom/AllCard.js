import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message,  } from 'antd';

import styles from '../../Lists.less';

import CardCom from './Card.com';

const time = () => new Date().getTime();

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  collectCardsSpecsObj: activity.collectCardsSpecsObj,
} ) )
class AllCard extends PureComponent {
  allCardForm = {}

  constructor( props ){
    super( props );
    this.state = {
      list: props.list && props.list.length ? props.list.map( ( card, index ) => ( { ...card, key:time()+index } ) ) : [],
      deleteIds:[],
      activityId: props.activityId
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
    let { deleteIds } = this.state;
    if ( detail.id ) deleteIds = deleteIds.concat( [detail.id] )
    const { allCardForm } = this;
    const lists = [];
    Object.keys( allCardForm ).forEach( ( key ) => {
      const formData = allCardForm[key].getValues();
      allCardForm[key].formReset();
      lists.push( formData );
    } )

    const newList = lists.filter( ( item ) => item && item.key !== index )
    delete this.allCardForm[`cardForm-${index}`];
    this.setState( { list: newList, deleteIds }, ()=>{
      this.props.onPreview()
    } );
  }

  getValues = () => {
    const { allCardForm } = this;
    const { deleteIds, activityId } = this.state;
    const list = [];
    Object.keys( allCardForm ).forEach( ( key ) => {
      const formData = allCardForm[key].getCardValues();
      list.push( { ...formData, isSpecial: true, activityId } );
    } )
    return {
      list,
      deleteIds
    }

  }

  getData = ( ) => {
    const { allCardForm } = this;
    const { deleteIds, activityId } = this.state;
    let haveError = false;
    Object.keys( allCardForm ).forEach( ( key ) => {
      if ( allCardForm[key].getFormError() ) haveError = true
    } )
    if ( haveError ) message.warning( '所集卡片正在配置中' )
      const list = [];
      Object.keys( allCardForm ).forEach( ( key ) => {
        const formData = allCardForm[key].getValues();
        list.push( { ...formData, isSpecial: true, activityId } );
      } )
    if ( list.length < 2 ){
      haveError = true;
      message.warning( '集卡至少配置2张卡片' )
    }
    if ( haveError ) return false;

    return {
      list,
      deleteIds
    }
  }

  render() {
    const { list }= this.state;
    console.log( 'list: ', list );
    const { max = 8, onPreview } = this.props;
    return (
      <div>
        {list.map( ( card, index ) => {
          return <CardCom
            key={card.key}
            onRef={( ref ) => { this.allCardForm[`cardForm-${card.key}`] = ref }}
            deleteDetail={() => { this.deleteDetail( card, card.key ) }}
            detail={card}
            cardIndex={index + 1}
            isSpecial
            onPreview={onPreview}
          /> 
        }
          
        )}
        <div
          className={styles.edit_active_add} 
          onClick={()=>{if( list.length <max ) this.addDetail()}}
        >
          <Icon 
            type="plus-circle" 
            style={{ color:'#1890FF', fontSize:16, marginRight:10 }}
          />添加卡片（{list.length}/{max}）
        </div>
      </div>
    );
  }
}

  export default AllCard;
