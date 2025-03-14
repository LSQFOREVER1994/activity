/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import _ from 'lodash'
import Loadable from 'react-loadable';
import loadableLoading from './loadableLoading';

const IMAGE = Loadable( {
  loader: () => import( './Image/index' ),
  loading: loadableLoading,
} );

const RICH_TEXT = Loadable( {
  loader: () => import( './RichText' ),
  loading: loadableLoading,
} )

const TASK = Loadable( {
  loader: () => import( './Task/index' ),
  loading: loadableLoading,
} );

const BANNER = Loadable( {
  loader: () => import( './Swiper/index' ),
  loading: loadableLoading,
} );

const MARQUEE = Loadable( {
  loader: () => import( './Marquee/index' ),
  loading: loadableLoading,
} );
const BIG_WHEEL = Loadable( {
  loader: () => import( './BigWheel/index' ),
  loading: loadableLoading,
} );


const TAB = Loadable( {
  loader: () => import( './Tab/index' ),
  loading: loadableLoading,
} );

const VIDEO = Loadable( {
  loader: () => import( './Video/index' ),
  loading: loadableLoading,
} );

const AUDIO = Loadable( {
  loader: () => import( './Audio/index' ),
  loading: loadableLoading,
} );

const MYSTERY_BOX = Loadable( {
  loader: () => import( './BlindBox/index' ),
  loading: loadableLoading,
} )

const MYSTERY_BOX_2 = Loadable( {
  loader: () => import( './BlindBox2/index' ),
  loading: loadableLoading,
} )

const SMASH_EGG = Loadable( {
  loader: () => import( './HitEgg/index' ),
  loading: loadableLoading,
} )

const ACTIVITY_SIGN = Loadable( {
  loader: () => import( './ActivitySign/index' ),
  loading: loadableLoading,
} )

const GUESS = Loadable( {
  loader: () => import( './Guess/index' ),
  loading:loadableLoading,
} )

const INVITE = Loadable( {
  loader: () => import( './Invite/index' ),
  loading: loadableLoading,
} )

const ANSWER = Loadable( {
  loader: () => import( './Answer/index' ),
  loading: loadableLoading,
} )

const FUNDS = Loadable( {
  loader: () => import( './FundCard/index' ),
  loading: loadableLoading,
} )

const ETF_ENROLL = Loadable( {
  loader: () => import( './ETFEnroll/index' ),
  loading: loadableLoading,
} );

const LIKE = Loadable( {
  loader: () => import( './Like' ),
  loading: loadableLoading,
} )

const QUESTIONNAIRE = Loadable( {
  loader: () => import( './QuestionNaire' ),
  loading: loadableLoading,
} )

const FLIP = Loadable( {
  loader:()=> import ( './FLIP/index' ),
  loading:loadableLoading
} )

const VOTING = Loadable( {
  loader: () => import( './Voting' ),
  loading: loadableLoading,
} )

const BIND_GROUP = Loadable( {
  loader: () => import( './BindGroup' ),
  loading: loadableLoading,
} )

const FLASH_SALE = Loadable( {
  loader: () => import( './FlashSale/index' ),
  loading: loadableLoading,
} )

export default {
  IMAGE,
  RICH_TEXT,
  TASK,
  BANNER,
  MARQUEE,
  BIG_WHEEL,
  TAB,
  VIDEO,
  AUDIO,
  MYSTERY_BOX,
  MYSTERY_BOX_2,
  SMASH_EGG,
  GUESS,
  ACTIVITY_SIGN,
  INVITE,
  ANSWER,
  FUNDS,
  ETF_ENROLL,
  LIKE,
  QUESTIONNAIRE,
  FLIP,
  VOTING,
  BIND_GROUP,
  FLASH_SALE
};


/**
 * 根据组件宽度缩放
 * @param {*} currentDom 当前组件的domCurrent
 * @param {*} domWidth 组件宽度
 * @param {*} width 设计稿宽度
 */
export function setScaleFunc( dom, domStyle ) {
  const { width, previewWidth = 750, height } = domStyle;
  const currentDom = dom;
  const scaleValue = ( width * 2 ) / previewWidth;
  currentDom.style.width = `calc(${( width * 2 ) / scaleValue} / 32 * 1rem)`;
  currentDom.style.height = `calc(${( height * 2 ) / scaleValue} / 32 * 1rem)`;
  currentDom.style.transform = `scale(${scaleValue})`;
  currentDom.style.transformOrigin = '0 0';
}

export function setPageListFunc( data={} ){
  const { componentData=[] } = data || {};
  let componentIds = [];
  const arr = componentData.map( ( item )=>{
    const domItemData = JSON.parse( JSON.stringify( item ) );
    if ( item.style && item.style.constructor === String ) {
      domItemData.style = JSON.parse( item.style );
    }
    if ( item.animations && item.animations.constructor === String ) {
      domItemData.animations = JSON.parse( item.animations );
    }
    if ( item.events[0]
        && item.events[0].params
        && item.events[0].params.constructor === String
    ) {
      domItemData.events[0].params = JSON.parse( item.events[0].params );
    }
    if ( item.type === "GROUP" ) {
      componentIds = [...item.propValue.componentIds.join( "-" ).split( "-" )];
      domItemData.propValue.componentIds = _.map(
        componentIds,
        ( comIdx ) => _.find( componentData, { id:comIdx } )
      );
      domItemData.propValue.componentIds.forEach( ( j ) => {
          if ( j && j.type !== "GROUP" ) {
            if ( j.style.constructor === String ) {
              j.style = JSON.parse( j.style );
            }
            if ( j.animations.constructor === String ) {
              j.animations = JSON.parse( j.animations );
            }
            if (
              j.events[0] &&
              j.events[0].params &&
              j.events[0].params.constructor === String
            ) {
              j.events[0].params = JSON.parse( j.events[0].params );
            }
          }
        }
      );
    }
    return domItemData
  } )
  componentIds.forEach( ( c )=>{
    arr.forEach( ( b, index )=>{
      if( c === b.id ) arr.splice( index, 1 );;
    } )
  } )
  return arr || [];
}
